import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
const stateVersion = 1;
function persistenceEnabled() {
    return process.env.DENTAL_STATE_PERSISTENCE !== "off";
}
function getStateFilePath() {
    return (process.env.DENTAL_STATE_FILE ??
        path.resolve(process.cwd(), ".data", "dental-crm-state.json"));
}
function getBackupDirectoryPath() {
    return (process.env.DENTAL_STATE_BACKUP_DIR ??
        path.join(path.dirname(getStateFilePath()), "backups"));
}
function getMaxBackupCount() {
    return Number(process.env.DENTAL_STATE_BACKUPS ?? 30);
}
function checksumPersistentState(payload) {
    return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}
function timestampForFileName(value = new Date()) {
    return value.toISOString().replace(/[-:]/g, "").replace(".", "-");
}
function listBackupFiles() {
    const backupDirectoryPath = getBackupDirectoryPath();
    if (!fs.existsSync(backupDirectoryPath))
        return [];
    return fs
        .readdirSync(backupDirectoryPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => {
        const filePath = path.join(backupDirectoryPath, entry.name);
        const stats = fs.statSync(filePath);
        return {
            filePath,
            savedAt: stats.mtime.toISOString(),
            sizeBytes: stats.size,
        };
    })
        .sort((left, right) => right.savedAt.localeCompare(left.savedAt));
}
function fileNameOf(filePath) {
    return path.basename(filePath);
}
export async function rawFileHash(filePath) {
    if (!fs.existsSync(filePath))
        return null;
    try {
        return createHash("sha256")
            .update(await fs.promises.readFile(filePath))
            .digest("hex");
    }
    catch {
        return null;
    }
}
function stateCollectionCounts(state) {
    if (!state)
        return {};
    return {
        staffMembers: state.staffMembers?.length ?? 0,
        chairs: state.chairs?.length ?? 0,
        appointments: state.appointments?.length ?? 0,
        patients: state.patients?.length ?? 0,
        documents: state.documents?.length ?? 0,
        clinicalRules: state.clinicalRules?.length ?? 0,
        payments: state.payments?.length ?? 0,
        communicationTasks: state.communicationTasks?.length ?? 0,
        communicationEvents: state.communicationEvents?.length ?? 0,
        imagingStudies: state.imagingStudies?.length ?? 0,
        imagingViewerSessions: state.imagingViewerSessions?.length ?? 0,
        dicomWorkbenchBundles: state.dicomWorkbenchBundles?.length ?? 0,
        importBatches: state.importBatches?.length ?? 0,
        auditEvents: state.auditEvents?.length ?? 0,
        aiRecognitionJobs: state.aiRecognitionJobs?.length ?? 0,
        speechTranscriptionChunks: state.speechTranscriptionChunks?.length ?? 0,
        visitDraftAutosaves: state.visitDraftAutosaves?.length ?? 0,
        visitSaveReceipts: state.visitSaveReceipts?.length ?? 0,
        denteTelegramLinkCodes: state.denteTelegramLinkCodes?.length ?? 0,
        denteTelegramChatLinks: state.denteTelegramChatLinks?.length ?? 0,
        denteTelegramWebhookEvents: state.denteTelegramWebhookEvents?.length ?? 0,
        denteTelegramOutboxDeliveryReceipts: state.denteTelegramOutboxDeliveryReceipts?.length ?? 0,
    };
}
function checksumVerified(payload) {
    if (!payload?.checksum || payload.version !== stateVersion || !payload.state)
        return null;
    return (payload.checksum ===
        checksumPersistentState({
            version: stateVersion,
            savedAt: payload.savedAt ?? "",
            state: payload.state,
        }));
}
function persistenceWarningText(warning) {
    if (warning === "persistence_disabled")
        return "Серверное сохранение состояния выключено; перед миграцией включите сохранение или скачайте ручной экспорт.";
    if (warning === "state_file_missing")
        return "Файл состояния еще не создан; выполните рабочее изменение и повторите проверку резервной копии.";
    if (warning === "state_file_unreadable")
        return "Файл состояния не читается; используйте последнюю читаемую резервную копию и проверьте права сервера.";
    if (warning === "state_checksum_mismatch")
        return "Контрольная сумма файла состояния не совпала; скачайте экспорт и проверьте последнюю резервную копию.";
    return "Одна из последних резервных копий не прошла проверку; не удаляйте архивы до читаемого экспорта.";
}
function compactPersistenceWarnings(warnings) {
    return Array.from(new Set(warnings.filter((warning) => Boolean(warning))));
}
function readPersistedPayload(filePath) {
    if (!fs.existsSync(filePath))
        return { payload: null, error: "state_file_missing" };
    try {
        return {
            payload: JSON.parse(fs.readFileSync(filePath, "utf8")),
            error: null,
        };
    }
    catch {
        return { payload: null, error: "state_file_unreadable" };
    }
}
function rotateStateBackup() {
    const stateFilePath = getStateFilePath();
    const backupDirectoryPath = getBackupDirectoryPath();
    if (!fs.existsSync(stateFilePath))
        return;
    fs.mkdirSync(backupDirectoryPath, { recursive: true });
    const backupPath = path.join(backupDirectoryPath, `dental-crm-state-${timestampForFileName()}.json`);
    fs.copyFileSync(stateFilePath, backupPath);
    const maxBackupCount = getMaxBackupCount();
    const backupLimit = Number.isFinite(maxBackupCount) && maxBackupCount > 0
        ? Math.floor(maxBackupCount)
        : 30;
    const staleBackups = listBackupFiles().slice(backupLimit);
    for (const backup of staleBackups) {
        fs.unlinkSync(backup.filePath);
    }
}
function readPersistedState() {
    const stateFilePath = getStateFilePath();
    if (!persistenceEnabled() || !fs.existsSync(stateFilePath))
        return null;
    try {
        const parsed = JSON.parse(fs.readFileSync(stateFilePath, "utf8"));
        if (parsed.version !== stateVersion || !parsed.state)
            return null;
        if (parsed.checksum) {
            const expectedChecksum = checksumPersistentState({
                version: parsed.version,
                savedAt: parsed.savedAt ?? "",
                state: parsed.state,
            });
            if (parsed.checksum !== expectedChecksum) {
                console.warn("Dental state file ignored: checksum mismatch");
                return null;
            }
        }
        return parsed;
    }
    catch (error) {
        console.warn(`Dental state file ignored: ${error instanceof Error ? error.message : "unknown parse error"}`);
        return null;
    }
}
export function loadPersistentState() {
    return readPersistedState()?.state ?? null;
}
export function savePersistentState(state) {
    if (!persistenceEnabled())
        return;
    const stateFilePath = getStateFilePath();
    const payloadCore = {
        version: stateVersion,
        savedAt: new Date().toISOString(),
        state,
    };
    const payload = {
        ...payloadCore,
        checksum: checksumPersistentState(payloadCore),
    };
    try {
        fs.mkdirSync(path.dirname(stateFilePath), { recursive: true });
        rotateStateBackup();
        const tempPath = `${stateFilePath}.tmp`;
        fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), "utf8");
        fs.renameSync(tempPath, stateFilePath);
    }
    catch (error) {
        console.warn(`Dental state file save failed: ${error instanceof Error ? error.message : "unknown save error"}`);
    }
}
export function getPersistentStateMeta() {
    const stateFilePath = getStateFilePath();
    const backupDirectoryPath = getBackupDirectoryPath();
    const maxBackupCount = getMaxBackupCount();
    const persisted = readPersistedState();
    const backups = listBackupFiles();
    return {
        enabled: persistenceEnabled(),
        filePath: stateFilePath,
        exists: fs.existsSync(stateFilePath),
        version: persisted?.version ?? null,
        savedAt: persisted?.savedAt ?? null,
        checksum: persisted?.checksum ?? null,
        backupDirectoryPath,
        backupCount: backups.length,
        latestBackupAt: backups[0]?.savedAt ?? null,
        latestBackupSizeBytes: backups[0]?.sizeBytes ?? null,
        maxBackupCount: Number.isFinite(maxBackupCount) && maxBackupCount > 0
            ? Math.floor(maxBackupCount)
            : 30,
    };
}
export async function exportDbToPersistentStateFile() {
    if (!persistenceEnabled())
        return;
    try {
        const { db } = await import("./db/client.js");
        const schema = await import("./db/schema.js");
        const { getClinicSettingsFromDb } = await import("./db/settingsQuery.js");
        const { eq, sql } = await import("drizzle-orm");
        const [org] = await db.select().from(schema.organizations).limit(1);
        if (!org)
            return;
        const orgId = org.id;
        const settings = await getClinicSettingsFromDb(orgId);
        const clinicProfile = settings.profile;
        const staffMembers = settings.staff;
        const chairs = settings.chairs;
        const toSamaraIsoString = (dateOrStr) => {
            if (!dateOrStr)
                return null;
            const date = new Date(dateOrStr);
            if (isNaN(date.getTime()))
                return null;
            // Samara timezone is UTC+4
            const samaraTime = new Date(date.getTime() + 4 * 60 * 60 * 1000);
            return samaraTime.toISOString().slice(0, 19) + "+04:00";
        };
        const appointments = (await db.select().from(schema.appointments)).map((app) => ({
            ...app,
            startsAt: toSamaraIsoString(app.startsAt),
            endsAt: toSamaraIsoString(app.endsAt),
        }));
        const patients = await db.select().from(schema.patients);
        const documents = await db.select().from(schema.generatedDocuments);
        const clinicalRules = await db.select().from(schema.clinicalRules);
        const payments = await db.select().from(schema.payments);
        const communicationTasks = await db
            .select()
            .from(schema.communicationTasks);
        const communicationEvents = await db
            .select()
            .from(schema.communicationEvents);
        const imagingStudies = await db.select().from(schema.imagingStudies);
        const imagingViewerSessions = await db
            .select()
            .from(schema.imagingViewerSessions);
        const dicomWorkbenchBundles = await db
            .select()
            .from(schema.dicomWorkbenchBundles);
        const importBatches = await db.select().from(schema.importBatches);
        const auditEvents = await db.select().from(schema.auditEvents);
        const aiRecognitionJobs = await db.select().from(schema.aiJobs);
        const speechTranscriptionChunks = [];
        const visitDraftAutosaves = [];
        const visitSaveReceipts = [];
        const denteTelegramLinkCodes = await db
            .select()
            .from(schema.denteTelegramLinkCodes);
        const denteTelegramChatLinks = await db
            .select()
            .from(schema.denteTelegramChatLinks);
        const denteTelegramWebhookEvents = await db
            .select()
            .from(schema.denteTelegramWebhookEvents);
        const denteTelegramOutboxDeliveryReceipts = await db
            .select()
            .from(schema.denteTelegramOutboxDeliveryReceipts);
        const [tgConfig] = await db
            .select()
            .from(schema.denteTelegramBotConfigs)
            .limit(1);
        const denteTelegramBotSettings = tgConfig
            ? {
                tokenSecretRef: tgConfig.tokenSecretRef,
                webhookSecretRef: tgConfig.webhookSecretRef,
                chatTransportRef: null,
            }
            : {
                tokenSecretRef: null,
                webhookSecretRef: null,
                chatTransportRef: null,
            };
        const [userWithPrefs] = await db
            .select()
            .from(schema.users)
            .where(sql `ui_preferences IS NOT NULL`)
            .limit(1);
        const uiPreferences = userWithPrefs
            ? userWithPrefs.uiPreferences
            : null;
        const [draftVisit] = await db
            .select()
            .from(schema.visits)
            .where(eq(schema.visits.status, "draft"))
            .limit(1);
        const activeVisit = draftVisit;
        const mutableState = {
            clinicProfile: clinicProfile,
            staffMembers: staffMembers,
            chairs: chairs,
            appointments: appointments,
            patients: patients,
            documents: documents,
            clinicalRules: clinicalRules,
            payments: payments,
            communicationTasks: communicationTasks,
            communicationEvents: communicationEvents,
            imagingStudies: imagingStudies,
            imagingViewerSessions: imagingViewerSessions,
            dicomWorkbenchBundles: dicomWorkbenchBundles,
            importBatches: importBatches,
            auditEvents: auditEvents,
            aiRecognitionJobs: aiRecognitionJobs,
            speechTranscriptionChunks: speechTranscriptionChunks,
            visitDraftAutosaves: visitDraftAutosaves,
            visitSaveReceipts: visitSaveReceipts,
            denteTelegramBotSettings: denteTelegramBotSettings,
            denteTelegramLinkCodes: denteTelegramLinkCodes,
            denteTelegramChatLinks: denteTelegramChatLinks,
            denteTelegramWebhookEvents: denteTelegramWebhookEvents,
            denteTelegramOutboxDeliveryReceipts: denteTelegramOutboxDeliveryReceipts,
            uiPreferences,
            activeVisit,
        };
        savePersistentState(mutableState);
    }
    catch (err) {
        console.error("[PersistentState] export from DB failed:", err);
    }
}
export async function getPersistentStateIntegrityReport(limit = 8) {
    const stateFilePath = getStateFilePath();
    const meta = getPersistentStateMeta();
    const { payload, error } = readPersistedPayload(stateFilePath);
    const checksumOk = checksumVerified(payload);
    const backupsList = listBackupFiles().slice(0, Math.max(0, limit));
    const backups = await Promise.all(backupsList.map(async (backup) => {
        const backupPayload = readPersistedPayload(backup.filePath);
        return {
            fileName: fileNameOf(backup.filePath),
            savedAt: backup.savedAt,
            sizeBytes: backup.sizeBytes,
            fileHash: await rawFileHash(backup.filePath),
            checksumVerified: checksumVerified(backupPayload.payload),
            readable: !backupPayload.error,
            warning: backupPayload.error
                ? persistenceWarningText(backupPayload.error)
                : null,
        };
    }));
    const warningCodes = [
        !meta.enabled ? "persistence_disabled" : null,
        !meta.exists ? "state_file_missing" : null,
        error,
        checksumOk === false ? "state_checksum_mismatch" : null,
        backups.some((backup) => backup.readable === false || backup.checksumVerified === false)
            ? "backup_integrity_warning"
            : null,
    ];
    const warnings = compactPersistenceWarnings(warningCodes.map((warning) => warning ? persistenceWarningText(warning) : null));
    return {
        ok: meta.enabled &&
            meta.exists &&
            checksumOk !== false &&
            warnings.length === 0,
        checkedAt: new Date().toISOString(),
        meta,
        stateFileHash: await rawFileHash(stateFilePath),
        checksumVerified: checksumOk,
        stateCounts: stateCollectionCounts(payload?.state),
        backups,
        warnings,
        nextAction: warnings.length === 0
            ? "Файл состояния и последние резервные копии читаются. Перед миграцией скачайте контрольный экспорт."
            : "Проверьте предупреждения перед импортом, миграцией или обновлением. Не удаляйте резервные копии, пока нет читаемого экспорта.",
    };
}
export async function buildPersistentStateExport() {
    const stateFilePath = getStateFilePath();
    const { payload, error } = readPersistedPayload(stateFilePath);
    return {
        exportedAt: new Date().toISOString(),
        exportKind: "dental-crm-prototype-state",
        exportVersion: 1,
        integrity: await getPersistentStateIntegrityReport(12),
        error: error ? persistenceWarningText(error) : null,
        payload,
    };
}
