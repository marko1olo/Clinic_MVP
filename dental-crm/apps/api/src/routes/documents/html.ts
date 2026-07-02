import type { FastifyInstance } from "fastify";
import { requireClinicalReadAccess } from "../../accessGuard.js";
import {
  documents,
  patients,
  readIssuedDocumentSnapshot
} from "../../sampleData.js";
import {
  apiError,
  documentAttachmentFileName,
  documentHasIssuedArchiveMetadata,
  documentIssueBlockReason,
  documentIssueChainBlockReason,
  documentRequiresIssuedArchive,
  issuedArchiveIntegrityError,
  documentRenderContext
} from "../documents.js";
import { renderDocumentHtml } from "../../documents/renderDocument.js";

export async function register(app: FastifyInstance) {
  app.get<{ Params: { id: string }; Querystring: { download?: string } }>("/api/documents/:id/html", async (request, reply) => {
    if (!(await requireClinicalReadAccess(request, reply, "document html"))) return;
    const { id } = request.params as { id: string };
    const document = documents.find((candidate) => candidate.id === id);
    if (!document) {
      return reply.code(404).send(apiError("Документ не найден"));
    }

    const patient = patients.find((candidate) => candidate.id === document.patientId);
    if (!patient) {
      return reply.code(404).send(apiError("Пациент не найден"));
    }

    const issuedSnapshot = readIssuedDocumentSnapshot(document);
    if (documentRequiresIssuedArchive(document)) {
      if (!documentHasIssuedArchiveMetadata(document)) {
        return reply.code(409).send(apiError(issuedArchiveIntegrityError));
      }
      if (!issuedSnapshot) {
        return reply.code(409).send(apiError("Архивная копия выданного документа отсутствует или не прошла проверку целостности."));
      }
      if (request.query.download === "1" || request.query.download === "true") {
        reply.header("Content-Disposition", `attachment; filename="${documentAttachmentFileName(document, "html")}"`);
      }
      return reply.type("text/html; charset=utf-8").send(issuedSnapshot);
    }

    const renderContext = documentRenderContext();
    const blockReason = documentIssueBlockReason(document, patient, renderContext) ?? documentIssueChainBlockReason(document);
    if (blockReason) {
      return reply.code(409).send(apiError(`Печатная форма недоступна: ${blockReason}`));
    }

    return reply.type("text/html; charset=utf-8").send(renderDocumentHtml(document, patient, renderContext));
  });
}
