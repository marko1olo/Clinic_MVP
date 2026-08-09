import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { communicationTasks, patients, treatmentPlanItemsNew, treatmentPlans, } from "../db/schema.js";
function buildRecallTask(item, now) {
    if (!item.toothNumber)
        return null;
    // Без даты плана срок приживления не отсчитать. Раньше здесь было
    // new Date(item.itemDate) при itemDate === null, что даёт 1 января
    // 1970 года: условие now >= healingDate выполнялось всегда, и на
    // каждый имплант без даты создавалась задача «пригласить на 3-й
    // этап», хотя приживление ещё не прошло.
    if (!item.itemDate)
        return null;
    const isUpperJaw = item.toothNumber < 30;
    const healingMonths = isUpperJaw ? 6 : 3;
    const healingDate = addCalendarMonths(new Date(item.itemDate), healingMonths);
    if (now >= healingDate) {
        return {
            id: randomUUID(),
            organizationId: item.organizationId,
            patientId: item.patientId,
            assignedRole: "admin",
            channel: "whatsapp",
            intent: "recall",
            status: "queued",
            priority: "high",
            dueAt: new Date(Date.now() + 86400000),
            title: `Пригласить пациента на 3-й этап (зуб ${item.toothNumber})`,
            body: `Пациент: ${item.patientFullName}. Прошло необходимое время приживления. План: ${item.planName}.`,
        };
    }
    return null;
}
export function addCalendarMonths(from, months) {
    const shifted = new Date(from.getTime());
    if (Number.isNaN(shifted.getTime()))
        return shifted;
    // Первое число целевого месяца: с него переполнение невозможно.
    shifted.setDate(1);
    shifted.setMonth(shifted.getMonth() + months);
    // День 0 следующего месяца — последний день целевого.
    const lastDayOfTargetMonth = new Date(shifted.getFullYear(), shifted.getMonth() + 1, 0).getDate();
    shifted.setDate(Math.min(from.getDate(), lastDayOfTargetMonth));
    return shifted;
}
// biome-ignore lint/complexity/noStaticOnlyClass: automated suppression
export class RecallScheduler {
    /**
     * Run this periodically (e.g., via node-cron or setInterval)
     * Scans for completed surgical phases and triggers recall if the waiting period is over.
     */
    static async processOsteointegrationRecalls() {
        console.log("[RecallScheduler] Scanning for osteointegration recalls...");
        try {
            const readyForCrown = await db
                .select({
                patientId: treatmentPlans.patientId,
                planName: treatmentPlans.name,
                planId: treatmentPlans.id,
                toothNumber: treatmentPlanItemsNew.toothNumber,
                itemDate: treatmentPlans.updatedAt,
                patientFullName: patients.fullName,
                organizationId: patients.organizationId,
            })
                .from(treatmentPlanItemsNew)
                .innerJoin(treatmentPlans, eq(treatmentPlans.id, treatmentPlanItemsNew.planId))
                .innerJoin(patients, eq(patients.id, treatmentPlans.patientId))
                .where(and(eq(treatmentPlanItemsNew.phase, 2)));
            const tasksToInsert = [];
            const now = new Date();
            for (const item of readyForCrown) {
                const task = buildRecallTask(item, now);
                if (task) {
                    tasksToInsert.push(task);
                }
            }
            if (tasksToInsert.length > 0) {
                await db.insert(communicationTasks).values(tasksToInsert);
                console.log(`[RecallScheduler] Created ${tasksToInsert.length} recall tasks for admin.`);
            }
            // biome-ignore lint/suspicious/noExplicitAny: automated suppression
        }
        catch (e) {
            console.warn("[RecallScheduler notice]:", e?.message || e);
        }
    }
}
