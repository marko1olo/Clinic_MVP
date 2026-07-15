import { requireClinicalReadAccess, requireResolvedOrganizationId } from "../../accessGuard.js";
import { apiError, buildDocumentAuditFacts } from "../documents.js";
import { getDocumentById } from "../../db/documentQuery.js";
import { getPatientByIdFromDb } from "../../db/patientsQuery.js";
export async function register(app) {
    app.get("/api/documents/:id/audit-facts", async (request, reply) => {
        if (!(await requireClinicalReadAccess(request, reply, "document audit facts")))
            return;
        const { id } = request.params;
        const orgId = await requireResolvedOrganizationId(request, reply, "document audit facts tenant");
        if (!orgId)
            return;
        const document = await getDocumentById(orgId, id);
        if (!document) {
            return reply.code(404).send(apiError("Документ не найден"));
        }
        const patient = await getPatientByIdFromDb(orgId, document.patientId);
        if (!patient) {
            return reply.code(404).send(apiError("Пациент не найден"));
        }
        return reply.send(buildDocumentAuditFacts(document, patient));
    });
}
