import { createHash } from "node:crypto";
import { timingSafeSecretEqual } from "../utils/timingSafeSecretEqual.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  createDenteTelegramLinkCodeSchema,
  denteTelegramBotStatusSchema,
  denteTelegramChatLinkPublicSchema,
  denteTelegramChatLinkStatusSchema,
  denteTelegramLinkCodeStatusSchema,
  denteTelegramMessagePreviewRequestSchema,
  denteTelegramOutboxDeliveryStatusSchema,
  denteTelegramOutboxSendDueResponseSchema,
  denteTelegramOutboxSendRequestSchema,
  denteTelegramOutboxSendResponseSchema,
  denteTelegramSubjectTypeSchema,
  denteTelegramTemplateKindSchema,
  denteTelegramWebhookResponseSchema,
  denteTelegramWebhookUpdateSchema,
  updateDenteTelegramBotSettingsSchema,
  type DenteTelegramBotSettings,
  type DenteTelegramFeature,
  type DenteTelegramOutboxDeliveryStatus,
  type DenteTelegramOutboxItem,
  type DenteTelegramOutboxSendDueResponse,
  type DenteTelegramOutboxSendRequest,
  type DenteTelegramOutboxSendResponse,
  type DenteTelegramPostVisitCheckupDelayHoursByTopic,
  type DenteTelegramTemplateKind,
  type DenteTelegramVisualCardUrls,
  type DenteTelegramWebhookEvent,
  type DenteTelegramUpdateKind,
  type UpdateDenteTelegramBotSettingsInput
} from "@dental/shared";
import type { BuildDenteTelegramOutboxOptions, DenteTelegramOutboxRuntimeScope, DenteTelegramOutboxStatusFilter } from "../telegram/legacyMocks.js";
import {
  buildDenteTelegramChatLinkList,
  buildDenteTelegramLinkCodeList,
  buildDenteTelegramLinkedScheduleReply,
  buildDenteTelegramOutbox,
  claimDenteTelegramOutboxDeliveryReceipt,
  claimDenteTelegramWebhookUpdate,
  consumeDenteTelegramLinkCode,
  createDenteTelegramContactRequest,
  createDenteTelegramCareRequest,
  createDenteTelegramDocumentRequest,
  createDenteTelegramLinkCode,
  denteTelegramVisualCardUrlFor,
  extractDenteTelegramLinkCode,
  findDenteTelegramOutboxDeliveryReceipt,
  getDenteTelegramBotSettings,
  handleDenteTelegramAppointmentCallback,
  hasDenteTelegramWebhookUpdate,
  listDenteTelegramChatLinks,
  listDenteTelegramLinkCodes,
  listDenteTelegramWebhookEvents,
  prepareDenteTelegramOutboxDelivery,
  recordDenteTelegramWebhookEvent,
  recordDenteTelegramOutboxDelivery,
  renderDenteTelegramMessagePreview,
  revokeDenteTelegramChatLink,
  safeDenteTelegramPublicHttpsUrl,
  updateDenteTelegramBotSettings
} from "../telegram/legacyMocks.js";
import type {
  BuildDenteTelegramChatLinkListOptions,
  BuildDenteTelegramLinkCodeListOptions,
  DenteTelegramChatLinkListStatusFilter,
  DenteTelegramLinkCodeListStatusFilter
} from "../telegram/legacyMocks.js";
import { repairMojibakeDeep, repairMojibakeText } from "../text/repairMojibake.js";
import { answerTelegramCallbackQuery, sendTelegramPhotoMessage, sendTelegramTextMessage, type TelegramTransportFailure } from "../telegramTransport.js";

const telegramSecretHeader = "x-telegram-bot-api-secret-token";
const denteAdminSecretHeader = "x-dente-admin-secret";
const telegramOutboxDeliveryClaims = new Set<string>();
const telegramLinkCodeRateLimitWindowMs = 10 * 60_000;
const telegramLinkCodeRejectedAttemptLimit = 5;
const telegramPhotoCaptionMaxLength = 1024;
const telegramSplitPhotoCaption = "DENTE: \xf1\xee\xee\xe1\xf9\xe5\xed\xe8\xe5 \xea\xeb\xe8\xed\xe8\xea\xe8. \xcf\xee\xeb\xed\xfb\xe9 \xf2\xe5\xea\xf1\xf2 \xed\xe8\xe6\xe5.";

type UnknownRecord = Record<string, unknown>;
type TelegramInlineKeyboardButton = { text: string; url?: string; callback_data?: string };
type TelegramInlineKeyboardRow = TelegramInlineKeyboardButton[];
type TelegramRouteBodySchema<T> = {
  parse(value: unknown): T;
};
type TelegramRouteBodyParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };
type TelegramChatInfo = {
  id: string;
  type: string | null;
};

type TelegramSafeCallbackAction =
  | "dente:start"
  | "dente:help"
  | "dente:clinic"
  | "dente:privacy"
  | "dente:schedule"
  | "dente:documents"
  | "dente:tax"
  | "dente:billing"
  | "dente:medical-docs"
  | "dente:patient-forms"
  | "dente:care"
  | "dente:care-extraction"
  | "dente:care-implant"
  | "dente:care-filling"
  | "dente:care-endo"
  | "dente:care-surgery"
  | "dente:care-anesthesia"
  | "dente:care-hygiene"
  | "dente:care-prosthetics"
  | "dente:care-orthodontics"
  | "dente:care-periodontology"
  | "dente:contact"
  | "dente:review"
  | "dente:map";

type TelegramWebhookReplyPackage = {
  text: string | null;
  replyMarkup: Record<string, unknown> | null;
  photoUrl?: string | null;
};
type TelegramRequestScope = {
  organizationId?: string | null;
  clinicId?: string | null;
  botConfigId?: string | null;
};
type DenteTelegramCareRequestTopic = Parameters<typeof createDenteTelegramCareRequest>[1];

type TelegramRuntimeContext = {
  settings: DenteTelegramBotSettings;
  organizationId: string;
  clinicId: string;
  botConfigId: string;
  botUsername: string | null;
  botToken: string | null;
  webhookSecret: string | null;
  tokenConfigured: boolean;
  webhookSecretConfigured: boolean;
  webhookReady: boolean;
  clinicOwnedBotReady: boolean;
};

type TelegramClinicBotEnvConfig = {
  organizationId: string | null;
  clinicId: string | null;
  botConfigId: string | null;
  botUsername: string | null;
  botToken: string | null;
  webhookSecret: string | null;
  webhookBaseUrl: string | null;
  patientPortalBaseUrl: string | null;
  welcomeImageUrl: string | null;
  visualCardUrls: Partial<DenteTelegramVisualCardUrls> | null;
  postVisitCheckupDelayHoursByTopic: Partial<DenteTelegramPostVisitCheckupDelayHoursByTopic> | null;
  reviewRequestDelayHours: number | null;
  clinicReviewUrl: string | null;
  clinicMapsUrl: string | null;
};

type TelegramRuntimeSettingsResolution = {
  settings: DenteTelegramBotSettings;
  clinicId: string;
  envConfig: TelegramClinicBotEnvConfig | null;
};

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringFromUnknown(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function readableTelegramText(value: string | null): string | null {
  return value ? repairMojibakeText(value) : null;
}

function readableTelegramPayload<T>(value: T): T {
  return repairMojibakeDeep(value);
}

function parseTelegramRouteBody<T>(schema: TelegramRouteBodySchema<T>, body: unknown): TelegramRouteBodyParseResult<T> {
  try {
    return { ok: true, value: schema.parse(body) };
  } catch {
    return {
      ok: false,
      message: "\xcd\xe5\xea\xee\xf0\xf0\xe5\xea\xf2\xed\xfb\xe9 \xe7\xe0\xef\xf0\xee\xf1 Telegram. \xcf\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xee\xe1\xff\xe7\xe0\xf2\xe5\xeb\xfc\xed\xfb\xe5 \xef\xee\xeb\xff \xe8 \xf2\xe8\xef\xfb \xe7\xed\xe0\xf7\xe5\xed\xe8\xe9."
    };
  }
}

function sendTelegramValidationError(reply: FastifyReply, error = "TelegramValidationFailed") {
  return reply.code(400).send({
    error,
    message: "\xcd\xe5\xea\xee\xf0\xf0\xe5\xea\xf2\xed\xfb\xe9 \xe7\xe0\xef\xf0\xee\xf1 Telegram. \xcf\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xee\xe1\xff\xe7\xe0\xf2\xe5\xeb\xfc\xed\xfb\xe5 \xef\xee\xeb\xff \xe8 \xf2\xe8\xef\xfb \xe7\xed\xe0\xf7\xe5\xed\xe8\xe9."
  });
}

const telegramSettingsFieldLabels: Record<string, string> = {
  botUsername: "\xc8\xec\xff Telegram-\xe1\xee\xf2\xe0",
  webhookBaseUrl: "\xc0\xe4\xf0\xe5\xf1 \xef\xf0\xe8\xe5\xec\xe0 \xf1\xee\xee\xe1\xf9\xe5\xed\xe8\xe9 Telegram",
  patientPortalBaseUrl: "\xd1\xf1\xfb\xeb\xea\xe0 \xed\xe0 \xef\xee\xf0\xf2\xe0\xeb \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0",
  welcomeImageUrl: "\xca\xe0\xf0\xf2\xe8\xed\xea\xe0 \xef\xf0\xe8\xe2\xe5\xf2\xf1\xf2\xe2\xe8\xff",
  clinicReviewUrl: "\xd1\xf1\xfb\xeb\xea\xe0 \xe4\xeb\xff \xee\xf2\xe7\xfb\xe2\xee\xe2",
  clinicMapsUrl: "\xd1\xf1\xfb\xeb\xea\xe0 \xed\xe0 \xea\xe0\xf0\xf2\xf3 \xea\xeb\xe8\xed\xe8\xea\xe8",
  "visualCardUrls.mainMenu": "\xca\xe0\xf0\xf2\xee\xf7\xea\xe0 \xe3\xeb\xe0\xe2\xed\xee\xe3\xee \xec\xe5\xed\xfe",
  "visualCardUrls.appointment": "\xca\xe0\xf0\xf2\xee\xf7\xea\xe0 \xe7\xe0\xef\xe8\xf1\xe8",
  "visualCardUrls.documents": "\xca\xe0\xf0\xf2\xee\xf7\xea\xe0 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xee\xe2",
  "visualCardUrls.tax": "\xca\xe0\xf0\xf2\xee\xf7\xea\xe0 \xed\xe0\xeb\xee\xe3\xee\xe2\xfb\xf5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xee\xe2",
  "visualCardUrls.billing": "\xca\xe0\xf0\xf2\xee\xf7\xea\xe0 \xee\xef\xeb\xe0\xf2\xfb",
  "visualCardUrls.care": "\xca\xe0\xf0\xf2\xee\xf7\xea\xe0 \xef\xe0\xec\xff\xf2\xea\xe8",
  "visualCardUrls.review": "\xca\xe0\xf0\xf2\xee\xf7\xea\xe0 \xee\xf2\xe7\xfb\xe2\xe0"
};

const telegramSettingsReasonLabels: Record<string, string> = {
  invalid_url: "\xf3\xea\xe0\xe6\xe8\xf2\xe5 \xef\xee\xeb\xed\xfb\xe9 \xe0\xe4\xf0\xe5\xf1 \xe2\xe8\xe4\xe0 https://...",
  https_required: "\xed\xf3\xe6\xed\xe0 HTTPS-\xf1\xf1\xfb\xeb\xea\xe0.",
  credentials_not_allowed: "\xf3\xe1\xe5\xf0\xe8\xf2\xe5 \xeb\xee\xe3\xe8\xed \xe8 \xef\xe0\xf0\xee\xeb\xfc \xe8\xe7 \xf1\xf1\xfb\xeb\xea\xe8.",
  invalid_path_encoding: "\xe8\xf1\xef\xf0\xe0\xe2\xfc\xf2\xe5 \xea\xee\xe4\xe8\xf0\xee\xe2\xea\xf3 \xef\xf3\xf2\xe8 \xe2 \xf1\xf1\xfb\xeb\xea\xe5.",
  patient_identifying_path_not_allowed: "\xf1\xf1\xfb\xeb\xea\xe0 \xe4\xee\xeb\xe6\xed\xe0 \xe2\xe5\xf1\xf2\xe8 \xed\xe0 \xee\xe1\xf9\xf3\xfe \xef\xf3\xe1\xeb\xe8\xf7\xed\xf3\xfe \xf1\xf2\xf0\xe0\xed\xe8\xf6\xf3 \xe1\xe5\xe7 \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0, \xef\xf0\xe8\xe5\xec\xe0, \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xe0, \xee\xef\xeb\xe0\xf2\xfb \xe8\xeb\xe8 \xf2\xee\xea\xe5\xed\xe0.",
  patient_identifying_path_value_not_allowed: "\xf3\xe1\xe5\xf0\xe8\xf2\xe5 \xe8\xe7 \xef\xf3\xf2\xe8 \xe8\xe4\xe5\xed\xf2\xe8\xf4\xe8\xea\xe0\xf2\xee\xf0\xfb \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0, \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xe0, \xf2\xe5\xeb\xe5\xf4\xee\xed\xe0 \xe8\xeb\xe8 \xeb\xe8\xf7\xed\xee\xe3\xee \xed\xee\xec\xe5\xf0\xe0.",
  patient_identifying_query_not_allowed: "\xf3\xe1\xe5\xf0\xe8\xf2\xe5 \xef\xe5\xf0\xf1\xee\xed\xe0\xeb\xfc\xed\xfb\xe5 \xef\xe0\xf0\xe0\xec\xe5\xf2\xf0\xfb \xe8\xe7 \xf1\xf1\xfb\xeb\xea\xe8.",
  patient_identifying_query_value_not_allowed: "\xf3\xe1\xe5\xf0\xe8\xf2\xe5 \xf2\xe5\xeb\xe5\xf4\xee\xed, \xc8\xcd\xcd, \xd1\xcd\xc8\xcb\xd1 \xe8\xeb\xe8 \xe4\xf0\xf3\xe3\xee\xe9 \xeb\xe8\xf7\xed\xfb\xe9 \xed\xee\xec\xe5\xf0 \xe8\xe7 \xef\xe0\xf0\xe0\xec\xe5\xf2\xf0\xee\xe2."
};

function telegramSettingsFieldLabel(fieldName: string): string {
  const normalized = fieldName.trim();
  return telegramSettingsFieldLabels[normalized] ?? telegramSettingsFieldLabels[normalized.replace(/\[(\w+)\]/g, ".$1")] ?? "\xcf\xee\xeb\xe5 Telegram";
}

function readableTelegramSettingsValidationMessage(error: unknown): string {
  const rawMessage = error instanceof Error ? repairMojibakeText(error.message).trim() : "";
  if (!rawMessage) return "\xcd\xe0\xf1\xf2\xf0\xee\xe9\xea\xe8 Telegram \xed\xe5 \xf1\xee\xf5\xf0\xe0\xed\xe5\xed\xfb. \xcf\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xef\xee\xeb\xff \xf4\xee\xf0\xec\xfb.";
  if (rawMessage.includes("DENTE_TELEGRAM_CALLBACK_SECRET") || rawMessage.includes("DENTE_TELEGRAM_WEBHOOK_SECRET")) {
    return "\xcf\xee\xe4\xef\xe8\xf1\xe0\xed\xed\xfb\xe5 \xea\xed\xee\xef\xea\xe8 \xef\xf0\xe8\xe5\xec\xe0 \xee\xf2\xea\xeb\xfe\xf7\xe5\xed\xfb; \xe2\xea\xeb\xfe\xf7\xe8\xf2\xe5 \xf1\xe5\xea\xf0\xe5\xf2 \xef\xee\xe4\xef\xe8\xf1\xe0\xed\xed\xfb\xf5 \xea\xed\xee\xef\xee\xea \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xf5 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5.";
  }
  const rawReason = telegramSettingsReasonLabels[rawMessage];
  if (rawReason) return rawReason;

  const technicalMatch = rawMessage.match(/^([^:]+):\s*([a-z0-9_]+)(?::.*)?$/);
  if (technicalMatch) {
    const fieldLabel = telegramSettingsFieldLabel(technicalMatch[1] ?? "");
    const reason = telegramSettingsReasonLabels[technicalMatch[2] ?? ""];
    if (reason) return `${fieldLabel}: ${reason}`;
  }
  return "\xcd\xe0\xf1\xf2\xf0\xee\xe9\xea\xe8 Telegram \xed\xe5 \xf1\xee\xf5\xf0\xe0\xed\xe5\xed\xfb. \xcf\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xef\xee\xeb\xff \xf4\xee\xf0\xec\xfb \xe8 \xef\xf3\xe1\xeb\xe8\xf7\xed\xfb\xe5 \xf1\xf1\xfb\xeb\xea\xe8.";
}

function readableTelegramSettingsSchemaMessage(error: unknown): string {
  const issues = Array.isArray((error as { issues?: unknown }).issues)
    ? ((error as { issues: Array<{ path?: unknown[]; message?: unknown }> }).issues)
    : [];
  const firstIssue = issues[0];
  if (!firstIssue) return "\xcd\xe0\xf1\xf2\xf0\xee\xe9\xea\xe8 Telegram \xed\xe5 \xf1\xee\xf5\xf0\xe0\xed\xe5\xed\xfb. \xcf\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xef\xee\xeb\xff \xf4\xee\xf0\xec\xfb.";

  const fieldName = Array.isArray(firstIssue.path) ? firstIssue.path.map((part) => String(part)).join(".") : "";
  const fieldLabel = telegramSettingsFieldLabel(fieldName);
  const message = typeof firstIssue.message === "string" ? repairMojibakeText(firstIssue.message).trim() : "";
  const looksTechnical = /invalid|required|expected|string|number|boolean|uuid|literal|received/i.test(message);
  if (message && !looksTechnical) return `${fieldLabel}: ${message}`;
  return `${fieldLabel}: \xef\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xe7\xed\xe0\xf7\xe5\xed\xe8\xe5 \xef\xee\xeb\xff.`;
}

type TelegramLinkCodeRejection = {
  error: "TelegramChatEncryptionKeyMissing" | "TelegramLinkCodeScopeInvalid";
  reason: "chat_encryption_missing" | "link_code_scope_invalid";
  message: string;
};

type TelegramMessagePreviewRejectionReason =
  | "patient_not_found"
  | "appointment_not_found"
  | "document_not_found"
  | "task_not_found"
  | "preview_unavailable";

const telegramLinkCodeEncryptionMissingMessage =
  "\xca\xee\xe4 \xef\xf0\xe8\xe2\xff\xe7\xea\xe8 Telegram \xed\xe5 \xe2\xfb\xef\xf3\xf9\xe5\xed: \xe2\xea\xeb\xfe\xf7\xe8\xf2\xe5 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xf3\xfe \xef\xf0\xe8\xe2\xff\xe7\xea\xf3 Telegram-\xf7\xe0\xf2\xe0 \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xf5 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5.";
const telegramLinkCodeScopeInvalidMessage =
  "\xca\xee\xe4 \xef\xf0\xe8\xe2\xff\xe7\xea\xe8 Telegram \xed\xe5 \xe2\xfb\xef\xf3\xf9\xe5\xed: \xe2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe0\xea\xf2\xe8\xe2\xed\xee\xe3\xee \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0 \xe8\xeb\xe8 \xf1\xee\xf2\xf0\xf3\xe4\xed\xe8\xea\xe0 \xf2\xe5\xea\xf3\xf9\xe5\xe9 \xea\xeb\xe8\xed\xe8\xea\xe8.";
const telegramPreviewPatientNotFoundMessage =
  "\xcf\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0 Telegram \xed\xe5 \xef\xee\xe4\xe3\xee\xf2\xee\xe2\xeb\xe5\xed: \xe2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe0\xea\xf2\xf3\xe0\xeb\xfc\xed\xee\xe3\xee \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0.";
const telegramPreviewAppointmentNotFoundMessage =
  "\xcf\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0 Telegram \xed\xe5 \xef\xee\xe4\xe3\xee\xf2\xee\xe2\xeb\xe5\xed: \xe2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe0\xea\xf2\xf3\xe0\xeb\xfc\xed\xf3\xfe \xe7\xe0\xef\xe8\xf1\xfc.";
const telegramPreviewDocumentNotFoundMessage =
  "\xcf\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0 Telegram \xed\xe5 \xef\xee\xe4\xe3\xee\xf2\xee\xe2\xeb\xe5\xed: \xe2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe0\xea\xf2\xf3\xe0\xeb\xfc\xed\xfb\xe9 \xe4\xee\xea\xf3\xec\xe5\xed\xf2.";
const telegramPreviewTaskNotFoundMessage =
  "\xcf\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0 Telegram \xed\xe5 \xef\xee\xe4\xe3\xee\xf2\xee\xe2\xeb\xe5\xed: \xe2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe0\xea\xf2\xf3\xe0\xeb\xfc\xed\xf3\xfe \xe7\xe0\xe4\xe0\xf7\xf3 \xea\xee\xec\xec\xf3\xed\xe8\xea\xe0\xf6\xe8\xe8.";
const telegramPreviewUnavailableMessage =
  "\xcf\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0 Telegram \xed\xe5 \xef\xee\xe4\xe3\xee\xf2\xee\xe2\xeb\xe5\xed: \xef\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xf8\xe0\xe1\xeb\xee\xed, \xea\xeb\xe8\xed\xe8\xea\xf3 \xe8 \xf1\xe2\xff\xe7\xe0\xed\xed\xfb\xe5 \xe7\xe0\xef\xe8\xf1\xe8.";
const telegramChatLinkNotFoundMessage =
  "\xcf\xf0\xe8\xe2\xff\xe7\xea\xe0 Telegram-\xf7\xe0\xf2\xe0 \xed\xe5 \xee\xf2\xee\xe7\xe2\xe0\xed\xe0: \xf1\xe2\xff\xe7\xfc \xed\xe5 \xed\xe0\xe9\xe4\xe5\xed\xe0 \xe8\xeb\xe8 \xf3\xe6\xe5 \xed\xe5\xe4\xee\xf1\xf2\xf3\xef\xed\xe0 \xe4\xeb\xff \xe2\xfb\xe1\xf0\xe0\xed\xed\xee\xe3\xee \xe1\xee\xf2\xe0.";

function telegramLinkCodeRejection(error: unknown): TelegramLinkCodeRejection {
  const message = error instanceof Error ? repairMojibakeText(error.message) : "";
  if (message.includes("DENTE_TELEGRAM_CHAT_ENCRYPTION_KEY") || message.includes("\xc7\xe0\xf9\xe8\xf9\xe5\xed\xed\xe0\xff \xf1\xe2\xff\xe7\xea\xe0 Telegram-\xf7\xe0\xf2\xe0")) {
    return {
      error: "TelegramChatEncryptionKeyMissing",
      reason: "chat_encryption_missing",
      message: telegramLinkCodeEncryptionMissingMessage
    };
  }
  if (message.includes("\xe0\xea\xf2\xe8\xe2\xed\xee\xec\xf3 \xef\xe0\xf6\xe8\xe5\xed\xf2\xf3") || message.includes("\xe0\xea\xf2\xe8\xe2\xed\xee\xec\xf3 \xf1\xee\xf2\xf0\xf3\xe4\xed\xe8\xea\xf3")) {
    return {
      error: "TelegramLinkCodeScopeInvalid",
      reason: "link_code_scope_invalid",
      message
    };
  }
  return {
    error: "TelegramLinkCodeScopeInvalid",
    reason: "link_code_scope_invalid",
    message: telegramLinkCodeScopeInvalidMessage
  };
}

function telegramMessagePreviewRejection(error: unknown): { reason: TelegramMessagePreviewRejectionReason; message: string } {
  const message = error instanceof Error ? repairMojibakeText(error.message) : "";
  if (message.includes("\xcf\xe0\xf6\xe8\xe5\xed\xf2 \xe4\xeb\xff \xef\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0\xe0 Telegram \xed\xe5 \xed\xe0\xe9\xe4\xe5\xed")) {
    return { reason: "patient_not_found", message: telegramPreviewPatientNotFoundMessage };
  }
  if (message.includes("\xc7\xe0\xef\xe8\xf1\xfc \xe4\xeb\xff \xef\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0\xe0 Telegram \xed\xe5 \xed\xe0\xe9\xe4\xe5\xed\xe0")) {
    return { reason: "appointment_not_found", message: telegramPreviewAppointmentNotFoundMessage };
  }
  if (message.includes("\xc4\xee\xea\xf3\xec\xe5\xed\xf2 \xe4\xeb\xff \xef\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0\xe0 Telegram \xed\xe5 \xed\xe0\xe9\xe4\xe5\xed")) {
    return { reason: "document_not_found", message: telegramPreviewDocumentNotFoundMessage };
  }
  if (message.includes("\xc7\xe0\xe4\xe0\xf7\xe0 \xea\xee\xec\xec\xf3\xed\xe8\xea\xe0\xf6\xe8\xe8 \xe4\xeb\xff \xef\xf0\xe5\xe4\xef\xf0\xee\xf1\xec\xee\xf2\xf0\xe0 Telegram \xed\xe5 \xed\xe0\xe9\xe4\xe5\xed\xe0")) {
    return { reason: "task_not_found", message: telegramPreviewTaskNotFoundMessage };
  }
  return { reason: "preview_unavailable", message: telegramPreviewUnavailableMessage };
}

const telegramTransportFailureLabels: Record<TelegramTransportFailure["errorClass"], string> = {
  rate_limited: "Telegram \xe2\xf0\xe5\xec\xe5\xed\xed\xee \xee\xe3\xf0\xe0\xed\xe8\xf7\xe8\xeb \xf7\xe0\xf1\xf2\xee\xf2\xf3 \xee\xf2\xef\xf0\xe0\xe2\xea\xe8",
  auth: "\xf2\xee\xea\xe5\xed \xe1\xee\xf2\xe0 \xed\xe5 \xef\xf0\xe8\xed\xff\xf2 Telegram",
  chat_blocked: "\xf7\xe0\xf2 \xed\xe5\xe4\xee\xf1\xf2\xf3\xef\xe5\xed \xe8\xeb\xe8 \xef\xee\xeb\xfc\xe7\xee\xe2\xe0\xf2\xe5\xeb\xfc \xe7\xe0\xe1\xeb\xee\xea\xe8\xf0\xee\xe2\xe0\xeb \xe1\xee\xf2\xe0",
  bad_request: "Telegram \xee\xf2\xea\xeb\xee\xed\xe8\xeb \xf4\xee\xf0\xec\xe0\xf2 \xf1\xee\xee\xe1\xf9\xe5\xed\xe8\xff",
  timeout: "Telegram \xed\xe5 \xee\xf2\xe2\xe5\xf2\xe8\xeb \xe7\xe0 \xee\xf2\xe2\xe5\xe4\xe5\xed\xed\xee\xe5 \xe2\xf0\xe5\xec\xff",
  network: "\xed\xe5\xf2 \xf3\xf1\xf2\xee\xe9\xf7\xe8\xe2\xee\xe3\xee \xf1\xee\xe5\xe4\xe8\xed\xe5\xed\xe8\xff \xf1 Telegram",
  server: "\xf1\xe5\xf0\xe2\xe8\xf1 Telegram \xe2\xf0\xe5\xec\xe5\xed\xed\xee \xed\xe5\xe4\xee\xf1\xf2\xf3\xef\xe5\xed",
  unknown: "\xef\xf0\xe8\xf7\xe8\xed\xe0 \xed\xe5 \xee\xef\xf0\xe5\xe4\xe5\xeb\xe5\xed\xe0"
};

function telegramRetryAfterSeconds(result: TelegramTransportFailure): number | null {
  return typeof result.retryAfterSeconds === "number" && Number.isFinite(result.retryAfterSeconds) && result.retryAfterSeconds >= 0
    ? Math.trunc(result.retryAfterSeconds)
    : null;
}

function telegramRetryAfterSuffix(result: TelegramTransportFailure): string {
  const retryAfterSeconds = telegramRetryAfterSeconds(result);
  return retryAfterSeconds !== null ? ` \xcf\xee\xe2\xf2\xee\xf0\xe8\xf2\xe5 \xee\xf2\xef\xf0\xe0\xe2\xea\xf3 \xf7\xe5\xf0\xe5\xe7 ${retryAfterSeconds} \xf1.` : "";
}

function telegramTransportFailureText(result: TelegramTransportFailure, scope: string): string {
  return `${scope}: ${telegramTransportFailureLabels[result.errorClass]}.${telegramRetryAfterSuffix(result)}`;
}

function telegramPhotoFallbackWarning(result: TelegramTransportFailure): string {
  return telegramTransportFailureText(result, "\xd4\xee\xf2\xee \xed\xe5 \xef\xf0\xe8\xed\xff\xf2\xee Telegram; \xee\xf2\xef\xf0\xe0\xe2\xeb\xe5\xed \xf2\xe5\xea\xf1\xf2\xee\xe2\xfb\xe9 \xe2\xe0\xf0\xe8\xe0\xed\xf2");
}

function telegramPhotoCaptionSplitTextWarning(result: TelegramTransportFailure): string {
  return telegramTransportFailureText(result, "\xd4\xee\xf2\xee \xef\xf0\xe8\xed\xff\xf2\xee, \xed\xee \xef\xee\xeb\xed\xfb\xe9 \xf2\xe5\xea\xf1\xf2 \xef\xee\xe4 \xed\xe8\xec \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xe5\xed");
}

function telegramOutboxTransportFailureWarning(result: TelegramTransportFailure): string {
  return telegramTransportFailureText(result, "Telegram \xed\xe5 \xef\xf0\xe8\xed\xff\xeb \xf1\xee\xee\xe1\xf9\xe5\xed\xe8\xe5");
}

function telegramCallbackTransportFailureWarning(result: TelegramTransportFailure): string {
  return telegramTransportFailureText(result, "\xce\xf2\xe2\xe5\xf2 \xed\xe0 Telegram-\xea\xed\xee\xef\xea\xf3 \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xe5\xed");
}

function telegramWebhookReplyFailureWarning(result: TelegramTransportFailure): string {
  return telegramTransportFailureText(result, "\xce\xf2\xe2\xe5\xf2 Telegram \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xe5\xed");
}

function outboxDeliveryClaimKey(outboxItemId: string, clientMutationId: string): string {
  return `${outboxItemId}:${clientMutationId}`;
}

type TelegramOutboxSendExecutionResult = {
  statusCode: number;
  body: DenteTelegramOutboxSendResponse | { error: string; message: string };
};

type TelegramOutboxSendDueInput = {
  dryRun: boolean;
  limit: number;
};

type TelegramDueWorkerLogger = {
  info: (message: unknown, ...args: unknown[]) => void;
  warn: (message: unknown, ...args: unknown[]) => void;
  error: (message: unknown, ...args: unknown[]) => void;
};

export type DenteTelegramOutboxDueWorkerHandle = {
  enabled: boolean;
  stop: () => void;
  runOnce: () => Promise<DenteTelegramOutboxSendDueResponse | null>;
};

function firstTelegramQueryValue(value: unknown): string | null {
  if (Array.isArray(value)) return firstTelegramQueryValue(value[0]);
  return stringFromUnknown(value)?.trim() || null;
}

function parseTelegramQueryPositiveInt(value: unknown, fallback: number, max: number): number {
  const raw = firstTelegramQueryValue(value);
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(max, Math.trunc(parsed)));
}

