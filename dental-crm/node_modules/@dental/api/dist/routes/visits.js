import { acceptVisitDraftResponseSchema, acceptVisitDraftSchema, visitDraftAutosaveRequestSchema, visitDraftAutosaveResponseSchema, } from "@dental/shared";
import { requireResolvedOrganizationId, requireResolvedStaffOrAdminOrganizationId, } from "../accessGuard.js";
import { saveVisitSignatureInDb } from "../db/visitsQuery.js";
const visitDraftAutosaveValidationMessage = "Черновик приема не сохранен: передайте пациента, специальность, текст приема или заполненные поля черновика.";
const visitDraftAcceptValidationMessage = "Черновик приема не принят: передайте текст приема, заполненные поля черновика и данные сохранения врача.";
const visitDraftNotFoundMessage = "Прием не найден. Обновите рабочий экран и выберите актуальный прием.";
const visitDraftAutosaveClosedMessage = "Черновик приема не сохранен: этот прием уже недоступен для изменений.";
const visitDraftAcceptClosedMessage = "Черновик приема не принят: этот прием уже недоступен для изменений.";
const visitDraftMutationRejectedMessage = "Черновик приема не изменен: обновите прием и повторите действие.";
function visitRequestBody(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
}
function parseVisitPayload(schema, value, message, reply) {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
        reply.code(400).send({ error: "VisitDraftValidationError", message });
        return null;
    }
    return parsed.data;
}
function visitDraftDomainMessage(error) {
    if (!(error instanceof Error))
        return "";
    return error.message.trim();
}
function sendVisitDraftMutationError(error, reply, operation) {
    const message = visitDraftDomainMessage(error);
    if (message === "Визит не найден") {
        return reply.code(404).send({
            error: "VisitNotFound",
            reason: "visit_not_found",
            message: visitDraftNotFoundMessage,
        });
    }
    if (message === "Прием уже закрыт или аннулирован") {
        return reply.code(409).send({
            error: "VisitDraftMutationRejected",
            reason: "visit_closed",
            message: operation === "accept"
                ? visitDraftAcceptClosedMessage
                : visitDraftAutosaveClosedMessage,
        });
    }
    if (message.startsWith("Недостаточно материалов") ||
        message.startsWith("Конфликт версий")) {
        return reply.code(409).send({
            error: "VisitDraftMutationRejected",
            reason: "visit_draft_rejected",
            message,
        });
    }
    return reply.code(409).send({
        error: "VisitDraftMutationRejected",
        reason: "visit_draft_rejected",
        message: visitDraftMutationRejectedMessage,
    });
}
import { dashboardSchema } from "@dental/shared";
import { db } from "../db/client.js";
import { getDashboardFromDb } from "../db/dashboardQuery.js";
import { createPatientInDb } from "../db/patientsQuery.js";
import { appointments } from "../db/schema.js";
import * as schema from "../db/schema.js";
import { eq, and, ne } from "drizzle-orm";
import { acceptVisitDraftInDb, getVisitDraftAutosaveFromDb, getVisitGnathologyFromDb, upsertVisitDraftAutosaveInDb, upsertVisitGnathologyInDb, } from "../db/visitsQuery.js";
import { wsBroker } from "../services/websocketBroker.js";
import { evaluateClinicalRulesInDb } from "../db/clinicalQuery.js";
async function buildHonestVisitCloseChecklist(visitId, orgId) {
    // 1. Fetch visit record
    const [visit] = await db
        .select()
        .from(schema.visits)
        .where(and(eq(schema.visits.id, visitId), eq(schema.visits.organizationId, orgId)))
        .limit(1);
    if (!visit) {
        throw new Error("Визит не найден");
    }
    // 2. Fetch treatment items for this visit
    const activeVisitItems = await db
        .select()
        .from(schema.treatmentItems)
        .where(and(eq(schema.treatmentItems.visitId, visitId), eq(schema.treatmentItems.organizationId, orgId)));
    // 3. Fetch completed treatment items for patient
    const patientCompletedItems = await db
        .select()
        .from(schema.treatmentItems)
        .where(and(eq(schema.treatmentItems.patientId, visit.patientId), eq(schema.treatmentItems.organizationId, orgId), eq(schema.treatmentItems.status, "completed")));
    // 4. Fetch generated documents for this visit
    const docs = await db
        .select()
        .from(schema.generatedDocuments)
        .where(and(eq(schema.generatedDocuments.visitId, visitId), eq(schema.generatedDocuments.organizationId, orgId), ne(schema.generatedDocuments.status, "voided")));
    // 5. Fetch imaging studies for this visit
    const images = await db
        .select()
        .from(schema.imagingStudies)
        .where(and(eq(schema.imagingStudies.visitId, visitId), eq(schema.imagingStudies.organizationId, orgId)));
    // 6. Fetch AI jobs for this visit
    const jobs = await db
        .select()
        .from(schema.aiJobs)
        .where(and(eq(schema.aiJobs.visitId, visitId), eq(schema.aiJobs.organizationId, orgId), eq(schema.aiJobs.target, "visit_note")));
    // 7. Fetch payments for this visit
    const visitPayments = await db
        .select()
        .from(schema.payments)
        .where(and(eq(schema.payments.visitId, visitId), eq(schema.payments.organizationId, orgId), eq(schema.payments.status, "paid")));
    // 8. Fetch communication tasks for this visit
    const commTasks = await db
        .select()
        .from(schema.communicationTasks)
        .where(and(eq(schema.communicationTasks.visitId, visitId), eq(schema.communicationTasks.organizationId, orgId)));
    // 9. Build checklist items
    const items = [];
    // Item 1: ЭМК заполнена
    const visitNoteReady = Boolean(visit.complaint &&
        visit.objectiveStatus &&
        visit.diagnosis &&
        visit.treatmentPlan);
    items.push({
        id: "visit-note",
        visitId,
        title: "ЭМК заполнена",
        detail: visitNoteReady
            ? "Жалобы, статус, диагноз и план готовы к подписи."
            : "Заполните жалобы, объективный статус, диагноз и план лечения.",
        ready: visitNoteReady,
        blocking: true,
        ownerRole: "doctor",
        section: "visit",
        actionLabel: "Проверить запись",
    });
    // Item 2: Клинические предупреждения
    const serviceIds = activeVisitItems
        .map((item) => item.serviceId)
        .filter((id) => Boolean(id));
    const completedServiceIds = patientCompletedItems
        .map((item) => item.serviceId)
        .filter((id) => Boolean(id));
    let clinicalBlockers = 0;
    let clinicalWarnings = 0;
    let clinicalUnresolved = 0;
    if (serviceIds.length > 0) {
        const evaluationResponse = await evaluateClinicalRulesInDb(orgId, {
            patientId: visit.patientId,
            serviceIds,
            completedServiceIds,
        });
        clinicalBlockers = evaluationResponse.summary.blockers;
        clinicalWarnings = evaluationResponse.summary.warnings;
        clinicalUnresolved = evaluationResponse.summary.unresolved;
    }
    items.push({
        id: "clinical-rules",
        visitId,
        title: "Клинические предупреждения",
        detail: clinicalUnresolved
            ? `${clinicalUnresolved} правил требуют внимания, важных предупреждений ${clinicalBlockers}.`
            : "Бандлы, ограничения и предупреждения закрыты.",
        ready: clinicalBlockers === 0,
        blocking: clinicalBlockers > 0,
        ownerRole: "doctor",
        section: "visit",
        actionLabel: clinicalBlockers > 0 ? "Проверить предупреждения" : "Посмотреть правила",
    });
    // Item 3: Снимки проверены
    const reviewImages = images.filter((study) => study.status === "needs_review");
    items.push({
        id: "imaging-review",
        visitId,
        title: "Снимки проверены",
        detail: reviewImages.length
            ? `${reviewImages.length} снимок требует врачебной проверки перед закрытием.`
            : images.length
                ? "Снимки связаны с приемом и не ждут проверки."
                : "К приему не прикреплены снимки.",
        ready: reviewImages.length === 0,
        blocking: reviewImages.length > 0,
        ownerRole: "doctor",
        section: "visit",
        actionLabel: "Открыть снимки",
    });
    // Item 4: Документы готовы
    const requiredDocumentKinds = [
        "paid_medical_services_contract",
        "informed_consent",
        "completed_works_act",
    ];
    const missingDocumentKinds = requiredDocumentKinds.filter((kind) => !docs.some((doc) => doc.kind === kind));
    items.push({
        id: "legal-documents",
        visitId,
        title: "Документы готовы",
        detail: missingDocumentKinds.length
            ? `Не хватает документов: ${missingDocumentKinds.length}.`
            : "Договор, согласие и акт привязаны к приему.",
        ready: missingDocumentKinds.length === 0,
        blocking: missingDocumentKinds.length > 0,
        ownerRole: "administrator",
        section: "documents",
        actionLabel: "Собрать документы",
    });
    // Item 5: AI-черновик проверен
    const hasReviewedAiDraft = jobs.some((job) => job.status === "accepted" || job.status === "needs_review");
    items.push({
        id: "ai-draft-review",
        visitId,
        title: "AI-черновик проверен",
        detail: hasReviewedAiDraft
            ? "AI-черновик уже прошел врачебный контроль."
            : "AI не подписывает прием: врач сверяет текст вручную.",
        ready: hasReviewedAiDraft,
        blocking: false,
        ownerRole: "doctor",
        section: "visit",
        actionLabel: "Сверить черновик",
    });
    // Item 6: Оплата связана
    const totalInvoiceRub = activeVisitItems.reduce((sum, item) => sum + Number(item.priceRub) * Number(item.quantity), 0);
    const totalPaidRub = visitPayments.reduce((sum, payment) => sum + payment.amountRub, 0);
    const totalDueRub = Math.max(0, totalInvoiceRub - totalPaidRub);
    items.push({
        id: "payment-link",
        visitId,
        title: "Оплата связана",
        detail: totalDueRub > 0
            ? `Остаток по плану ${totalDueRub.toLocaleString("ru-RU")} ₽.`
            : "Оплата закрыта или не требуется.",
        ready: totalDueRub === 0,
        blocking: false,
        ownerRole: "administrator",
        section: "finance",
        actionLabel: "Проверить оплату",
    });
    // Item 7: Рекомендации пациенту
    const postVisitInstruction = commTasks.find((task) => task.intent === "post_visit_instruction");
    const postVisitInstructionReady = postVisitInstruction?.status === "completed" ||
        postVisitInstruction?.status === "sent";
    items.push({
        id: "post-visit-instructions",
        visitId,
        title: "Рекомендации пациенту",
        detail: postVisitInstructionReady
            ? "Пациент получил рекомендации после приема."
            : "Ассистенту нужно отправить короткую памятку после лечения.",
        ready: Boolean(postVisitInstructionReady),
        blocking: false,
        ownerRole: "assistant",
        section: "communications",
        actionLabel: "Отправить памятку",
    });
    // Calculate scores
    const readyItems = items.filter((item) => item.ready).length;
    const firstOpenBlocking = items.find((item) => item.blocking && !item.ready);
    const firstOpenOptional = items.find((item) => !item.ready);
    const blockingItems = items.filter((item) => item.blocking && !item.ready).length;
    return {
        visitId,
        readyToSign: blockingItems === 0,
        score: Math.round((readyItems / items.length) * 100),
        nextAction: firstOpenBlocking?.actionLabel ??
            firstOpenOptional?.actionLabel ??
            "Можно подписывать прием",
        blockingItems,
        items,
    };
}
export async function registerVisitRoutes(app) {
    app.get("/api/visits/:visitId/draft/autosave", async (request, reply) => {
        const orgId = await requireResolvedOrganizationId(request, reply, "visit draft autosave read");
        if (!orgId)
            return;
        const { visitId } = request.params;
        // Zero UUID = placeholder for "no active visit" — return empty 200, not 404
        if (!visitId || visitId === "00000000-0000-0000-0000-000000000000") {
            return visitDraftAutosaveResponseSchema.parse({ serverDraft: null });
        }
        const draft = await getVisitDraftAutosaveFromDb(orgId, visitId);
        if (!draft)
            return reply
                .code(404)
                .send({ error: "VisitNotFound", message: visitDraftNotFoundMessage });
        return visitDraftAutosaveResponseSchema.parse({ serverDraft: draft });
    });
    app.put("/api/visits/:visitId/draft/autosave", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "visit draft autosave update");
        if (!orgId)
            return;
        const { visitId } = request.params;
        const input = parseVisitPayload(visitDraftAutosaveRequestSchema, { ...visitRequestBody(request.body), visitId }, visitDraftAutosaveValidationMessage, reply);
        if (!input)
            return;
        try {
            const serverDraft = await upsertVisitDraftAutosaveInDb(orgId, input);
            return visitDraftAutosaveResponseSchema.parse({ serverDraft });
        }
        catch (error) {
            return sendVisitDraftMutationError(error, reply, "autosave");
        }
    });
    app.post("/api/visits/:visitId/draft/accept", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "visit draft accept");
        if (!orgId)
            return;
        const { visitId } = request.params;
        const input = parseVisitPayload(acceptVisitDraftSchema, { ...visitRequestBody(request.body), visitId }, visitDraftAcceptValidationMessage, reply);
        if (!input)
            return;
        try {
            const userContext = request.user;
            const userId = userContext?.id ?? null;
            const result = await acceptVisitDraftInDb(orgId, userId, input);
            const [visitRecord] = await db
                .select()
                .from(schema.visits)
                .where(eq(schema.visits.id, result.acceptedVisitId))
                .limit(1);
            if (!visitRecord) {
                throw new Error("Сохраненный визит не найден в БД");
            }
            const [diaryRecord] = await db
                .select()
                .from(schema.visitDiaries)
                .where(eq(schema.visitDiaries.visitId, result.acceptedVisitId))
                .limit(1);
            const visitPayload = {
                ...visitRecord,
                createdAt: visitRecord.createdAt.toISOString(),
                updatedAt: visitRecord.updatedAt.toISOString(),
                signedAt: visitRecord.signedAt ? visitRecord.signedAt.toISOString() : null,
                diary: diaryRecord
                    ? {
                        id: diaryRecord.id,
                        complications: diaryRecord.complications || null,
                        comorbidities: diaryRecord.comorbidities || null,
                    }
                    : null,
            };
            const visitCloseChecklist = await buildHonestVisitCloseChecklist(result.acceptedVisitId, orgId);
            const responsePayload = {
                visit: visitPayload,
                visitCloseChecklist,
                saveReceipt: {
                    visitId: result.acceptedVisitId,
                    clientMutationId: input.clientMutationId || null,
                    status: "accepted",
                    serverRevision: result.newRevision,
                    savedAt: new Date().toISOString(),
                    warning: null,
                },
            };
            const dashboard = await getDashboardFromDb(orgId);
            wsBroker.broadcastToOrganization(orgId, {
                type: "UPDATE_CALENDAR",
                payload: dashboardSchema.parse(dashboard),
            });
            return acceptVisitDraftResponseSchema.parse(responsePayload);
        }
        catch (error) {
            app.log.error(error, `[AcceptVisitDraft] Route error: ${error?.message || String(error)}`);
            return sendVisitDraftMutationError(error, reply, "accept");
        }
    });
    app.post("/api/visits/quick", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "quick consult");
        if (!orgId)
            return;
        try {
            const userContext = request.user;
            const userId = userContext?.id ?? null;
            // Fallback to a zero-UUID or just null if your DB requires a valid user
            // Ideally, doctorUserId should be userId
            const finalDoctorId = userId || "00000000-0000-0000-0000-000000000000";
            const uniqueSuffix = Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();
            const patient = await createPatientInDb(orgId, {
                fullName: `Быстрый прием (${uniqueSuffix})`,
                birthDate: null,
                phone: null,
            });
            const startsAt = new Date();
            const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
            const [appointment] = await db
                .insert(appointments)
                .values({
                organizationId: orgId,
                patientId: patient.id,
                doctorUserId: finalDoctorId,
                status: "in_treatment",
                startsAt,
                endsAt,
                reason: "Быстрый прием (без паспорта)",
            })
                .returning();
            if (!appointment) {
                return reply.code(500).send({ error: "Failed to create appointment" });
            }
            const dashboard = await getDashboardFromDb(orgId);
            wsBroker.broadcastToOrganization(orgId, {
                type: "UPDATE_CALENDAR",
                payload: dashboardSchema.parse(dashboard),
            });
            return reply.code(201).send({
                patientId: patient.id,
                appointmentId: appointment.id,
            });
        }
        catch (error) {
            console.error("[QuickConsult] Error:", error);
            return reply.code(500).send({ error: "QuickConsultFailed" });
        }
    });
    app.post("/api/visits/:visitId/draft/sign", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "visit sign");
        if (!orgId)
            return;
        const { visitId } = request.params;
        const payload = request.body;
        if (!payload.signatureBase64 ||
            !payload.thumbprint ||
            !payload.signatureProvider) {
            return reply.code(400).send({ error: "Missing signature payload data" });
        }
        try {
            const userContext = request.user;
            const userId = userContext?.id ?? "00000000-0000-0000-0000-000000000000";
            await saveVisitSignatureInDb({
                visitId,
                doctorId: userId,
                patientId: payload.patientId, // Passed from frontend for linking
                signatureBase64: payload.signatureBase64,
                thumbprint: payload.thumbprint,
                signatureProvider: payload.signatureProvider,
            });
            return reply.send({ success: true, message: "Signed successfully" });
        }
        catch (error) {
            return reply.code(500).send({ error: "Internal error saving signature" });
        }
    });
    app.get("/api/visits/:visitId/gnathology", async (request, reply) => {
        const orgId = await requireResolvedOrganizationId(request, reply, "read gnathology");
        if (!orgId)
            return;
        const { visitId } = request.params;
        try {
            const gnathology = await getVisitGnathologyFromDb(visitId);
            return reply.send(gnathology || {});
        }
        catch (error) {
            return reply
                .code(500)
                .send({ error: "Internal error reading gnathology" });
        }
    });
    app.put("/api/visits/:visitId/gnathology", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "update gnathology");
        if (!orgId)
            return;
        const { visitId } = request.params;
        const payload = request.body;
        if (!payload.patientId) {
            return reply.code(400).send({ error: "Missing patientId" });
        }
        try {
            const data = {
                occlusionType: payload.occlusionType,
                jawShift: payload.jawShift,
                tmjState: payload.tmjState,
                osteopathicStatus: payload.osteopathicStatus,
            };
            if (payload.mouthOpeningMm) {
                data.mouthOpeningMm = Number(payload.mouthOpeningMm);
            }
            await upsertVisitGnathologyInDb(visitId, payload.patientId, data);
            return reply.send({ success: true });
        }
        catch (error) {
            return reply
                .code(500)
                .send({ error: "Internal error saving gnathology" });
        }
    });
}
