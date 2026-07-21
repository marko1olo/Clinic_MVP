import { clinicalRuleEvaluationInputSchema, clinicalRuleEvaluationResponseSchema, clinicalRuleSchema, createClinicalRuleSchema, updateClinicalRuleSchema, } from "@dental/shared";
import { requireClinicalMutationAccess, requireClinicalReadAccess, resolveOrganizationId, } from "../accessGuard.js";
import { createClinicalRuleInDb, deleteClinicalRuleInDb, evaluateClinicalRulesInDb, updateClinicalRuleInDb, } from "../db/clinicalQuery.js";
const clinicalRuleEvaluationValidationMessage = "Клинические правила не проверены: передайте пациента, визит и факты приема.";
const clinicalRuleMutationValidationMessage = "Клиническое правило не сохранено: заполните название, условие и действие правила.";
function parseClinicalPayload(schema, value) {
    const parsed = schema.safeParse(value);
    if (!parsed.success)
        return null;
    return parsed.data;
}
export async function registerClinicalRoutes(app) {
    app.post("/api/clinical/rules/evaluate", async (request, reply) => {
        if (!(await requireClinicalReadAccess(request, reply, "clinical rule evaluate")))
            return;
        const input = parseClinicalPayload(clinicalRuleEvaluationInputSchema, request.body);
        if (!input) {
            return reply.code(400).send({
                error: "ClinicalRuleValidationError",
                message: clinicalRuleEvaluationValidationMessage,
            });
        }
        const orgId = await resolveOrganizationId(request);
        if (!orgId) {
            return reply.code(403).send({
                error: "OrganizationRequired",
                message: "Организация не определена",
            });
        }
        if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
            const { evaluateClinicalRules } = await import("../sampleData.js");
            return clinicalRuleEvaluationResponseSchema.parse(evaluateClinicalRules(input));
        }
        return clinicalRuleEvaluationResponseSchema.parse(await evaluateClinicalRulesInDb(orgId, input));
    });
    app.post("/api/clinical/rules", async (request, reply) => {
        if (!(await requireClinicalMutationAccess(request, reply, "clinical rule create")))
            return;
        const input = parseClinicalPayload(createClinicalRuleSchema, request.body);
        if (!input) {
            return reply.code(400).send({
                error: "ClinicalRuleValidationError",
                message: clinicalRuleMutationValidationMessage,
            });
        }
        const orgId = await resolveOrganizationId(request);
        if (!orgId) {
            return reply.code(403).send({
                error: "OrganizationRequired",
                message: "Организация не определена",
            });
        }
        if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
            const { createClinicalRule } = await import("../sampleData.js");
            return clinicalRuleSchema.parse(createClinicalRule(input));
        }
        return clinicalRuleSchema.parse(await createClinicalRuleInDb(orgId, input));
    });
    app.patch("/api/clinical/rules/:ruleId", async (request, reply) => {
        if (!(await requireClinicalMutationAccess(request, reply, "clinical rule update")))
            return;
        const params = request.params;
        const body = request.body && typeof request.body === "object" ? request.body : {};
        const input = parseClinicalPayload(updateClinicalRuleSchema, {
            ...body,
            id: params.ruleId,
        });
        if (!input) {
            return reply.code(400).send({
                error: "ClinicalRuleValidationError",
                message: clinicalRuleMutationValidationMessage,
            });
        }
        const orgId = await resolveOrganizationId(request);
        if (!orgId) {
            return reply.code(403).send({
                error: "OrganizationRequired",
                message: "Организация не определена",
            });
        }
        if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
            const { updateClinicalRule } = await import("../sampleData.js");
            try {
                return clinicalRuleSchema.parse(updateClinicalRule({ ...input, id: params.ruleId }));
            }
            catch (e) {
                return reply.code(404).send({
                    error: "ClinicalRuleNotFound",
                    message: "Правило не найдено",
                });
            }
        }
        return clinicalRuleSchema.parse(await updateClinicalRuleInDb(orgId, input));
    });
    app.delete("/api/clinical/rules/:ruleId", async (request, reply) => {
        if (!(await requireClinicalMutationAccess(request, reply, "clinical rule delete")))
            return;
        const params = request.params;
        const orgId = await resolveOrganizationId(request);
        if (!orgId)
            return reply.code(403).send({
                error: "OrganizationRequired",
                message: "Организация не определена",
            });
        if (process.env.DENTAL_STATE_PERSISTENCE === "off") {
            const { deleteClinicalRule } = await import("../sampleData.js");
            try {
                deleteClinicalRule(params.ruleId);
                return reply.code(204).send();
            }
            catch (e) {
                return reply.code(404).send({
                    error: "ClinicalRuleNotFound",
                    message: "Правило не найдено",
                });
            }
        }
        await deleteClinicalRuleInDb(orgId, params.ruleId);
        return reply.send({ success: true });
    });
    app.post("/api/clinical/post-op-care", async (request, reply) => {
        if (!(await requireClinicalMutationAccess(request, reply, "trigger post op care")))
            return;
        const body = request.body;
        if (!body.patientId || !body.itemTitle) {
            return reply.code(400).send({
                error: "ValidationError",
                message: "patientId and itemTitle are required",
            });
        }
        const orgId = await resolveOrganizationId(request);
        if (!orgId)
            return reply.code(403).send({ error: "OrganizationRequired" });
        // Verify patient belongs to org
        const { db } = await import("../db/client.js");
        const { patients } = await import("../db/schema.js");
        const { eq, and } = await import("drizzle-orm");
        const [patient] = await db
            .select({ id: patients.id })
            .from(patients)
            .where(and(eq(patients.id, body.patientId), eq(patients.organizationId, orgId)))
            .limit(1);
        if (!patient)
            return reply.code(403).send({
                error: "Forbidden",
                message: "Patient not found in this organization",
            });
        // Dynamically import the service to avoid circular deps if any
        const { triggerPostOpCare } = await import("../services/postOpCareTrigger.js");
        await triggerPostOpCare(orgId, body.patientId, body.itemTitle);
        return reply.send({ success: true });
    });
}