function parseTelegramOutboxStatusQuery(value: unknown): DenteTelegramOutboxStatusFilter {
  const raw = firstTelegramQueryValue(value);
  if (!raw || raw === "all" || raw === "due") return raw === "due" ? "due" : "all";
  const parsed = denteTelegramOutboxDeliveryStatusSchema.safeParse(raw);
  return parsed.success ? (parsed.data as DenteTelegramOutboxDeliveryStatus) : "all";
}

function parseTelegramOutboxTemplateQuery(value: unknown): DenteTelegramTemplateKind | "all" {
  const raw = firstTelegramQueryValue(value);
  if (!raw || raw === "all") return "all";
  const parsed = denteTelegramTemplateKindSchema.safeParse(raw);
  return parsed.success ? parsed.data : "all";
}

function parseTelegramOutboxQuery(query: unknown): BuildDenteTelegramOutboxOptions {
  const source = query && typeof query === "object" ? (query as UnknownRecord) : {};
  return {
    limit: parseTelegramQueryPositiveInt(source.limit, 80, 300),
    cursor: firstTelegramQueryValue(source.cursor),
    status: parseTelegramOutboxStatusQuery(source.status),
    templateKind: parseTelegramOutboxTemplateQuery(source.templateKind ?? source.template)
  };
}

function parseTelegramOutboxRuntimeScopeQuery(query: unknown): { organizationId: string | null; botConfigId: string | null } {
  const source = query && typeof query === "object" ? (query as UnknownRecord) : {};
  const organizationId = firstTelegramQueryValue(source.organizationId ?? source.orgId);
  const botConfigId = firstTelegramQueryValue(source.botConfigId ?? source.telegramBotConfigId ?? source.configId);
  return {
    organizationId: organizationId || (botConfigId ? getDenteTelegramBotSettings().organizationId : null),
    botConfigId
  };
}

function parseTelegramClinicScopeQuery(query: unknown): string | null {
  const source = query && typeof query === "object" ? (query as UnknownRecord) : {};
  return firstTelegramQueryValue(source.clinicId);
}

function parseTelegramSubjectTypeQuery(value: unknown): "patient" | "staff" | "all" {
  const raw = firstTelegramQueryValue(value);
  if (!raw || raw === "all") return "all";
  const parsed = denteTelegramSubjectTypeSchema.safeParse(raw);
  return parsed.success ? parsed.data : "all";
}

function parseTelegramLinkCodeStatusQuery(value: unknown): DenteTelegramLinkCodeListStatusFilter {
  const raw = firstTelegramQueryValue(value);
  if (!raw || raw === "all") return "all";
  const parsed = denteTelegramLinkCodeStatusSchema.safeParse(raw);
  return parsed.success ? parsed.data : "all";
}

function parseTelegramChatLinkStatusQuery(value: unknown): DenteTelegramChatLinkListStatusFilter {
  const raw = firstTelegramQueryValue(value);
  if (!raw || raw === "all") return "all";
  const parsed = denteTelegramChatLinkStatusSchema.safeParse(raw);
  return parsed.success ? parsed.data : "all";
}

function parseTelegramLinkCodeListQuery(query: unknown): BuildDenteTelegramLinkCodeListOptions {
  const source = query && typeof query === "object" ? (query as UnknownRecord) : {};
  const scope = parseTelegramOutboxRuntimeScopeQuery(query);
  return {
    limit: parseTelegramQueryPositiveInt(source.limit, 20, 200),
    cursor: firstTelegramQueryValue(source.cursor),
    status: parseTelegramLinkCodeStatusQuery(source.status),
    subjectType: parseTelegramSubjectTypeQuery(source.subjectType),
    subjectId: firstTelegramQueryValue(source.subjectId),
    organizationId: scope.organizationId,
    clinicId: parseTelegramClinicScopeQuery(query),
    botConfigId: scope.botConfigId
  };
}

function parseTelegramChatLinkListQuery(query: unknown): BuildDenteTelegramChatLinkListOptions {
  const source = query && typeof query === "object" ? (query as UnknownRecord) : {};
  const scope = parseTelegramOutboxRuntimeScopeQuery(query);
  return {
    limit: parseTelegramQueryPositiveInt(source.limit, 20, 200),
    cursor: firstTelegramQueryValue(source.cursor),
    status: parseTelegramChatLinkStatusQuery(source.status),
    subjectType: parseTelegramSubjectTypeQuery(source.subjectType),
    subjectId: firstTelegramQueryValue(source.subjectId),
    organizationId: scope.organizationId,
    clinicId: parseTelegramClinicScopeQuery(query),
    botConfigId: scope.botConfigId
  };
}

function parseTelegramOutboxSendDueInput(body: unknown): TelegramOutboxSendDueInput | null {
  const source = body && typeof body === "object" ? (body as UnknownRecord) : {};
  const dryRun = typeof source.dryRun === "boolean" ? source.dryRun : false;
  const limit = source.limit === undefined ? 25 : Number(source.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) return null;
  return { dryRun, limit };
}

function dueOutboxClientMutationId(outboxItemId: string, scheduledAt: string): string {
  const digest = createHash("sha256").update(`${outboxItemId}:${scheduledAt}`).digest("hex").slice(0, 40);
  return `due-${digest}`;
}

function isDenteTelegramOutboxItemDue(item: DenteTelegramOutboxItem, nowMs: number): boolean {
  const scheduledAtMs = Date.parse(item.scheduledAt);
  return !Number.isFinite(scheduledAtMs) || scheduledAtMs <= nowMs;
}

async function executeTelegramOutboxSend(
  outboxItemId: string,
  input: DenteTelegramOutboxSendRequest,
  runtime?: TelegramResolvedOutboxRuntime
): Promise<TelegramOutboxSendExecutionResult> {
  const clientMutationId = input.clientMutationId?.trim() || null;
  const replay = findDenteTelegramOutboxDeliveryReceipt(outboxItemId, clientMutationId);
  if (replay && !(replay.status === "failed" && clientMutationId?.startsWith("due-"))) {
    const body = denteTelegramOutboxSendResponseSchema.parse({
      ...replay,
      warnings: [...replay.warnings, "idempotent_replay"],
      retryAfterSeconds: null
    });
    return { statusCode: replay.status === "failed" ? 502 : replay.status === "blocked" ? 409 : 200, body };
  }

  const runtimeResult = runtime ? { ok: true as const, runtime } : resolveTelegramOutboxRuntimeScopeFromQuery({});
  if (!runtimeResult.ok) {
    return {
      statusCode: runtimeResult.statusCode,
      body: {
        error: runtimeResult.error,
        message: runtimeResult.message
      }
    };
  }

  const token = runtimeResult.runtime.context.botToken;
  const prepared = prepareDenteTelegramOutboxDelivery(outboxItemId, runtimeResult.runtime.runtimeScope);

  if (!prepared.ok) {
    return {
      statusCode: prepared.statusCode,
      body: denteTelegramOutboxSendResponseSchema.parse({
        status: "blocked",
        outboxItem: prepared.item,
        taskId: prepared.item?.taskId ?? null,
        eventId: null,
        telegramMessageId: null,
        clientMutationId,
        warnings: prepared.warnings,
        retryAfterSeconds: null,
        blockedReason: prepared.blockedReason
      })
    };
  }

  if (!input.dryRun && !clientMutationId) {
    return {
      statusCode: 400,
      body: denteTelegramOutboxSendResponseSchema.parse({
        status: "blocked",
        outboxItem: prepared.item,
        taskId: prepared.item.taskId,
        eventId: null,
        telegramMessageId: null,
        clientMutationId: null,
        warnings: [...prepared.warnings, "client_mutation_id_required"],
        retryAfterSeconds: null,
        blockedReason: "client_mutation_id_required"
      })
    };
  }

  if (!token) {
    return {
      statusCode: 409,
      body: denteTelegramOutboxSendResponseSchema.parse({
        status: "blocked",
        outboxItem: prepared.item,
        taskId: prepared.item.taskId,
        eventId: null,
        telegramMessageId: null,
        clientMutationId,
        warnings: prepared.warnings,
        retryAfterSeconds: null,
        blockedReason: "telegram_bot_token_missing"
      })
    };
  }

  if (input.dryRun) {
    return {
      statusCode: 200,
      body: denteTelegramOutboxSendResponseSchema.parse({
        status: "dry_run",
        outboxItem: prepared.item,
        taskId: prepared.item.taskId,
        eventId: null,
        telegramMessageId: null,
        clientMutationId,
        warnings: prepared.warnings,
        retryAfterSeconds: null,
        blockedReason: null
      })
    };
  }

  const deliveryClientMutationId = clientMutationId;
  if (!deliveryClientMutationId) {
    throw new Error("clientMutationId missing after non-dry-run validation");
  }

  const claimKey = outboxDeliveryClaimKey(prepared.item.id, deliveryClientMutationId);
  const durableReplay = claimDenteTelegramOutboxDeliveryReceipt(prepared.item, deliveryClientMutationId, prepared.warnings);
  if (durableReplay) {
    const body = denteTelegramOutboxSendResponseSchema.parse({
      ...durableReplay,
      warnings: [...durableReplay.warnings, "idempotent_replay"],
      retryAfterSeconds: null
    });
    return { statusCode: durableReplay.status === "failed" ? 502 : durableReplay.status === "blocked" ? 409 : 200, body };
  }
  if (telegramOutboxDeliveryClaims.has(claimKey)) {
    return {
      statusCode: 409,
      body: denteTelegramOutboxSendResponseSchema.parse({
        status: "blocked",
        outboxItem: prepared.item,
        taskId: prepared.item.taskId,
        eventId: null,
        telegramMessageId: null,
        clientMutationId: deliveryClientMutationId,
        warnings: [...prepared.warnings, "telegram_delivery_in_progress"],
        retryAfterSeconds: null,
        blockedReason: "telegram_delivery_in_progress"
      })
    };
  }

  telegramOutboxDeliveryClaims.add(claimKey);
  const deliveryText = repairMojibakeText(prepared.text);
  const deliveryReplyMarkup = readableTelegramPayload(prepared.replyMarkup);
  const deliveryWarnings = [...prepared.warnings];
  const transport = await (async () => {
    const photoUrl = prepared.photoUrl?.trim() || null;
    if (photoUrl) {
      const shouldSplitPhotoCaption = deliveryText.length > telegramPhotoCaptionMaxLength;
      const photoTransport = await sendTelegramPhotoMessage({
        botToken: token,
        chatId: prepared.chatId,
        photoUrl,
        caption: shouldSplitPhotoCaption ? telegramSplitPhotoCaption : deliveryText,
        replyMarkup: shouldSplitPhotoCaption ? null : deliveryReplyMarkup,
        timeoutMs: configuredSendTimeoutMs()
      });
      if (photoTransport.ok) {
        if (!shouldSplitPhotoCaption) return photoTransport;
        deliveryWarnings.push("telegram_photo_caption_split");
        const textTransport = await sendTelegramTextMessage({
          botToken: token,
          chatId: prepared.chatId,
          text: deliveryText,
          replyMarkup: deliveryReplyMarkup,
          timeoutMs: configuredSendTimeoutMs()
        });
        if (textTransport.ok) return textTransport;
        deliveryWarnings.push(telegramPhotoCaptionSplitTextWarning(textTransport));
        return textTransport;
      }
      deliveryWarnings.push(telegramPhotoFallbackWarning(photoTransport));
    }
    return sendTelegramTextMessage({
      botToken: token,
      chatId: prepared.chatId,
      text: deliveryText,
      replyMarkup: deliveryReplyMarkup,
      timeoutMs: configuredSendTimeoutMs()
    });
  })().finally(() => {
    telegramOutboxDeliveryClaims.delete(claimKey);
  });

  if (!transport.ok) {
    const retryAfterSeconds = telegramRetryAfterSeconds(transport);
    const transportWarning = telegramOutboxTransportFailureWarning(transport);
    const warnings = [...deliveryWarnings, transportWarning];
    const delivery = recordDenteTelegramOutboxDelivery({
      item: prepared.item,
      status: "failed",
      message: transportWarning,
      clientMutationId: deliveryClientMutationId,
      warnings,
      blockedReason: "telegram_transport_failed"
    });
    return {
      statusCode: 502,
      body: denteTelegramOutboxSendResponseSchema.parse({
        status: "failed",
        outboxItem: prepared.item,
        taskId: delivery.taskId,
        eventId: delivery.eventId,
        telegramMessageId: null,
        clientMutationId: deliveryClientMutationId,
        warnings,
        retryAfterSeconds,
        blockedReason: "telegram_transport_failed"
      })
    };
  }

  const delivery = recordDenteTelegramOutboxDelivery({
    item: prepared.item,
    status: "sent",
    telegramMessageId: transport.telegramMessageId,
    message: `Telegram safe template sent: ${prepared.item.templateKind}`,
    clientMutationId: deliveryClientMutationId,
    warnings: deliveryWarnings,
    blockedReason: null
  });

  return {
    statusCode: 200,
    body: denteTelegramOutboxSendResponseSchema.parse({
      status: "sent",
      outboxItem: prepared.item,
      taskId: delivery.taskId,
      eventId: delivery.eventId,
      telegramMessageId: transport.telegramMessageId,
      clientMutationId: deliveryClientMutationId,
      warnings: deliveryWarnings,
      retryAfterSeconds: null,
      blockedReason: null
    })
  };
}

export async function executeDenteTelegramOutboxDueBatch(
  input: TelegramOutboxSendDueInput,
  runtime?: TelegramResolvedOutboxRuntime
): Promise<DenteTelegramOutboxSendDueResponse> {
  const runtimeResult = runtime ? { ok: true as const, runtime } : resolveTelegramOutboxRuntimeScopeFromQuery({});
  if (!runtimeResult.ok) {
    return denteTelegramOutboxSendDueResponseSchema.parse({
      ok: false,
      dryRun: input.dryRun,
      requestedLimit: input.limit,
      dueCount: 0,
      notDueCount: 0,
      attemptedCount: 0,
      sentCount: 0,
      dryRunCount: 0,
      blockedCount: 1,
      failedCount: 0,
      results: [
        {
          itemId: "telegram-runtime-scope",
          statusCode: runtimeResult.statusCode,
          result: {
            error: runtimeResult.error,
            message: runtimeResult.message
          }
        }
      ]
    });
  }
  const outbox = buildDenteTelegramOutbox({ limit: Math.max(input.limit, 50), status: "due" }, runtimeResult.runtime.runtimeScope);
  const nowMs = Date.now();
  const dueItems = outbox.items
    .filter((item) => item.deliveryStatus === "ready" && isDenteTelegramOutboxItemDue(item, nowMs))
    .slice(0, input.limit);
  const results: DenteTelegramOutboxSendDueResponse["results"] = await Promise.all(
    dueItems.map(async (item) => {
      const sendResult = await executeTelegramOutboxSend(
        item.id,
        {
          dryRun: input.dryRun,
          clientMutationId: input.dryRun ? null : dueOutboxClientMutationId(item.id, item.scheduledAt)
        },
        runtimeResult.runtime
      );
      return {
        itemId: item.id,
        statusCode: sendResult.statusCode,
        result: sendResult.body
      };
    })
  );
  const sentCount = results.filter((entry) => "status" in entry.result && entry.result.status === "sent").length;
  const dryRunCount = results.filter((entry) => "status" in entry.result && entry.result.status === "dry_run").length;
  const blockedCount = results.filter((entry) => "status" in entry.result && entry.result.status === "blocked").length;
  const failedCount = results.filter((entry) => "status" in entry.result && entry.result.status === "failed").length;
  return denteTelegramOutboxSendDueResponseSchema.parse({
    ok: failedCount === 0 && blockedCount === 0,
    dryRun: input.dryRun,
    requestedLimit: input.limit,
    dueCount: outbox.dueCount,
    notDueCount: outbox.notDueCount,
    attemptedCount: results.length,
    sentCount,
    dryRunCount,
    blockedCount,
    failedCount,
    results
  });
}

