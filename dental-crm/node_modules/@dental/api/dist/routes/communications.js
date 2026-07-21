import { communicationTaskSchema, completeCommunicationTaskSchema, } from "@dental/shared";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { requireClinicalMutationAccess, resolveOrganizationId, } from "../accessGuard.js";
import { db } from "../db/client.js";
import { communicationAutomationRules, communicationEvents, communicationTasks, communicationTemplates, denteTelegramBotConfigs, outgoingNotifications, patients, } from "../db/schema.js";
import { triggerAutomationRules } from "../services/automationRulesEngine.js";
import { processNotificationQueue } from "../services/notificationWorker.js";
import { wsBroker } from "../services/websocketBroker.js";
const communicationTaskValidationMessage = "Задача связи не закрыта: выберите задачу, сотрудника и корректный исход действия.";
const communicationTaskNotFoundMessage = "Задача связи не закрыта: задача не найдена или уже недоступна.";
export async function registerCommunicationRoutes(app) {
    // Explicit manual trigger for processing notification queue (worker tick)
    // 🔒 Requires authenticated staff or clinic session — not an open route
    app.post("/api/communications/queue/tick", async (request, reply) => {
        // Must have a staff token header (resolveOrganizationId validates it fully)
        const staffHeader = request.headers["x-dente-staff-token"];
        const staffToken = Array.isArray(staffHeader) ? staffHeader[0] : staffHeader;
        if (!staffToken) {
            return reply.code(401).send({ error: "StaffAuthRequired", message: "Требуется авторизация сотрудника для ручного запуска очереди." });
        }
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const summary = await processNotificationQueue(organizationId);
        const pendingRows = await db
            .select({ cnt: sql `count(*)` })
            .from(outgoingNotifications)
            .where(and(eq(outgoingNotifications.organizationId, organizationId), eq(outgoingNotifications.status, "pending")));
        return reply.send({
            ok: true,
            message: "Notification queue tick completed",
            processedCount: summary.processedCount,
            sentCount: summary.sentCount,
            emulatedCount: summary.emulatedCount,
            failedCount: summary.failedCount,
            processedIds: summary.processedIds,
            remainingPending: Number(pendingRows[0]?.cnt ?? 0),
        });
    });
    // Complete a communication task
    app.post("/api/communications/tasks/complete", async (request, reply) => {
        if (!(await requireClinicalMutationAccess(request, reply, "communication task complete")))
            return;
        const parsedInput = completeCommunicationTaskSchema.safeParse(request.body);
        if (!parsedInput.success) {
            return reply.code(400).send({
                error: "CommunicationTaskValidationError",
                message: communicationTaskValidationMessage,
            });
        }
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
            const { completeCommunicationTask } = await import("../sampleData.js");
            try {
                const resultTask = completeCommunicationTask(parsedInput.data);
                return resultTask;
            }
            catch (e) {
                return reply.code(404).send({
                    error: "CommunicationTaskNotFound",
                    reason: "task_not_found",
                    message: communicationTaskNotFoundMessage,
                });
            }
        }
        try {
            const result = await db.transaction(async (tx) => {
                const [task] = await tx
                    .select()
                    .from(communicationTasks)
                    .where(and(eq(communicationTasks.id, parsedInput.data.taskId), eq(communicationTasks.organizationId, organizationId)))
                    .limit(1);
                if (!task) {
                    throw new Error("task_not_found");
                }
                const [updatedTask] = await tx
                    .update(communicationTasks)
                    .set({
                    status: parsedInput.data.outcome,
                    lastEventAt: new Date(),
                })
                    .where(and(eq(communicationTasks.id, task.id), eq(communicationTasks.organizationId, organizationId)))
                    .returning();
                await tx.insert(communicationEvents).values({
                    organizationId,
                    clinicId: task.clinicId,
                    taskId: task.id,
                    patientId: task.patientId,
                    actorUserId: parsedInput.data.actorUserId ?? null,
                    channel: task.channel,
                    direction: "outbound",
                    status: parsedInput.data.outcome,
                    message: parsedInput.data.note ??
                        `Задача закрыта со статусом ${parsedInput.data.outcome}`,
                });
                return updatedTask;
            });
            return communicationTaskSchema.parse(result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "task_not_found") {
                return reply.code(404).send({
                    error: "CommunicationTaskNotFound",
                    reason: "task_not_found",
                    message: communicationTaskNotFoundMessage,
                });
            }
            throw error;
        }
    });
    // Get inbox: latest message per patient, with unread count
    app.get("/api/communications/inbox", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        // Fetch all events ordered by latest
        const allEvents = await db
            .select({
            id: communicationEvents.id,
            patientId: communicationEvents.patientId,
            message: communicationEvents.message,
            channel: communicationEvents.channel,
            direction: communicationEvents.direction,
            createdAt: communicationEvents.createdAt,
            readAt: communicationEvents.readAt,
            patientName: patients.fullName,
            patientPhone: patients.phone,
        })
            .from(communicationEvents)
            .leftJoin(patients, eq(patients.id, communicationEvents.patientId))
            .where(eq(communicationEvents.organizationId, organizationId))
            .orderBy(desc(communicationEvents.createdAt));
        // Count unread inbound per patient
        const unreadCounts = await db
            .select({
            patientId: communicationEvents.patientId,
            unread: sql `count(*)`,
        })
            .from(communicationEvents)
            .where(and(eq(communicationEvents.organizationId, organizationId), eq(communicationEvents.direction, "inbound"), isNull(communicationEvents.readAt)))
            .groupBy(communicationEvents.patientId);
        const unreadMap = new Map(unreadCounts.map((r) => [r.patientId, Number(r.unread)]));
        // Group by patientId — latest message per chat
        const inboxMap = new Map();
        for (const event of allEvents) {
            if (!inboxMap.has(event.patientId)) {
                inboxMap.set(event.patientId, {
                    ...event,
                    unreadCount: unreadMap.get(event.patientId) ?? 0,
                });
            }
        }
        return Array.from(inboxMap.values());
    });
    // Get all messages for a patient and mark inbound as read
    app.get("/api/communications/inbox/:patientId", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const events = await db
            .select()
            .from(communicationEvents)
            .where(and(eq(communicationEvents.organizationId, organizationId), eq(communicationEvents.patientId, request.params.patientId)))
            .orderBy(communicationEvents.createdAt);
        // Mark all unread inbound messages as read
        await db
            .update(communicationEvents)
            .set({ readAt: new Date() })
            .where(and(eq(communicationEvents.organizationId, organizationId), eq(communicationEvents.patientId, request.params.patientId), eq(communicationEvents.direction, "inbound"), isNull(communicationEvents.readAt)));
        // Notify other clients that messages are now read
        wsBroker.broadcastToOrganization(organizationId, {
            type: "INBOX_MESSAGES_READ",
            payload: { patientId: request.params.patientId },
        });
        return events;
    });
    // Mark all messages from a patient as read (explicit endpoint)
    app.post("/api/communications/inbox/:patientId/read", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        await db
            .update(communicationEvents)
            .set({ readAt: new Date() })
            .where(and(eq(communicationEvents.organizationId, organizationId), eq(communicationEvents.patientId, request.params.patientId), eq(communicationEvents.direction, "inbound"), isNull(communicationEvents.readAt)));
        wsBroker.broadcastToOrganization(organizationId, {
            type: "INBOX_MESSAGES_READ",
            payload: { patientId: request.params.patientId },
        });
        return { ok: true };
    });
    // Send a message to a patient
    app.post("/api/communications/inbox/:patientId/send", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { message, channel } = request.body;
        if (!message || !channel)
            return reply
                .code(400)
                .send({ error: "Message and channel are required" });
        // Verify patient belongs to org
        const [patient] = await db
            .select({ id: patients.id, fullName: patients.fullName })
            .from(patients)
            .where(and(eq(patients.id, request.params.patientId), eq(patients.organizationId, organizationId)))
            .limit(1);
        if (!patient)
            return reply.code(404).send({ error: "PatientNotFound" });
        const [newEvent] = await db
            .insert(communicationEvents)
            .values({
            organizationId,
            patientId: request.params.patientId,
            message,
            channel,
            direction: "outbound",
            status: "delivered",
            readAt: new Date(), // outbound is always "read"
        })
            .returning();
        if (!newEvent) {
            return reply.code(500).send({ error: "Failed to save message" });
        }
        wsBroker.broadcastToOrganization(organizationId, {
            type: "INBOX_NEW_MESSAGE",
            payload: {
                id: newEvent.id,
                patientId: newEvent.patientId,
                patientName: patient.fullName,
                text: newEvent.message,
                channel: newEvent.channel,
                direction: "outbound",
                createdAt: newEvent.createdAt.toISOString(),
            },
        });
        return newEvent;
    });
    // Search patients to start new chat
    app.get("/api/communications/patients/search", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { q } = request.query;
        if (!q || q.trim().length < 2)
            return reply
                .code(400)
                .send({ error: "Query must be at least 2 characters" });
        const term = `%${q.trim().toLowerCase()}%`;
        const results = await db
            .select({
            id: patients.id,
            fullName: patients.fullName,
            phone: patients.phone,
        })
            .from(patients)
            .where(and(eq(patients.organizationId, organizationId), sql `(lower(${patients.fullName}) like ${term} or lower(${patients.phone}::text) like ${term})`))
            .limit(10);
        return results;
    });
    // Automated Trigger: Post-visit checkup & review request
    app.post("/api/communications/triggers/post-visit", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { patientId, visitId, topic } = request.body;
        if (!patientId)
            return reply.code(400).send({ error: "patientId is required" });
        const [patient] = await db
            .select({ id: patients.id, fullName: patients.fullName })
            .from(patients)
            .where(and(eq(patients.id, patientId), eq(patients.organizationId, organizationId)))
            .limit(1);
        if (!patient)
            return reply.code(404).send({ error: "PatientNotFound" });
        const topicLabel = topic ? `[${topic}] ` : "";
        const messageText = `Здравствуйте, ${patient.fullName}! ${topicLabel}Прошло 24 часа после вашего визита в клинику. Пожалуйста, оцените ваше самочувствие и дайте обратную связь.`;
        const [newEvent] = await db
            .insert(communicationEvents)
            .values({
            organizationId,
            patientId,
            message: messageText,
            channel: "telegram",
            direction: "outbound",
            status: "delivered",
            readAt: new Date(),
        })
            .returning();
        if (!newEvent) {
            return reply.code(500).send({ error: "Failed to create event" });
        }
        wsBroker.broadcastToOrganization(organizationId, {
            type: "INBOX_NEW_MESSAGE",
            payload: {
                id: newEvent.id,
                patientId: newEvent.patientId,
                patientName: patient.fullName,
                text: newEvent.message,
                channel: "telegram",
                direction: "outbound",
                createdAt: newEvent.createdAt.toISOString(),
            },
        });
        return reply.code(200).send({
            success: true,
            trigger: "post_visit_checkup",
            eventId: newEvent.id,
            deliveryStatus: "emulated_simulation",
            note: "Реальная отправка Telegram требует заполненного BOT_TOKEN в настройках",
        });
    });
    // External Lead Webhook Connector (Avito / Website / Direct Ad lead capture)
    app.post("/api/leads/webhook", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        // 🔒 HARDENED WEBHOOK SECURITY GATE: Check env or DB organization botConfig secret
        let expectedSecret = process.env.DENTE_WEBHOOK_SECRET || null;
        if (!expectedSecret) {
            const [botConfig] = await db
                .select({ webhookSecretRef: denteTelegramBotConfigs.webhookSecretRef })
                .from(denteTelegramBotConfigs)
                .where(eq(denteTelegramBotConfigs.organizationId, organizationId))
                .limit(1);
            if (botConfig?.webhookSecretRef) {
                expectedSecret = botConfig.webhookSecretRef;
            }
        }
        if (!expectedSecret) {
            return reply.code(503).send({
                code: "WebhookSecretNotConfigured",
                error: "Service Unavailable",
                message: "Секрет вебхука не настроен на сервере (задайте DENTE_WEBHOOK_SECRET в env или webhookSecretRef в БД)",
            });
        }
        const providedSecret = request.headers["x-webhook-secret"] || request.query.secret;
        if (!providedSecret || providedSecret !== expectedSecret) {
            return reply.code(401).send({
                error: "Unauthorized",
                message: "Неверный или отсутствующий секрет вебхука (X-Webhook-Secret)",
            });
        }
        const { name, phone, source, expectedRevenue, note } = request.body;
        if (!name || !phone) {
            return reply.code(400).send({ error: "name and phone are required" });
        }
        // Insert into crm_leads
        const { crmLeads } = await import("../db/schema.js");
        const [newLead] = await db
            .insert(crmLeads)
            .values({
            organizationId,
            name,
            phone,
            source: source?.trim() || "Авито / Внешний вебхук",
            status: "new",
            expectedRevenue: String(expectedRevenue || 15000),
        })
            .returning();
        if (!newLead) {
            return reply.code(500).send({ error: "Failed to create lead" });
        }
        return reply.code(200).send({
            success: true,
            leadId: newLead.id,
            source: newLead.source,
            status: newLead.status,
            expectedRevenueRub: Number(newLead.expectedRevenue),
            connectorMode: "live_webhook_ingestion",
        });
    });
    // --- MESSAGE TEMPLATES CRUD & VARIABLE SUBSTITUTION ENGINE ---
    // GET List Message Templates
    app.get("/api/communications/templates", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { communicationTemplates } = await import("../db/schema.js");
        const templatesList = await db
            .select()
            .from(communicationTemplates)
            .where(eq(communicationTemplates.organizationId, organizationId))
            .orderBy(communicationTemplates.title);
        return templatesList;
    });
    // POST Create Message Template
    app.post("/api/communications/templates", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { title, channel, intent, audienceRole, body: templateBody, variablesJson, } = request.body;
        if (!title || !templateBody) {
            return reply.code(400).send({ error: "title and body are required" });
        }
        const { communicationTemplates } = await import("../db/schema.js");
        const [newTemplate] = await db
            .insert(communicationTemplates)
            .values({
            organizationId,
            title,
            channel: channel || "telegram",
            intent: intent || "post_visit_instruction",
            audienceRole: audienceRole || "patient",
            body: templateBody,
            variablesJson: variablesJson || JSON.stringify(["[Имя]", "[Врач]", "[Дата]"]),
            isActive: true,
        })
            .returning();
        return reply.code(200).send(newTemplate);
    });
    // POST Render Template with Real Patient Data (Variable Substitution)
    app.post("/api/communications/templates/render", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { templateId, rawBody, patientId, doctorName, date } = request.body;
        if (!patientId)
            return reply.code(400).send({ error: "patientId is required" });
        // Fetch patient
        const [patient] = await db
            .select({ fullName: patients.fullName })
            .from(patients)
            .where(and(eq(patients.id, patientId), eq(patients.organizationId, organizationId)))
            .limit(1);
        let templateText = rawBody ||
            "Здравствуйте, [Имя]! Напоминаем о визите [Дата] к врачу [Врач].";
        if (templateId) {
            const { communicationTemplates } = await import("../db/schema.js");
            const [tpl] = await db
                .select()
                .from(communicationTemplates)
                .where(and(eq(communicationTemplates.id, templateId), eq(communicationTemplates.organizationId, organizationId)))
                .limit(1);
            if (tpl)
                templateText = tpl.body;
        }
        const renderedText = templateText
            .replace(/\[Имя\]|\{\{patientName\}\}/gi, patient?.fullName || "Уважаемый клиент")
            .replace(/\[Врач\]|\{\{doctorName\}\}/gi, doctorName || "Иванова М.С.")
            .replace(/\[Дата\]|\{\{date\}\}/gi, date || "завтра в 14:00");
        return {
            success: true,
            originalTemplate: templateText,
            renderedText,
            patientName: patient?.fullName || "Уважаемый клиент",
            doctorName: doctorName || "Иванова М.С.",
        };
    });
    // DELETE Message Template
    app.delete("/api/communications/templates/:id", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { communicationTemplates } = await import("../db/schema.js");
        await db
            .delete(communicationTemplates)
            .where(and(eq(communicationTemplates.id, request.params.id), eq(communicationTemplates.organizationId, organizationId)));
        return reply.code(200).send({ success: true });
    });
    // --- APPOINTMENT REMINDER AUTOMATION (Q3) ---
    // POST Schedule appointment reminder N hours before visit
    app.post("/api/communications/reminders/schedule", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { appointmentId, hoursBeforeAppointment = 24, customMessage, } = request.body;
        if (!appointmentId)
            return reply.code(400).send({ error: "appointmentId is required" });
        // Fetch appointment with patient name
        const { appointments } = await import("../db/schema.js");
        const [appt] = await db
            .select({
            id: appointments.id,
            startsAt: appointments.startsAt,
            patientId: appointments.patientId,
            patientName: patients.fullName,
        })
            .from(appointments)
            .leftJoin(patients, eq(appointments.patientId, patients.id))
            .where(and(eq(appointments.id, appointmentId), eq(appointments.organizationId, organizationId)))
            .limit(1);
        if (!appt)
            return reply.code(404).send({ error: "AppointmentNotFound" });
        if (!appt.patientId)
            return reply.code(400).send({ error: "AppointmentHasNoPatient" });
        const scheduledSendAt = new Date(new Date(appt.startsAt).getTime() -
            hoursBeforeAppointment * 60 * 60 * 1000);
        const startsAtFormatted = new Date(appt.startsAt).toLocaleString("ru-RU", {
            timeZone: "Europe/Moscow",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
        });
        const messageText = customMessage ||
            `[Напоминание] Уважаемый(ая) ${appt.patientName || "пациент"}! Напоминаем о вашем визите ${startsAtFormatted}. Просьба приходить вовремя.`;
        const [queued] = await db
            .insert(communicationEvents)
            .values({
            organizationId,
            patientId: appt.patientId,
            channel: "telegram",
            direction: "outbound",
            status: "queued",
            message: messageText,
        })
            .returning();
        return reply.code(200).send({
            success: true,
            eventId: queued?.id,
            appointmentId,
            scheduledSendAt: scheduledSendAt.toISOString(),
            hoursBeforeAppointment,
            patientName: appt.patientName,
            messagePreview: messageText,
        });
    });
    // GET List pending appointment reminders (queued outbound events)
    app.get("/api/communications/reminders/pending", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const pending = await db
            .select({
            id: communicationEvents.id,
            patientId: communicationEvents.patientId,
            patientName: patients.fullName,
            message: communicationEvents.message,
            channel: communicationEvents.channel,
            status: communicationEvents.status,
            createdAt: communicationEvents.createdAt,
        })
            .from(communicationEvents)
            .leftJoin(patients, eq(communicationEvents.patientId, patients.id))
            .where(and(eq(communicationEvents.organizationId, organizationId), eq(communicationEvents.direction, "outbound"), eq(communicationEvents.status, "queued")))
            .orderBy(desc(communicationEvents.createdAt))
            .limit(50);
        return pending;
    });
    // --- PATIENT BIRTHDAY AUTO-GREETING TRIGGER (Q5) ---
    app.post("/api/communications/birthdays/trigger", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { processBirthdayGreetings } = await import("../services/birthdayGreetingTrigger.js");
        const result = await processBirthdayGreetings({ organizationId });
        return reply.code(200).send({
            success: true,
            ...result,
        });
    });
    // --- AUTOMATION RULES REGISTRY (BLOCK A) ---
    app.get("/api/communications/automation-rules", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const rules = await db
            .select({
            id: communicationAutomationRules.id,
            organizationId: communicationAutomationRules.organizationId,
            clinicId: communicationAutomationRules.clinicId,
            name: communicationAutomationRules.name,
            eventTrigger: communicationAutomationRules.eventTrigger,
            templateId: communicationAutomationRules.templateId,
            channel: communicationAutomationRules.channel,
            delayMinutes: communicationAutomationRules.delayMinutes,
            isEnabled: communicationAutomationRules.isEnabled,
            createdAt: communicationAutomationRules.createdAt,
            templateTitle: communicationTemplates.title,
            templateBody: communicationTemplates.body,
        })
            .from(communicationAutomationRules)
            .leftJoin(communicationTemplates, eq(communicationAutomationRules.templateId, communicationTemplates.id))
            .where(eq(communicationAutomationRules.organizationId, organizationId))
            .orderBy(desc(communicationAutomationRules.createdAt));
        return rules;
    });
    app.post("/api/communications/automation-rules", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { id, name, eventTrigger, templateId, channel, delayMinutes, isEnabled, } = request.body;
        if (!name || !eventTrigger) {
            return reply
                .code(400)
                .send({ error: "name and eventTrigger are required" });
        }
        if (id) {
            const [updated] = await db
                .update(communicationAutomationRules)
                .set({
                name,
                eventTrigger,
                templateId: templateId || null,
                channel: channel || "telegram",
                delayMinutes: delayMinutes ?? 0,
                isEnabled: isEnabled ?? true,
                updatedAt: new Date(),
            })
                .where(and(eq(communicationAutomationRules.id, id), eq(communicationAutomationRules.organizationId, organizationId)))
                .returning();
            return reply.code(200).send({ rule: updated });
        }
        const [created] = await db
            .insert(communicationAutomationRules)
            .values({
            organizationId,
            name,
            eventTrigger,
            templateId: templateId || null,
            channel: channel || "telegram",
            delayMinutes: delayMinutes ?? 0,
            isEnabled: isEnabled ?? true,
        })
            .returning();
        return reply.code(201).send({ rule: created });
    });
    app.delete("/api/communications/automation-rules/:id", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { id } = request.params;
        await db
            .delete(communicationAutomationRules)
            .where(and(eq(communicationAutomationRules.id, id), eq(communicationAutomationRules.organizationId, organizationId)));
        return reply.code(200).send({ success: true });
    });
    // --- INBOUND MESSAGES ENGINE (BLOCK B) ---
    app.post("/api/communications/inbound", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { channel, from, message, patientId: inputPatientId, source, } = request.body;
        if (!message || !from) {
            return reply.code(400).send({ error: "from and message are required" });
        }
        let matchedPatientId = inputPatientId || null;
        if (!matchedPatientId) {
            const cleanPhone = from.replace(/\D/g, "").slice(-10);
            const orgPatients = await db
                .select({ id: patients.id, phone: patients.phone })
                .from(patients)
                .where(eq(patients.organizationId, organizationId));
            if (cleanPhone) {
                const match = orgPatients.find((p) => p.phone?.replace(/\D/g, "").includes(cleanPhone));
                if (match)
                    matchedPatientId = match.id;
            }
            if (!matchedPatientId && orgPatients[0]) {
                matchedPatientId = orgPatients[0].id;
            }
        }
        if (!matchedPatientId) {
            return reply
                .code(400)
                .send({ error: "No patient available for organization" });
        }
        const [inboundEvent] = await db
            .insert(communicationEvents)
            .values({
            organizationId,
            patientId: matchedPatientId,
            channel: channel || "telegram",
            direction: "inbound",
            status: "delivered",
            message: `[Входящее: ${source || "emulated_inbound"}] ${message}`,
        })
            .returning();
        const lowerMsg = message.toLowerCase();
        const isCancelOrReschedule = lowerMsg.includes("отмени") ||
            lowerMsg.includes("перенес") ||
            lowerMsg.includes("не смогу") ||
            lowerMsg.includes("отказ");
        const taskIntent = isCancelOrReschedule ? "recall" : "general";
        const taskTitle = isCancelOrReschedule
            ? `[ВХОДЯЩЕЕ] Запрос на отмену/перенос от ${from}`
            : `[ВХОДЯЩЕЕ] Сообщение от пациента (${from})`;
        const [createdTask] = await db
            .insert(communicationTasks)
            .values({
            organizationId,
            patientId: matchedPatientId,
            assignedRole: "administrator",
            intent: taskIntent,
            channel: channel || "telegram",
            priority: isCancelOrReschedule ? "urgent" : "normal",
            status: "queued",
            dueAt: new Date(Date.now() + 30 * 60 * 1000),
            title: taskTitle,
            body: message,
        })
            .returning();
        return reply.code(200).send({
            success: true,
            source: source || "emulated_inbound",
            event: inboundEvent,
            task: createdTask,
            routedTo: "administrator",
            intent: taskIntent,
        });
    });
    // --- AUTOMATION LOG: лог срабатываний для конкретного правила (БЛОК UI 5.1) ---
    app.get("/api/communications/automation-rules/:id/log", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { id: ruleId } = request.params;
        const limit = Math.min(Number(request.query.limit) || 50, 200);
        // Все уведомления, созданные этим правилом (ruleId в jsonb payload)
        const rows = await db
            .select()
            .from(outgoingNotifications)
            .where(and(eq(outgoingNotifications.organizationId, organizationId), sql `payload->>'ruleId' = ${ruleId}`))
            .orderBy(desc(outgoingNotifications.createdAt))
            .limit(limit);
        return reply.code(200).send({ log: rows });
    });
    // --- QUEUE PROCESSOR: ручной запуск обработчика очереди (БЛОК B 4.2) ---
    app.post("/api/communications/notifications/process", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        try {
            const summary = await processNotificationQueue(organizationId);
            return reply
                .code(200)
                .send({ success: true, message: "Queue processed", ...summary });
        }
        catch (e) {
            console.error("[QueueProcessor Endpoint] Error:", e);
            return reply.code(500).send({
                error: "QueueProcessorError",
                message: e.message,
                stack: e.stack,
            });
        }
    });
    // --- AUTOMATION OBSERVABILITY: live metrics overview for owner dashboard ---
    app.get("/api/communications/automation/overview", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        // Rules breakdown
        const allRules = await db
            .select({
            id: communicationAutomationRules.id,
            name: communicationAutomationRules.name,
            eventTrigger: communicationAutomationRules.eventTrigger,
            channel: communicationAutomationRules.channel,
            isEnabled: communicationAutomationRules.isEnabled,
            createdAt: communicationAutomationRules.createdAt,
        })
            .from(communicationAutomationRules)
            .where(eq(communicationAutomationRules.organizationId, organizationId));
        const enabledCount = allRules.filter((r) => r.isEnabled).length;
        const disabledCount = allRules.length - enabledCount;
        // Group by trigger
        const byTrigger = {};
        for (const rule of allRules) {
            if (!byTrigger[rule.eventTrigger]) {
                byTrigger[rule.eventTrigger] = { enabled: 0, disabled: 0 };
            }
            if (rule.isEnabled) {
                byTrigger[rule.eventTrigger].enabled++;
            }
            else {
                byTrigger[rule.eventTrigger].disabled++;
            }
        }
        // Notification queue counts
        const queueCounts = await db
            .select({
            status: outgoingNotifications.status,
            cnt: sql `count(*)`,
        })
            .from(outgoingNotifications)
            .where(eq(outgoingNotifications.organizationId, organizationId))
            .groupBy(outgoingNotifications.status);
        const queueMap = {};
        for (const row of queueCounts) {
            queueMap[row.status] = Number(row.cnt);
        }
        // Latest 10 outgoing notifications for the activity feed with patient names
        const recentNotifications = await db
            .select({
            id: outgoingNotifications.id,
            type: outgoingNotifications.type,
            status: outgoingNotifications.status,
            patientId: outgoingNotifications.patientId,
            patientName: patients.fullName,
            scheduledAt: outgoingNotifications.scheduledAt,
            sentAt: outgoingNotifications.sentAt,
            createdAt: outgoingNotifications.createdAt,
            payload: outgoingNotifications.payload,
        })
            .from(outgoingNotifications)
            .leftJoin(patients, eq(outgoingNotifications.patientId, patients.id))
            .where(eq(outgoingNotifications.organizationId, organizationId))
            .orderBy(desc(outgoingNotifications.createdAt))
            .limit(10);
        // Last triggered at per trigger type (from most recent notification per event type)
        const lastTriggeredByType = {};
        for (const notif of recentNotifications) {
            if (!lastTriggeredByType[notif.type]) {
                lastTriggeredByType[notif.type] = notif.createdAt?.toISOString() ?? null;
            }
        }
        return reply.send({
            ok: true,
            rules: {
                total: allRules.length,
                enabled: enabledCount,
                disabled: disabledCount,
                byTrigger,
            },
            queue: {
                pending: queueMap["pending"] ?? 0,
                sent: queueMap["sent"] ?? 0,
                emulated_sent: queueMap["emulated_sent"] ?? 0,
                failed: queueMap["failed"] ?? 0,
            },
            lastTriggeredByType,
            recentActivity: recentNotifications.map((n) => ({
                id: n.id,
                type: n.type,
                status: n.status,
                patientId: n.patientId,
                patientName: n.patientName || "Неизвестный пациент",
                channel: n.payload?.channel ?? "telegram",
                isEmulated: n.status === "sent" && !n.payload?.realDelivery,
                scheduledAt: n.scheduledAt?.toISOString() ?? null,
                sentAt: n.sentAt?.toISOString() ?? null,
                createdAt: n.createdAt?.toISOString() ?? null,
            })),
        });
    });
    app.post("/api/communications/automation-rules/test-trigger", async (request, reply) => {
        const organizationId = await resolveOrganizationId(request);
        if (!organizationId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        const { eventTrigger, patientId, doctorName, dateText, visitId, appointmentId } = request.body;
        if (!eventTrigger || !patientId) {
            return reply
                .code(400)
                .send({ error: "eventTrigger and patientId required" });
        }
        await triggerAutomationRules(organizationId, eventTrigger, patientId, { doctorName, dateText, visitId, appointmentId });
        // Сразу проверяем, что появилось в очереди
        const queued = await db
            .select()
            .from(outgoingNotifications)
            .where(and(eq(outgoingNotifications.organizationId, organizationId), eq(outgoingNotifications.type, eventTrigger), eq(outgoingNotifications.status, "pending")))
            .orderBy(desc(outgoingNotifications.createdAt))
            .limit(10);
        return reply.code(200).send({
            success: true,
            triggeredEvent: eventTrigger,
            queuedNotifications: queued,
        });
    });
}
