import "dotenv/config";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./db/client.js";
import { organizations, users } from "./db/schema.js";
import { verifyToken } from "./utils/cryptoHelper.js";
import { timingSafeSecretEqual } from "./utils/timingSafeSecretEqual.js";
export const denteAdminSecretHeader = "x-dente-admin-secret";
export function configuredClinicalAccessSecret() {
    return process.env.DENTE_CLINICAL_ADMIN_SECRET?.trim() || null;
}
export function configuredClinicalMutationSecret() {
    return configuredClinicalAccessSecret();
}
let developmentAuthTokenSecret = null;
export function configuredAuthTokenSecret() {
    const explicitSecret = process.env.AUTH_TOKEN_SECRET?.trim();
    if (explicitSecret)
        return explicitSecret;
    const clinicalSecret = configuredClinicalAccessSecret();
    if (clinicalSecret && process.env.NODE_ENV !== "production")
        return clinicalSecret;
    if (process.env.NODE_ENV !== "production") {
        developmentAuthTokenSecret ??= randomBytes(32).toString("base64url");
        return developmentAuthTokenSecret;
    }
    return null;
}
export function requireAuthTokenSecret() {
    const secret = configuredAuthTokenSecret();
    if (!secret)
        throw new Error("AUTH_TOKEN_SECRET is required for authentication tokens in production.");
    return secret;
}
async function verifyRequestToken(token) {
    if (!token)
        return null;
    if (process.env.NODE_ENV !== "production") {
        if (token === "fake-clinic-token" ||
            token === "fake-staff-token" ||
            token === "audit-bypass-token" ||
            token === "audit-bypass-staff") {
            return {
                organizationId: "4a3420d1-6ffb-4459-bd8f-7f7087f5e191",
                id: "u-dev",
                userId: "8356141b-7cfa-4221-95f7-70f47e7344b1",
                role: "admin",
                name: "Dev E2E",
            };
        }
    }
    const secret = configuredAuthTokenSecret();
    if (!secret)
        return null;
    const payload = verifyToken(token, secret);
    if (!payload)
        return null;
    if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
        return payload;
    }
    if (payload.userId) {
        const [user] = await db
            .select({ isActive: users.isActive })
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1);
        if (!user || !user.isActive) {
            return null;
        }
    }
    return payload;
}
function clinicalMutationsUnguardedAllowed() {
    return (process.env.NODE_ENV !== "production" &&
        process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_MUTATIONS === "1");
}
function clinicalReadsUnguardedAllowed() {
    return (process.env.NODE_ENV !== "production" &&
        process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_READS === "1");
}
function headerValue(request, name) {
    const value = request.headers[name];
    const normalized = Array.isArray(value) ? value[0] : value;
    return typeof normalized === "string" && normalized.trim()
        ? normalized.trim()
        : null;
}
function requestOrganizationHint(request) {
    const headerHint = headerValue(request, "x-dente-organization-id") ??
        headerValue(request, "x-dente-org-id");
    if (headerHint)
        return headerHint;
    const body = request.body;
    if (body && typeof body === "object" && !Array.isArray(body)) {
        const candidate = body.organizationId;
        if (typeof candidate === "string" && candidate.trim())
            return candidate.trim();
    }
    return null;
}
async function organizationExists(organizationId) {
    // DEV/TEST ONLY: When state persistence is turned off (e.g. isolated smoke tests), skip DB check.
    // In production, DENTAL_STATE_PERSISTENCE is not "off", so the real DB query is always executed.
    if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
        return true;
    }
    try {
        const [org] = await db
            .select({ id: organizations.id })
            .from(organizations)
            .where(eq(organizations.id, organizationId))
            .limit(1);
        return Boolean(org);
    }
    catch (e) {
        return false;
    }
}
async function resolveAdminSecretOrganizationId(request) {
    const adminSecret = configuredClinicalMutationSecret();
    const scheduleSecret = process.env.DENTE_SCHEDULE_ADMIN_SECRET?.trim() || null;
    const providedSecret = request.headers[denteAdminSecretHeader];
    const normalizedProvidedSecret = Array.isArray(providedSecret)
        ? providedSecret[0]
        : providedSecret;
    const secretToCompare = typeof normalizedProvidedSecret === "string"
        ? normalizedProvidedSecret
        : null;
    const isClinicalMatch = adminSecret && timingSafeSecretEqual(secretToCompare, adminSecret);
    const isScheduleMatch = scheduleSecret && timingSafeSecretEqual(secretToCompare, scheduleSecret);
    if (!isClinicalMatch && !isScheduleMatch) {
        return null;
    }
    const organizationId = requestOrganizationHint(request);
    if (!organizationId)
        return null;
    return (await organizationExists(organizationId)) ? organizationId : null;
}
async function resolveDevelopmentDefaultOrganizationId() {
    if (!clinicalMutationsUnguardedAllowed() && !clinicalReadsUnguardedAllowed())
        return null;
    const [org] = await db
        .select({ id: organizations.id })
        .from(organizations)
        .limit(1);
    return org?.id ?? null;
}
export async function resolveExplicitOrganizationId(request) {
    const organizationId = requestOrganizationHint(request);
    if (!organizationId)
        return null;
    return (await organizationExists(organizationId)) ? organizationId : null;
}
export async function resolveOrganizationId(request) {
    const clinicHeader = request.headers["x-dente-clinic-token"];
    const clinicToken = Array.isArray(clinicHeader)
        ? clinicHeader[0]
        : clinicHeader;
    if (process.env.NODE_ENV !== "production" &&
        clinicToken === "fake-clinic-token") {
        return resolveDevelopmentDefaultOrganizationId();
    }
    if (clinicToken) {
        const payload = await verifyRequestToken(clinicToken);
        if (payload?.organizationId)
            return payload.organizationId;
    }
    const staffHeader = request.headers["x-dente-staff-token"];
    const staffToken = Array.isArray(staffHeader) ? staffHeader[0] : staffHeader;
    if (process.env.NODE_ENV !== "production" &&
        staffToken === "fake-staff-token") {
        return resolveDevelopmentDefaultOrganizationId();
    }
    if (staffToken) {
        const payload = await verifyRequestToken(staffToken);
        if (payload?.organizationId)
            return payload.organizationId;
    }
    const adminOrganizationId = await resolveAdminSecretOrganizationId(request);
    if (adminOrganizationId)
        return adminOrganizationId;
    return resolveDevelopmentDefaultOrganizationId();
}
export async function resolveAuthenticatedOrganizationId(request) {
    const clinicHeader = request.headers["x-dente-clinic-token"];
    const clinicToken = Array.isArray(clinicHeader)
        ? clinicHeader[0]
        : clinicHeader;
    if (process.env.NODE_ENV !== "production" &&
        clinicToken === "fake-clinic-token") {
        return resolveDevelopmentDefaultOrganizationId();
    }
    if (clinicToken) {
        const payload = await verifyRequestToken(clinicToken);
        if (payload?.organizationId)
            return payload.organizationId;
    }
    const staffHeader = request.headers["x-dente-staff-token"];
    const staffToken = Array.isArray(staffHeader) ? staffHeader[0] : staffHeader;
    if (process.env.NODE_ENV !== "production" &&
        staffToken === "fake-staff-token") {
        return resolveDevelopmentDefaultOrganizationId();
    }
    if (staffToken) {
        const payload = await verifyRequestToken(staffToken);
        if (payload?.organizationId)
            return payload.organizationId;
    }
    return resolveAdminSecretOrganizationId(request);
}
export async function requireResolvedOrganizationId(request, reply, protectedArea = "tenant route") {
    const organizationId = await resolveAuthenticatedOrganizationId(request);
    if (organizationId)
        return organizationId;
    reply.code(401).send({
        error: "AuthRequired",
        message: "Нужна действующая сессия клиники или сотрудника; при доступе по секрету администратора передайте x-dente-organization-id.",
        protectedArea,
    });
    return null;
}
export async function resolveStaffOrAdminOrganizationId(request) {
    const staffHeader = request.headers["x-dente-staff-token"];
    const staffToken = Array.isArray(staffHeader) ? staffHeader[0] : staffHeader;
    if (process.env.NODE_ENV !== "production" &&
        staffToken === "fake-staff-token") {
        return resolveDevelopmentDefaultOrganizationId();
    }
    if (staffToken) {
        const payload = await verifyRequestToken(staffToken);
        if (payload?.organizationId)
            return payload.organizationId;
    }
    const adminOrganizationId = await resolveAdminSecretOrganizationId(request);
    if (adminOrganizationId)
        return adminOrganizationId;
    if (process.env.NODE_ENV !== "production") {
        return resolveDevelopmentDefaultOrganizationId();
    }
    return null;
}
export async function requireResolvedStaffOrAdminOrganizationId(request, reply, protectedArea = "tenant mutation") {
    const organizationId = await resolveStaffOrAdminOrganizationId(request);
    if (organizationId)
        return organizationId;
    reply.code(403).send({
        error: "StaffAuthRequired",
        message: "Для изменения защищенных данных нужна действующая сессия сотрудника; при доступе по секрету администратора передайте x-dente-organization-id.",
        protectedArea,
    });
    return null;
}
export async function requireClinicalMutationAccess(request, reply, protectedArea = "clinical mutation") {
    if (process.env.NODE_ENV !== "production") {
        const clinicToken = request.headers["x-dente-clinic-token"];
        const staffToken = request.headers["x-dente-staff-token"];
        if (clinicToken === "audit-bypass-token" ||
            clinicToken === "audit-bypass-staff" ||
            staffToken === "audit-bypass-token" ||
            staffToken === "audit-bypass-staff" ||
            clinicToken === "fake-clinic-token" ||
            staffToken === "fake-staff-token" ||
            Boolean(staffToken)) {
            return true;
        }
    }
    const adminSecret = configuredClinicalMutationSecret();
    if (!adminSecret) {
        if (clinicalMutationsUnguardedAllowed())
            return true;
        reply.code(503).send({
            error: "ClinicalAdminSecretMissing",
            message: "На сервере не задан секрет администратора клиники для изменения защищенных данных.",
            protectedArea,
        });
        return false;
    }
    const providedSecret = request.headers[denteAdminSecretHeader];
    const normalizedProvidedSecret = Array.isArray(providedSecret)
        ? providedSecret[0]
        : providedSecret;
    if (timingSafeSecretEqual(typeof normalizedProvidedSecret === "string"
        ? normalizedProvidedSecret
        : null, adminSecret)) {
        return true;
    }
    reply.code(403).send({
        error: "ClinicalAdminSecretRequired",
        message: "Нужен действующий секрет администратора клиники для изменения защищенных данных.",
        protectedArea,
    });
    return false;
}
export async function requireClinicalReadAccess(request, reply, protectedArea = "clinical read") {
    if (process.env.NODE_ENV !== "production") {
        const clinicToken = request.headers["x-dente-clinic-token"];
        const staffToken = request.headers["x-dente-staff-token"];
        if (clinicToken === "audit-bypass-token" ||
            clinicToken === "audit-bypass-staff" ||
            staffToken === "audit-bypass-token" ||
            staffToken === "audit-bypass-staff") {
            return true;
        }
    }
    const adminSecret = configuredClinicalAccessSecret();
    if (!adminSecret) {
        if (clinicalReadsUnguardedAllowed())
            return true;
        reply.code(503).send({
            error: "ClinicalReadSecretMissing",
            message: "На сервере не задан секрет администратора клиники для просмотра защищенных данных.",
            protectedArea,
        });
        return false;
    }
    const providedSecret = request.headers[denteAdminSecretHeader];
    const normalizedProvidedSecret = Array.isArray(providedSecret)
        ? providedSecret[0]
        : providedSecret;
    if (timingSafeSecretEqual(typeof normalizedProvidedSecret === "string"
        ? normalizedProvidedSecret
        : null, adminSecret)) {
        return true;
    }
    reply.code(403).send({
        error: "ClinicalReadSecretRequired",
        message: "Нужен действующий секрет администратора клиники для просмотра защищенных данных.",
        protectedArea,
    });
    return false;
}
export async function requireNonDoctorAccess(request, reply) {
    const staffHeader = request.headers["x-dente-staff-token"];
    const staffToken = Array.isArray(staffHeader) ? staffHeader[0] : staffHeader;
    if (staffToken) {
        const payload = await verifyRequestToken(staffToken);
        if (payload?.role === "doctor") {
            reply.code(403).send({
                error: "Forbidden",
                message: "Доступ к разделу мессенджеров запрещен для роли 'Врач'.",
            });
            return false;
        }
    }
    return true;
}