function parseTelegramWorkerBoolean(value: string | undefined): boolean {
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

function parseTelegramWorkerInt(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function retryAfterDelayMs(response: DenteTelegramOutboxSendDueResponse): number | null {
  let retryAfterSeconds = 0;
  for (const entry of response.results) {
    if ("retryAfterSeconds" in entry.result) {
      const retryAfter = entry.result.retryAfterSeconds;
      if (typeof retryAfter === "number" && Number.isFinite(retryAfter)) {
        retryAfterSeconds = Math.max(retryAfterSeconds, retryAfter);
      }
    }
  }
  return retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : null;
}

export function startDenteTelegramOutboxDueWorker(options: { logger?: TelegramDueWorkerLogger } = {}): DenteTelegramOutboxDueWorkerHandle {
  const enabled = parseTelegramWorkerBoolean(process.env.DENTE_TELEGRAM_OUTBOX_WORKER_ENABLED);
  const logger = options.logger;
  if (!enabled) {
    return {
      enabled: false,
      stop: () => undefined,
      runOnce: async () => null
    };
  }

  const intervalMs = parseTelegramWorkerInt(process.env.DENTE_TELEGRAM_OUTBOX_WORKER_INTERVAL_MS, 60_000, 15_000, 15 * 60_000);
  const limit = parseTelegramWorkerInt(process.env.DENTE_TELEGRAM_OUTBOX_WORKER_BATCH_LIMIT, 10, 1, 25);
  const dryRun = parseTelegramWorkerBoolean(process.env.DENTE_TELEGRAM_OUTBOX_WORKER_DRY_RUN);
  const runOnStart = parseTelegramWorkerBoolean(process.env.DENTE_TELEGRAM_OUTBOX_WORKER_RUN_ON_START);
  let stopped = false;
  let inFlight = false;
  let skippedTicks = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const schedule = (delayMs: number) => {
    if (stopped) return;
    timer = setTimeout(() => {
      void runAndReschedule().catch((error: unknown) => {
        logger?.error({ error }, "DENTE Telegram due worker tick failed");
      });
    }, delayMs);
  };

  const runAndReschedule = async (): Promise<DenteTelegramOutboxSendDueResponse | null> => {
    if (stopped) return null;
    if (inFlight) {
      skippedTicks += 1;
      logger?.warn({ skippedTicks }, "DENTE Telegram due worker skipped overlapping tick");
      schedule(intervalMs);
      return null;
    }
    inFlight = true;
    try {
      const response = await executeDenteTelegramOutboxDueBatch({ dryRun, limit });
      const retryDelayMs = retryAfterDelayMs(response);
      logger?.info(
        {
          attemptedCount: response.attemptedCount,
          sentCount: response.sentCount,
          dryRunCount: response.dryRunCount,
          blockedCount: response.blockedCount,
          failedCount: response.failedCount,
          retryDelayMs
        },
        "DENTE Telegram due worker tick completed"
      );
      schedule(retryDelayMs ?? intervalMs);
      return response;
    } catch (error) {
      logger?.error({ error }, "DENTE Telegram due worker tick failed");
      schedule(intervalMs);
      throw error;
    } finally {
      inFlight = false;
    }
  };

  const handle: DenteTelegramOutboxDueWorkerHandle = {
    enabled: true,
    stop: () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      timer = null;
    },
    runOnce: runAndReschedule
  };
  logger?.info({ intervalMs, limit, dryRun, runOnStart }, "DENTE Telegram due worker enabled");
  schedule(runOnStart ? 0 : intervalMs);
  return handle;
}

function normalizedTelegramBotUsername(value: string | null | undefined): string | null {
  const selected = value?.trim() || null;
  const normalized = selected?.replace(/^@/, "") ?? null;
  return normalized && /^[A-Za-z][A-Za-z0-9_]{1,28}[Bb][Oo][Tt]$/.test(normalized) ? normalized : null;
}

function trimmedEnv(name: string): string | null {
  return process.env[name]?.trim() || null;
}

function stringFromEnvConfig(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function uuidFromEnvConfig(value: unknown): string | null {
  const candidate = stringFromEnvConfig(value);
  return candidate && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate)
    ? candidate
    : null;
}

function visualCardUrlsFromEnvConfig(record: UnknownRecord): Partial<DenteTelegramVisualCardUrls> | null {
  const source = isRecord(record.visualCardUrls) ? record.visualCardUrls : {};
  const urls: Partial<DenteTelegramVisualCardUrls> = {};
  const assign = (key: keyof DenteTelegramVisualCardUrls, value: string | null): void => {
    if (value) urls[key] = value;
  };
  assign("mainMenu", safeDenteTelegramPublicHttpsUrl("visualCardUrls.mainMenu", stringFromEnvConfig(source.mainMenu) ?? stringFromEnvConfig(record.mainMenuImageUrl)));
  assign(
    "appointment",
    safeDenteTelegramPublicHttpsUrl("visualCardUrls.appointment", stringFromEnvConfig(source.appointment) ?? stringFromEnvConfig(record.appointmentImageUrl))
  );
  assign("documents", safeDenteTelegramPublicHttpsUrl("visualCardUrls.documents", stringFromEnvConfig(source.documents) ?? stringFromEnvConfig(record.documentsImageUrl)));
  assign("tax", safeDenteTelegramPublicHttpsUrl("visualCardUrls.tax", stringFromEnvConfig(source.tax) ?? stringFromEnvConfig(record.taxImageUrl)));
  assign("billing", safeDenteTelegramPublicHttpsUrl("visualCardUrls.billing", stringFromEnvConfig(source.billing) ?? stringFromEnvConfig(record.billingImageUrl)));
  assign("care", safeDenteTelegramPublicHttpsUrl("visualCardUrls.care", stringFromEnvConfig(source.care) ?? stringFromEnvConfig(record.careImageUrl)));
  assign("review", safeDenteTelegramPublicHttpsUrl("visualCardUrls.review", stringFromEnvConfig(source.review) ?? stringFromEnvConfig(record.reviewImageUrl)));
  assign("staff", safeDenteTelegramPublicHttpsUrl("visualCardUrls.staff", stringFromEnvConfig(source.staff) ?? stringFromEnvConfig(record.staffImageUrl)));
  return Object.keys(urls).length ? urls : null;
}

function postVisitCheckupDelayHoursFromEnvConfig(record: UnknownRecord): Partial<DenteTelegramPostVisitCheckupDelayHoursByTopic> | null {
  const source: UnknownRecord = isRecord(record.postVisitCheckupDelayHoursByTopic)
    ? record.postVisitCheckupDelayHoursByTopic
    : isRecord(record.postVisitCheckupDelayHours)
      ? record.postVisitCheckupDelayHours
      : {};
  const delays: Partial<DenteTelegramPostVisitCheckupDelayHoursByTopic> = {};
  const assign = (key: keyof DenteTelegramPostVisitCheckupDelayHoursByTopic, value: unknown): void => {
    const parsed = typeof value === "number" ? value : typeof value === "string" ? Number.parseInt(value, 10) : NaN;
    if (Number.isFinite(parsed)) delays[key] = Math.max(1, Math.min(720, Math.floor(parsed)));
  };
  assign("extraction", source.extraction ?? record.extractionCheckupDelayHours);
  assign("implantation", source.implantation ?? record.implantationCheckupDelayHours ?? record.implantCheckupDelayHours);
  assign("filling_restoration", source.filling_restoration ?? record.fillingCheckupDelayHours);
  assign("endo", source.endo ?? record.endoCheckupDelayHours);
  assign("surgery", source.surgery ?? record.surgeryCheckupDelayHours);
  assign("local_anesthesia", source.local_anesthesia ?? record.localAnesthesiaCheckupDelayHours);
  assign("hygiene", source.hygiene ?? record.hygieneCheckupDelayHours);
  assign("prosthetics", source.prosthetics ?? record.prostheticsCheckupDelayHours);
  assign("orthodontics", source.orthodontics ?? record.orthodonticsCheckupDelayHours);
  assign("periodontology", source.periodontology ?? record.periodontologyCheckupDelayHours);
  assign("other", source.other ?? record.otherCheckupDelayHours);
  return Object.keys(delays).length ? delays : null;
}

function reviewRequestDelayHoursFromEnvConfig(record: UnknownRecord): number | null {
  const parsed =
    typeof record.reviewRequestDelayHours === "number"
      ? record.reviewRequestDelayHours
      : typeof record.reviewRequestDelayHours === "string"
        ? Number.parseInt(record.reviewRequestDelayHours, 10)
        : NaN;
  return Number.isFinite(parsed) ? Math.max(1, Math.min(720, Math.floor(parsed))) : null;
}

function clinicBotEnvConfigs(): TelegramClinicBotEnvConfig[] {
  const raw = trimmedEnv("DENTE_TELEGRAM_CLINIC_BOTS_JSON");
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  const records: unknown[] = Array.isArray(parsed)
    ? parsed
    : isRecord(parsed)
      ? Object.entries(parsed).map(([key, value]) => (isRecord(value) ? { organizationId: key, ...value } : null))
      : [];

  return records
    .filter(isRecord)
    .map((record) => ({
      organizationId: uuidFromEnvConfig(record.organizationId) ?? uuidFromEnvConfig(record.orgId),
      clinicId: uuidFromEnvConfig(record.clinicId),
      botConfigId: stringFromEnvConfig(record.botConfigId) ?? stringFromEnvConfig(record.configId),
      botUsername: normalizedTelegramBotUsername(stringFromEnvConfig(record.botUsername) ?? stringFromEnvConfig(record.username)),
      botToken: stringFromEnvConfig(record.botToken) ?? stringFromEnvConfig(record.token),
      webhookSecret: stringFromEnvConfig(record.webhookSecret) ?? stringFromEnvConfig(record.secret),
      webhookBaseUrl: safeDenteTelegramPublicHttpsUrl("webhookBaseUrl", stringFromEnvConfig(record.webhookBaseUrl)),
      patientPortalBaseUrl: safeDenteTelegramPublicHttpsUrl("patientPortalBaseUrl", stringFromEnvConfig(record.patientPortalBaseUrl)),
      welcomeImageUrl: safeDenteTelegramPublicHttpsUrl("welcomeImageUrl", stringFromEnvConfig(record.welcomeImageUrl)),
      visualCardUrls: visualCardUrlsFromEnvConfig(record),
      postVisitCheckupDelayHoursByTopic: postVisitCheckupDelayHoursFromEnvConfig(record),
      reviewRequestDelayHours: reviewRequestDelayHoursFromEnvConfig(record),
      clinicReviewUrl: safeDenteTelegramPublicHttpsUrl("clinicReviewUrl", stringFromEnvConfig(record.clinicReviewUrl)),
      clinicMapsUrl: safeDenteTelegramPublicHttpsUrl("clinicMapsUrl", stringFromEnvConfig(record.clinicMapsUrl))
    }));
}

function clinicBotEnvConfigForOrganization(
  organizationId: string,
  clinicId: string | null = null,
  botConfigId: string | null = null
): TelegramClinicBotEnvConfig | null {
  const matchingConfigs = clinicBotEnvConfigs().filter((config) => {
    const tenantMatches = config.organizationId === organizationId || config.clinicId === organizationId || (clinicId !== null && config.clinicId === clinicId);
    return tenantMatches;
  });
  if (botConfigId) {
    return matchingConfigs.find((config) => config.botConfigId === botConfigId) ?? null;
  }
  return matchingConfigs.length === 1 ? (matchingConfigs[0] ?? null) : null;
}

function clinicBotEnvConfigFor(settings: DenteTelegramBotSettings): TelegramClinicBotEnvConfig | null {
  return clinicBotEnvConfigForOrganization(settings.organizationId);
}

function runtimeSettingsForRequestedOrganization(
  requestedOrganizationId: string | null | undefined,
  requestedBotConfigId: string | null | undefined = null
): TelegramRuntimeSettingsResolution | null {
  const currentSettings = getDenteTelegramBotSettings();
  const envConfig = requestedOrganizationId
    ? clinicBotEnvConfigForOrganization(requestedOrganizationId, null, requestedBotConfigId ?? null)
    : null;
  if (envConfig?.organizationId) {
    return {
      settings: {
        ...currentSettings,
        organizationId: envConfig.organizationId,
        mode: "clinic_owned_bot",
        ownBotUsername: envConfig.botUsername,
        webhookBaseUrl: envConfig.webhookBaseUrl ?? currentSettings.webhookBaseUrl,
        patientPortalBaseUrl: envConfig.patientPortalBaseUrl ?? currentSettings.patientPortalBaseUrl,
        welcomeImageUrl: envConfig.welcomeImageUrl ?? currentSettings.welcomeImageUrl,
        visualCardUrls: {
          ...currentSettings.visualCardUrls,
          ...(envConfig.visualCardUrls ?? {})
        },
        postVisitCheckupDelayHoursByTopic: {
          ...currentSettings.postVisitCheckupDelayHoursByTopic,
          ...(envConfig.postVisitCheckupDelayHoursByTopic ?? {})
        },
        reviewRequestDelayHours: envConfig.reviewRequestDelayHours ?? currentSettings.reviewRequestDelayHours,
        clinicReviewUrl: envConfig.clinicReviewUrl ?? currentSettings.clinicReviewUrl,
        clinicMapsUrl: envConfig.clinicMapsUrl ?? currentSettings.clinicMapsUrl
      },
      clinicId: envConfig.clinicId ?? envConfig.organizationId,
      envConfig
    };
  }

  if (!requestedBotConfigId && (!requestedOrganizationId || requestedOrganizationId === currentSettings.organizationId)) {
    return {
      settings: currentSettings,
      clinicId: currentSettings.organizationId,
      envConfig: clinicBotEnvConfigFor(currentSettings)
    };
  }

  return null;
}

function configuredSharedBotUsername(settings: DenteTelegramBotSettings): string | null {
  return normalizedTelegramBotUsername(trimmedEnv("DENTE_TELEGRAM_BOT_USERNAME") || settings.botUsername || null);
}

function configuredClinicOwnedBotUsername(settings: DenteTelegramBotSettings): string | null {
  return normalizedTelegramBotUsername(
    clinicBotEnvConfigFor(settings)?.botUsername ||
      trimmedEnv("DENTE_TELEGRAM_OWN_BOT_USERNAME") ||
      trimmedEnv("DENTE_TELEGRAM_CLINIC_BOT_USERNAME") ||
      settings.ownBotUsername ||
      null
  );
}

function configuredBotUsername(settings: DenteTelegramBotSettings): string | null {
  return settings.mode === "clinic_owned_bot" ? configuredClinicOwnedBotUsername(settings) : configuredSharedBotUsername(settings);
}

function configuredSharedBotToken(): string | null {
  return trimmedEnv("DENTE_TELEGRAM_BOT_TOKEN") || trimmedEnv("TELEGRAM_BOT_TOKEN");
}

function configuredClinicOwnedBotToken(settings: DenteTelegramBotSettings): string | null {
  return (
    clinicBotEnvConfigFor(settings)?.botToken ||
    trimmedEnv("DENTE_TELEGRAM_OWN_BOT_TOKEN") ||
    trimmedEnv("DENTE_TELEGRAM_CLINIC_BOT_TOKEN")
  );
}

function configuredBotToken(settings: DenteTelegramBotSettings): string | null {
  return settings.mode === "clinic_owned_bot" ? configuredClinicOwnedBotToken(settings) : configuredSharedBotToken();
}

function configuredWebhookSecret(settings: DenteTelegramBotSettings): string | null {
  if (settings.mode === "clinic_owned_bot") {
    return (
      clinicBotEnvConfigFor(settings)?.webhookSecret ||
      trimmedEnv("DENTE_TELEGRAM_OWN_WEBHOOK_SECRET") ||
      trimmedEnv("DENTE_TELEGRAM_CLINIC_WEBHOOK_SECRET") ||
      trimmedEnv("DENTE_TELEGRAM_WEBHOOK_SECRET")
    );
  }
  return trimmedEnv("DENTE_TELEGRAM_WEBHOOK_SECRET");
}

function telegramBotConfigId(settings: DenteTelegramBotSettings, botUsername: string | null): string {
  if (settings.mode === "clinic_owned_bot") {
    return `clinic_owned_bot:${settings.organizationId}:${(botUsername ?? "unconfigured").toLowerCase()}`;
  }
  if (settings.mode === "disabled") return `disabled:${settings.organizationId}`;
  return `shared_dente_bot:${settings.organizationId}`;
}

function resolveTelegramRuntimeContext(
  requestedOrganizationId: string | null | undefined = null,
  requestedBotConfigId: string | null | undefined = null
):
  | { ok: true; context: TelegramRuntimeContext }
  | { ok: false; statusCode: number; error: string; message: string } {
  const runtimeSettings = runtimeSettingsForRequestedOrganization(requestedOrganizationId, requestedBotConfigId);
  if (!runtimeSettings) {
    return {
      ok: false,
      statusCode: 404,
      error: "TelegramTenantNotFound",
      message: "Telegram webhook \xee\xf2\xed\xee\xf1\xe8\xf2\xf1\xff \xea \xe4\xf0\xf3\xe3\xee\xe9 \xee\xf0\xe3\xe0\xed\xe8\xe7\xe0\xf6\xe8\xe8 DENTE."
    };
  }

  const { settings } = runtimeSettings;
  const botUsername =
    settings.mode === "clinic_owned_bot" && runtimeSettings.envConfig?.botUsername
      ? runtimeSettings.envConfig.botUsername
      : configuredBotUsername(settings);
  const botToken =
    settings.mode === "clinic_owned_bot" && runtimeSettings.envConfig?.botToken
      ? runtimeSettings.envConfig.botToken
      : configuredBotToken(settings);
  const webhookSecret =
    settings.mode === "clinic_owned_bot" && runtimeSettings.envConfig?.webhookSecret
      ? runtimeSettings.envConfig.webhookSecret
      : configuredWebhookSecret(settings);
  const tokenConfigured = Boolean(botToken);
  const webhookSecretConfigured = Boolean(webhookSecret);
  const clinicOwnedBotReady = settings.mode === "clinic_owned_bot" && Boolean(botUsername && botToken);

  return {
    ok: true,
    context: {
      settings,
      organizationId: settings.organizationId,
      clinicId: runtimeSettings.clinicId,
      botConfigId: runtimeSettings.envConfig?.botConfigId ?? telegramBotConfigId(settings, botUsername),
      botUsername,
      botToken,
      webhookSecret,
      tokenConfigured,
      webhookSecretConfigured,
      webhookReady: settings.mode !== "disabled" && tokenConfigured && webhookSecretConfigured,
      clinicOwnedBotReady
    }
  };
}

function denteTelegramOutboxRuntimeScope(runtime: TelegramRuntimeContext): DenteTelegramOutboxRuntimeScope {
  return {
    settings: runtime.settings,
    botTokenConfigured: runtime.tokenConfigured,
    botConfigId: runtime.botConfigId,
    clinicId: runtime.clinicId
  };
}

type TelegramResolvedOutboxRuntime = {
  context: TelegramRuntimeContext;
  runtimeScope: DenteTelegramOutboxRuntimeScope;
};

function denteTelegramResolvedOutboxRuntime(runtime: TelegramRuntimeContext): TelegramResolvedOutboxRuntime {
  return {
    context: runtime,
    runtimeScope: denteTelegramOutboxRuntimeScope(runtime)
  };
}

function resolveTelegramOutboxRuntimeScopeFromQuery(query: unknown):
  | { ok: true; runtime: TelegramResolvedOutboxRuntime }
  | { ok: false; statusCode: number; error: string; message: string } {
  const scope = parseTelegramOutboxRuntimeScopeQuery(query);
  const runtimeResult = resolveTelegramRuntimeContext(scope.organizationId, scope.botConfigId);
  if (!runtimeResult.ok) return runtimeResult;
  return { ok: true, runtime: denteTelegramResolvedOutboxRuntime(runtimeResult.context) };
}

function configuredTelegramAdminSecret(): string | null {
  return process.env.DENTE_TELEGRAM_ADMIN_SECRET?.trim() || null;
}

function isExplicitlyUnguardedControlPlaneAllowed(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DENTE_TELEGRAM_ALLOW_UNGUARDED_CONTROL_PLANE === "1";
}

async function requireTelegramControlPlaneAccess(request: FastifyRequest, reply: FastifyReply) {
  const adminSecret = configuredTelegramAdminSecret();
  if (!adminSecret) {
    if (isExplicitlyUnguardedControlPlaneAllowed()) {
      return;
    }
    return reply.code(503).send({
      error: "TelegramAdminSecretMissing",
      message: "\xcd\xe0 \xf1\xe5\xf0\xe2\xe5\xf0\xe5 \xed\xe5 \xe7\xe0\xe4\xe0\xed \xf1\xe5\xea\xf0\xe5\xf2 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0 \xe4\xeb\xff \xf3\xef\xf0\xe0\xe2\xeb\xe5\xed\xe8\xff Telegram. \xc4\xeb\xff \xeb\xee\xea\xe0\xeb\xfc\xed\xee\xe3\xee \xf1\xf2\xe5\xed\xe4\xe0 \xec\xee\xe6\xed\xee \xff\xe2\xed\xee \xe2\xea\xeb\xfe\xf7\xe8\xf2\xfc \xf0\xe5\xe6\xe8\xec \xe1\xe5\xe7 \xef\xf0\xee\xe2\xe5\xf0\xea\xe8 \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xf5 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5."
    });
  }
  const providedSecret = request.headers[denteAdminSecretHeader];
  const normalizedProvidedSecret = Array.isArray(providedSecret) ? providedSecret[0] : providedSecret;
  if (!timingSafeSecretEqual(typeof normalizedProvidedSecret === "string" ? normalizedProvidedSecret : null, adminSecret)) {
    return reply.code(403).send({
      error: "TelegramAdminSecretRequired",
      message: "\xc4\xeb\xff \xf3\xef\xf0\xe0\xe2\xeb\xe5\xed\xe8\xff Telegram \xed\xf3\xe6\xe5\xed \xe4\xe5\xe9\xf1\xf2\xe2\xf3\xfe\xf9\xe8\xe9 \xf1\xe5\xea\xf0\xe5\xf2 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0 \xea\xeb\xe8\xed\xe8\xea\xe8."
    });
  }
}

function configuredSendTimeoutMs(): number {
  const raw = process.env.DENTE_TELEGRAM_SEND_TIMEOUT_MS?.trim();
  if (!raw) return 12_000;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? Math.max(1000, Math.min(60_000, parsed)) : 12_000;
}

function chatFingerprint(chatId: string | null, organizationId: string): string | null {
  if (!chatId) return null;
  const salt = process.env.DENTE_TELEGRAM_CHAT_HASH_SALT?.trim() || organizationId;
  return createHash("sha256").update(`${salt}:${chatId}`).digest("hex").slice(0, 24);
}

function rejectedTelegramLinkCodeAttemptCount(
  chatFingerprintValue: string | null,
  organizationId: string,
  botConfigId: string,
  nowMs = Date.now()
): number {
  if (!chatFingerprintValue) return 0;
  const windowStartedAt = nowMs - telegramLinkCodeRateLimitWindowMs;
  return listDenteTelegramWebhookEvents(300, organizationId, botConfigId).filter((event) => {
    if (event.chatFingerprint !== chatFingerprintValue) return false;
    if (event.action !== "rejected_telegram_link_code" && event.action !== "rate_limited_telegram_link_code") return false;
    const createdAtMs = Date.parse(event.createdAt);
    return Number.isFinite(createdAtMs) && createdAtMs >= windowStartedAt;
  }).length;
}

function telegramLinkCodeRateLimitExceeded(
  chatFingerprintValue: string | null,
  organizationId: string,
  botConfigId: string
): boolean {
  return rejectedTelegramLinkCodeAttemptCount(chatFingerprintValue, organizationId, botConfigId) >= telegramLinkCodeRejectedAttemptLimit;
}

function normalizeCommand(text: string | null): string | null {
  if (!text?.startsWith("/")) return null;
  const command = text.split(/\s+/)[0]?.toLowerCase() ?? "";
  return command.slice(0, 64) || null;
}

function detectUpdateKind(update: UnknownRecord): DenteTelegramUpdateKind {
  if (isRecord(update.callback_query)) return "callback_query";

  const message =
    (isRecord(update.message) && update.message) ||
    (isRecord(update.edited_message) && update.edited_message) ||
    (isRecord(update.channel_post) && update.channel_post) ||
    null;
  if (!message) return "unsupported";

  if (isRecord(message.voice)) return "voice";
  if (Array.isArray(message.photo) && message.photo.length > 0) return "photo";
  if (isRecord(message.document)) return "document";
  const text = stringFromUnknown(message.text)?.trim() ?? null;
  if (normalizeCommand(text)) return "command";
  if (text) return "message";
  return "unsupported";
}

function extractChatInfo(update: UnknownRecord): TelegramChatInfo | null {
  const candidates = [
    isRecord(update.message) ? update.message : null,
    isRecord(update.edited_message) ? update.edited_message : null,
    isRecord(update.channel_post) ? update.channel_post : null,
    isRecord(update.callback_query) && isRecord(update.callback_query.message) ? update.callback_query.message : null
  ];

  for (const message of candidates) {
    if (!message || !isRecord(message.chat)) continue;
    const id = stringFromUnknown(message.chat.id);
    if (id) {
      return {
        id,
        type: stringFromUnknown(message.chat.type)?.trim().toLowerCase() ?? null
      };
    }
  }
  return null;
}

function extractCommand(update: UnknownRecord): string | null {
  const message = isRecord(update.message) ? update.message : null;
  const text = stringFromUnknown(message?.text)?.trim() ?? null;
  return normalizeCommand(text);
}

function extractCallbackQueryId(update: UnknownRecord): string | null {
  const callbackQuery = isRecord(update.callback_query) ? update.callback_query : null;
  return stringFromUnknown(callbackQuery?.id)?.trim() ?? null;
}

function extractCallbackData(update: UnknownRecord): string | null {
  const callbackQuery = isRecord(update.callback_query) ? update.callback_query : null;
  return stringFromUnknown(callbackQuery?.data)?.trim() ?? null;
}

function extractSafeCallbackAction(update: UnknownRecord): TelegramSafeCallbackAction | null {
  const callbackQuery = isRecord(update.callback_query) ? update.callback_query : null;
  const data = stringFromUnknown(callbackQuery?.data)?.trim() ?? null;
  if (
    data === "dente:start" ||
    data === "dente:help" ||
    data === "dente:clinic" ||
    data === "dente:privacy" ||
    data === "dente:schedule" ||
    data === "dente:documents" ||
    data === "dente:tax" ||
    data === "dente:billing" ||
    data === "dente:medical-docs" ||
    data === "dente:patient-forms" ||
    data === "dente:care" ||
    data === "dente:care-extraction" ||
    data === "dente:care-implant" ||
    data === "dente:care-filling" ||
    data === "dente:care-endo" ||
    data === "dente:care-surgery" ||
    data === "dente:care-anesthesia" ||
    data === "dente:care-hygiene" ||
    data === "dente:care-prosthetics" ||
    data === "dente:care-orthodontics" ||
    data === "dente:care-periodontology" ||
    data === "dente:contact" ||
    data === "dente:review" ||
    data === "dente:map"
  ) {
    return data;
  }
  return null;
}

function extractMessageText(update: UnknownRecord): string | null {
  const message =
    (isRecord(update.message) && update.message) ||
    (isRecord(update.edited_message) && update.edited_message) ||
    (isRecord(update.channel_post) && update.channel_post) ||
    null;
  return stringFromUnknown(message?.text)?.trim() ?? null;
}

type TelegramPortalSection = "home" | "documents" | "tax" | "care" | "schedule" | "billing";

function portalButton(settings: DenteTelegramBotSettings, section: TelegramPortalSection = "home"): TelegramInlineKeyboardRow {
  const raw = settings.patientPortalBaseUrl?.trim();
  if (!raw) return [];
  try {
    const portal = new URL(raw);
    if (portal.protocol !== "https:") return [];
    portal.search = "";
    portal.searchParams.set("dente_source", "telegram");
    portal.searchParams.set("dente_section", section);
    portal.hash = "";
    return [{ text: "\xce\xf2\xea\xf0\xfb\xf2\xfc DENTE", url: portal.toString() }];
  } catch {
    return [];
  }
}

function safeHttpsTelegramButton(raw: string | null | undefined, text: string): TelegramInlineKeyboardRow {
  const value = raw?.trim();
  if (!value) return [];
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? [{ text, url: url.toString() }] : [];
  } catch {
    return [];
  }
}

