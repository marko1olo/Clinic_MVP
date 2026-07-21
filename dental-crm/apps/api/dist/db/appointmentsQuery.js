import { and, eq, inArray, sql } from "drizzle-orm";
import { triggerAutomationRules } from "../services/automationRulesEngine.js";
import { db } from "./client.js";
import * as schema from "./schema.js";
export async function createAppointmentInDb(organizationId, input, txContext = db) {
    return await txContext.transaction(async (tx) => {
        // Pessimistic lock on the chair to prevent race conditions
        await tx.execute(sql `SELECT 1 FROM ${schema.clinicChairs} WHERE id = ${input.chairId} FOR UPDATE`);
        const candidate = {
            patientId: input.patientId,
            doctorUserId: input.doctorUserId,
            assistantUserId: input.assistantUserId ?? null,
            chairId: input.chairId,
            status: input.status,
            startsAt: new Date(input.startsAt),
            endsAt: new Date(input.endsAt),
        };
        await assertAppointmentCanBeScheduled(organizationId, candidate, tx);
        const [created] = await tx
            .insert(schema.appointments)
            .values({
            organizationId,
            patientId: input.patientId,
            doctorUserId: input.doctorUserId,
            assistantUserId: input.assistantUserId ?? null,
            chairId: input.chairId,
            status: input.status,
            startsAt: new Date(input.startsAt),
            endsAt: new Date(input.endsAt),
            reason: input.reason || null,
            comment: input.comment || null,
        })
            .returning();
        if (!created)
            throw new Error("Failed to insert appointment");
        // appointment_soon: запускаем движок автоматизации (правила из реестра)
        if (created.patientId &&
            (created.status === "planned" ||
                created.status === "confirmed" ||
                created.status === "arrived")) {
            const startsAtDate = new Date(created.startsAt);
            const dateText = startsAtDate.toLocaleString("ru-RU", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
            });
            setImmediate(() => {
                triggerAutomationRules(created.organizationId, "appointment_soon", created.patientId, { appointmentId: created.id, dateText }).catch((e) => console.error("[AutomationEngine] appointment_soon create error:", e));
            });
        }
        return {
            id: created.id,
            organizationId: created.organizationId,
            patientId: created.patientId,
            doctorUserId: created.doctorUserId,
            assistantUserId: created.assistantUserId,
            chairId: created.chairId,
            status: created.status,
            startsAt: created.startsAt.toISOString(),
            endsAt: created.endsAt.toISOString(),
            reason: created.reason,
            comment: created.comment,
            version: created.version,
        };
    });
}
export async function updateAppointmentInDb(organizationId, appointmentId, input, txContext = db) {
    return await txContext.transaction(async (tx) => {
        const [existing] = await tx
            .select()
            .from(schema.appointments)
            .where(and(eq(schema.appointments.id, appointmentId), eq(schema.appointments.organizationId, organizationId)))
            .limit(1);
        if (!existing)
            throw new Error("Запись не найдена");
        if (input.version !== undefined && existing.version !== input.version) {
            throw new Error("Конфликт версий: запись была изменена другим пользователем. Обновите расписание.");
        }
        // Lock the chair
        const targetChairId = input.chairId !== undefined ? input.chairId : existing.chairId;
        if (targetChairId) {
            await tx.execute(sql `SELECT 1 FROM ${schema.clinicChairs} WHERE id = ${targetChairId} FOR UPDATE`);
        }
        const [activeVisit] = await tx
            .select()
            .from(schema.visits)
            .where(and(eq(schema.visits.appointmentId, appointmentId), eq(schema.visits.status, "draft")))
            .limit(1);
        if (activeVisit) {
            if (input.patientId !== undefined &&
                input.patientId !== existing.patientId) {
                throw new Error("Нельзя менять пациента: открыт прием");
            }
            if (input.status === "completed" ||
                input.status === "cancelled" ||
                input.status === "no_show") {
                throw new Error("Нельзя закрыть запись: открыт прием");
            }
        }
        const startsAtRaw = input.startsAt ?? existing.startsAt.toISOString();
        const endsAtRaw = input.endsAt ?? existing.endsAt.toISOString();
        const candidate = {
            id: appointmentId,
            patientId: input.patientId !== undefined ? input.patientId : existing.patientId,
            doctorUserId: input.doctorUserId !== undefined
                ? input.doctorUserId
                : existing.doctorUserId,
            assistantUserId: input.assistantUserId !== undefined
                ? input.assistantUserId
                : existing.assistantUserId,
            chairId: targetChairId,
            status: input.status !== undefined ? input.status : existing.status,
            startsAt: new Date(startsAtRaw),
            endsAt: new Date(endsAtRaw),
        };
        await assertAppointmentCanBeScheduled(organizationId, candidate, tx);
        const [updated] = await tx
            .update(schema.appointments)
            .set({
            patientId: input.patientId ?? existing.patientId,
            doctorUserId: input.doctorUserId ?? existing.doctorUserId,
            assistantUserId: input.assistantUserId !== undefined
                ? input.assistantUserId
                : existing.assistantUserId,
            chairId: targetChairId,
            status: input.status ?? existing.status,
            startsAt: new Date(startsAtRaw),
            endsAt: new Date(endsAtRaw),
            reason: input.reason !== undefined ? input.reason : existing.reason,
            comment: input.comment !== undefined ? input.comment : existing.comment,
            version: existing.version + 1,
        })
            .where(and(eq(schema.appointments.id, appointmentId), eq(schema.appointments.organizationId, organizationId)))
            .returning();
        if (!updated)
            throw new Error("Failed to update appointment");
        // Очищаем ранее запланированные напоминания appointment_soon для этой записи
        await tx
            .delete(schema.outgoingNotifications)
            .where(and(eq(schema.outgoingNotifications.organizationId, organizationId), eq(schema.outgoingNotifications.type, "appointment_soon"), eq(schema.outgoingNotifications.status, "pending"), sql `payload->>'appointmentId' = ${updated.id}`));
        // appointment_soon: перезапускаем правила, если запись ещё активна
        if (updated.patientId &&
            (updated.status === "planned" ||
                updated.status === "confirmed" ||
                updated.status === "arrived")) {
            const startsAtDate = new Date(updated.startsAt);
            const dateText = startsAtDate.toLocaleString("ru-RU", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
            });
            setImmediate(() => {
                triggerAutomationRules(updated.organizationId, "appointment_soon", updated.patientId, { appointmentId: updated.id, dateText }).catch((e) => console.error("[AutomationEngine] appointment_soon update error:", e));
            });
        }
        // no_show: CRM-задача для ручного звонка + движок авто-правил (смс/telegram по шаблону)
        if (input.status === "no_show" &&
            existing.status !== "no_show" &&
            updated.patientId) {
            const [patient] = await tx
                .select({ fullName: schema.patients.fullName })
                .from(schema.patients)
                .where(eq(schema.patients.id, updated.patientId))
                .limit(1);
            const patientName = patient?.fullName || "пациентом";
            const dueAt = new Date();
            dueAt.setHours(dueAt.getHours() + 1); // Follow up in 1 hour
            // CRM-задача для администратора (позвонить вручную)
            await tx.insert(schema.communicationTasks).values({
                organizationId,
                patientId: updated.patientId,
                appointmentId: updated.id,
                assignedRole: "administrator",
                channel: "phone",
                intent: "recall",
                status: "needs_call",
                priority: "high",
                dueAt,
                title: `Выяснить причину неявки пациентом ${patientName}`,
                body: `Пациент ${patientName} не явился на прием. Необходимо связаться и предложить перенос записи.`,
            });
            // Движок автоматизации: авто-уведомление по настроенным правилам no_show
            setImmediate(() => {
                triggerAutomationRules(organizationId, "no_show", updated.patientId, {
                    appointmentId: updated.id,
                }).catch((e) => console.error("[AutomationEngine] no_show error:", e));
            });
        }
        return {
            id: updated.id,
            organizationId: updated.organizationId,
            patientId: updated.patientId,
            doctorUserId: updated.doctorUserId,
            assistantUserId: updated.assistantUserId,
            chairId: updated.chairId,
            status: updated.status,
            startsAt: updated.startsAt.toISOString(),
            endsAt: updated.endsAt.toISOString(),
            reason: updated.reason,
            comment: updated.comment,
            version: updated.version,
        };
    });
}
export async function getAppointmentByIdInDb(organizationId, id) {
    const [res] = await db
        .select()
        .from(schema.appointments)
        .where(and(eq(schema.appointments.organizationId, organizationId), eq(schema.appointments.id, id)))
        .limit(1);
    return res || null;
}
// ============================================================================
// APPOINTMENT VALIDATION HELPERS
// ============================================================================
const appointmentTimeFormatters = new Map();
function getAppointmentTimeFormatter(timeZone) {
    const cached = appointmentTimeFormatters.get(timeZone);
    if (cached)
        return cached;
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });
    appointmentTimeFormatters.set(timeZone, formatter);
    return formatter;
}
function appointmentClinicTimeParts(date, sourceTimeZone) {
    const timeZone = sourceTimeZone || "Europe/Samara";
    const formatter = getAppointmentTimeFormatter(timeZone);
    const parts = new Map(formatter.formatToParts(date).map((part) => [part.type, part.value]));
    const year = Number.parseInt(parts.get("year") ?? "", 10);
    const month = Number.parseInt(parts.get("month") ?? "", 10);
    const day = Number.parseInt(parts.get("day") ?? "", 10);
    const hour = Number.parseInt(parts.get("hour") ?? "", 10);
    const minute = Number.parseInt(parts.get("minute") ?? "", 10);
    if (![year, month, day, hour, minute].every(Number.isFinite)) {
        return {
            weekday: date.getDay(),
            minute: date.getHours() * 60 + date.getMinutes(),
        };
    }
    return {
        weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
        minute: (hour % 24) * 60 + minute,
    };
}
function clockToMinutes(value) {
    const [hours = "0", minutes = "0"] = value.split(":");
    return Number.parseInt(hours, 10) * 60 + Number.parseInt(minutes, 10);
}
function normalizeStaffWorkingHours(input) {
    const defaults = Array.from({ length: 7 }, (_, weekday) => ({
        weekday,
        enabled: [1, 2, 3, 4, 5, 6].includes(weekday),
        start: "08:00",
        end: "20:00",
    }));
    const byWeekday = new Map();
    if (Array.isArray(input)) {
        input.forEach((day) => {
            if (day.weekday < 0 || day.weekday > 6)
                return;
            byWeekday.set(day.weekday, {
                weekday: day.weekday,
                enabled: Boolean(day.enabled),
                start: day.start || "08:00",
                end: day.end || "20:00",
            });
        });
    }
    return defaults.map((fallback) => byWeekday.get(fallback.weekday) ?? fallback);
}
async function getActiveAppointments(organizationId, txContext = db) {
    const activeApps = await txContext
        .select()
        .from(schema.appointments)
        .where(eq(schema.appointments.organizationId, organizationId));
    if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
        try {
            const { appointments } = await import("../sampleData.js");
            for (const app of appointments) {
                if (!activeApps.some((a) => a.id === app.id)) {
                    activeApps.push({
                        id: app.id,
                        organizationId: app.organizationId,
                        patientId: app.patientId || null,
                        doctorUserId: app.doctorUserId || null,
                        assistantUserId: app.assistantUserId || null,
                        chairId: app.chairId || null,
                        status: app.status,
                        startsAt: new Date(app.startsAt),
                        endsAt: new Date(app.endsAt),
                        reason: app.reason || null,
                        comment: app.comment || null,
                        isSynced: app.isSynced ?? false,
                        version: app.version ?? 1,
                    });
                }
            }
        }
        catch (e) {
            // Ignore
        }
    }
    return activeApps;
}
async function getPatientById(organizationId, patientId, txContext = db) {
    const [patient] = await txContext
        .select()
        .from(schema.patients)
        .where(and(eq(schema.patients.id, patientId), eq(schema.patients.organizationId, organizationId)))
        .limit(1);
    if (!patient && process.env.DENTAL_STATE_PERSISTENCE === "off") {
        try {
            const { patients } = await import("../sampleData.js");
            const found = patients.find((p) => p.id === patientId && p.organizationId === organizationId);
            if (found)
                return found;
        }
        catch (e) {
            // Ignore
        }
    }
    return patient;
}
async function getStaffMemberById(organizationId, staffId, txContext = db) {
    const [user] = await txContext
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.id, staffId), eq(schema.users.organizationId, organizationId)))
        .limit(1);
    if (!user && process.env.DENTAL_STATE_PERSISTENCE === "off") {
        try {
            const { staffMembers } = await import("../sampleData.js");
            const found = staffMembers.find((s) => s.id === staffId && s.organizationId === organizationId);
            if (found)
                return found;
        }
        catch (e) {
            // Ignore
        }
    }
    return user;
}
async function getChairById(organizationId, chairId, txContext = db) {
    const [chair] = await txContext
        .select()
        .from(schema.clinicChairs)
        .where(and(eq(schema.clinicChairs.id, chairId), eq(schema.clinicChairs.organizationId, organizationId)))
        .limit(1);
    if (!chair && process.env.DENTAL_STATE_PERSISTENCE === "off") {
        try {
            const { chairs } = await import("../sampleData.js");
            const found = chairs.find((c) => c.id === chairId && c.organizationId === organizationId);
            if (found)
                return found;
        }
        catch (e) {
            // Ignore
        }
    }
    return chair;
}
async function assertAppointmentCanBeScheduled(organizationId, candidate, tx = db) {
    const startsAtMs = candidate.startsAt.getTime();
    const endsAtMs = candidate.endsAt.getTime();
    if (endsAtMs <= startsAtMs) {
        throw new Error("Время окончания записи должно быть позже времени начала");
    }
    const scheduleBlockingStatuses = [
        "planned",
        "confirmed",
        "arrived",
        "in_treatment",
    ];
    if (!scheduleBlockingStatuses.includes(candidate.status) ||
        endsAtMs < Date.now()) {
        return;
    }
    if (!candidate.patientId) {
        throw new Error("Для активной будущей записи нужно выбрать пациента");
    }
    if (!candidate.doctorUserId) {
        throw new Error("Для активной будущей записи нужно выбрать врача");
    }
    if (!candidate.chairId) {
        throw new Error("Для активной будущей записи нужно выбрать кресло");
    }
    const [org] = await tx
        .select()
        .from(schema.organizations)
        .where(eq(schema.organizations.id, organizationId))
        .limit(1);
    if (!org)
        throw new Error("Organization not found");
    const [clinic] = await tx
        .select()
        .from(schema.clinics)
        .where(eq(schema.clinics.organizationId, organizationId))
        .limit(1);
    const timezone = clinic?.timezone || "Europe/Samara";
    const mode = org.clinicMode || "one_chair";
    if (mode !== "solo_doctor" && !candidate.assistantUserId) {
        throw new Error("Для активной будущей записи нужно выбрать ассистента");
    }
    const patient = await getPatientById(organizationId, candidate.patientId, tx);
    if (!patient || patient.status !== "active") {
        throw new Error("Для активной будущей записи нужен активный пациент");
    }
    const rawSchedule = org.clinicSchedule;
    const workdayStart = rawSchedule?.workdayStart || "08:00";
    const workdayEnd = rawSchedule?.workdayEnd || "20:00";
    const workingDays = Array.isArray(rawSchedule?.workingDays)
        ? rawSchedule.workingDays
        : [1, 2, 3, 4, 5, 6];
    const startParts = appointmentClinicTimeParts(candidate.startsAt, timezone);
    const endParts = appointmentClinicTimeParts(candidate.endsAt, timezone);
    if (!workingDays.includes(startParts.weekday)) {
        throw new Error(`Запись вне расписания клиники: прием стоит на нерабочий день клиники (${timezone})`);
    }
    const opensAt = clockToMinutes(workdayStart);
    const closesAt = clockToMinutes(workdayEnd);
    if (startParts.minute < opensAt || endParts.minute > closesAt) {
        throw new Error(`Запись вне расписания клиники: прием вне окна клиники ${workdayStart}-${workdayEnd} (${timezone})`);
    }
    const doctor = await getStaffMemberById(organizationId, candidate.doctorUserId, tx);
    if (doctor) {
        const workingHours = normalizeStaffWorkingHours((() => {
            const wh = doctor.workingHours;
            if (!wh)
                return null;
            if (Array.isArray(wh))
                return wh;
            if (wh && Array.isArray(wh.workingHours))
                return wh.workingHours;
            return null;
        })());
        const workingDay = workingHours.find((day) => day.weekday === startParts.weekday);
        if (!workingDay || !workingDay.enabled) {
            throw new Error(`Запись вне расписания врача: врач не работает в этот день (${timezone})`);
        }
        const docOpensAt = clockToMinutes(workingDay.start);
        const docClosesAt = clockToMinutes(workingDay.end);
        if (startParts.minute < docOpensAt || endParts.minute > docClosesAt) {
            throw new Error(`Запись вне расписания врача: прием вне окна врача ${workingDay.start}-${workingDay.end} (${timezone})`);
        }
    }
    if (candidate.assistantUserId) {
        const assistant = await getStaffMemberById(organizationId, candidate.assistantUserId, tx);
        if (assistant) {
            const workingHours = normalizeStaffWorkingHours((() => {
                const wh = assistant.workingHours;
                if (!wh)
                    return null;
                if (Array.isArray(wh))
                    return wh;
                if (wh && Array.isArray(wh.workingHours))
                    return wh.workingHours;
                return null;
            })());
            const workingDay = workingHours.find((day) => day.weekday === startParts.weekday);
            if (!workingDay || !workingDay.enabled) {
                throw new Error(`Запись вне расписания ассистента: ассистент не работает в этот день (${timezone})`);
            }
            const asstOpensAt = clockToMinutes(workingDay.start);
            const asstClosesAt = clockToMinutes(workingDay.end);
            if (startParts.minute < asstOpensAt || endParts.minute > asstClosesAt) {
                throw new Error(`Запись вне расписания ассистента: прием вне окна ассистента ${workingDay.start}-${workingDay.end} (${timezone})`);
            }
        }
    }
    const chair = await getChairById(organizationId, candidate.chairId, tx);
    if (chair) {
        const workingHours = normalizeStaffWorkingHours((() => {
            const wh = chair.workingHours;
            if (!wh)
                return null;
            if (Array.isArray(wh))
                return wh;
            if (wh && Array.isArray(wh.workingHours))
                return wh.workingHours;
            return null;
        })());
        const workingDay = workingHours.find((day) => day.weekday === startParts.weekday);
        if (!workingDay || !workingDay.enabled) {
            throw new Error(`Запись вне расписания кресла: кресло не работает в этот день (${timezone})`);
        }
        const chairOpensAt = clockToMinutes(workingDay.start);
        const chairClosesAt = clockToMinutes(workingDay.end);
        if (startParts.minute < chairOpensAt || endParts.minute > chairClosesAt) {
            throw new Error(`Запись вне расписания кресла: прием вне окна кресла ${workingDay.start}-${workingDay.end} (${timezone})`);
        }
    }
    const activeApps = await getActiveAppointments(organizationId, tx);
    const overlapping = activeApps.find((app) => {
        if (app.id === candidate.id)
            return false;
        if (!scheduleBlockingStatuses.includes(app.status) ||
            app.endsAt.getTime() < Date.now())
            return false;
        const leftStart = candidate.startsAt.getTime();
        const leftEnd = candidate.endsAt.getTime();
        const rightStart = app.startsAt.getTime();
        const rightEnd = app.endsAt.getTime();
        const isOverlap = leftStart < rightEnd && rightStart < leftEnd;
        if (!isOverlap)
            return false;
        if (candidate.patientId && app.patientId === candidate.patientId)
            return true;
        if (candidate.doctorUserId && app.doctorUserId === candidate.doctorUserId)
            return true;
        if (candidate.assistantUserId &&
            app.assistantUserId === candidate.assistantUserId)
            return true;
        if (candidate.chairId && app.chairId === candidate.chairId)
            return true;
        return false;
    });
    if (overlapping) {
        if (candidate.patientId && overlapping.patientId === candidate.patientId) {
            throw new Error("У пациента уже есть запись в это время");
        }
        if (candidate.doctorUserId &&
            overlapping.doctorUserId === candidate.doctorUserId) {
            throw new Error("У врача уже есть запись в это время");
        }
        if (candidate.assistantUserId &&
            overlapping.assistantUserId === candidate.assistantUserId) {
            throw new Error("У ассистента уже есть запись в это время");
        }
        throw new Error("Кресло уже занято другой записью в это время");
    }
}
export async function getAppointmentsByIdsInDb(organizationId, ids) {
    if (ids.length === 0)
        return [];
    const res = await db
        .select()
        .from(schema.appointments)
        .where(and(eq(schema.appointments.organizationId, organizationId), inArray(schema.appointments.id, ids)));
    return res;
}
