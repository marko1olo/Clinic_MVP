import { createPatientSchema, patientSchema, updatePatientAdministrativeProfileSchema, updatePatientSchema, } from "@dental/shared";
import { and, desc, eq } from "drizzle-orm";
import { requireResolvedOrganizationId, requireResolvedStaffOrAdminOrganizationId, } from "../accessGuard.js";
import { db } from "../db/client.js";
import { patientReclamations, taskTickets } from "../db/schema.js";
const patientCreateValidationMessage = "Пациент не создан: заполните ФИО, дату рождения, контакты и обязательные поля карты.";
const patientUpdateValidationMessage = "Пациент не обновлен: проверьте ФИО, дату рождения, контакты и обязательные поля карты.";
const patientAdministrativeValidationMessage = "Административный профиль не сохранен: проверьте документы, согласия, страховку и данные представителя.";
const patientRepresentativeValidationMessage = "Данные представителя не сохранены: если указаны телефон, документ или получатель представителя, заполните ФИО и основание представительства.";
const patientMissingRouteMessage = "Пациент не выбран. Откройте актуальную карту пациента и повторите действие.";
const patientNotFoundMessage = "Пациент не найден. Обновите список пациентов и выберите актуальную карту.";
const patientDuplicateMessage = "Похожая карта пациента уже есть. Найдите пациента по ФИО или телефону и обновите существующую карточку.";
function parsePatientPayload(schema, value) {
    const parsed = schema.safeParse(value);
    if (!parsed.success)
        return null;
    return parsed.data;
}
function sendPatientRouteValidationError(reply) {
    return reply.code(400).send({
        error: "PatientRouteValidationError",
        message: patientMissingRouteMessage,
    });
}
function sendPatientNotFound(reply) {
    return reply.code(404).send({
        error: "PatientNotFound",
        message: patientNotFoundMessage,
    });
}
function normalizePatientNameForDuplicate(value) {
    return (value ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase("ru-RU");
}
function normalizePatientPhoneForDuplicate(value) {
    const digits = (value ?? "").replace(/\D/g, "");
    return digits.length >= 5 ? digits : "";
}
function findPatientDuplicate(patientsList, input, ignoredPatientId) {
    const inputName = normalizePatientNameForDuplicate(input.fullName);
    const inputBirthDate = (input.birthDate ?? "").trim();
    const inputPhone = normalizePatientPhoneForDuplicate(input.phone);
    if (!inputName && !inputBirthDate && !inputPhone)
        return null;
    return (patientsList.find((patient) => {
        if (patient.id === ignoredPatientId || patient.status !== "active")
            return false;
        const sameName = Boolean(inputName) &&
            inputName === normalizePatientNameForDuplicate(patient.fullName);
        const sameBirthDate = Boolean(inputBirthDate) && inputBirthDate === (patient.birthDate ?? "");
        const samePhone = Boolean(inputPhone) &&
            inputPhone === normalizePatientPhoneForDuplicate(patient.phone);
        return ((sameName && sameBirthDate) ||
            (sameName && samePhone) ||
            (sameBirthDate && samePhone));
    }) ?? null);
}
function sendPatientDuplicate(reply) {
    return reply.code(409).send({
        error: "PatientDuplicateError",
        message: patientDuplicateMessage,
    });
}
function hasText(value) {
    return Boolean(value?.trim());
}
function hasIncompleteRepresentativeIdentity(value) {
    const hasRepresentativeFact = hasText(value.legalRepresentativeFullName) ||
        hasText(value.legalRepresentativeRelationship) ||
        hasText(value.legalRepresentativeIdentityDocument) ||
        hasText(value.legalRepresentativePhone) ||
        /представител|опекун|родител|довер/i.test(value.preferredDocumentRecipient ?? "");
    if (!hasRepresentativeFact)
        return false;
    return (!hasText(value.legalRepresentativeFullName) ||
        !hasText(value.legalRepresentativeRelationship));
}
import { createPatientInDb, getPatientAnamnesisFromDb, getPatientsFromDb, updatePatientAdministrativeProfileInDb, updatePatientAnamnesisInDb, updatePatientInDb, } from "../db/patientsQuery.js";
export async function registerPatientRoutes(app) {
    app.get("/api/patients", async (request, reply) => {
        const orgId = await requireResolvedOrganizationId(request, reply, "patients read");
        if (!orgId)
            return;
        try {
            const dbPatients = await getPatientsFromDb(orgId);
            return dbPatients.map((patient) => patientSchema.parse(patient));
        }
        catch (e) {
            console.error("[Patients] Error fetching from DB:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.post("/api/patients", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "patient create");
        if (!orgId)
            return;
        const input = parsePatientPayload(createPatientSchema, request.body);
        if (!input) {
            return reply.code(400).send({
                error: "PatientValidationError",
                message: patientCreateValidationMessage,
            });
        }
        const dbPatients = await getPatientsFromDb(orgId);
        const duplicate = findPatientDuplicate(dbPatients, input);
        if (duplicate)
            return sendPatientDuplicate(reply);
        try {
            const patient = await createPatientInDb(orgId, input);
            return reply.code(201).send(patientSchema.parse(patient));
        }
        catch (e) {
            console.error("[Patients] Create error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.put("/api/patients/:patientId", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "patient update");
        if (!orgId)
            return;
        const params = request.params;
        if (!params.patientId)
            return sendPatientRouteValidationError(reply);
        const input = parsePatientPayload(updatePatientSchema, request.body);
        if (!input) {
            return reply.code(400).send({
                error: "PatientValidationError",
                message: patientUpdateValidationMessage,
            });
        }
        try {
            const patient = await updatePatientInDb(orgId, params.patientId, input);
            if (!patient)
                return sendPatientNotFound(reply);
            return patientSchema.parse(patient);
        }
        catch (e) {
            console.error("[Patients] Update error:", e);
            return sendPatientNotFound(reply);
        }
    });
    app.put("/api/patients/:patientId/administrative-profile", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "patient administrative profile update");
        if (!orgId)
            return;
        const params = request.params;
        if (!params.patientId)
            return sendPatientRouteValidationError(reply);
        const input = parsePatientPayload(updatePatientAdministrativeProfileSchema, request.body);
        if (!input) {
            return reply.code(400).send({
                error: "PatientValidationError",
                message: patientAdministrativeValidationMessage,
            });
        }
        try {
            const patient = await updatePatientAdministrativeProfileInDb(orgId, params.patientId, input);
            if (!patient)
                return sendPatientNotFound(reply);
            return patientSchema.parse(patient);
        }
        catch (e) {
            console.error("[Patients] Update profile error:", e);
            return sendPatientNotFound(reply);
        }
    });
    app.get("/api/patients/:patientId/anamnesis", async (request, reply) => {
        const orgId = await requireResolvedOrganizationId(request, reply, "patient anamnesis read");
        if (!orgId)
            return;
        const params = request.params;
        if (!params.patientId)
            return sendPatientRouteValidationError(reply);
        try {
            const anamnesis = await getPatientAnamnesisFromDb(params.patientId, orgId);
            return (anamnesis || {
                allergies: [],
                systemicDiseases: [],
                hasCriticalAlerts: false,
                medications: [],
                pregnancyStatus: null,
                criticalAlertNote: null,
            });
        }
        catch (e) {
            console.error("[Patients] Get anamnesis error:", e);
            return sendPatientNotFound(reply);
        }
    });
    app.put("/api/patients/:patientId/anamnesis", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "patient anamnesis update");
        if (!orgId)
            return;
        const params = request.params;
        if (!params.patientId)
            return sendPatientRouteValidationError(reply);
        try {
            const input = request.body; // Allow relaxed parsing for now
            const updated = await updatePatientAnamnesisInDb(params.patientId, orgId, {
                allergies: Array.isArray(input?.allergies)
                    ? input.allergies
                    : undefined,
                systemicDiseases: Array.isArray(input?.systemicDiseases)
                    ? input.systemicDiseases
                    : undefined,
                hasCriticalAlerts: typeof input?.hasCriticalAlerts === "boolean"
                    ? input.hasCriticalAlerts
                    : undefined,
                medications: Array.isArray(input?.medications)
                    ? input.medications
                    : undefined,
                pregnancyStatus: typeof input?.pregnancyStatus === "string" ||
                    input?.pregnancyStatus === null
                    ? input.pregnancyStatus
                    : undefined,
                criticalAlertNote: typeof input?.criticalAlertNote === "string" ||
                    input?.criticalAlertNote === null
                    ? input.criticalAlertNote
                    : undefined,
            });
            // null => patient is not in this org; don't silently no-op cross-org writes.
            if (!updated)
                return sendPatientNotFound(reply);
            return updated;
        }
        catch (e) {
            console.error("[Patients] Update anamnesis error:", e);
            return sendPatientNotFound(reply);
        }
    });
    app.get("/api/patients/:patientId/reclamations", async (request, reply) => {
        const orgId = await requireResolvedOrganizationId(request, reply, "read reclamations");
        if (!orgId)
            return;
        const { patientId } = request.params;
        try {
            const rows = await db
                .select()
                .from(patientReclamations)
                .where(eq(patientReclamations.patientId, patientId))
                .orderBy(desc(patientReclamations.createdAt));
            return rows;
        }
        catch (e) {
            console.error("Reclamations GET error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.post("/api/patients/:patientId/reclamations", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "create reclamation");
        if (!orgId)
            return;
        const { patientId } = request.params;
        const { doctorId, complicationDetails, proposedAction } = request.body;
        try {
            const [reclamation] = await db
                .insert(patientReclamations)
                .values({
                patientId,
                doctorId,
                complicationDetails,
                proposedAction,
                status: "under_review",
            })
                .returning();
            return reclamation;
        }
        catch (e) {
            console.error("Reclamations POST error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.put("/api/patients/:patientId/reclamations/:reclamationId", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "update reclamation");
        if (!orgId)
            return;
        const { patientId, reclamationId } = request.params;
        const { status, proposedAction } = request.body;
        try {
            const updateData = {};
            if (status !== undefined)
                updateData.status = status;
            if (proposedAction !== undefined)
                updateData.proposedAction = proposedAction;
            if (status === "resolved")
                updateData.resolvedAt = new Date();
            const [reclamation] = await db
                .update(patientReclamations)
                .set(updateData)
                .where(and(eq(patientReclamations.id, reclamationId), eq(patientReclamations.patientId, patientId)))
                .returning();
            if (!reclamation)
                return reply.code(404).send({ error: "NotFound" });
            return reclamation;
        }
        catch (e) {
            console.error("Reclamations PUT error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.delete("/api/patients/:patientId/reclamations/:reclamationId", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "delete reclamation");
        if (!orgId)
            return;
        const { patientId, reclamationId } = request.params;
        try {
            const [reclamation] = await db
                .delete(patientReclamations)
                .where(and(eq(patientReclamations.id, reclamationId), eq(patientReclamations.patientId, patientId)))
                .returning();
            if (!reclamation)
                return reply.code(404).send({ error: "NotFound" });
            return { success: true };
        }
        catch (e) {
            console.error("Reclamations DELETE error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.get("/api/patients/:patientId/tickets", async (request, reply) => {
        const orgId = await requireResolvedOrganizationId(request, reply, "read tickets");
        if (!orgId)
            return;
        const { patientId } = request.params;
        try {
            const rows = await db
                .select()
                .from(taskTickets)
                .where(eq(taskTickets.patientId, patientId))
                .orderBy(desc(taskTickets.createdAt));
            return rows;
        }
        catch (e) {
            console.error("Task Tickets GET error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.post("/api/patients/:patientId/tickets", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "create ticket");
        if (!orgId)
            return;
        const { patientId } = request.params;
        const { assignedToId, title, description, priority } = request.body;
        try {
            const [ticket] = await db
                .insert(taskTickets)
                .values({
                patientId,
                assignedToId,
                title,
                description,
                priority: priority || "normal",
                status: "pending",
            })
                .returning();
            return ticket;
        }
        catch (e) {
            console.error("Task Tickets POST error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.put("/api/patients/:patientId/tickets/:ticketId", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "update ticket");
        if (!orgId)
            return;
        const { patientId, ticketId } = request.params;
        const { assignedToId, title, description, priority, status } = request.body;
        try {
            const updateData = { updatedAt: new Date() };
            if (assignedToId !== undefined)
                updateData.assignedToId = assignedToId;
            if (title !== undefined)
                updateData.title = title;
            if (description !== undefined)
                updateData.description = description;
            if (priority !== undefined)
                updateData.priority = priority;
            if (status !== undefined)
                updateData.status = status;
            const [ticket] = await db
                .update(taskTickets)
                .set(updateData)
                .where(and(eq(taskTickets.id, ticketId), eq(taskTickets.patientId, patientId)))
                .returning();
            if (!ticket)
                return reply.code(404).send({ error: "NotFound" });
            return ticket;
        }
        catch (e) {
            console.error("Task Tickets PUT error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
    app.delete("/api/patients/:patientId/tickets/:ticketId", async (request, reply) => {
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "delete ticket");
        if (!orgId)
            return;
        const { patientId, ticketId } = request.params;
        try {
            const [ticket] = await db
                .delete(taskTickets)
                .where(and(eq(taskTickets.id, ticketId), eq(taskTickets.patientId, patientId)))
                .returning();
            if (!ticket)
                return reply.code(404).send({ error: "NotFound" });
            return { success: true };
        }
        catch (e) {
            console.error("Task Tickets DELETE error:", e);
            return reply.code(500).send({ error: "DatabaseError" });
        }
    });
}