function reviewButtons(settings: DenteTelegramBotSettings): TelegramInlineKeyboardRow {
  return [
    ...safeHttpsTelegramButton(settings.clinicReviewUrl, "\xce\xf6\xe5\xed\xe8\xf2\xfc \xea\xeb\xe8\xed\xe8\xea\xf3"),
    ...safeHttpsTelegramButton(settings.clinicMapsUrl, "\xce\xf2\xea\xf0\xfb\xf2\xfc \xea\xe0\xf0\xf2\xf3")
  ];
}

function mapButtons(settings: DenteTelegramBotSettings): TelegramInlineKeyboardRow {
  return safeHttpsTelegramButton(settings.clinicMapsUrl, "\xce\xf2\xea\xf0\xfb\xf2\xfc \xea\xe0\xf0\xf2\xf3");
}

function telegramInlineKeyboardRows(markup: Record<string, unknown> | null): TelegramInlineKeyboardRow[] {
  const rows = markup?.inline_keyboard;
  if (!Array.isArray(rows)) return [];
  return rows.filter(
    (row): row is TelegramInlineKeyboardRow =>
      Array.isArray(row) && row.every((button) => isRecord(button) && typeof button.text === "string")
  );
}

function mainMenuTelegramRow(): TelegramInlineKeyboardRow {
  return [{ text: "\xc3\xeb\xe0\xe2\xed\xee\xe5 \xec\xe5\xed\xfe", callback_data: "dente:start" }];
}

const telegramCareCallbackTopicByAction: Partial<Record<TelegramSafeCallbackAction, DenteTelegramCareRequestTopic>> = {
  "dente:care-extraction": "extraction",
  "dente:care-implant": "implant",
  "dente:care-filling": "filling",
  "dente:care-endo": "endo",
  "dente:care-surgery": "surgery",
  "dente:care-anesthesia": "anesthesia",
  "dente:care-hygiene": "hygiene",
  "dente:care-prosthetics": "prosthetics",
  "dente:care-orthodontics": "orthodontics",
  "dente:care-periodontology": "periodontology"
};

function careTopicFromFreeText(text: string): DenteTelegramCareRequestTopic | null {
  if (freeTextIncludes(text, ["\xf3\xe4\xe0\xeb\xe5\xed", "\xeb\xf3\xed\xea\xe0", "\xeb\xf3\xed\xea\xf3"])) return "extraction";
  if (freeTextIncludes(text, ["\xe8\xec\xef\xeb\xe0\xed"])) return "implant";
  if (freeTextIncludes(text, ["\xef\xeb\xee\xec\xe1", "\xf0\xe5\xf1\xf2\xe0\xe2\xf0\xe0\xf6"])) return "filling";
  if (freeTextIncludes(text, ["\xfd\xed\xe4\xee", "\xea\xe0\xed\xe0\xeb", "\xed\xe5\xf0\xe2"])) return "endo";
  if (freeTextIncludes(text, ["\xf5\xe8\xf0\xf3\xf0\xe3", "\xee\xef\xe5\xf0\xe0\xf6", "\xf8\xee\xe2", "\xf8\xe2\xfb"])) return "surgery";
  if (freeTextIncludes(text, ["\xe0\xed\xe5\xf1\xf2\xe5\xe7", "\xee\xed\xe5\xec\xe5\xed", "\xee\xed\xe5\xec\xe5\xeb"])) return "anesthesia";
  if (freeTextIncludes(text, ["\xe3\xe8\xe3\xe8\xe5\xed", "\xf7\xe8\xf1\xf2\xea", "\xef\xf0\xee\xf4\xe3\xe8\xe3\xe8\xe5\xed"])) return "hygiene";
  if (freeTextIncludes(text, ["\xef\xf0\xee\xf2\xe5\xe7", "\xea\xee\xf0\xee\xed\xea", "\xe2\xe8\xed\xe8\xf0", "\xec\xee\xf1\xf2"])) return "prosthetics";
  if (freeTextIncludes(text, ["\xee\xf0\xf2\xee\xe4\xee\xed\xf2", "\xe1\xf0\xe5\xea\xe5\xf2", "\xfd\xeb\xe0\xe9\xed\xe5\xf0", "\xea\xe0\xef\xef"])) return "orthodontics";
  if (freeTextIncludes(text, ["\xef\xe0\xf0\xee\xe4\xee\xed\xf2", "\xe4\xe5\xf1\xed", "\xea\xfe\xf0\xe5\xf2\xe0\xe6"])) return "periodontology";
  return null;
}

function replyMarkupWithNextActions(primaryRows: TelegramInlineKeyboardRow[], settings: DenteTelegramBotSettings): Record<string, unknown> | null {
  const rows = [
    ...primaryRows.filter((row) => row.length),
    ...telegramInlineKeyboardRows(safeCommandKeyboard(settings, "appointment_callback"))
  ];
  return rows.length ? { inline_keyboard: rows } : null;
}

function safeCommandKeyboard(
  settings: DenteTelegramBotSettings,
  mode: "start" | "help" | "clinic" | "privacy" | "linked" | "rejected" | "appointment_callback"
): Record<string, unknown> | null {
  const portal = portalButton(settings, mode === "appointment_callback" || mode === "linked" ? "schedule" : "home");
  const review = reviewButtons(settings);
  const maps = mapButtons(settings);
  const schedule = [{ text: "\xd0\xe0\xf1\xef\xe8\xf1\xe0\xed\xe8\xe5", callback_data: "dente:schedule" }];
  const documents = [{ text: "\xc4\xee\xea\xf3\xec\xe5\xed\xf2\xfb", callback_data: "dente:documents" }];
  const care = [{ text: "\xcf\xe0\xec\xff\xf2\xea\xe8", callback_data: "dente:care" }];
  const contact = [{ text: "\xcf\xee\xe7\xe2\xe0\xf2\xfc \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0", callback_data: "dente:contact" }];
  const privacy = [{ text: "\xca\xee\xed\xf4\xe8\xe4\xe5\xed\xf6\xe8\xe0\xeb\xfc\xed\xee\xf1\xf2\xfc", callback_data: "dente:privacy" }];
  const home = mainMenuTelegramRow();
  if (mode === "appointment_callback") {
    const rows = [[...schedule, ...documents], [...contact, ...privacy], home, portal].filter((row) => row.length);
    return rows.length ? { inline_keyboard: rows } : null;
  }
  if (mode === "linked") {
    const rows = [[...schedule, ...documents], [...care, ...contact], home, portal, review].filter((row) => row.length);
    return rows.length ? { inline_keyboard: rows } : null;
  }
  if (mode === "rejected") {
    return {
      inline_keyboard: [
        [{ text: "\xcf\xee\xeb\xf3\xf7\xe8\xf2\xfc QR \xe2 \xea\xeb\xe8\xed\xe8\xea\xe5", callback_data: "dente:clinic" }],
        [...documents, ...care],
        contact,
        home,
        portal
      ].filter((row) => row.length)
    };
  }
  if (mode === "clinic") {
    return {
      inline_keyboard: [
        portal,
        maps,
        [...schedule, ...contact],
        [
          { text: "\xcf\xee\xec\xee\xf9\xfc", callback_data: "dente:help" },
          { text: "\xca\xee\xed\xf4\xe8\xe4\xe5\xed\xf6\xe8\xe0\xeb\xfc\xed\xee\xf1\xf2\xfc", callback_data: "dente:privacy" }
        ],
        home
      ].filter((row) => row.length)
    };
  }
  if (mode === "privacy") {
    return {
      inline_keyboard: [
        [
          { text: "\xd7\xf2\xee \xf3\xec\xe5\xe5\xf2 \xe1\xee\xf2", callback_data: "dente:help" },
          { text: "\xcf\xee\xe4\xea\xeb\xfe\xf7\xe5\xed\xe8\xe5", callback_data: "dente:clinic" }
        ],
        [...schedule, ...documents],
        care,
        home,
        portal
      ].filter((row) => row.length)
    };
  }

  return {
    inline_keyboard: [
      [
        { text: "\xcf\xee\xe4\xea\xeb\xfe\xf7\xe8\xf2\xfc \xea\xeb\xe8\xed\xe8\xea\xf3", callback_data: "dente:clinic" },
        { text: "\xca\xee\xed\xf4\xe8\xe4\xe5\xed\xf6\xe8\xe0\xeb\xfc\xed\xee\xf1\xf2\xfc", callback_data: "dente:privacy" }
      ],
      [
        { text: "\xc4\xee\xea\xf3\xec\xe5\xed\xf2\xfb", callback_data: "dente:documents" },
        { text: "\xcf\xe0\xec\xff\xf2\xea\xe8", callback_data: "dente:care" }
      ],
      review.length
        ? review
        : [
            { text: "\xce\xf2\xe7\xfb\xe2\xfb", callback_data: "dente:review" },
            { text: "\xca\xe0\xf0\xf2\xe0", callback_data: "dente:map" }
          ],
      [
        { text: "\xd0\xe0\xf1\xef\xe8\xf1\xe0\xed\xe8\xe5", callback_data: "dente:schedule" },
        { text: "\xcf\xee\xe7\xe2\xe0\xf2\xfc \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0", callback_data: "dente:contact" }
      ],
      portal
    ].filter((row) => row.length)
  };
}

function reviewReplyFor(settings: DenteTelegramBotSettings): TelegramWebhookReplyPackage {
  const buttons = reviewButtons(settings);
  if (!buttons.length) {
    return {
      text: "\xd1\xf1\xfb\xeb\xea\xe0 \xe4\xeb\xff \xee\xf6\xe5\xed\xea\xe8 \xea\xeb\xe8\xed\xe8\xea\xe8 \xef\xee\xea\xe0 \xed\xe5 \xed\xe0\xf1\xf2\xf0\xee\xe5\xed\xe0. \xcf\xee\xef\xf0\xee\xf1\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0 \xe4\xee\xe1\xe0\xe2\xe8\xf2\xfc \xf1\xf1\xfb\xeb\xea\xf3 \xed\xe0 \xee\xf2\xe7\xfb\xe2\xfb \xe8\xeb\xe8 \xea\xe0\xf0\xf2\xee\xf7\xea\xf3 \xea\xeb\xe8\xed\xe8\xea\xe8 \xe2 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 DENTE.",
      replyMarkup: safeCommandKeyboard(settings, "help")
    };
  }
  return {
    text: "\xd1\xef\xe0\xf1\xe8\xe1\xee \xe7\xe0 \xe2\xe8\xe7\xe8\xf2. \xcc\xee\xe6\xed\xee \xee\xf1\xf2\xe0\xe2\xe8\xf2\xfc \xee\xf2\xe7\xfb\xe2 \xee \xea\xeb\xe8\xed\xe8\xea\xe5 \xef\xee \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xee\xe9 \xee\xe1\xf9\xe5\xe9 \xf1\xf1\xfb\xeb\xea\xe5 \xed\xe8\xe6\xe5.",
    replyMarkup: replyMarkupWithNextActions([buttons], settings),
    photoUrl: patientMenuCardPhoto(settings, "review")
  };
}

function mapReplyFor(settings: DenteTelegramBotSettings): TelegramWebhookReplyPackage {
  const buttons = mapButtons(settings);
  if (!buttons.length) {
    return {
      text: "\xd1\xf1\xfb\xeb\xea\xe0 \xed\xe0 \xea\xe0\xf0\xf2\xf3 \xea\xeb\xe8\xed\xe8\xea\xe8 \xef\xee\xea\xe0 \xed\xe5 \xed\xe0\xf1\xf2\xf0\xee\xe5\xed\xe0. \xcf\xee\xef\xf0\xee\xf1\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0 \xe4\xee\xe1\xe0\xe2\xe8\xf2\xfc \xea\xe0\xf0\xf2\xee\xf7\xea\xf3 \xea\xeb\xe8\xed\xe8\xea\xe8 \xe2 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 DENTE.",
      replyMarkup: safeCommandKeyboard(settings, "clinic")
    };
  }
  return {
    text: "\xca\xe0\xf0\xf2\xe0 \xea\xeb\xe8\xed\xe8\xea\xe8 \xe4\xee\xf1\xf2\xf3\xef\xed\xe0 \xef\xee \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xee\xe9 \xee\xe1\xf9\xe5\xe9 \xf1\xf1\xfb\xeb\xea\xe5 \xed\xe8\xe6\xe5.",
    replyMarkup: replyMarkupWithNextActions([buttons], settings),
    photoUrl: patientMenuCardPhoto(settings, "review")
  };
}

function patientMenuCardPhoto(settings: DenteTelegramBotSettings, cardKey: keyof DenteTelegramVisualCardUrls = "mainMenu"): string | null {
  return denteTelegramVisualCardUrlFor(settings, cardKey);
}

function documentsReplyFor(settings: DenteTelegramBotSettings): TelegramWebhookReplyPackage {
  const portal = portalButton(settings, "documents");
  const rows = [
    [
      { text: "\xcd\xe0\xeb\xee\xe3\xee\xe2\xe0\xff", callback_data: "dente:tax" },
      { text: "\xce\xef\xeb\xe0\xf2\xe0 \xe8 \xf7\xe5\xea\xe8", callback_data: "dente:billing" }
    ],
    [
      { text: "\xcc\xe5\xe4\xea\xe0\xf0\xf2\xe0", callback_data: "dente:medical-docs" }
    ],
    [{ text: "\xd4\xee\xf0\xec\xfb \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0", callback_data: "dente:patient-forms" }],
    portal,
    [
      { text: "\xcf\xee\xe7\xe2\xe0\xf2\xfc \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0", callback_data: "dente:contact" },
      { text: "\xcf\xe0\xec\xff\xf2\xea\xe8", callback_data: "dente:care" }
    ],
    mainMenuTelegramRow()
  ].filter((row) => row.length);
  return {
    text:
      "DENTE: \xe4\xee\xe3\xee\xe2\xee\xf0\xfb, \xf1\xee\xe3\xeb\xe0\xf1\xe8\xff, \xe0\xea\xf2\xfb, \xf1\xf7\xe5\xf2\xe0, \xf7\xe5\xea\xe8, \xe2\xee\xe7\xe2\xf0\xe0\xf2\xfb \xe8 \xed\xe0\xeb\xee\xe3\xee\xe2\xfb\xe5 \xf1\xef\xf0\xe0\xe2\xea\xe8 \xee\xf2\xea\xf0\xfb\xe2\xe0\xfe\xf2\xf1\xff \xf2\xee\xeb\xfc\xea\xee \xe2 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xee\xec \xef\xee\xf0\xf2\xe0\xeb\xe5 \xea\xeb\xe8\xed\xe8\xea\xe8. \xc2 Telegram \xe4\xee\xf1\xf2\xf3\xef\xed\xfb \xf3\xe2\xe5\xe4\xee\xec\xeb\xe5\xed\xe8\xff \xe8 \xea\xed\xee\xef\xea\xe0 \xef\xe5\xf0\xe5\xf5\xee\xe4\xe0, \xe1\xe5\xe7 \xe2\xeb\xee\xe6\xe5\xed\xe8\xe9 \xf1 \xec\xe5\xe4\xe4\xe0\xed\xed\xfb\xec\xe8.",
    replyMarkup: rows.length ? { inline_keyboard: rows } : safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, "documents")
  };
}

function careReplyFor(settings: DenteTelegramBotSettings): TelegramWebhookReplyPackage {
  const portal = portalButton(settings, "care");
  const rows = [
    [
      { text: "\xcf\xee\xf1\xeb\xe5 \xf3\xe4\xe0\xeb\xe5\xed\xe8\xff", callback_data: "dente:care-extraction" },
      { text: "\xcf\xee\xf1\xeb\xe5 \xe8\xec\xef\xeb\xe0\xed\xf2\xe0\xf6\xe8\xe8", callback_data: "dente:care-implant" }
    ],
    [
      { text: "\xcf\xee\xf1\xeb\xe5 \xef\xeb\xee\xec\xe1\xfb", callback_data: "dente:care-filling" },
      { text: "\xcf\xee\xf1\xeb\xe5 \xfd\xed\xe4\xee\xe4\xee\xed\xf2\xe8\xe8", callback_data: "dente:care-endo" }
    ],
    [
      { text: "\xcf\xee\xf1\xeb\xe5 \xf5\xe8\xf0\xf3\xf0\xe3\xe8\xe8", callback_data: "dente:care-surgery" },
      { text: "\xcf\xee\xf1\xeb\xe5 \xe0\xed\xe5\xf1\xf2\xe5\xe7\xe8\xe8", callback_data: "dente:care-anesthesia" }
    ],
    [
      { text: "\xcf\xee\xf1\xeb\xe5 \xe3\xe8\xe3\xe8\xe5\xed\xfb", callback_data: "dente:care-hygiene" }
    ],
    [
      { text: "\xcf\xee\xf1\xeb\xe5 \xef\xf0\xee\xf2\xe5\xe7\xe8\xf0\xee\xe2\xe0\xed\xe8\xff", callback_data: "dente:care-prosthetics" },
      { text: "\xcf\xee\xf1\xeb\xe5 \xee\xf0\xf2\xee\xe4\xee\xed\xf2\xe8\xe8", callback_data: "dente:care-orthodontics" }
    ],
    [
      { text: "\xcf\xee\xf1\xeb\xe5 \xef\xe0\xf0\xee\xe4\xee\xed\xf2\xee\xeb\xee\xe3\xe8\xe8", callback_data: "dente:care-periodontology" }
    ],
    portal,
    [
      { text: "\xc4\xee\xea\xf3\xec\xe5\xed\xf2\xfb", callback_data: "dente:documents" },
      { text: "\xcf\xee\xe7\xe2\xe0\xf2\xfc \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0", callback_data: "dente:contact" }
    ],
    mainMenuTelegramRow()
  ].filter((row) => row.length);
  return {
    text:
      "DENTE: \xef\xe0\xec\xff\xf2\xea\xe8 \xef\xee\xf1\xeb\xe5 \xf3\xe4\xe0\xeb\xe5\xed\xe8\xff, \xe8\xec\xef\xeb\xe0\xed\xf2\xe0\xf6\xe8\xe8, \xef\xeb\xee\xec\xe1\xfb, \xfd\xed\xe4\xee\xe4\xee\xed\xf2\xe8\xe8, \xf5\xe8\xf0\xf3\xf0\xe3\xe8\xe8, \xe0\xed\xe5\xf1\xf2\xe5\xe7\xe8\xe8, \xe3\xe8\xe3\xe8\xe5\xed\xfb, \xef\xf0\xee\xf2\xe5\xe7\xe8\xf0\xee\xe2\xe0\xed\xe8\xff, \xee\xf0\xf2\xee\xe4\xee\xed\xf2\xe8\xe8 \xe8 \xef\xe0\xf0\xee\xe4\xee\xed\xf2\xee\xeb\xee\xe3\xe8\xe8 \xe2\xfb\xe4\xe0\xfe\xf2\xf1\xff \xe2 \xef\xee\xf0\xf2\xe0\xeb\xe5 \xef\xee\xf1\xeb\xe5 \xee\xf4\xee\xf0\xec\xeb\xe5\xed\xe8\xff \xef\xf0\xe8\xe5\xec\xe0. \xc2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xed\xf3\xe6\xed\xf3\xfe \xef\xe0\xec\xff\xf2\xea\xf3 \xea\xed\xee\xef\xea\xee\xe9 \xed\xe8\xe6\xe5; \xe1\xee\xf2 \xef\xf0\xe8\xf1\xfb\xeb\xe0\xe5\xf2 \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xee\xe5 \xf3\xe2\xe5\xe4\xee\xec\xeb\xe5\xed\xe8\xe5 \xe8 \xea\xed\xee\xef\xea\xf3, \xea\xee\xe3\xe4\xe0 \xef\xe0\xec\xff\xf2\xea\xe0 \xe3\xee\xf2\xee\xe2\xe0.",
    replyMarkup: rows.length ? { inline_keyboard: rows } : safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, "care")
  };
}

