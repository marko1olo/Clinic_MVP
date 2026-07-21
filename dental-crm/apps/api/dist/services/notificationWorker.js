import { and, eq, lte } from "drizzle-orm";
import { db } from "../db/client.js";
import { communicationEvents, denteTelegramBotConfigs, denteTelegramChatLinks, outgoingNotifications, } from "../db/schema.js";
import { sendTelegramTextMessage } from "../telegramTransport.js";
export async function scheduleNotification(input) {
    await db.insert(outgoingNotifications).values({
        organizationId: input.organizationId,
        patientId: input.patientId,
        type: input.type,
        payload: input.payload,
        scheduledAt: input.scheduledAt ?? new Date(),
        status: "pending",
    });
}
// Neon styling for console
const colors = {
    reset: "\x1b[0m",
    neonGreen: "\x1b[38;2;57;255;20px\x1b[1m",
    neonBlue: "\x1b[38;2;0;255;255px\x1b[1m",
    gray: "\x1b[90m",
};
export async function processNotificationQueue(filterOrganizationId) {
    const summary = {
        processedCount: 0,
        sentCount: 0,
        failedCount: 0,
        emulatedCount: 0,
        processedIds: [],
    };
    try {
        const baseConditions = [
            eq(outgoingNotifications.status, "pending"),
            lte(outgoingNotifications.scheduledAt, new Date()),
        ];
        if (filterOrganizationId) {
            baseConditions.push(eq(outgoingNotifications.organizationId, filterOrganizationId));
        }
        const pending = await db
            .select()
            .from(outgoingNotifications)
            .where(and(...baseConditions))
            .limit(10);
        for (const notif of pending) {
            const messageText = String(notif.payload?.text ??
                JSON.stringify(notif.payload));
            let deliveryStatus = "sent";
            let failureReason = "";
            let isEmulated = false;
            // Try to find telegram link
            const chatLink = await db.query.denteTelegramChatLinks.findFirst({
                where: and(eq(denteTelegramChatLinks.subjectId, notif.patientId), eq(denteTelegramChatLinks.status, "active")),
            });
            if (chatLink && chatLink.chatTransportRef) {
                const botConfig = await db.query.denteTelegramBotConfigs.findFirst({
                    where: eq(denteTelegramBotConfigs.organizationId, notif.organizationId),
                });
                const token = process.env.DENTE_TELEGRAM_BOT_TOKEN ||
                    botConfig?.tokenSecretRef ||
                    undefined;
                if (token) {
                    const res = await sendTelegramTextMessage({
                        botToken: token,
                        chatId: chatLink.chatTransportRef,
                        text: messageText,
                    });
                    if (res.ok) {
                        deliveryStatus = "sent";
                        failureReason = "";
                    }
                    else {
                        deliveryStatus = "failed";
                        failureReason = `telegram_error: ${res.errorClass}`;
                    }
                }
                else {
                    deliveryStatus = "sent";
                    failureReason = "emulated: no telegram bot token configured";
                    isEmulated = true;
                }
            }
            else {
                deliveryStatus = "sent";
                failureReason = "emulated: patient not linked to telegram";
                isEmulated = true;
            }
            console.log(`\n${colors.gray}--- [OUTGOING MESSAGE GATEWAY] ---${colors.reset}`);
            console.log(`${colors.neonBlue}TO PATIENT:${colors.reset} ${notif.patientId}`);
            console.log(`${colors.neonGreen}TYPE:${colors.reset} ${notif.type}`);
            console.log(`${colors.neonGreen}MESSAGE:${colors.reset} ${messageText}`);
            console.log(`${colors.neonGreen}STATUS:${colors.reset} ${deliveryStatus} ${failureReason ? `(${failureReason})` : ""}`);
            console.log(`${colors.gray}----------------------------------${colors.reset}\n`);
            await db
                .update(outgoingNotifications)
                .set({
                status: deliveryStatus,
                sentAt: deliveryStatus === "sent" ? new Date() : null,
            })
                .where(eq(outgoingNotifications.id, notif.id));
            if (deliveryStatus === "sent") {
                await db.insert(communicationEvents).values({
                    organizationId: notif.organizationId,
                    patientId: notif.patientId,
                    channel: notif.payload?.channel || "telegram",
                    direction: "outbound",
                    status: "delivered",
                    message: messageText,
                });
            }
            summary.processedCount++;
            summary.processedIds.push(notif.id);
            if (deliveryStatus === "sent" && !isEmulated) {
                summary.sentCount++;
            }
            else if (deliveryStatus === "sent" && isEmulated) {
                summary.emulatedCount++;
            }
            else {
                summary.failedCount++;
            }
        }
    }
    catch (e) {
        console.error("Failed to process notification queue:", e);
    }
    return summary;
}
// In a real env, you would run setInterval(() => processNotificationQueue(), 60000)
// Exporting start worker
export function startNotificationWorker() {
    setInterval(() => {
        processNotificationQueue().catch(console.error);
    }, 10000); // 10s for fast demo feedback
}
