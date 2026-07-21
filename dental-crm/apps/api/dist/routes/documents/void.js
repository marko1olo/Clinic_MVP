import { publicGeneratedDocumentSchema, voidDocumentSchema, } from "@dental/shared";
import { requireClinicalMutationAccess, requireResolvedStaffOrAdminOrganizationId, } from "../../accessGuard.js";
import { getDocumentById, voidGeneratedDocumentInDb, } from "../../db/documentQuery.js";
import { repairMojibakeDeep, repairMojibakeText, } from "../../text/repairMojibake.js";
import { apiError, documentVoidValidationMessage, } from "../documents.js";
export async function register(app) {
    app.post("/api/documents/:id/void", async (request, reply) => {
        if (!(await requireClinicalMutationAccess(request, reply, "document void")))
            return;
        const orgId = await requireResolvedStaffOrAdminOrganizationId(request, reply, "document void tenant");
        if (!orgId)
            return;
        const { id } = request.params;
        const existing = await getDocumentById(orgId, id);
        if (!existing) {
            return reply.code(404).send(apiError("Документ не найден"));
        }
        const parsedVoidInput = voidDocumentSchema.safeParse(request.body);
        if (!parsedVoidInput.success) {
            return reply.code(400).send({
                error: "DocumentVoidValidationFailed",
                message: repairMojibakeText(documentVoidValidationMessage),
            });
        }
        const voidAttestationInput = repairMojibakeDeep(parsedVoidInput.data.voidAttestation);
        const correctionDocumentId = voidAttestationInput.correctionDocumentId ?? null;
        if (correctionDocumentId === id) {
            return reply
                .code(409)
                .send(apiError("Документ не может ссылаться на себя как на исправление."));
        }
        if (correctionDocumentId) {
            const correctionDocument = await getDocumentById(orgId, correctionDocumentId);
            if (!correctionDocument ||
                correctionDocument.organizationId !== existing.organizationId ||
                correctionDocument.patientId !== existing.patientId ||
                correctionDocument.status === "voided") {
                return reply
                    .code(409)
                    .send(apiError("Исправляющий документ должен существовать у того же пациента, той же клиники и не быть аннулированным."));
            }
        }
        const voidedAt = new Date().toISOString();
        const document = await voidGeneratedDocumentInDb(orgId, id, {
            voidedAt,
            voidAttestation: {
                ...voidAttestationInput,
                voidedAt,
            },
            voidedByUserId: request.user?.id || null,
        });
        if (!document) {
            return reply
                .code(409)
                .send(apiError("Статус документа нельзя изменить."));
        }
        return reply.send(publicGeneratedDocumentSchema.parse(document));
    });
}