function documentSubmenuReplyFor(
  settings: DenteTelegramBotSettings,
  topic: "tax" | "billing" | "medical" | "patientForms",
  requestResult?: { text: string; linked: boolean } | null
): TelegramWebhookReplyPackage {
  const portal = portalButton(settings, topic === "tax" ? "tax" : topic === "billing" ? "billing" : "documents");
  const texts = {
    tax:
      "\xcd\xe0\xeb\xee\xe3\xee\xe2\xe0\xff: DENTE \xef\xee\xec\xee\xe3\xe0\xe5\xf2 \xef\xee\xe4\xe3\xee\xf2\xee\xe2\xe8\xf2\xfc \xe7\xe0\xff\xe2\xeb\xe5\xed\xe8\xe5, \xe4\xe0\xed\xed\xfb\xe5 \xe4\xeb\xff \xca\xcd\xc4 1151156, \xf1\xf2\xe0\xf0\xf3\xfe \xf1\xef\xf0\xe0\xe2\xea\xf3 \xe4\xeb\xff \xf0\xe0\xf1\xf5\xee\xe4\xee\xe2 2021-2023 \xe8 \xf0\xe5\xe5\xf1\xf2\xf0 \xee\xef\xeb\xe0\xf2. \xcd\xf3\xe6\xed\xfb \xf4\xe8\xf1\xea\xe0\xeb\xfc\xed\xfb\xe5 \xf7\xe5\xea\xe8 \xe8 \xe4\xe0\xed\xed\xfb\xe5 \xef\xeb\xe0\xf2\xe5\xeb\xfc\xf9\xe8\xea\xe0. \xc3\xee\xf2\xee\xe2\xfb\xe5 \xf1\xef\xf0\xe0\xe2\xea\xe8 \xee\xf2\xea\xf0\xfb\xe2\xe0\xfe\xf2\xf1\xff \xe2 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xee\xec \xef\xee\xf0\xf2\xe0\xeb\xe5.",
    billing:
      "\xce\xef\xeb\xe0\xf2\xe0 \xe8 \xf7\xe5\xea\xe8: DENTE \xef\xee\xec\xee\xe3\xe0\xe5\xf2 \xef\xee\xe4\xe3\xee\xf2\xee\xe2\xe8\xf2\xfc \xf1\xf7\xe5\xf2, \xf7\xe5\xea, \xe0\xea\xf2 \xe2\xfb\xef\xee\xeb\xed\xe5\xed\xed\xfb\xf5 \xf0\xe0\xe1\xee\xf2, \xe3\xf0\xe0\xf4\xe8\xea \xf0\xe0\xf1\xf1\xf0\xee\xf7\xea\xe8 \xe8\xeb\xe8 \xe7\xe0\xef\xf0\xee\xf1 \xed\xe0 \xea\xee\xf0\xf0\xe5\xea\xf2\xe8\xf0\xee\xe2\xea\xf3/\xe2\xee\xe7\xe2\xf0\xe0\xf2. \xd1\xf3\xec\xec\xfb \xe8 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xe2\xfb\xe4\xe0\xfe\xf2\xf1\xff \xf2\xee\xeb\xfc\xea\xee \xf7\xe5\xf0\xe5\xe7 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xfb\xe9 \xef\xee\xf0\xf2\xe0\xeb \xef\xee\xf1\xeb\xe5 \xef\xf0\xee\xe2\xe5\xf0\xea\xe8 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xee\xec.",
    medical:
      "\xcc\xe5\xe4\xea\xe0\xf0\xf2\xe0: \xe2\xfb\xef\xe8\xf1\xea\xe0, \xe7\xe0\xef\xf0\xee\xf1 \xea\xee\xef\xe8\xe9, \xf0\xe0\xf1\xef\xe8\xf1\xea\xe0 \xe2\xfb\xe4\xe0\xf7\xe8, DICOM/\xca\xcb\xca\xd2 \xe8 \xe4\xf0\xf3\xe3\xe8\xe5 \xec\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xe3\xee\xf2\xee\xe2\xff\xf2\xf1\xff \xe2 DENTE \xe8 \xe2\xfb\xe4\xe0\xfe\xf2\xf1\xff \xf7\xe5\xf0\xe5\xe7 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xfb\xe9 \xef\xee\xf0\xf2\xe0\xeb \xef\xee\xf1\xeb\xe5 \xef\xf0\xee\xe2\xe5\xf0\xea\xe8 \xeb\xe8\xf7\xed\xee\xf1\xf2\xe8 \xe8 \xef\xee\xeb\xed\xee\xec\xee\xf7\xe8\xe9.",
    patientForms:
      "\xd4\xee\xf0\xec\xfb \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0: \xe0\xed\xea\xe5\xf2\xe0, \xf1\xee\xe3\xeb\xe0\xf1\xe8\xff, \xee\xf2\xea\xe0\xe7, \xcf\xc4\xed, \xef\xf0\xe5\xe4\xf1\xf2\xe0\xe2\xe8\xf2\xe5\xeb\xfc, \xf4\xee\xf2\xee/\xe2\xe8\xe4\xe5\xee \xe8 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xe2\xe8\xe7\xe8\xf2\xe0 \xe7\xe0\xef\xee\xeb\xed\xff\xfe\xf2\xf1\xff \xe2 DENTE. \xc5\xf1\xeb\xe8 \xed\xf3\xe6\xed\xe0 \xe1\xf3\xec\xe0\xe6\xed\xe0\xff \xea\xee\xef\xe8\xff \xe8\xeb\xe8 \xef\xee\xec\xee\xf9\xfc, \xed\xe0\xe6\xec\xe8\xf2\xe5 \xea\xed\xee\xef\xea\xf3 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0."
  };
  const rows = [
    portal,
    requestResult && !requestResult.linked
      ? [
          { text: "\xca\xe0\xea \xef\xee\xeb\xf3\xf7\xe8\xf2\xfc \xea\xee\xe4", callback_data: "dente:clinic" },
          { text: "\xc4\xee\xea\xf3\xec\xe5\xed\xf2\xfb", callback_data: "dente:documents" }
        ]
      : [
          { text: "\xc4\xee\xea\xf3\xec\xe5\xed\xf2\xfb", callback_data: "dente:documents" },
          { text: "\xcf\xee\xe7\xe2\xe0\xf2\xfc \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0", callback_data: "dente:contact" }
        ],
    mainMenuTelegramRow()
  ].filter((row) => row.length);
  return {
    text: [texts[topic], requestResult?.text].filter(Boolean).join("\n\n"),
    replyMarkup: rows.length ? { inline_keyboard: rows } : safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, topic === "tax" ? "tax" : topic === "billing" ? "billing" : "documents")
  };
}

function careTopicReplyFor(
  settings: DenteTelegramBotSettings,
  topic: DenteTelegramCareRequestTopic,
  requestResult?: ReturnType<typeof createDenteTelegramCareRequest>
): TelegramWebhookReplyPackage {
  const portal = portalButton(settings, "care");
  const texts: Record<DenteTelegramCareRequestTopic, string> = {
    extraction:
      "\xcf\xee\xf1\xeb\xe5 \xf3\xe4\xe0\xeb\xe5\xed\xe8\xff: \xed\xe5 \xe3\xf0\xe5\xe9\xf2\xe5 \xee\xe1\xeb\xe0\xf1\xf2\xfc, \xed\xe5 \xef\xee\xeb\xee\xf9\xe8\xf2\xe5 \xe0\xea\xf2\xe8\xe2\xed\xee \xef\xe5\xf0\xe2\xfb\xe5 \xf1\xf3\xf2\xea\xe8, \xed\xe5 \xf2\xf0\xee\xe3\xe0\xe9\xf2\xe5 \xeb\xf3\xed\xea\xf3, \xed\xe5 \xea\xf3\xf0\xe8\xf2\xe5 \xe8 \xed\xe5 \xf3\xef\xee\xf2\xf0\xe5\xe1\xeb\xff\xe9\xf2\xe5 \xe0\xeb\xea\xee\xe3\xee\xeb\xfc. \xcf\xf0\xe8 \xed\xe0\xf0\xe0\xf1\xf2\xe0\xfe\xf9\xe5\xe9 \xe1\xee\xeb\xe8, \xee\xf2\xe5\xea\xe5, \xf2\xe5\xec\xef\xe5\xf0\xe0\xf2\xf3\xf0\xe5 \xe8\xeb\xe8 \xea\xf0\xee\xe2\xee\xf2\xe5\xf7\xe5\xed\xe8\xe8 \xf1\xe2\xff\xe6\xe8\xf2\xe5\xf1\xfc \xf1 \xea\xeb\xe8\xed\xe8\xea\xee\xe9.",
    implant:
      "\xcf\xee\xf1\xeb\xe5 \xe8\xec\xef\xeb\xe0\xed\xf2\xe0\xf6\xe8\xe8: \xf1\xee\xe1\xeb\xfe\xe4\xe0\xe9\xf2\xe5 \xf5\xee\xeb\xee\xe4 \xe8 \xef\xee\xea\xee\xe9 \xef\xee \xed\xe0\xe7\xed\xe0\xf7\xe5\xed\xe8\xfe, \xed\xe5 \xef\xe5\xf0\xe5\xe3\xf0\xf3\xe6\xe0\xe9\xf2\xe5 \xee\xe1\xeb\xe0\xf1\xf2\xfc, \xef\xf0\xe8\xed\xe8\xec\xe0\xe9\xf2\xe5 \xef\xf0\xe5\xef\xe0\xf0\xe0\xf2\xfb \xf2\xee\xeb\xfc\xea\xee \xef\xee \xf1\xf5\xe5\xec\xe5 \xe2\xf0\xe0\xf7\xe0. \xcf\xf0\xe8 \xe1\xee\xeb\xe8, \xee\xf2\xe5\xea\xe5, \xef\xee\xe4\xe2\xe8\xe6\xed\xee\xf1\xf2\xe8, \xf2\xe5\xec\xef\xe5\xf0\xe0\xf2\xf3\xf0\xe5 \xe8\xeb\xe8 \xea\xf0\xee\xe2\xee\xf2\xe5\xf7\xe5\xed\xe8\xe8 \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.",
    filling:
      "\xcf\xee\xf1\xeb\xe5 \xef\xeb\xee\xec\xe1\xfb: \xe4\xee\xe6\xe4\xe8\xf2\xe5\xf1\xfc \xee\xea\xee\xed\xf7\xe0\xed\xe8\xff \xe0\xed\xe5\xf1\xf2\xe5\xe7\xe8\xe8 \xef\xe5\xf0\xe5\xe4 \xe5\xe4\xee\xe9, \xe8\xe7\xe1\xe5\xe3\xe0\xe9\xf2\xe5 \xf1\xe8\xeb\xfc\xed\xee\xe9 \xed\xe0\xe3\xf0\xf3\xe7\xea\xe8 \xed\xe0 \xe7\xf3\xe1 \xe2 \xef\xe5\xf0\xe2\xfb\xe5 \xf7\xe0\xf1\xfb. \xc5\xf1\xeb\xe8 \xec\xe5\xf8\xe0\xe5\xf2 \xef\xf0\xe8\xea\xf3\xf1, \xe5\xf1\xf2\xfc \xe1\xee\xeb\xfc \xef\xf0\xe8 \xed\xe0\xea\xf3\xf1\xfb\xe2\xe0\xed\xe8\xe8 \xe8\xeb\xe8 \xf7\xf3\xe2\xf1\xf2\xe2\xe8\xf2\xe5\xeb\xfc\xed\xee\xf1\xf2\xfc \xf3\xf1\xe8\xeb\xe8\xe2\xe0\xe5\xf2\xf1\xff, \xf1\xe2\xff\xe6\xe8\xf2\xe5\xf1\xfc \xf1 \xea\xeb\xe8\xed\xe8\xea\xee\xe9.",
    endo:
      "\xcf\xee\xf1\xeb\xe5 \xfd\xed\xe4\xee\xe4\xee\xed\xf2\xe8\xe8: \xe2\xee\xe7\xec\xee\xe6\xed\xe0 \xf7\xf3\xe2\xf1\xf2\xe2\xe8\xf2\xe5\xeb\xfc\xed\xee\xf1\xf2\xfc \xef\xf0\xe8 \xed\xe0\xea\xf3\xf1\xfb\xe2\xe0\xed\xe8\xe8. \xcd\xe5 \xef\xe5\xf0\xe5\xe3\xf0\xf3\xe6\xe0\xe9\xf2\xe5 \xe7\xf3\xe1, \xf1\xee\xe1\xeb\xfe\xe4\xe0\xe9\xf2\xe5 \xf1\xf5\xe5\xec\xf3 \xef\xf0\xe5\xef\xe0\xf0\xe0\xf2\xee\xe2 \xe2\xf0\xe0\xf7\xe0 \xe8 \xed\xe5 \xe7\xe0\xf2\xff\xe3\xe8\xe2\xe0\xe9\xf2\xe5 \xf1 \xef\xee\xf1\xf2\xee\xff\xed\xed\xee\xe9 \xf0\xe5\xf1\xf2\xe0\xe2\xf0\xe0\xf6\xe8\xe5\xe9. \xcf\xf0\xe8 \xed\xe0\xf0\xe0\xf1\xf2\xe0\xfe\xf9\xe5\xe9 \xe1\xee\xeb\xe8, \xee\xf2\xe5\xea\xe5 \xe8\xeb\xe8 \xf2\xe5\xec\xef\xe5\xf0\xe0\xf2\xf3\xf0\xe5 \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.",
    surgery:
      "\xcf\xee\xf1\xeb\xe5 \xf5\xe8\xf0\xf3\xf0\xe3\xe8\xe8: \xed\xe5 \xe3\xf0\xe5\xe9\xf2\xe5 \xee\xe1\xeb\xe0\xf1\xf2\xfc, \xed\xe5 \xf2\xf0\xee\xe3\xe0\xe9\xf2\xe5 \xf8\xe2\xfb, \xed\xe5 \xef\xee\xeb\xee\xf9\xe8\xf2\xe5 \xe0\xea\xf2\xe8\xe2\xed\xee \xef\xe5\xf0\xe2\xfb\xe5 \xf1\xf3\xf2\xea\xe8, \xf1\xee\xe1\xeb\xfe\xe4\xe0\xe9\xf2\xe5 \xee\xe3\xf0\xe0\xed\xe8\xf7\xe5\xed\xe8\xff \xe8 \xed\xe0\xe7\xed\xe0\xf7\xe5\xed\xe8\xff \xe2\xf0\xe0\xf7\xe0. \xcf\xf0\xe8 \xea\xf0\xee\xe2\xee\xf2\xe5\xf7\xe5\xed\xe8\xe8, \xf2\xe5\xec\xef\xe5\xf0\xe0\xf2\xf3\xf0\xe5, \xed\xe0\xf0\xe0\xf1\xf2\xe0\xfe\xf9\xe5\xec \xee\xf2\xe5\xea\xe5 \xe8\xeb\xe8 \xf1\xe8\xeb\xfc\xed\xee\xe9 \xe1\xee\xeb\xe8 \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.",
    anesthesia:
      "\xcf\xee\xf1\xeb\xe5 \xe0\xed\xe5\xf1\xf2\xe5\xe7\xe8\xe8: \xed\xe5 \xe5\xf8\xfc\xf2\xe5, \xef\xee\xea\xe0 \xf1\xee\xf5\xf0\xe0\xed\xff\xe5\xf2\xf1\xff \xee\xed\xe5\xec\xe5\xed\xe8\xe5, \xf7\xf2\xee\xe1\xfb \xed\xe5 \xf2\xf0\xe0\xe2\xec\xe8\xf0\xee\xe2\xe0\xf2\xfc \xf9\xe5\xea\xf3 \xe8\xeb\xe8 \xff\xe7\xfb\xea. \xc5\xf1\xeb\xe8 \xee\xed\xe5\xec\xe5\xed\xe8\xe5 \xe4\xe5\xf0\xe6\xe8\xf2\xf1\xff \xed\xe5\xee\xe1\xfb\xf7\xed\xee \xe4\xee\xeb\xe3\xee, \xe1\xee\xeb\xfc \xf3\xf1\xe8\xeb\xe8\xe2\xe0\xe5\xf2\xf1\xff \xe8\xeb\xe8 \xef\xee\xff\xe2\xe8\xeb\xe0\xf1\xfc \xe0\xeb\xeb\xe5\xf0\xe3\xe8\xf7\xe5\xf1\xea\xe0\xff \xf0\xe5\xe0\xea\xf6\xe8\xff, \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.",
    hygiene:
      "\xcf\xee\xf1\xeb\xe5 \xef\xf0\xee\xf4\xe3\xe8\xe3\xe8\xe5\xed\xfb: \xec\xff\xe3\xea\xe0\xff \xf9\xe5\xf2\xea\xe0, \xe0\xea\xea\xf3\xf0\xe0\xf2\xed\xe0\xff \xe3\xe8\xe3\xe8\xe5\xed\xe0, \xe2\xf0\xe5\xec\xe5\xed\xed\xee \xe8\xe7\xe1\xe5\xe3\xe0\xe9\xf2\xe5 \xea\xf0\xe0\xf1\xff\xf9\xe5\xe9 \xef\xe8\xf9\xe8 \xef\xee \xf0\xe5\xea\xee\xec\xe5\xed\xe4\xe0\xf6\xe8\xe8 \xe2\xf0\xe0\xf7\xe0. \xc5\xf1\xeb\xe8 \xe4\xe5\xf1\xed\xe0 \xea\xf0\xee\xe2\xe8\xf2 \xe4\xee\xeb\xe3\xee \xe8\xeb\xe8 \xe1\xee\xeb\xfc \xf3\xf1\xe8\xeb\xe8\xe2\xe0\xe5\xf2\xf1\xff, \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.",
    prosthetics:
      "\xcf\xee\xf1\xeb\xe5 \xef\xf0\xee\xf2\xe5\xe7\xe8\xf0\xee\xe2\xe0\xed\xe8\xff: \xef\xf0\xe8\xe2\xfb\xea\xe0\xe9\xf2\xe5 \xea \xea\xee\xed\xf1\xf2\xf0\xf3\xea\xf6\xe8\xe8 \xef\xee\xf1\xf2\xe5\xef\xe5\xed\xed\xee, \xed\xe5 \xef\xe5\xf0\xe5\xe3\xf0\xf3\xe6\xe0\xe9\xf2\xe5 \xe5\xe5 \xf2\xe2\xe5\xf0\xe4\xee\xe9 \xef\xe8\xf9\xe5\xe9 \xe8 \xed\xe5 \xea\xee\xf0\xf0\xe5\xea\xf2\xe8\xf0\xf3\xe9\xf2\xe5 \xf1\xe0\xec\xee\xf1\xf2\xee\xff\xf2\xe5\xeb\xfc\xed\xee. \xc5\xf1\xeb\xe8 \xea\xee\xf0\xee\xed\xea\xe0, \xec\xee\xf1\xf2, \xe2\xe8\xed\xe8\xf0 \xe8\xeb\xe8 \xef\xf0\xee\xf2\xe5\xe7 \xec\xe5\xf8\xe0\xe5\xf2, \xed\xe0\xf2\xe8\xf0\xe0\xe5\xf2 \xe8\xeb\xe8 \xf0\xe0\xf1\xf6\xe5\xec\xe5\xed\xf2\xe8\xf0\xee\xe2\xe0\xeb\xf1\xff, \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.",
    orthodontics:
      "\xcf\xee\xf1\xeb\xe5 \xee\xf0\xf2\xee\xe4\xee\xed\xf2\xe8\xe8: \xf1\xee\xe1\xeb\xfe\xe4\xe0\xe9\xf2\xe5 \xf0\xe5\xe6\xe8\xec \xed\xee\xf8\xe5\xed\xe8\xff \xe0\xef\xef\xe0\xf0\xe0\xf2\xe0 \xe8\xeb\xe8 \xfd\xeb\xe0\xe9\xed\xe5\xf0\xee\xe2, \xe8\xf1\xef\xee\xeb\xfc\xe7\xf3\xe9\xf2\xe5 \xed\xe0\xe7\xed\xe0\xf7\xe5\xed\xed\xfb\xe9 \xf3\xf5\xee\xe4 \xe8 \xed\xe5 \xef\xee\xe4\xea\xf0\xf3\xf7\xe8\xe2\xe0\xe9\xf2\xe5 \xfd\xeb\xe5\xec\xe5\xed\xf2\xfb \xe1\xe5\xe7 \xe2\xf0\xe0\xf7\xe0. \xc5\xf1\xeb\xe8 \xe1\xf0\xe5\xea\xe5\xf2 \xee\xf2\xea\xeb\xe5\xe8\xeb\xf1\xff, \xe4\xf3\xe3\xe0 \xea\xee\xeb\xe5\xf2 \xe8\xeb\xe8 \xe0\xef\xef\xe0\xf0\xe0\xf2 \xed\xe0\xf2\xe8\xf0\xe0\xe5\xf2, \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.",
    periodontology:
      "\xcf\xee\xf1\xeb\xe5 \xef\xe0\xf0\xee\xe4\xee\xed\xf2\xee\xeb\xee\xe3\xe8\xe8: \xe0\xea\xea\xf3\xf0\xe0\xf2\xed\xee \xee\xf7\xe8\xf9\xe0\xe9\xf2\xe5 \xe4\xe5\xf1\xed\xfb \xef\xee \xf1\xf5\xe5\xec\xe5 \xe2\xf0\xe0\xf7\xe0, \xed\xe5 \xef\xf0\xee\xef\xf3\xf1\xea\xe0\xe9\xf2\xe5 \xed\xe0\xe7\xed\xe0\xf7\xe5\xed\xed\xfb\xe5 \xf1\xf0\xe5\xe4\xf1\xf2\xe2\xe0 \xe8 \xea\xee\xed\xf2\xf0\xee\xeb\xfc. \xc5\xf1\xeb\xe8 \xea\xf0\xee\xe2\xee\xf2\xee\xf7\xe8\xe2\xee\xf1\xf2\xfc, \xee\xf2\xe5\xea, \xe1\xee\xeb\xfc \xe8\xeb\xe8 \xed\xe5\xef\xf0\xe8\xff\xf2\xed\xfb\xe9 \xe7\xe0\xef\xe0\xf5 \xf3\xf1\xe8\xeb\xe8\xe2\xe0\xfe\xf2\xf1\xff, \xed\xe0\xe6\xec\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0."
  };
  const rows = [
    portal,
    [
      { text: "\xc2\xf1\xe5 \xef\xe0\xec\xff\xf2\xea\xe8", callback_data: "dente:care" },
      { text: "\xcf\xee\xe7\xe2\xe0\xf2\xfc \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0", callback_data: "dente:contact" }
    ],
    mainMenuTelegramRow()
  ].filter((row) => row.length);
  return {
    text: [texts[topic], requestResult?.text].filter(Boolean).join("\n\n"),
    replyMarkup: rows.length ? { inline_keyboard: rows } : safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, "care")
  };
}

