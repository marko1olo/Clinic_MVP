import type { FastifyInstance } from "fastify";
import { requireClinicalReadAccess } from "../../accessGuard.js";
import {
  documents,
  patients
} from "../../sampleData.js";
import {
  apiError,
  buildDocumentAuditFacts
} from "../documents.js";

export async function register(app: FastifyInstance) {
  app.get("/api/documents/:id/audit-facts", async (request, reply) => {
    if (!(await requireClinicalReadAccess(request, reply, "document audit facts"))) return;
    const { id } = request.params as { id: string };
    const document = documents.find((candidate) => candidate.id === id);
    if (!document) {
      return reply.code(404).send(apiError("Документ не найден"));
    }

    const patient = patients.find((candidate) => candidate.id === document.patientId);
    if (!patient) {
      return reply.code(404).send(apiError("Пациент не найден"));
    }

    return reply.send(buildDocumentAuditFacts(document, patient));
  });
}