function contactRequestReplyFor(
  settings: DenteTelegramBotSettings,
  chatFingerprintValue: string | null,
  scope: TelegramRequestScope = {}
): TelegramWebhookReplyPackage {
  const result = createDenteTelegramContactRequest(chatFingerprintValue, scope);
  const portal = portalButton(settings);
  const rows = [
    portal,
    result.linked
      ? [
          { text: "\xd0\xe0\xf1\xef\xe8\xf1\xe0\xed\xe8\xe5", callback_data: "dente:schedule" },
          { text: "\xc4\xee\xea\xf3\xec\xe5\xed\xf2\xfb", callback_data: "dente:documents" }
        ]
      : [{ text: "\xca\xe0\xea \xef\xee\xeb\xf3\xf7\xe8\xf2\xfc \xea\xee\xe4", callback_data: "dente:clinic" }],
    [{ text: "\xcf\xee\xec\xee\xf9\xfc", callback_data: "dente:help" }],
    mainMenuTelegramRow()
  ].filter((row) => row.length);
  return {
    text: result.text,
    replyMarkup: rows.length ? { inline_keyboard: rows } : safeCommandKeyboard(settings, result.linked ? "linked" : "rejected"),
    photoUrl: patientMenuCardPhoto(settings, "mainMenu")
  };
}

function telegramFeatureEnabled(settings: DenteTelegramBotSettings, feature: DenteTelegramFeature): boolean {
  return settings.enabledFeatures.includes(feature);
}

function featureDisabledReplyFor(settings: DenteTelegramBotSettings, title: string): TelegramWebhookReplyPackage {
  return {
    text: `${title} \xf1\xe5\xe9\xf7\xe0\xf1 \xee\xf2\xea\xeb\xfe\xf7\xe5\xed\xfb \xe2 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 \xea\xeb\xe8\xed\xe8\xea\xe8 DENTE. \xc2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe4\xee\xf1\xf2\xf3\xef\xed\xee\xe5 \xe4\xe5\xe9\xf1\xf2\xe2\xe8\xe5 \xea\xed\xee\xef\xea\xe0\xec\xe8 \xed\xe8\xe6\xe5 \xe8\xeb\xe8 \xef\xee\xe7\xee\xe2\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0.`,
    replyMarkup: safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, "mainMenu")
  };
}

function unsafeTelegramAttachmentReplyFor(settings: DenteTelegramBotSettings, updateKind: DenteTelegramUpdateKind): TelegramWebhookReplyPackage {
  const label =
    updateKind === "voice"
      ? "\xc3\xee\xeb\xee\xf1\xee\xe2\xfb\xe5 \xf1\xee\xee\xe1\xf9\xe5\xed\xe8\xff"
      : updateKind === "photo"
        ? "\xd4\xee\xf2\xee \xe8 \xf1\xed\xe8\xec\xea\xe8"
        : "PDF, \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xe8 \xf4\xe0\xe9\xeb\xfb";
  return {
    text: `${label} \xe2 Telegram \xed\xe5 \xef\xf0\xe8\xed\xe8\xec\xe0\xfe\xf2\xf1\xff \xea\xe0\xea \xec\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb DENTE. \xce\xf2\xea\xf0\xee\xe9\xf2\xe5 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xfb\xe9 \xef\xee\xf0\xf2\xe0\xeb \xe8\xeb\xe8 \xe2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xea\xed\xee\xef\xea\xf3: \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb, \xef\xe0\xec\xff\xf2\xea\xe8 \xe8\xeb\xe8 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0. \xd2\xe0\xea \xea\xeb\xe8\xed\xe8\xea\xe0 \xed\xe5 \xef\xee\xf2\xe5\xf0\xff\xe5\xf2 \xf4\xe0\xe9\xeb \xe8 \xed\xe5 \xf1\xec\xe5\xf8\xe0\xe5\xf2 \xe5\xe3\xee \xf1 \xf7\xf3\xe6\xee\xe9 \xea\xe0\xf0\xf2\xee\xe9.`,
    replyMarkup: safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, "documents")
  };
}

function normalizedFreeText(value: string | null): string {
  return value?.trim().toLocaleLowerCase("ru-RU").replaceAll("\xb8", "\xe5") ?? "";
}

function freeTextIncludes(value: string, fragments: string[]): boolean {
  return fragments.some((fragment) => value.includes(fragment));
}

function freeTextReplyFor(
  settings: DenteTelegramBotSettings,
  chatFingerprintValue: string | null,
  messageText: string | null,
  scope: TelegramRequestScope = {}
): TelegramWebhookReplyPackage {
  const text = normalizedFreeText(messageText);
  if (
    freeTextIncludes(text, ["\xed\xe0\xeb\xee\xe3", "\xed\xe4\xf4\xeb", "\xe2\xfb\xf7\xe5\xf2", "\xea\xed\xe4", "1151156"]) ||
    (freeTextIncludes(text, ["\xf1\xef\xf0\xe0\xe2\xea"]) && freeTextIncludes(text, ["\xee\xef\xeb\xe0\xf2", "\xf7\xe5\xea", "\xf4\xe8\xf1\xea"]))
  ) {
    return telegramFeatureEnabled(settings, "tax_document_request")
      ? documentSubmenuReplyFor(settings, "tax", createDenteTelegramDocumentRequest(chatFingerprintValue, "tax", scope))
      : featureDisabledReplyFor(settings, "\xcd\xe0\xeb\xee\xe3\xee\xe2\xfb\xe5 \xe7\xe0\xef\xf0\xee\xf1\xfb");
  }
  if (freeTextIncludes(text, ["\xee\xef\xeb\xe0\xf2", "\xf1\xf7\xe5\xf2", "\xf1\xf7\xb8\xf2", "\xf7\xe5\xea", "\xea\xe2\xe8\xf2\xe0\xed\xf6", "\xe2\xee\xe7\xe2\xf0\xe0\xf2", "\xf0\xe0\xf1\xf1\xf0\xee\xf7", "\xe0\xea\xf2"])) {
    return telegramFeatureEnabled(settings, "secure_portal_links")
      ? documentSubmenuReplyFor(settings, "billing", createDenteTelegramDocumentRequest(chatFingerprintValue, "billing", scope))
      : featureDisabledReplyFor(settings, "\xd4\xe8\xed\xe0\xed\xf1\xee\xe2\xfb\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb");
  }
  if (freeTextIncludes(text, ["\xec\xe5\xe4\xea\xe0\xf0\xf2", "\xe2\xfb\xef\xe8\xf1\xea", "\xea\xee\xef\xe8", "dicom", "\xea\xeb\xea\xf2", "\xea\xf2", "\xf1\xed\xe8\xec\xea"])) {
    return telegramFeatureEnabled(settings, "secure_portal_links")
      ? documentSubmenuReplyFor(settings, "medical", createDenteTelegramDocumentRequest(chatFingerprintValue, "medical", scope))
      : featureDisabledReplyFor(settings, "\xcc\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb");
  }
  if (freeTextIncludes(text, ["\xf1\xee\xe3\xeb\xe0\xf1", "\xe0\xed\xea\xe5\xf2\xe0", "\xf4\xee\xf0\xec\xe0", "\xef\xe4\xed", "\xef\xe5\xf0\xf1\xee\xed\xe0\xeb"])) {
    return telegramFeatureEnabled(settings, "secure_portal_links")
      ? documentSubmenuReplyFor(settings, "patientForms", createDenteTelegramDocumentRequest(chatFingerprintValue, "patientForms", scope))
      : featureDisabledReplyFor(settings, "\xd4\xee\xf0\xec\xfb \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0");
  }
  if (freeTextIncludes(text, ["\xe4\xee\xea\xf3\xec\xe5\xed\xf2", "\xe4\xee\xe3\xee\xe2\xee\xf0", "\xe0\xea\xf2"])) {
    return documentsReplyFor(settings);
  }
  const careTopic = careTopicFromFreeText(text);
  if (careTopic) {
    return telegramFeatureEnabled(settings, "post_visit_instructions")
      ? careTopicReplyFor(settings, careTopic, createDenteTelegramCareRequest(chatFingerprintValue, careTopic, scope))
      : featureDisabledReplyFor(settings, "\xcf\xe0\xec\xff\xf2\xea\xe8 \xef\xee\xf1\xeb\xe5 \xef\xf0\xe8\xe5\xec\xe0");
  }
  if (freeTextIncludes(text, ["\xef\xe0\xec\xff\xf2", "\xf0\xe5\xea\xee\xec\xe5\xed\xe4", "\xf3\xe4\xe0\xeb\xe5\xed", "\xe8\xec\xef\xeb\xe0\xed", "\xef\xeb\xee\xec\xe1", "\xe3\xe8\xe3\xe8\xe5\xed", "\xef\xee\xf1\xeb\xe5"])) {
    return telegramFeatureEnabled(settings, "post_visit_instructions")
      ? careReplyFor(settings)
      : featureDisabledReplyFor(settings, "\xcf\xe0\xec\xff\xf2\xea\xe8 \xef\xee\xf1\xeb\xe5 \xef\xf0\xe8\xe5\xec\xe0");
  }
  if (freeTextIncludes(text, ["\xf0\xe0\xf1\xef\xe8\xf1", "\xe7\xe0\xef\xe8\xf1", "\xef\xf0\xe8\xe5\xec", "\xe2\xe8\xe7\xe8\xf2", "\xe2\xf0\xe5\xec\xff"])) {
    const scheduleReply = buildDenteTelegramLinkedScheduleReply(chatFingerprintValue, scope, settings);
    return {
      text: scheduleReply.text,
      replyMarkup: scheduleReply.replyMarkup ?? safeCommandKeyboard(settings, scheduleReply.linked ? "linked" : "rejected"),
      photoUrl: patientMenuCardPhoto(settings, "appointment")
    };
  }
  if (freeTextIncludes(text, ["\xe7\xe2\xee\xed", "\xef\xe5\xf0\xe5\xe7\xe2\xee\xed", "\xe0\xe4\xec\xe8\xed", "\xee\xef\xe5\xf0\xe0\xf2\xee\xf0", "\xf1\xe2\xff\xe7", "\xe1\xee\xeb\xfc", "\xee\xf2\xe5\xea", "\xea\xf0\xee\xe2", "\xf2\xe5\xec\xef\xe5\xf0\xe0\xf2\xf3\xf0"])) {
    return contactRequestReplyFor(settings, chatFingerprintValue, scope);
  }
  if (freeTextIncludes(text, ["\xee\xf2\xe7\xfb\xe2", "\xee\xf6\xe5\xed", "\xf0\xe5\xe9\xf2\xe8\xed\xe3"])) return reviewReplyFor(settings);
  if (freeTextIncludes(text, ["\xe0\xe4\xf0\xe5\xf1", "\xea\xe0\xf0\xf2\xe0", "\xea\xe0\xea \xe4\xee\xe1\xf0\xe0\xf2\xfc\xf1\xff", "\xe3\xe4\xe5 \xe2\xfb"])) return mapReplyFor(settings);
  return {
    text: "DENTE \xef\xf0\xe8\xed\xff\xeb \xf1\xee\xee\xe1\xf9\xe5\xed\xe8\xe5. \xd7\xf2\xee\xe1\xfb \xea\xeb\xe8\xed\xe8\xea\xe0 \xe1\xfb\xf1\xf2\xf0\xee \xef\xee\xed\xff\xeb\xe0 \xe7\xe0\xef\xf0\xee\xf1, \xe2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe4\xe5\xe9\xf1\xf2\xe2\xe8\xe5 \xea\xed\xee\xef\xea\xe0\xec\xe8 \xed\xe8\xe6\xe5. \xca\xee\xec\xe0\xed\xe4\xfb \xef\xe8\xf1\xe0\xf2\xfc \xed\xe5 \xed\xf3\xe6\xed\xee.",
    replyMarkup: safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, "mainMenu")
  };
}

function suggestedReplyFor(
  command: string | null,
  callbackAction: TelegramSafeCallbackAction | null,
  settings: DenteTelegramBotSettings,
  chatFingerprintValue: string | null,
  updateKind: DenteTelegramUpdateKind,
  messageText: string | null,
  scope: TelegramRequestScope = {}
): TelegramWebhookReplyPackage {
  const portal = settings.patientPortalBaseUrl || "\xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xfb\xe9 \xef\xee\xf0\xf2\xe0\xeb DENTE";
  const normalizedCommand = command?.split("@")[0] ?? null;

  if (updateKind === "photo" || updateKind === "document" || (updateKind === "voice" && !settings.allowVoiceIntake)) {
    return unsafeTelegramAttachmentReplyFor(settings, updateKind);
  }

  if (normalizedCommand === "/start" || callbackAction === "dente:start") {
    const linkedStartReply = buildDenteTelegramLinkedScheduleReply(chatFingerprintValue, scope, settings);
    if (linkedStartReply.linked) {
      return {
        text:
          linkedStartReply.subjectType === "staff"
            ? "DENTE: \xf0\xe0\xe1\xee\xf7\xe8\xe9 Telegram \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed. \xc2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xf0\xe0\xf1\xef\xe8\xf1\xe0\xed\xe8\xe5, \xf1\xe2\xff\xe7\xfc \xe8\xeb\xe8 \xee\xf2\xea\xf0\xee\xe9\xf2\xe5 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xfb\xe9 DENTE-\xef\xee\xf0\xf2\xe0\xeb. \xd4\xc8\xce \xef\xe0\xf6\xe8\xe5\xed\xf2\xee\xe2 \xe8 \xec\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xe5\xf2\xe0\xeb\xe8 \xe2 Telegram \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xff\xfe\xf2\xf1\xff."
            : "DENTE: Telegram \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed \xea \xea\xeb\xe8\xed\xe8\xea\xe5. \xc2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xf0\xe0\xf1\xef\xe8\xf1\xe0\xed\xe8\xe5, \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb, \xef\xe0\xec\xff\xf2\xea\xe8 \xe8\xeb\xe8 \xf1\xe2\xff\xe7\xfc \xf1 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xee\xec \xea\xed\xee\xef\xea\xe0\xec\xe8 \xed\xe8\xe6\xe5. \xcc\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xee\xf2\xea\xf0\xfb\xe2\xe0\xfe\xf2\xf1\xff \xf2\xee\xeb\xfc\xea\xee \xe2 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xee\xec \xef\xee\xf0\xf2\xe0\xeb\xe5.",
        replyMarkup:
          linkedStartReply.subjectType === "staff"
            ? linkedStartReply.replyMarkup ?? safeCommandKeyboard(settings, "linked")
            : safeCommandKeyboard(settings, "linked"),
        photoUrl: patientMenuCardPhoto(settings, linkedStartReply.subjectType === "staff" ? "staff" : "mainMenu")
      };
    }
    return {
      text: "\xc1\xee\xf2 DENTE \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed. \xce\xf2\xf1\xea\xe0\xed\xe8\xf0\xf3\xe9\xf2\xe5 QR \xe8\xe7 \xef\xf0\xe8\xeb\xee\xe6\xe5\xed\xe8\xff \xea\xeb\xe8\xed\xe8\xea\xe8 \xe8\xeb\xe8 \xee\xf2\xef\xf0\xe0\xe2\xfc\xf2\xe5 \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4 \xe2\xf0\xf3\xf7\xed\xf3\xfe, \xf7\xf2\xee\xe1\xfb \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xee \xef\xf0\xe8\xe2\xff\xe7\xe0\xf2\xfc \xf7\xe0\xf2. \xc4\xe0\xeb\xfc\xf8\xe5 \xe2\xfb\xe1\xe8\xf0\xe0\xe9\xf2\xe5 \xe4\xe5\xe9\xf1\xf2\xe2\xe8\xff \xea\xed\xee\xef\xea\xe0\xec\xe8 \xed\xe8\xe6\xe5; \xea\xee\xec\xe0\xed\xe4\xfb \xed\xf3\xe6\xed\xfb \xf2\xee\xeb\xfc\xea\xee \xea\xe0\xea \xe7\xe0\xef\xe0\xf1\xed\xee\xe9 \xe2\xe0\xf0\xe8\xe0\xed\xf2. \xcc\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xee\xf2\xea\xf0\xfb\xe2\xe0\xfe\xf2\xf1\xff \xf2\xee\xeb\xfc\xea\xee \xe2 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xee\xec \xef\xee\xf0\xf2\xe0\xeb\xe5.",
      replyMarkup: safeCommandKeyboard(settings, "start"),
      photoUrl: patientMenuCardPhoto(settings, "mainMenu")
    };
  }
  if (normalizedCommand === "/help" || callbackAction === "dente:help") {
    return {
      text: "DENTE \xf0\xe0\xe1\xee\xf2\xe0\xe5\xf2 \xea\xed\xee\xef\xea\xe0\xec\xe8: \xf0\xe0\xf1\xef\xe8\xf1\xe0\xed\xe8\xe5, \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb, \xef\xe0\xec\xff\xf2\xea\xe8, \xf1\xe2\xff\xe7\xfc \xf1 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xee\xec, \xee\xf2\xe7\xfb\xe2 \xe8 \xea\xe0\xf0\xf2\xe0 \xea\xeb\xe8\xed\xe8\xea\xe8. \xca\xee\xec\xe0\xed\xe4\xfb \xee\xf1\xf2\xe0\xfe\xf2\xf1\xff \xe7\xe0\xef\xe0\xf1\xed\xfb\xec \xe2\xe0\xf0\xe8\xe0\xed\xf2\xee\xec. \xcc\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xe0\xed\xed\xfb\xe5 \xe2 Telegram \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xff\xfe\xf2\xf1\xff.",
      replyMarkup: safeCommandKeyboard(settings, "help"),
      photoUrl: patientMenuCardPhoto(settings, "mainMenu")
    };
  }
  if (normalizedCommand === "/privacy" || callbackAction === "dente:privacy") {
    return {
      text: "DENTE \xef\xee \xf3\xec\xee\xeb\xf7\xe0\xed\xe8\xfe \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xff\xe5\xf2 \xe4\xe8\xe0\xe3\xed\xee\xe7\xfb, \xca\xd2, \xf0\xe5\xed\xf2\xe3\xe5\xed, \xef\xeb\xe0\xed\xfb \xeb\xe5\xf7\xe5\xed\xe8\xff \xe8 \xed\xe0\xeb\xee\xe3\xee\xe2\xfb\xe5 PDF \xf7\xe5\xf0\xe5\xe7 Telegram. \xc2 Telegram \xf3\xf5\xee\xe4\xff\xf2 \xf2\xee\xeb\xfc\xea\xee \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xfb\xe5 \xf3\xe2\xe5\xe4\xee\xec\xeb\xe5\xed\xe8\xff \xe8 \xf1\xf1\xfb\xeb\xea\xe8.",
      replyMarkup: safeCommandKeyboard(settings, "privacy"),
      photoUrl: patientMenuCardPhoto(settings, "mainMenu")
    };
  }
  if (normalizedCommand === "/clinic" || callbackAction === "dente:clinic") {
    return {
      text: `\xcf\xee\xef\xf0\xee\xf1\xe8\xf2\xe5 \xe0\xe4\xec\xe8\xed\xe8\xf1\xf2\xf0\xe0\xf2\xee\xf0\xe0 \xee\xf2\xea\xf0\xfb\xf2\xfc DENTE \xe8 \xef\xee\xea\xe0\xe7\xe0\xf2\xfc QR-\xea\xee\xe4 \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed\xe8\xff. QR \xf1\xe0\xec \xee\xf2\xea\xf0\xee\xe5\xf2 \xe1\xee\xf2 \xf1 \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xec \xea\xee\xe4\xee\xec; \xe5\xf1\xeb\xe8 \xea\xe0\xec\xe5\xf0\xe0 \xed\xe5\xe4\xee\xf1\xf2\xf3\xef\xed\xe0, \xea\xee\xe4 \xec\xee\xe6\xed\xee \xee\xf2\xef\xf0\xe0\xe2\xe8\xf2\xfc \xf1\xfe\xe4\xe0 \xe2\xf0\xf3\xf7\xed\xf3\xfe. \xcf\xee\xf0\xf2\xe0\xeb \xea\xeb\xe8\xed\xe8\xea\xe8: ${portal}.`,
      replyMarkup: safeCommandKeyboard(settings, "clinic"),
      photoUrl: patientMenuCardPhoto(settings, "mainMenu")
    };
  }
  if (normalizedCommand === "/schedule" || normalizedCommand === "/appointments" || callbackAction === "dente:schedule") {
    const scheduleReply = buildDenteTelegramLinkedScheduleReply(chatFingerprintValue, scope, settings);
    return {
      text: scheduleReply.text,
      replyMarkup: scheduleReply.replyMarkup ?? safeCommandKeyboard(settings, scheduleReply.linked ? "linked" : "rejected"),
      photoUrl: patientMenuCardPhoto(settings, "appointment")
    };
  }
  if (normalizedCommand === "/documents" || normalizedCommand === "/docs" || callbackAction === "dente:documents") {
    return documentsReplyFor(settings);
  }
  if (callbackAction === "dente:tax") {
    if (!telegramFeatureEnabled(settings, "tax_document_request")) return featureDisabledReplyFor(settings, "\xcd\xe0\xeb\xee\xe3\xee\xe2\xfb\xe5 \xe7\xe0\xef\xf0\xee\xf1\xfb");
    return documentSubmenuReplyFor(settings, "tax", createDenteTelegramDocumentRequest(chatFingerprintValue, "tax", scope));
  }
  if (callbackAction === "dente:billing") {
    if (!telegramFeatureEnabled(settings, "secure_portal_links")) return featureDisabledReplyFor(settings, "\xd4\xe8\xed\xe0\xed\xf1\xee\xe2\xfb\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb");
    return documentSubmenuReplyFor(settings, "billing", createDenteTelegramDocumentRequest(chatFingerprintValue, "billing", scope));
  }
  if (callbackAction === "dente:medical-docs") {
    if (!telegramFeatureEnabled(settings, "secure_portal_links")) return featureDisabledReplyFor(settings, "\xcc\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb");
    return documentSubmenuReplyFor(settings, "medical", createDenteTelegramDocumentRequest(chatFingerprintValue, "medical", scope));
  }
  if (callbackAction === "dente:patient-forms") {
    if (!telegramFeatureEnabled(settings, "secure_portal_links")) return featureDisabledReplyFor(settings, "\xd4\xee\xf0\xec\xfb \xef\xe0\xf6\xe8\xe5\xed\xf2\xe0");
    return documentSubmenuReplyFor(
      settings,
      "patientForms",
      createDenteTelegramDocumentRequest(chatFingerprintValue, "patientForms", scope)
    );
  }
  if (
    normalizedCommand === "/care" ||
    normalizedCommand === "/instructions" ||
    normalizedCommand === "/recommendations" ||
    callbackAction === "dente:care"
  ) {
    if (!telegramFeatureEnabled(settings, "post_visit_instructions")) return featureDisabledReplyFor(settings, "\xcf\xe0\xec\xff\xf2\xea\xe8 \xef\xee\xf1\xeb\xe5 \xef\xf0\xe8\xe5\xec\xe0");
    return careReplyFor(settings);
  }
  const callbackCareTopic = callbackAction ? telegramCareCallbackTopicByAction[callbackAction] : null;
  if (callbackCareTopic) {
    if (!telegramFeatureEnabled(settings, "post_visit_instructions")) return featureDisabledReplyFor(settings, "\xcf\xe0\xec\xff\xf2\xea\xe8 \xef\xee\xf1\xeb\xe5 \xef\xf0\xe8\xe5\xec\xe0");
    return careTopicReplyFor(
      settings,
      callbackCareTopic,
      createDenteTelegramCareRequest(chatFingerprintValue, callbackCareTopic, scope)
    );
  }
  if (normalizedCommand === "/contact" || normalizedCommand === "/call" || callbackAction === "dente:contact") {
    return contactRequestReplyFor(settings, chatFingerprintValue, scope);
  }
  if (normalizedCommand === "/review" || callbackAction === "dente:review") {
    return reviewReplyFor(settings);
  }
  if (normalizedCommand === "/map" || normalizedCommand === "/maps" || callbackAction === "dente:map") {
    return mapReplyFor(settings);
  }
  if (!command && !callbackAction) return freeTextReplyFor(settings, chatFingerprintValue, messageText, scope);
  return {
    text: "DENTE \xef\xf0\xe8\xed\xff\xeb \xf1\xee\xee\xe1\xf9\xe5\xed\xe8\xe5. \xc2\xfb\xe1\xe5\xf0\xe8\xf2\xe5 \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xee\xe5 \xe4\xe5\xe9\xf1\xf2\xe2\xe8\xe5 \xea\xed\xee\xef\xea\xe0\xec\xe8 \xed\xe8\xe6\xe5.",
    replyMarkup: safeCommandKeyboard(settings, "help"),
    photoUrl: patientMenuCardPhoto(settings, "mainMenu")
  };
}

function buildStatus(requestedOrganizationId: string | null = null, requestedBotConfigId: string | null = null) {
  const runtimeResult = resolveTelegramRuntimeContext(requestedOrganizationId, requestedBotConfigId);
  if (!runtimeResult.ok) {
    throw new Error(runtimeResult.message);
  }
  const runtime = runtimeResult.context;
  const settings = runtime.settings;
  const isPrimaryRuntime = runtime.organizationId === getDenteTelegramBotSettings().organizationId;
  const warnings: string[] = [];
  const nextActions: string[] = [];

  if (settings.mode !== "disabled" && !runtime.tokenConfigured && settings.mode !== "clinic_owned_bot") {
    warnings.push("\xc1\xee\xf2 Telegram \xed\xe5 \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xf5 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 DENTE.");
    nextActions.push("\xcf\xee\xe4\xea\xeb\xfe\xf7\xe8\xf2\xe5 \xf1\xe5\xea\xf0\xe5\xf2 \xe1\xee\xf2\xe0 \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xf5 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 \xea\xeb\xe8\xed\xe8\xea\xe8; \xed\xe5 \xf5\xf0\xe0\xed\xe8\xf2\xe5 \xe5\xe3\xee \xe2 \xe1\xf0\xe0\xf3\xe7\xe5\xf0\xe5, \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xe0\xf6\xe8\xe8 \xe8\xeb\xe8 \xea\xeb\xe8\xe5\xed\xf2\xf1\xea\xee\xec \xea\xee\xe4\xe5.");
  }
  if (settings.mode !== "disabled" && !runtime.webhookSecretConfigured) {
    warnings.push("\xc7\xe0\xf9\xe8\xf2\xe0 \xe2\xe5\xe1\xf5\xf3\xea\xe0 Telegram \xed\xe5 \xe2\xea\xeb\xfe\xf7\xe5\xed\xe0; \xe2\xf5\xee\xe4\xff\xf9\xe8\xe5 \xf1\xee\xe1\xfb\xf2\xe8\xff \xe4\xee\xeb\xe6\xed\xfb \xef\xf0\xe8\xed\xe8\xec\xe0\xf2\xfc\xf1\xff \xf2\xee\xeb\xfc\xea\xee \xf1 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xec \xf1\xe5\xea\xf0\xe5\xf2\xee\xec.");
    nextActions.push("\xd1\xe3\xe5\xed\xe5\xf0\xe8\xf0\xf3\xe9\xf2\xe5 \xf1\xe5\xea\xf0\xe5\xf2 \xe2\xe5\xe1\xf5\xf3\xea\xe0 \xe8 \xef\xee\xe4\xea\xeb\xfe\xf7\xe8\xf2\xe5 \xe5\xe3\xee \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xf5 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 Telegram.");
  }
  if (settings.mode === "clinic_owned_bot" && !runtime.clinicOwnedBotReady) {
    warnings.push("\xd1\xee\xe1\xf1\xf2\xe2\xe5\xed\xed\xfb\xe9 \xe1\xee\xf2 \xea\xeb\xe8\xed\xe8\xea\xe8 \xe2\xea\xeb\xfe\xf7\xe5\xed, \xed\xee \xed\xe5 \xe3\xee\xf2\xee\xe2: \xe4\xee\xe1\xe0\xe2\xfc\xf2\xe5 \xe8\xec\xff \xe1\xee\xf2\xe0 \xe8 \xe5\xe3\xee \xf1\xe5\xea\xf0\xe5\xf2 \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xfb\xe5 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe8.");
    nextActions.push("\xcf\xf0\xee\xe2\xe5\xf0\xfc\xf2\xe5 \xe8\xec\xff \xf1\xee\xe1\xf1\xf2\xe2\xe5\xed\xed\xee\xe3\xee \xe1\xee\xf2\xe0 \xe8 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xf3\xfe \xe7\xe0\xef\xe8\xf1\xfc \xf1 \xe5\xe3\xee \xf1\xe5\xea\xf0\xe5\xf2\xee\xec \xe4\xeb\xff \xe2\xfb\xe1\xf0\xe0\xed\xed\xee\xe9 \xea\xeb\xe8\xed\xe8\xea\xe8.");
  }
  if (settings.privacyMode !== "no_phi_by_default") {
    warnings.push("Telegram-\xf8\xe0\xe1\xeb\xee\xed\xfb \xf1 \xec\xe5\xe4\xe4\xe0\xed\xed\xfb\xec\xe8 \xf2\xf0\xe5\xe1\xf3\xfe\xf2 \xe0\xe2\xf2\xee\xf0\xe8\xe7\xe0\xf6\xe8\xfe, \xf1\xee\xe3\xeb\xe0\xf1\xe8\xff \xe8 tenant-policy \xe4\xee production.");
  }
  if (!settings.patientPortalBaseUrl) {
    nextActions.push("\xd3\xea\xe0\xe6\xe8\xf2\xe5 patientPortalBaseUrl \xef\xe5\xf0\xe5\xe4 \xee\xf2\xef\xf0\xe0\xe2\xea\xee\xe9 \xf1\xf1\xfb\xeb\xee\xea \xed\xe0 \xe3\xee\xf2\xee\xe2\xfb\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xe8 \xed\xe0\xeb\xee\xe3\xee\xe2\xfb\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb.");
  }

  return denteTelegramBotStatusSchema.parse(readableTelegramPayload({
    settings,
    organizationId: runtime.organizationId,
    clinicId: runtime.clinicId,
    botConfigId: runtime.botConfigId,
    mode: settings.mode,
    botUsername: runtime.botUsername,
    tokenConfigured: runtime.tokenConfigured,
    webhookSecretConfigured: runtime.webhookSecretConfigured,
    webhookReady: runtime.webhookReady,
    clinicOwnedBotReady: runtime.clinicOwnedBotReady,
    warnings,
    nextActions,
    processedUpdateCount: listDenteTelegramWebhookEvents(300, runtime.organizationId, runtime.botConfigId).filter((event) => event.status === "processed").length,
    pendingLinkCodeCount: isPrimaryRuntime ? listDenteTelegramLinkCodes(100).filter((code) => code.status === "pending").length : 0,
    activeChatLinkCount: isPrimaryRuntime ? listDenteTelegramChatLinks(100).filter((link) => link.status === "active").length : 0,
    recentEvents: listDenteTelegramWebhookEvents(50, runtime.organizationId, runtime.botConfigId)
  }));
}

function buildFeaturePlan(settings: DenteTelegramBotSettings) {
  return readableTelegramPayload({
    productName: "DENTE",
    botUsername: configuredBotUsername(settings),
    modes: [
      "shared_dente_bot: \xee\xe1\xf9\xe8\xe9 \xef\xeb\xe0\xf2\xf4\xee\xf0\xec\xe5\xed\xed\xfb\xe9 \xe1\xee\xf2, \xea\xeb\xe8\xed\xe8\xea\xe0 \xee\xef\xf0\xe5\xe4\xe5\xeb\xff\xe5\xf2\xf1\xff \xef\xee \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xee\xec\xf3 \xea\xee\xe4\xf3",
      "clinic_owned_bot: \xf1\xee\xe1\xf1\xf2\xe2\xe5\xed\xed\xfb\xe9 \xe1\xee\xf2 \xea\xeb\xe8\xed\xe8\xea\xe8; \xe8\xec\xff \xe2 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5, \xf1\xe5\xea\xf0\xe5\xf2 \xf2\xee\xeb\xfc\xea\xee \xe2 \xf1\xe5\xf0\xe2\xe5\xf0\xed\xee\xe9 \xea\xee\xed\xf4\xe8\xe3\xf3\xf0\xe0\xf6\xe8\xe8"
    ],
    enabledFeatures: settings.enabledFeatures,
    releaseReadyLayers: [
      "linking: \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe5 QR/deep-link \xea\xee\xe4\xfb",
      "outbox: \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xe0\xff \xee\xf7\xe5\xf0\xe5\xe4\xfc \xed\xe0\xef\xee\xec\xe8\xed\xe0\xed\xe8\xe9 \xf1 \xef\xf0\xe8\xf7\xe8\xed\xe0\xec\xe8 \xe1\xeb\xee\xea\xe8\xf0\xee\xe2\xea\xe8",
      "transport: \xee\xf2\xef\xf0\xe0\xe2\xea\xe0 \xe8\xe4\xe5\xf2 \xf2\xee\xeb\xfc\xea\xee \xf7\xe5\xf0\xe5\xe7 \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed\xed\xee\xe3\xee \xe1\xee\xf2\xe0 \xe8 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xf3\xfe \xf1\xe2\xff\xe7\xea\xf3 \xf7\xe0\xf2\xe0",
      "audit: webhook-\xf1\xee\xe1\xfb\xf2\xe8\xff \xe8 \xea\xee\xec\xec\xf3\xed\xe8\xea\xe0\xf6\xe8\xe8 \xee\xf1\xf2\xe0\xfe\xf2\xf1\xff \xe2 DENTE"
    ],
    patientSafeActions: [
      "\xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4 \xef\xf0\xe8\xe2\xff\xe7\xea\xe8",
      "\xef\xee\xe4\xf2\xe2\xe5\xf0\xe6\xe4\xe5\xed\xe8\xe5 \xef\xf0\xe8\xe5\xec\xe0",
      "\xef\xe5\xf0\xe5\xed\xee\xf1 \xef\xf0\xe8\xe5\xec\xe0 \xe8\xeb\xe8 \xe7\xe0\xef\xf0\xee\xf1 \xe7\xe2\xee\xed\xea\xe0",
      "\xf3\xe2\xe5\xe4\xee\xec\xeb\xe5\xed\xe8\xe5 \xee \xe3\xee\xf2\xee\xe2\xed\xee\xf1\xf2\xe8 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xe0 \xf7\xe5\xf0\xe5\xe7 \xf1\xf1\xfb\xeb\xea\xf3 \xed\xe0 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xfb\xe9 \xef\xee\xf0\xf2\xe0\xeb",
      "\xf1\xf2\xe0\xf2\xf3\xf1 \xed\xe0\xeb\xee\xe3\xee\xe2\xee\xe3\xee \xe7\xe0\xef\xf0\xee\xf1\xe0 \xe1\xe5\xe7 \xef\xe5\xf0\xe5\xe4\xe0\xf7\xe8 PDF",
      "\xee\xe1\xf9\xe8\xe5 \xef\xe0\xec\xff\xf2\xea\xe8 \xef\xee\xf1\xeb\xe5 \xe2\xe8\xe7\xe8\xf2\xe0 \xef\xee \xf3\xf2\xe2\xe5\xf0\xe6\xe4\xe5\xed\xed\xfb\xec \xf8\xe0\xe1\xeb\xee\xed\xe0\xec"
    ],
    staffSafeActions: [
      "\xe5\xe6\xe5\xe4\xed\xe5\xe2\xed\xe0\xff \xf1\xe2\xee\xe4\xea\xe0 \xf0\xe0\xf1\xef\xe8\xf1\xe0\xed\xe8\xff",
      "\xee\xf7\xe5\xf0\xe5\xe4\xfc \xef\xee\xe4\xf2\xe2\xe5\xf0\xe6\xe4\xe5\xed\xe8\xe9",
      "\xfd\xf1\xea\xe0\xeb\xe0\xf6\xe8\xff \xe7\xe0\xe4\xe0\xf7 \xf1\xe2\xff\xe7\xe8",
      "\xf1\xf7\xe5\xf2\xf7\xe8\xea\xe8 \xe3\xee\xf2\xee\xe2\xed\xee\xf1\xf2\xe8 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xee\xe2 \xe1\xe5\xe7 \xf2\xe5\xeb\xe0 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xee\xe2",
      "\xec\xe0\xf0\xf8\xf0\xf3\xf2\xe8\xe7\xe0\xf6\xe8\xff \xe7\xe0\xef\xf0\xee\xf1\xee\xe2 \xee\xe1\xf0\xe0\xf2\xed\xee\xe3\xee \xe7\xe2\xee\xed\xea\xe0"
    ],
    blockedByDefault: [
      "\xf2\xe5\xea\xf1\xf2 \xe4\xe8\xe0\xe3\xed\xee\xe7\xe0",
      "\xed\xee\xec\xe5\xf0\xe0 \xe7\xf3\xe1\xee\xe2 \xe8 \xe4\xe5\xf2\xe0\xeb\xe8 \xeb\xe5\xf7\xe5\xed\xe8\xff",
      "\xef\xe5\xf0\xe5\xe4\xe0\xf7\xe0 DICOM/\xca\xcb\xca\xd2/\xf0\xe5\xed\xf2\xe3\xe5\xed\xe0/\xf4\xee\xf2\xee",
      "\xed\xe0\xeb\xee\xe3\xee\xe2\xfb\xe5 PDF \xe8 \xea\xee\xef\xe8\xe8 \xec\xe5\xe4\xea\xe0\xf0\xf2\xfb \xea\xe0\xea \xf4\xe0\xe9\xeb\xfb Telegram",
      "\xf1\xe2\xee\xe1\xee\xe4\xed\xfb\xe5 \xea\xeb\xe8\xed\xe8\xf7\xe5\xf1\xea\xe8\xe5 \xf0\xe5\xea\xee\xec\xe5\xed\xe4\xe0\xf6\xe8\xe8"
    ]
  });
}

async function sendWebhookSuggestedReply(
  chatId: string | null,
  suggestedReply: TelegramWebhookReplyPackage,
  botToken: string | null
): Promise<string | null> {
  if (!chatId || !suggestedReply.text?.trim()) return null;
  if (!botToken) return "\xce\xf2\xe2\xe5\xf2 Telegram \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xe5\xed: \xf2\xee\xea\xe5\xed \xe1\xee\xf2\xe0 \xed\xe5 \xed\xe0\xf1\xf2\xf0\xee\xe5\xed.";
  const text = repairMojibakeText(suggestedReply.text);
  const replyMarkup = readableTelegramPayload(suggestedReply.replyMarkup);
  const photoUrl = suggestedReply.photoUrl?.trim();

  if (photoUrl) {
    const photoResult = await sendTelegramPhotoMessage({
      botToken,
      chatId,
      photoUrl,
      caption: text,
      replyMarkup,
      timeoutMs: Math.min(configuredSendTimeoutMs(), 5000)
    });

    if (photoResult.ok) return null;
  }

  const result = await sendTelegramTextMessage({
    botToken,
    chatId,
    text,
    replyMarkup,
    timeoutMs: Math.min(configuredSendTimeoutMs(), 5000)
  });

  if (result.ok) return null;
  return telegramWebhookReplyFailureWarning(result);
}

async function handleWebhook(
  request: FastifyRequest<{ Params: { organizationId?: string; botConfigId?: string } }>,
  reply: FastifyReply
) {
  const runtimeResult = resolveTelegramRuntimeContext(request.params.organizationId ?? null, request.params.botConfigId ?? null);
  if (!runtimeResult.ok) {
    return reply.code(runtimeResult.statusCode).send({
      ok: false,
      error: runtimeResult.error,
      message: runtimeResult.message
    });
  }
  const runtime = runtimeResult.context;
  const settings = runtime.settings;
  const expectedSecret = runtime.webhookSecret;
  const providedSecret = stringFromUnknown(request.headers[telegramSecretHeader]) ?? null;

  if (!expectedSecret && process.env.NODE_ENV === "production") {
    return reply.code(503).send({
      ok: false,
      error: "TelegramWebhookSecretRequired"
    });
  }

  if (expectedSecret && !timingSafeSecretEqual(providedSecret, expectedSecret)) {
    return reply.code(401).send({
      ok: false,
      error: "TelegramWebhookSecretMismatch"
    });
  }

  if (settings.mode === "disabled") {
    return denteTelegramWebhookResponseSchema.parse(readableTelegramPayload({
      ok: true,
      duplicate: false,
      action: "ignored_telegram_disabled",
      suggestedReply: null,
      warnings: ["Telegram \xee\xf2\xea\xeb\xfe\xf7\xe5\xed \xe2 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 \xea\xeb\xe8\xed\xe8\xea\xe8; update \xed\xe5 \xee\xe1\xf0\xe0\xe1\xee\xf2\xe0\xed, \xea\xee\xe4 \xef\xf0\xe8\xe2\xff\xe7\xea\xe8 \xed\xe5 \xe8\xf1\xef\xee\xeb\xfc\xe7\xee\xe2\xe0\xed."],
      event: null
    }));
  }

  const parsedUpdate = parseTelegramRouteBody(denteTelegramWebhookUpdateSchema, request.body);
  if (!parsedUpdate.ok) {
    return reply.code(400).send({
      ok: false,
      error: "TelegramWebhookValidationFailed",
      message: parsedUpdate.message
    });
  }
  const update = parsedUpdate.value as UnknownRecord & { update_id: number };
  if (hasDenteTelegramWebhookUpdate(update.update_id, runtime.organizationId, runtime.botConfigId)) {
    return denteTelegramWebhookResponseSchema.parse({
      ok: true,
      duplicate: true,
      action: "ignored_duplicate_update",
      suggestedReply: null,
      warnings: [],
      event: null
    });
  }

  const updateKind = detectUpdateKind(update);
  const callbackData = extractCallbackData(update);
  const callbackAction = extractSafeCallbackAction(update);
  const callbackQueryId = extractCallbackQueryId(update);
  const command =
    extractCommand(update) ??
    (callbackData?.startsWith("d1.") ? "/callback:appointment" : callbackAction ? `/callback:${callbackAction.replace("dente:", "")}` : null);
  const chatInfo = extractChatInfo(update);
  const chatId = chatInfo?.id ?? null;
  const chatType = chatInfo?.type ?? null;
  const messageText = extractMessageText(update);
  const suppressPublicChatReply = Boolean(chatType && chatType !== "private");
  const chatHash = chatFingerprint(chatId, runtime.organizationId);
  const webhookClaim = claimDenteTelegramWebhookUpdate({
    updateId: update.update_id,
    organizationId: runtime.organizationId,
    botConfigId: runtime.botConfigId,
    chatFingerprint: chatHash,
    updateKind,
    command
  });
  if (!webhookClaim.claimed) {
    return denteTelegramWebhookResponseSchema.parse({
      ok: true,
      duplicate: true,
      action: "ignored_duplicate_update",
      suggestedReply: null,
      warnings: [],
      event: null
    });
  }
  const appointmentCallbackResult = handleDenteTelegramAppointmentCallback({
    callbackData,
    chatFingerprint: chatHash,
    organizationId: runtime.organizationId,
    clinicId: runtime.clinicId,
    botConfigId: runtime.botConfigId
  });
  const linkCode = appointmentCallbackResult.handled ? null : extractDenteTelegramLinkCode(messageText);
  const linkCodeRejectedByChatType = Boolean(linkCode && chatType !== "private");
  const linkCodeRejectedByRateLimit = Boolean(
    linkCode && !linkCodeRejectedByChatType && telegramLinkCodeRateLimitExceeded(chatHash, runtime.organizationId, runtime.botConfigId)
  );
  const linkResult =
    linkCode && !linkCodeRejectedByChatType && !linkCodeRejectedByRateLimit
      ? consumeDenteTelegramLinkCode(linkCode, chatHash, chatId, {
          organizationId: runtime.organizationId,
          clinicId: runtime.clinicId,
          botConfigId: runtime.botConfigId
        })
      : null;
  const warnings = [
    ...webhookClaim.event.warnings,
    ...appointmentCallbackResult.warnings,
    ...(expectedSecret ? [] : ["Webhook secret \xed\xe5 \xed\xe0\xf1\xf2\xf0\xee\xe5\xed; update \xef\xf0\xe8\xed\xe8\xec\xe0\xe5\xf2\xf1\xff \xf2\xee\xeb\xfc\xea\xee \xe4\xeb\xff \xeb\xee\xea\xe0\xeb\xfc\xed\xee\xe9 \xf0\xe0\xe7\xf0\xe0\xe1\xee\xf2\xea\xe8."])
  ];

  if (linkCodeRejectedByChatType) {
    warnings.push("\xce\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4 Telegram \xec\xee\xe6\xed\xee \xe8\xf1\xef\xee\xeb\xfc\xe7\xee\xe2\xe0\xf2\xfc \xf2\xee\xeb\xfc\xea\xee \xe2 \xeb\xe8\xf7\xed\xee\xec \xf7\xe0\xf2\xe5 \xf1 \xe1\xee\xf2\xee\xec; \xef\xf0\xe8\xe2\xff\xe7\xea\xe0 \xe2 \xe3\xf0\xf3\xef\xef\xe0\xf5 \xe8 \xea\xe0\xed\xe0\xeb\xe0\xf5 \xe7\xe0\xe1\xeb\xee\xea\xe8\xf0\xee\xe2\xe0\xed\xe0.");
  }
  if (linkCodeRejectedByRateLimit) {
    warnings.push("\xd1\xeb\xe8\xf8\xea\xee\xec \xec\xed\xee\xe3\xee \xed\xe5\xe2\xe5\xf0\xed\xfb\xf5 \xea\xee\xe4\xee\xe2 Telegram-\xef\xf0\xe8\xe2\xff\xe7\xea\xe8 \xe7\xe0 \xea\xee\xf0\xee\xf2\xea\xee\xe5 \xe2\xf0\xe5\xec\xff; \xef\xf0\xe8\xe5\xec \xea\xee\xe4\xee\xe2 \xe4\xeb\xff \xfd\xf2\xee\xe3\xee \xf7\xe0\xf2\xe0 \xe2\xf0\xe5\xec\xe5\xed\xed\xee \xee\xe3\xf0\xe0\xed\xe8\xf7\xe5\xed.");
  }
  if (updateKind === "voice" && !settings.allowVoiceIntake) {
    warnings.push("\xc3\xee\xeb\xee\xf1\xee\xe2\xee\xe9 \xe2\xe2\xee\xe4 \xee\xf2\xea\xeb\xfe\xf7\xe5\xed; \xe0\xf3\xe4\xe8\xee \xe8\xe7 Telegram \xed\xe5 \xe4\xee\xeb\xe6\xed\xee \xef\xee\xef\xe0\xe4\xe0\xf2\xfc \xe2 \xec\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xf3\xfe \xe7\xe0\xef\xe8\xf1\xfc \xef\xee \xf3\xec\xee\xeb\xf7\xe0\xed\xe8\xfe.");
  }
  if (updateKind === "photo" || updateKind === "document") {
    warnings.push("\xcf\xe5\xf0\xe5\xe4\xe0\xf7\xe0 \xf4\xe0\xe9\xeb\xee\xe2 Telegram \xed\xe5 \xef\xf0\xe8\xed\xe8\xec\xe0\xe5\xf2\xf1\xff \xe4\xeb\xff \xec\xe5\xe4\xe4\xee\xea\xf3\xec\xe5\xed\xf2\xee\xe2 \xe8 \xf1\xed\xe8\xec\xea\xee\xe2 \xe2 \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xee\xe9 \xef\xee\xeb\xe8\xf2\xe8\xea\xe5 \xef\xee \xf3\xec\xee\xeb\xf7\xe0\xed\xe8\xfe.");
  }
  if (linkResult && !linkResult.ok) {
    if (linkResult.reason === "chat_encryption_key_missing") {
      warnings.push("\xc7\xe0\xf9\xe8\xf9\xe5\xed\xed\xe0\xff \xf1\xe2\xff\xe7\xea\xe0 Telegram-\xf7\xe0\xf2\xe0 \xed\xe5 \xed\xe0\xf1\xf2\xf0\xee\xe5\xed\xe0; \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4 Telegram \xed\xe5 \xe1\xfb\xeb \xe8\xf1\xef\xee\xeb\xfc\xe7\xee\xe2\xe0\xed.");
    } else if (linkResult.reason === "missing_chat_transport" || linkResult.reason === "chat_encryption_failed") {
      warnings.push("\xd7\xe0\xf2 Telegram \xed\xe5 \xf3\xe4\xe0\xeb\xee\xf1\xfc \xf1\xee\xf5\xf0\xe0\xed\xe8\xf2\xfc \xe2 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xee\xe9 \xf1\xe2\xff\xe7\xea\xe5; \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4 Telegram \xed\xe5 \xe1\xfb\xeb \xe8\xf1\xef\xee\xeb\xfc\xe7\xee\xe2\xe0\xed.");
    } else {
      warnings.push("\xce\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4 Telegram \xed\xe5\xe2\xe5\xf0\xed\xfb\xe9, \xe8\xf1\xf2\xe5\xea, \xf3\xe6\xe5 \xe8\xf1\xef\xee\xeb\xfc\xe7\xee\xe2\xe0\xed \xe8\xeb\xe8 \xee\xf2\xee\xe7\xe2\xe0\xed.");
    }
  }

  const action =
    appointmentCallbackResult.handled
      ? appointmentCallbackResult.action
      : linkCodeRejectedByChatType
      ? "rejected_non_private_telegram_link_chat"
      : linkCodeRejectedByRateLimit
        ? "rate_limited_telegram_link_code"
      : suppressPublicChatReply
        ? "rejected_non_private_telegram_chat"
      : linkResult?.ok === true
      ? `linked_${linkResult.subjectType}_telegram_chat`
      : linkResult
        ? "rejected_telegram_link_code"
        : updateKind === "unsupported"
          ? "ignored_unsupported_update"
          : "queued_safe_triage";
  const suggestedReply =
    appointmentCallbackResult.handled
      ? {
          text: appointmentCallbackResult.suggestedReply,
          replyMarkup: safeCommandKeyboard(settings, "appointment_callback"),
          photoUrl: patientMenuCardPhoto(settings, "appointment")
        }
      : linkCodeRejectedByRateLimit
      ? {
          text: null,
          replyMarkup: null
        }
      : linkCodeRejectedByChatType || suppressPublicChatReply
      ? {
          text: linkCodeRejectedByChatType
            ? "\xca\xee\xe4 DENTE \xed\xe5 \xef\xf0\xe8\xed\xff\xf2 \xe2 \xef\xf3\xe1\xeb\xe8\xf7\xed\xee\xec \xf7\xe0\xf2\xe5. \xce\xf2\xea\xf0\xee\xe9\xf2\xe5 \xeb\xe8\xf7\xed\xfb\xe9 \xf7\xe0\xf2 \xf1 \xe1\xee\xf2\xee\xec \xe8 \xef\xee\xef\xf0\xee\xf1\xe8\xf2\xe5 \xea\xeb\xe8\xed\xe8\xea\xf3 \xef\xee\xea\xe0\xe7\xe0\xf2\xfc QR \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed\xe8\xff \xe8\xeb\xe8 \xee\xf2\xef\xf0\xe0\xe2\xfc\xf2\xe5 \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4 \xf2\xe0\xec."
            : "DENTE \xee\xf2\xe2\xe5\xf7\xe0\xe5\xf2 \xf2\xee\xeb\xfc\xea\xee \xe2 \xeb\xe8\xf7\xed\xee\xec \xf7\xe0\xf2\xe5 \xf1 \xe1\xee\xf2\xee\xec. \xce\xf2\xea\xf0\xee\xe9\xf2\xe5 \xeb\xe8\xf7\xed\xfb\xe9 \xf7\xe0\xf2, \xf7\xf2\xee\xe1\xfb \xef\xee\xe4\xea\xeb\xfe\xf7\xe8\xf2\xfc \xf3\xe2\xe5\xe4\xee\xec\xeb\xe5\xed\xe8\xff \xea\xeb\xe8\xed\xe8\xea\xe8.",
          replyMarkup: safeCommandKeyboard(settings, "rejected"),
          photoUrl: patientMenuCardPhoto(settings, "mainMenu")
        }
      : linkResult?.ok === true
      ? {
          text: "\xcf\xf0\xe8\xe2\xff\xe7\xea\xe0 DENTE \xe7\xe0\xe2\xe5\xf0\xf8\xe5\xed\xe0. Telegram \xe1\xf3\xe4\xe5\xf2 \xef\xee\xeb\xf3\xf7\xe0\xf2\xfc \xf2\xee\xeb\xfc\xea\xee \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xfb\xe5 \xf3\xe2\xe5\xe4\xee\xec\xeb\xe5\xed\xe8\xff \xea\xeb\xe8\xed\xe8\xea\xe8. \xcc\xe5\xe4\xe8\xf6\xe8\xed\xf1\xea\xe8\xe5 \xe4\xee\xea\xf3\xec\xe5\xed\xf2\xfb \xee\xf1\xf2\xe0\xfe\xf2\xf1\xff \xe2 \xe7\xe0\xf9\xe8\xf9\xe5\xed\xed\xee\xec \xef\xee\xf0\xf2\xe0\xeb\xe5.",
          replyMarkup: safeCommandKeyboard(settings, "linked"),
          photoUrl: patientMenuCardPhoto(settings, "mainMenu")
        }
      : linkResult
        ? {
            text:
              linkResult.reason === "chat_encryption_key_missing" ||
              linkResult.reason === "missing_chat_transport" ||
              linkResult.reason === "chat_encryption_failed"
                ? "DENTE \xe2\xf0\xe5\xec\xe5\xed\xed\xee \xed\xe5 \xec\xee\xe6\xe5\xf2 \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xee \xef\xf0\xe8\xe2\xff\xe7\xe0\xf2\xfc Telegram. \xcf\xee\xef\xf0\xee\xf1\xe8\xf2\xe5 \xea\xeb\xe8\xed\xe8\xea\xf3 \xef\xf0\xee\xe2\xe5\xf0\xe8\xf2\xfc \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe8 \xe1\xee\xf2\xe0 \xe8 \xef\xee\xe2\xf2\xee\xf0\xe8\xf2\xfc \xea\xee\xe4 \xef\xee\xf1\xeb\xe5 \xe8\xf1\xef\xf0\xe0\xe2\xeb\xe5\xed\xe8\xff."
                : "\xca\xee\xe4 DENTE \xed\xe5 \xef\xf0\xe8\xed\xff\xf2. \xcf\xee\xef\xf0\xee\xf1\xe8\xf2\xe5 \xea\xeb\xe8\xed\xe8\xea\xf3 \xef\xee\xea\xe0\xe7\xe0\xf2\xfc \xed\xee\xe2\xfb\xe9 QR \xef\xee\xe4\xea\xeb\xfe\xf7\xe5\xed\xe8\xff \xe8\xeb\xe8 \xe2\xfb\xe4\xe0\xf2\xfc \xed\xee\xe2\xfb\xe9 \xee\xe4\xed\xee\xf0\xe0\xe7\xee\xe2\xfb\xe9 \xea\xee\xe4.",
            replyMarkup: safeCommandKeyboard(settings, "rejected"),
            photoUrl: patientMenuCardPhoto(settings, "mainMenu")
          }
        : suggestedReplyFor(command, callbackAction, settings, chatHash, updateKind, messageText, {
            organizationId: runtime.organizationId,
            clinicId: runtime.clinicId,
            botConfigId: runtime.botConfigId
          });

  const botToken = runtime.botToken;
  if (callbackQueryId && botToken) {
    const callbackAnswer = await answerTelegramCallbackQuery({
      botToken,
      callbackQueryId,
      text: appointmentCallbackResult.handled ? appointmentCallbackResult.callbackAnswerText : "DENTE: \xe1\xe5\xe7\xee\xef\xe0\xf1\xed\xfb\xe9 \xee\xf2\xe2\xe5\xf2 \xee\xf2\xef\xf0\xe0\xe2\xeb\xe5\xed.",
      timeoutMs: Math.min(configuredSendTimeoutMs(), 5000)
    });
    if (!callbackAnswer.ok) warnings.push(telegramCallbackTransportFailureWarning(callbackAnswer));
  }

  const replyWarning = suppressPublicChatReply ? null : await sendWebhookSuggestedReply(chatId, suggestedReply, runtime.botToken);
  if (suppressPublicChatReply) {
    warnings.push("\xce\xf2\xe2\xe5\xf2 Telegram \xed\xe5 \xee\xf2\xef\xf0\xe0\xe2\xeb\xe5\xed \xe2 \xe3\xf0\xf3\xef\xef\xf3 \xe8\xeb\xe8 \xea\xe0\xed\xe0\xeb: DENTE \xee\xf2\xe2\xe5\xf7\xe0\xe5\xf2 \xf2\xee\xeb\xfc\xea\xee \xe2 \xeb\xe8\xf7\xed\xee\xec \xf7\xe0\xf2\xe5.");
  }
  if (replyWarning) warnings.push(replyWarning);

  const event = recordDenteTelegramWebhookEvent({
    updateId: update.update_id,
    organizationId: runtime.organizationId,
    botConfigId: runtime.botConfigId,
    chatFingerprint: chatHash,
    updateKind,
    command,
    status:
      (appointmentCallbackResult.handled && !appointmentCallbackResult.ok) ||
      linkCodeRejectedByChatType ||
      linkCodeRejectedByRateLimit ||
      suppressPublicChatReply ||
      (linkResult ? !linkResult.ok : false)
        ? "rejected"
        : updateKind === "unsupported"
          ? "ignored"
          : "processed",
    action,
    warnings
  });

  return denteTelegramWebhookResponseSchema.parse(readableTelegramPayload({
    ok: true,
    duplicate: false,
    action: event.action,
    suggestedReply: readableTelegramText(suggestedReply.text),
    suggestedReplyMarkup: readableTelegramPayload(suggestedReply.replyMarkup),
    suggestedPhotoUrl: suggestedReply.photoUrl?.trim() || null,
    warnings,
    event
  }));
}

export async function registerTelegramWebhookRoutes(app: FastifyInstance) {
  app.post("/api/telegram/webhook", handleWebhook);
  app.post("/api/telegram/webhook/:organizationId/:botConfigId", handleWebhook);
  app.post("/api/telegram/webhook/:organizationId", handleWebhook);
}


function registerTelegramStatusRoutes(app: FastifyInstance, telegramControlPlaneRouteOptions: { preHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void> }) {
  app.get("/api/telegram/status", telegramControlPlaneRouteOptions, async () => buildStatus());

  app.get<{ Params: { organizationId: string } }>("/api/telegram/status/:organizationId", telegramControlPlaneRouteOptions, async (request, reply) => {
    const runtimeResult = resolveTelegramRuntimeContext(request.params.organizationId);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    return buildStatus(request.params.organizationId);
  });

  app.get<{ Params: { organizationId: string; botConfigId: string } }>(
    "/api/telegram/status/:organizationId/:botConfigId",
    telegramControlPlaneRouteOptions,
    async (request, reply) => {
      const runtimeResult = resolveTelegramRuntimeContext(request.params.organizationId, request.params.botConfigId);
      if (!runtimeResult.ok) {
        return reply.code(runtimeResult.statusCode).send({
          error: runtimeResult.error,
          message: runtimeResult.message
        });
      }
      return buildStatus(request.params.organizationId, request.params.botConfigId);
    }
  );
}

function registerTelegramSettingsRoutes(app: FastifyInstance, telegramControlPlaneRouteOptions: { preHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void> }) {
  app.get("/api/settings/telegram", telegramControlPlaneRouteOptions, async () => buildStatus());

  app.put("/api/settings/telegram", telegramControlPlaneRouteOptions, async (request, reply) => {
    const parsedInput = parseTelegramRouteBody(updateDenteTelegramBotSettingsSchema, request.body);
    if (!parsedInput.ok) {
      const schemaResult = updateDenteTelegramBotSettingsSchema.safeParse(request.body);
      const issueCount = schemaResult.success ? 0 : schemaResult.error.issues.length;
      return reply.code(400).send({
        error: "TelegramSettingsValidationFailed",
        message: schemaResult.success || issueCount !== 1 ? parsedInput.message : readableTelegramSettingsSchemaMessage(schemaResult.error)
      });
    }
    const input: UpdateDenteTelegramBotSettingsInput = parsedInput.value;
    try {
      updateDenteTelegramBotSettings(input);
    } catch (settingsError) {
      return reply.code(400).send({
        error: "TelegramSettingsValidationFailed",
        message: readableTelegramSettingsValidationMessage(settingsError)
      });
    }
    return buildStatus();
  });

  app.get("/api/telegram/feature-plan", telegramControlPlaneRouteOptions, async () => buildFeaturePlan(getDenteTelegramBotSettings()));
}

function registerTelegramOutboxRoutes(app: FastifyInstance, telegramControlPlaneRouteOptions: { preHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void> }) {
  app.get<{ Querystring: Record<string, unknown> }>("/api/telegram/outbox", telegramControlPlaneRouteOptions, async (request, reply) => {
    const runtimeResult = resolveTelegramOutboxRuntimeScopeFromQuery(request.query);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    return buildDenteTelegramOutbox(parseTelegramOutboxQuery(request.query), runtimeResult.runtime.runtimeScope);
  });

  app.post<{ Params: { itemId: string }; Querystring: Record<string, unknown> }>("/api/telegram/outbox/:itemId/send", telegramControlPlaneRouteOptions, async (request, reply) => {
    const parsedInput = parseTelegramRouteBody(denteTelegramOutboxSendRequestSchema, request.body ?? {});
    if (!parsedInput.ok) return sendTelegramValidationError(reply);
    const runtimeResult = resolveTelegramOutboxRuntimeScopeFromQuery(request.query);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    const result = await executeTelegramOutboxSend(request.params.itemId, parsedInput.value, runtimeResult.runtime);
    return reply.code(result.statusCode).send(result.body);
  });

  app.post<{ Querystring: Record<string, unknown> }>("/api/telegram/outbox/send-due", telegramControlPlaneRouteOptions, async (request, reply) => {
    const input = parseTelegramOutboxSendDueInput(request.body ?? {});
    if (!input) return sendTelegramValidationError(reply, "TelegramOutboxDueValidationFailed");
    const runtimeResult = resolveTelegramOutboxRuntimeScopeFromQuery(request.query);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    const response = await executeDenteTelegramOutboxDueBatch(input, runtimeResult.runtime);
    return reply.code(response.failedCount > 0 ? 502 : response.blockedCount > 0 ? 409 : 200).send(response);
  });
}

function registerTelegramLinkRoutes(app: FastifyInstance, telegramControlPlaneRouteOptions: { preHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void> }) {
  app.post("/api/telegram/link-codes", telegramControlPlaneRouteOptions, async (request, reply) => {
    const parsedInput = parseTelegramRouteBody(createDenteTelegramLinkCodeSchema, request.body);
    if (!parsedInput.ok) return sendTelegramValidationError(reply);
    const input = parsedInput.value;
    const requestedOrganizationId = input.organizationId ?? (input.botConfigId ? (input.clinicId ?? null) : null);
    const runtimeResult = resolveTelegramRuntimeContext(requestedOrganizationId, input.botConfigId ?? null);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    const runtime = runtimeResult.context;
    const settings = runtime.settings;
    const requestedClinicId = input.clinicId?.trim() || null;
    if (requestedClinicId && requestedClinicId !== runtime.clinicId) {
      return reply.code(409).send({
        error: "TelegramLinkCodeScopeInvalid",
        message: "\xca\xee\xe4 \xef\xf0\xe8\xe2\xff\xe7\xea\xe8 Telegram \xee\xf2\xed\xee\xf1\xe8\xf2\xf1\xff \xea \xe4\xf0\xf3\xe3\xee\xe9 \xea\xeb\xe8\xed\xe8\xea\xe5."
      });
    }
    if (settings.mode === "disabled" || !settings.enabledFeatures.includes("patient_linking")) {
      return reply.code(409).send({
        error: "TelegramLinkingDisabled",
        message: "\xcf\xf0\xe8\xe2\xff\xe7\xea\xe0 Telegram \xee\xf2\xea\xeb\xfe\xf7\xe5\xed\xe0 \xe2 \xed\xe0\xf1\xf2\xf0\xee\xe9\xea\xe0\xf5 \xea\xeb\xe8\xed\xe8\xea\xe8."
      });
    }
    try {
      return createDenteTelegramLinkCode({
        ...input,
        organizationId: runtime.organizationId,
        clinicId: input.clinicId ?? runtime.clinicId,
        botConfigId: runtime.botConfigId,
        botUsername: runtime.botUsername
      });
    } catch (linkCodeError) {
      const rejection = telegramLinkCodeRejection(linkCodeError);
      return reply.code(409).send({
        error: rejection.error,
        reason: rejection.reason,
        message: rejection.message
      });
    }
  });

  app.get<{ Querystring: Record<string, unknown> }>("/api/telegram/link-codes", telegramControlPlaneRouteOptions, async (request, reply) => {
    const runtimeResult = resolveTelegramOutboxRuntimeScopeFromQuery(request.query);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    const runtime = runtimeResult.runtime.context;
    return buildDenteTelegramLinkCodeList({
      ...parseTelegramLinkCodeListQuery(request.query),
      organizationId: runtime.organizationId,
      clinicId: runtime.clinicId,
      botConfigId: runtime.botConfigId
    });
  });

  app.get<{ Querystring: Record<string, unknown> }>("/api/telegram/chat-links", telegramControlPlaneRouteOptions, async (request, reply) => {
    const runtimeResult = resolveTelegramOutboxRuntimeScopeFromQuery(request.query);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    const runtime = runtimeResult.runtime.context;
    return buildDenteTelegramChatLinkList({
      ...parseTelegramChatLinkListQuery(request.query),
      organizationId: runtime.organizationId,
      clinicId: runtime.clinicId,
      botConfigId: runtime.botConfigId
    });
  });

  app.post<{ Params: { linkId: string }; Querystring: Record<string, unknown> }>("/api/telegram/chat-links/:linkId/revoke", telegramControlPlaneRouteOptions, async (request, reply) => {
    const runtimeResult = resolveTelegramOutboxRuntimeScopeFromQuery(request.query);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    const runtime = runtimeResult.runtime.context;
    const revoked = revokeDenteTelegramChatLink(request.params.linkId, {
      organizationId: runtime.organizationId,
      clinicId: runtime.clinicId,
      botConfigId: runtime.botConfigId
    });
    if (!revoked) {
      return reply.code(404).send({
        error: "TelegramChatLinkNotFound",
        message: telegramChatLinkNotFoundMessage
      });
    }
    return denteTelegramChatLinkPublicSchema.parse(revoked);
  });
}

function registerTelegramPreviewRoutes(app: FastifyInstance, telegramControlPlaneRouteOptions: { preHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void> }) {
  app.post<{ Querystring: Record<string, unknown> }>("/api/telegram/messages/preview", telegramControlPlaneRouteOptions, async (request, reply) => {
    const runtimeResult = resolveTelegramOutboxRuntimeScopeFromQuery(request.query);
    if (!runtimeResult.ok) {
      return reply.code(runtimeResult.statusCode).send({
        error: runtimeResult.error,
        message: runtimeResult.message
      });
    }
    const parsedInput = parseTelegramRouteBody(denteTelegramMessagePreviewRequestSchema, request.body);
    if (!parsedInput.ok) return sendTelegramValidationError(reply);
    const input = parsedInput.value;
    try {
      return renderDenteTelegramMessagePreview(input, runtimeResult.runtime.context.settings);
    } catch (previewError) {
      const rejection = telegramMessagePreviewRejection(previewError);
      return reply.code(404).send({ error: "TelegramMessagePreviewNotFound", reason: rejection.reason, message: rejection.message });
    }
  });
}

export async function registerTelegramRoutes(app: FastifyInstance) {
  const telegramControlPlaneRouteOptions = { preHandler: requireTelegramControlPlaneAccess };

  registerTelegramStatusRoutes(app, telegramControlPlaneRouteOptions);
  registerTelegramSettingsRoutes(app, telegramControlPlaneRouteOptions);
  registerTelegramOutboxRoutes(app, telegramControlPlaneRouteOptions);
  registerTelegramLinkRoutes(app, telegramControlPlaneRouteOptions);
  registerTelegramPreviewRoutes(app, telegramControlPlaneRouteOptions);
}
