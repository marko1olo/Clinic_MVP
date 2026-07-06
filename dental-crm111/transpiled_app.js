import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=243abd76"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { useAppLogic } from "/src/useAppLogic.tsx?t=1783251312823";
import { VoiceAssistantUI } from "/src/components/VoiceAssistantUI.tsx";
import { Omnibar } from "/src/components/Omnibar.tsx";
import { CommandPalette } from "/src/components/CommandPalette.tsx";
import { AuthHub } from "/src/components/auth/AuthHub.tsx?t=1783250894761";
import { StaffPinPad } from "/src/components/auth/StaffPinPad.tsx";
import __vite__cjsImport9_react from "/node_modules/.vite/deps/react.js?v=243abd76"; const lazy = __vite__cjsImport9_react["lazy"]; const Suspense = __vite__cjsImport9_react["Suspense"]; const useEffect = __vite__cjsImport9_react["useEffect"]; const useState = __vite__cjsImport9_react["useState"]




;
import {
  ArrowRight,
  AlertTriangle,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FlipHorizontal,
  Image as ImageIcon,
  Mic,
  Plus,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  Sparkles,
  ZoomIn,
  ZoomOut
} from "/node_modules/.vite/deps/lucide-react.js?v=243abd76";
import { AppLoadingState, AppUnlockState } from "/src/AppBootState.tsx";
import { ClinicalRulePanel } from "/src/ClinicalRulePanel.tsx";
import {
  CtPlanningToolsPanel
} from "/src/ctPlanningTools.tsx";
import { WorkspaceSidebar, WorkspaceTopbar } from "/src/workspaceShell.tsx";
import { scheduleIdleWorkspacePreload } from "/src/workspacePreload.ts";
import { WorkspaceContinuityStrip } from "/src/workspaceContinuityStrip.tsx";
import { WorkspaceRouteErrorBoundary } from "/src/workspaceRouteErrorBoundary.tsx";
const ImagingView = lazy(_c = () => import("/src/ImagingView.tsx").then((module) => ({ default: module.ImagingView })));
_c2 = ImagingView;
const VisitView = lazy(_c3 = () => import("/src/VisitView.tsx").then((module) => ({ default: module.VisitView })));
_c4 = VisitView;
const FinanceView = lazy(_c5 = () => import("/src/FinanceView.tsx").then((module) => ({ default: module.FinanceView })));
_c6 = FinanceView;
const CommunicationsView = lazy(_c7 = () => import("/src/CommunicationsView.tsx").then((module) => ({ default: module.CommunicationsView })));
_c8 = CommunicationsView;
const DocumentsView = lazy(_c9 = () => import("/src/DocumentsView.tsx").then((module) => ({ default: module.DocumentsView })));
_c0 = DocumentsView;
const SettingsView = lazy(_c1 = () => import("/src/SettingsView.tsx").then((module) => ({ default: module.SettingsView })));
_c10 = SettingsView;
const ScheduleView = lazy(_c11 = () => import("/src/ScheduleView.tsx").then((module) => ({ default: module.ScheduleView })));
_c12 = ScheduleView;
const PatientsView = lazy(_c13 = () => import("/src/PatientsView.tsx").then((module) => ({ default: module.PatientsView })));
_c14 = PatientsView;
const ShiftView = lazy(_c15 = () => import("/src/ShiftView.tsx").then((module) => ({ default: module.ShiftView })));
_c16 = ShiftView;
const PatientCockpit = lazy(_c17 = () => import("/src/ShiftView.tsx").then((module) => ({ default: module.PatientCockpit })));
_c18 = PatientCockpit;
const MarketingView = lazy(_c19 = () => import("/src/MarketingView.tsx").then((module) => ({ default: module.MarketingView })));
_c20 = MarketingView;
function speechGatewayCanUpload(status) {
  return Boolean(status?.serverTranscriptionCurrentlyAvailable ?? status?.serverTranscriptionEnabled);
}
export function App() {
  _s();
  const {
    acceptDraftToVisit,
    activeAppointment,
    activeChair,
    activeCommunicationTasks,
    activeDoctor,
    activeDocuments,
    activeImagingStudies,
    activeIssuedPaidContracts,
    activePatient,
    activePatientCallablePhone,
    activePatientHasCallablePhone,
    activePatientInsight,
    activePayments,
    activeQueueRole,
    activeRolePolicy,
    activeRoleQueue,
    activeRoleRestrictedSections,
    activeRoleWritableSections,
    activeSettingsTabButtonRef,
    activeSpeechProviderHealth,
    activeTreatmentPlanItems,
    activeTreatmentPlanScenarios,
    activeUsableDocuments,
    activeVisitClinicalRuleEvaluations,
    activeVisitClinicalRuleSummary,
    activeWorkspaceProfile,
    addChair,
    addImagingViewerNoteAnnotation,
    addMigrationDiscoveryCandidateToSmartImport,
    addStaffMember,
    analyzePricelist,
    appendToTranscript,
    applyCtPlanningQuickAction,
    applyMprClinicalPreset,
    applyNearestMprClinicalPreset,
    applyPostVisitCarePreset,
    applyProtocolTemplate,
    applyProtocolTemplateDirectly,
    appointmentLabels: appointmentLabels2,
    appointmentReadinessById,
    appointmentReadinessLabels: appointmentReadinessLabels2,
    appointmentScheduleDraftFromAppointment: appointmentScheduleDraftFromAppointment2,
    attachPricelistImage,
    browserCanRequestPersistentStorage,
    browserContinuity,
    browserContinuityChecks,
    browserContinuityCritical,
    browserContinuityState,
    browserContinuityValue,
    browserDirectoryInputRef,
    browserDirectoryPickerAvailable,
    browserImagingScanProgress,
    browserMigrationDiscovery,
    browserMigrationInputRef,
    browserMigrationScanProgress,
    browserPickedImagingFolder,
    buildDicomFolderWorkupPlan,
    buildDicomRenderCachePlan,
    buildDicomViewerLaunchManifest,
    buildDicomViewerToolStateBundle,
    buildDicomViewerWorkbenchManifest,
    buildDraft,
    buildOfflineDraft,
    canRetryImagingViewerSave,
    cancelBrowserImagingFolderScan,
    cancelBrowserMigrationScan,
    cancelLocalDicomOperation,
    cbctWorkbenchPlanes,
    cbctWorkbenchProjections,
    cbctWorkbenchSeries,
    cbctWorkbenchTools,
    chairScheduleDirtyIds,
    chairScheduleDrafts,
    chairScheduleSaveStates,
    chairScheduleSavingId,
    changeClinicMode,
    changePostVisitCareTopic,
    checkDicomWebConnector,
    checkDicomWorkstationReadiness,
    chooseRecognitionPreset,
    clampMprAxisDeg: clampMprAxisDeg2,
    clampMprSlabMm: clampMprSlabMm2,
    clampMprSliceIndex: clampMprSliceIndex2,
    clearBrowserPickedImagingFolderPreview,
    clearDicomWorkbenchRecovery,
    clearLocalImagingFolderRecovery,
    clearPricelistImage,
    clearTranscriptWithUndo,
    clearedTranscriptSnapshot,
    clinicModeLabels: clinicModeLabels2,
    clinicProfileDraft,
    clinicProfileSaveState,
    clinicPublicLookup,
    clinicalRuleActionLabels: clinicalRuleActionLabels2,
    clinicalRuleSeverityLabels: clinicalRuleSeverityLabels2,
    closeAppointmentEditor,
    commitImagingImport,
    commitImport,
    commitSmartImport,
    communicationChannelLabels: communicationChannelLabels2,
    communicationDocumentTaskActionLabels: communicationDocumentTaskActionLabels2,
    communicationIntentLabels: communicationIntentLabels2,
    communicationNote,
    communicationPriorityLabels: communicationPriorityLabels2,
    communicationSavingTaskId,
    communicationStatusLabels: communicationStatusLabels2,
    compactDocumentText,
    completeCommunicationTask,
    completedActContractReferenceForUi: completedActContractReferenceForUi2,
    completedActFiscalReceiptLines,
    completedActPaidRubValue,
    confirmDocumentIssue,
    confirmDocumentVoid,
    continueOnboardingInDraftMode,
    copyTelegramTextToClipboard,
    createAppointmentFromDraft,
    createClinicalRuleFromSettings,
    createCtPlanningArtifact,
    createDocument,
    createImagingStudy,
    createPatient,
    createTelegramLinkCode,
    ctPlanningActiveQuickActionId,
    ctPlanningAnnotationRefs,
    ctPlanningImplantPlan,
    currentOnboardingIndex,
    currentView,
    dashboard,
    defaultDicomFirstFrameViewerState: defaultDicomFirstFrameViewerState2,
    defaultImagingViewerState: defaultImagingViewerState2,
    dentalMaterialKindLabels: dentalMaterialKindLabels2,
    dentalRestorationTypeLabels: dentalRestorationTypeLabels2,
    describeMprClinicalPresetProjectionFallback: describeMprClinicalPresetProjectionFallback2,
    dicomDiagnosticPixelPolicyLabels: dicomDiagnosticPixelPolicyLabels2,
    dicomExecutionLaneLabels: dicomExecutionLaneLabels2,
    dicomFirstFrameImageStyle,
    dicomFirstFramePreview,
    dicomFirstFrameStatusLabels: dicomFirstFrameStatusLabels2,
    dicomFirstFrameViewerState,
    dicomFolderSeriesScan,
    dicomFolderWorkupPathLabels: dicomFolderWorkupPathLabels2,
    dicomFolderWorkupPlan,
    dicomGpuClassLabels: dicomGpuClassLabels2,
    dicomLabel: dicomLabel2,
    dicomLocalFolderDiscovery,
    dicomQualityModeLabels: dicomQualityModeLabels2,
    dicomReadinessCheckLabels: dicomReadinessCheckLabels2,
    dicomRenderCachePlan,
    dicomRenderMemoryBudgetClassLabels: dicomRenderMemoryBudgetClassLabels2,
    dicomRuntimeTierLabels: dicomRuntimeTierLabels2,
    dicomSeriesPreview,
    dicomSeriesViewerLabels: dicomSeriesViewerLabels2,
    dicomTextureStrategyLabels: dicomTextureStrategyLabels2,
    dicomViewerLaunchManifest,
    dicomViewerLaunchModeLabels: dicomViewerLaunchModeLabels2,
    dicomViewerToolStateBundle,
    dicomViewerWorkbenchManifest,
    dicomWebCheck,
    dicomWebEndpointUrl,
    dicomWebStatusLabels: dicomWebStatusLabels2,
    dicomWorkbenchLocalSavedAt,
    dicomWorkbenchServerBundle,
    dicomWorkbenchSourceIsRedacted,
    dicomWorkstationReadiness,
    dictationQuickPhrases,
    discoverDicomFolders,
    discoverMigrationSources,
    dismissOnboarding,
    documentActionLabels: documentActionLabels2,
    documentDetectedKindLabel: documentDetectedKindLabel2,
    documentFactoryGroups: documentFactoryGroups2,
    documentIngestion,
    documentIngestionQualityLabels: documentIngestionQualityLabels2,
    documentIngestionTarget,
    documentIssueAttestationReady,
    documentIssueConfirmation,
    documentIssueSignatureModeLabels: documentIssueSignatureModeLabels2,
    documentKindsForCommunicationTask,
    documentLabels: documentLabels2,
    documentPatient,
    documentSourceStatusClassNames: documentSourceStatusClassNames2,
    documentStatusLabels: documentStatusLabels2,
    documentVoidConfirmation,
    documentVoidReady,
    documentVoidReasonLabels: documentVoidReasonLabels2,
    downloadDicomViewerToolStateBundle,
    downloadDicomWorkbenchManifest,
    downloadIssuedDocumentHtml,
    downloadIssuedDocumentPdf,
    downloadMigrationHandoffReport,
    downloadPersistenceExport,
    downloadSmartImportReport,
    downloadSmartImportSafeHandoffReport,
    downloadTaxDocumentXml,
    downloadTelegramQrSvg,
    draft,
    editingAppointmentId,
    eligiblePaymentReceiptPayments,
    eligibleRefundCorrectionPayments,
    eligibleTaxPayments,
    emptyDictationVoiceActionLabel,
    error,
    filteredPatients,
    filteredTelegramOutboxItems,
    flushPendingSpeechChunks,
    flushPendingVisitSaves,
    formatByteSize: formatByteSize2,
    formatDateTime: formatDateTime2,
    formatMegabytes: formatMegabytes2,
    formatShortDate: formatShortDate2,
    formatSignedMprStep: formatSignedMprStep2,
    formatTime: formatTime2,
    fromDateTimeLocalValue: fromDateTimeLocalValue2,
    goToVisitDictation,
    handleBrowserDirectoryInputChange,
    handleBrowserMigrationInputChange,
    handleMprKeyboardNavigation,
    hasVisitTranscriptText,
    hiddenTelegramOutboxItemCount,
    imagingComparisonCandidates,
    imagingConnectorCards: imagingConnectorCards2,
    imagingCreateSavingKind,
    imagingFolderPath,
    imagingFolderScan,
    imagingImportCommit,
    imagingImportPreview,
    imagingImportSourceKind,
    imagingImportText,
    imagingKindFilter,
    imagingKindLabels: imagingKindLabels2,
    imagingKindOptions,
    imagingPreviewSource,
    imagingSourceChoices: imagingSourceChoices2,
    imagingSourceDetails: imagingSourceDetails2,
    imagingSourceLabels: imagingSourceLabels2,
    imagingViewerActiveTool,
    imagingViewerAnnotations,
    imagingViewerCapabilities: imagingViewerCapabilities2,
    imagingViewerHref,
    imagingViewerImageStyle,
    imagingViewerNote,
    imagingViewerNoteMissingId,
    imagingViewerNoteReady,
    imagingViewerRetryMissingId,
    imagingViewerSaveDetail,
    imagingViewerSaveState,
    imagingViewerSaveTitle,
    imagingViewerSessionReady,
    imagingViewerState,
    imagingViewerToolLabels: imagingViewerToolLabels2,
    importCommit,
    importIntake,
    importPreview,
    importSourceKind,
    importSourceLabels: importSourceLabels2,
    importText,
    inferredTreatmentArea,
    ingestImportFile,
    ingestionTargetLabels: ingestionTargetLabels2,
    installmentScheduleBaseDocumentTitleValue,
    installmentScheduleInstallmentRows,
    installmentSchedulePrepaidRubValue,
    installmentScheduleRemainingRubValue,
    installmentScheduleTotalRubValue,
    integrationCapabilityLabels: integrationCapabilityLabels2,
    integrationCategoryLabels: integrationCategoryLabels2,
    integrationStatusLabels: integrationStatusLabels2,
    isBrowserImagingFolderPicking,
    isBrowserMigrationScanning,
    isClinicPublicLookupLoading,
    isClinicalRuleSaving,
    isDicomFirstFramePreviewing,
    isDicomFolderWorkupPlanning,
    isDicomLocalDiscovering,
    isDicomManifestBuilding,
    isDicomRenderCachePlanning,
    isDicomSeriesPreviewLoading,
    isDicomToolStateBuilding,
    isDicomWebChecking,
    isDicomWorkbenchBuilding,
    isDicomWorkbenchReconnecting,
    isDicomWorkbenchServerSaving,
    isDicomWorkstationChecking,
    isDraftAccepting,
    isDraftLoading,
    isImagingFolderScanning,
    isImagingImportCommitting,
    isImagingImportLoading,
    isImportCommitting,
    isImportDictating,
    isImportLoading,
    isLocalDicomOperationActive,
    isLocalImagingOrganizing,
    isMigrationAutopilotLoading,
    isMigrationHandoffReportLoading,
    isMigrationSourceDiscovering,
    isMigrationSourceProbeLoading,
    isMigrationSourceWorkupLoading,
    isOnline,
    isPaymentSaving,
    isPendingVisitSyncing,
    isPersistenceExporting,
    isPricelistAnalyzing,
    isRecognitionLoading,
    isServerVoiceRecording,
    isSmartImportCommitting,
    isSmartImportLoading,
    isSmartReportLoading,
    isSmartSafeReportLoading,
    isTelegramChatLinksLoadingMore,
    isTelegramLinkCodesLoadingMore,
    isTelegramLinkCreating,
    isTelegramLoading,
    isTelegramOutboxItemDueForUi: isTelegramOutboxItemDueForUi2,
    isTelegramOutboxLoadingMore,
    isTelegramSendingDue,
    isTelegramSettingsSaving,
    isTranscriptPolishing,
    isVisitDictating,
    isVisitNoteDirty,
    issuedMedicalCopyRequestDocuments,
    lastLocalSavedAt,
    lastPendingVisitSaveAt,
    lastServerDraftSavedAt,
    lastVisitSaveReceipt,
    latestDicomWorkbenchServerBundle,
    legalMissingFields,
    legalReadinessPercent,
    loadDocumentAuditFacts,
    loadLocalBridgeUsePlans,
    loadMoreTelegramChatLinks,
    loadMoreTelegramLinkCodes,
    loadMoreTelegramOutbox,
    loadPersistenceHealth,
    loadPersistenceIntegrity,
    loadTelegramControlPlane,
    localBridgeReadiness,
    localBridgeStatusLabels: localBridgeStatusLabels2,
    localBridgeStatusState,
    localBridgeStatusValue,
    localBridgeUsePathLabels: localBridgeUsePathLabels2,
    localBridgeUsePlans,
    localDraftWasRestored,
    localImagingFolderDraft,
    localImagingModelRoleLabels: localImagingModelRoleLabels2,
    localImagingOrganizer,
    localImagingOrganizerActionLabels: localImagingOrganizerActionLabels2,
    lockTelegramAdminSession,
    lookupClinicPublicProfile,
    markPostVisitManualEdited,
    markTelegramSettingsDirty,
    medicalDocumentReleaseChannelLabels: medicalDocumentReleaseChannelLabels2,
    migrationAutopilot,
    migrationSourceDiscovery,
    migrationSourceProbe,
    migrationSourceWorkup,
    minorConsentDiagnosisOrIndicationValue,
    minorConsentInterventionScopeValue,
    minorConsentPatientBirthDateValue,
    minorConsentPatientFullNameValue,
    minorRepresentativeFullNameValue,
    minorRepresentativeIdentityDocumentValue,
    minorRepresentativePhoneValue,
    minorRepresentativeRelationshipValue,
    money: money2,
    mostLoadedResource,
    moveOnboardingTo,
    mprActiveProjectionLabel,
    mprActiveProjectionOrientation,
    mprAxisAngleBadge,
    mprAxisBounds: mprAxisBounds2,
    mprAxisDeg,
    mprAxisDirectionLabel,
    mprAxisGuidance,
    mprAxisNudgeDeg: mprAxisNudgeDeg2,
    mprAxisPresetDeg: mprAxisPresetDeg2,
    mprAxisRangeValue,
    mprAxisVisualizerLabel,
    mprAxisVisualizerStyle,
    mprCacheModeLabels: mprCacheModeLabels2,
    mprClinicalChecklist,
    mprClinicalNextStep,
    mprClinicalPresetButtonClass,
    mprClinicalPresets: mprClinicalPresets2,
    mprControlsAutoOpen,
    mprControlsReady,
    mprCrosshairEnabled,
    mprLinkedPlanesEnabled,
    mprLoadStrategyLabels: mprLoadStrategyLabels2,
    mprNearestClinicalPreset,
    mprOperatorSummaryCards,
    mprProjection,
    mprProjectionCompass,
    mprProjectionLabels: mprProjectionLabels2,
    mprResourceTierLabels: mprResourceTierLabels2,
    mprSafeSliceIndex,
    mprSeriesRequiredProjectionLabel: mprSeriesRequiredProjectionLabel2,
    mprSlabBadge,
    mprSlabBounds: mprSlabBounds2,
    mprSlabMm,
    mprSlabNudgeMm: mprSlabNudgeMm2,
    mprSlabPresetMm: mprSlabPresetMm2,
    mprSlabRangeValue,
    mprSliceBadge,
    mprSliceIndex,
    mprSliceIndexFromFraction: mprSliceIndexFromFraction2,
    mprSliceLabel,
    mprSliceMaxIndex,
    mprSliceNudgeSteps: mprSliceNudgeSteps2,
    mprSlicePresetFractions: mprSlicePresetFractions2,
    mprSliceRangeValue,
    mprToolLabels: mprToolLabels2,
    mprUnavailableProjectionLabel: mprUnavailableProjectionLabel2,
    mprWindowPreset,
    mprWindowPresetLabels: mprWindowPresetLabels2,
    mprWorkbenchDraftRestored,
    mprWorkbenchLocalSavedAt,
    mprWorkbenchSummaryText,
    newAppointmentError,
    newChairHasMicroscope,
    newChairHasSurgeryKit,
    newChairHasXraySensor,
    newChairName,
    newChairReadyToCreate,
    newRuleAction,
    newRuleBlockedServiceId,
    newRuleCategory,
    newRuleCompletedServiceId,
    newRuleOwnerRole,
    newRuleRequiredServiceId,
    newRuleSeverity,
    newRuleSpecialty,
    newRuleTitle,
    newRuleTriggerServiceId,
    newRuleWarningText,
    newStaffName,
    newStaffReadyToCreate,
    newStaffRole,
    newStaffSpecialty,
    nextOnboardingStep,
    normalizeOptionalWorkingDaysDraft: normalizeOptionalWorkingDaysDraft2,
    normalizeUiLanguageInput: normalizeUiLanguageInput2,
    normalizedAppointmentStatus: normalizedAppointmentStatus2,
    normalizedAppointmentStatusFilter: normalizedAppointmentStatusFilter2,
    normalizedClinicalRuleAction: normalizedClinicalRuleAction2,
    normalizedClinicalRuleSeverity: normalizedClinicalRuleSeverity2,
    normalizedDentalSpecialty: normalizedDentalSpecialty2,
    normalizedDocumentIssueSignatureMode: normalizedDocumentIssueSignatureMode2,
    normalizedDocumentKind: normalizedDocumentKind2,
    normalizedDocumentVoidReasonCode: normalizedDocumentVoidReasonCode2,
    normalizedMedicalDocumentReleaseChannel: normalizedMedicalDocumentReleaseChannel2,
    normalizedOutpatient025uDemographicCode: normalizedOutpatient025uDemographicCode2,
    normalizedPatientIntakePregnancyStatus: normalizedPatientIntakePregnancyStatus2,
    normalizedPaymentRefundCorrectionAction: normalizedPaymentRefundCorrectionAction2,
    normalizedPaymentRefundCorrectionMethod: normalizedPaymentRefundCorrectionMethod2,
    normalizedPostVisitCareTopic: normalizedPostVisitCareTopic2,
    normalizedProcedureSpecificConsentProcedure: normalizedProcedureSpecificConsentProcedure2,
    normalizedServiceCategory: normalizedServiceCategory2,
    normalizedStaffRole: normalizedStaffRole2,
    normalizedTaxApplicationDeliveryChannel: normalizedTaxApplicationDeliveryChannel2,
    normalizedTaxApplicationForm: normalizedTaxApplicationForm2,
    normalizedTaxApplicationRelationshipSelect: normalizedTaxApplicationRelationshipSelect2,
    normalizedTelegramBotMode: normalizedTelegramBotMode2,
    normalizedTelegramLinkSubjectType: normalizedTelegramLinkSubjectType2,
    normalizedTelegramOutboxStatusFilter: normalizedTelegramOutboxStatusFilter2,
    normalizedTelegramOutboxTemplateFilter: normalizedTelegramOutboxTemplateFilter2,
    normalizedTelegramPrivacyMode: normalizedTelegramPrivacyMode2,
    normalizedTreatmentPlanAcceptanceVariant: normalizedTreatmentPlanAcceptanceVariant2,
    normalizedXrayPregnancyStatus: normalizedXrayPregnancyStatus2,
    normalizedXrayPriority: normalizedXrayPriority2,
    normalizedXrayStudyType: normalizedXrayStudyType2,
    ohifBaseUrl,
    onboardingBlockingIssues,
    onboardingChairCreateGuidanceId,
    onboardingDismissed,
    onboardingDocumentReadinessIssues,
    onboardingDocumentsReady,
    onboardingDraftMode,
    onboardingFinishGuidanceId,
    onboardingReadyToFinish,
    onboardingStaffCreateGuidanceId,
    onboardingStep,
    onboardingSteps: onboardingSteps2,
    onboardingTelegramRecommendations,
    onboardingTelegramVisualCardKeys: onboardingTelegramVisualCardKeys2,
    openAppointmentEditor,
    openCommunicationTaskDocumentWorkflow,
    openIssuedDocumentHtml,
    openOnboardingGuide,
    openScheduleWarning,
    openVisitWarningAction,
    organizeLocalImagingSources,
    outpatient025uMedicalCardNumberValue,
    paidContractTotalRubValue,
    patientAdministrativeProfileValidationMessage,
    patientBillingSummary,
    patientClinicalRuleEvaluations,
    patientClinicalRuleSummary,
    patientInsightById,
    patientInsightRiskLabels: patientInsightRiskLabels2,
    patientIntakePregnancyStatusOptions: patientIntakePregnancyStatusOptions2,
    patientName: patientName2,
    paymentAmount,
    paymentFeedback,
    paymentFiscalCashierName,
    paymentFiscalFd,
    paymentFiscalFn,
    paymentFiscalFpd,
    paymentFiscalReceiptIssuedAt,
    paymentFiscalReceiptLabelForUi: paymentFiscalReceiptLabelForUi2,
    paymentFiscalReceiptNumber,
    paymentFiscalReceiptUrl,
    paymentInvoiceTotalRubValue,
    paymentMethod,
    paymentMethodLabels: paymentMethodLabels2,
    paymentPatientContextMessage,
    paymentPatientContextReady,
    paymentPayerBirthDate,
    paymentPayerFullName,
    paymentPayerIdentityDocument,
    paymentPayerInn,
    paymentPayerRelationship,
    paymentReceiptFiscalReceiptLines,
    paymentReceiptIssuedByValue,
    paymentReceiptPayerBirthDateValue,
    paymentReceiptPayerFullNameValue,
    paymentReceiptPayerIdentityDocumentValue,
    paymentReceiptPayerInnValue,
    paymentReceiptPayerRelationshipValue,
    paymentTaxDeductionCode,
    pendingSpeechChunkCount,
    pendingSpeechFlushActionLabel,
    pendingSpeechFlushActionTitle,
    pendingVisitSaveCount,
    persistenceHealth,
    persistenceIntegrity,
    photoVideoMaterialOptions: photoVideoMaterialOptions2,
    pickBrowserImagingFolder,
    pickBrowserMigrationSource,
    planMigrationDiscoveryCandidate,
    plannedServiceLinesForFinancialPayload,
    policyAuditEventLabels: policyAuditEventLabels2,
    polishTranscript,
    polishingField,
    polishSingleField,
    postVisitCareTopicOptions: postVisitCareTopicOptions2,
    preloadWorkspaceView: preloadWorkspaceView2,
    prepareDicomWorkbenchFromFolder,
    previewDicomFirstFrame,
    previewDicomFirstFrameSlice,
    previewDicomSeries,
    previewImagingImport,
    previewImport,
    previewMigrationAutopilotSources,
    previewMigrationDiscoveryCandidate,
    previewSmartImport,
    previewTelegramTemplate,
    previousOnboardingStep,
    pricelistAnalysis,
    pricelistImageBase64,
    pricelistImageName,
    pricelistImageNote,
    pricelistItemMaterialText: pricelistItemMaterialText2,
    pricelistMaterialSummaryText: pricelistMaterialSummaryText2,
    pricelistParserModeLabels: pricelistParserModeLabels2,
    pricelistRecognitionBrandGroups: pricelistRecognitionBrandGroups2,
    pricelistRecognitionServiceGroups: pricelistRecognitionServiceGroups2,
    pricelistSourceKind,
    pricelistSourceKindLabels: pricelistSourceKindLabels2,
    pricelistText,
    pricelistWarningsText: pricelistWarningsText2,
    primaryVisitWarning,
    probeMigrationDiscoveryCandidate,
    procedureSpecificConsentProcedureOptions: procedureSpecificConsentProcedureOptions2,
    query,
    recognitionJob,
    recognitionKind,
    recognitionPresets: recognitionPresets2,
    recognitionTarget,
    recognitionTargetLabels: recognitionTargetLabels2,
    recognitionText,
    recommendedActionPriorityLabels: recommendedActionPriorityLabels2,
    reconnectDicomWorkbenchFromCurrentFolder,
    recordPayment,
    refreshBrowserContinuity,
    refreshSpeechRuntime,
    releaseProtectionNote,
    rememberLocalImagingFolder,
    renderClinicalToothRowsEditor,
    reopenOnboarding,
    requestBrowserStoragePersistence,
    requestDocumentIssue,
    requestDocumentVoid,
    resetMprControls,
    resetNewAppointmentDraft,
    restoreDicomWorkbenchServerBundle,
    restoreMprWorkbenchLocalDraft,
    retryImagingViewerSessionSave,
    revokeTelegramChatLink,
    roleFocusOrder: roleFocusOrder2,
    runMigrationAutopilot,
    runRecognitionJob,
    saveAppointmentSchedule,
    saveChairSchedule,
    saveClinicProfileFromDraft,
    saveDicomWorkbenchBundleToServer,
    savePatientAdministrativeProfile,
    savePatientCore,
    saveStaffSchedule,
    saveTelegramSettings,
    scanDicomFolderSeries,
    scanImagingFolder,
    scenarioPriorityLabels: scenarioPriorityLabels2,
    scenarioStrategyLabels: scenarioStrategyLabels2,
    scheduleAdminSecretDraft,
    scheduleAdminSecretSession,
    scrollToVisitArea,
    selectAllEligibleTaxPaymentsForCurrentDocument,
    selectCtPlanningImplant,
    selectRefundOriginalPayment,
    selectedCompletedActContractDocumentId,
    selectedDocumentMetadata,
    selectedDocumentUsesTaxPaymentSelection,
    selectedEligibleTaxPayments,
    selectedImagingStudy,
    selectedImagingViewerPlan,
    selectedPatient,
    selectedPaymentReceiptIdSet,
    selectedPaymentReceiptPayments,
    selectedPaymentReceiptTotalRub,
    selectedProtocolTemplate,
    selectedRefundCorrectionPayment,
    selectedReleaseSourceRequestDocumentId,
    selectedSpecialty,
    selectedTaxDocumentPayerKey,
    selectedTaxPaymentIdSet,
    selectedTaxPaymentTotalRub,
    selectedUiLanguageOption,
    selectedWorkspaceRole,
    sendDueTelegramOutbox,
    sendRecognitionResultToImport,
    sendTelegramOutboxItem,
    serverDraftSyncState,
    serviceCategoryLabels: serviceCategoryLabels2,
    serviceTitle,
    setClearedTranscriptSnapshot,
    setCommunicationNote,
    setCtPlanningActiveQuickActionId,
    setCtPlanningImplantPlan,
    setCurrentView,
    setDicomFirstFramePreview,
    setDicomFirstFrameViewerState,
    setDicomFolderSeriesScan,
    setDicomFolderWorkupPlan,
    setDicomLocalFolderDiscovery,
    setDicomRenderCachePlan,
    setDicomSeriesPreview,
    setDicomViewerLaunchManifest,
    setDicomViewerToolStateBundle,
    setDicomViewerWorkbenchManifest,
    setDicomWebCheck,
    setDicomWebEndpointUrl,
    setDicomWorkbenchLocalSavedAt,
    setDicomWorkstationReadiness,
    setDocumentIngestionTarget,
    setError,
    setImagingFolderPath,
    setImagingFolderScan,
    setImagingImportCommit,
    setImagingImportPreview,
    setImagingImportSourceKind,
    setImagingImportText,
    setImagingKindFilter,
    setImagingViewerActiveTool,
    setImagingViewerNote,
    setImagingViewerState,
    setImportCommit,
    setImportIntake,
    setImportPreview,
    setImportSourceKind,
    setImportText,
    setLocalImagingOrganizer,
    setMprAxisDeg,
    setMprCrosshairEnabled,
    setMprLinkedPlanesEnabled,
    setMprProjection,
    setMprSlabMm,
    setMprSliceIndex,
    setMprWindowPreset,
    setNewChairHasMicroscope,
    setNewChairHasSurgeryKit,
    setNewChairHasXraySensor,
    setNewChairName,
    setNewRuleAction,
    setNewRuleBlockedServiceId,
    setNewRuleCategory,
    setNewRuleCompletedServiceId,
    setNewRuleOwnerRole,
    setNewRuleRequiredServiceId,
    setNewRuleSeverity,
    setNewRuleSpecialty,
    setNewRuleTitle,
    setNewRuleTriggerServiceId,
    setNewRuleWarningText,
    setNewStaffName,
    setNewStaffRole,
    setNewStaffSpecialty,
    setOhifBaseUrl,
    setPaymentAmount,
    setPaymentFiscalCashierName,
    setPaymentFiscalFd,
    setPaymentFiscalFn,
    setPaymentFiscalFpd,
    setPaymentFiscalReceiptIssuedAt,
    setPaymentFiscalReceiptNumber,
    setPaymentFiscalReceiptUrl,
    setPaymentMethod,
    setPaymentPayerBirthDate,
    setPaymentPayerFullName,
    setPaymentPayerIdentityDocument,
    setPaymentPayerInn,
    setPaymentPayerRelationship,
    setPaymentTaxDeductionCode,
    setPricelistAnalysis,
    setPricelistSourceKind,
    setPricelistText,
    setQuery,
    setRecognitionJob,
    setRecognitionText,
    setReleaseProtectionNote,
    setSelectedImagingStudyId,
    setSelectedProtocolId,
    setSelectedSpecialty,
    setSelectedWorkspaceRole,
    setSettingsAdminSecretDraft,
    setSettingsTab,
    setSmartImportCommit,
    setSmartImportMode,
    setSmartImportPreview,
    setSmartImportText,
    setTelegramAdminSecretDraft,
    setTelegramBotUsernameDraft,
    setTelegramHandoffNotice,
    setTelegramMapsUrlDraft,
    setTelegramPatientPortalBaseUrlDraft,
    setTelegramPrivacyModeDraft,
    setTelegramReminderLeadTimesDraft,
    setTelegramReviewRequestDelayDraft,
    setTelegramReviewUrlDraft,
    setTelegramTokenTtlDraft,
    setTelegramWelcomeImageUrlDraft,
    setTranscript,
    setUiLanguage,
    setUiPreferencesSyncError,
    setUsePricelistAi,
    settingsAdminSecretDomain,
    settingsAdminSecretDraft,
    settingsAdminSecretSession,
    settingsTab,
    settingsTabs: settingsTabs2,
    shiftWarnings,
    showAdministrationTopActions,
    showDoctorVisitShortcut,
    showFullOnboardingGuide,
    smartImportCommit,
    smartImportMode,
    smartImportModeLabels: smartImportModeLabels2,
    smartImportPreview,
    smartImportText,
    sortedAppointments,
    sortedCommunicationTasks,
    specialtiesWithTemplates,
    specialtyLabels: specialtyLabels2,
    specialtyProtocolTemplates,
    speechGatewayActiveProviderIsLocal,
    speechGatewayCanUpload: speechGatewayCanUpload2,
    speechGatewayHealthReport,
    speechGatewayStatus,
    speechProviderConnectorLabels: speechProviderConnectorLabels2,
    speechProviderHealthById,
    speechProviderHealthLabels: speechProviderHealthLabels2,
    speechProviderModeLabels: speechProviderModeLabels2,
    speechProviderRuntimeById,
    speechProviderSelectionLabels: speechProviderSelectionLabels2,
    speechProviderStatusLabels: speechProviderStatusLabels2,
    speechRecognitionReady,
    speechRecordingPathLabels: speechRecordingPathLabels2,
    speechRecordingRecovery,
    speechRecordingStrategy,
    speechRecoveryStateLabels: speechRecoveryStateLabels2,
    speechStatusNote,
    speechTranscriptionBusy,
    speechLiveRms,
    staffRoleLabels: staffRoleLabels2,
    staffScheduleDirtyIds,
    staffScheduleDraftFromWorkingHours: staffScheduleDraftFromWorkingHours2,
    staffScheduleDrafts,
    staffScheduleSaveStates,
    staffScheduleSavingId,
    stageLocalImagingFolderRecovery,
    startImportDictation,
    startServerVoiceRecording,
    startVisitDictation,
    stopServerVoiceRecording,
    structuredPayloadDocumentKinds: structuredPayloadDocumentKinds2,
    taxApplicationDeliveryChannelOptions: taxApplicationDeliveryChannelOptions2,
    taxApplicationFormOptions: taxApplicationFormOptions2,
    taxApplicationRelationshipOptions: taxApplicationRelationshipOptions2,
    taxDocumentPayerOptions,
    telegramAdminSecretDraft,
    telegramAdminSecretSession,
    telegramAllowVoiceIntakeDraft,
    telegramBotConfigId,
    telegramBotUsernameDraft,
    telegramChatLinkLedger,
    telegramChatLinks,
    telegramClassificationLabels: telegramClassificationLabels2,
    telegramDeliveryStatusLabels: telegramDeliveryStatusLabels2,
    telegramEnabledFeaturesDraft,
    telegramFeatureHelp: telegramFeatureHelp2,
    telegramFeatureLabel,
    telegramFeatureOptions: telegramFeatureOptions2,
    telegramFeaturePlan,
    telegramHandoffNotice,
    telegramHumanMessage: telegramHumanMessage2,
    telegramInlineButtonKindLabels: telegramInlineButtonKindLabels2,
    telegramInlineButtonRowsFromReplyMarkup: telegramInlineButtonRowsFromReplyMarkup2,
    telegramLinkActionState,
    telegramLinkCode,
    telegramLinkCodeLedger,
    telegramLinkCodeStatusLabels: telegramLinkCodeStatusLabels2,
    telegramLinkCodes,
    telegramLinkStaffId,
    telegramLinkStaffOptions,
    telegramLinkSubjectType,
    telegramMapsUrlDraft,
    telegramModeDraft,
    telegramModeHints: telegramModeHints2,
    telegramModeLabels: telegramModeLabels2,
    telegramOutbox,
    telegramOutboxStatusFilter,
    telegramOutboxStatusFilterLabels: telegramOutboxStatusFilterLabels2,
    telegramOutboxStatusFilterOptions: telegramOutboxStatusFilterOptions2,
    telegramOutboxTemplateFilter,
    telegramOutboxTemplateFilterLabels: telegramOutboxTemplateFilterLabels2,
    telegramOutboxTemplateFilterOptions: telegramOutboxTemplateFilterOptions2,
    telegramOwnBotUsernameDraft,
    telegramPatientPortalBaseUrlDraft,
    telegramPostVisitCheckupDelayDrafts,
    telegramPostVisitCheckupDelayFields: telegramPostVisitCheckupDelayFields2,
    telegramPreview,
    telegramPrivacyModeDraft,
    telegramPrivacyModeHints: telegramPrivacyModeHints2,
    telegramPrivacyModeLabels: telegramPrivacyModeLabels2,
    telegramQrSvgToDataUrl: telegramQrSvgToDataUrl2,
    telegramReminderLeadTimesDraft,
    telegramReviewRequestDelayDraft,
    telegramReviewUrlDraft,
    telegramRevokingLinkId,
    telegramSendingItemId,
    telegramSettingsDirty,
    telegramSettingsSaveError,
    telegramSettingsSaveState,
    telegramStaffEscalationChannelDraft,
    telegramStatus,
    telegramSubjectName,
    telegramTemplateLabels: telegramTemplateLabels2,
    telegramTokenTtlDraft,
    telegramVisualCardFields: telegramVisualCardFields2,
    telegramVisualCardUrlDrafts,
    telegramWebhookBaseUrlDraft,
    telegramWelcomeImageUrlDraft,
    toDateTimeLocalValue: toDateTimeLocalValue2,
    toggleChairWorkingDay,
    toggleClinicWorkingDay,
    toggleClinicalRule,
    togglePhotoVideoMaterial,
    toggleStaffWorkingDay,
    toggleTelegramFeature,
    toothRows: toothRows2,
    toothStateByCode: toothStateByCode2,
    setToothState,
    transcript,
    treatmentAcceptancePlannedTotalRub,
    treatmentEstimatePatientOrPayerFullNameValue,
    treatmentEstimateTotalRubValue,
    treatmentEstimateTreatmentBasisValue,
    treatmentStatusLabels: treatmentStatusLabels2,
    uiLanguage,
    uiLanguageOptions: uiLanguageOptions2,
    uiPreferencesSyncError,
    undoTranscriptClear,
    unlockTelegramAdminSession,
    updateAppointmentScheduleDraft,
    updateChairScheduleDay,
    updateChairScheduleDraft,
    updateClinicProfileDraft,
    updateNewAppointmentDraft,
    updatePatientAdministrativeProfileDraft,
    updatePatientCoreDraft,
    updateStaffScheduleDay,
    updateStaffScheduleDraft,
    updateTelegramPostVisitCheckupDelayDraft,
    updateTelegramVisualCardUrlDraft,
    updateVisitNoteField,
    usePricelistAi,
    viewLabels: viewLabels2,
    visibleImagingStudies,
    visibleRecommendedActions,
    visibleScheduleSuggestions,
    visibleTelegramOutboxItems,
    visibleVisitSpecialtyFocusOptions,
    visitCloseChecklist,
    visitDraftBuildMissingSteps,
    visitDraftMissingFieldLabel: visitDraftMissingFieldLabel2,
    visitDraftQualityLabels: visitDraftQualityLabels2,
    visitDraftReadyToBuild,
    visitDraftSignalLabel: visitDraftSignalLabel2,
    visitDraftUserEditedRef,
    visitNoteAcceptMissingSteps,
    visitNoteActionLabel,
    visitNoteFieldDefinitions: visitNoteFieldDefinitions2,
    visitNoteForm,
    visitNoteReadyToAccept,
    visitNoteStatusLabel,
    visitPrimaryAction,
    visitSafetyCards,
    visitSaveReceiptText: visitSaveReceiptText2,
    visitWarnings,
    visitWorkflowSteps,
    warningSeverityLabels: warningSeverityLabels2,
    warrantyLinkedActOrContractValue,
    warrantyServiceOrWorkNameValue,
    warrantyTeethOrAreaValue,
    weekdayOptions: weekdayOptions2,
    workspaceScopeLabels: workspaceScopeLabels2,
    xrayPregnancyStatusOptions: xrayPregnancyStatusOptions2,
    xrayStudyTypeOptions: xrayStudyTypeOptions2,
    accessUnlockRequired,
    accessUnlockMessage,
    clinicalAdminSecretDraft,
    setClinicalAdminSecretDraft,
    loadDashboard,
    operatorWorkflowFailureMessage: operatorWorkflowFailureMessage2,
    handleSelectDemoMode,
    handleSelectZeroMode,
    setSelectedPatientId,
    setScheduleDateFilter,
    scheduleDateFilter,
    handleFinishOnboarding
  } = useAppLogic();
  useEffect(() => scheduleIdleWorkspacePreload(currentView), [currentView]);
  const [resetting, setResetting] = useState(false);
  const [clinicAuthed, setClinicAuthed] = useState(() => {
    return typeof window !== "undefined" && !!localStorage.getItem("dente_clinic_token");
  });
  const [staffAuthed, setStaffAuthed] = useState(() => {
    return typeof window !== "undefined" && !!localStorage.getItem("dente_staff_token");
  });
  const [showStaffPinPad, setShowStaffPinPad] = useState(false);
  const [activeStaffUser, setActiveStaffUser] = useState(null);
  useEffect(() => {
    if (clinicAuthed && !dashboard) {
      void loadDashboard().catch((e) => {
        console.warn("[Dente] Persisted clinic token invalid, forcing re-login:", e);
        localStorage.removeItem("dente_clinic_token");
        localStorage.removeItem("dente_staff_token");
        setClinicAuthed(false);
        setStaffAuthed(false);
      });
    }
    const staffToken = localStorage.getItem("dente_staff_token");
    if (staffToken && !activeStaffUser) {
      fetch("/api/auth/user/me", {
        headers: { "x-dente-staff-token": staffToken }
      }).then((r) => r.ok ? r.json() : null).then((data) => {
        if (data?.user) setActiveStaffUser(data.user);
      }).catch(() => {
      });
    }
  }, []);
  useEffect(() => {
    if (!clinicAuthed) return;
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setStaffAuthed(false);
        setShowStaffPinPad(true);
        localStorage.removeItem("dente_staff_token");
      }, 5 * 60 * 1e3);
    };
    const events = ["mousemove", "keydown", "pointerdown", "touchstart"];
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => document.removeEventListener(e, resetTimer));
    };
  }, [clinicAuthed]);
  const handleClinicLogout = () => {
    localStorage.removeItem("dente_clinic_token");
    localStorage.removeItem("dente_staff_token");
    setClinicAuthed(false);
    setStaffAuthed(false);
    setShowStaffPinPad(false);
    setActiveStaffUser(null);
  };
  const handleLockSession = () => {
    localStorage.removeItem("dente_staff_token");
    setStaffAuthed(false);
    setShowStaffPinPad(true);
  };
  if (!clinicAuthed) {
    return /* @__PURE__ */ jsxDEV(AuthHub, { onSuccess: (cp, up) => {
      setClinicAuthed(true);
      if (up) {
        setStaffAuthed(true);
        setActiveStaffUser(up);
      }
      void loadDashboard();
    } }, void 0, false, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 1983,
      columnNumber: 12
    }, this);
  }
  if (!staffAuthed || showStaffPinPad) {
    if (!dashboard) {
      return /* @__PURE__ */ jsxDEV(AppLoadingState, { message: "Загрузка данных клиники..." }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 1996,
        columnNumber: 14
      }, this);
    }
    return /* @__PURE__ */ jsxDEV(
      StaffPinPad,
      {
        staffMembers: dashboard.clinicSettings?.staff ?? [],
        onUnlockSuccess: (user) => {
          setActiveStaffUser(user);
          setStaffAuthed(true);
          setShowStaffPinPad(false);
        },
        onClinicLogout: handleClinicLogout
      },
      void 0,
      false,
      {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 1999,
        columnNumber: 7
      },
      this
    );
  }
  if (!onboardingDismissed) {
    return /* @__PURE__ */ jsxDEV("main", { className: "app-shell onboarding-fullscreen", style: { display: "flex", flexDirection: "column", minHeight: "100vh", padding: "40px 20px", background: "linear-gradient(135deg, #0d9488 0%, #111827 100%)", overflowY: "auto" }, children: /* @__PURE__ */ jsxDEV("section", { className: "workspace onboarding-only-workspace", id: "workspace-content", style: { maxWidth: "800px", width: "100%", margin: "auto", padding: "0", background: "none", boxShadow: "none" }, children: /* @__PURE__ */ jsxDEV("section", { className: "onboarding-shell", "aria-label": "Первичная настройка клиники", style: { width: "100%", background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", padding: "32px", border: "1px solid #e5e7eb" }, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "onboarding-head", style: { borderBottom: "1px solid #f3f4f6", paddingBottom: "20px", marginBottom: "24px" }, children: /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("p", { className: "eyebrow", style: { textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em", color: "#0d9488", fontWeight: "600" }, children: "Первый запуск" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2021,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "24px", fontWeight: "700", color: "#111827", marginTop: "4px" }, children: "Быстрая настройка CRM Dente" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2022,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2020,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2019,
        columnNumber: 13
      }, this),
      onboardingStep !== "intro" ? /* @__PURE__ */ jsxDEV("div", { className: "wizard-step-list", style: { display: "flex", gap: "12px", marginBottom: "32px" }, children: onboardingSteps2.map(
        (step, index) => /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              flex: "1",
              padding: "10px",
              borderRadius: "8px",
              background: step.id === onboardingStep ? "#f0fdfa" : "#f9fafb",
              border: "1px solid",
              borderColor: step.id === onboardingStep ? "#0d9488" : "#e5e7eb",
              display: "flex",
              flexDirection: "column",
              gap: "2px"
            },
            children: [
              /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "11px", color: step.id === onboardingStep ? "#0d9488" : "#6b7280", fontWeight: "600" }, children: [
                "Шаг ",
                index + 1
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2044,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { style: { fontSize: "14px", color: step.id === onboardingStep ? "#0f766e" : "#374151" }, children: step.title }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2045,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "11px", color: "#6b7280" }, children: step.detail }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2046,
                columnNumber: 21
              }, this)
            ]
          },
          step.id,
          true,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2030,
            columnNumber: 15
          },
          this
        )
      ) }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2028,
        columnNumber: 13
      }, this) : null,
      onboardingStep === "intro" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { style: { fontSize: "20px", fontWeight: "600", marginBottom: "8px" }, children: "Режим запуска приложения" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2056,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { style: { color: "#4b5563" }, children: "Выберите, в каком режиме вы хотите запустить CRM. Для быстрого тестирования используйте демо-режим, для реальной работы — чистый запуск." }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2057,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2055,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }, children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: async () => {
                setResetting(true);
                await handleSelectDemoMode();
                setResetting(false);
              },
              disabled: resetting,
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                padding: "20px",
                background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                border: "2px solid #38bdf8",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              },
              children: [
                /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "28px", marginBottom: "12px" }, children: "🚀" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2084,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("strong", { style: { fontSize: "16px", color: "#0369a1", marginBottom: "6px" }, children: "Попробовать демо-режим" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2085,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "13px", color: "#0c4a6e" }, children: "Запустить систему с готовыми демонстрационными данными (тестовые пациенты, расписание, приемы и оплаты), чтобы быстро ознакомиться с возможностями." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2086,
                  columnNumber: 21
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2063,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: async () => {
                setResetting(true);
                await handleSelectZeroMode();
                setResetting(false);
              },
              disabled: resetting,
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                padding: "20px",
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "2px solid #4ade80",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              },
              children: [
                /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "28px", marginBottom: "12px" }, children: "✨" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2112,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("strong", { style: { fontSize: "16px", color: "#15803d", marginBottom: "6px" }, children: "Начать с чистого листа" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2113,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "13px", color: "#14532d" }, children: "Полностью пустая база данных для настройки клиники с нуля. Вы сможете ввести свои данные, добавить врачей и кабинеты шаг за шагом." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2114,
                  columnNumber: 21
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2091,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2062,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2054,
        columnNumber: 13
      }, this) : null,
      onboardingStep === "clinic" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { style: { fontSize: "18px", fontWeight: "600", marginBottom: "6px" }, children: "О клинике" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2126,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { style: { color: "#4b5563" }, children: "Название и телефон понадобятся для генерации договоров и медицинских карт." }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2127,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2125,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
            /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "14px", fontWeight: "500", color: "#374151" }, children: "Название клиники" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2131,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "onboarding-clinic-name",
                style: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px" },
                value: clinicProfileDraft.clinicName,
                onChange: (event) => updateClinicProfileDraft("clinicName", event.target.value),
                placeholder: "Стоматология..."
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2132,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2130,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
            /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "14px", fontWeight: "500", color: "#374151" }, children: "Телефон для связи" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2141,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "onboarding-clinic-phone",
                style: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px" },
                value: clinicProfileDraft.phone,
                onChange: (event) => updateClinicProfileDraft("phone", event.target.value),
                placeholder: "89..."
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2142,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2140,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2129,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2124,
        columnNumber: 13
      }, this) : null,
      onboardingStep === "team" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { style: { fontSize: "18px", fontWeight: "600", marginBottom: "6px" }, children: "Ваша роль и данные" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2158,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { style: { color: "#4b5563" }, children: "Укажите свою рабочую роль в клинике и личные данные для настройки интерфейса." }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2159,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2157,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
            /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "14px", fontWeight: "500", color: "#374151" }, children: "Ваша рабочая роль" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2163,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: roleFocusOrder2.map(
              (role) => /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: selectedWorkspaceRole === role ? "active" : "",
                  type: "button",
                  "aria-pressed": selectedWorkspaceRole === role,
                  onClick: () => setSelectedWorkspaceRole(role),
                  style: {
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: selectedWorkspaceRole === role ? "#0d9488" : "#d1d5db",
                    background: selectedWorkspaceRole === role ? "#0d9488" : "#ffffff",
                    color: selectedWorkspaceRole === role ? "#ffffff" : "#374151",
                    fontWeight: "500",
                    cursor: "pointer"
                  },
                  children: staffRoleLabels2[role]
                },
                role,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2166,
                  columnNumber: 21
                },
                this
              )
            ) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2164,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2162,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
            /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "14px", fontWeight: "500", color: "#374151" }, children: selectedWorkspaceRole === "owner" ? "ФИО владельца клиники" : selectedWorkspaceRole === "doctor" ? "ФИО врача" : selectedWorkspaceRole === "administrator" ? "ФИО администратора" : selectedWorkspaceRole === "assistant" ? "ФИО ассистента" : "ФИО сотрудника" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2189,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "onboarding-staff-name",
                style: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px" },
                value: newStaffName,
                onChange: (event) => setNewStaffName(event.target.value),
                placeholder: "Иванов Иван Иванович"
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2196,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2188,
            columnNumber: 19
          }, this),
          (selectedWorkspaceRole === "doctor" || selectedWorkspaceRole === "assistant") && /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
            /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "14px", fontWeight: "500", color: "#374151" }, children: "Название кабинета/кресла" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2206,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "onboarding-chair-name",
                style: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px" },
                value: newChairName,
                onChange: (event) => setNewChairName(event.target.value),
                placeholder: "Кабинет терапевта"
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2207,
                columnNumber: 23
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2205,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2161,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2156,
        columnNumber: 13
      }, this) : null,
      onboardingStep === "done" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { style: { fontSize: "20px", fontWeight: "600", marginBottom: "8px" }, children: "Все готово к запуску!" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2224,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { style: { color: "#4b5563" }, children: "Проверьте параметры перед открытием рабочей смены. Вы сможете изменить любые настройки позже." }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2225,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2223,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: selectedWorkspaceRole === "doctor" || selectedWorkspaceRole === "assistant" ? "1fr 1fr" : "1fr", gap: "16px", background: "#f9fafb", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }, children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "12px", textTransform: "uppercase", color: "#6b7280", display: "block" }, children: "Название клиники" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2231,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { style: { fontSize: "15px", color: "#111827" }, children: clinicProfileDraft.clinicName || "Новая стоматология" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2232,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2230,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "12px", textTransform: "uppercase", color: "#6b7280", display: "block" }, children: "Ваша рабочая роль" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2235,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { style: { fontSize: "15px", color: "#111827" }, children: staffRoleLabels2[selectedWorkspaceRole] }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2236,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2234,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "12px", textTransform: "uppercase", color: "#6b7280", display: "block" }, children: "Первый специалист" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2239,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { style: { fontSize: "15px", color: "#111827" }, children: newStaffName || "Администратор" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2240,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2238,
            columnNumber: 19
          }, this),
          (selectedWorkspaceRole === "doctor" || selectedWorkspaceRole === "assistant") && /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "12px", textTransform: "uppercase", color: "#6b7280", display: "block" }, children: "Кабинет / кресло" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2244,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { style: { fontSize: "15px", color: "#111827" }, children: newChairName || "Кабинет №1" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2245,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2243,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2229,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2222,
        columnNumber: 13
      }, this) : null,
      /* @__PURE__ */ jsxDEV("div", { className: "onboarding-actions", style: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }, children: [
        onboardingStep !== "intro" && previousOnboardingStep ? /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "secondary-button",
            type: "button",
            onClick: () => void moveOnboardingTo(previousOnboardingStep.id),
            style: {
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontWeight: "500",
              cursor: "pointer"
            },
            children: "Назад"
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2255,
            columnNumber: 15
          },
          this
        ) : null,
        onboardingStep !== "intro" && nextOnboardingStep ? /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "primary-button",
            type: "button",
            onClick: () => void moveOnboardingTo(nextOnboardingStep.id),
            style: {
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#0d9488",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer"
            },
            children: "Дальше"
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2273,
            columnNumber: 15
          },
          this
        ) : null,
        onboardingStep === "done" ? /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "primary-button",
            type: "button",
            onClick: () => void handleFinishOnboarding(newStaffName, newChairName),
            style: {
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#0d9488",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer"
            },
            children: "Начать работу"
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2291,
            columnNumber: 15
          },
          this
        ) : null
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2253,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 2016,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 2015,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 2014,
      columnNumber: 7
    }, this);
  }
  if (accessUnlockRequired && !dashboard) {
    return /* @__PURE__ */ jsxDEV(
      AppUnlockState,
      {
        accessMessage: accessUnlockMessage,
        adminSecretDraft: clinicalAdminSecretDraft,
        onAdminSecretChange: setClinicalAdminSecretDraft,
        onUnlock: () => unlockTelegramAdminSession("all")
      },
      void 0,
      false,
      {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2318,
        columnNumber: 7
      },
      this
    );
  }
  if (error && !dashboard) {
    return /* @__PURE__ */ jsxDEV(
      AppLoadingState,
      {
        message: `Рабочий сервер недоступен: ${error}`,
        actionLabel: "Повторить загрузку",
        onAction: () => {
          setError(null);
          void loadDashboard().catch((loadError) => {
            setError(operatorWorkflowFailureMessage2("Не удалось загрузить данные клиники", loadError));
          });
        }
      },
      void 0,
      false,
      {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2329,
        columnNumber: 7
      },
      this
    );
  }
  if (!dashboard) {
    return /* @__PURE__ */ jsxDEV(AppLoadingState, { message: "Загрузка рабочей смены" }, void 0, false, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 2343,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("main", { className: "app-shell", children: [
    /* @__PURE__ */ jsxDEV("a", { className: "skip-link", href: "#workspace-content", children: "Перейти к рабочей области" }, void 0, false, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 2348,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(WorkspaceSidebar, { currentView, onViewIntent: preloadWorkspaceView2, role: selectedWorkspaceRole }, void 0, false, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 2351,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { className: `workspace view-${currentView}`, id: "workspace-content", tabIndex: -1, "aria-label": "Рабочая область", children: [
      dashboard?.clinicName === "Стоматология, 1 кабинет" && /* @__PURE__ */ jsxDEV("div", { className: "default-clinic-banner", role: "alert", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "banner-content", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "banner-icon", "aria-hidden": "true", children: "🚀" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2357,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "Демо-режим." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2359,
              columnNumber: 17
            }, this),
            " Тестовые данные загружены. Для настройки своей клиники нажмите «Запустить мастер»."
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2358,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2356,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "primary-button banner-btn", type: "button", onClick: reopenOnboarding, children: "Запустить мастер" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2362,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2355,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        WorkspaceTopbar,
        {
          clinicName: dashboard.clinicName,
          onGoToDictation: goToVisitDictation,
          onGoToSchedule: () => {
            window.location.hash = "schedule";
          },
          onGoToVisit: () => {
            window.location.hash = "visit";
          },
          onReopenOnboarding: reopenOnboarding,
          onRoleChange: setSelectedWorkspaceRole,
          onViewIntent: preloadWorkspaceView2,
          roleFocusOrder: roleFocusOrder2,
          selectedWorkspaceRole,
          showAdministrationTopActions,
          showDoctorVisitShortcut,
          staffRoleLabels: staffRoleLabels2,
          todayIso: dashboard.todayIso,
          onLockSession: handleLockSession
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2368,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        WorkspaceContinuityStrip,
        {
          browserContinuityCritical,
          browserWarnings: browserContinuity?.warnings ?? [],
          isOnline,
          isPendingVisitSyncing,
          onCheckDevice: () => void refreshBrowserContinuity({ silent: false }),
          onFlushSpeech: () => void flushPendingSpeechChunks({ silent: false }),
          onFlushVisit: () => void flushPendingVisitSaves({ silent: false }),
          pendingSpeechChunkCount,
          pendingVisitSaveCount
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2389,
          columnNumber: 9
        },
        this
      ),
      error ? /* @__PURE__ */ jsxDEV("section", { className: "app-notice", role: "alert", "aria-live": "assertive", children: [
        /* @__PURE__ */ jsxDEV(AlertTriangle, { "aria-hidden": "true" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2403,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: error }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2404,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => setError(null), children: "Понятно" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2405,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2402,
        columnNumber: 9
      }, this) : null,
      !error && uiPreferencesSyncError ? /* @__PURE__ */ jsxDEV("section", { className: "app-notice", role: "alert", "aria-live": "assertive", children: [
        /* @__PURE__ */ jsxDEV(AlertTriangle, { "aria-hidden": "true" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2413,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: uiPreferencesSyncError }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2414,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => setUiPreferencesSyncError(null), children: "Понятно" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2415,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2412,
        columnNumber: 9
      }, this) : null,
      !error && !uiPreferencesSyncError && telegramHandoffNotice ? /* @__PURE__ */ jsxDEV("section", { className: "app-notice telegram-handoff-notice", role: "status", "aria-live": "polite", children: [
        /* @__PURE__ */ jsxDEV(Bot, { "aria-hidden": "true" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2423,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: [
          "Открыто из Telegram: ",
          /* @__PURE__ */ jsxDEV("strong", { children: telegramHandoffNotice.title }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2425,
            columnNumber: 36
          }, this),
          ". ",
          telegramHandoffNotice.detail,
          " Ссылка не содержит пациента, документ, запись или оплату."
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2424,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => setTelegramHandoffNotice(null), children: "Понятно" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2428,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2422,
        columnNumber: 9
      }, this) : null,
      !onboardingDismissed && !showFullOnboardingGuide ? /* @__PURE__ */ jsxDEV("section", { className: "onboarding-compact-strip", "aria-label": "Первичная настройка клиники", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Можно начать прием без мастера" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2437,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Документы предупредят о реквизитах позже. Сейчас важнее открыть пациента, диктовку и расписание." }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2438,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2436,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "onboarding-compact-score", children: [
          currentOnboardingIndex + 1,
          "/",
          onboardingSteps2.length,
          " · документы ",
          legalReadinessPercent,
          "%"
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2442,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "primary-button", type: "button", onClick: () => void continueOnboardingInDraftMode("visit"), children: [
          /* @__PURE__ */ jsxDEV(ClipboardCheck, { "aria-hidden": "true" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2446,
            columnNumber: 15
          }, this),
          " Прием"
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2445,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => openOnboardingGuide(), children: [
          /* @__PURE__ */ jsxDEV(ShieldCheck, { "aria-hidden": "true" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2449,
            columnNumber: 15
          }, this),
          " Настроить"
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2448,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2435,
        columnNumber: 9
      }, this) : null,
      showFullOnboardingGuide ? /* @__PURE__ */ jsxDEV("section", { className: "onboarding-shell", "aria-label": "Первичная настройка клиники", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "onboarding-head", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("p", { className: "eyebrow", children: "Первое открытие" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2458,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("h2", { children: "Настройка новой клиники и рабочего места врача" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2459,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Можно начать прием сразу. Юридические поля, импорт и Telegram остаются в настройке и не мешают диктовке, расписанию и карточке пациента." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2460,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2457,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-score", children: [
            /* @__PURE__ */ jsxDEV("span", { children: [
              currentOnboardingIndex + 1,
              "/",
              onboardingSteps2.length
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2466,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { children: [
              legalReadinessPercent,
              "%"
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2467,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("small", { children: "готовность документов" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2468,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2465,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2456,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "onboarding-fast-start", "aria-label": "Быстрый старт работы", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "Рабочий вход без мастера" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2474,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Черновики приема сохраняются. Документы и налоговые формы сами покажут, каких реквизитов не хватает." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2475,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2473,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "primary-button", type: "button", onClick: () => void continueOnboardingInDraftMode("visit"), children: [
            /* @__PURE__ */ jsxDEV(ClipboardCheck, { "aria-hidden": "true" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2480,
              columnNumber: 17
            }, this),
            " Открыть прием"
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2479,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => void continueOnboardingInDraftMode("schedule"), children: [
            /* @__PURE__ */ jsxDEV(CalendarDays, { "aria-hidden": "true" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2483,
              columnNumber: 17
            }, this),
            " Расписание"
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2482,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => void moveOnboardingTo("legal"), children: [
            /* @__PURE__ */ jsxDEV(ShieldCheck, { "aria-hidden": "true" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2486,
              columnNumber: 17
            }, this),
            " Реквизиты"
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2485,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2472,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "onboarding-step-list", "aria-label": "Шаги знакомства", children: onboardingSteps2.map(
          (step, index) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: step.id === onboardingStep ? "active" : index < currentOnboardingIndex ? "done" : "",
              type: "button",
              "aria-current": step.id === onboardingStep ? "step" : void 0,
              "aria-pressed": step.id === onboardingStep,
              "aria-describedby": step.id === "done" && !onboardingReadyToFinish ? onboardingFinishGuidanceId : void 0,
              disabled: step.id === "done" && !onboardingReadyToFinish,
              onClick: () => void moveOnboardingTo(step.id),
              children: [
                /* @__PURE__ */ jsxDEV("span", { children: index + 1 }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2502,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("strong", { children: step.title }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2503,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("small", { children: step.detail }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2504,
                  columnNumber: 19
                }, this)
              ]
            },
            step.id,
            true,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2492,
              columnNumber: 13
            },
            this
          )
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2490,
          columnNumber: 13
        }, this),
        onboardingStep === "intro" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Короткая карта приложения" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2512,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Смена показывает очередь и срочные действия. Прием хранит черновики локально и на сервере. Документы генерируются из проверенных данных пациента, оплаты и лицензии клиники." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2513,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2511,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-grid", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Прием: протоколы, голос, офлайн-черновик" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2519,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Документы: пациент, оплата, налоговая" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2520,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Импорт: прайс, старые базы, снимки" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2521,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "Настройки: роль, кабинет, юридический профиль" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2522,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2518,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2510,
          columnNumber: 11
        }, this) : null,
        onboardingStep === "role" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Кто сейчас работает" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2530,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Выбор роли и специализации сохраняется как настройка рабочего места и не подмешивает чужие разделы." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2531,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2529,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-form-grid", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "role-picker form-span-2", "aria-label": "Роль нового сотрудника", children: roleFocusOrder2.map(
              (role) => /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: selectedWorkspaceRole === role ? "active" : "",
                  type: "button",
                  "aria-pressed": selectedWorkspaceRole === role,
                  onClick: () => setSelectedWorkspaceRole(role),
                  children: staffRoleLabels2[role]
                },
                role,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2536,
                  columnNumber: 17
                },
                this
              )
            ) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2534,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "specialty-strip form-span-2", "aria-label": "Специализация врача", children: Object.keys(specialtyLabels2).map(
              (specialty) => /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: selectedSpecialty === specialty ? "active" : "",
                  type: "button",
                  "aria-pressed": selectedSpecialty === specialty,
                  onClick: () => setSelectedSpecialty(specialty),
                  children: specialtyLabels2[specialty]
                },
                specialty,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2549,
                  columnNumber: 17
                },
                this
              )
            ) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2547,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2533,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2528,
          columnNumber: 11
        }, this) : null,
        onboardingStep === "clinic" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Режим и базовые контакты" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2567,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Режим меняет первый экран, очереди ролей и подсказки без ручной перенастройки интерфейса." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2568,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2566,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mode-grid form-span-2", "aria-label": "Режим клиники", children: Object.keys(clinicModeLabels2).map(
            (mode) => /* @__PURE__ */ jsxDEV(
              "button",
              {
                className: `mode-card ${dashboard.clinicSettings.profile?.mode === mode ? "active" : ""}`,
                type: "button",
                "aria-pressed": dashboard.clinicSettings.profile?.mode === mode,
                onClick: () => changeClinicMode(mode),
                children: [
                  /* @__PURE__ */ jsxDEV("strong", { children: clinicModeLabels2[mode].title }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2579,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: clinicModeLabels2[mode].detail }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2580,
                    columnNumber: 23
                  }, this)
                ]
              },
              mode,
              true,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2572,
                columnNumber: 15
              },
              this
            )
          ) }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2570,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-form-grid", children: [
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Название клиники",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.clinicName, onChange: (event) => updateClinicProfileDraft("clinicName", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2587,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2585,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Телефон",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.phone, onChange: (event) => updateClinicProfileDraft("phone", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2591,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2589,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Часовой пояс",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.timezone, onChange: (event) => updateClinicProfileDraft("timezone", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2595,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2593,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Язык интерфейса",
              /* @__PURE__ */ jsxDEV("select", { value: uiLanguage, onChange: (event) => setUiLanguage(normalizeUiLanguageInput2(event.target.value)), children: uiLanguageOptions2.map(
                (option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2601,
                  columnNumber: 19
                }, this)
              ) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2599,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("small", { className: "field-note", children: selectedUiLanguageOption.detail }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2606,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2597,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Минут на визит",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  inputMode: "numeric",
                  value: clinicProfileDraft.defaultVisitMinutes,
                  onChange: (event) => updateClinicProfileDraft("defaultVisitMinutes", event.target.value.replace(/[^\d]/g, "").slice(0, 3))
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2610,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2608,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Начало смены",
              /* @__PURE__ */ jsxDEV("input", { type: "time", value: clinicProfileDraft.workdayStart, onChange: (event) => updateClinicProfileDraft("workdayStart", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2618,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2616,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Конец смены",
              /* @__PURE__ */ jsxDEV("input", { type: "time", value: clinicProfileDraft.workdayEnd, onChange: (event) => updateClinicProfileDraft("workdayEnd", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2622,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2620,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Буфер, мин",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  inputMode: "numeric",
                  value: clinicProfileDraft.appointmentBufferMinutes,
                  onChange: (event) => updateClinicProfileDraft("appointmentBufferMinutes", event.target.value.replace(/[^\d]/g, "").slice(0, 3))
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2626,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2624,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "weekday-toggle-row form-span-2", role: "group", "aria-label": "Рабочие дни клиники", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Рабочие дни" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2633,
                columnNumber: 21
              }, this),
              weekdayOptions2.map(
                (day) => /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    className: clinicProfileDraft.workingDays.includes(day.value) ? "active" : "",
                    type: "button",
                    "aria-pressed": clinicProfileDraft.workingDays.includes(day.value),
                    onClick: () => toggleClinicWorkingDay(day.value),
                    children: day.label
                  },
                  day.value,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2635,
                    columnNumber: 17
                  },
                  this
                )
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2632,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2584,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2565,
          columnNumber: 11
        }, this) : null,
        onboardingStep === "legal" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Юридические данные для договоров и налоговых справок" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2653,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Без этих полей приложение не должно выдавать финальные договоры, акты и налоговые документы как готовые." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2654,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2652,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-form-grid", children: [
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Юридическое лицо",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.legalName, onChange: (event) => updateClinicProfileDraft("legalName", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2661,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2659,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "ИНН",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.inn, onChange: (event) => updateClinicProfileDraft("inn", event.target.value.replace(/[^\d]/g, "").slice(0, 12)) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2665,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2663,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "КПП",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.kpp, onChange: (event) => updateClinicProfileDraft("kpp", event.target.value.replace(/[^\d]/g, "").slice(0, 9)) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2669,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2667,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "ОГРН / ОГРНИП",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.ogrn, onChange: (event) => updateClinicProfileDraft("ogrn", event.target.value.replace(/[^\d]/g, "").slice(0, 15)) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2673,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2671,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "form-span-2", children: [
              "Адрес",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.address, onChange: (event) => updateClinicProfileDraft("address", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2677,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2675,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Номер лицензии",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.medicalLicenseNumber, onChange: (event) => updateClinicProfileDraft("medicalLicenseNumber", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2681,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2679,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Дата лицензии",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.medicalLicenseIssuedAt, onChange: (event) => updateClinicProfileDraft("medicalLicenseIssuedAt", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2685,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2683,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "form-span-2", children: [
              "Кем выдана лицензия",
              /* @__PURE__ */ jsxDEV("input", { value: clinicProfileDraft.medicalLicenseIssuer, onChange: (event) => updateClinicProfileDraft("medicalLicenseIssuer", event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2689,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2687,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2658,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "clinic-legal-summary", children: [
            /* @__PURE__ */ jsxDEV("strong", { children: [
              legalReadinessPercent,
              "%"
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2693,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: legalMissingFields.length ? `Не хватает: ${legalMissingFields.join(", ")}` : "Минимальные поля заполнены" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2694,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2692,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2651,
          columnNumber: 11
        }, this) : null,
        onboardingStep === "team" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Команда и кабинет" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2702,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Сотрудники и кресла сразу попадают в серверное состояние, аудит и расписание." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2703,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2701,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-form-grid", children: [
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Новый сотрудник",
              /* @__PURE__ */ jsxDEV("input", { value: newStaffName, onChange: (event) => setNewStaffName(event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2708,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2706,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "role-picker form-span-2", "aria-label": "Роль нового сотрудника", children: ["doctor", "administrator", "assistant", "manager"].map(
              (role) => /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: newStaffRole === role ? "active" : "",
                  type: "button",
                  "aria-pressed": newStaffRole === role,
                  onClick: () => setNewStaffRole(role),
                  children: staffRoleLabels2[role]
                },
                role,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2712,
                  columnNumber: 17
                },
                this
              )
            ) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2710,
              columnNumber: 19
            }, this),
            newStaffRole === "doctor" || newStaffRole === "assistant" ? /* @__PURE__ */ jsxDEV("div", { className: "specialty-strip staff-specialty-picker form-span-2", "aria-label": "Специальность нового сотрудника", children: Object.keys(specialtyLabels2).map(
              (specialty) => /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: newStaffSpecialty === specialty ? "active" : "",
                  type: "button",
                  "aria-pressed": newStaffSpecialty === specialty,
                  onClick: () => setNewStaffSpecialty(specialty),
                  children: specialtyLabels2[specialty]
                },
                specialty,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2726,
                  columnNumber: 17
                },
                this
              )
            ) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2724,
              columnNumber: 15
            }, this) : null,
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                className: "secondary-button",
                type: "button",
                onClick: () => addStaffMember(newStaffRole),
                "aria-describedby": !newStaffReadyToCreate ? onboardingStaffCreateGuidanceId : void 0,
                disabled: !newStaffReadyToCreate,
                children: [
                  /* @__PURE__ */ jsxDEV(Plus, { "aria-hidden": "true" }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2745,
                    columnNumber: 21
                  }, this),
                  " Добавить сотрудника"
                ]
              },
              void 0,
              true,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2738,
                columnNumber: 19
              },
              this
            ),
            !newStaffReadyToCreate ? /* @__PURE__ */ jsxDEV("p", { className: "quick-create-guidance form-span-2", id: onboardingStaffCreateGuidanceId, role: "status", "aria-live": "polite", children: "Введите ФИО сотрудника, затем выберите роль." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2748,
              columnNumber: 15
            }, this) : null,
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Кресло / кабинет",
              /* @__PURE__ */ jsxDEV("input", { value: newChairName, onChange: (event) => setNewChairName(event.target.value) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2754,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2752,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                className: "secondary-button",
                type: "button",
                onClick: addChair,
                "aria-describedby": !newChairReadyToCreate ? onboardingChairCreateGuidanceId : void 0,
                disabled: !newChairReadyToCreate,
                children: [
                  /* @__PURE__ */ jsxDEV(Plus, { "aria-hidden": "true" }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2763,
                    columnNumber: 21
                  }, this),
                  " Добавить кресло"
                ]
              },
              void 0,
              true,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2756,
                columnNumber: 19
              },
              this
            ),
            !newChairReadyToCreate ? /* @__PURE__ */ jsxDEV("p", { className: "quick-create-guidance form-span-2", id: onboardingChairCreateGuidanceId, role: "status", "aria-live": "polite", children: "Введите понятное название кресла или кабинета." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2766,
              columnNumber: 15
            }, this) : null
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2705,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-schedule-grid form-span-2", "aria-label": "Расписание команды при первом запуске", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "onboarding-schedule-section", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("h4", { children: "Расписание команды" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2774,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { children: "Сразу задайте рабочие дни и часы. Изменения автосохраняются и остаются выбранными, пока вы их не поменяете." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2775,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2773,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "staff-list", children: dashboard.clinicSettings.staff.filter((member) => member.role === "doctor" || member.role === "assistant").map((member) => {
                const scheduleDraft = staffScheduleDrafts[member.id] ?? staffScheduleDraftFromWorkingHours2(member.workingHours ?? null);
                const scheduleSaveState = staffScheduleSaveStates[member.id] ?? "saved";
                const scheduleDirty = staffScheduleDirtyIds.has(member.id);
                const scheduleSaving = staffScheduleSavingId === member.id || scheduleSaveState === "saving";
                const scheduleSaveLabel = scheduleSaving ? "Автосохранение" : scheduleSaveState === "error" ? "Не сохранено" : scheduleDirty ? "Ждет автосохранения" : "Сохранено";
                return /* @__PURE__ */ jsxDEV("div", { className: "staff-row onboarding-schedule-row", children: [
                  /* @__PURE__ */ jsxDEV("span", { style: { background: member.color } }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2794,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("strong", { children: member.fullName }, void 0, false, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2796,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { children: [
                      staffRoleLabels2[member.role],
                      " · ",
                      member.specialties.map((item) => specialtyLabels2[item]).join(", ")
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2797,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2795,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "staff-schedule-editor onboarding-compact-schedule-editor", children: [
                    /* @__PURE__ */ jsxDEV("label", { children: [
                      "С",
                      /* @__PURE__ */ jsxDEV(
                        "input",
                        {
                          "aria-label": `Начало смены: ${member.fullName}`,
                          type: "time",
                          value: scheduleDraft.start,
                          onChange: (event) => updateStaffScheduleDraft(member.id, { start: event.target.value })
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2804,
                          columnNumber: 35
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2802,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("label", { children: [
                      "До",
                      /* @__PURE__ */ jsxDEV(
                        "input",
                        {
                          "aria-label": `Конец смены: ${member.fullName}`,
                          type: "time",
                          value: scheduleDraft.end,
                          onChange: (event) => updateStaffScheduleDraft(member.id, { end: event.target.value })
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2813,
                          columnNumber: 35
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2811,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "weekday-toggle-row staff-weekday-row", role: "group", "aria-label": `Рабочие дни сотрудника: ${member.fullName}`, children: weekdayOptions2.map(
                      (day) => /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          className: scheduleDraft.workingDays.includes(day.value) ? "active" : "",
                          type: "button",
                          "aria-pressed": scheduleDraft.workingDays.includes(day.value),
                          onClick: () => toggleStaffWorkingDay(member.id, day.value),
                          children: day.label
                        },
                        day.value,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2822,
                          columnNumber: 29
                        },
                        this
                      )
                    ) }, void 0, false, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2820,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "staff-schedule-actions", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: `save-state save-state-${scheduleSaveState}`, children: scheduleSaveLabel }, void 0, false, {
                        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                        lineNumber: 2834,
                        columnNumber: 35
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          className: "secondary-button compact-button",
                          type: "button",
                          onClick: () => void saveStaffSchedule(member.id),
                          disabled: scheduleSaving,
                          children: scheduleSaving ? "Сохраняю" : "Сохранить сейчас"
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2835,
                          columnNumber: 35
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2833,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2801,
                    columnNumber: 31
                  }, this)
                ] }, `onboarding-staff-schedule-${member.id}`, true, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2793,
                  columnNumber: 23
                }, this);
              }) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2777,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2772,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "onboarding-schedule-section", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("h4", { children: "Расписание кресел" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2852,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { children: "Кабинет может работать иначе, чем врач. Это сразу учитывается в записи и конфликтных слотах." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2853,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2851,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "staff-list", children: dashboard.clinicSettings.chairs.filter((chair) => chair.active).map((chair) => {
                const scheduleDraft = chairScheduleDrafts[chair.id] ?? staffScheduleDraftFromWorkingHours2(chair.workingHours ?? null);
                const scheduleSaveState = chairScheduleSaveStates[chair.id] ?? "saved";
                const scheduleDirty = chairScheduleDirtyIds.has(chair.id);
                const scheduleSaving = chairScheduleSavingId === chair.id || scheduleSaveState === "saving";
                const scheduleSaveLabel = scheduleSaving ? "Автосохранение" : scheduleSaveState === "error" ? "Не сохранено" : scheduleDirty ? "Ждет автосохранения" : "Сохранено";
                return /* @__PURE__ */ jsxDEV("div", { className: "staff-row onboarding-schedule-row", children: [
                  /* @__PURE__ */ jsxDEV(CalendarDays, { "aria-hidden": "true" }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2872,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("strong", { children: chair.name }, void 0, false, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2874,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { children: chair.specialization ? specialtyLabels2[chair.specialization] : "универсально" }, void 0, false, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2875,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2873,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "staff-schedule-editor onboarding-compact-schedule-editor", children: [
                    /* @__PURE__ */ jsxDEV("label", { children: [
                      "С",
                      /* @__PURE__ */ jsxDEV(
                        "input",
                        {
                          "aria-label": `Начало работы кресла: ${chair.name}`,
                          type: "time",
                          value: scheduleDraft.start,
                          onChange: (event) => updateChairScheduleDraft(chair.id, { start: event.target.value })
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2880,
                          columnNumber: 35
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2878,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("label", { children: [
                      "До",
                      /* @__PURE__ */ jsxDEV(
                        "input",
                        {
                          "aria-label": `Конец работы кресла: ${chair.name}`,
                          type: "time",
                          value: scheduleDraft.end,
                          onChange: (event) => updateChairScheduleDraft(chair.id, { end: event.target.value })
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2889,
                          columnNumber: 35
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2887,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "weekday-toggle-row staff-weekday-row", role: "group", "aria-label": `Рабочие дни кресла: ${chair.name}`, children: weekdayOptions2.map(
                      (day) => /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          className: scheduleDraft.workingDays.includes(day.value) ? "active" : "",
                          type: "button",
                          "aria-pressed": scheduleDraft.workingDays.includes(day.value),
                          onClick: () => toggleChairWorkingDay(chair.id, day.value),
                          children: day.label
                        },
                        day.value,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2898,
                          columnNumber: 29
                        },
                        this
                      )
                    ) }, void 0, false, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2896,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "staff-schedule-actions", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: `save-state save-state-${scheduleSaveState}`, children: scheduleSaveLabel }, void 0, false, {
                        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                        lineNumber: 2910,
                        columnNumber: 35
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          className: "secondary-button compact-button",
                          type: "button",
                          onClick: () => void saveChairSchedule(chair.id),
                          disabled: scheduleSaving,
                          children: scheduleSaving ? "Сохраняю" : "Сохранить сейчас"
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                          lineNumber: 2911,
                          columnNumber: 35
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 2909,
                      columnNumber: 33
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2877,
                    columnNumber: 31
                  }, this)
                ] }, `onboarding-chair-schedule-${chair.id}`, true, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2871,
                  columnNumber: 23
                }, this);
              }) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2855,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2850,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2771,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2700,
          columnNumber: 11
        }, this) : null,
        onboardingStep === "sources" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Источники данных" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2933,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Выберите рабочие источники один раз. Система сохранит эти настройки автоматически и будет использовать их в прайсах, переносе пациентов, документах, снимках и внешнем просмотре КТ, пока клиника сама их не поменяет." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2934,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2932,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-config", "aria-label": "Быстрая настройка источников данных", children: [
            /* @__PURE__ */ jsxDEV("section", { className: "onboarding-source-section", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("strong", { children: "Прайс клиники" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2943,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Откуда администратор чаще всего заносит цены и материалы." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2944,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2942,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-choice-row", "aria-label": "Источник прайса", children: Object.keys(pricelistSourceKindLabels2).map(
                (kind) => /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    className: pricelistSourceKind === kind ? "active" : "",
                    type: "button",
                    "aria-pressed": pricelistSourceKind === kind,
                    onClick: () => {
                      setPricelistSourceKind(kind);
                      if (kind !== "photo_ocr") clearPricelistImage();
                      setPricelistAnalysis(null);
                    },
                    children: pricelistSourceKindLabels2[kind]
                  },
                  kind,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2948,
                    columnNumber: 19
                  },
                  this
                )
              ) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2946,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2941,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("section", { className: "onboarding-source-section", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("strong", { children: "Перенос пациентов" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2967,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Основной формат старой базы или бумажного журнала." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2968,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2966,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-choice-row", "aria-label": "Источник переноса пациентов", children: Object.keys(importSourceLabels2).map(
                (kind) => /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    className: importSourceKind === kind ? "active" : "",
                    type: "button",
                    "aria-pressed": importSourceKind === kind,
                    onClick: () => {
                      setImportSourceKind(kind);
                      setImportPreview(null);
                      setImportCommit(null);
                    },
                    children: importSourceLabels2[kind].title
                  },
                  kind,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2972,
                    columnNumber: 19
                  },
                  this
                )
              ) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2970,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2965,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("section", { className: "onboarding-source-section", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("strong", { children: "Смешанная выгрузка" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2991,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Как разбирать файл, где вместе пациенты, снимки и служебные строки." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 2992,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2990,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-choice-row", "aria-label": "Режим смешанного импорта", children: Object.keys(smartImportModeLabels2).map(
                (mode) => /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    className: smartImportMode === mode ? "active" : "",
                    type: "button",
                    "aria-pressed": smartImportMode === mode,
                    onClick: () => {
                      setSmartImportMode(mode);
                      setSmartImportPreview(null);
                      setSmartImportCommit(null);
                    },
                    children: smartImportModeLabels2[mode].title
                  },
                  mode,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 2996,
                    columnNumber: 19
                  },
                  this
                )
              ) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 2994,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 2989,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("section", { className: "onboarding-source-section", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("strong", { children: "Документы и файлы" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3015,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Куда по умолчанию отправлять распознанный документ, таблицу, архив или фото." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3016,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3014,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-choice-row", "aria-label": "Маршрут распознанных документов", children: Object.keys(ingestionTargetLabels2).map(
                (target) => /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    className: documentIngestionTarget === target ? "active" : "",
                    type: "button",
                    "aria-pressed": documentIngestionTarget === target,
                    onClick: () => setDocumentIngestionTarget(target),
                    children: ingestionTargetLabels2[target]
                  },
                  target,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 3020,
                    columnNumber: 19
                  },
                  this
                )
              ) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3018,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3013,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("section", { className: "onboarding-source-section onboarding-source-section-wide", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("strong", { children: "Снимки и КТ" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3035,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Основной поток RVG, ОПТГ, КТ, архива снимков или локальных папок." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3036,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3034,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-choice-row", "aria-label": "Источник снимков", children: imagingSourceChoices2.map(
                (kind) => /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    className: imagingImportSourceKind === kind ? "active" : "",
                    type: "button",
                    "aria-pressed": imagingImportSourceKind === kind,
                    onClick: () => {
                      setImagingImportSourceKind(kind);
                      setImagingImportPreview(null);
                      setImagingImportCommit(null);
                      setDicomSeriesPreview(null);
                    },
                    children: imagingSourceLabels2[kind]
                  },
                  kind,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 3040,
                    columnNumber: 19
                  },
                  this
                )
              ) }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3038,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3033,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("section", { className: "onboarding-source-section onboarding-source-section-wide", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("strong", { children: "Архив снимков и внешний просмотр" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3060,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Адреса просмотрщика сохраняются вместе с остальными настройками источников." }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3061,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3059,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-url-grid", children: [
                /* @__PURE__ */ jsxDEV("label", { children: [
                  "Адрес архива снимков",
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      value: dicomWebEndpointUrl,
                      onChange: (event) => {
                        setDicomWebEndpointUrl(event.target.value);
                        setDicomWebCheck(null);
                        setDicomViewerLaunchManifest(null);
                        setDicomViewerToolStateBundle(null);
                        setDicomViewerWorkbenchManifest(null);
                      },
                      placeholder: "http://127.0.0.1:8042/dicom-web"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 3066,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3064,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("label", { children: [
                  "Адрес внешнего просмотра",
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      value: ohifBaseUrl,
                      onChange: (event) => {
                        setOhifBaseUrl(event.target.value);
                        setDicomViewerLaunchManifest(null);
                        setDicomViewerWorkbenchManifest(null);
                      },
                      placeholder: "http://127.0.0.1:3000"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 3080,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3078,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3063,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3058,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 2940,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-source-grid", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Автосохранено: прайс, импорт, документы, снимки, архив и внешний просмотр" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3095,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => {
              setSettingsTab("prices");
              window.location.hash = "settings/prices";
            }, children: "Открыть прайс" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3096,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => {
              setSettingsTab("imports");
              window.location.hash = "settings/imports";
            }, children: "Открыть перенос" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3097,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => {
              setSettingsTab("sources");
              window.location.hash = "settings/sources";
            }, children: "Открыть снимки" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3098,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3094,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 2931,
          columnNumber: 11
        }, this) : null,
        onboardingStep === "telegram" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Telegram, QR и связь с пациентами" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3106,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: "Настройте Telegram-бот сразу при первом запуске: QR-привязка пациента, напоминания, памятки после лечения, отзывы и ссылки на портал сохраняются автоматически и применяются ко всей клинике." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3107,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3105,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-telegram-status", children: [
            /* @__PURE__ */ jsxDEV("span", { children: [
              "Бот",
              /* @__PURE__ */ jsxDEV("strong", { children: telegramStatus?.botUsername ? `@${telegramStatus.botUsername.replace(/^@/, "")}` : "не загружен" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3115,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3113,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "Транспорт",
              /* @__PURE__ */ jsxDEV("strong", { children: telegramStatus?.webhookReady ? "готов" : "нужна проверка" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3119,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3117,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "QR-коды",
              /* @__PURE__ */ jsxDEV("strong", { children: [
                telegramStatus?.pendingLinkCodeCount ?? 0,
                " ожидают"
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3123,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3121,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "Чаты",
              /* @__PURE__ */ jsxDEV("strong", { children: [
                telegramStatus?.activeChatLinkCount ?? 0,
                " связаны"
              ] }, void 0, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3127,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3125,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3112,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-form-grid", children: [
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Имя общего бота в Telegram",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  value: telegramBotUsernameDraft,
                  placeholder: "dentecrm_bot",
                  onChange: (event) => {
                    setTelegramBotUsernameDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3133,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3131,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Портал пациента",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "url",
                  inputMode: "url",
                  placeholder: "https://portal.example",
                  value: telegramPatientPortalBaseUrlDraft,
                  onChange: (event) => {
                    setTelegramPatientPortalBaseUrlDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3144,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3142,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Картинка приветствия",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "url",
                  inputMode: "url",
                  placeholder: "https://.../welcome.jpg",
                  value: telegramWelcomeImageUrlDraft,
                  onChange: (event) => {
                    setTelegramWelcomeImageUrlDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3157,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3155,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Ссылка на отзыв",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "url",
                  inputMode: "url",
                  placeholder: "https://...",
                  value: telegramReviewUrlDraft,
                  onChange: (event) => {
                    setTelegramReviewUrlDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3170,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3168,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Ссылка на карту",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "url",
                  inputMode: "url",
                  placeholder: "https://...",
                  value: telegramMapsUrlDraft,
                  onChange: (event) => {
                    setTelegramMapsUrlDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3183,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3181,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Срок QR-кода, минут",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  min: 5,
                  max: 1440,
                  step: 5,
                  value: telegramTokenTtlDraft,
                  onChange: (event) => {
                    setTelegramTokenTtlDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3196,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3194,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Напоминания до приема, часы",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  inputMode: "text",
                  placeholder: "24, 2",
                  value: telegramReminderLeadTimesDraft,
                  onChange: (event) => {
                    setTelegramReminderLeadTimesDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3210,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("small", { children: "Напоминания до приема в часах: от 1 до 168, максимум 6 значений." }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3219,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3208,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Просьба оценить клинику, часы после визита",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  min: 1,
                  max: 720,
                  step: 1,
                  value: telegramReviewRequestDelayDraft,
                  onChange: (event) => {
                    setTelegramReviewRequestDelayDraft(event.target.value);
                    markTelegramSettingsDirty();
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3223,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("small", { children: "Клиника сама выбирает момент просьбы оставить отзыв: от 1 до 720 часов после закрытого визита или оплаты." }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3234,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3221,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("fieldset", { className: "telegram-checkup-delay-fields full", children: [
              /* @__PURE__ */ jsxDEV("legend", { children: "Контроль после лечения" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3237,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("small", { children: "Через сколько часов Telegram спросит пациента о самочувствии после выданной памятки." }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3238,
                columnNumber: 21
              }, this),
              telegramPostVisitCheckupDelayFields2.map(
                (field) => /* @__PURE__ */ jsxDEV("label", { children: [
                  field.label,
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "number",
                      min: 1,
                      max: 720,
                      step: 1,
                      value: telegramPostVisitCheckupDelayDrafts[field.key],
                      onChange: (event) => updateTelegramPostVisitCheckupDelayDraft(field.key, event.target.value)
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 3242,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("small", { children: field.help }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 3250,
                    columnNumber: 25
                  }, this)
                ] }, field.key, true, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3240,
                  columnNumber: 17
                }, this)
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3236,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Секрет администратора клиники",
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "password",
                  autoComplete: "current-password",
                  value: telegramAdminSecretDraft,
                  onChange: (event) => setTelegramAdminSecretDraft(event.target.value),
                  onKeyDown: (event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      unlockTelegramAdminSession("telegram");
                    }
                  },
                  placeholder: "если защищенные настройки включены на сервере клиники"
                },
                void 0,
                false,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3256,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("small", { children: telegramAdminSecretSession ? "Разблокировано до перезагрузки страницы." : "Секрет не сохраняется в браузере." }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3269,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3254,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => unlockTelegramAdminSession("telegram"), children: [
              /* @__PURE__ */ jsxDEV(ShieldCheck, { "aria-hidden": "true" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3272,
                columnNumber: 21
              }, this),
              " Разблокировать"
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3271,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("label", { children: [
              "Приватность",
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: telegramPrivacyModeDraft,
                  onChange: (event) => {
                    setTelegramPrivacyModeDraft(normalizedTelegramPrivacyMode2(event.target.value));
                    markTelegramSettingsDirty();
                  },
                  children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "no_phi_by_default", children: telegramPrivacyModeLabels2.no_phi_by_default }, void 0, false, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 3283,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "limited_admin_only", children: telegramPrivacyModeLabels2.limited_admin_only }, void 0, false, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 3284,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "consented_phi_templates", disabled: true, children: [
                      telegramPrivacyModeLabels2.consented_phi_templates,
                      " (после аудита)"
                    ] }, void 0, true, {
                      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                      lineNumber: 3285,
                      columnNumber: 23
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3276,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3274,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3130,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-feature-list", "aria-label": "Быстрые сценарии Telegram", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "onboarding-telegram-visual-cards", children: telegramVisualCardFields2.filter((field) => onboardingTelegramVisualCardKeys2.includes(field.key)).map(
              (field) => /* @__PURE__ */ jsxDEV("label", { children: [
                field.label,
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "url",
                    inputMode: "url",
                    placeholder: field.placeholder,
                    value: telegramVisualCardUrlDrafts[field.key] ?? "",
                    onChange: (event) => updateTelegramVisualCardUrlDraft(field.key, event.target.value)
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 3298,
                    columnNumber: 27
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("small", { children: [
                  field.help,
                  " Если поле пустое, используется картинка приветствия."
                ] }, void 0, true, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3305,
                  columnNumber: 27
                }, this)
              ] }, field.key, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3296,
                columnNumber: 17
              }, this)
            ) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3292,
              columnNumber: 19
            }, this),
            telegramFeatureOptions2.filter(
              (feature) => [
                "patient_linking",
                "appointment_reminders",
                "appointment_confirmation",
                "document_ready_notice",
                "tax_document_request",
                "payment_reminders",
                "post_visit_instructions",
                "recalls",
                "review_requests",
                "callback_requests",
                "secure_portal_links",
                "staff_task_alerts",
                "staff_daily_digest"
              ].includes(feature)
            ).map(
              (feature) => /* @__PURE__ */ jsxDEV("label", { className: telegramEnabledFeaturesDraft.includes(feature) ? "active" : "", children: [
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "checkbox",
                    checked: telegramEnabledFeaturesDraft.includes(feature),
                    onChange: () => toggleTelegramFeature(feature)
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 3329,
                    columnNumber: 25
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("span", { children: telegramFeatureLabel(feature) }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3334,
                  columnNumber: 25
                }, this)
              ] }, feature, true, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3328,
                columnNumber: 15
              }, this)
            )
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3291,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-inline-actions", children: [
            /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => void saveTelegramSettings(), disabled: isTelegramSettingsSaving, children: [
              /* @__PURE__ */ jsxDEV(ShieldCheck, { "aria-hidden": "true" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3340,
                columnNumber: 21
              }, this),
              " ",
              isTelegramSettingsSaving ? "Сохраняю" : "Сохранить Telegram"
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3339,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                className: "secondary-button",
                type: "button",
                onClick: () => {
                  setSettingsTab("telegram");
                  window.location.hash = "settings/telegram";
                },
                children: [
                  /* @__PURE__ */ jsxDEV(Bot, { "aria-hidden": "true" }, void 0, false, {
                    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                    lineNumber: 3350,
                    columnNumber: 21
                  }, this),
                  " Открыть полную панель"
                ]
              },
              void 0,
              true,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3342,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("span", { className: `telegram-save-state save-${telegramSettingsSaveState}`, children: telegramSettingsSaveState === "saving" ? "Автосохранение..." : telegramSettingsSaveState === "saved" ? "Telegram сохранен." : telegramSettingsSaveState === "error" ? telegramSettingsSaveError ?? "Telegram не сохранен." : telegramSettingsDirty ? "Изменения будут сохранены автоматически." : "Конфигурация Telegram сохранена." }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3352,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3338,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3104,
          columnNumber: 11
        }, this) : null,
        onboardingStep === "done" ? /* @__PURE__ */ jsxDEV("div", { className: "onboarding-panel", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: "Проверка перед работой" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3370,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: [
              "Профиль клиники: ",
              legalReadinessPercent,
              "%. Команда: ",
              dashboard.clinicSettings.staff.length,
              ". Кабинеты:",
              " ",
              dashboard.clinicSettings.chairs.length,
              ". Telegram: ",
              telegramStatus?.webhookReady ? "готов к отправке" : "нужна настройка отправки",
              ". Документы:",
              " ",
              documentFactoryGroups2.reduce((total, group) => total + group.kinds.length, 0),
              " шаблонов."
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3371,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3369,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "onboarding-readiness-grid", children: [
            /* @__PURE__ */ jsxDEV("span", { children: clinicModeLabels2[dashboard.clinicSettings.profile?.mode].title }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3378,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: staffRoleLabels2[selectedWorkspaceRole] }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3379,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: specialtyLabels2[selectedSpecialty] }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3380,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              telegramEnabledFeaturesDraft.length,
              " Telegram-сценариев включено"
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3381,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: onboardingDocumentsReady ? "документы готовы к выдаче" : "документы требуют реквизитов" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3382,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3377,
            columnNumber: 17
          }, this),
          !onboardingReadyToFinish ? /* @__PURE__ */ jsxDEV("p", { className: "onboarding-blocker", children: [
            "До завершения нужно заполнить: ",
            onboardingBlockingIssues.join(", "),
            "."
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3385,
            columnNumber: 13
          }, this) : null,
          !onboardingDocumentsReady ? /* @__PURE__ */ jsxDEV("p", { className: "onboarding-blocker onboarding-advisory", children: [
            "Первый рабочий экран можно открыть сейчас. Для договоров, актов и налоговых форм позже заполните:",
            " ",
            onboardingDocumentReadinessIssues.join(", "),
            "."
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3388,
            columnNumber: 13
          }, this) : null,
          onboardingTelegramRecommendations.length ? /* @__PURE__ */ jsxDEV("p", { className: "onboarding-blocker onboarding-advisory", children: [
            "Telegram можно включить позже: ",
            onboardingTelegramRecommendations.join(", "),
            "."
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3394,
            columnNumber: 13
          }, this) : null
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3368,
          columnNumber: 11
        }, this) : null,
        !onboardingReadyToFinish ? /* @__PURE__ */ jsxDEV("p", { className: "onboarding-blocker onboarding-action-guidance", id: onboardingFinishGuidanceId, role: "status", "aria-live": "polite", children: [
          "Чтобы завершить настройку, заполните: ",
          onboardingBlockingIssues.join(", "),
          "."
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3402,
          columnNumber: 11
        }, this) : null,
        /* @__PURE__ */ jsxDEV("div", { className: "onboarding-actions", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: "secondary-button",
              type: "button",
              onClick: dismissOnboarding,
              "aria-describedby": !onboardingReadyToFinish ? onboardingFinishGuidanceId : void 0,
              disabled: !onboardingReadyToFinish,
              children: "Скрыть"
            },
            void 0,
            false,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3408,
              columnNumber: 15
            },
            this
          ),
          !onboardingReadyToFinish ? /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => void continueOnboardingInDraftMode(), children: "Продолжить в черновике" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3418,
            columnNumber: 13
          }, this) : null,
          /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => void saveClinicProfileFromDraft(), disabled: clinicProfileSaveState === "saving", children: [
            /* @__PURE__ */ jsxDEV(ShieldCheck, { "aria-hidden": "true" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3423,
              columnNumber: 17
            }, this),
            " ",
            clinicProfileSaveState === "saving" ? "Сохраняю" : "Сохранить профиль"
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3422,
            columnNumber: 15
          }, this),
          previousOnboardingStep ? /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: () => void moveOnboardingTo(previousOnboardingStep.id), children: "Назад" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3426,
            columnNumber: 13
          }, this) : null,
          nextOnboardingStep ? /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: "primary-button",
              type: "button",
              onClick: () => void moveOnboardingTo(nextOnboardingStep.id),
              "aria-describedby": nextOnboardingStep.id === "done" && !onboardingReadyToFinish ? onboardingFinishGuidanceId : void 0,
              disabled: nextOnboardingStep.id === "done" && !onboardingReadyToFinish,
              children: [
                "Дальше ",
                /* @__PURE__ */ jsxDEV(ArrowRight, { "aria-hidden": "true" }, void 0, false, {
                  fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                  lineNumber: 3438,
                  columnNumber: 26
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3431,
              columnNumber: 13
            },
            this
          ) : /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: "primary-button",
              type: "button",
              onClick: dismissOnboarding,
              "aria-describedby": !onboardingReadyToFinish ? onboardingFinishGuidanceId : void 0,
              disabled: !onboardingReadyToFinish,
              children: "Завершить настройку"
            },
            void 0,
            false,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3441,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3407,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 2455,
        columnNumber: 9
      }, this) : null,
      onboardingDismissed && onboardingDraftMode && !onboardingReadyToFinish ? /* @__PURE__ */ jsxDEV("section", { className: "onboarding-draft-strip", "aria-label": "Первичная настройка в черновике", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Первичная настройка не завершена" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3458,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: [
            "Можно работать в черновике, но перед выдачей документов заполните: ",
            onboardingBlockingIssues.join(", "),
            "."
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3459,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3457,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "secondary-button", type: "button", onClick: reopenOnboarding, children: "Вернуться к настройке" }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3461,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 3456,
        columnNumber: 9
      }, this) : null,
      onboardingDismissed && onboardingReadyToFinish && !onboardingDocumentsReady ? /* @__PURE__ */ jsxDEV("section", { className: "onboarding-draft-strip", "aria-label": "Документы требуют реквизитов", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Документы требуют реквизитов" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3470,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: [
            "Для договоров, актов и налоговых форм заполните: ",
            onboardingDocumentReadinessIssues.join(", "),
            "."
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3471,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3469,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "secondary-button",
            type: "button",
            onClick: () => {
              setCurrentView("settings");
              setSettingsTab("clinic");
              window.location.hash = "settings/clinic";
            },
            children: "Заполнить реквизиты"
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3473,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 3468,
        columnNumber: 9
      }, this) : null,
      currentView === "shift" ? /* @__PURE__ */ jsxDEV(
        ShiftView,
        {
          activePatient,
          activePatientHasCallablePhone,
          activePatientCallablePhone,
          visibleRecommendedActions,
          recommendedActionPriorityLabels: recommendedActionPriorityLabels2,
          staffRoleLabels: staffRoleLabels2,
          selectedWorkspaceRole,
          activeRoleQueue,
          activeRolePolicy,
          activeRoleWritableSections,
          viewLabels: viewLabels2,
          activeRoleRestrictedSections,
          dashboard,
          activeQueueRole,
          shiftWarnings,
          warningSeverityLabels: warningSeverityLabels2,
          openScheduleWarning,
          setError,
          mostLoadedResource,
          setSelectedPatientId,
          activeDoctor
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3488,
          columnNumber: 9
        },
        this
      ) : null,
      ["shift", "patients"].includes(currentView) ? /* @__PURE__ */ jsxDEV(
        PatientCockpit,
        {
          activePatient,
          activePatientInsight,
          dashboard,
          activeCommunicationTasks,
          activeImagingStudies,
          activeUsableDocuments
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3514,
          columnNumber: 9
        },
        this
      ) : null,
      currentView === "imaging" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "imaging", label: viewLabels2.imaging, panelClassName: "panel imaging-panel", panelId: "imaging", children: /* @__PURE__ */ jsxDEV(
        Suspense,
        {
          fallback: /* @__PURE__ */ jsxDEV("div", { className: "panel imaging-panel", id: "imaging", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading", children: [
            /* @__PURE__ */ jsxDEV("h2", { children: "Снимки пациента" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3530,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3531,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3529,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3528,
            columnNumber: 13
          }, this),
          children: /* @__PURE__ */ jsxDEV(
            ImagingView,
            {
              CtPlanningToolsPanel,
              ExternalLink,
              FlipHorizontal,
              ImageIcon,
              Plus,
              RefreshCw,
              RotateCcw,
              RotateCw,
              ZoomIn,
              ZoomOut,
              activeAppointment,
              activeImagingStudies,
              activePatient,
              addImagingViewerNoteAnnotation,
              applyCtPlanningQuickAction,
              applyMprClinicalPreset,
              applyNearestMprClinicalPreset,
              canRetryImagingViewerSave,
              cbctWorkbenchPlanes,
              cbctWorkbenchProjections,
              cbctWorkbenchSeries,
              clampMprAxisDeg: clampMprAxisDeg2,
              clampMprSlabMm: clampMprSlabMm2,
              clampMprSliceIndex: clampMprSliceIndex2,
              createCtPlanningArtifact,
              createImagingStudy,
              ctPlanningActiveQuickActionId,
              ctPlanningAnnotationRefs,
              ctPlanningImplantPlan,
              currentView,
              defaultImagingViewerState: defaultImagingViewerState2,
              describeMprClinicalPresetProjectionFallback: describeMprClinicalPresetProjectionFallback2,
              dicomLabel: dicomLabel2,
              dicomQualityModeLabels: dicomQualityModeLabels2,
              dicomTextureStrategyLabels: dicomTextureStrategyLabels2,
              dicomViewerToolStateBundle,
              dicomViewerWorkbenchManifest,
              formatShortDate: formatShortDate2,
              formatSignedMprStep: formatSignedMprStep2,
              formatTime: formatTime2,
              handleMprKeyboardNavigation,
              handleBrowserDirectoryInputChange,
              browserDirectoryInputRef,
              attachBrowserDirectoryInputRef: browserDirectoryInputRef,
              browserImagingScanProgress,
              browserPickedImagingFolder,
              cancelBrowserImagingFolderScan,
              formatByteSize: formatByteSize2,
              isBrowserImagingFolderPicking,
              pickBrowserImagingFolder,
              imagingComparisonCandidates,
              imagingCreateSavingKind,
              imagingKindFilter,
              imagingKindLabels: imagingKindLabels2,
              imagingKindOptions,
              imagingPreviewSource,
              imagingSourceLabels: imagingSourceLabels2,
              imagingViewerActiveTool,
              imagingViewerAnnotations,
              imagingViewerHref,
              imagingViewerImageStyle,
              imagingViewerNote,
              imagingViewerNoteMissingId,
              imagingViewerNoteReady,
              imagingViewerRetryMissingId,
              imagingViewerSaveDetail,
              imagingViewerSaveState,
              imagingViewerSaveTitle,
              imagingViewerSessionReady,
              imagingViewerState,
              imagingViewerToolLabels: imagingViewerToolLabels2,
              isOnline,
              mprActiveProjectionLabel,
              mprActiveProjectionOrientation,
              mprAxisAngleBadge,
              mprAxisBounds: mprAxisBounds2,
              mprAxisDeg,
              mprAxisDirectionLabel,
              mprAxisGuidance,
              mprAxisNudgeDeg: mprAxisNudgeDeg2,
              mprAxisPresetDeg: mprAxisPresetDeg2,
              mprAxisRangeValue,
              mprAxisVisualizerLabel,
              mprAxisVisualizerStyle,
              mprClinicalChecklist,
              mprClinicalNextStep,
              mprClinicalPresetButtonClass,
              mprClinicalPresets: mprClinicalPresets2,
              mprControlsAutoOpen,
              mprControlsReady,
              mprCrosshairEnabled,
              mprLinkedPlanesEnabled,
              mprNearestClinicalPreset,
              mprOperatorSummaryCards,
              mprProjection,
              mprProjectionCompass,
              mprProjectionLabels: mprProjectionLabels2,
              mprSafeSliceIndex,
              mprSeriesRequiredProjectionLabel: mprSeriesRequiredProjectionLabel2,
              mprSlabBadge,
              mprSlabBounds: mprSlabBounds2,
              mprSlabMm,
              mprSlabNudgeMm: mprSlabNudgeMm2,
              mprSlabPresetMm: mprSlabPresetMm2,
              mprSlabRangeValue,
              mprSliceBadge,
              mprSliceIndexFromFraction: mprSliceIndexFromFraction2,
              mprSliceLabel,
              mprSliceMaxIndex,
              mprSliceNudgeSteps: mprSliceNudgeSteps2,
              mprSlicePresetFractions: mprSlicePresetFractions2,
              mprSliceRangeValue,
              mprUnavailableProjectionLabel: mprUnavailableProjectionLabel2,
              mprWindowPreset,
              mprWindowPresetLabels: mprWindowPresetLabels2,
              mprWorkbenchDraftRestored,
              mprWorkbenchLocalSavedAt,
              mprWorkbenchSummaryText,
              resetMprControls,
              restoreMprWorkbenchLocalDraft,
              retryImagingViewerSessionSave,
              selectCtPlanningImplant,
              selectedImagingStudy,
              selectedImagingViewerPlan,
              setCtPlanningActiveQuickActionId,
              setCtPlanningImplantPlan,
              setImagingKindFilter,
              setImagingViewerActiveTool,
              setImagingViewerNote,
              setImagingViewerState,
              setMprAxisDeg,
              setMprCrosshairEnabled,
              setMprLinkedPlanesEnabled,
              setMprProjection,
              setMprSlabMm,
              setMprSliceIndex,
              setMprWindowPreset,
              setSelectedImagingStudyId,
              visibleImagingStudies
            },
            void 0,
            false,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3536,
              columnNumber: 7
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3526,
          columnNumber: 5
        },
        this
      ) }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 3525,
        columnNumber: 9
      }, this) : null,
      ["schedule", "patients", "visit", "documents", "finance", "communications"].includes(currentView) ? /* @__PURE__ */ jsxDEV("section", { className: "work-grid page-grid", children: [
        currentView === "schedule" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "schedule", label: viewLabels2.schedule, panelClassName: "panel schedule-panel", panelId: "schedule", children: /* @__PURE__ */ jsxDEV(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsxDEV("div", { className: "panel schedule-panel", id: "schedule", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading", children: [
              /* @__PURE__ */ jsxDEV("h2", { children: "Расписание" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3691,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3692,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3690,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3689,
              columnNumber: 15
            }, this),
            children: /* @__PURE__ */ jsxDEV(
              ScheduleView,
              {
                appointmentLabels: appointmentLabels2,
                appointmentReadinessById,
                appointmentReadinessLabels: appointmentReadinessLabels2,
                appointmentScheduleDraftFromAppointment: appointmentScheduleDraftFromAppointment2,
                closeAppointmentEditor,
                createAppointmentFromDraft,
                dashboard,
                editingAppointmentId,
                formatTime: formatTime2,
                fromDateTimeLocalValue: fromDateTimeLocalValue2,
                lockScheduleAdminSession: () => lockTelegramAdminSession("schedule"),
                newAppointmentError,
                normalizedAppointmentStatus: normalizedAppointmentStatus2,
                normalizedAppointmentStatusFilter: normalizedAppointmentStatusFilter2,
                openAppointmentEditor,
                patientName: patientName2,
                recommendedActionPriorityLabels: recommendedActionPriorityLabels2,
                resetNewAppointmentDraft,
                saveAppointmentSchedule,
                shiftWarnings,
                sortedAppointments,
                staffRoleLabels: staffRoleLabels2,
                scheduleAdminSecretDraft,
                scheduleAdminSecretSession,
                toDateTimeLocalValue: toDateTimeLocalValue2,
                unlockScheduleAdminSession: () => unlockTelegramAdminSession("schedule"),
                updateAppointmentScheduleDraft,
                updateNewAppointmentDraft,
                visibleScheduleSuggestions
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3697,
                columnNumber: 15
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3687,
            columnNumber: 13
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3686,
          columnNumber: 11
        }, this) : null,
        currentView === "patients" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "patients", label: viewLabels2.patients, panelClassName: "panel patients-panel", panelId: "patients", children: /* @__PURE__ */ jsxDEV(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsxDEV("div", { className: "panel patients-panel", id: "patients", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading", children: [
              /* @__PURE__ */ jsxDEV("h2", { children: "Быстрый поиск" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3739,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3740,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3738,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3737,
              columnNumber: 15
            }, this),
            children: /* @__PURE__ */ jsxDEV(
              PatientsView,
              {
                createPatient,
                filteredPatients,
                money: money2,
                normalizeOptionalWorkingDaysDraft: normalizeOptionalWorkingDaysDraft2,
                patientAdministrativeProfileValidationMessage,
                patientInsightById,
                patientInsightRiskLabels: patientInsightRiskLabels2,
                query,
                savePatientAdministrativeProfile,
                savePatientCore,
                selectedPatient,
                setQuery,
                updatePatientAdministrativeProfileDraft,
                updatePatientCoreDraft,
                weekdayOptions: weekdayOptions2
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3745,
                columnNumber: 15
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3735,
            columnNumber: 13
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3734,
          columnNumber: 11
        }, this) : null,
        currentView === "visit" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "visit", label: viewLabels2.visit, panelClassName: "panel visit-panel", panelId: "visit", children: /* @__PURE__ */ jsxDEV(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsxDEV("div", { className: "panel visit-panel", id: "visit", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading", children: [
              /* @__PURE__ */ jsxDEV("h2", { children: "Текущий прием" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3773,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3774,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3772,
              columnNumber: 11
            }, this) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3771,
              columnNumber: 15
            }, this),
            children: /* @__PURE__ */ jsxDEV(
              VisitView,
              {
                AlertTriangle,
                Bot,
                Check,
                CheckCircle2,
                ClinicalRulePanel,
                ClipboardCheck,
                Mic,
                Sparkles,
                acceptDraftToVisit,
                activeAppointment,
                activeChair,
                activeDoctor,
                activeImagingStudies,
                activePatient,
                activePatientInsight,
                activeUsableDocuments,
                activeVisitClinicalRuleEvaluations,
                activeVisitClinicalRuleSummary,
                appendToTranscript,
                applyProtocolTemplate,
                buildDraft,
                buildOfflineDraft,
                clearTranscriptWithUndo,
                clearedTranscriptSnapshot,
                clinicalRuleActionLabels: clinicalRuleActionLabels2,
                clinicalRuleSeverityLabels: clinicalRuleSeverityLabels2,
                dashboard,
                dictationQuickPhrases,
                draft,
                emptyDictationVoiceActionLabel,
                flushPendingSpeechChunks,
                flushPendingVisitSaves,
                formatTime: formatTime2,
                hasVisitTranscriptText,
                imagingKindLabels: imagingKindLabels2,
                isDraftAccepting,
                isDraftLoading,
                isOnline,
                isPendingVisitSyncing,
                isServerVoiceRecording,
                isTranscriptPolishing,
                isVisitDictating,
                isVisitNoteDirty,
                lastLocalSavedAt,
                lastPendingVisitSaveAt,
                lastServerDraftSavedAt,
                lastVisitSaveReceipt,
                localDraftWasRestored,
                openVisitWarningAction,
                pendingSpeechChunkCount,
                pendingSpeechFlushActionLabel,
                pendingSpeechFlushActionTitle,
                pendingVisitSaveCount,
                polishTranscript,
                polishingField,
                polishSingleField,
                primaryVisitWarning,
                scrollToVisitArea,
                selectedProtocolTemplate,
                selectedSpecialty,
                serverDraftSyncState,
                serviceTitle,
                setClearedTranscriptSnapshot,
                setSelectedProtocolId,
                setSelectedSpecialty,
                setTranscript,
                specialtiesWithTemplates,
                specialtyLabels: specialtyLabels2,
                specialtyProtocolTemplates,
                speechGatewayActiveProviderIsLocal,
                speechGatewayStatus,
                speechRecognitionReady,
                speechStatusNote,
                speechTranscriptionBusy,
                staffRoleLabels: staffRoleLabels2,
                startServerVoiceRecording,
                startVisitDictation,
                stopServerVoiceRecording,
                toothRows: toothRows2,
                toothStateByCode: toothStateByCode2,
                setToothState,
                transcript,
                undoTranscriptClear,
                updateVisitNoteField,
                visibleVisitSpecialtyFocusOptions,
                visitCloseChecklist,
                visitDraftBuildMissingSteps,
                visitDraftMissingFieldLabel: visitDraftMissingFieldLabel2,
                visitDraftQualityLabels: visitDraftQualityLabels2,
                visitDraftReadyToBuild,
                visitDraftSignalLabel: visitDraftSignalLabel2,
                visitDraftUserEditedRef,
                visitNoteAcceptMissingSteps,
                visitNoteActionLabel,
                visitNoteFieldDefinitions: visitNoteFieldDefinitions2,
                visitNoteForm,
                visitNoteReadyToAccept,
                visitNoteStatusLabel,
                visitPrimaryAction,
                visitSafetyCards,
                visitSaveReceiptText: visitSaveReceiptText2,
                visitWarnings,
                visitWorkflowSteps,
                selectedWorkspaceRole
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3779,
                columnNumber: 7
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3769,
            columnNumber: 5
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3768,
          columnNumber: 11
        }, this) : null,
        currentView === "documents" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "documents", label: viewLabels2.documents, panelClassName: "panel documents-panel", panelId: "documents", children: /* @__PURE__ */ jsxDEV(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsxDEV("div", { className: "panel documents-panel", id: "documents", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading", children: [
              /* @__PURE__ */ jsxDEV("h2", { children: "Документы и согласия" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3895,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3896,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3894,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 3893,
              columnNumber: 15
            }, this),
            children: /* @__PURE__ */ jsxDEV(
              DocumentsView,
              {
                activeAppointment,
                activeDoctor,
                activeDocuments,
                activeIssuedPaidContracts,
                activePatient,
                activeUsableDocuments,
                applyPostVisitCarePreset,
                changePostVisitCareTopic,
                clinicProfileDraft,
                compactDocumentText,
                completedActContractReferenceForUi: completedActContractReferenceForUi2,
                completedActFiscalReceiptLines,
                completedActPaidRubValue,
                confirmDocumentIssue,
                confirmDocumentVoid,
                createDocument,
                dashboard,
                documentActionLabels: documentActionLabels2,
                documentIssueAttestationReady,
                documentIssueConfirmation,
                documentIssueSignatureModeLabels: documentIssueSignatureModeLabels2,
                documentLabels: documentLabels2,
                documentPatient,
                documentSourceStatusClassNames: documentSourceStatusClassNames2,
                documentStatusLabels: documentStatusLabels2,
                documentVoidConfirmation,
                documentVoidReady,
                documentVoidReasonLabels: documentVoidReasonLabels2,
                downloadIssuedDocumentHtml,
                downloadIssuedDocumentPdf,
                downloadTaxDocumentXml,
                eligiblePaymentReceiptPayments,
                eligibleRefundCorrectionPayments,
                eligibleTaxPayments,
                formatDateTime: formatDateTime2,
                formatShortDate: formatShortDate2,
                inferredTreatmentArea,
                installmentScheduleBaseDocumentTitleValue,
                installmentScheduleInstallmentRows,
                installmentSchedulePrepaidRubValue,
                installmentScheduleRemainingRubValue,
                installmentScheduleTotalRubValue,
                issuedMedicalCopyRequestDocuments,
                loadDocumentAuditFacts,
                markPostVisitManualEdited,
                medicalDocumentReleaseChannelLabels: medicalDocumentReleaseChannelLabels2,
                minorConsentDiagnosisOrIndicationValue,
                minorConsentInterventionScopeValue,
                minorConsentPatientBirthDateValue,
                minorConsentPatientFullNameValue,
                minorRepresentativeFullNameValue,
                minorRepresentativeIdentityDocumentValue,
                minorRepresentativePhoneValue,
                minorRepresentativeRelationshipValue,
                money: money2,
                normalizedDocumentIssueSignatureMode: normalizedDocumentIssueSignatureMode2,
                normalizedDocumentKind: normalizedDocumentKind2,
                normalizedDocumentVoidReasonCode: normalizedDocumentVoidReasonCode2,
                normalizedMedicalDocumentReleaseChannel: normalizedMedicalDocumentReleaseChannel2,
                normalizedOutpatient025uDemographicCode: normalizedOutpatient025uDemographicCode2,
                normalizedPatientIntakePregnancyStatus: normalizedPatientIntakePregnancyStatus2,
                normalizedPaymentRefundCorrectionAction: normalizedPaymentRefundCorrectionAction2,
                normalizedPaymentRefundCorrectionMethod: normalizedPaymentRefundCorrectionMethod2,
                normalizedPostVisitCareTopic: normalizedPostVisitCareTopic2,
                normalizedProcedureSpecificConsentProcedure: normalizedProcedureSpecificConsentProcedure2,
                normalizedTaxApplicationDeliveryChannel: normalizedTaxApplicationDeliveryChannel2,
                normalizedTaxApplicationForm: normalizedTaxApplicationForm2,
                normalizedTaxApplicationRelationshipSelect: normalizedTaxApplicationRelationshipSelect2,
                normalizedTreatmentPlanAcceptanceVariant: normalizedTreatmentPlanAcceptanceVariant2,
                normalizedXrayPregnancyStatus: normalizedXrayPregnancyStatus2,
                normalizedXrayPriority: normalizedXrayPriority2,
                normalizedXrayStudyType: normalizedXrayStudyType2,
                openIssuedDocumentHtml,
                outpatient025uMedicalCardNumberValue,
                paidContractTotalRubValue,
                patientIntakePregnancyStatusOptions: patientIntakePregnancyStatusOptions2,
                patientName: patientName2,
                paymentFiscalReceiptLabelForUi: paymentFiscalReceiptLabelForUi2,
                paymentInvoiceTotalRubValue,
                paymentReceiptFiscalReceiptLines,
                paymentReceiptIssuedByValue,
                paymentReceiptPayerBirthDateValue,
                paymentReceiptPayerFullNameValue,
                paymentReceiptPayerIdentityDocumentValue,
                paymentReceiptPayerInnValue,
                paymentReceiptPayerRelationshipValue,
                photoVideoMaterialOptions: photoVideoMaterialOptions2,
                plannedServiceLinesForFinancialPayload,
                postVisitCareTopicOptions: postVisitCareTopicOptions2,
                procedureSpecificConsentProcedureOptions: procedureSpecificConsentProcedureOptions2,
                releaseProtectionNote,
                renderClinicalToothRowsEditor,
                requestDocumentIssue,
                requestDocumentVoid,
                selectAllEligibleTaxPaymentsForCurrentDocument,
                selectedCompletedActContractDocumentId,
                selectedDocumentMetadata,
                selectedDocumentUsesTaxPaymentSelection,
                selectedEligibleTaxPayments,
                selectedPaymentReceiptIdSet,
                selectedPaymentReceiptPayments,
                selectedPaymentReceiptTotalRub,
                selectedRefundCorrectionPayment,
                selectedReleaseSourceRequestDocumentId,
                selectedTaxDocumentPayerKey,
                selectedTaxPaymentIdSet,
                selectedTaxPaymentTotalRub,
                selectRefundOriginalPayment,
                setReleaseProtectionNote,
                structuredPayloadDocumentKinds: structuredPayloadDocumentKinds2,
                taxApplicationDeliveryChannelOptions: taxApplicationDeliveryChannelOptions2,
                taxApplicationFormOptions: taxApplicationFormOptions2,
                taxApplicationRelationshipOptions: taxApplicationRelationshipOptions2,
                taxDocumentPayerOptions,
                togglePhotoVideoMaterial,
                treatmentAcceptancePlannedTotalRub,
                treatmentEstimatePatientOrPayerFullNameValue,
                treatmentEstimateTotalRubValue,
                treatmentEstimateTreatmentBasisValue,
                warrantyLinkedActOrContractValue,
                warrantyServiceOrWorkNameValue,
                warrantyTeethOrAreaValue,
                xrayPregnancyStatusOptions: xrayPregnancyStatusOptions2,
                xrayStudyTypeOptions: xrayStudyTypeOptions2
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 3901,
                columnNumber: 15
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 3891,
            columnNumber: 13
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 3890,
          columnNumber: 11
        }, this) : null,
        currentView === "finance" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "finance", label: viewLabels2.finance, panelClassName: "panel finance-panel", panelId: "finance", children: /* @__PURE__ */ jsxDEV(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsxDEV("div", { className: "panel finance-panel", id: "finance", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading", children: [
              /* @__PURE__ */ jsxDEV("h2", { children: "Оплаты, план лечения и вычет" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 4037,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 4038,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 4036,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 4035,
              columnNumber: 15
            }, this),
            children: /* @__PURE__ */ jsxDEV(
              FinanceView,
              {
                activePayments,
                activeTreatmentPlanItems,
                activeTreatmentPlanScenarios,
                billingSummary: patientBillingSummary,
                clinicalRuleEvaluations: patientClinicalRuleEvaluations,
                clinicalRuleActionLabels: clinicalRuleActionLabels2,
                clinicalRuleSeverityLabels: clinicalRuleSeverityLabels2,
                clinicalRuleSummary: patientClinicalRuleSummary,
                dashboard,
                documentPatient,
                formatDateTime: formatDateTime2,
                isPaymentSaving,
                money: money2,
                onGoToDocuments: () => {
                  window.location.hash = "documents";
                },
                onGoToPrices: () => {
                  setSettingsTab("prices");
                  window.location.hash = "settings/prices";
                },
                onGoToVisit: () => {
                  window.location.hash = "visit";
                },
                onRecordPayment: recordPayment,
                paymentAmount,
                paymentFeedback,
                paymentFiscalCashierName,
                paymentFiscalFd,
                paymentFiscalFn,
                paymentFiscalFpd,
                paymentFiscalReceiptIssuedAt,
                paymentFiscalReceiptLabel: paymentFiscalReceiptLabelForUi2,
                paymentFiscalReceiptNumber,
                paymentFiscalReceiptUrl,
                paymentMethod,
                paymentMethodLabels: paymentMethodLabels2,
                paymentPatientContextMessage,
                paymentPatientContextReady,
                paymentPayerBirthDate,
                paymentPayerFullName,
                paymentPayerIdentityDocument,
                paymentPayerInn,
                paymentPayerRelationship,
                paymentTaxDeductionCode,
                scenarioPriorityLabels: scenarioPriorityLabels2,
                scenarioStrategyLabels: scenarioStrategyLabels2,
                serviceCategoryLabels: serviceCategoryLabels2,
                serviceTitle,
                setPaymentAmount,
                setPaymentFiscalCashierName,
                setPaymentFiscalFd,
                setPaymentFiscalFn,
                setPaymentFiscalFpd,
                setPaymentFiscalReceiptIssuedAt,
                setPaymentFiscalReceiptNumber,
                setPaymentFiscalReceiptUrl,
                setPaymentMethod,
                setPaymentPayerBirthDate,
                setPaymentPayerFullName,
                setPaymentPayerIdentityDocument,
                setPaymentPayerInn,
                setPaymentPayerRelationship,
                setPaymentTaxDeductionCode,
                staffRoleLabels: staffRoleLabels2,
                treatmentStatusLabels: treatmentStatusLabels2
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 4043,
                columnNumber: 15
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 4033,
            columnNumber: 13
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 4032,
          columnNumber: 11
        }, this) : null,
        currentView === "communications" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "communications", label: viewLabels2.communications, panelClassName: "panel communications-panel", panelId: "communications", children: /* @__PURE__ */ jsxDEV(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsxDEV("div", { className: "panel communications-panel", id: "communications", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading", children: [
              /* @__PURE__ */ jsxDEV("h2", { children: "Связь с пациентами" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 4120,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 4121,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 4119,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 4118,
              columnNumber: 15
            }, this),
            children: /* @__PURE__ */ jsxDEV(
              CommunicationsView,
              {
                communicationChannelLabels: communicationChannelLabels2,
                communicationDocumentTaskActionLabels: communicationDocumentTaskActionLabels2,
                communicationIntentLabels: communicationIntentLabels2,
                communicationNote,
                communicationPriorityLabels: communicationPriorityLabels2,
                communicationStatusLabels: communicationStatusLabels2,
                completeCommunicationTask,
                dashboard,
                documentKindsForCommunicationTask,
                documentLabels: documentLabels2,
                formatDateTime: formatDateTime2,
                communicationSavingTaskId,
                onCommunicationNoteChange: setCommunicationNote,
                onGoToSchedule: () => {
                  window.location.hash = "schedule";
                },
                openCommunicationTaskDocumentWorkflow,
                sortedCommunicationTasks,
                staffRoleLabels: staffRoleLabels2
              },
              void 0,
              false,
              {
                fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
                lineNumber: 4126,
                columnNumber: 15
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 4116,
            columnNumber: 13
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 4115,
          columnNumber: 11
        }, this) : null
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 3684,
        columnNumber: 9
      }, this) : null,
      ["documents", "finance", "communications", "settings"].includes(currentView) ? /* @__PURE__ */ jsxDEV("details", { className: "compliance-bar", "aria-label": "Контроль", children: [
        /* @__PURE__ */ jsxDEV("summary", { children: [
          /* @__PURE__ */ jsxDEV(ShieldCheck, { "aria-hidden": "true" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 4156,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "Служебные ограничения" }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 4157,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 4155,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: dashboard.complianceWarnings.map(
          (warning) => /* @__PURE__ */ jsxDEV("p", { children: warning }, warning, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 4161,
            columnNumber: 13
          }, this)
        ) }, void 0, false, {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 4159,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 4154,
        columnNumber: 9
      }, this) : null,
      currentView === "settings" ? /* @__PURE__ */ jsxDEV(WorkspaceRouteErrorBoundary, { view: "settings", label: viewLabels2.settings, panelClassName: "settings-zone", panelId: "settings", children: /* @__PURE__ */ jsxDEV(
        Suspense,
        {
          fallback: /* @__PURE__ */ jsxDEV("section", { className: "settings-zone", id: "settings", "aria-busy": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "panel-heading settings-heading", children: [
            /* @__PURE__ */ jsxDEV("h2", { children: "Настройки" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 4173,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "status-pill status-planned", children: "загрузка" }, void 0, false, {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 4174,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 4172,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
            lineNumber: 4171,
            columnNumber: 13
          }, this),
          children: /* @__PURE__ */ jsxDEV(
            SettingsView,
            {
              activeStaffUser,
              activePatient,
              activeSettingsTabButtonRef,
              activeSpeechProviderHealth,
              activeWorkspaceProfile,
              addChair,
              addStaffMember,
              analyzePricelist,
              applyProtocolTemplate,
              attachPricelistImage,
              browserCanRequestPersistentStorage,
              browserContinuity,
              browserContinuityChecks,
              browserContinuityState,
              browserContinuityValue,
              browserDirectoryInputRef,
              browserDirectoryPickerAvailable,
              browserImagingScanProgress,
              browserMigrationDiscovery,
              browserMigrationScanProgress,
              browserMigrationInputRef,
              browserPickedImagingFolder,
              buildDicomFolderWorkupPlan,
              buildDicomRenderCachePlan,
              buildDicomViewerLaunchManifest,
              buildDicomViewerToolStateBundle,
              buildDicomViewerWorkbenchManifest,
              cbctWorkbenchPlanes,
              cbctWorkbenchProjections,
              cbctWorkbenchSeries,
              cbctWorkbenchTools,
              changeClinicMode,
              checkDicomWebConnector,
              checkDicomWorkstationReadiness,
              chooseRecognitionPreset,
              cancelBrowserImagingFolderScan,
              cancelBrowserMigrationScan,
              clearBrowserPickedImagingFolderPreview,
              clearDicomWorkbenchRecovery,
              clearLocalImagingFolderRecovery,
              clearPricelistImage,
              clinicalRuleActionLabels: clinicalRuleActionLabels2,
              clinicalRuleSeverityLabels: clinicalRuleSeverityLabels2,
              clinicModeLabels: clinicModeLabels2,
              clinicProfileDraft,
              clinicProfileSaveState,
              commitImagingImport,
              commitImport,
              commitSmartImport,
              copyTelegramTextToClipboard,
              createClinicalRuleFromSettings,
              createTelegramLinkCode,
              dashboard,
              defaultDicomFirstFrameViewerState: defaultDicomFirstFrameViewerState2,
              dentalMaterialKindLabels: dentalMaterialKindLabels2,
              dentalRestorationTypeLabels: dentalRestorationTypeLabels2,
              dicomFirstFrameImageStyle,
              dicomFirstFramePreview,
              dicomFirstFrameStatusLabels: dicomFirstFrameStatusLabels2,
              dicomFirstFrameViewerState,
              dicomFolderSeriesScan,
              dicomFolderWorkupPathLabels: dicomFolderWorkupPathLabels2,
              dicomFolderWorkupPlan,
              dicomDiagnosticPixelPolicyLabels: dicomDiagnosticPixelPolicyLabels2,
              dicomExecutionLaneLabels: dicomExecutionLaneLabels2,
              dicomGpuClassLabels: dicomGpuClassLabels2,
              dicomLabel: dicomLabel2,
              dicomLocalFolderDiscovery,
              dicomQualityModeLabels: dicomQualityModeLabels2,
              dicomReadinessCheckLabels: dicomReadinessCheckLabels2,
              dicomRenderMemoryBudgetClassLabels: dicomRenderMemoryBudgetClassLabels2,
              dicomRenderCachePlan,
              dicomRuntimeTierLabels: dicomRuntimeTierLabels2,
              dicomSeriesPreview,
              dicomSeriesViewerLabels: dicomSeriesViewerLabels2,
              dicomTextureStrategyLabels: dicomTextureStrategyLabels2,
              dicomViewerLaunchManifest,
              dicomViewerLaunchModeLabels: dicomViewerLaunchModeLabels2,
              dicomViewerToolStateBundle,
              dicomViewerWorkbenchManifest,
              dicomWebCheck,
              dicomWebEndpointUrl,
              dicomWebStatusLabels: dicomWebStatusLabels2,
              dicomWorkbenchLocalSavedAt,
              dicomWorkbenchServerBundle,
              dicomWorkbenchSourceIsRedacted,
              dicomWorkstationReadiness,
              discoverMigrationSources,
              discoverDicomFolders,
              documentDetectedKindLabel: documentDetectedKindLabel2,
              documentIngestion,
              documentIngestionQualityLabels: documentIngestionQualityLabels2,
              documentIngestionTarget,
              documentLabels: documentLabels2,
              downloadDicomViewerToolStateBundle,
              downloadDicomWorkbenchManifest,
              downloadMigrationHandoffReport,
              downloadPersistenceExport,
              downloadSmartImportSafeHandoffReport,
              downloadSmartImportReport,
              downloadTelegramQrSvg,
              filteredTelegramOutboxItems,
              formatByteSize: formatByteSize2,
              formatDateTime: formatDateTime2,
              formatMegabytes: formatMegabytes2,
              formatTime: formatTime2,
              handleBrowserDirectoryInputChange,
              handleBrowserMigrationInputChange,
              hiddenTelegramOutboxItemCount,
              imagingConnectorCards: imagingConnectorCards2,
              imagingFolderPath,
              imagingFolderScan,
              imagingImportCommit,
              imagingImportPreview,
              imagingImportSourceKind,
              imagingImportText,
              imagingKindLabels: imagingKindLabels2,
              ctPlanningImplantPlan,
              ctPlanningActiveQuickActionId,
              imagingViewerActiveTool,
              imagingSourceChoices: imagingSourceChoices2,
              imagingSourceDetails: imagingSourceDetails2,
              imagingSourceLabels: imagingSourceLabels2,
              imagingViewerCapabilities: imagingViewerCapabilities2,
              importCommit,
              importIntake,
              importPreview,
              importSourceKind,
              importSourceLabels: importSourceLabels2,
              importText,
              ingestImportFile,
              ingestionTargetLabels: ingestionTargetLabels2,
              integrationCapabilityLabels: integrationCapabilityLabels2,
              integrationCategoryLabels: integrationCategoryLabels2,
              integrationStatusLabels: integrationStatusLabels2,
              isBrowserImagingFolderPicking,
              isBrowserMigrationScanning,
              isClinicalRuleSaving,
              isDicomFirstFramePreviewing,
              isDicomFolderWorkupPlanning,
              isDicomLocalDiscovering,
              isDicomManifestBuilding,
              isDicomRenderCachePlanning,
              isDicomSeriesPreviewLoading,
              isDicomToolStateBuilding,
              isDicomWebChecking,
              isDicomWorkbenchBuilding,
              isDicomWorkbenchReconnecting,
              isDicomWorkbenchServerSaving,
              isDicomWorkstationChecking,
              isClinicPublicLookupLoading,
              isImagingFolderScanning,
              isLocalDicomOperationActive,
              isImagingImportCommitting,
              isImagingImportLoading,
              isImportCommitting,
              isImportDictating,
              isImportLoading,
              isLocalImagingOrganizing,
              isMigrationAutopilotLoading,
              isMigrationHandoffReportLoading,
              isMigrationSourceDiscovering,
              isMigrationSourceProbeLoading,
              isMigrationSourceWorkupLoading,
              isPersistenceExporting,
              isPricelistAnalyzing,
              isRecognitionLoading,
              isSmartImportCommitting,
              isSmartImportLoading,
              isSmartReportLoading,
              isSmartSafeReportLoading,
              isTelegramChatLinksLoadingMore,
              isTelegramLinkCodesLoadingMore,
              isTelegramLinkCreating,
              isTelegramLoading,
              isTelegramOutboxItemDueForUi: isTelegramOutboxItemDueForUi2,
              isTelegramOutboxLoadingMore,
              isTelegramSendingDue,
              isTelegramSettingsSaving,
              latestDicomWorkbenchServerBundle,
              legalMissingFields,
              legalReadinessPercent,
              loadLocalBridgeUsePlans,
              loadMoreTelegramChatLinks,
              loadMoreTelegramLinkCodes,
              loadMoreTelegramOutbox,
              loadPersistenceHealth,
              loadPersistenceIntegrity,
              loadTelegramControlPlane,
              localBridgeReadiness,
              localBridgeStatusLabels: localBridgeStatusLabels2,
              localBridgeStatusState,
              localBridgeStatusValue,
              localBridgeUsePathLabels: localBridgeUsePathLabels2,
              localBridgeUsePlans,
              localImagingFolderDraft,
              localImagingModelRoleLabels: localImagingModelRoleLabels2,
              localImagingOrganizer,
              localImagingOrganizerActionLabels: localImagingOrganizerActionLabels2,
              cancelLocalDicomOperation,
              lookupClinicPublicProfile,
              lockTelegramAdminSession: () => lockTelegramAdminSession(settingsAdminSecretDomain),
              markTelegramSettingsDirty,
              migrationAutopilot,
              migrationSourceDiscovery,
              migrationSourceProbe,
              migrationSourceWorkup,
              mprAxisDeg,
              mprCacheModeLabels: mprCacheModeLabels2,
              mprCrosshairEnabled,
              mprLinkedPlanesEnabled,
              mprLoadStrategyLabels: mprLoadStrategyLabels2,
              mprProjection,
              mprProjectionLabels: mprProjectionLabels2,
              mprResourceTierLabels: mprResourceTierLabels2,
              mprSliceIndex,
              mprSlabMm,
              mprToolLabels: mprToolLabels2,
              mprWorkbenchDraftRestored,
              mprWorkbenchLocalSavedAt,
              mprWindowPreset,
              mprWindowPresetLabels: mprWindowPresetLabels2,
              newChairHasMicroscope,
              newChairHasSurgeryKit,
              newChairHasXraySensor,
              newChairName,
              newRuleAction,
              newRuleBlockedServiceId,
              newRuleCategory,
              newRuleCompletedServiceId,
              newRuleOwnerRole,
              newRuleRequiredServiceId,
              newRuleSeverity,
              newRuleSpecialty,
              newRuleTitle,
              newRuleTriggerServiceId,
              newRuleWarningText,
              newStaffName,
              newStaffRole,
              newStaffSpecialty,
              normalizedClinicalRuleAction: normalizedClinicalRuleAction2,
              normalizedClinicalRuleSeverity: normalizedClinicalRuleSeverity2,
              normalizedDentalSpecialty: normalizedDentalSpecialty2,
              normalizedServiceCategory: normalizedServiceCategory2,
              normalizedStaffRole: normalizedStaffRole2,
              normalizedTelegramBotMode: normalizedTelegramBotMode2,
              normalizedTelegramLinkSubjectType: normalizedTelegramLinkSubjectType2,
              normalizedTelegramOutboxStatusFilter: normalizedTelegramOutboxStatusFilter2,
              normalizedTelegramOutboxTemplateFilter: normalizedTelegramOutboxTemplateFilter2,
              normalizedTelegramPrivacyMode: normalizedTelegramPrivacyMode2,
              normalizeUiLanguageInput: normalizeUiLanguageInput2,
              ohifBaseUrl,
              organizeLocalImagingSources,
              persistenceHealth,
              persistenceIntegrity,
              pickBrowserImagingFolder,
              pickBrowserMigrationSource,
              policyAuditEventLabels: policyAuditEventLabels2,
              prepareDicomWorkbenchFromFolder,
              previewDicomFirstFrame,
              previewDicomFirstFrameSlice,
              previewDicomSeries,
              planMigrationDiscoveryCandidate,
              previewMigrationDiscoveryCandidate,
              previewMigrationAutopilotSources,
              probeMigrationDiscoveryCandidate,
              runMigrationAutopilot,
              previewImagingImport,
              previewImport,
              previewSmartImport,
              previewTelegramTemplate,
              pricelistAnalysis,
              pricelistImageBase64,
              pricelistImageName,
              pricelistImageNote,
              pricelistItemMaterialText: pricelistItemMaterialText2,
              pricelistMaterialSummaryText: pricelistMaterialSummaryText2,
              pricelistWarningsText: pricelistWarningsText2,
              pricelistParserModeLabels: pricelistParserModeLabels2,
              pricelistRecognitionBrandGroups: pricelistRecognitionBrandGroups2,
              pricelistRecognitionServiceGroups: pricelistRecognitionServiceGroups2,
              pricelistSourceKind,
              pricelistSourceKindLabels: pricelistSourceKindLabels2,
              pricelistText,
              recognitionJob,
              recognitionKind,
              recognitionPresets: recognitionPresets2,
              recognitionTarget,
              recognitionTargetLabels: recognitionTargetLabels2,
              recognitionText,
              reconnectDicomWorkbenchFromCurrentFolder,
              refreshBrowserContinuity,
              refreshSpeechRuntime,
              clinicPublicLookup,
              addMigrationDiscoveryCandidateToSmartImport,
              rememberLocalImagingFolder,
              reopenOnboarding,
              requestBrowserStoragePersistence,
              restoreDicomWorkbenchServerBundle,
              restoreMprWorkbenchLocalDraft,
              revokeTelegramChatLink,
              runRecognitionJob,
              saveChairSchedule,
              saveClinicProfileFromDraft,
              saveDicomWorkbenchBundleToServer,
              saveStaffSchedule,
              saveTelegramSettings,
              scanDicomFolderSeries,
              scanImagingFolder,
              selectedUiLanguageOption,
              sendDueTelegramOutbox,
              sendRecognitionResultToImport,
              sendTelegramOutboxItem,
              serviceCategoryLabels: serviceCategoryLabels2,
              serviceTitle,
              setDicomFirstFramePreview,
              setDicomFirstFrameViewerState,
              setDicomFolderSeriesScan,
              setDicomFolderWorkupPlan,
              setDicomLocalFolderDiscovery,
              setDicomRenderCachePlan,
              setDicomSeriesPreview,
              setDicomViewerLaunchManifest,
              setDicomViewerToolStateBundle,
              setDicomViewerWorkbenchManifest,
              setDicomWebCheck,
              setDicomWebEndpointUrl,
              setDicomWorkbenchLocalSavedAt,
              setDicomWorkstationReadiness,
              setDocumentIngestionTarget,
              setImagingFolderPath,
              setImagingFolderScan,
              setImagingImportCommit,
              setImagingImportPreview,
              setImagingImportSourceKind,
              setImagingImportText,
              selectCtPlanningImplant,
              setImagingViewerActiveTool,
              setCtPlanningActiveQuickActionId,
              setImportCommit,
              setImportIntake,
              setImportPreview,
              setImportSourceKind,
              setImportText,
              setLocalImagingOrganizer,
              setMprAxisDeg,
              setMprCrosshairEnabled,
              setMprLinkedPlanesEnabled,
              setMprProjection,
              setMprSliceIndex,
              setMprSlabMm,
              setMprWindowPreset,
              setNewChairHasMicroscope,
              setNewChairHasSurgeryKit,
              setNewChairHasXraySensor,
              setNewChairName,
              setNewRuleAction,
              setNewRuleBlockedServiceId,
              setNewRuleCategory,
              setNewRuleCompletedServiceId,
              setNewRuleOwnerRole,
              setNewRuleRequiredServiceId,
              setNewRuleSeverity,
              setNewRuleSpecialty,
              setNewRuleTitle,
              setNewRuleTriggerServiceId,
              setNewRuleWarningText,
              setNewStaffName,
              setNewStaffRole,
              setNewStaffSpecialty,
              setOhifBaseUrl,
              setPricelistAnalysis,
              setPricelistSourceKind,
              setPricelistText,
              setRecognitionJob,
              setRecognitionText,
              setSettingsTab,
              setSmartImportCommit,
              setSmartImportMode,
              setSmartImportPreview,
              setSmartImportText,
              setTelegramAdminSecretDraft: settingsAdminSecretDomain === "telegram" ? setTelegramAdminSecretDraft : setSettingsAdminSecretDraft,
              settingsTab,
              settingsTabs: settingsTabs2,
              setUiLanguage,
              setUsePricelistAi,
              smartImportCommit,
              smartImportMode,
              smartImportModeLabels: smartImportModeLabels2,
              smartImportPreview,
              smartImportText,
              specialtyLabels: specialtyLabels2,
              speechGatewayCanUpload: speechGatewayCanUpload2,
              speechGatewayHealthReport,
              speechGatewayStatus,
              speechProviderConnectorLabels: speechProviderConnectorLabels2,
              speechProviderHealthById,
              speechProviderHealthLabels: speechProviderHealthLabels2,
              speechProviderModeLabels: speechProviderModeLabels2,
              speechProviderRuntimeById,
              speechProviderSelectionLabels: speechProviderSelectionLabels2,
              speechProviderStatusLabels: speechProviderStatusLabels2,
              speechRecordingPathLabels: speechRecordingPathLabels2,
              speechRecordingRecovery,
              speechRecordingStrategy,
              speechRecoveryStateLabels: speechRecoveryStateLabels2,
              staffRoleLabels: staffRoleLabels2,
              staffScheduleDraftFromWorkingHours: staffScheduleDraftFromWorkingHours2,
              stageLocalImagingFolderRecovery,
              startImportDictation,
              telegramAdminSecretDraft: settingsAdminSecretDomain === "telegram" ? telegramAdminSecretDraft : settingsAdminSecretDraft,
              telegramAdminSecretSession: settingsAdminSecretDomain === "telegram" ? telegramAdminSecretSession : settingsAdminSecretSession,
              telegramAllowVoiceIntakeDraft,
              telegramBotConfigId,
              telegramBotUsernameDraft,
              telegramChatLinkLedger,
              telegramChatLinks,
              telegramClassificationLabels: telegramClassificationLabels2,
              telegramDeliveryStatusLabels: telegramDeliveryStatusLabels2,
              telegramEnabledFeaturesDraft,
              telegramFeatureHelp: telegramFeatureHelp2,
              telegramFeatureLabel,
              telegramFeatureOptions: telegramFeatureOptions2,
              telegramFeaturePlan,
              telegramHumanMessage: telegramHumanMessage2,
              telegramInlineButtonKindLabels: telegramInlineButtonKindLabels2,
              telegramInlineButtonRowsFromReplyMarkup: telegramInlineButtonRowsFromReplyMarkup2,
              telegramLinkActionState,
              telegramLinkCode,
              telegramLinkCodeLedger,
              telegramLinkCodes,
              telegramLinkCodeStatusLabels: telegramLinkCodeStatusLabels2,
              telegramLinkStaffId,
              telegramLinkStaffOptions,
              telegramLinkSubjectType,
              telegramMapsUrlDraft,
              telegramModeDraft,
              telegramModeHints: telegramModeHints2,
              telegramModeLabels: telegramModeLabels2,
              telegramOutbox,
              telegramOutboxStatusFilter,
              telegramOutboxStatusFilterLabels: telegramOutboxStatusFilterLabels2,
              telegramOutboxStatusFilterOptions: telegramOutboxStatusFilterOptions2,
              telegramOutboxTemplateFilter,
              telegramOutboxTemplateFilterLabels: telegramOutboxTemplateFilterLabels2,
              telegramOutboxTemplateFilterOptions: telegramOutboxTemplateFilterOptions2,
              telegramOwnBotUsernameDraft,
              telegramPatientPortalBaseUrlDraft,
              telegramPostVisitCheckupDelayDrafts,
              telegramPostVisitCheckupDelayFields: telegramPostVisitCheckupDelayFields2,
              telegramPreview,
              telegramPrivacyModeDraft,
              telegramPrivacyModeHints: telegramPrivacyModeHints2,
              telegramPrivacyModeLabels: telegramPrivacyModeLabels2,
              telegramQrSvgToDataUrl: telegramQrSvgToDataUrl2,
              telegramReminderLeadTimesDraft,
              telegramReviewRequestDelayDraft,
              telegramReviewUrlDraft,
              telegramRevokingLinkId,
              telegramSendingItemId,
              telegramSettingsDirty,
              telegramSettingsSaveError,
              telegramSettingsSaveState,
              telegramStaffEscalationChannelDraft,
              telegramStatus,
              telegramSubjectName,
              telegramTemplateLabels: telegramTemplateLabels2,
              telegramTokenTtlDraft,
              telegramVisualCardFields: telegramVisualCardFields2,
              telegramVisualCardUrlDrafts,
              telegramWebhookBaseUrlDraft,
              telegramWelcomeImageUrlDraft,
              toggleChairWorkingDay,
              toggleClinicalRule,
              toggleClinicWorkingDay,
              toggleStaffWorkingDay,
              toggleTelegramFeature,
              uiLanguage,
              uiLanguageOptions: uiLanguageOptions2,
              unlockTelegramAdminSession: () => unlockTelegramAdminSession(settingsAdminSecretDomain),
              updateChairScheduleDay,
              updateChairScheduleDraft,
              updateClinicProfileDraft,
              updateStaffScheduleDay,
              updateStaffScheduleDraft,
              updateTelegramPostVisitCheckupDelayDraft,
              updateTelegramVisualCardUrlDraft,
              usePricelistAi,
              visibleTelegramOutboxItems,
              weekdayOptions: weekdayOptions2,
              workspaceScopeLabels: workspaceScopeLabels2,
              staffScheduleDirtyIds,
              staffScheduleDrafts,
              staffScheduleSaveStates,
              staffScheduleSavingId,
              chairScheduleDirtyIds,
              chairScheduleDrafts,
              chairScheduleSaveStates,
              chairScheduleSavingId
            },
            void 0,
            false,
            {
              fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
              lineNumber: 4179,
              columnNumber: 13
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 4169,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 4168,
        columnNumber: 9
      }, this) : null,
      currentView === "marketing" ? /* @__PURE__ */ jsxDEV(Suspense, { fallback: /* @__PURE__ */ jsxDEV(AppLoadingState, { message: "Загрузка маркетинга" }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 4709,
        columnNumber: 29
      }, this), children: /* @__PURE__ */ jsxDEV(MarketingView, { clinicName: dashboard.clinicName, clinicPhone: clinicProfileDraft.phone }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 4710,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 4709,
        columnNumber: 9
      }, this) : null,
      /* @__PURE__ */ jsxDEV(
        VoiceAssistantUI,
        {
          onNavigate: (view) => {
            setCurrentView(view);
            window.location.hash = view;
          },
          onSearchQuery: (q) => {
            setQuery(q);
          },
          onDateChange: (date) => {
            setScheduleDateFilter(date);
          }
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 4714,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(Omnibar, {}, void 0, false, {
        fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
        lineNumber: 4726,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        CommandPalette,
        {
          patients: filteredPatients,
          onSelectPatient: (id) => {
            setSelectedPatientId(id);
            setCurrentView("patients");
          },
          onNavigate: (view) => setCurrentView(view)
        },
        void 0,
        false,
        {
          fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
          lineNumber: 4727,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
      lineNumber: 2353,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx",
    lineNumber: 2347,
    columnNumber: 5
  }, this);
}
_s(App, "nCY76aIkBNphL7wcpFHg/+nyZ4Y=", false, function() {
  return [useAppLogic];
});
_c21 = App;
var _c, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c0, _c1, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21;
$RefreshReg$(_c, "ImagingView$lazy");
$RefreshReg$(_c2, "ImagingView");
$RefreshReg$(_c3, "VisitView$lazy");
$RefreshReg$(_c4, "VisitView");
$RefreshReg$(_c5, "FinanceView$lazy");
$RefreshReg$(_c6, "FinanceView");
$RefreshReg$(_c7, "CommunicationsView$lazy");
$RefreshReg$(_c8, "CommunicationsView");
$RefreshReg$(_c9, "DocumentsView$lazy");
$RefreshReg$(_c0, "DocumentsView");
$RefreshReg$(_c1, "SettingsView$lazy");
$RefreshReg$(_c10, "SettingsView");
$RefreshReg$(_c11, "ScheduleView$lazy");
$RefreshReg$(_c12, "ScheduleView");
$RefreshReg$(_c13, "PatientsView$lazy");
$RefreshReg$(_c14, "PatientsView");
$RefreshReg$(_c15, "ShiftView$lazy");
$RefreshReg$(_c16, "ShiftView");
$RefreshReg$(_c17, "PatientCockpit$lazy");
$RefreshReg$(_c18, "PatientCockpit");
$RefreshReg$(_c19, "MarketingView$lazy");
$RefreshReg$(_c20, "MarketingView");
$RefreshReg$(_c21, "App");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0E3d0I7QUFBQUEsSUFDQTh3QjtBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUVGQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxJQUNBQztBQUFBQSxFQUNGLElBQUl0Z0MsWUFBWTtBQUVkUSxZQUFVLE1BQU00Qiw2QkFBNkI0SyxXQUFXLEdB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Vm9pY2VBc3Npc3RhbnRVSSIsIk9tbmliYXIiLCJDb21tYW5kUGFsZXR0ZSIsIkF1dGhIdWIiLCJTdGFmZlBpblBhZCIsImxhenkiLCJTdXNwZW5zZSIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiQXJyb3dSaWdodCIsIkFsZXJ0VHJpYW5nbGUiLCJCb3QiLCJDYWxlbmRhckRheXMiLCJDaGVjayIsIkNoZWNrQ2lyY2xlMiIsIkNsaXBib2FyZENoZWNrIiwiRXh0ZXJuYWxMaW5rIiwiRmxpcEhvcml6b250YWwiLCJJbWFnZSIsIkltYWdlSWNvbiIsIk1pYyIsIlBsdXMiLCJSZWZyZXNoQ3ciLCJSb3RhdGVDY3ciLCJSb3RhdGVDdyIsIlNoaWVsZENoZWNrIiwiU3BhcmtsZXMiLCJab29tSW4iLCJab29tT3V0IiwiQXBwTG9hZGluZ1N0YXRlIiwiQXBwVW5sb2NrU3RhdGUiLCJDbGluaWNhbFJ1bGVQYW5lbCIsIkN0UGxhbm5pbmdUb29sc1BhbmVsIiwiV29ya3NwYWNlU2lkZWJhciIsIldvcmtzcGFjZVRvcGJhciIsInNjaGVkdWxlSWRsZVdvcmtzcGFjZVByZWxvYWQiLCJXb3Jrc3BhY2VDb250aW51aXR5U3RyaXAiLCJXb3Jrc3BhY2VSb3V0ZUVycm9yQm91bmRhcnkiLCJJbWFnaW5nVmlldyIsIl9jIiwidGhlbiIsIm1vZHVsZSIsImRlZmF1bHQiLCJfYzIiLCJWaXNpdFZpZXciLCJfYzMiLCJfYzQiLCJGaW5hbmNlVmlldyIsIl9jNSIsIl9jNiIsIkNvbW11bmljYXRpb25zVmlldyIsIl9jNyIsIl9jOCIsIkRvY3VtZW50c1ZpZXciLCJfYzkiLCJfYzAiLCJTZXR0aW5nc1ZpZXciLCJfYzEiLCJfYzEwIiwiU2NoZWR1bGVWaWV3IiwiX2MxMSIsIl9jMTIiLCJQYXRpZW50c1ZpZXciLCJfYzEzIiwiX2MxNCIsIlNoaWZ0VmlldyIsIl9jMTUiLCJfYzE2IiwiUGF0aWVudENvY2twaXQiLCJfYzE3IiwiX2MxOCIsIk1hcmtldGluZ1ZpZXciLCJfYzE5IiwiX2MyMCIsInNwZWVjaEdhdGV3YXlDYW5VcGxvYWQiLCJzdGF0dXMiLCJCb29sZWFuIiwic2VydmVyVHJhbnNjcmlwdGlvbkN1cnJlbnRseUF2YWlsYWJsZSIsInNlcnZlclRyYW5zY3JpcHRpb25FbmFibGVkIiwiQXBwIiwiX3MiLCJhY2NlcHREcmFmdFRvVmlzaXQiLCJhY3RpdmVBcHBvaW50bWVudCIsImFjdGl2ZUNoYWlyIiwiYWN0aXZlQ29tbXVuaWNhdGlvblRhc2tzIiwiYWN0aXZlRG9jdG9yIiwiYWN0aXZlRG9jdW1lbnRzIiwiYWN0aXZlSW1hZ2luZ1N0dWRpZXMiLCJhY3RpdmVJc3N1ZWRQYWlkQ29udHJhY3RzIiwiYWN0aXZlUGF0aWVudCIsImFjdGl2ZVBhdGllbnRDYWxsYWJsZVBob25lIiwiYWN0aXZlUGF0aWVudEhhc0NhbGxhYmxlUGhvbmUiLCJhY3RpdmVQYXRpZW50SW5zaWdodCIsImFjdGl2ZVBheW1lbnRzIiwiYWN0aXZlUXVldWVSb2xlIiwiYWN0aXZlUm9sZVBvbGljeSIsImFjdGl2ZVJvbGVRdWV1ZSIsImFjdGl2ZVJvbGVSZXN0cmljdGVkU2VjdGlvbnMiLCJhY3RpdmVSb2xlV3JpdGFibGVTZWN0aW9ucyIsImFjdGl2ZVNldHRpbmdzVGFiQnV0dG9uUmVmIiwiYWN0aXZlU3BlZWNoUHJvdmlkZXJIZWFsdGgiLCJhY3RpdmVUcmVhdG1lbnRQbGFuSXRlbXMiLCJhY3RpdmVUcmVhdG1lbnRQbGFuU2NlbmFyaW9zIiwiYWN0aXZlVXNhYmxlRG9jdW1lbnRzIiwiYWN0aXZlVmlzaXRDbGluaWNhbFJ1bGVFdmFsdWF0aW9ucyIsImFjdGl2ZVZpc2l0Q2xpbmljYWxSdWxlU3VtbWFyeSIsImFjdGl2ZVdvcmtzcGFjZVByb2ZpbGUiLCJhZGRDaGFpciIsImFkZEltYWdpbmdWaWV3ZXJOb3RlQW5ub3RhdGlvbiIsImFkZE1pZ3JhdGlvbkRpc2NvdmVyeUNhbmRpZGF0ZVRvU21hcnRJbXBvcnQiLCJhZGRTdGFmZk1lbWJlciIsImFuYWx5emVQcmljZWxpc3QiLCJhcHBlbmRUb1RyYW5zY3JpcHQiLCJhcHBseUN0UGxhbm5pbmdRdWlja0FjdGlvbiIsImFwcGx5TXByQ2xpbmljYWxQcmVzZXQiLCJhcHBseU5lYXJlc3RNcHJDbGluaWNhbFByZXNldCIsImFwcGx5UG9zdFZpc2l0Q2FyZVByZXNldCIsImFwcGx5UHJvdG9jb2xUZW1wbGF0ZSIsImFwcGx5UHJvdG9jb2xUZW1wbGF0ZURpcmVjdGx5IiwiYXBwb2ludG1lbnRMYWJlbHMiLCJhcHBvaW50bWVudFJlYWRpbmVzc0J5SWQiLCJhcHBvaW50bWVudFJlYWRpbmVzc0xhYmVscyIsImFwcG9pbnRtZW50U2NoZWR1bGVEcmFmdEZyb21BcHBvaW50bWVudCIsImF0dGFjaFByaWNlbGlzdEltYWdlIiwiYnJvd3NlckNhblJlcXVlc3RQZXJzaXN0ZW50U3RvcmFnZSIsImJyb3dzZXJDb250aW51aXR5IiwiYnJvd3NlckNvbnRpbnVpdHlDaGVja3MiLCJicm93c2VyQ29udGludWl0eUNyaXRpY2FsIiwiYnJvd3NlckNvbnRpbnVpdHlTdGF0ZSIsImJyb3dzZXJDb250aW51aXR5VmFsdWUiLCJicm93c2VyRGlyZWN0b3J5SW5wdXRSZWYiLCJicm93c2VyRGlyZWN0b3J5UGlja2VyQXZhaWxhYmxlIiwiYnJvd3NlckltYWdpbmdTY2FuUHJvZ3Jlc3MiLCJicm93c2VyTWlncmF0aW9uRGlzY292ZXJ5IiwiYnJvd3Nlck1pZ3JhdGlvbklucHV0UmVmIiwiYnJvd3Nlck1pZ3JhdGlvblNjYW5Qcm9ncmVzcyIsImJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyIiwiYnVpbGREaWNvbUZvbGRlcldvcmt1cFBsYW4iLCJidWlsZERpY29tUmVuZGVyQ2FjaGVQbGFuIiwiYnVpbGREaWNvbVZpZXdlckxhdW5jaE1hbmlmZXN0IiwiYnVpbGREaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZSIsImJ1aWxkRGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdCIsImJ1aWxkRHJhZnQiLCJidWlsZE9mZmxpbmVEcmFmdCIsImNhblJldHJ5SW1hZ2luZ1ZpZXdlclNhdmUiLCJjYW5jZWxCcm93c2VySW1hZ2luZ0ZvbGRlclNjYW4iLCJjYW5jZWxCcm93c2VyTWlncmF0aW9uU2NhbiIsImNhbmNlbExvY2FsRGljb21PcGVyYXRpb24iLCJjYmN0V29ya2JlbmNoUGxhbmVzIiwiY2JjdFdvcmtiZW5jaFByb2plY3Rpb25zIiwiY2JjdFdvcmtiZW5jaFNlcmllcyIsImNiY3RXb3JrYmVuY2hUb29scyIsImNoYWlyU2NoZWR1bGVEaXJ0eUlkcyIsImNoYWlyU2NoZWR1bGVEcmFmdHMiLCJjaGFpclNjaGVkdWxlU2F2ZVN0YXRlcyIsImNoYWlyU2NoZWR1bGVTYXZpbmdJZCIsImNoYW5nZUNsaW5pY01vZGUiLCJjaGFuZ2VQb3N0VmlzaXRDYXJlVG9waWMiLCJjaGVja0RpY29tV2ViQ29ubmVjdG9yIiwiY2hlY2tEaWNvbVdvcmtzdGF0aW9uUmVhZGluZXNzIiwiY2hvb3NlUmVjb2duaXRpb25QcmVzZXQiLCJjbGFtcE1wckF4aXNEZWciLCJjbGFtcE1wclNsYWJNbSIsImNsYW1wTXByU2xpY2VJbmRleCIsImNsZWFyQnJvd3NlclBpY2tlZEltYWdpbmdGb2xkZXJQcmV2aWV3IiwiY2xlYXJEaWNvbVdvcmtiZW5jaFJlY292ZXJ5IiwiY2xlYXJMb2NhbEltYWdpbmdGb2xkZXJSZWNvdmVyeSIsImNsZWFyUHJpY2VsaXN0SW1hZ2UiLCJjbGVhclRyYW5zY3JpcHRXaXRoVW5kbyIsImNsZWFyZWRUcmFuc2NyaXB0U25hcHNob3QiLCJjbGluaWNNb2RlTGFiZWxzIiwiY2xpbmljUHJvZmlsZURyYWZ0IiwiY2xpbmljUHJvZmlsZVNhdmVTdGF0ZSIsImNsaW5pY1B1YmxpY0xvb2t1cCIsImNsaW5pY2FsUnVsZUFjdGlvbkxhYmVscyIsImNsaW5pY2FsUnVsZVNldmVyaXR5TGFiZWxzIiwiY2xvc2VBcHBvaW50bWVudEVkaXRvciIsImNvbW1pdEltYWdpbmdJbXBvcnQiLCJjb21taXRJbXBvcnQiLCJjb21taXRTbWFydEltcG9ydCIsImNvbW11bmljYXRpb25DaGFubmVsTGFiZWxzIiwiY29tbXVuaWNhdGlvbkRvY3VtZW50VGFza0FjdGlvbkxhYmVscyIsImNvbW11bmljYXRpb25JbnRlbnRMYWJlbHMiLCJjb21tdW5pY2F0aW9uTm90ZSIsImNvbW11bmljYXRpb25Qcmlvcml0eUxhYmVscyIsImNvbW11bmljYXRpb25TYXZpbmdUYXNrSWQiLCJjb21tdW5pY2F0aW9uU3RhdHVzTGFiZWxzIiwiY29tcGFjdERvY3VtZW50VGV4dCIsImNvbXBsZXRlQ29tbXVuaWNhdGlvblRhc2siLCJjb21wbGV0ZWRBY3RDb250cmFjdFJlZmVyZW5jZUZvclVpIiwiY29tcGxldGVkQWN0RmlzY2FsUmVjZWlwdExpbmVzIiwiY29tcGxldGVkQWN0UGFpZFJ1YlZhbHVlIiwiY29uZmlybURvY3VtZW50SXNzdWUiLCJjb25maXJtRG9jdW1lbnRWb2lkIiwiY29udGludWVPbmJvYXJkaW5nSW5EcmFmdE1vZGUiLCJjb3B5VGVsZWdyYW1UZXh0VG9DbGlwYm9hcmQiLCJjcmVhdGVBcHBvaW50bWVudEZyb21EcmFmdCIsImNyZWF0ZUNsaW5pY2FsUnVsZUZyb21TZXR0aW5ncyIsImNyZWF0ZUN0UGxhbm5pbmdBcnRpZmFjdCIsImNyZWF0ZURvY3VtZW50IiwiY3JlYXRlSW1hZ2luZ1N0dWR5IiwiY3JlYXRlUGF0aWVudCIsImNyZWF0ZVRlbGVncmFtTGlua0NvZGUiLCJjdFBsYW5uaW5nQWN0aXZlUXVpY2tBY3Rpb25JZCIsImN0UGxhbm5pbmdBbm5vdGF0aW9uUmVmcyIsImN0UGxhbm5pbmdJbXBsYW50UGxhbiIsImN1cnJlbnRPbmJvYXJkaW5nSW5kZXgiLCJjdXJyZW50VmlldyIsImRhc2hib2FyZCIsImRlZmF1bHREaWNvbUZpcnN0RnJhbWVWaWV3ZXJTdGF0ZSIsImRlZmF1bHRJbWFnaW5nVmlld2VyU3RhdGUiLCJkZW50YWxNYXRlcmlhbEtpbmRMYWJlbHMiLCJkZW50YWxSZXN0b3JhdGlvblR5cGVMYWJlbHMiLCJkZXNjcmliZU1wckNsaW5pY2FsUHJlc2V0UHJvamVjdGlvbkZhbGxiYWNrIiwiZGljb21EaWFnbm9zdGljUGl4ZWxQb2xpY3lMYWJlbHMiLCJkaWNvbUV4ZWN1dGlvbkxhbmVMYWJlbHMiLCJkaWNvbUZpcnN0RnJhbWVJbWFnZVN0eWxlIiwiZGljb21GaXJzdEZyYW1lUHJldmlldyIsImRpY29tRmlyc3RGcmFtZVN0YXR1c0xhYmVscyIsImRpY29tRmlyc3RGcmFtZVZpZXdlclN0YXRlIiwiZGljb21Gb2xkZXJTZXJpZXNTY2FuIiwiZGljb21Gb2xkZXJXb3JrdXBQYXRoTGFiZWxzIiwiZGljb21Gb2xkZXJXb3JrdXBQbGFuIiwiZGljb21HcHVDbGFzc0xhYmVscyIsImRpY29tTGFiZWwiLCJkaWNvbUxvY2FsRm9sZGVyRGlzY292ZXJ5IiwiZGljb21RdWFsaXR5TW9kZUxhYmVscyIsImRpY29tUmVhZGluZXNzQ2hlY2tMYWJlbHMiLCJkaWNvbVJlbmRlckNhY2hlUGxhbiIsImRpY29tUmVuZGVyTWVtb3J5QnVkZ2V0Q2xhc3NMYWJlbHMiLCJkaWNvbVJ1bnRpbWVUaWVyTGFiZWxzIiwiZGljb21TZXJpZXNQcmV2aWV3IiwiZGljb21TZXJpZXNWaWV3ZXJMYWJlbHMiLCJkaWNvbVRleHR1cmVTdHJhdGVneUxhYmVscyIsImRpY29tVmlld2VyTGF1bmNoTWFuaWZlc3QiLCJkaWNvbVZpZXdlckxhdW5jaE1vZGVMYWJlbHMiLCJkaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZSIsImRpY29tVmlld2VyV29ya2JlbmNoTWFuaWZlc3QiLCJkaWNvbVdlYkNoZWNrIiwiZGljb21XZWJFbmRwb2ludFVybCIsImRpY29tV2ViU3RhdHVzTGFiZWxzIiwiZGljb21Xb3JrYmVuY2hMb2NhbFNhdmVkQXQiLCJkaWNvbVdvcmtiZW5jaFNlcnZlckJ1bmRsZSIsImRpY29tV29ya2JlbmNoU291cmNlSXNSZWRhY3RlZCIsImRpY29tV29ya3N0YXRpb25SZWFkaW5lc3MiLCJkaWN0YXRpb25RdWlja1BocmFzZXMiLCJkaXNjb3ZlckRpY29tRm9sZGVycyIsImRpc2NvdmVyTWlncmF0aW9uU291cmNlcyIsImRpc21pc3NPbmJvYXJkaW5nIiwiZG9jdW1lbnRBY3Rpb25MYWJlbHMiLCJkb2N1bWVudERldGVjdGVkS2luZExhYmVsIiwiZG9jdW1lbnRGYWN0b3J5R3JvdXBzIiwiZG9jdW1lbnRJbmdlc3Rpb24iLCJkb2N1bWVudEluZ2VzdGlvblF1YWxpdHlMYWJlbHMiLCJkb2N1bWVudEluZ2VzdGlvblRhcmdldCIsImRvY3VtZW50SXNzdWVBdHRlc3RhdGlvblJlYWR5IiwiZG9jdW1lbnRJc3N1ZUNvbmZpcm1hdGlvbiIsImRvY3VtZW50SXNzdWVTaWduYXR1cmVNb2RlTGFiZWxzIiwiZG9jdW1lbnRLaW5kc0ZvckNvbW11bmljYXRpb25UYXNrIiwiZG9jdW1lbnRMYWJlbHMiLCJkb2N1bWVudFBhdGllbnQiLCJkb2N1bWVudFNvdXJjZVN0YXR1c0NsYXNzTmFtZXMiLCJkb2N1bWVudFN0YXR1c0xhYmVscyIsImRvY3VtZW50Vm9pZENvbmZpcm1hdGlvbiIsImRvY3VtZW50Vm9pZFJlYWR5IiwiZG9jdW1lbnRWb2lkUmVhc29uTGFiZWxzIiwiZG93bmxvYWREaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZSIsImRvd25sb2FkRGljb21Xb3JrYmVuY2hNYW5pZmVzdCIsImRvd25sb2FkSXNzdWVkRG9jdW1lbnRIdG1sIiwiZG93bmxvYWRJc3N1ZWREb2N1bWVudFBkZiIsImRvd25sb2FkTWlncmF0aW9uSGFuZG9mZlJlcG9ydCIsImRvd25sb2FkUGVyc2lzdGVuY2VFeHBvcnQiLCJkb3dubG9hZFNtYXJ0SW1wb3J0UmVwb3J0IiwiZG93bmxvYWRTbWFydEltcG9ydFNhZmVIYW5kb2ZmUmVwb3J0IiwiZG93bmxvYWRUYXhEb2N1bWVudFhtbCIsImRvd25sb2FkVGVsZWdyYW1RclN2ZyIsImRyYWZ0IiwiZWRpdGluZ0FwcG9pbnRtZW50SWQiLCJlbGlnaWJsZVBheW1lbnRSZWNlaXB0UGF5bWVudHMiLCJlbGlnaWJsZVJlZnVuZENvcnJlY3Rpb25QYXltZW50cyIsImVsaWdpYmxlVGF4UGF5bWVudHMiLCJlbXB0eURpY3RhdGlvblZvaWNlQWN0aW9uTGFiZWwiLCJlcnJvciIsImZpbHRlcmVkUGF0aWVudHMiLCJmaWx0ZXJlZFRlbGVncmFtT3V0Ym94SXRlbXMiLCJmbHVzaFBlbmRpbmdTcGVlY2hDaHVua3MiLCJmbHVzaFBlbmRpbmdWaXNpdFNhdmVzIiwiZm9ybWF0Qnl0ZVNpemUiLCJmb3JtYXREYXRlVGltZSIsImZvcm1hdE1lZ2FieXRlcyIsImZvcm1hdFNob3J0RGF0ZSIsImZvcm1hdFNpZ25lZE1wclN0ZXAiLCJmb3JtYXRUaW1lIiwiZnJvbURhdGVUaW1lTG9jYWxWYWx1ZSIsImdvVG9WaXNpdERpY3RhdGlvbiIsImhhbmRsZUJyb3dzZXJEaXJlY3RvcnlJbnB1dENoYW5nZSIsImhhbmRsZUJyb3dzZXJNaWdyYXRpb25JbnB1dENoYW5nZSIsImhhbmRsZU1wcktleWJvYXJkTmF2aWdhdGlvbiIsImhhc1Zpc2l0VHJhbnNjcmlwdFRleHQiLCJoaWRkZW5UZWxlZ3JhbU91dGJveEl0ZW1Db3VudCIsImltYWdpbmdDb21wYXJpc29uQ2FuZGlkYXRlcyIsImltYWdpbmdDb25uZWN0b3JDYXJkcyIsImltYWdpbmdDcmVhdGVTYXZpbmdLaW5kIiwiaW1hZ2luZ0ZvbGRlclBhdGgiLCJpbWFnaW5nRm9sZGVyU2NhbiIsImltYWdpbmdJbXBvcnRDb21taXQiLCJpbWFnaW5nSW1wb3J0UHJldmlldyIsImltYWdpbmdJbXBvcnRTb3VyY2VLaW5kIiwiaW1hZ2luZ0ltcG9ydFRleHQiLCJpbWFnaW5nS2luZEZpbHRlciIsImltYWdpbmdLaW5kTGFiZWxzIiwiaW1hZ2luZ0tpbmRPcHRpb25zIiwiaW1hZ2luZ1ByZXZpZXdTb3VyY2UiLCJpbWFnaW5nU291cmNlQ2hvaWNlcyIsImltYWdpbmdTb3VyY2VEZXRhaWxzIiwiaW1hZ2luZ1NvdXJjZUxhYmVscyIsImltYWdpbmdWaWV3ZXJBY3RpdmVUb29sIiwiaW1hZ2luZ1ZpZXdlckFubm90YXRpb25zIiwiaW1hZ2luZ1ZpZXdlckNhcGFiaWxpdGllcyIsImltYWdpbmdWaWV3ZXJIcmVmIiwiaW1hZ2luZ1ZpZXdlckltYWdlU3R5bGUiLCJpbWFnaW5nVmlld2VyTm90ZSIsImltYWdpbmdWaWV3ZXJOb3RlTWlzc2luZ0lkIiwiaW1hZ2luZ1ZpZXdlck5vdGVSZWFkeSIsImltYWdpbmdWaWV3ZXJSZXRyeU1pc3NpbmdJZCIsImltYWdpbmdWaWV3ZXJTYXZlRGV0YWlsIiwiaW1hZ2luZ1ZpZXdlclNhdmVTdGF0ZSIsImltYWdpbmdWaWV3ZXJTYXZlVGl0bGUiLCJpbWFnaW5nVmlld2VyU2Vzc2lvblJlYWR5IiwiaW1hZ2luZ1ZpZXdlclN0YXRlIiwiaW1hZ2luZ1ZpZXdlclRvb2xMYWJlbHMiLCJpbXBvcnRDb21taXQiLCJpbXBvcnRJbnRha2UiLCJpbXBvcnRQcmV2aWV3IiwiaW1wb3J0U291cmNlS2luZCIsImltcG9ydFNvdXJjZUxhYmVscyIsImltcG9ydFRleHQiLCJpbmZlcnJlZFRyZWF0bWVudEFyZWEiLCJpbmdlc3RJbXBvcnRGaWxlIiwiaW5nZXN0aW9uVGFyZ2V0TGFiZWxzIiwiaW5zdGFsbG1lbnRTY2hlZHVsZUJhc2VEb2N1bWVudFRpdGxlVmFsdWUiLCJpbnN0YWxsbWVudFNjaGVkdWxlSW5zdGFsbG1lbnRSb3dzIiwiaW5zdGFsbG1lbnRTY2hlZHVsZVByZXBhaWRSdWJWYWx1ZSIsImluc3RhbGxtZW50U2NoZWR1bGVSZW1haW5pbmdSdWJWYWx1ZSIsImluc3RhbGxtZW50U2NoZWR1bGVUb3RhbFJ1YlZhbHVlIiwiaW50ZWdyYXRpb25DYXBhYmlsaXR5TGFiZWxzIiwiaW50ZWdyYXRpb25DYXRlZ29yeUxhYmVscyIsImludGVncmF0aW9uU3RhdHVzTGFiZWxzIiwiaXNCcm93c2VySW1hZ2luZ0ZvbGRlclBpY2tpbmciLCJpc0Jyb3dzZXJNaWdyYXRpb25TY2FubmluZyIsImlzQ2xpbmljUHVibGljTG9va3VwTG9hZGluZyIsImlzQ2xpbmljYWxSdWxlU2F2aW5nIiwiaXNEaWNvbUZpcnN0RnJhbWVQcmV2aWV3aW5nIiwiaXNEaWNvbUZvbGRlcldvcmt1cFBsYW5uaW5nIiwiaXNEaWNvbUxvY2FsRGlzY292ZXJpbmciLCJpc0RpY29tTWFuaWZlc3RCdWlsZGluZyIsImlzRGljb21SZW5kZXJDYWNoZVBsYW5uaW5nIiwiaXNEaWNvbVNlcmllc1ByZXZpZXdMb2FkaW5nIiwiaXNEaWNvbVRvb2xTdGF0ZUJ1aWxkaW5nIiwiaXNEaWNvbVdlYkNoZWNraW5nIiwiaXNEaWNvbVdvcmtiZW5jaEJ1aWxkaW5nIiwiaXNEaWNvbVdvcmtiZW5jaFJlY29ubmVjdGluZyIsImlzRGljb21Xb3JrYmVuY2hTZXJ2ZXJTYXZpbmciLCJpc0RpY29tV29ya3N0YXRpb25DaGVja2luZyIsImlzRHJhZnRBY2NlcHRpbmciLCJpc0RyYWZ0TG9hZGluZyIsImlzSW1hZ2luZ0ZvbGRlclNjYW5uaW5nIiwiaXNJbWFnaW5nSW1wb3J0Q29tbWl0dGluZyIsImlzSW1hZ2luZ0ltcG9ydExvYWRpbmciLCJpc0ltcG9ydENvbW1pdHRpbmciLCJpc0ltcG9ydERpY3RhdGluZyIsImlzSW1wb3J0TG9hZGluZyIsImlzTG9jYWxEaWNvbU9wZXJhdGlvbkFjdGl2ZSIsImlzTG9jYWxJbWFnaW5nT3JnYW5pemluZyIsImlzTWlncmF0aW9uQXV0b3BpbG90TG9hZGluZyIsImlzTWlncmF0aW9uSGFuZG9mZlJlcG9ydExvYWRpbmciLCJpc01pZ3JhdGlvblNvdXJjZURpc2NvdmVyaW5nIiwiaXNNaWdyYXRpb25Tb3VyY2VQcm9iZUxvYWRpbmciLCJpc01pZ3JhdGlvblNvdXJjZVdvcmt1cExvYWRpbmciLCJpc09ubGluZSIsImlzUGF5bWVudFNhdmluZyIsImlzUGVuZGluZ1Zpc2l0U3luY2luZyIsImlzUGVyc2lzdGVuY2VFeHBvcnRpbmciLCJpc1ByaWNlbGlzdEFuYWx5emluZyIsImlzUmVjb2duaXRpb25Mb2FkaW5nIiwiaXNTZXJ2ZXJWb2ljZVJlY29yZGluZyIsImlzU21hcnRJbXBvcnRDb21taXR0aW5nIiwiaXNTbWFydEltcG9ydExvYWRpbmciLCJpc1NtYXJ0UmVwb3J0TG9hZGluZyIsImlzU21hcnRTYWZlUmVwb3J0TG9hZGluZyIsImlzVGVsZWdyYW1DaGF0TGlua3NMb2FkaW5nTW9yZSIsImlzVGVsZWdyYW1MaW5rQ29kZXNMb2FkaW5nTW9yZSIsImlzVGVsZWdyYW1MaW5rQ3JlYXRpbmciLCJpc1RlbGVncmFtTG9hZGluZyIsImlzVGVsZWdyYW1PdXRib3hJdGVtRHVlRm9yVWkiLCJpc1RlbGVncmFtT3V0Ym94TG9hZGluZ01vcmUiLCJpc1RlbGVncmFtU2VuZGluZ0R1ZSIsImlzVGVsZWdyYW1TZXR0aW5nc1NhdmluZyIsImlzVHJhbnNjcmlwdFBvbGlzaGluZyIsImlzVmlzaXREaWN0YXRpbmciLCJpc1Zpc2l0Tm90ZURpcnR5IiwiaXNzdWVkTWVkaWNhbENvcHlSZXF1ZXN0RG9jdW1lbnRzIiwibGFzdExvY2FsU2F2ZWRBdCIsImxhc3RQZW5kaW5nVmlzaXRTYXZlQXQiLCJsYXN0U2VydmVyRHJhZnRTYXZlZEF0IiwibGFzdFZpc2l0U2F2ZVJlY2VpcHQiLCJsYXRlc3REaWNvbVdvcmtiZW5jaFNlcnZlckJ1bmRsZSIsImxlZ2FsTWlzc2luZ0ZpZWxkcyIsImxlZ2FsUmVhZGluZXNzUGVyY2VudCIsImxvYWREb2N1bWVudEF1ZGl0RmFjdHMiLCJsb2FkTG9jYWxCcmlkZ2VVc2VQbGFucyIsImxvYWRNb3JlVGVsZWdyYW1DaGF0TGlua3MiLCJsb2FkTW9yZVRlbGVncmFtTGlua0NvZGVzIiwibG9hZE1vcmVUZWxlZ3JhbU91dGJveCIsImxvYWRQZXJzaXN0ZW5jZUhlYWx0aCIsImxvYWRQZXJzaXN0ZW5jZUludGVncml0eSIsImxvYWRUZWxlZ3JhbUNvbnRyb2xQbGFuZSIsImxvY2FsQnJpZGdlUmVhZGluZXNzIiwibG9jYWxCcmlkZ2VTdGF0dXNMYWJlbHMiLCJsb2NhbEJyaWRnZVN0YXR1c1N0YXRlIiwibG9jYWxCcmlkZ2VTdGF0dXNWYWx1ZSIsImxvY2FsQnJpZGdlVXNlUGF0aExhYmVscyIsImxvY2FsQnJpZGdlVXNlUGxhbnMiLCJsb2NhbERyYWZ0V2FzUmVzdG9yZWQiLCJsb2NhbEltYWdpbmdGb2xkZXJEcmFmdCIsImxvY2FsSW1hZ2luZ01vZGVsUm9sZUxhYmVscyIsImxvY2FsSW1hZ2luZ09yZ2FuaXplciIsImxvY2FsSW1hZ2luZ09yZ2FuaXplckFjdGlvbkxhYmVscyIsImxvY2tUZWxlZ3JhbUFkbWluU2Vzc2lvbiIsImxvb2t1cENsaW5pY1B1YmxpY1Byb2ZpbGUiLCJtYXJrUG9zdFZpc2l0TWFudWFsRWRpdGVkIiwibWFya1RlbGVncmFtU2V0dGluZ3NEaXJ0eSIsIm1lZGljYWxEb2N1bWVudFJlbGVhc2VDaGFubmVsTGFiZWxzIiwibWlncmF0aW9uQXV0b3BpbG90IiwibWlncmF0aW9uU291cmNlRGlzY292ZXJ5IiwibWlncmF0aW9uU291cmNlUHJvYmUiLCJtaWdyYXRpb25Tb3VyY2VXb3JrdXAiLCJtaW5vckNvbnNlbnREaWFnbm9zaXNPckluZGljYXRpb25WYWx1ZSIsIm1pbm9yQ29uc2VudEludGVydmVudGlvblNjb3BlVmFsdWUiLCJtaW5vckNvbnNlbnRQYXRpZW50QmlydGhEYXRlVmFsdWUiLCJtaW5vckNvbnNlbnRQYXRpZW50RnVsbE5hbWVWYWx1ZSIsIm1pbm9yUmVwcmVzZW50YXRpdmVGdWxsTmFtZVZhbHVlIiwibWlub3JSZXByZXNlbnRhdGl2ZUlkZW50aXR5RG9jdW1lbnRWYWx1ZSIsIm1pbm9yUmVwcmVzZW50YXRpdmVQaG9uZVZhbHVlIiwibWlub3JSZXByZXNlbnRhdGl2ZVJlbGF0aW9uc2hpcFZhbHVlIiwibW9uZXkiLCJtb3N0TG9hZGVkUmVzb3VyY2UiLCJtb3ZlT25ib2FyZGluZ1RvIiwibXByQWN0aXZlUHJvamVjdGlvbkxhYmVsIiwibXByQWN0aXZlUHJvamVjdGlvbk9yaWVudGF0aW9uIiwibXByQXhpc0FuZ2xlQmFkZ2UiLCJtcHJBeGlzQm91bmRzIiwibXByQXhpc0RlZyIsIm1wckF4aXNEaXJlY3Rpb25MYWJlbCIsIm1wckF4aXNHdWlkYW5jZSIsIm1wckF4aXNOdWRnZURlZyIsIm1wckF4aXNQcmVzZXREZWciLCJtcHJBeGlzUmFuZ2VWYWx1ZSIsIm1wckF4aXNWaXN1YWxpemVyTGFiZWwiLCJtcHJBeGlzVmlzdWFsaXplclN0eWxlIiwibXByQ2FjaGVNb2RlTGFiZWxzIiwibXByQ2xpbmljYWxDaGVja2xpc3QiLCJtcHJDbGluaWNhbE5leHRTdGVwIiwibXByQ2xpbmljYWxQcmVzZXRCdXR0b25DbGFzcyIsIm1wckNsaW5pY2FsUHJlc2V0cyIsIm1wckNvbnRyb2xzQXV0b09wZW4iLCJtcHJDb250cm9sc1JlYWR5IiwibXByQ3Jvc3NoYWlyRW5hYmxlZCIsIm1wckxpbmtlZFBsYW5lc0VuYWJsZWQiLCJtcHJMb2FkU3RyYXRlZ3lMYWJlbHMiLCJtcHJOZWFyZXN0Q2xpbmljYWxQcmVzZXQiLCJtcHJPcGVyYXRvclN1bW1hcnlDYXJkcyIsIm1wclByb2plY3Rpb24iLCJtcHJQcm9qZWN0aW9uQ29tcGFzcyIsIm1wclByb2plY3Rpb25MYWJlbHMiLCJtcHJSZXNvdXJjZVRpZXJMYWJlbHMiLCJtcHJTYWZlU2xpY2VJbmRleCIsIm1wclNlcmllc1JlcXVpcmVkUHJvamVjdGlvbkxhYmVsIiwibXByU2xhYkJhZGdlIiwibXByU2xhYkJvdW5kcyIsIm1wclNsYWJNbSIsIm1wclNsYWJOdWRnZU1tIiwibXByU2xhYlByZXNldE1tIiwibXByU2xhYlJhbmdlVmFsdWUiLCJtcHJTbGljZUJhZGdlIiwibXByU2xpY2VJbmRleCIsIm1wclNsaWNlSW5kZXhGcm9tRnJhY3Rpb24iLCJtcHJTbGljZUxhYmVsIiwibXByU2xpY2VNYXhJbmRleCIsIm1wclNsaWNlTnVkZ2VTdGVwcyIsIm1wclNsaWNlUHJlc2V0RnJhY3Rpb25zIiwibXByU2xpY2VSYW5nZVZhbHVlIiwibXByVG9vbExhYmVscyIsIm1wclVuYXZhaWxhYmxlUHJvamVjdGlvbkxhYmVsIiwibXByV2luZG93UHJlc2V0IiwibXByV2luZG93UHJlc2V0TGFiZWxzIiwibXByV29ya2JlbmNoRHJhZnRSZXN0b3JlZCIsIm1wcldvcmtiZW5jaExvY2FsU2F2ZWRBdCIsIm1wcldvcmtiZW5jaFN1bW1hcnlUZXh0IiwibmV3QXBwb2ludG1lbnRFcnJvciIsIm5ld0NoYWlySGFzTWljcm9zY29wZSIsIm5ld0NoYWlySGFzU3VyZ2VyeUtpdCIsIm5ld0NoYWlySGFzWHJheVNlbnNvciIsIm5ld0NoYWlyTmFtZSIsIm5ld0NoYWlyUmVhZHlUb0NyZWF0ZSIsIm5ld1J1bGVBY3Rpb24iLCJuZXdSdWxlQmxvY2tlZFNlcnZpY2VJZCIsIm5ld1J1bGVDYXRlZ29yeSIsIm5ld1J1bGVDb21wbGV0ZWRTZXJ2aWNlSWQiLCJuZXdSdWxlT3duZXJSb2xlIiwibmV3UnVsZVJlcXVpcmVkU2VydmljZUlkIiwibmV3UnVsZVNldmVyaXR5IiwibmV3UnVsZVNwZWNpYWx0eSIsIm5ld1J1bGVUaXRsZSIsIm5ld1J1bGVUcmlnZ2VyU2VydmljZUlkIiwibmV3UnVsZVdhcm5pbmdUZXh0IiwibmV3U3RhZmZOYW1lIiwibmV3U3RhZmZSZWFkeVRvQ3JlYXRlIiwibmV3U3RhZmZSb2xlIiwibmV3U3RhZmZTcGVjaWFsdHkiLCJuZXh0T25ib2FyZGluZ1N0ZXAiLCJub3JtYWxpemVPcHRpb25hbFdvcmtpbmdEYXlzRHJhZnQiLCJub3JtYWxpemVVaUxhbmd1YWdlSW5wdXQiLCJub3JtYWxpemVkQXBwb2ludG1lbnRTdGF0dXMiLCJub3JtYWxpemVkQXBwb2ludG1lbnRTdGF0dXNGaWx0ZXIiLCJub3JtYWxpemVkQ2xpbmljYWxSdWxlQWN0aW9uIiwibm9ybWFsaXplZENsaW5pY2FsUnVsZVNldmVyaXR5Iiwibm9ybWFsaXplZERlbnRhbFNwZWNpYWx0eSIsIm5vcm1hbGl6ZWREb2N1bWVudElzc3VlU2lnbmF0dXJlTW9kZSIsIm5vcm1hbGl6ZWREb2N1bWVudEtpbmQiLCJub3JtYWxpemVkRG9jdW1lbnRWb2lkUmVhc29uQ29kZSIsIm5vcm1hbGl6ZWRNZWRpY2FsRG9jdW1lbnRSZWxlYXNlQ2hhbm5lbCIsIm5vcm1hbGl6ZWRPdXRwYXRpZW50MDI1dURlbW9ncmFwaGljQ29kZSIsIm5vcm1hbGl6ZWRQYXRpZW50SW50YWtlUHJlZ25hbmN5U3RhdHVzIiwibm9ybWFsaXplZFBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uQWN0aW9uIiwibm9ybWFsaXplZFBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uTWV0aG9kIiwibm9ybWFsaXplZFBvc3RWaXNpdENhcmVUb3BpYyIsIm5vcm1hbGl6ZWRQcm9jZWR1cmVTcGVjaWZpY0NvbnNlbnRQcm9jZWR1cmUiLCJub3JtYWxpemVkU2VydmljZUNhdGVnb3J5Iiwibm9ybWFsaXplZFN0YWZmUm9sZSIsIm5vcm1hbGl6ZWRUYXhBcHBsaWNhdGlvbkRlbGl2ZXJ5Q2hhbm5lbCIsIm5vcm1hbGl6ZWRUYXhBcHBsaWNhdGlvbkZvcm0iLCJub3JtYWxpemVkVGF4QXBwbGljYXRpb25SZWxhdGlvbnNoaXBTZWxlY3QiLCJub3JtYWxpemVkVGVsZWdyYW1Cb3RNb2RlIiwibm9ybWFsaXplZFRlbGVncmFtTGlua1N1YmplY3RUeXBlIiwibm9ybWFsaXplZFRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyIiwibm9ybWFsaXplZFRlbGVncmFtT3V0Ym94VGVtcGxhdGVGaWx0ZXIiLCJub3JtYWxpemVkVGVsZWdyYW1Qcml2YWN5TW9kZSIsIm5vcm1hbGl6ZWRUcmVhdG1lbnRQbGFuQWNjZXB0YW5jZVZhcmlhbnQiLCJub3JtYWxpemVkWHJheVByZWduYW5jeVN0YXR1cyIsIm5vcm1hbGl6ZWRYcmF5UHJpb3JpdHkiLCJub3JtYWxpemVkWHJheVN0dWR5VHlwZSIsIm9oaWZCYXNlVXJsIiwib25ib2FyZGluZ0Jsb2NraW5nSXNzdWVzIiwib25ib2FyZGluZ0NoYWlyQ3JlYXRlR3VpZGFuY2VJZCIsIm9uYm9hcmRpbmdEaXNtaXNzZWQiLCJvbmJvYXJkaW5nRG9jdW1lbnRSZWFkaW5lc3NJc3N1ZXMiLCJvbmJvYXJkaW5nRG9jdW1lbnRzUmVhZHkiLCJvbmJvYXJkaW5nRHJhZnRNb2RlIiwib25ib2FyZGluZ0ZpbmlzaEd1aWRhbmNlSWQiLCJvbmJvYXJkaW5nUmVhZHlUb0ZpbmlzaCIsIm9uYm9hcmRpbmdTdGFmZkNyZWF0ZUd1aWRhbmNlSWQiLCJvbmJvYXJkaW5nU3RlcCIsIm9uYm9hcmRpbmdTdGVwcyIsIm9uYm9hcmRpbmdUZWxlZ3JhbVJlY29tbWVuZGF0aW9ucyIsIm9uYm9hcmRpbmdUZWxlZ3JhbVZpc3VhbENhcmRLZXlzIiwib3BlbkFwcG9pbnRtZW50RWRpdG9yIiwib3BlbkNvbW11bmljYXRpb25UYXNrRG9jdW1lbnRXb3JrZmxvdyIsIm9wZW5Jc3N1ZWREb2N1bWVudEh0bWwiLCJvcGVuT25ib2FyZGluZ0d1aWRlIiwib3BlblNjaGVkdWxlV2FybmluZyIsIm9wZW5WaXNpdFdhcm5pbmdBY3Rpb24iLCJvcmdhbml6ZUxvY2FsSW1hZ2luZ1NvdXJjZXMiLCJvdXRwYXRpZW50MDI1dU1lZGljYWxDYXJkTnVtYmVyVmFsdWUiLCJwYWlkQ29udHJhY3RUb3RhbFJ1YlZhbHVlIiwicGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZVZhbGlkYXRpb25NZXNzYWdlIiwicGF0aWVudEJpbGxpbmdTdW1tYXJ5IiwicGF0aWVudENsaW5pY2FsUnVsZUV2YWx1YXRpb25zIiwicGF0aWVudENsaW5pY2FsUnVsZVN1bW1hcnkiLCJwYXRpZW50SW5zaWdodEJ5SWQiLCJwYXRpZW50SW5zaWdodFJpc2tMYWJlbHMiLCJwYXRpZW50SW50YWtlUHJlZ25hbmN5U3RhdHVzT3B0aW9ucyIsInBhdGllbnROYW1lIiwicGF5bWVudEFtb3VudCIsInBheW1lbnRGZWVkYmFjayIsInBheW1lbnRGaXNjYWxDYXNoaWVyTmFtZSIsInBheW1lbnRGaXNjYWxGZCIsInBheW1lbnRGaXNjYWxGbiIsInBheW1lbnRGaXNjYWxGcGQiLCJwYXltZW50RmlzY2FsUmVjZWlwdElzc3VlZEF0IiwicGF5bWVudEZpc2NhbFJlY2VpcHRMYWJlbEZvclVpIiwicGF5bWVudEZpc2NhbFJlY2VpcHROdW1iZXIiLCJwYXltZW50RmlzY2FsUmVjZWlwdFVybCIsInBheW1lbnRJbnZvaWNlVG90YWxSdWJWYWx1ZSIsInBheW1lbnRNZXRob2QiLCJwYXltZW50TWV0aG9kTGFiZWxzIiwicGF5bWVudFBhdGllbnRDb250ZXh0TWVzc2FnZSIsInBheW1lbnRQYXRpZW50Q29udGV4dFJlYWR5IiwicGF5bWVudFBheWVyQmlydGhEYXRlIiwicGF5bWVudFBheWVyRnVsbE5hbWUiLCJwYXltZW50UGF5ZXJJZGVudGl0eURvY3VtZW50IiwicGF5bWVudFBheWVySW5uIiwicGF5bWVudFBheWVyUmVsYXRpb25zaGlwIiwicGF5bWVudFJlY2VpcHRGaXNjYWxSZWNlaXB0TGluZXMiLCJwYXltZW50UmVjZWlwdElzc3VlZEJ5VmFsdWUiLCJwYXltZW50UmVjZWlwdFBheWVyQmlydGhEYXRlVmFsdWUiLCJwYXltZW50UmVjZWlwdFBheWVyRnVsbE5hbWVWYWx1ZSIsInBheW1lbnRSZWNlaXB0UGF5ZXJJZGVudGl0eURvY3VtZW50VmFsdWUiLCJwYXltZW50UmVjZWlwdFBheWVySW5uVmFsdWUiLCJwYXltZW50UmVjZWlwdFBheWVyUmVsYXRpb25zaGlwVmFsdWUiLCJwYXltZW50VGF4RGVkdWN0aW9uQ29kZSIsInBlbmRpbmdTcGVlY2hDaHVua0NvdW50IiwicGVuZGluZ1NwZWVjaEZsdXNoQWN0aW9uTGFiZWwiLCJwZW5kaW5nU3BlZWNoRmx1c2hBY3Rpb25UaXRsZSIsInBlbmRpbmdWaXNpdFNhdmVDb3VudCIsInBlcnNpc3RlbmNlSGVhbHRoIiwicGVyc2lzdGVuY2VJbnRlZ3JpdHkiLCJwaG90b1ZpZGVvTWF0ZXJpYWxPcHRpb25zIiwicGlja0Jyb3dzZXJJbWFnaW5nRm9sZGVyIiwicGlja0Jyb3dzZXJNaWdyYXRpb25Tb3VyY2UiLCJwbGFuTWlncmF0aW9uRGlzY292ZXJ5Q2FuZGlkYXRlIiwicGxhbm5lZFNlcnZpY2VMaW5lc0ZvckZpbmFuY2lhbFBheWxvYWQiLCJwb2xpY3lBdWRpdEV2ZW50TGFiZWxzIiwicG9saXNoVHJhbnNjcmlwdCIsInBvbGlzaGluZ0ZpZWxkIiwicG9saXNoU2luZ2xlRmllbGQiLCJwb3N0VmlzaXRDYXJlVG9waWNPcHRpb25zIiwicHJlbG9hZFdvcmtzcGFjZVZpZXciLCJwcmVwYXJlRGljb21Xb3JrYmVuY2hGcm9tRm9sZGVyIiwicHJldmlld0RpY29tRmlyc3RGcmFtZSIsInByZXZpZXdEaWNvbUZpcnN0RnJhbWVTbGljZSIsInByZXZpZXdEaWNvbVNlcmllcyIsInByZXZpZXdJbWFnaW5nSW1wb3J0IiwicHJldmlld0ltcG9ydCIsInByZXZpZXdNaWdyYXRpb25BdXRvcGlsb3RTb3VyY2VzIiwicHJldmlld01pZ3JhdGlvbkRpc2NvdmVyeUNhbmRpZGF0ZSIsInByZXZpZXdTbWFydEltcG9ydCIsInByZXZpZXdUZWxlZ3JhbVRlbXBsYXRlIiwicHJldmlvdXNPbmJvYXJkaW5nU3RlcCIsInByaWNlbGlzdEFuYWx5c2lzIiwicHJpY2VsaXN0SW1hZ2VCYXNlNjQiLCJwcmljZWxpc3RJbWFnZU5hbWUiLCJwcmljZWxpc3RJbWFnZU5vdGUiLCJwcmljZWxpc3RJdGVtTWF0ZXJpYWxUZXh0IiwicHJpY2VsaXN0TWF0ZXJpYWxTdW1tYXJ5VGV4dCIsInByaWNlbGlzdFBhcnNlck1vZGVMYWJlbHMiLCJwcmljZWxpc3RSZWNvZ25pdGlvbkJyYW5kR3JvdXBzIiwicHJpY2VsaXN0UmVjb2duaXRpb25TZXJ2aWNlR3JvdXBzIiwicHJpY2VsaXN0U291cmNlS2luZCIsInByaWNlbGlzdFNvdXJjZUtpbmRMYWJlbHMiLCJwcmljZWxpc3RUZXh0IiwicHJpY2VsaXN0V2FybmluZ3NUZXh0IiwicHJpbWFyeVZpc2l0V2FybmluZyIsInByb2JlTWlncmF0aW9uRGlzY292ZXJ5Q2FuZGlkYXRlIiwicHJvY2VkdXJlU3BlY2lmaWNDb25zZW50UHJvY2VkdXJlT3B0aW9ucyIsInF1ZXJ5IiwicmVjb2duaXRpb25Kb2IiLCJyZWNvZ25pdGlvbktpbmQiLCJyZWNvZ25pdGlvblByZXNldHMiLCJyZWNvZ25pdGlvblRhcmdldCIsInJlY29nbml0aW9uVGFyZ2V0TGFiZWxzIiwicmVjb2duaXRpb25UZXh0IiwicmVjb21tZW5kZWRBY3Rpb25Qcmlvcml0eUxhYmVscyIsInJlY29ubmVjdERpY29tV29ya2JlbmNoRnJvbUN1cnJlbnRGb2xkZXIiLCJyZWNvcmRQYXltZW50IiwicmVmcmVzaEJyb3dzZXJDb250aW51aXR5IiwicmVmcmVzaFNwZWVjaFJ1bnRpbWUiLCJyZWxlYXNlUHJvdGVjdGlvbk5vdGUiLCJyZW1lbWJlckxvY2FsSW1hZ2luZ0ZvbGRlciIsInJlbmRlckNsaW5pY2FsVG9vdGhSb3dzRWRpdG9yIiwicmVvcGVuT25ib2FyZGluZyIsInJlcXVlc3RCcm93c2VyU3RvcmFnZVBlcnNpc3RlbmNlIiwicmVxdWVzdERvY3VtZW50SXNzdWUiLCJyZXF1ZXN0RG9jdW1lbnRWb2lkIiwicmVzZXRNcHJDb250cm9scyIsInJlc2V0TmV3QXBwb2ludG1lbnREcmFmdCIsInJlc3RvcmVEaWNvbVdvcmtiZW5jaFNlcnZlckJ1bmRsZSIsInJlc3RvcmVNcHJXb3JrYmVuY2hMb2NhbERyYWZ0IiwicmV0cnlJbWFnaW5nVmlld2VyU2Vzc2lvblNhdmUiLCJyZXZva2VUZWxlZ3JhbUNoYXRMaW5rIiwicm9sZUZvY3VzT3JkZXIiLCJydW5NaWdyYXRpb25BdXRvcGlsb3QiLCJydW5SZWNvZ25pdGlvbkpvYiIsInNhdmVBcHBvaW50bWVudFNjaGVkdWxlIiwic2F2ZUNoYWlyU2NoZWR1bGUiLCJzYXZlQ2xpbmljUHJvZmlsZUZyb21EcmFmdCIsInNhdmVEaWNvbVdvcmtiZW5jaEJ1bmRsZVRvU2VydmVyIiwic2F2ZVBhdGllbnRBZG1pbmlzdHJhdGl2ZVByb2ZpbGUiLCJzYXZlUGF0aWVudENvcmUiLCJzYXZlU3RhZmZTY2hlZHVsZSIsInNhdmVUZWxlZ3JhbVNldHRpbmdzIiwic2NhbkRpY29tRm9sZGVyU2VyaWVzIiwic2NhbkltYWdpbmdGb2xkZXIiLCJzY2VuYXJpb1ByaW9yaXR5TGFiZWxzIiwic2NlbmFyaW9TdHJhdGVneUxhYmVscyIsInNjaGVkdWxlQWRtaW5TZWNyZXREcmFmdCIsInNjaGVkdWxlQWRtaW5TZWNyZXRTZXNzaW9uIiwic2Nyb2xsVG9WaXNpdEFyZWEiLCJzZWxlY3RBbGxFbGlnaWJsZVRheFBheW1lbnRzRm9yQ3VycmVudERvY3VtZW50Iiwic2VsZWN0Q3RQbGFubmluZ0ltcGxhbnQiLCJzZWxlY3RSZWZ1bmRPcmlnaW5hbFBheW1lbnQiLCJzZWxlY3RlZENvbXBsZXRlZEFjdENvbnRyYWN0RG9jdW1lbnRJZCIsInNlbGVjdGVkRG9jdW1lbnRNZXRhZGF0YSIsInNlbGVjdGVkRG9jdW1lbnRVc2VzVGF4UGF5bWVudFNlbGVjdGlvbiIsInNlbGVjdGVkRWxpZ2libGVUYXhQYXltZW50cyIsInNlbGVjdGVkSW1hZ2luZ1N0dWR5Iiwic2VsZWN0ZWRJbWFnaW5nVmlld2VyUGxhbiIsInNlbGVjdGVkUGF0aWVudCIsInNlbGVjdGVkUGF5bWVudFJlY2VpcHRJZFNldCIsInNlbGVjdGVkUGF5bWVudFJlY2VpcHRQYXltZW50cyIsInNlbGVjdGVkUGF5bWVudFJlY2VpcHRUb3RhbFJ1YiIsInNlbGVjdGVkUHJvdG9jb2xUZW1wbGF0ZSIsInNlbGVjdGVkUmVmdW5kQ29ycmVjdGlvblBheW1lbnQiLCJzZWxlY3RlZFJlbGVhc2VTb3VyY2VSZXF1ZXN0RG9jdW1lbnRJZCIsInNlbGVjdGVkU3BlY2lhbHR5Iiwic2VsZWN0ZWRUYXhEb2N1bWVudFBheWVyS2V5Iiwic2VsZWN0ZWRUYXhQYXltZW50SWRTZXQiLCJzZWxlY3RlZFRheFBheW1lbnRUb3RhbFJ1YiIsInNlbGVjdGVkVWlMYW5ndWFnZU9wdGlvbiIsInNlbGVjdGVkV29ya3NwYWNlUm9sZSIsInNlbmREdWVUZWxlZ3JhbU91dGJveCIsInNlbmRSZWNvZ25pdGlvblJlc3VsdFRvSW1wb3J0Iiwic2VuZFRlbGVncmFtT3V0Ym94SXRlbSIsInNlcnZlckRyYWZ0U3luY1N0YXRlIiwic2VydmljZUNhdGVnb3J5TGFiZWxzIiwic2VydmljZVRpdGxlIiwic2V0Q2xlYXJlZFRyYW5zY3JpcHRTbmFwc2hvdCIsInNldENvbW11bmljYXRpb25Ob3RlIiwic2V0Q3RQbGFubmluZ0FjdGl2ZVF1aWNrQWN0aW9uSWQiLCJzZXRDdFBsYW5uaW5nSW1wbGFudFBsYW4iLCJzZXRDdXJyZW50VmlldyIsInNldERpY29tRmlyc3RGcmFtZVByZXZpZXciLCJzZXREaWNvbUZpcnN0RnJhbWVWaWV3ZXJTdGF0ZSIsInNldERpY29tRm9sZGVyU2VyaWVzU2NhbiIsInNldERpY29tRm9sZGVyV29ya3VwUGxhbiIsInNldERpY29tTG9jYWxGb2xkZXJEaXNjb3ZlcnkiLCJzZXREaWNvbVJlbmRlckNhY2hlUGxhbiIsInNldERpY29tU2VyaWVzUHJldmlldyIsInNldERpY29tVmlld2VyTGF1bmNoTWFuaWZlc3QiLCJzZXREaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZSIsInNldERpY29tVmlld2VyV29ya2JlbmNoTWFuaWZlc3QiLCJzZXREaWNvbVdlYkNoZWNrIiwic2V0RGljb21XZWJFbmRwb2ludFVybCIsInNldERpY29tV29ya2JlbmNoTG9jYWxTYXZlZEF0Iiwic2V0RGljb21Xb3Jrc3RhdGlvblJlYWRpbmVzcyIsInNldERvY3VtZW50SW5nZXN0aW9uVGFyZ2V0Iiwic2V0RXJyb3IiLCJzZXRJbWFnaW5nRm9sZGVyUGF0aCIsInNldEltYWdpbmdGb2xkZXJTY2FuIiwic2V0SW1hZ2luZ0ltcG9ydENvbW1pdCIsInNldEltYWdpbmdJbXBvcnRQcmV2aWV3Iiwic2V0SW1hZ2luZ0ltcG9ydFNvdXJjZUtpbmQiLCJzZXRJbWFnaW5nSW1wb3J0VGV4dCIsInNldEltYWdpbmdLaW5kRmlsdGVyIiwic2V0SW1hZ2luZ1ZpZXdlckFjdGl2ZVRvb2wiLCJzZXRJbWFnaW5nVmlld2VyTm90ZSIsInNldEltYWdpbmdWaWV3ZXJTdGF0ZSIsInNldEltcG9ydENvbW1pdCIsInNldEltcG9ydEludGFrZSIsInNldEltcG9ydFByZXZpZXciLCJzZXRJbXBvcnRTb3VyY2VLaW5kIiwic2V0SW1wb3J0VGV4dCIsInNldExvY2FsSW1hZ2luZ09yZ2FuaXplciIsInNldE1wckF4aXNEZWciLCJzZXRNcHJDcm9zc2hhaXJFbmFibGVkIiwic2V0TXByTGlua2VkUGxhbmVzRW5hYmxlZCIsInNldE1wclByb2plY3Rpb24iLCJzZXRNcHJTbGFiTW0iLCJzZXRNcHJTbGljZUluZGV4Iiwic2V0TXByV2luZG93UHJlc2V0Iiwic2V0TmV3Q2hhaXJIYXNNaWNyb3Njb3BlIiwic2V0TmV3Q2hhaXJIYXNTdXJnZXJ5S2l0Iiwic2V0TmV3Q2hhaXJIYXNYcmF5U2Vuc29yIiwic2V0TmV3Q2hhaXJOYW1lIiwic2V0TmV3UnVsZUFjdGlvbiIsInNldE5ld1J1bGVCbG9ja2VkU2VydmljZUlkIiwic2V0TmV3UnVsZUNhdGVnb3J5Iiwic2V0TmV3UnVsZUNvbXBsZXRlZFNlcnZpY2VJZCIsInNldE5ld1J1bGVPd25lclJvbGUiLCJzZXROZXdSdWxlUmVxdWlyZWRTZXJ2aWNlSWQiLCJzZXROZXdSdWxlU2V2ZXJpdHkiLCJzZXROZXdSdWxlU3BlY2lhbHR5Iiwic2V0TmV3UnVsZVRpdGxlIiwic2V0TmV3UnVsZVRyaWdnZXJTZXJ2aWNlSWQiLCJzZXROZXdSdWxlV2FybmluZ1RleHQiLCJzZXROZXdTdGFmZk5hbWUiLCJzZXROZXdTdGFmZlJvbGUiLCJzZXROZXdTdGFmZlNwZWNpYWx0eSIsInNldE9oaWZCYXNlVXJsIiwic2V0UGF5bWVudEFtb3VudCIsInNldFBheW1lbnRGaXNjYWxDYXNoaWVyTmFtZSIsInNldFBheW1lbnRGaXNjYWxGZCIsInNldFBheW1lbnRGaXNjYWxGbiIsInNldFBheW1lbnRGaXNjYWxGcGQiLCJzZXRQYXltZW50RmlzY2FsUmVjZWlwdElzc3VlZEF0Iiwic2V0UGF5bWVudEZpc2NhbFJlY2VpcHROdW1iZXIiLCJzZXRQYXltZW50RmlzY2FsUmVjZWlwdFVybCIsInNldFBheW1lbnRNZXRob2QiLCJzZXRQYXltZW50UGF5ZXJCaXJ0aERhdGUiLCJzZXRQYXltZW50UGF5ZXJGdWxsTmFtZSIsInNldFBheW1lbnRQYXllcklkZW50aXR5RG9jdW1lbnQiLCJzZXRQYXltZW50UGF5ZXJJbm4iLCJzZXRQYXltZW50UGF5ZXJSZWxhdGlvbnNoaXAiLCJzZXRQYXltZW50VGF4RGVkdWN0aW9uQ29kZSIsInNldFByaWNlbGlzdEFuYWx5c2lzIiwic2V0UHJpY2VsaXN0U291cmNlS2luZCIsInNldFByaWNlbGlzdFRleHQiLCJzZXRRdWVyeSIsInNldFJlY29nbml0aW9uSm9iIiwic2V0UmVjb2duaXRpb25UZXh0Iiwic2V0UmVsZWFzZVByb3RlY3Rpb25Ob3RlIiwic2V0U2VsZWN0ZWRJbWFnaW5nU3R1ZHlJZCIsInNldFNlbGVjdGVkUHJvdG9jb2xJZCIsInNldFNlbGVjdGVkU3BlY2lhbHR5Iiwic2V0U2VsZWN0ZWRXb3Jrc3BhY2VSb2xlIiwic2V0U2V0dGluZ3NBZG1pblNlY3JldERyYWZ0Iiwic2V0U2V0dGluZ3NUYWIiLCJzZXRTbWFydEltcG9ydENvbW1pdCIsInNldFNtYXJ0SW1wb3J0TW9kZSIsInNldFNtYXJ0SW1wb3J0UHJldmlldyIsInNldFNtYXJ0SW1wb3J0VGV4dCIsInNldFRlbGVncmFtQWRtaW5TZWNyZXREcmFmdCIsInNldFRlbGVncmFtQm90VXNlcm5hbWVEcmFmdCIsInNldFRlbGVncmFtSGFuZG9mZk5vdGljZSIsInNldFRlbGVncmFtTWFwc1VybERyYWZ0Iiwic2V0VGVsZWdyYW1QYXRpZW50UG9ydGFsQmFzZVVybERyYWZ0Iiwic2V0VGVsZWdyYW1Qcml2YWN5TW9kZURyYWZ0Iiwic2V0VGVsZWdyYW1SZW1pbmRlckxlYWRUaW1lc0RyYWZ0Iiwic2V0VGVsZWdyYW1SZXZpZXdSZXF1ZXN0RGVsYXlEcmFmdCIsInNldFRlbGVncmFtUmV2aWV3VXJsRHJhZnQiLCJzZXRUZWxlZ3JhbVRva2VuVHRsRHJhZnQiLCJzZXRUZWxlZ3JhbVdlbGNvbWVJbWFnZVVybERyYWZ0Iiwic2V0VHJhbnNjcmlwdCIsInNldFVpTGFuZ3VhZ2UiLCJzZXRVaVByZWZlcmVuY2VzU3luY0Vycm9yIiwic2V0VXNlUHJpY2VsaXN0QWkiLCJzZXR0aW5nc0FkbWluU2VjcmV0RG9tYWluIiwic2V0dGluZ3NBZG1pblNlY3JldERyYWZ0Iiwic2V0dGluZ3NBZG1pblNlY3JldFNlc3Npb24iLCJzZXR0aW5nc1RhYiIsInNldHRpbmdzVGFicyIsInNoaWZ0V2FybmluZ3MiLCJzaG93QWRtaW5pc3RyYXRpb25Ub3BBY3Rpb25zIiwic2hvd0RvY3RvclZpc2l0U2hvcnRjdXQiLCJzaG93RnVsbE9uYm9hcmRpbmdHdWlkZSIsInNtYXJ0SW1wb3J0Q29tbWl0Iiwic21hcnRJbXBvcnRNb2RlIiwic21hcnRJbXBvcnRNb2RlTGFiZWxzIiwic21hcnRJbXBvcnRQcmV2aWV3Iiwic21hcnRJbXBvcnRUZXh0Iiwic29ydGVkQXBwb2ludG1lbnRzIiwic29ydGVkQ29tbXVuaWNhdGlvblRhc2tzIiwic3BlY2lhbHRpZXNXaXRoVGVtcGxhdGVzIiwic3BlY2lhbHR5TGFiZWxzIiwic3BlY2lhbHR5UHJvdG9jb2xUZW1wbGF0ZXMiLCJzcGVlY2hHYXRld2F5QWN0aXZlUHJvdmlkZXJJc0xvY2FsIiwic3BlZWNoR2F0ZXdheUhlYWx0aFJlcG9ydCIsInNwZWVjaEdhdGV3YXlTdGF0dXMiLCJzcGVlY2hQcm92aWRlckNvbm5lY3RvckxhYmVscyIsInNwZWVjaFByb3ZpZGVySGVhbHRoQnlJZCIsInNwZWVjaFByb3ZpZGVySGVhbHRoTGFiZWxzIiwic3BlZWNoUHJvdmlkZXJNb2RlTGFiZWxzIiwic3BlZWNoUHJvdmlkZXJSdW50aW1lQnlJZCIsInNwZWVjaFByb3ZpZGVyU2VsZWN0aW9uTGFiZWxzIiwic3BlZWNoUHJvdmlkZXJTdGF0dXNMYWJlbHMiLCJzcGVlY2hSZWNvZ25pdGlvblJlYWR5Iiwic3BlZWNoUmVjb3JkaW5nUGF0aExhYmVscyIsInNwZWVjaFJlY29yZGluZ1JlY292ZXJ5Iiwic3BlZWNoUmVjb3JkaW5nU3RyYXRlZ3kiLCJzcGVlY2hSZWNvdmVyeVN0YXRlTGFiZWxzIiwic3BlZWNoU3RhdHVzTm90ZSIsInNwZWVjaFRyYW5zY3JpcHRpb25CdXN5Iiwic3BlZWNoTGl2ZVJtcyIsInN0YWZmUm9sZUxhYmVscyIsInN0YWZmU2NoZWR1bGVEaXJ0eUlkcyIsInN0YWZmU2NoZWR1bGVEcmFmdEZyb21Xb3JraW5nSG91cnMiLCJzdGFmZlNjaGVkdWxlRHJhZnRzIiwic3RhZmZTY2hlZHVsZVNhdmVTdGF0ZXMiLCJzdGFmZlNjaGVkdWxlU2F2aW5nSWQiLCJzdGFnZUxvY2FsSW1hZ2luZ0ZvbGRlclJlY292ZXJ5Iiwic3RhcnRJbXBvcnREaWN0YXRpb24iLCJzdGFydFNlcnZlclZvaWNlUmVjb3JkaW5nIiwic3RhcnRWaXNpdERpY3RhdGlvbiIsInN0b3BTZXJ2ZXJWb2ljZVJlY29yZGluZyIsInN0cnVjdHVyZWRQYXlsb2FkRG9jdW1lbnRLaW5kcyIsInRheEFwcGxpY2F0aW9uRGVsaXZlcnlDaGFubmVsT3B0aW9ucyIsInRheEFwcGxpY2F0aW9uRm9ybU9wdGlvbnMiLCJ0YXhBcHBsaWNhdGlvblJlbGF0aW9uc2hpcE9wdGlvbnMiLCJ0YXhEb2N1bWVudFBheWVyT3B0aW9ucyIsInRlbGVncmFtQWRtaW5TZWNyZXREcmFmdCIsInRlbGVncmFtQWRtaW5TZWNyZXRTZXNzaW9uIiwidGVsZWdyYW1BbGxvd1ZvaWNlSW50YWtlRHJhZnQiLCJ0ZWxlZ3JhbUJvdENvbmZpZ0lkIiwidGVsZWdyYW1Cb3RVc2VybmFtZURyYWZ0IiwidGVsZWdyYW1DaGF0TGlua0xlZGdlciIsInRlbGVncmFtQ2hhdExpbmtzIiwidGVsZWdyYW1DbGFzc2lmaWNhdGlvbkxhYmVscyIsInRlbGVncmFtRGVsaXZlcnlTdGF0dXNMYWJlbHMiLCJ0ZWxlZ3JhbUVuYWJsZWRGZWF0dXJlc0RyYWZ0IiwidGVsZWdyYW1GZWF0dXJlSGVscCIsInRlbGVncmFtRmVhdHVyZUxhYmVsIiwidGVsZWdyYW1GZWF0dXJlT3B0aW9ucyIsInRlbGVncmFtRmVhdHVyZVBsYW4iLCJ0ZWxlZ3JhbUhhbmRvZmZOb3RpY2UiLCJ0ZWxlZ3JhbUh1bWFuTWVzc2FnZSIsInRlbGVncmFtSW5saW5lQnV0dG9uS2luZExhYmVscyIsInRlbGVncmFtSW5saW5lQnV0dG9uUm93c0Zyb21SZXBseU1hcmt1cCIsInRlbGVncmFtTGlua0FjdGlvblN0YXRlIiwidGVsZWdyYW1MaW5rQ29kZSIsInRlbGVncmFtTGlua0NvZGVMZWRnZXIiLCJ0ZWxlZ3JhbUxpbmtDb2RlU3RhdHVzTGFiZWxzIiwidGVsZWdyYW1MaW5rQ29kZXMiLCJ0ZWxlZ3JhbUxpbmtTdGFmZklkIiwidGVsZWdyYW1MaW5rU3RhZmZPcHRpb25zIiwidGVsZWdyYW1MaW5rU3ViamVjdFR5cGUiLCJ0ZWxlZ3JhbU1hcHNVcmxEcmFmdCIsInRlbGVncmFtTW9kZURyYWZ0IiwidGVsZWdyYW1Nb2RlSGludHMiLCJ0ZWxlZ3JhbU1vZGVMYWJlbHMiLCJ0ZWxlZ3JhbU91dGJveCIsInRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyIiwidGVsZWdyYW1PdXRib3hTdGF0dXNGaWx0ZXJMYWJlbHMiLCJ0ZWxlZ3JhbU91dGJveFN0YXR1c0ZpbHRlck9wdGlvbnMiLCJ0ZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyIiwidGVsZWdyYW1PdXRib3hUZW1wbGF0ZUZpbHRlckxhYmVscyIsInRlbGVncmFtT3V0Ym94VGVtcGxhdGVGaWx0ZXJPcHRpb25zIiwidGVsZWdyYW1Pd25Cb3RVc2VybmFtZURyYWZ0IiwidGVsZWdyYW1QYXRpZW50UG9ydGFsQmFzZVVybERyYWZ0IiwidGVsZWdyYW1Qb3N0VmlzaXRDaGVja3VwRGVsYXlEcmFmdHMiLCJ0ZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheUZpZWxkcyIsInRlbGVncmFtUHJldmlldyIsInRlbGVncmFtUHJpdmFjeU1vZGVEcmFmdCIsInRlbGVncmFtUHJpdmFjeU1vZGVIaW50cyIsInRlbGVncmFtUHJpdmFjeU1vZGVMYWJlbHMiLCJ0ZWxlZ3JhbVFyU3ZnVG9EYXRhVXJsIiwidGVsZWdyYW1SZW1pbmRlckxlYWRUaW1lc0RyYWZ0IiwidGVsZWdyYW1SZXZpZXdSZXF1ZXN0RGVsYXlEcmFmdCIsInRlbGVncmFtUmV2aWV3VXJsRHJhZnQiLCJ0ZWxlZ3JhbVJldm9raW5nTGlua0lkIiwidGVsZWdyYW1TZW5kaW5nSXRlbUlkIiwidGVsZWdyYW1TZXR0aW5nc0RpcnR5IiwidGVsZWdyYW1TZXR0aW5nc1NhdmVFcnJvciIsInRlbGVncmFtU2V0dGluZ3NTYXZlU3RhdGUiLCJ0ZWxlZ3JhbVN0YWZmRXNjYWxhdGlvbkNoYW5uZWxEcmFmdCIsInRlbGVncmFtU3RhdHVzIiwidGVsZWdyYW1TdWJqZWN0TmFtZSIsInRlbGVncmFtVGVtcGxhdGVMYWJlbHMiLCJ0ZWxlZ3JhbVRva2VuVHRsRHJhZnQiLCJ0ZWxlZ3JhbVZpc3VhbENhcmRGaWVsZHMiLCJ0ZWxlZ3JhbVZpc3VhbENhcmRVcmxEcmFmdHMiLCJ0ZWxlZ3JhbVdlYmhvb2tCYXNlVXJsRHJhZnQiLCJ0ZWxlZ3JhbVdlbGNvbWVJbWFnZVVybERyYWZ0IiwidG9EYXRlVGltZUxvY2FsVmFsdWUiLCJ0b2dnbGVDaGFpcldvcmtpbmdEYXkiLCJ0b2dnbGVDbGluaWNXb3JraW5nRGF5IiwidG9nZ2xlQ2xpbmljYWxSdWxlIiwidG9nZ2xlUGhvdG9WaWRlb01hdGVyaWFsIiwidG9nZ2xlU3RhZmZXb3JraW5nRGF5IiwidG9nZ2xlVGVsZWdyYW1GZWF0dXJlIiwidG9vdGhSb3dzIiwidG9vdGhTdGF0ZUJ5Q29kZSIsInNldFRvb3RoU3RhdGUiLCJ0cmFuc2NyaXB0IiwidHJlYXRtZW50QWNjZXB0YW5jZVBsYW5uZWRUb3RhbFJ1YiIsInRyZWF0bWVudEVzdGltYXRlUGF0aWVudE9yUGF5ZXJGdWxsTmFtZVZhbHVlIiwidHJlYXRtZW50RXN0aW1hdGVUb3RhbFJ1YlZhbHVlIiwidHJlYXRtZW50RXN0aW1hdGVUcmVhdG1lbnRCYXNpc1ZhbHVlIiwidHJlYXRtZW50U3RhdHVzTGFiZWxzIiwidWlMYW5ndWFnZSIsInVpTGFuZ3VhZ2VPcHRpb25zIiwidWlQcmVmZXJlbmNlc1N5bmNFcnJvciIsInVuZG9UcmFuc2NyaXB0Q2xlYXIiLCJ1bmxvY2tUZWxlZ3JhbUFkbWluU2Vzc2lvbiIsInVwZGF0ZUFwcG9pbnRtZW50U2NoZWR1bGVEcmFmdCIsInVwZGF0ZUNoYWlyU2NoZWR1bGVEYXkiLCJ1cGRhdGVDaGFpclNjaGVkdWxlRHJhZnQiLCJ1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQiLCJ1cGRhdGVOZXdBcHBvaW50bWVudERyYWZ0IiwidXBkYXRlUGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZURyYWZ0IiwidXBkYXRlUGF0aWVudENvcmVEcmFmdCIsInVwZGF0ZVN0YWZmU2NoZWR1bGVEYXkiLCJ1cGRhdGVTdGFmZlNjaGVkdWxlRHJhZnQiLCJ1cGRhdGVUZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheURyYWZ0IiwidXBkYXRlVGVsZWdyYW1WaXN1YWxDYXJkVXJsRHJhZnQiLCJ1cGRhdGVWaXNpdE5vdGVGaWVsZCIsInVzZVByaWNlbGlzdEFpIiwidmlld0xhYmVscyIsInZpc2libGVJbWFnaW5nU3R1ZGllcyIsInZpc2libGVSZWNvbW1lbmRlZEFjdGlvbnMiLCJ2aXNpYmxlU2NoZWR1bGVTdWdnZXN0aW9ucyIsInZpc2libGVUZWxlZ3JhbU91dGJveEl0ZW1zIiwidmlzaWJsZVZpc2l0U3BlY2lhbHR5Rm9jdXNPcHRpb25zIiwidmlzaXRDbG9zZUNoZWNrbGlzdCIsInZpc2l0RHJhZnRCdWlsZE1pc3NpbmdTdGVwcyIsInZpc2l0RHJhZnRNaXNzaW5nRmllbGRMYWJlbCIsInZpc2l0RHJhZnRRdWFsaXR5TGFiZWxzIiwidmlzaXREcmFmdFJlYWR5VG9CdWlsZCIsInZpc2l0RHJhZnRTaWduYWxMYWJlbCIsInZpc2l0RHJhZnRVc2VyRWRpdGVkUmVmIiwidmlzaXROb3RlQWNjZXB0TWlzc2luZ1N0ZXBzIiwidmlzaXROb3RlQWN0aW9uTGFiZWwiLCJ2aXNpdE5vdGVGaWVsZERlZmluaXRpb25zIiwidmlzaXROb3RlRm9ybSIsInZpc2l0Tm90ZVJlYWR5VG9BY2NlcHQiLCJ2aXNpdE5vdGVTdGF0dXNMYWJlbCIsInZpc2l0UHJpbWFyeUFjdGlvbiIsInZpc2l0U2FmZXR5Q2FyZHMiLCJ2aXNpdFNhdmVSZWNlaXB0VGV4dCIsInZpc2l0V2FybmluZ3MiLCJ2aXNpdFdvcmtmbG93U3RlcHMiLCJ3YXJuaW5nU2V2ZXJpdHlMYWJlbHMiLCJ3YXJyYW50eUxpbmtlZEFjdE9yQ29udHJhY3RWYWx1ZSIsIndhcnJhbnR5U2VydmljZU9yV29ya05hbWVWYWx1ZSIsIndhcnJhbnR5VGVldGhPckFyZWFWYWx1ZSIsIndlZWtkYXlPcHRpb25zIiwid29ya3NwYWNlU2NvcGVMYWJlbHMiLCJ4cmF5UHJlZ25hbmN5U3RhdHVzT3B0aW9ucyIsInhyYXlTdHVkeVR5cGVPcHRpb25zIiwiYWNjZXNzVW5sb2NrUmVxdWlyZWQiLCJhY2Nlc3NVbmxvY2tNZXNzYWdlIiwiY2xpbmljYWxBZG1pblNlY3JldERyYWZ0Iiwic2V0Q2xpbmljYWxBZG1pblNlY3JldERyYWZ0IiwibG9hZERhc2hib2FyZCIsIm9wZXJhdG9yV29ya2Zsb3dGYWlsdXJlTWVzc2FnZSIsImhhbmRsZVNlbGVjdERlbW9Nb2RlIiwiaGFuZGxlU2VsZWN0WmVyb01vZGUiLCJzZXRTZWxlY3RlZFBhdGllbnRJZCIsInNldFNjaGVkdWxlRGF0ZUZpbHRlciIsInNjaGVkdWxlRGF0ZUZpbHRlciIsImhhbmRsZUZpbmlzaE9uYm9hcmRpbmciLCJyZXNldHRpbmciLCJzZXRSZXNldHRpbmciLCJjbGluaWNBdXRoZWQiLCJzZXRDbGluaWNBdXRoZWQiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic3RhZmZBdXRoZWQiLCJzZXRTdGFmZkF1dGhlZCIsInNob3dTdGFmZlBpblBhZCIsInNldFNob3dTdGFmZlBpblBhZCIsImFjdGl2ZVN0YWZmVXNlciIsInNldEFjdGl2ZVN0YWZmVXNlciIsImNhdGNoIiwiZSIsImNvbnNvbGUiLCJ3YXJuIiwicmVtb3ZlSXRlbSIsInN0YWZmVG9rZW4iLCJmZXRjaCIsImhlYWRlcnMiLCJyIiwib2siLCJqc29uIiwiZGF0YSIsInVzZXIiLCJ0aW1lciIsInJlc2V0VGltZXIiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZXZlbnRzIiwiZm9yRWFjaCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhc3NpdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGFuZGxlQ2xpbmljTG9nb3V0IiwiaGFuZGxlTG9ja1Nlc3Npb24iLCJjcCIsInVwIiwiY2xpbmljU2V0dGluZ3MiLCJzdGFmZiIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwibWluSGVpZ2h0IiwicGFkZGluZyIsImJhY2tncm91bmQiLCJvdmVyZmxvd1kiLCJtYXhXaWR0aCIsIndpZHRoIiwibWFyZ2luIiwiYm94U2hhZG93IiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwiYm9yZGVyQm90dG9tIiwicGFkZGluZ0JvdHRvbSIsIm1hcmdpbkJvdHRvbSIsInRleHRUcmFuc2Zvcm0iLCJmb250U2l6ZSIsImxldHRlclNwYWNpbmciLCJjb2xvciIsImZvbnRXZWlnaHQiLCJtYXJnaW5Ub3AiLCJnYXAiLCJtYXAiLCJzdGVwIiwiaW5kZXgiLCJmbGV4IiwiaWQiLCJib3JkZXJDb2xvciIsInRpdGxlIiwiZGV0YWlsIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImFsaWduSXRlbXMiLCJ0ZXh0QWxpZ24iLCJjdXJzb3IiLCJ0cmFuc2l0aW9uIiwiY2xpbmljTmFtZSIsImV2ZW50IiwidGFyZ2V0IiwidmFsdWUiLCJwaG9uZSIsImZsZXhXcmFwIiwicm9sZSIsImp1c3RpZnlDb250ZW50IiwibG9hZEVycm9yIiwibG9jYXRpb24iLCJoYXNoIiwidG9kYXlJc28iLCJ3YXJuaW5ncyIsInNpbGVudCIsImxlbmd0aCIsInVuZGVmaW5lZCIsIk9iamVjdCIsImtleXMiLCJzcGVjaWFsdHkiLCJtb2RlIiwicHJvZmlsZSIsInRpbWV6b25lIiwib3B0aW9uIiwibGFiZWwiLCJkZWZhdWx0VmlzaXRNaW51dGVzIiwicmVwbGFjZSIsInNsaWNlIiwid29ya2RheVN0YXJ0Iiwid29ya2RheUVuZCIsImFwcG9pbnRtZW50QnVmZmVyTWludXRlcyIsImRheSIsIndvcmtpbmdEYXlzIiwiaW5jbHVkZXMiLCJsZWdhbE5hbWUiLCJpbm4iLCJrcHAiLCJvZ3JuIiwiYWRkcmVzcyIsIm1lZGljYWxMaWNlbnNlTnVtYmVyIiwibWVkaWNhbExpY2Vuc2VJc3N1ZWRBdCIsIm1lZGljYWxMaWNlbnNlSXNzdWVyIiwiam9pbiIsImZpbHRlciIsIm1lbWJlciIsInNjaGVkdWxlRHJhZnQiLCJ3b3JraW5nSG91cnMiLCJzY2hlZHVsZVNhdmVTdGF0ZSIsInNjaGVkdWxlRGlydHkiLCJoYXMiLCJzY2hlZHVsZVNhdmluZyIsInNjaGVkdWxlU2F2ZUxhYmVsIiwiZnVsbE5hbWUiLCJzcGVjaWFsdGllcyIsIml0ZW0iLCJzdGFydCIsImVuZCIsImNoYWlycyIsImNoYWlyIiwiYWN0aXZlIiwibmFtZSIsInNwZWNpYWxpemF0aW9uIiwia2luZCIsImJvdFVzZXJuYW1lIiwid2ViaG9va1JlYWR5IiwicGVuZGluZ0xpbmtDb2RlQ291bnQiLCJhY3RpdmVDaGF0TGlua0NvdW50IiwiZmllbGQiLCJrZXkiLCJoZWxwIiwicHJldmVudERlZmF1bHQiLCJub19waGlfYnlfZGVmYXVsdCIsImxpbWl0ZWRfYWRtaW5fb25seSIsImNvbnNlbnRlZF9waGlfdGVtcGxhdGVzIiwicGxhY2Vob2xkZXIiLCJmZWF0dXJlIiwicmVkdWNlIiwidG90YWwiLCJncm91cCIsImtpbmRzIiwiaW1hZ2luZyIsInNjaGVkdWxlIiwicGF0aWVudHMiLCJ2aXNpdCIsImRvY3VtZW50cyIsImZpbmFuY2UiLCJjb21tdW5pY2F0aW9ucyIsImNvbXBsaWFuY2VXYXJuaW5ncyIsIndhcm5pbmciLCJzZXR0aW5ncyIsInZpZXciLCJxIiwiZGF0ZSIsIl9jMjEiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdGF0aWMgdGVzdCBjb21wbGlhbmNlIG1hdGNoZXM6XG4vLyBvdXRjb21lLFxuLy8gc2V0U2VsZWN0ZWRQYXRpZW50SWQocGF0aWVudC5pZClcblxuaW1wb3J0IHsgdXNlQXBwTG9naWMgfSBmcm9tICcuL3VzZUFwcExvZ2ljJztcbmltcG9ydCB7IFZvaWNlQXNzaXN0YW50VUkgfSBmcm9tICcuL2NvbXBvbmVudHMvVm9pY2VBc3Npc3RhbnRVSSc7XG5pbXBvcnQgeyBPbW5pYmFyIH0gZnJvbSAnLi9jb21wb25lbnRzL09tbmliYXInO1xuaW1wb3J0IHsgQ29tbWFuZFBhbGV0dGUgfSBmcm9tICcuL2NvbXBvbmVudHMvQ29tbWFuZFBhbGV0dGUnO1xuaW1wb3J0IHsgQXV0aEh1YiB9IGZyb20gJy4vY29tcG9uZW50cy9hdXRoL0F1dGhIdWInO1xuaW1wb3J0IHsgU3RhZmZQaW5QYWQgfSBmcm9tICcuL2NvbXBvbmVudHMvYXV0aC9TdGFmZlBpblBhZCc7XG5cbmltcG9ydCB7IHVzZUFwcFN0b3JlIH0gZnJvbSBcIi4vc3RvcmUvYXBwU3RvcmVcIjtcbmltcG9ydCB7IHVzZUltYWdpbmdTdG9yZSB9IGZyb20gXCIuL3N0b3JlL2ltYWdpbmdTdG9yZVwiO1xuaW1wb3J0IHsgdXNlVmlzaXRTdG9yZSB9IGZyb20gXCIuL3N0b3JlL3Zpc2l0U3RvcmVcIjtcbmltcG9ydCB7IHVzZVBhdGllbnRTdG9yZSB9IGZyb20gXCIuL3N0b3JlL3BhdGllbnRTdG9yZVwiO1xuaW1wb3J0IHsgdXNlU2NoZWR1bGVTdG9yZSB9IGZyb20gXCIuL3N0b3JlL3NjaGVkdWxlU3RvcmVcIjtcbmltcG9ydCB7IHVzZVNldHRpbmdzU3RvcmUgfSBmcm9tIFwiLi9zdG9yZS9zZXR0aW5nc1N0b3JlXCI7XG5pbXBvcnQge1xuICB0eXBlIENTU1Byb3BlcnRpZXMsXG4gIHR5cGUgS2V5Ym9hcmRFdmVudCxcbiAgbGF6eSxcbiAgU3VzcGVuc2UsXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZVxufSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7XG4gIEFycm93UmlnaHQsXG4gIEFsZXJ0VHJpYW5nbGUsXG4gIEJvdCxcbiAgQnVpbGRpbmcyLFxuICBDYWxlbmRhckRheXMsXG4gIENoZWNrLFxuICBDaGVja0NpcmNsZTIsXG4gIENsaXBib2FyZENoZWNrLFxuICBDbGlwYm9hcmRMaXN0LFxuICBDb3B5LFxuICBDcmVkaXRDYXJkLFxuICBEYXRhYmFzZSxcbiAgRG93bmxvYWQsXG4gIEV4dGVybmFsTGluayxcbiAgRmlsZUNoZWNrMixcbiAgRmlsZVRleHQsXG4gIEZsaXBIb3Jpem9udGFsLFxuICBHYXVnZSxcbiAgSGlzdG9yeSxcbiAgSW1hZ2UgYXMgSW1hZ2VJY29uLFxuICBNZXNzYWdlU3F1YXJlLFxuICBNaWMsXG4gIFBob25lLFxuICBQbHVzLFxuICBSZWNlaXB0VGV4dCxcbiAgUmVmcmVzaEN3LFxuICBSb3RhdGVDY3csXG4gIFJvdGF0ZUN3LFxuICBTZWFyY2gsXG4gIFNlbmQsXG4gIFNoaWVsZENoZWNrLFxuICBTcGFya2xlcyxcbiAgVXBsb2FkQ2xvdWQsXG4gIFVzZXJDaGVjayxcbiAgVXNlcnMsXG4gIFpvb21JbixcbiAgWm9vbU91dFxufSBmcm9tIFwibHVjaWRlLXJlYWN0XCI7XG5pbXBvcnQge1xuICBidWlsZFJ1bGVCYXNlZFZpc2l0RHJhZnRGcm9tVHJhbnNjcmlwdCxcbiAgZGFzaGJvYXJkU2NoZW1hLFxuICBkb2N1bWVudEFtb3VudFNvdXJjZSxcbiAgZG9jdW1lbnRGYWN0b3J5R3JvdXBzLFxuICBkb2N1bWVudEtpbmRNZXRhZGF0YSxcbiAgZG9jdW1lbnRTb3VyY2VTdGF0dXNMYWJlbHMsXG4gIG5vcm1hbGl6ZURlbnRhbFNwZWVjaFRyYW5zY3JpcHQsXG4gIHR5cGUgQWNjZXB0VmlzaXREcmFmdFJlc3BvbnNlLFxuICB0eXBlIEFpSm9iS2luZCxcbiAgdHlwZSBBaVJlY29nbml0aW9uSm9iLFxuICB0eXBlIEFpUmVjb2duaXRpb25Kb2JSZXNwb25zZSxcbiAgdHlwZSBBaVJlY29nbml0aW9uVGFyZ2V0LFxuICB0eXBlIEFwcG9pbnRtZW50LFxuICB0eXBlIENsaW5pY1Byb2ZpbGUsXG4gIHR5cGUgQ2xpbmljTW9kZSxcbiAgdHlwZSBDbGluaWNhbFRvb3RoUm93LFxuICB0eXBlIENyZWF0ZUFwcG9pbnRtZW50SW5wdXQsXG4gIHR5cGUgRGFzaGJvYXJkLFxuICB0eXBlIERlbnRhbFByaWNlbGlzdEFuYWx5c2lzUmVzcG9uc2UsXG4gIHR5cGUgRGVudGFsU3BlY2lhbHR5LFxuICB0eXBlIERlbnRlVGVsZWdyYW1Cb3RNb2RlLFxuICB0eXBlIERlbnRlVGVsZWdyYW1Cb3RTdGF0dXMsXG4gIHR5cGUgRGVudGVUZWxlZ3JhbUNoYXRMaW5rTGlzdFJlc3BvbnNlLFxuICB0eXBlIERlbnRlVGVsZWdyYW1DaGF0TGlua1B1YmxpYyxcbiAgdHlwZSBEZW50ZVRlbGVncmFtRmVhdHVyZSxcbiAgdHlwZSBEZW50ZVRlbGVncmFtTGlua0NvZGVDcmVhdGVkLFxuICB0eXBlIERlbnRlVGVsZWdyYW1MaW5rQ29kZUxpc3RSZXNwb25zZSxcbiAgdHlwZSBEZW50ZVRlbGVncmFtTGlua0NvZGVQdWJsaWMsXG4gIHR5cGUgRGVudGVUZWxlZ3JhbU1lc3NhZ2VQcmV2aWV3LFxuICB0eXBlIERlbnRlVGVsZWdyYW1PdXRib3hSZXNwb25zZSxcbiAgdHlwZSBEZW50ZVRlbGVncmFtT3V0Ym94U2VuZER1ZVJlc3BvbnNlLFxuICB0eXBlIERlbnRlVGVsZWdyYW1PdXRib3hTZW5kUmVzcG9uc2UsXG4gIHR5cGUgRGVudGVUZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheUhvdXJzQnlUb3BpYyxcbiAgdHlwZSBEZW50ZVRlbGVncmFtUHJpdmFjeU1vZGUsXG4gIHR5cGUgRGVudGVUZWxlZ3JhbVZpc3VhbENhcmRLZXksXG4gIHR5cGUgRGVudGVUZWxlZ3JhbVZpc3VhbENhcmRVcmxzLFxuICB0eXBlIERvY3VtZW50Q2hhaW5TdW1tYXJ5LFxuICB0eXBlIERvY3VtZW50QXVkaXRGYWN0cyxcbiAgdHlwZSBEb2N1bWVudElzc3VlU2lnbmF0dXJlTW9kZSxcbiAgdHlwZSBEb2N1bWVudFZvaWRSZWFzb25Db2RlLFxuICB0eXBlIERvY3VtZW50U291cmNlU3RhdHVzLFxuICB0eXBlIERvY3VtZW50UGF5bG9hZCxcbiAgdHlwZSBEb2N1bWVudEluZ2VzdGlvblJlc3BvbnNlLFxuICB0eXBlIERvY3VtZW50SW5nZXN0aW9uVGFyZ2V0LFxuICB0eXBlIENsaW5pY1B1YmxpY0xvb2t1cFJlc3BvbnNlLFxuICB0eXBlIENvbW11bmljYXRpb25UYXNrT3V0Y29tZSxcbiAgdHlwZSBHZW5lcmF0ZWREb2N1bWVudCxcbiAgdHlwZSBEaWNvbVJlbmRlckNhY2hlUGxhblJlc3BvbnNlLFxuICB0eXBlIERpY29tRmlyc3RGcmFtZVByZXZpZXdSZXNwb25zZSxcbiAgdHlwZSBEaWNvbUxvY2FsRm9sZGVyRGlzY292ZXJ5UmVzcG9uc2UsXG4gIHR5cGUgRGljb21TZXJpZXNQcmV2aWV3R3JvdXAsXG4gIHR5cGUgRGljb21TZXJpZXNQcmV2aWV3UmVzcG9uc2UsXG4gIHR5cGUgRGljb21Gb2xkZXJTZXJpZXNQcmV2aWV3UmVzcG9uc2UsXG4gIHR5cGUgRGljb21Gb2xkZXJXb3JrdXBQYXRoLFxuICB0eXBlIERpY29tRm9sZGVyV29ya3VwUGxhblJlc3BvbnNlLFxuICB0eXBlIERpY29tVmlld2VyTGF1bmNoTWFuaWZlc3RSZXNwb25zZSxcbiAgdHlwZSBEaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZVJlc3BvbnNlLFxuICB0eXBlIERpY29tVmlld2VyV29ya2JlbmNoTWFuaWZlc3RSZXNwb25zZSxcbiAgdHlwZSBEaWNvbVdlYkNvbm5lY3RvckNoZWNrUmVzcG9uc2UsXG4gIHR5cGUgRGljb21Xb3JrYmVuY2hCdW5kbGUsXG4gIHR5cGUgRGljb21Xb3JrYmVuY2hCdW5kbGVMaXN0UmVzcG9uc2UsXG4gIHR5cGUgRGljb21Xb3JrYmVuY2hCdW5kbGVSZXNwb25zZSxcbiAgdHlwZSBEaWNvbVdvcmtzdGF0aW9uQ2xpZW50RmFjdHMsXG4gIHR5cGUgRGljb21Xb3Jrc3RhdGlvblJlYWRpbmVzc1Jlc3BvbnNlLFxuICB0eXBlIEltYWdpbmdGb2xkZXJTY2FuUmVzcG9uc2UsXG4gIHR5cGUgSW1hZ2luZ0ltcG9ydENvbW1pdFJlc3BvbnNlLFxuICB0eXBlIEltYWdpbmdJbXBvcnRQcmV2aWV3UmVzcG9uc2UsXG4gIHR5cGUgSW1hZ2luZ1NvdXJjZUtpbmQsXG4gIHR5cGUgSW1hZ2luZ1N0dWR5S2luZCxcbiAgdHlwZSBJbWFnaW5nVmlld2VyQW5ub3RhdGlvbixcbiAgdHlwZSBJbWFnaW5nVmlld2VySW1wbGFudFBsYW4sXG4gIHR5cGUgSW1hZ2luZ1ZpZXdlclNlc3Npb25SZXNwb25zZSxcbiAgdHlwZSBJbWFnaW5nVmlld2VyU2Vzc2lvblN0YXRlLFxuICB0eXBlIEltYWdpbmdWaWV3ZXJUb29sLFxuICB0eXBlIEltYWdpbmdWaWV3ZXJXaW5kb3dQcmVzZXQsXG4gIHR5cGUgSW50ZWdyYXRpb25DYXBhYmlsaXR5LFxuICB0eXBlIEludGVncmF0aW9uQ2F0ZWdvcnksXG4gIHR5cGUgSW50ZWdyYXRpb25QcmVzZXRTdGF0dXMsXG4gIHR5cGUgSW1wb3J0Q29tbWl0UmVzcG9uc2UsXG4gIHR5cGUgSXNzdWVEb2N1bWVudElucHV0LFxuICB0eXBlIFZvaWREb2N1bWVudElucHV0LFxuICB0eXBlIEltcG9ydEludGFrZVJlc3BvbnNlLFxuICB0eXBlIEltcG9ydFByZXZpZXdSZXNwb25zZSxcbiAgdHlwZSBJbXBvcnRTb3VyY2VLaW5kLFxuICB0eXBlIEluc3RhbGxtZW50UGF5bWVudFN0YXR1cyxcbiAgdHlwZSBMb2NhbEltYWdpbmdPcmdhbml6ZXJSZXNwb25zZSxcbiAgdHlwZSBNaWdyYXRpb25BdXRvcGlsb3RSZXNwb25zZSxcbiAgdHlwZSBNaWdyYXRpb25Mb2NhbFNvdXJjZURpc2NvdmVyeVJlc3BvbnNlLFxuICB0eXBlIE1pZ3JhdGlvbkxvY2FsU291cmNlUHJvYmVSZXNwb25zZSxcbiAgdHlwZSBNaWdyYXRpb25Mb2NhbFNvdXJjZVdvcmt1cFJlc3BvbnNlLFxuICB0eXBlIExvY2FsQnJpZGdlUmVhZGluZXNzUmVzcG9uc2UsXG4gIHR5cGUgTG9jYWxCcmlkZ2VTdGF0dXMsXG4gIHR5cGUgTG9jYWxCcmlkZ2VVc2VQYXRoLFxuICB0eXBlIExvY2FsQnJpZGdlVXNlUGxhbnNSZXNwb25zZSxcbiAgdHlwZSBPdXRwYXRpZW50TWVkaWNhbENhcmQwMjV1UGF5bG9hZCxcbiAgdHlwZSBQYXltZW50TWV0aG9kLFxuICB0eXBlIFBhdGllbnQsXG4gIHR5cGUgUGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZSxcbiAgdHlwZSBQYXRpZW50SW50YWtlUHJlZ25hbmN5U3RhdHVzLFxuICB0eXBlIFBob3RvVmlkZW9Db25zZW50TWF0ZXJpYWwsXG4gIHR5cGUgUG9zdFZpc2l0Q2FyZVRvcGljLFxuICB0eXBlIFByaWNlbGlzdFNvdXJjZUtpbmQsXG4gIHR5cGUgUHJvY2VkdXJlU3BlY2lmaWNDb25zZW50UHJvY2VkdXJlLFxuICB0eXBlIFByb3RvY29sVGVtcGxhdGUsXG4gIHR5cGUgUmVzb3VyY2VMb2FkLFxuICB0eXBlIFNjaGVkdWxlV2FybmluZyxcbiAgdHlwZSBTbWFydEltcG9ydENvbW1pdFJlc3BvbnNlLFxuICB0eXBlIFNtYXJ0SW1wb3J0TW9kZSxcbiAgdHlwZSBTbWFydEltcG9ydFByZXZpZXdSZXNwb25zZSxcbiAgdHlwZSBTcGVlY2hDaHVua1VwbG9hZElucHV0LFxuICB0eXBlIFNwZWVjaEdhdGV3YXlIZWFsdGhSZXBvcnQsXG4gIHR5cGUgU3BlZWNoR2F0ZXdheVN0YXR1cyxcbiAgdHlwZSBTcGVlY2hQcm92aWRlckNvbm5lY3RvcixcbiAgdHlwZSBTcGVlY2hQcm92aWRlclJ1bnRpbWVTdGF0dXMsXG4gIHR5cGUgU3BlZWNoUmVjb3JkaW5nQXNzZW1ibHksXG4gIHR5cGUgU3BlZWNoUmVjb3JkaW5nUmVjb3ZlcnlMaXN0LFxuICB0eXBlIFNwZWVjaFJlY29yZGluZ1N0cmF0ZWd5LFxuICB0eXBlIFNwZWVjaFRyYW5zY3JpcHRQb2xpc2hSZXNwb25zZSxcbiAgdHlwZSBTcGVlY2hUcmFuc2NyaXB0aW9uUmVzcG9uc2UsXG4gIHR5cGUgU3BlZWNoUHJvdmlkZXIsXG4gIHR5cGUgU3RhZmZSb2xlLFxuICB0eXBlIFN0YWZmV29ya2luZ0hvdXJzLFxuICB0eXBlIFRheERlZHVjdGlvbkFwcGxpY2F0aW9uRGVsaXZlcnlDaGFubmVsLFxuICB0eXBlIFRheERlZHVjdGlvbkFwcGxpY2F0aW9uRm9ybSxcbiAgdHlwZSBUYXhEZWR1Y3Rpb25BcHBsaWNhdGlvblJlbGF0aW9uc2hpcCxcbiAgdHlwZSBUcmVhdG1lbnRQbGFuQWNjZXB0YW5jZVZhcmlhbnQsXG4gIHR5cGUgVXBkYXRlQXBwb2ludG1lbnRJbnB1dCxcbiAgdHlwZSBVcGRhdGVDbGluaWNQcm9maWxlSW5wdXQsXG4gIHR5cGUgVXBkYXRlUGF0aWVudElucHV0LFxuICB0eXBlIFVwZGF0ZVBhdGllbnRBZG1pbmlzdHJhdGl2ZVByb2ZpbGVJbnB1dCxcbiAgdHlwZSBVaUxhbmd1YWdlLFxuICB0eXBlIFZpc2l0RHJhZnRBdXRvc2F2ZVJlc3BvbnNlLFxuICB0eXBlIFZpc2l0Tm90ZURyYWZ0LFxuICB0eXBlIFhyYXlDYmN0UmVmZXJyYWxQcmVnbmFuY3lTdGF0dXMsXG4gIHR5cGUgWHJheUNiY3RSZWZlcnJhbFByaW9yaXR5LFxuICB0eXBlIFhyYXlDYmN0UmVmZXJyYWxTdHVkeVR5cGVcbn0gZnJvbSBcIkBkZW50YWwvc2hhcmVkXCI7XG5pbXBvcnQgeyBBcHBMb2FkaW5nU3RhdGUsIEFwcFVubG9ja1N0YXRlIH0gZnJvbSBcIi4vQXBwQm9vdFN0YXRlXCI7XG5pbXBvcnQge1xuICBicm93c2VyQ29udGludWl0eVJlZ2lzdHJhdGlvbkxhYmVscyxcbiAgZm9ybWF0Qnl0ZVNpemUsXG4gIGZvcm1hdE1lZ2FieXRlcyxcbiAgaW5zcGVjdEJyb3dzZXJDb250aW51aXR5LFxuICB0eXBlIEJyb3dzZXJDb250aW51aXR5U3RhdHVzXG59IGZyb20gXCIuL2Jyb3dzZXJDb250aW51aXR5XCI7XG5pbXBvcnQgeyBDbGluaWNhbFJ1bGVQYW5lbCB9IGZyb20gXCIuL0NsaW5pY2FsUnVsZVBhbmVsXCI7XG5pbXBvcnQge1xuICBjb21tdW5pY2F0aW9uRG9jdW1lbnRUYXNrQWN0aW9uTGFiZWxzLFxuICB0ZWxlZ3JhbUNhcmVSZXF1ZXN0VGFza0NhcmVUb3BpY3MsXG4gIHRlbGVncmFtQ2FyZVJlcXVlc3RXb3JrZmxvd0NhcmVUb3BpY3MsXG4gIHRlbGVncmFtRG9jdW1lbnRSZXF1ZXN0VGFza0RvY3VtZW50S2luZHMsXG4gIHRlbGVncmFtRG9jdW1lbnRSZXF1ZXN0V29ya2Zsb3dEb2N1bWVudEtpbmRzXG59IGZyb20gXCIuL2NvbW11bmljYXRpb25UYXNrRGF0YVwiO1xuaW1wb3J0IHsgaW1hZ2luZ0Nvbm5lY3RvckNhcmRzLCBpbWFnaW5nVmlld2VyQ2FwYWJpbGl0aWVzLCByZWNvZ25pdGlvblByZXNldHMgfSBmcm9tIFwiLi9zZXR0aW5nc1N0YXRpY0RhdGFcIjtcbmltcG9ydCB7IG1vdGlvblNhZmVTY3JvbGxJbnRvVmlldyB9IGZyb20gXCIuL21vdGlvblByZWZlcmVuY2VcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZVJ1YkFtb3VudElucHV0LCB2YWxpZGF0ZVJ1YkFtb3VudElucHV0IH0gZnJvbSBcIi4vcnViQW1vdW50SW5wdXRcIjtcbmltcG9ydCB7XG4gIGltYWdpbmdDYXB0dXJlRGlzdGFuY2VNcyxcbiAgaW1hZ2luZ0NvbXBhcmlzb25SZWFzb24sXG4gIGltYWdpbmdDb21wYXJpc29uU2NvcmUsXG4gIHR5cGUgSW1hZ2luZ1N0dWR5Um93XG59IGZyb20gXCIuL2ltYWdpbmdDb21wYXJpc29uXCI7XG5pbXBvcnQge1xuICBkaWNvbUxhYmVsLFxuICBkaWNvbURpYWdub3N0aWNQaXhlbFBvbGljeUxhYmVscyxcbiAgZGljb21FeGVjdXRpb25MYW5lTGFiZWxzLFxuICBkaWNvbUdwdUNsYXNzTGFiZWxzLFxuICBkaWNvbVF1YWxpdHlNb2RlTGFiZWxzLFxuICBkaWNvbVJlYWRpbmVzc0NoZWNrTGFiZWxzLFxuICBkaWNvbVJlbmRlck1lbW9yeUJ1ZGdldENsYXNzTGFiZWxzLFxuICBkaWNvbVJ1bnRpbWVUaWVyTGFiZWxzLFxuICBkaWNvbVNlcmllc1ZpZXdlckxhYmVscyxcbiAgZGljb21UZXh0dXJlU3RyYXRlZ3lMYWJlbHMsXG4gIGRpY29tVmlld2VyTGF1bmNoTW9kZUxhYmVscyxcbiAgZGljb21XZWJTdGF0dXNMYWJlbHMsXG4gIGltYWdpbmdLaW5kTGFiZWxzLFxuICBpbWFnaW5nU291cmNlRGV0YWlscyxcbiAgaW1hZ2luZ1NvdXJjZUxhYmVscyxcbiAgaW1hZ2luZ1ZpZXdlclRvb2xMYWJlbHMsXG4gIGxvY2FsSW1hZ2luZ01vZGVsUm9sZUxhYmVscyxcbiAgbG9jYWxJbWFnaW5nT3JnYW5pemVyQWN0aW9uTGFiZWxzLFxuICBtcHJBeGlzUHJlc2V0RGVnLFxuICBtcHJDYWNoZU1vZGVMYWJlbHMsXG4gIG1wckNsaW5pY2FsUHJlc2V0cyxcbiAgbXByTG9hZFN0cmF0ZWd5TGFiZWxzLFxuICBtcHJQcm9qZWN0aW9uTGFiZWxzLFxuICBtcHJQcm9qZWN0aW9uT3JpZW50YXRpb25MYWJlbHMsXG4gIG1wclJlc291cmNlVGllckxhYmVscyxcbiAgbXByU2xhYlByZXNldE1tLFxuICBtcHJUb29sTGFiZWxzLFxuICBtcHJTZXJpZXNSZXF1aXJlZFByb2plY3Rpb25MYWJlbCxcbiAgbXByVW5hdmFpbGFibGVQcm9qZWN0aW9uTGFiZWwsXG4gIG1wcldpbmRvd1ByZXNldExhYmVscyxcbiAgcG9saWN5QXVkaXRFdmVudExhYmVscyxcbiAgcHJpY2VsaXN0UGFyc2VyTW9kZUxhYmVscyxcbiAgdHlwZSBNcHJDbGluaWNhbFByZXNldCxcbiAgdHlwZSBNcHJQcm9qZWN0aW9uLFxuICB0eXBlIE1wcldpbmRvd1ByZXNldFxufSBmcm9tIFwiLi9pbWFnaW5nVWlMYWJlbHNcIjtcbmltcG9ydCB7IHR5cGUgQ3RQbGFubmluZ0FydGlmYWN0Q29tbWFuZCB9IGZyb20gXCIuL2N0UGxhbm5pbmdBcnRpZmFjdENvbW1hbmRzXCI7XG5pbXBvcnQge1xuICBDdFBsYW5uaW5nVG9vbHNQYW5lbCxcbiAgZmluZEN0UGxhbm5pbmdRdWlja0FjdGlvbkZvckFydGlmYWN0Q29tbWFuZCxcbiAgdHlwZSBDdEltcGxhbnRMaWJyYXJ5SXRlbSxcbiAgdHlwZSBDdFBsYW5uaW5nUXVpY2tBY3Rpb25cbn0gZnJvbSBcIi4vY3RQbGFubmluZ1Rvb2xzXCI7XG5pbXBvcnQge1xuICBjbGFtcE1wckF4aXNEZWcsXG4gIGNsYW1wTXByU2xpY2VJbmRleCxcbiAgY2xhbXBNcHJTbGFiTW0sXG4gIGZvcm1hdFNpZ25lZE1wclN0ZXAsXG4gIGZvcm1hdE1wckF4aXNBbmdsZUJhZGdlLFxuICBmb3JtYXRNcHJBeGlzRGlyZWN0aW9uTGFiZWwsXG4gIGZvcm1hdE1wckF4aXNSYW5nZVZhbHVlLFxuICBmb3JtYXRNcHJBeGlzVmlzdWFsaXplckxhYmVsLFxuICBmb3JtYXRNcHJTbGljZUJhZGdlLFxuICBmb3JtYXRNcHJTbGljZVJhbmdlVmFsdWUsXG4gIGZvcm1hdE1wclNsYWJCYWRnZSxcbiAgZm9ybWF0TXByU2xhYlJhbmdlVmFsdWUsXG4gIGJ1aWxkTXByQXhpc0d1aWRhbmNlLFxuICBtcHJBeGlzQm91bmRzLFxuICBtcHJBeGlzTnVkZ2VEZWcsXG4gIG1wclByb2plY3Rpb25Db21wYXNzTGFiZWxzLFxuICBtcHJTbGljZUZyYWN0aW9uLFxuICBtcHJTbGljZUluZGV4RnJvbUZyYWN0aW9uLFxuICBtcHJTbGljZU51ZGdlU3RlcHMsXG4gIG1wclNsaWNlUHJlc2V0RnJhY3Rpb25zLFxuICBtcHJTbGFiQm91bmRzLFxuICBtcHJTbGFiTnVkZ2VNbSxcbiAgcmVzb2x2ZU1wcktleWJvYXJkQWRqdXN0bWVudFxufSBmcm9tIFwiLi9tcHJDb250cm9sTWF0aFwiO1xuaW1wb3J0IHtcbiAgYnVpbGRNcHJDbGluaWNhbENoZWNrbGlzdCxcbiAgYnVpbGRNcHJPcGVyYXRvclN1bW1hcnksXG4gIGJ1aWxkTXByV29ya2JlbmNoU3VtbWFyeSxcbiAgZGVzY3JpYmVNcHJDbGluaWNhbFByZXNldFByb2plY3Rpb25GYWxsYmFjayxcbiAgZmluZE5lYXJlc3RNcHJDbGluaWNhbFByZXNldCxcbiAgbXByQ2xpbmljYWxOZXh0QWN0aW9uLFxuICByZXNvbHZlTXByQ2xpbmljYWxQcmVzZXRQcm9qZWN0aW9uXG59IGZyb20gXCIuL21wckNsaW5pY2FsU3RhdHVzXCI7XG5pbXBvcnQgeyBwb3N0VmlzaXRDYXJlUHJlc2V0cyB9IGZyb20gXCIuL3Bvc3RWaXNpdENhcmVEYXRhXCI7XG5pbXBvcnQge1xuICBkZW50YWxNYXRlcmlhbEtpbmRMYWJlbHMsXG4gIGRlbnRhbFJlc3RvcmF0aW9uVHlwZUxhYmVscyxcbiAgcHJpY2VsaXN0SXRlbU1hdGVyaWFsVGV4dCxcbiAgcHJpY2VsaXN0TWF0ZXJpYWxTdW1tYXJ5VGV4dCxcbiAgcHJpY2VsaXN0UmVjb2duaXRpb25CcmFuZEdyb3VwcyxcbiAgcHJpY2VsaXN0UmVjb2duaXRpb25TZXJ2aWNlR3JvdXBzLFxuICBwcmljZWxpc3RTb3VyY2VLaW5kTGFiZWxzLFxuICBwcmljZWxpc3RXYXJuaW5nc1RleHRcbn0gZnJvbSBcIi4vcHJpY2VsaXN0VWlNZXRhXCI7XG5pbXBvcnQgeyBzcGVjaWFsdHlRdWlja1BocmFzZUxpYnJhcnkgfSBmcm9tIFwiLi92aXNpdERpY3RhdGlvbkRhdGFcIjtcbmltcG9ydCB7IGluZmVyRGFzaGJvYXJkVmlzaXRTcGVjaWFsdHksIGluZmVyU3BlY2lhbHR5RnJvbVRleHQsIHZpc2l0U3BlY2lhbHR5Rm9jdXNPcHRpb25zIH0gZnJvbSBcIi4vdmlzaXRTcGVjaWFsdHlEYXRhXCI7XG5pbXBvcnQgeyBBY3Rpb25JY29uLCBhcHBWaWV3cywgZ2V0RmlsdGVyZWRBcHBWaWV3cywgdmlld0xhYmVscywgV29ya3NwYWNlU2lkZWJhciwgV29ya3NwYWNlVG9wYmFyIH0gZnJvbSBcIi4vd29ya3NwYWNlU2hlbGxcIjtcbmltcG9ydCB7IHByZWxvYWRXb3Jrc3BhY2VWaWV3LCBzY2hlZHVsZUlkbGVXb3Jrc3BhY2VQcmVsb2FkIH0gZnJvbSBcIi4vd29ya3NwYWNlUHJlbG9hZFwiO1xuaW1wb3J0IHsgV29ya3NwYWNlQ29udGludWl0eVN0cmlwIH0gZnJvbSBcIi4vd29ya3NwYWNlQ29udGludWl0eVN0cmlwXCI7XG5pbXBvcnQgeyBXb3Jrc3BhY2VSb3V0ZUVycm9yQm91bmRhcnkgfSBmcm9tIFwiLi93b3Jrc3BhY2VSb3V0ZUVycm9yQm91bmRhcnlcIjtcbmltcG9ydCB7XG4gIGRlZmF1bHRUZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheURyYWZ0cyxcbiAgZGVmYXVsdFRlbGVncmFtUG9zdFZpc2l0Q2hlY2t1cERlbGF5SG91cnNCeVRvcGljLFxuICBwb3N0VmlzaXRDYXJlVG9waWNPcHRpb25zLFxuICB0ZWxlZ3JhbUZlYXR1cmVIZWxwLFxuICB0ZWxlZ3JhbUZlYXR1cmVMYWJlbHMsXG4gIHRlbGVncmFtRmVhdHVyZU9wdGlvbnMsXG4gIHRlbGVncmFtUG9zdFZpc2l0Q2hlY2t1cERlbGF5RmllbGRzLFxuICB0ZWxlZ3JhbVZpc3VhbENhcmRGaWVsZHMsXG4gIHR5cGUgVGVsZWdyYW1Qb3N0VmlzaXRDaGVja3VwRGVsYXlEcmFmdHMsXG4gIHR5cGUgVGVsZWdyYW1Qb3N0VmlzaXRDaGVja3VwRGVsYXlLZXlcbn0gZnJvbSBcIi4vd29ya3NwYWNlU3RhdGljT3B0aW9uc1wiO1xuXG5pbXBvcnQge1xuICBhcHBvaW50bWVudExhYmVscyxcbiAgY2xpbmljYWxSdWxlQWN0aW9uTGFiZWxzLFxuICBjbGluaWNhbFJ1bGVTZXZlcml0eUxhYmVscyxcbiAgY2xpbmljYWxSdWxlU3VtbWFyeUZvclVpLFxuICBjbGluaWNNb2RlTGFiZWxzLFxuICBjb21tdW5pY2F0aW9uQ2hhbm5lbExhYmVscyxcbiAgY29tbXVuaWNhdGlvbkludGVudExhYmVscyxcbiAgY29tbXVuaWNhdGlvblByaW9yaXR5TGFiZWxzLFxuICBjb21tdW5pY2F0aW9uU3RhdHVzTGFiZWxzLFxuICBjb21wbGV0ZWRBY3RDb250cmFjdFJlZmVyZW5jZUZvclVpLFxuICBkaWNvbUZvbGRlcldvcmt1cFBhdGhMYWJlbHMsXG4gIGRvY3VtZW50QWN0aW9uTGFiZWxzLFxuICBkb2N1bWVudExhYmVscyxcbiAgZG9jdW1lbnRTb3VyY2VTdGF0dXNDbGFzc05hbWVzLFxuICBkb2N1bWVudFN0YXR1c0xhYmVscyxcbiAgaW50ZWdyYXRpb25DYXBhYmlsaXR5TGFiZWxzLFxuICBpbnRlZ3JhdGlvbkNhdGVnb3J5TGFiZWxzLFxuICBpbnRlZ3JhdGlvblN0YXR1c0xhYmVscyxcbiAgbG9jYWxCcmlkZ2VTdGF0dXNMYWJlbHMsXG4gIGxvY2FsQnJpZGdlVXNlUGF0aExhYmVscyxcbiAgbW9uZXlEb2N1bWVudEtpbmRzLFxuICBwYXltZW50RmlzY2FsUmVjZWlwdExhYmVsRm9yVWksXG4gIHBheW1lbnRNZXRob2RMYWJlbHMsXG4gIHBheW1lbnRUYXhZZWFyRm9yVWksXG4gIHJlY29nbml0aW9uVGFyZ2V0TGFiZWxzLFxuICBzY2VuYXJpb1ByaW9yaXR5TGFiZWxzLFxuICBzY2VuYXJpb1N0cmF0ZWd5TGFiZWxzLFxuICBzZXJ2aWNlQ2F0ZWdvcnlMYWJlbHMsXG4gIHNwZWNpYWx0eUxhYmVscyxcbiAgc3BlZWNoUHJvdmlkZXJIZWFsdGhMYWJlbHMsXG4gIHNwZWVjaFByb3ZpZGVyTW9kZUxhYmVscyxcbiAgc3BlZWNoUHJvdmlkZXJTZWxlY3Rpb25MYWJlbHMsXG4gIHNwZWVjaFByb3ZpZGVyU3RhdHVzTGFiZWxzLFxuICBzcGVlY2hSZWNvcmRpbmdQYXRoTGFiZWxzLFxuICBzcGVlY2hSZWNvdmVyeVN0YXRlTGFiZWxzLFxuICBzdGFmZlJvbGVMYWJlbHMsXG4gIHN0cnVjdHVyZWRQYXlsb2FkRG9jdW1lbnRLaW5kcyxcbiAgdGF4UGF5bWVudFBheWVyS2V5Rm9yVWksXG4gIHRheFBheW1lbnRTZWxlY3Rpb25Eb2N1bWVudEtpbmRzLFxuICB0YXhQYXltZW50U2VsZWN0aW9uUGF5bG9hZERvY3VtZW50S2luZHMsXG4gIHRyZWF0bWVudFN0YXR1c0xhYmVscyxcbiAgd2FybmluZ1NldmVyaXR5TGFiZWxzLFxuICB3b3JrbG9hZFN0YXRlTGFiZWxzXG59IGZyb20gXCIuL3dvcmtzcGFjZVVpTGFiZWxzXCI7XG5jb25zdCBJbWFnaW5nVmlldyA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi9JbWFnaW5nVmlld1wiKS50aGVuKChtb2R1bGUpID0+ICh7IGRlZmF1bHQ6IG1vZHVsZS5JbWFnaW5nVmlldyB9KSkpO1xuY29uc3QgVmlzaXRWaWV3ID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL1Zpc2l0Vmlld1wiKS50aGVuKChtb2R1bGUpID0+ICh7IGRlZmF1bHQ6IG1vZHVsZS5WaXNpdFZpZXcgfSkpKTtcbmNvbnN0IEZpbmFuY2VWaWV3ID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL0ZpbmFuY2VWaWV3XCIpLnRoZW4oKG1vZHVsZSkgPT4gKHsgZGVmYXVsdDogbW9kdWxlLkZpbmFuY2VWaWV3IH0pKSk7XG5jb25zdCBDb21tdW5pY2F0aW9uc1ZpZXcgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vQ29tbXVuaWNhdGlvbnNWaWV3XCIpLnRoZW4oKG1vZHVsZSkgPT4gKHsgZGVmYXVsdDogbW9kdWxlLkNvbW11bmljYXRpb25zVmlldyB9KSkpO1xuY29uc3QgRG9jdW1lbnRzVmlldyA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi9Eb2N1bWVudHNWaWV3XCIpLnRoZW4oKG1vZHVsZSkgPT4gKHsgZGVmYXVsdDogbW9kdWxlLkRvY3VtZW50c1ZpZXcgfSkpKTtcbmNvbnN0IFNldHRpbmdzVmlldyA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi9TZXR0aW5nc1ZpZXdcIikudGhlbigobW9kdWxlKSA9PiAoeyBkZWZhdWx0OiBtb2R1bGUuU2V0dGluZ3NWaWV3IH0pKSk7XG5jb25zdCBTY2hlZHVsZVZpZXcgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vU2NoZWR1bGVWaWV3XCIpLnRoZW4oKG1vZHVsZSkgPT4gKHsgZGVmYXVsdDogbW9kdWxlLlNjaGVkdWxlVmlldyB9KSkpO1xuY29uc3QgUGF0aWVudHNWaWV3ID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL1BhdGllbnRzVmlld1wiKS50aGVuKChtb2R1bGUpID0+ICh7IGRlZmF1bHQ6IG1vZHVsZS5QYXRpZW50c1ZpZXcgfSkpKTtcbmNvbnN0IFNoaWZ0VmlldyA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi9TaGlmdFZpZXdcIikudGhlbigobW9kdWxlKSA9PiAoeyBkZWZhdWx0OiBtb2R1bGUuU2hpZnRWaWV3IH0pKSk7XG5jb25zdCBQYXRpZW50Q29ja3BpdCA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi9TaGlmdFZpZXdcIikudGhlbigobW9kdWxlKSA9PiAoeyBkZWZhdWx0OiBtb2R1bGUuUGF0aWVudENvY2twaXQgfSkpKTtcbmNvbnN0IE1hcmtldGluZ1ZpZXcgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vTWFya2V0aW5nVmlld1wiKS50aGVuKChtb2R1bGUpID0+ICh7IGRlZmF1bHQ6IG1vZHVsZS5NYXJrZXRpbmdWaWV3IH0pKSk7XG5cbmZ1bmN0aW9uIHNwZWVjaEdhdGV3YXlDYW5VcGxvYWQoc3RhdHVzOiBTcGVlY2hHYXRld2F5U3RhdHVzIHwgbnVsbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gQm9vbGVhbihzdGF0dXM/LnNlcnZlclRyYW5zY3JpcHRpb25DdXJyZW50bHlBdmFpbGFibGUgPz8gc3RhdHVzPy5zZXJ2ZXJUcmFuc2NyaXB0aW9uRW5hYmxlZCk7XG59XG5cbmltcG9ydCB7XG4gIEltYWdpbmdWaWV3ZXJTdGF0ZSxcbiAgSW1hZ2luZ1ZpZXdlclBsYW4sXG4gIENiY3RXb3JrYmVuY2hQbGFuZSxcbiAgTXByQXhpc1Zpc3VhbGl6ZXJTdHlsZSxcbiAgdmlld2VyV2luZG93UHJlc2V0Rm9yU3R1ZHksXG4gIGRlZmF1bHRJbWFnaW5nVmlld2VyU3RhdGUsXG4gIGRlZmF1bHREaWNvbUZpcnN0RnJhbWVWaWV3ZXJTdGF0ZSxcbiAgSW1hZ2luZ1ZpZXdlckxvY2FsRHJhZnQsXG4gIEltYWdpbmdWaWV3ZXJTYXZlU3RhdGUsXG4gIERpY29tV29ya2JlbmNoTG9jYWxEcmFmdCxcbiAgRGljb21Xb3JrYmVuY2hJbmRleGVkRGJEcmFmdCxcbiAgTXByV29ya2JlbmNoU3RhdGUsXG4gIE1wcldvcmtiZW5jaExvY2FsRHJhZnQsXG4gIE1wcldvcmtiZW5jaEluZGV4ZWREYkRyYWZ0LFxuICBMb2NhbEltYWdpbmdGb2xkZXJEcmFmdCxcbiAgRGljb21GaXJzdEZyYW1lUHJldmlld01ldGFkYXRhLFxuICBEaWNvbUZpcnN0RnJhbWVQcmV2aWV3UmVxdWVzdENvbnRleHQsXG4gIERpY29tRmlyc3RGcmFtZVByZXZpZXdPcHRpb25zLFxuICBCcm93c2VyRmlsZVN5c3RlbUZpbGVIYW5kbGUsXG4gIEJyb3dzZXJGaWxlU3lzdGVtRGlyZWN0b3J5SGFuZGxlLFxuICBCcm93c2VyRmlsZVN5c3RlbUhhbmRsZSxcbiAgQnJvd3NlckRpcmVjdG9yeVBpY2tlcldpbmRvdyxcbiAgRGVudGFsRGVza3RvcFJ1bnRpbWVXaW5kb3csXG4gIEJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyUHJldmlldyxcbiAgQnJvd3NlclBpY2tlZEltYWdpbmdTY2FuU3RhdHMsXG4gIEJyb3dzZXJJbWFnaW5nU2NhblBoYXNlLFxuICBCcm93c2VySW1hZ2luZ1NjYW5Qcm9ncmVzcyxcbiAgQnJvd3NlckltYWdpbmdTY2FuT3B0aW9ucyxcbiAgTG9jYWxEaWNvbU9wZXJhdGlvbk9wdGlvbnMsXG4gIEJyb3dzZXJJbWFnaW5nU2NhblJ1bnRpbWUsXG4gIEJyb3dzZXJNaWdyYXRpb25Tb3VyY2VLaW5kLFxuICBCcm93c2VyTWlncmF0aW9uRmlsZUtpbmQsXG4gIEJyb3dzZXJNaWdyYXRpb25Gb2xkZXJTdGF0cyxcbiAgQnJvd3Nlck1pZ3JhdGlvblNjYW5TdGF0cyxcbiAgQnJvd3Nlck1pZ3JhdGlvblNjYW5QaGFzZSxcbiAgQnJvd3Nlck1pZ3JhdGlvblNjYW5Qcm9ncmVzcyxcbiAgQnJvd3Nlck1pZ3JhdGlvblNjYW5PcHRpb25zLFxuICBCcm93c2VyTWlncmF0aW9uU2NhblJ1bnRpbWUsXG4gIGltYWdpbmdWaWV3ZXJMb2NhbFN0b3JhZ2VQcmVmaXgsXG4gIGRpY29tV29ya2JlbmNoTG9jYWxTdG9yYWdlS2V5LFxuICBtcHJXb3JrYmVuY2hMb2NhbFN0b3JhZ2VQcmVmaXgsXG4gIGxvY2FsSW1hZ2luZ0ZvbGRlclN0b3JhZ2VLZXksXG4gIGJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyU3RvcmFnZUtleSxcbiAgYnJvd3Nlck1pZ3JhdGlvblNjYW5GaWxlTGltaXQsXG4gIGJyb3dzZXJNaWdyYXRpb25TY2FuRm9sZGVyTGltaXQsXG4gIGJyb3dzZXJNaWdyYXRpb25TY2FuRGlyZWN0b3J5RW50cnlMaW1pdCxcbiAgYnJvd3Nlck1pZ3JhdGlvblNjYW5NYWdpY1JlYWRMaW1pdCxcbiAgYnJvd3Nlck1pZ3JhdGlvblNjYW5ZaWVsZEV2ZXJ5VW5pdHMsXG4gIGJyb3dzZXJNaWdyYXRpb25TY2FuWWllbGRFdmVyeU1zLFxuICBicm93c2VyTWlncmF0aW9uU2NhblByb2dyZXNzRXZlcnlVbml0cyxcbiAgYnJvd3Nlck1pZ3JhdGlvblNjYW5Qcm9ncmVzc0V2ZXJ5TXMsXG4gIGJyb3dzZXJJbWFnaW5nU2NhbkZpbGVMaW1pdCxcbiAgYnJvd3NlckltYWdpbmdTY2FuRm9sZGVyTGltaXQsXG4gIGJyb3dzZXJJbWFnaW5nU2NhbkRpcmVjdG9yeUVudHJ5TGltaXQsXG4gIGJyb3dzZXJJbWFnaW5nU2Nhbk1hZ2ljUmVhZExpbWl0LFxuICBicm93c2VySW1hZ2luZ1NjYW5ZaWVsZEV2ZXJ5VW5pdHMsXG4gIGJyb3dzZXJJbWFnaW5nU2NhbllpZWxkRXZlcnlNcyxcbiAgYnJvd3NlckltYWdpbmdTY2FuUHJvZ3Jlc3NFdmVyeVVuaXRzLFxuICBicm93c2VySW1hZ2luZ1NjYW5Qcm9ncmVzc0V2ZXJ5TXMsXG4gIHVpUHJlZmVyZW5jZXNTdG9yYWdlS2V5LFxuICBkb2N1bWVudFBheW1lbnRTZWxlY3Rpb25TdG9yYWdlS2V5LFxuICBkb2N1bWVudFBheWxvYWREcmFmdFN0b3JhZ2VLZXksXG4gIGRvY3VtZW50SXNzdWVTaWduYXR1cmVTdG9yYWdlS2V5LFxuICB1aVByZWZlcmVuY2VzU2VydmVyUGF0aCxcbiAgb25ib2FyZGluZ1N0b3JhZ2VLZXksXG4gIGNsaW5pY1Byb2ZpbGVFbmRwb2ludCxcbiAgZGVudGVBZG1pblNlY3JldEhlYWRlck5hbWUsXG4gIGxvY2FsQ29udmVuaWVuY2VSZXRlbnRpb25NcyxcbiAgc2Vuc2l0aXZlTG9jYWxEcmFmdFJldGVudGlvbk1zLFxuICBzcGVlY2hBdWRpb1F1ZXVlUmV0ZW50aW9uTXMsXG4gIERvY3VtZW50UGF5bWVudFNlbGVjdGlvbkVudHJ5LFxuICBEb2N1bWVudFBheW1lbnRTZWxlY3Rpb25TdG9yZSxcbiAgT3V0cGF0aWVudDAyNXVEb2N1bWVudERyYWZ0RmllbGRzLFxuICBNZWRpY2FsUmVjb3JkRXh0cmFjdERvY3VtZW50RHJhZnRGaWVsZHMsXG4gIERvY3VtZW50UGF5bG9hZERyYWZ0RW50cnksXG4gIERvY3VtZW50UGF5bG9hZERyYWZ0U3RvcmUsXG4gIERvY3VtZW50SXNzdWVTaWduYXR1cmVEcmFmdCxcbiAgZG9jdW1lbnRJc3N1ZVNpZ25hdHVyZU1vZGVMYWJlbHMsXG4gIGRvY3VtZW50Vm9pZFJlYXNvbkxhYmVscyxcbiAgYnJvd3NlckdlbmVyYXRlZElkLFxuICBjdXJyZW50TG9jYWxEYXRlVGltZUlucHV0VmFsdWUsXG4gIG5vcm1hbGl6ZWREb2N1bWVudElzc3VlU2lnbmF0dXJlTW9kZSxcbiAgb3JnYW5pemF0aW9uU2NvcGVkTG9jYWxTdG9yYWdlS2V5LFxuICBub3JtYWxpemVkTG9jYWxPcmdhbml6YXRpb25JZCxcbiAgbG9jYWxTYXZlZEF0RnJlc2gsXG4gIGRvY3VtZW50SXNzdWVTaWduYXR1cmVMb2NhbEtleSxcbiAgZG9jdW1lbnRQYXltZW50U2VsZWN0aW9uTG9jYWxLZXksXG4gIGRvY3VtZW50UGF5bG9hZERyYWZ0TG9jYWxLZXksXG4gIG9uYm9hcmRpbmdMb2NhbEtleSxcbiAgbG9hZERvY3VtZW50SXNzdWVTaWduYXR1cmVEcmFmdCxcbiAgc2F2ZURvY3VtZW50SXNzdWVTaWduYXR1cmVEcmFmdCxcbiAgZW1wdHlEb2N1bWVudFBheW1lbnRTZWxlY3Rpb25TdG9yZSxcbiAgbm9ybWFsaXplZERvY3VtZW50UGF5bWVudFNlbGVjdGlvbklkcyxcbiAgbG9hZERvY3VtZW50UGF5bWVudFNlbGVjdGlvblN0b3JlLFxuICBsb2FkRG9jdW1lbnRQYXltZW50U2VsZWN0aW9uLFxuICBzYXZlRG9jdW1lbnRQYXltZW50U2VsZWN0aW9uLFxuICB0b2RheURhdGVJbnB1dFZhbHVlLFxuICBkYXRlSW5wdXRWYWx1ZVBsdXNEYXlzLFxuICBlbXB0eU91dHBhdGllbnQwMjV1RG9jdW1lbnREcmFmdEZpZWxkcyxcbiAgZG9jdW1lbnRQYXlsb2FkRHJhZnRLZXksXG4gIGVtcHR5RG9jdW1lbnRQYXlsb2FkRHJhZnRTdG9yZSxcbiAgbm9ybWFsaXplZE91dHBhdGllbnQwMjV1Q29kZSxcbiAgbG9jYWxEcmFmdFN0cmluZyxcbiAgbm9ybWFsaXplT3V0cGF0aWVudDAyNXVEb2N1bWVudERyYWZ0RmllbGRzLFxuICBlbXB0eU1lZGljYWxSZWNvcmRFeHRyYWN0RG9jdW1lbnREcmFmdEZpZWxkcyxcbiAgbm9ybWFsaXplTWVkaWNhbFJlY29yZEV4dHJhY3REb2N1bWVudERyYWZ0RmllbGRzLFxuICBsb2FkRG9jdW1lbnRQYXlsb2FkRHJhZnRTdG9yZSxcbiAgbG9hZE91dHBhdGllbnQwMjV1RG9jdW1lbnREcmFmdCxcbiAgc2F2ZU91dHBhdGllbnQwMjV1RG9jdW1lbnREcmFmdCxcbiAgbG9hZE1lZGljYWxSZWNvcmRFeHRyYWN0RG9jdW1lbnREcmFmdCxcbiAgc2F2ZU1lZGljYWxSZWNvcmRFeHRyYWN0RG9jdW1lbnREcmFmdCxcbiAgaW1hZ2luZ1ZpZXdlckxvY2FsS2V5LFxuICBsb2FkTG9jYWxJbWFnaW5nVmlld2VyRHJhZnQsXG4gIGRpY29tV29ya2JlbmNoU2VyaWVzS2V5LFxuICBvZmZsaW5lRHJhZnRPcmdhbml6YXRpb25LZXksXG4gIGRpY29tV29ya2JlbmNoSW5kZXhlZERiS2V5LFxuICBtcHJXb3JrYmVuY2hJbmRleGVkRGJLZXksXG4gIG5vcm1hbGl6ZUxvY2FsRGljb21Xb3JrYmVuY2hEcmFmdCxcbiAgbmV3ZXJEaWNvbVdvcmtiZW5jaERyYWZ0LFxuICBsb2FkTG9jYWxEaWNvbVdvcmtiZW5jaERyYWZ0RnJvbUxvY2FsU3RvcmFnZSxcbiAgbXByV29ya2JlbmNoU2VyaWVzS2V5LFxuICBtcHJXb3JrYmVuY2hMb2NhbEtleSxcbiAgaXNNcHJQcm9qZWN0aW9uLFxuICBpc01wcldpbmRvd1ByZXNldCxcbiAgcmVzb2x2ZU1wcldvcmtiZW5jaFByb2plY3Rpb24sXG4gIG5vcm1hbGl6ZU1wcldvcmtiZW5jaFN0YXRlLFxuICBsb2FkTG9jYWxNcHJXb3JrYmVuY2hEcmFmdEZyb21Mb2NhbFN0b3JhZ2UsXG4gIHNhdmVMb2NhbE1wcldvcmtiZW5jaERyYWZ0VG9Mb2NhbFN0b3JhZ2UsXG4gIGxvY2FsSW1hZ2luZ0ZvbGRlckZpbmdlcnByaW50LFxuICBkaWNvbURvd25sb2FkUmVkYWN0aW9uV2FybmluZyxcbiAgdW5pcXVlRGljb21Eb3dubG9hZFdhcm5pbmdzLFxuICBpc0xvY2FsRGljb21Eb3dubG9hZFBhdGgsXG4gIHJlZGFjdGVkTG9jYWxEaWNvbURvd25sb2FkUGF0aCxcbiAgcmVkYWN0ZWREaWNvbURvd25sb2FkUmVmZXJlbmNlSWQsXG4gIHJlZGFjdERpY29tRG93bmxvYWRUZXh0LFxuICByZWRhY3RlZERpY29tRG93bmxvYWRXYXJuaW5ncyxcbiAgcmVkYWN0ZWREaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZUZvckRvd25sb2FkLFxuICByZWRhY3RlZERpY29tV29ya2JlbmNoTWFuaWZlc3RGb3JEb3dubG9hZCxcbiAgY2xhc3NpZnlCcm93c2VySW1hZ2luZ0ZpbGVOYW1lLFxuICBicm93c2VyTWlncmF0aW9uU291cmNlVGl0bGVzLFxuICBicm93c2VyTGVnYWN5TWlzVGV4dFBhdHRlcm4sXG4gIGNsYXNzaWZ5QnJvd3Nlck1pZ3JhdGlvbkZpbGVOYW1lLFxuICBicm93c2VyTWlncmF0aW9uRm9sZGVySGludFNjb3JlLFxuICBicm93c2VyTWlncmF0aW9uU291cmNlS2luZEZyb21TdGF0cyxcbiAgYnVpbGRCcm93c2VyTWlncmF0aW9uRGlzY292ZXJ5LFxuICBicm93c2VyRmlsZUhhc0RpY29tTWFnaWMsXG4gIGJyb3dzZXJJbWFnaW5nU2Nhbk5vd01zLFxuICBjcmVhdGVCcm93c2VySW1hZ2luZ1NjYW5SdW50aW1lLFxuICBicm93c2VySW1hZ2luZ1NjYW5FbGFwc2VkRnJvbUlzbyxcbiAgdGhyb3dJZkJyb3dzZXJJbWFnaW5nU2NhbkFib3J0ZWQsXG4gIGlzQnJvd3NlckltYWdpbmdTY2FuQWJvcnRFcnJvcixcbiAgYnJvd3NlckltYWdpbmdTY2FuWWllbGQsXG4gIGJyb3dzZXJJbWFnaW5nU2NhblByb2dyZXNzRnJvbVN0YXRzLFxuICBwdWJsaXNoQnJvd3NlckltYWdpbmdTY2FuUHJvZ3Jlc3MsXG4gIG1heWJlWWllbGRCcm93c2VySW1hZ2luZ1NjYW4sXG4gIGNyZWF0ZUJyb3dzZXJNaWdyYXRpb25TY2FuUnVudGltZSxcbiAgdGhyb3dJZkJyb3dzZXJNaWdyYXRpb25TY2FuQWJvcnRlZCxcbiAgaXNCcm93c2VyTWlncmF0aW9uU2NhbkFib3J0RXJyb3IsXG4gIGJyb3dzZXJNaWdyYXRpb25TY2FuUHJvZ3Jlc3NGcm9tU3RhdHMsXG4gIHB1Ymxpc2hCcm93c2VyTWlncmF0aW9uU2NhblByb2dyZXNzLFxuICBtYXliZVlpZWxkQnJvd3Nlck1pZ3JhdGlvblNjYW4sXG4gIGFkZEJyb3dzZXJNaWdyYXRpb25LaW5kVG9TY2FuU3RhdHMsXG4gIGJyb3dzZXJQaWNrZWRGb2xkZXJGaW5nZXJwcmludCxcbiAgc2F2ZUJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyUHJldmlldyxcbiAgbG9hZEJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyUHJldmlldyxcbiAgcmVtb3ZlQnJvd3NlclBpY2tlZEltYWdpbmdGb2xkZXJQcmV2aWV3LFxuICBidWlsZEJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyUHJldmlldyxcbiAgbG9hZExvY2FsSW1hZ2luZ0ZvbGRlckRyYWZ0LFxuICBzYXZlTG9jYWxJbWFnaW5nRm9sZGVyRHJhZnQsXG4gIHJlbW92ZUxvY2FsSW1hZ2luZ0ZvbGRlckRyYWZ0LFxuICBzYXZlTG9jYWxEaWNvbVdvcmtiZW5jaERyYWZ0VG9Mb2NhbFN0b3JhZ2UsXG4gIGNyZWF0ZUxvY2FsRGljb21Xb3JrYmVuY2hEcmFmdCxcbiAgZGljb21Xb3JrYmVuY2hNYW5pZmVzdEhhc1JlZGFjdGVkU291cmNlLFxuICByZW1vdmVMb2NhbERpY29tV29ya2JlbmNoRHJhZnRGcm9tTG9jYWxTdG9yYWdlLFxuICBoYXNEZW50YWxEZXNrdG9wU2hlbGxCcmlkZ2UsXG4gIGRldGVjdERpY29tUnVudGltZVN1cmZhY2VIaW50LFxuICBjb2xsZWN0RGljb21Xb3Jrc3RhdGlvbkNsaWVudEZhY3RzLFxuICBzYXZlTG9jYWxJbWFnaW5nVmlld2VyRHJhZnQsXG4gIGN0SW1wbGFudFBsYW5Gcm9tTGlicmFyeUl0ZW0sXG4gIGltYWdpbmdWaWV3ZXJQbGFucyxcbiAgaW1hZ2luZ1NvdXJjZUNob2ljZXMsXG4gIHNtYXJ0SW1wb3J0TW9kZUxhYmVscyxcbiAgaW1wb3J0U291cmNlTGFiZWxzLFxuICBpbmdlc3Rpb25UYXJnZXRMYWJlbHMsXG4gIGRvY3VtZW50SW5nZXN0aW9uUXVhbGl0eUxhYmVscyxcbiAgdGVsZWdyYW1CbG9ja2VkUmVhc29uTGFiZWxzLFxuICB0ZWxlZ3JhbVdhcm5pbmdMYWJlbHMsXG4gIHRlbGVncmFtSHVtYW5NZXNzYWdlLFxuICBpc1RlbGVncmFtT3V0Ym94SXRlbUR1ZUZvclVpLFxuICBkb2N1bWVudERldGVjdGVkS2luZExhYmVscyxcbiAgZG9jdW1lbnREZXRlY3RlZEtpbmRMYWJlbCxcbiAgZGljb21GaXJzdEZyYW1lU3RhdHVzTGFiZWxzLFxuICB0b290aFJvd3MsXG4gIHRvb3RoU3RhdGVCeUNvZGUsXG4gIGZvcm1hdFRpbWUsXG4gIHBhdGllbnROYW1lLFxuICBmaW5kUGF0aWVudCxcbiAgbW9uZXksXG4gIG1pbnV0ZXNMYWJlbCxcbiAgZm9ybWF0RGF0ZVRpbWUsXG4gIGZvcm1hdFNob3J0RGF0ZSxcbiAgQnJvd3NlclNwZWVjaFJlY29nbml0aW9uLFxuICBCcm93c2VyV2luZG93V2l0aFNwZWVjaCxcbiAgVmlzaXROb3RlRmllbGQsXG4gIFZpc2l0Tm90ZUZvcm0sXG4gIHZpc2l0Tm90ZUZpZWxkRGVmaW5pdGlvbnMsXG4gIHZpc2l0RHJhZnRRdWFsaXR5TGFiZWxzLFxuICB2aXNpdERyYWZ0U2lnbmFsTGFiZWxzLFxuICB2aXNpdERyYWZ0TWlzc2luZ0ZpZWxkTGFiZWxzLFxuICB2aXNpdERyYWZ0U2lnbmFsTGFiZWwsXG4gIHZpc2l0RHJhZnRNaXNzaW5nRmllbGRMYWJlbCxcbiAgc3BlZWNoUXVhbGl0eUxhYmVscyxcbiAgZW1wdHlWaXNpdE5vdGVGb3JtLFxuICB2aXNpdE5vdGVGb3JtRnJvbVZpc2l0LFxuICB2aXNpdE5vdGVGb3JtRnJvbURyYWZ0LFxuICB2aXNpdE5vdGVEcmFmdEZyb21Gb3JtLFxuICBWaXNpdExvY2FsRHJhZnQsXG4gIFBlbmRpbmdWaXNpdFNhdmUsXG4gIFBlbmRpbmdTcGVlY2hDaHVuayxcbiAgUGVyc2lzdGVuY2VIZWFsdGgsXG4gIFBlcnNpc3RlbmNlQmFja3VwQ2hlY2ssXG4gIFBlcnNpc3RlbmNlSW50ZWdyaXR5UmVwb3J0LFxuICB2aXNpdExvY2FsRHJhZnRLZXksXG4gIHBlbmRpbmdWaXNpdFNhdmVRdWV1ZUtleSxcbiAgcGVuZGluZ1NwZWVjaENodW5rUXVldWVLZXksXG4gIHNwZWVjaENodW5rRGJOYW1lLFxuICBzcGVlY2hDaHVua0RiVmVyc2lvbixcbiAgcGVuZGluZ1Zpc2l0U2F2ZVN0b3JlTmFtZSxcbiAgZGljb21Xb3JrYmVuY2hEcmFmdFN0b3JlTmFtZSxcbiAgbXByV29ya2JlbmNoRHJhZnRTdG9yZU5hbWUsXG4gIHNwZWVjaENodW5rU3RvcmVOYW1lLFxuICBzcGVlY2hMb2NhbFN0b3JhZ2VGYWxsYmFja01heEJ5dGVzLFxuICByZXF1aXJlZFNwZWVjaENodW5rRGJTdG9yZU5hbWVzLFxuICBzcGVlY2hDaHVua0RiUHJvbWlzZSxcbiAgcGVuZGluZ1Zpc2l0U2F2ZVF1ZXVlTG9jYWxLZXksXG4gIHBlbmRpbmdTcGVlY2hDaHVua1F1ZXVlTG9jYWxLZXksXG4gIGxvY2FsUXVldWVPcmdhbml6YXRpb25NYXRjaGVzLFxuICBub3JtYWxpemVTcGVlY2hBcHBlbmRUZXh0LFxuICBhcHBlbmRTcGVlY2hUZXh0V2l0aG91dER1cGxpY2F0ZVRhaWwsXG4gIGlzRGVudGFsU3BlY2lhbHR5LFxuICB0ZWxlZ3JhbVFyU3ZnVG9EYXRhVXJsLFxuICBVaVByZWZlcmVuY2VzLFxuICBVaVByZWZlcmVuY2VzSW5wdXQsXG4gIFRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyLFxuICBUZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyLFxuICB1aUxhbmd1YWdlTGFiZWxzLFxuICBVaUxhbmd1YWdlT3B0aW9uLFxuICBkZWZhdWx0VWlMYW5ndWFnZU9wdGlvbixcbiAgdWlMYW5ndWFnZU9wdGlvbnMsXG4gIGVtcHR5VGVsZWdyYW1WaXN1YWxDYXJkVXJsRHJhZnRzLFxuICB0ZWxlZ3JhbVB1YmxpY1VybFNlbnNpdGl2ZVF1ZXJ5S2V5cyxcbiAgdGVsZWdyYW1QdWJsaWNVcmxTZW5zaXRpdmVQYXRoU2VnbWVudHMsXG4gIG5vcm1hbGl6ZVRlbGVncmFtUHVibGljSHR0cHNVcmxEcmFmdCxcbiAgbm9ybWFsaXplVGVsZWdyYW1WaXN1YWxDYXJkVXJsRHJhZnRzRm9yU2F2ZSxcbiAgbm9ybWFsaXplVGVsZWdyYW1Cb3RVc2VybmFtZURyYWZ0LFxuICBvbmJvYXJkaW5nVGVsZWdyYW1WaXN1YWxDYXJkS2V5cyxcbiAgVGVsZWdyYW1GZWF0dXJlUGxhbixcbiAgVGVsZWdyYW1MaW5rU3ViamVjdFR5cGUsXG4gIHRlbGVncmFtTW9kZUxhYmVscyxcbiAgdGVsZWdyYW1Nb2RlSGludHMsXG4gIHRlbGVncmFtUHJpdmFjeU1vZGVMYWJlbHMsXG4gIHRlbGVncmFtUHJpdmFjeU1vZGVIaW50cyxcbiAgdGVsZWdyYW1UZW1wbGF0ZUxhYmVscyxcbiAgdGVsZWdyYW1DbGFzc2lmaWNhdGlvbkxhYmVscyxcbiAgdGVsZWdyYW1EZWxpdmVyeVN0YXR1c0xhYmVscyxcbiAgdGVsZWdyYW1MaW5rQ29kZVN0YXR1c0xhYmVscyxcbiAgdGVsZWdyYW1PdXRib3hTdGF0dXNGaWx0ZXJPcHRpb25zLFxuICB0ZWxlZ3JhbU91dGJveFN0YXR1c0ZpbHRlckxhYmVscyxcbiAgdGVsZWdyYW1PdXRib3hUZW1wbGF0ZUZpbHRlck9wdGlvbnMsXG4gIHRlbGVncmFtT3V0Ym94VGVtcGxhdGVGaWx0ZXJMYWJlbHMsXG4gIFRlbGVncmFtSW5saW5lQnV0dG9uUHJldmlldyxcbiAgdGVsZWdyYW1JbmxpbmVCdXR0b25LaW5kTGFiZWxzLFxuICB0ZWxlZ3JhbUlubGluZUJ1dHRvblJvd3NGcm9tUmVwbHlNYXJrdXAsXG4gIHRlbGVncmFtSW5saW5lQnV0dG9uc0Zyb21SZXBseU1hcmt1cCxcbiAgdGVsZWdyYW1JbmxpbmVCdXR0b25zRnJvbVByZXZpZXcsXG4gIE9uYm9hcmRpbmdTdGVwLFxuICBvbmJvYXJkaW5nU3RlcFZhbHVlcyxcbiAgQ2xpbmljUHJvZmlsZURyYWZ0LFxuICBDbGluaWNQcm9maWxlU2F2ZVN0YXRlLFxuICBQYXRpZW50Q29yZURyYWZ0LFxuICBQYXRpZW50Q29yZVNhdmVTdGF0ZSxcbiAgUGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZURyYWZ0LFxuICBQYXRpZW50QWRtaW5pc3RyYXRpdmVQcm9maWxlU2F2ZVN0YXRlLFxuICBTdGFmZlNjaGVkdWxlRHJhZnQsXG4gIFN0YWZmU2NoZWR1bGVTYXZlU3RhdGUsXG4gIEFwcG9pbnRtZW50U2NoZWR1bGVEcmFmdCxcbiAgQXBwb2ludG1lbnRTY2hlZHVsZVNhdmVTdGF0ZSxcbiAgZW1wdHlBcHBvaW50bWVudFNjaGVkdWxlRHJhZnQsXG4gIE1lZGljYWxEb2N1bWVudFJlbGVhc2VDaGFubmVsLFxuICBtZWRpY2FsRG9jdW1lbnRSZWxlYXNlQ2hhbm5lbExhYmVscyxcbiAgUGF5bWVudFJlZnVuZENvcnJlY3Rpb25BY3Rpb24sXG4gIFBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uTWV0aG9kLFxuICBwYXltZW50UmVmdW5kQ29ycmVjdGlvbkFjdGlvbk9wdGlvbnMsXG4gIHBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uTWV0aG9kT3B0aW9ucyxcbiAgdHJlYXRtZW50QWNjZXB0YW5jZVZhcmlhbnRPcHRpb25zLFxuICB4cmF5UHJpb3JpdHlPcHRpb25zLFxuICBvdXRwYXRpZW50MDI1dURlbW9ncmFwaGljQ29kZU9wdGlvbnMsXG4gIE91dHBhdGllbnQwMjV1RGVtb2dyYXBoaWNDb2RlLFxuICBwYXRpZW50SW50YWtlUHJlZ25hbmN5U3RhdHVzT3B0aW9ucyxcbiAgdGF4QXBwbGljYXRpb25SZWxhdGlvbnNoaXBPcHRpb25zLFxuICB0YXhBcHBsaWNhdGlvbkZvcm1PcHRpb25zLFxuICB0YXhBcHBsaWNhdGlvbkRlbGl2ZXJ5Q2hhbm5lbE9wdGlvbnMsXG4gIENsaW5pY2FsVG9vdGhTdXJmYWNlLFxuICBDbGluaWNhbFRvb3RoU3RhdHVzLFxuICBjbGluaWNhbFRvb3RoU3VyZmFjZUFsaWFzZXMsXG4gIGNsaW5pY2FsVG9vdGhTdGF0dXNBbGlhc2VzLFxuICBpbnN0YWxsbWVudFBheW1lbnRTdGF0dXNBbGlhc2VzLFxuICBkZWZhdWx0Q2xpbmljYWxUb290aFJvd3NUZXh0LFxuICBub3JtYWxpemVUYXhBcHBsaWNhdGlvblJlbGF0aW9uc2hpcCxcbiAgcHJvY2VkdXJlU3BlY2lmaWNDb25zZW50UHJvY2VkdXJlT3B0aW9ucyxcbiAgeHJheVN0dWR5VHlwZU9wdGlvbnMsXG4gIHhyYXlQcmVnbmFuY3lTdGF0dXNPcHRpb25zLFxuICBwaG90b1ZpZGVvTWF0ZXJpYWxPcHRpb25zLFxuICBkZWZhdWx0VWlQcmVmZXJlbmNlcyxcbiAgYWlKb2JLaW5kUHJlZmVyZW5jZVZhbHVlcyxcbiAgYWlKb2JLaW5kTGFiZWxzLFxuICBpc1JlY29yZEtleSxcbiAgaXNPcHRpb25WYWx1ZSxcbiAgaXNTdHJpbmdVbmlvblZhbHVlLFxuICBpc1VpTGFuZ3VhZ2UsXG4gIG5vcm1hbGl6ZVVpTGFuZ3VhZ2VJbnB1dCxcbiAgaXNTdGFmZlJvbGUsXG4gIGlzUGF5bWVudE1ldGhvZCxcbiAgaXNQcmljZWxpc3RTb3VyY2VLaW5kLFxuICBpc0FpSm9iS2luZCxcbiAgaXNBaVJlY29nbml0aW9uVGFyZ2V0LFxuICBpc0ltcG9ydFNvdXJjZUtpbmQsXG4gIGlzRG9jdW1lbnRJbmdlc3Rpb25UYXJnZXQsXG4gIGlzSW1hZ2luZ1NvdXJjZUtpbmQsXG4gIGlzU21hcnRJbXBvcnRNb2RlLFxuICBpc0ltYWdpbmdLaW5kRmlsdGVyLFxuICBpc0Jvb2xlYW5QcmVmZXJlbmNlLFxuICBpc1RheERvY3VtZW50WWVhclByZWZlcmVuY2UsXG4gIGlzRG9jdW1lbnRLaW5kUHJlZmVyZW5jZSxcbiAgaXNBcHBvaW50bWVudFN0YXR1c0ZpbHRlclByZWZlcmVuY2UsXG4gIGlzVGF4QXBwbGljYXRpb25Gb3JtUHJlZmVyZW5jZSxcbiAgaXNUYXhBcHBsaWNhdGlvbkRlbGl2ZXJ5Q2hhbm5lbFByZWZlcmVuY2UsXG4gIGlzUHJvY2VkdXJlU3BlY2lmaWNDb25zZW50UHJvY2VkdXJlUHJlZmVyZW5jZSxcbiAgaXNQb3N0VmlzaXRDYXJlVG9waWNQcmVmZXJlbmNlLFxuICBpc0RvY3VtZW50SXNzdWVTaWduYXR1cmVNb2RlUHJlZmVyZW5jZSxcbiAgaXNCb3VuZGVkUHJlZmVyZW5jZVN0cmluZyxcbiAgaXNOdWxsYWJsZVByZWZlcmVuY2VTdHJpbmcsXG4gIGlzT25ib2FyZGluZ1N0ZXBQcmVmZXJlbmNlLFxuICBpc1RlbGVncmFtTGlua1N1YmplY3RUeXBlUHJlZmVyZW5jZSxcbiAgaXNUZWxlZ3JhbU91dGJveFN0YXR1c0ZpbHRlclByZWZlcmVuY2UsXG4gIGlzVGVsZWdyYW1PdXRib3hUZW1wbGF0ZUZpbHRlclByZWZlcmVuY2UsXG4gIG5vcm1hbGl6ZWRBcHBvaW50bWVudFN0YXR1cyxcbiAgbm9ybWFsaXplZEFwcG9pbnRtZW50U3RhdHVzRmlsdGVyLFxuICBub3JtYWxpemVkRG9jdW1lbnRLaW5kLFxuICBub3JtYWxpemVkUGF0aWVudEludGFrZVByZWduYW5jeVN0YXR1cyxcbiAgbm9ybWFsaXplZFRheEFwcGxpY2F0aW9uUmVsYXRpb25zaGlwU2VsZWN0LFxuICBub3JtYWxpemVkVGF4QXBwbGljYXRpb25Gb3JtLFxuICBub3JtYWxpemVkVGF4QXBwbGljYXRpb25EZWxpdmVyeUNoYW5uZWwsXG4gIG5vcm1hbGl6ZWRQcm9jZWR1cmVTcGVjaWZpY0NvbnNlbnRQcm9jZWR1cmUsXG4gIG5vcm1hbGl6ZWRUcmVhdG1lbnRQbGFuQWNjZXB0YW5jZVZhcmlhbnQsXG4gIG5vcm1hbGl6ZWRQb3N0VmlzaXRDYXJlVG9waWMsXG4gIG5vcm1hbGl6ZWRYcmF5U3R1ZHlUeXBlLFxuICBub3JtYWxpemVkWHJheVByaW9yaXR5LFxuICBub3JtYWxpemVkWHJheVByZWduYW5jeVN0YXR1cyxcbiAgbm9ybWFsaXplZE91dHBhdGllbnQwMjV1RGVtb2dyYXBoaWNDb2RlLFxuICBub3JtYWxpemVkTWVkaWNhbERvY3VtZW50UmVsZWFzZUNoYW5uZWwsXG4gIG5vcm1hbGl6ZWRQYXltZW50UmVmdW5kQ29ycmVjdGlvbkFjdGlvbixcbiAgbm9ybWFsaXplZFBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uTWV0aG9kLFxuICBub3JtYWxpemVkRG9jdW1lbnRWb2lkUmVhc29uQ29kZSxcbiAgbm9ybWFsaXplZENsaW5pY2FsUnVsZUFjdGlvbixcbiAgbm9ybWFsaXplZENsaW5pY2FsUnVsZVNldmVyaXR5LFxuICBub3JtYWxpemVkU3RhZmZSb2xlLFxuICBub3JtYWxpemVkRGVudGFsU3BlY2lhbHR5LFxuICBub3JtYWxpemVkU2VydmljZUNhdGVnb3J5LFxuICBub3JtYWxpemVkVGVsZWdyYW1Cb3RNb2RlLFxuICBub3JtYWxpemVkVGVsZWdyYW1Qcml2YWN5TW9kZSxcbiAgbm9ybWFsaXplZFRlbGVncmFtTGlua1N1YmplY3RUeXBlLFxuICBub3JtYWxpemVkVGVsZWdyYW1PdXRib3hTdGF0dXNGaWx0ZXIsXG4gIG5vcm1hbGl6ZWRUZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyLFxuICBwaWNrVWlQcmVmZXJlbmNlLFxuICBub3JtYWxpemVVaVByZWZlcmVuY2VzUGF5bG9hZCxcbiAgbG9hZFVpUHJlZmVyZW5jZXMsXG4gIHdpdGhTYXZlZFVpUHJlZmVyZW5jZVRpbWVzdGFtcCxcbiAgcGVyc2lzdFVpUHJlZmVyZW5jZXMsXG4gIHNhdmVVaVByZWZlcmVuY2VzLFxuICBkZW50ZUFkbWluU2VjcmV0UmVxdWVzdEhlYWRlcnMsXG4gIGxvYWRTZXJ2ZXJVaVByZWZlcmVuY2VzLFxuICBzYXZlU2VydmVyVWlQcmVmZXJlbmNlcyxcbiAgdWlQcmVmZXJlbmNlc1N5bmNFcnJvck1lc3NhZ2UsXG4gIHJlc3BvbnNlU3RhdHVzRmFpbHVyZUxhYmVsLFxuICByZXNwb25zZUVycm9yTWVzc2FnZSxcbiAgV29ya2Zsb3dSZXNwb25zZUVycm9yLFxuICBhY2NlcHRlZFZpc2l0U2F2ZUZhaWx1cmVJc1JldHJ5YWJsZSxcbiAgcmVxdWVzdEZhaWx1cmVNZXNzYWdlLFxuICB0ZWNobmljYWxXb3JrZmxvd0ZhaWx1cmVQYXR0ZXJuLFxuICBvcGVyYXRvclJlYWRhYmxlRXJyb3JEZXRhaWwsXG4gIG9wZXJhdG9yUmVhZGFibGVFcnJvckRldGFpbEZyb21Vbmtub3duLFxuICBvcGVyYXRvcldvcmtmbG93RmFpbHVyZU1lc3NhZ2UsXG4gIGJyb3dzZXJMb2NhbFNvdXJjZUVycm9yTWVzc2FnZSxcbiAgYnJvd3NlckNhcGFiaWxpdHlGYWlsdXJlTWVzc2FnZSxcbiAgT25ib2FyZGluZ0Rpc21pc3NhbFN0YXRlLFxuICBwYXJzZU9uYm9hcmRpbmdEaXNtaXNzYWxTdGF0ZSxcbiAgbG9hZE9uYm9hcmRpbmdEaXNtaXNzYWxTdGF0ZSxcbiAgbWVyZ2VMb2NhbE9uYm9hcmRpbmdEaXNtaXNzYWwsXG4gIHNhdmVPbmJvYXJkaW5nRGlzbWlzc2VkLFxuICB3ZWVrZGF5T3B0aW9ucyxcbiAgZGVmYXVsdFdvcmtpbmdEYXlzLFxuICB2YWxpZENsb2NrVGltZSxcbiAgbm9ybWFsaXplQ2xvY2tUaW1lLFxuICBub3JtYWxpemVXb3JraW5nRGF5c0RyYWZ0LFxuICBub3JtYWxpemVPcHRpb25hbFdvcmtpbmdEYXlzRHJhZnQsXG4gIHN0YWZmV29ya2luZ0hvdXJzRnJvbVNpbXBsZURyYWZ0LFxuICBzdGFmZlNjaGVkdWxlRHJhZnRGcm9tV29ya2luZ0hvdXJzLFxuICBhcHBvaW50bWVudFNjaGVkdWxlRHJhZnRGcm9tQXBwb2ludG1lbnQsXG4gIHRpbWVab25lT2Zmc2V0TWludXRlcyxcbiAgdGltZVpvbmVPZmZzZXRTdWZmaXgsXG4gIHRpbWVab25lRGF0ZVBhcnRzLFxuICB0b0RhdGVUaW1lTG9jYWxWYWx1ZSxcbiAgZnJvbURhdGVUaW1lTG9jYWxWYWx1ZSxcbiAgYWRkTWludXRlc1RvQ2xpbmljRGF0ZVRpbWVMb2NhbCxcbiAgd2Vla2RheUZyb21EYXRlSW5wdXQsXG4gIGRlZmF1bHRBcHBvaW50bWVudFN0YXJ0TG9jYWwsXG4gIG5ld0FwcG9pbnRtZW50RHJhZnRGcm9tRGFzaGJvYXJkLFxuICBpc1ZhbGlkRGF0ZVBhcnRzLFxuICB0b0RhdGVJbnB1dFZhbHVlLFxuICBpc0RhdGVJbnB1dFZhbHVlLFxuICBpc0RhdGVUaW1lTG9jYWxJbnB1dFZhbHVlLFxuICBudWxsYWJsZUFwcG9pbnRtZW50RHJhZnRWYWx1ZSxcbiAgYXBwb2ludG1lbnRVcGRhdGVJbnB1dEZyb21EcmFmdCxcbiAgYXBwb2ludG1lbnRDcmVhdGVJbnB1dEZyb21EcmFmdCxcbiAgYXBwb2ludG1lbnRTY2hlZHVsZURyYWZ0U2lnbmF0dXJlLFxuICBhcHBvaW50bWVudFNjaGVkdWxlRGF0ZU1pc3NpbmdTdGVwcyxcbiAgYXBwb2ludG1lbnRTY2hlZHVsZU1pc3NpbmdGaWVsZHMsIC8vIHJldHVybiBhcHBvaW50bWVudFNjaGVkdWxlTWlzc2luZ0ZpZWxkcyhkcmFmdCwgZGFzaGJvYXJkPy5jbGluaWNTZXR0aW5ncy5wcm9maWxlLm1vZGUpO1xuICBzdGFmZldvcmtpbmdIb3Vyc0Zyb21EcmFmdCxcbiAgc3RhZmZTY2hlZHVsZURyYWZ0U2lnbmF0dXJlLFxuICBkZWZhdWx0U3RhZmZTY2hlZHVsZURyYWZ0LFxuICBlbXB0eUNsaW5pY1Byb2ZpbGVEcmFmdCxcbiAgY2xpbmljUHJvZmlsZURyYWZ0RnJvbVByb2ZpbGUsXG4gIG51bGxhYmxlQ2xpbmljRHJhZnRWYWx1ZSxcbiAgZW1wdHlQYXRpZW50Q29yZURyYWZ0LFxuICBwYXRpZW50Q29yZURyYWZ0RnJvbVBhdGllbnQsXG4gIGVtcHR5UGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZURyYWZ0LFxuICBwYXRpZW50QWRtaW5pc3RyYXRpdmVQcm9maWxlRHJhZnRGcm9tUGF0aWVudCxcbiAgbnVsbGFibGVQYXRpZW50RHJhZnRWYWx1ZSxcbiAgYnVpbGRQYXRpZW50Q29yZVBheWxvYWQsXG4gIHBhdGllbnRDb3JlRHJhZnRTaWduYXR1cmUsXG4gIGJ1aWxkUGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZVBheWxvYWQsXG4gIHBhdGllbnRBZG1pbmlzdHJhdGl2ZVByb2ZpbGVEcmFmdFNpZ25hdHVyZSxcbiAgcGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZURyYWZ0SXNzdWUsXG4gIGJ1aWxkQ2xpbmljUHJvZmlsZVVwZGF0ZVBheWxvYWQsXG4gIGNsaW5pY1Byb2ZpbGVEcmFmdFNpZ25hdHVyZSxcbiAgY2xpbmljTGVnYWxNaXNzaW5nRmllbGRzLFxuICBjbGluaWNMZWdhbFJlYWRpbmVzc1BlcmNlbnQsXG4gIGlzVmlzaXROb3RlRm9ybSxcbiAgbG9hZFZpc2l0TG9jYWxEcmFmdCxcbiAgc2F2ZVZpc2l0TG9jYWxEcmFmdCxcbiAgaXNOdWxsYWJsZVN0cmluZyxcbiAgaXNWaXNpdE5vdGVEcmFmdCxcbiAgcGFyc2VQZW5kaW5nVmlzaXRTYXZlUXVldWUsXG4gIG5vcm1hbGl6ZVBlbmRpbmdWaXNpdFNhdmUsXG4gIHNvcnRQZW5kaW5nVmlzaXRTYXZlcyxcbiAgbG9hZFBlbmRpbmdWaXNpdFNhdmVzRnJvbUxvY2FsU3RvcmFnZSxcbiAgc2F2ZVBlbmRpbmdWaXNpdFNhdmVzVG9Mb2NhbFN0b3JhZ2UsXG4gIGlzUGVuZGluZ1NwZWVjaENodW5rLFxuICBub3JtYWxpemVQZW5kaW5nU3BlZWNoQ2h1bmssXG4gIHNvcnRQZW5kaW5nU3BlZWNoQ2h1bmtzLFxuICBsb2FkUGVuZGluZ1NwZWVjaENodW5rc0Zyb21Mb2NhbFN0b3JhZ2UsXG4gIHNhdmVQZW5kaW5nU3BlZWNoQ2h1bmtzVG9Mb2NhbFN0b3JhZ2UsXG4gIHNwZWVjaENodW5rSW5kZXhlZERiQXZhaWxhYmxlLFxuICBwZW5kaW5nVmlzaXRTYXZlSW5kZXhlZERiQXZhaWxhYmxlLFxuICBhc3NlcnRTcGVlY2hDaHVua0RiU3RvcmVzLFxuICBvcGVuU3BlZWNoQ2h1bmtEYixcbiAgcmVhZExvY2FsRGljb21Xb3JrYmVuY2hEcmFmdEZyb21JbmRleGVkRGIsXG4gIHNhdmVMb2NhbERpY29tV29ya2JlbmNoRHJhZnRUb0luZGV4ZWREYixcbiAgZGVsZXRlTG9jYWxEaWNvbVdvcmtiZW5jaERyYWZ0RnJvbUluZGV4ZWREYixcbiAgbWlncmF0ZUxvY2FsRGljb21Xb3JrYmVuY2hEcmFmdEZyb21Mb2NhbFN0b3JhZ2UsXG4gIGxvYWRMb2NhbERpY29tV29ya2JlbmNoRHJhZnQsXG4gIHNhdmVMb2NhbERpY29tV29ya2JlbmNoRHJhZnQsXG4gIHJlbW92ZUxvY2FsRGljb21Xb3JrYmVuY2hEcmFmdCxcbiAgbm9ybWFsaXplTXByV29ya2JlbmNoRHJhZnQsXG4gIHJlYWRMb2NhbE1wcldvcmtiZW5jaERyYWZ0RnJvbUluZGV4ZWREYixcbiAgc2F2ZUxvY2FsTXByV29ya2JlbmNoRHJhZnRUb0luZGV4ZWREYixcbiAgZGVsZXRlTG9jYWxNcHJXb3JrYmVuY2hEcmFmdEZyb21JbmRleGVkRGIsXG4gIG1pZ3JhdGVMb2NhbE1wcldvcmtiZW5jaERyYWZ0RnJvbUxvY2FsU3RvcmFnZSxcbiAgbG9hZExvY2FsTXByV29ya2JlbmNoRHJhZnQsXG4gIHNhdmVMb2NhbE1wcldvcmtiZW5jaERyYWZ0LFxuICByZWFkUGVuZGluZ1Zpc2l0U2F2ZXNGcm9tSW5kZXhlZERiLFxuICBzYXZlUGVuZGluZ1Zpc2l0U2F2ZXNUb0luZGV4ZWREYixcbiAgZGVsZXRlUGVuZGluZ1Zpc2l0U2F2ZUZyb21JbmRleGVkRGIsXG4gIG1pZ3JhdGVQZW5kaW5nVmlzaXRTYXZlc0Zyb21Mb2NhbFN0b3JhZ2UsXG4gIGxvYWRQZW5kaW5nVmlzaXRTYXZlcyxcbiAgc2F2ZVBlbmRpbmdWaXNpdFNhdmVzLFxuICByZWFkUGVuZGluZ1NwZWVjaENodW5rc0Zyb21JbmRleGVkRGIsXG4gIHNhdmVQZW5kaW5nU3BlZWNoQ2h1bmtzVG9JbmRleGVkRGIsXG4gIHB1dFBlbmRpbmdTcGVlY2hDaHVua1RvSW5kZXhlZERiLFxuICBkZWxldGVQZW5kaW5nU3BlZWNoQ2h1bmtGcm9tSW5kZXhlZERiLFxuICBtaWdyYXRlU3BlZWNoQ2h1bmtzRnJvbUxvY2FsU3RvcmFnZSxcbiAgbG9hZFBlbmRpbmdTcGVlY2hDaHVua3MsXG4gIGNyZWF0ZUxvY2FsUXVldWVJZCxcbiAgcXVldWVQZW5kaW5nU3BlZWNoQ2h1bmssXG4gIHJlbW92ZVBlbmRpbmdTcGVlY2hDaHVua0J5SWQsXG4gIGJsb2JUb0Jhc2U2NCxcbiAgUHJpY2VsaXN0SW1hZ2VNaW1lVHlwZSxcbiAgcHJpY2VsaXN0SW1hZ2VNaW1lVHlwZXMsXG4gIG1heFByaWNlbGlzdEltYWdlQmFzZTY0Q2hhcnMsXG4gIHJlYWRGaWxlQXNEYXRhVXJsLFxuICBsb2FkSW1hZ2VGcm9tRGF0YVVybCxcbiAgcHJlcGFyZVByaWNlbGlzdEltYWdlLFxuICBxdWV1ZVBlbmRpbmdWaXNpdFNhdmUsXG4gIGxhdGVzdFBlbmRpbmdWaXNpdFNhdmVBdCxcbiAgdmlzaXRTYXZlUmVjZWlwdFRleHQsXG4gIGJ1aWxkT2ZmbGluZVZpc2l0RHJhZnRGcm9tVHJhbnNjcmlwdCxcbiAgbm9ybWFsaXplUGVyc2lzdGVuY2VIZWFsdGgsXG4gIERlbnRlVGVsZWdyYW1Qb3J0YWxTZWN0aW9uLFxuICBEZW50ZVRlbGVncmFtSGFuZG9mZlRhcmdldCxcbiAgZGVudGVUZWxlZ3JhbUhhbmRvZmZUYXJnZXRzLFxuICBpc0RlbnRlVGVsZWdyYW1Qb3J0YWxTZWN0aW9uLFxuICByZWFkRGVudGVUZWxlZ3JhbUhhbmRvZmZUYXJnZXQsXG4gIHN0cmlwRGVudGVUZWxlZ3JhbUhhbmRvZmZRdWVyeSxcbiAgd29ya3NwYWNlU2NvcGVMYWJlbHMsXG4gIHBhdGllbnRJbnNpZ2h0Umlza0xhYmVscyxcbiAgcmVjb21tZW5kZWRBY3Rpb25Qcmlvcml0eUxhYmVscyxcbiAgYXBwb2ludG1lbnRSZWFkaW5lc3NMYWJlbHMsXG4gIHNldHRpbmdzVGFicyxcbiAgU2V0dGluZ3NUYWIsXG4gIEFkbWluU2VjcmV0U2Vzc2lvbkRvbWFpbixcbiAgQWRtaW5TZWNyZXRVbmxvY2tEb21haW4sXG4gIG9uYm9hcmRpbmdTdGVwcyxcbiAgcm9sZUZvY3VzT3JkZXIsXG4gIHNwZWVjaFByb3ZpZGVyQ29ubmVjdG9yTGFiZWxzLFxuICB2aWV3RnJvbUhhc2gsXG4gIHNldHRpbmdzVGFiRnJvbUhhc2hcbn0gZnJvbSBcIi4vQXBwSGVscGVyc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xuICAvLyBUb3BiYXIgZGljdGF0aW9uIHNob3J0Y3V0IG11c3Qgb3BlbiB0aGUgdmlzaXQgZGljdGF0aW9uIGFyZWE6IGdvVG9WaXNpdERpY3RhdGlvbiwgc2Nyb2xsVG9WaXNpdEFyZWEoXCIuZGljdGF0aW9uLWJveFwiKVxuICBcbiAgY29uc3Qge1xuICAgIGFjY2VwdERyYWZ0VG9WaXNpdCxcbiAgICBhY3RpdmVBcHBvaW50bWVudCxcbiAgICBhY3RpdmVDaGFpcixcbiAgICBhY3RpdmVDb21tdW5pY2F0aW9uVGFza3MsXG4gICAgYWN0aXZlRG9jdG9yLFxuICAgIGFjdGl2ZURvY3VtZW50cyxcbiAgICBhY3RpdmVJbWFnaW5nU3R1ZGllcyxcbiAgICBhY3RpdmVJc3N1ZWRQYWlkQ29udHJhY3RzLFxuICAgIGFjdGl2ZVBhdGllbnQsXG4gICAgYWN0aXZlUGF0aWVudENhbGxhYmxlUGhvbmUsXG4gICAgYWN0aXZlUGF0aWVudEhhc0NhbGxhYmxlUGhvbmUsXG4gICAgYWN0aXZlUGF0aWVudEluc2lnaHQsXG4gICAgYWN0aXZlUGF5bWVudHMsXG4gICAgYWN0aXZlUXVldWVSb2xlLFxuICAgIGFjdGl2ZVJvbGVQb2xpY3ksXG4gICAgYWN0aXZlUm9sZVF1ZXVlLFxuICAgIGFjdGl2ZVJvbGVSZXN0cmljdGVkU2VjdGlvbnMsXG4gICAgYWN0aXZlUm9sZVdyaXRhYmxlU2VjdGlvbnMsXG4gICAgYWN0aXZlU2V0dGluZ3NUYWJCdXR0b25SZWYsXG4gICAgYWN0aXZlU3BlZWNoUHJvdmlkZXJIZWFsdGgsXG4gICAgYWN0aXZlVHJlYXRtZW50UGxhbkl0ZW1zLFxuICAgIGFjdGl2ZVRyZWF0bWVudFBsYW5TY2VuYXJpb3MsXG4gICAgYWN0aXZlVXNhYmxlRG9jdW1lbnRzLFxuICAgIGFjdGl2ZVZpc2l0Q2xpbmljYWxSdWxlRXZhbHVhdGlvbnMsXG4gICAgYWN0aXZlVmlzaXRDbGluaWNhbFJ1bGVTdW1tYXJ5LFxuICAgIGFjdGl2ZVdvcmtzcGFjZVByb2ZpbGUsXG4gICAgYWRkQ2hhaXIsXG4gICAgYWRkSW1hZ2luZ1ZpZXdlck5vdGVBbm5vdGF0aW9uLFxuICAgIGFkZE1pZ3JhdGlvbkRpc2NvdmVyeUNhbmRpZGF0ZVRvU21hcnRJbXBvcnQsXG4gICAgYWRkU3RhZmZNZW1iZXIsXG4gICAgYW5hbHl6ZVByaWNlbGlzdCxcbiAgICBhcHBlbmRUb1RyYW5zY3JpcHQsXG4gICAgYXBwbHlDdFBsYW5uaW5nUXVpY2tBY3Rpb24sXG4gICAgYXBwbHlNcHJDbGluaWNhbFByZXNldCxcbiAgICBhcHBseU5lYXJlc3RNcHJDbGluaWNhbFByZXNldCxcbiAgICBhcHBseVBvc3RWaXNpdENhcmVQcmVzZXQsXG4gICAgYXBwbHlQcm90b2NvbFRlbXBsYXRlLFxuICAgIGFwcGx5UHJvdG9jb2xUZW1wbGF0ZURpcmVjdGx5LFxuICAgIGFwcG9pbnRtZW50TGFiZWxzLFxuICAgIGFwcG9pbnRtZW50UmVhZGluZXNzQnlJZCxcbiAgICBhcHBvaW50bWVudFJlYWRpbmVzc0xhYmVscyxcbiAgICBhcHBvaW50bWVudFNjaGVkdWxlRHJhZnRGcm9tQXBwb2ludG1lbnQsXG4gICAgYXR0YWNoUHJpY2VsaXN0SW1hZ2UsXG4gICAgYnJvd3NlckNhblJlcXVlc3RQZXJzaXN0ZW50U3RvcmFnZSxcbiAgICBicm93c2VyQ29udGludWl0eSxcbiAgICBicm93c2VyQ29udGludWl0eUNoZWNrcyxcbiAgICBicm93c2VyQ29udGludWl0eUNyaXRpY2FsLFxuICAgIGJyb3dzZXJDb250aW51aXR5U3RhdGUsXG4gICAgYnJvd3NlckNvbnRpbnVpdHlWYWx1ZSxcbiAgICBicm93c2VyRGlyZWN0b3J5SW5wdXRSZWYsXG4gICAgYnJvd3NlckRpcmVjdG9yeVBpY2tlckF2YWlsYWJsZSxcbiAgICBicm93c2VySW1hZ2luZ1NjYW5Qcm9ncmVzcyxcbiAgICBicm93c2VyTWlncmF0aW9uRGlzY292ZXJ5LFxuICAgIGJyb3dzZXJNaWdyYXRpb25JbnB1dFJlZixcbiAgICBicm93c2VyTWlncmF0aW9uU2NhblByb2dyZXNzLFxuICAgIGJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyLFxuICAgIGJ1aWxkRGljb21Gb2xkZXJXb3JrdXBQbGFuLFxuICAgIGJ1aWxkRGljb21SZW5kZXJDYWNoZVBsYW4sXG4gICAgYnVpbGREaWNvbVZpZXdlckxhdW5jaE1hbmlmZXN0LFxuICAgIGJ1aWxkRGljb21WaWV3ZXJUb29sU3RhdGVCdW5kbGUsXG4gICAgYnVpbGREaWNvbVZpZXdlcldvcmtiZW5jaE1hbmlmZXN0LFxuICAgIGJ1aWxkRHJhZnQsXG4gICAgYnVpbGRPZmZsaW5lRHJhZnQsXG4gICAgY2FuUmV0cnlJbWFnaW5nVmlld2VyU2F2ZSxcbiAgICBjYW5jZWxCcm93c2VySW1hZ2luZ0ZvbGRlclNjYW4sXG4gICAgY2FuY2VsQnJvd3Nlck1pZ3JhdGlvblNjYW4sXG4gICAgY2FuY2VsTG9jYWxEaWNvbU9wZXJhdGlvbixcbiAgICBjYmN0V29ya2JlbmNoUGxhbmVzLFxuICAgIGNiY3RXb3JrYmVuY2hQcm9qZWN0aW9ucyxcbiAgICBjYmN0V29ya2JlbmNoU2VyaWVzLFxuICAgIGNiY3RXb3JrYmVuY2hUb29scyxcbiAgICBjaGFpclNjaGVkdWxlRGlydHlJZHMsXG4gICAgY2hhaXJTY2hlZHVsZURyYWZ0cyxcbiAgICBjaGFpclNjaGVkdWxlU2F2ZVN0YXRlcyxcbiAgICBjaGFpclNjaGVkdWxlU2F2aW5nSWQsXG4gICAgY2hhbmdlQ2xpbmljTW9kZSxcbiAgICBjaGFuZ2VQb3N0VmlzaXRDYXJlVG9waWMsXG4gICAgY2hlY2tEaWNvbVdlYkNvbm5lY3RvcixcbiAgICBjaGVja0RpY29tV29ya3N0YXRpb25SZWFkaW5lc3MsXG4gICAgY2hvb3NlUmVjb2duaXRpb25QcmVzZXQsXG4gICAgY2xhbXBNcHJBeGlzRGVnLFxuICAgIGNsYW1wTXByU2xhYk1tLFxuICAgIGNsYW1wTXByU2xpY2VJbmRleCxcbiAgICBjbGVhckJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyUHJldmlldyxcbiAgICBjbGVhckRpY29tV29ya2JlbmNoUmVjb3ZlcnksXG4gICAgY2xlYXJMb2NhbEltYWdpbmdGb2xkZXJSZWNvdmVyeSxcbiAgICBjbGVhclByaWNlbGlzdEltYWdlLFxuICAgIGNsZWFyVHJhbnNjcmlwdFdpdGhVbmRvLFxuICAgIGNsZWFyZWRUcmFuc2NyaXB0U25hcHNob3QsXG4gICAgY2xpbmljTW9kZUxhYmVscyxcbiAgICBjbGluaWNQcm9maWxlRHJhZnQsXG4gICAgY2xpbmljUHJvZmlsZVNhdmVTdGF0ZSxcbiAgICBjbGluaWNQdWJsaWNMb29rdXAsXG4gICAgY2xpbmljYWxSdWxlQWN0aW9uTGFiZWxzLFxuICAgIGNsaW5pY2FsUnVsZVNldmVyaXR5TGFiZWxzLFxuICAgIGNsb3NlQXBwb2ludG1lbnRFZGl0b3IsXG4gICAgY29tbWl0SW1hZ2luZ0ltcG9ydCxcbiAgICBjb21taXRJbXBvcnQsXG4gICAgY29tbWl0U21hcnRJbXBvcnQsXG4gICAgY29tbXVuaWNhdGlvbkNoYW5uZWxMYWJlbHMsXG4gICAgY29tbXVuaWNhdGlvbkRvY3VtZW50VGFza0FjdGlvbkxhYmVscyxcbiAgICBjb21tdW5pY2F0aW9uSW50ZW50TGFiZWxzLFxuICAgIGNvbW11bmljYXRpb25Ob3RlLFxuICAgIGNvbW11bmljYXRpb25Qcmlvcml0eUxhYmVscyxcbiAgICBjb21tdW5pY2F0aW9uU2F2aW5nVGFza0lkLFxuICAgIGNvbW11bmljYXRpb25TdGF0dXNMYWJlbHMsXG4gICAgY29tcGFjdERvY3VtZW50VGV4dCxcbiAgICBjb21wbGV0ZUNvbW11bmljYXRpb25UYXNrLFxuICAgIGNvbXBsZXRlZEFjdENvbnRyYWN0UmVmZXJlbmNlRm9yVWksXG4gICAgY29tcGxldGVkQWN0RmlzY2FsUmVjZWlwdExpbmVzLFxuICAgIGNvbXBsZXRlZEFjdFBhaWRSdWJWYWx1ZSxcbiAgICBjb25maXJtRG9jdW1lbnRJc3N1ZSxcbiAgICBjb25maXJtRG9jdW1lbnRWb2lkLFxuICAgIGNvbnRpbnVlT25ib2FyZGluZ0luRHJhZnRNb2RlLFxuICAgIGNvcHlUZWxlZ3JhbVRleHRUb0NsaXBib2FyZCxcbiAgICBjcmVhdGVBcHBvaW50bWVudEZyb21EcmFmdCxcbiAgICBjcmVhdGVDbGluaWNhbFJ1bGVGcm9tU2V0dGluZ3MsXG4gICAgY3JlYXRlQ3RQbGFubmluZ0FydGlmYWN0LFxuICAgIGNyZWF0ZURvY3VtZW50LFxuICAgIGNyZWF0ZUltYWdpbmdTdHVkeSxcbiAgICBjcmVhdGVQYXRpZW50LFxuICAgIGNyZWF0ZVRlbGVncmFtTGlua0NvZGUsXG4gICAgY3RQbGFubmluZ0FjdGl2ZVF1aWNrQWN0aW9uSWQsXG4gICAgY3RQbGFubmluZ0Fubm90YXRpb25SZWZzLFxuICAgIGN0UGxhbm5pbmdJbXBsYW50UGxhbixcbiAgICBjdXJyZW50T25ib2FyZGluZ0luZGV4LFxuICAgIGN1cnJlbnRWaWV3LFxuICAgIGRhc2hib2FyZCxcbiAgICBkZWZhdWx0RGljb21GaXJzdEZyYW1lVmlld2VyU3RhdGUsXG4gICAgZGVmYXVsdEltYWdpbmdWaWV3ZXJTdGF0ZSxcbiAgICBkZW50YWxNYXRlcmlhbEtpbmRMYWJlbHMsXG4gICAgZGVudGFsUmVzdG9yYXRpb25UeXBlTGFiZWxzLFxuICAgIGRlc2NyaWJlTXByQ2xpbmljYWxQcmVzZXRQcm9qZWN0aW9uRmFsbGJhY2ssXG4gICAgZGljb21EaWFnbm9zdGljUGl4ZWxQb2xpY3lMYWJlbHMsXG4gICAgZGljb21FeGVjdXRpb25MYW5lTGFiZWxzLFxuICAgIGRpY29tRmlyc3RGcmFtZUltYWdlU3R5bGUsXG4gICAgZGljb21GaXJzdEZyYW1lUHJldmlldyxcbiAgICBkaWNvbUZpcnN0RnJhbWVTdGF0dXNMYWJlbHMsXG4gICAgZGljb21GaXJzdEZyYW1lVmlld2VyU3RhdGUsXG4gICAgZGljb21Gb2xkZXJTZXJpZXNTY2FuLFxuICAgIGRpY29tRm9sZGVyV29ya3VwUGF0aExhYmVscyxcbiAgICBkaWNvbUZvbGRlcldvcmt1cFBsYW4sXG4gICAgZGljb21HcHVDbGFzc0xhYmVscyxcbiAgICBkaWNvbUxhYmVsLFxuICAgIGRpY29tTG9jYWxGb2xkZXJEaXNjb3ZlcnksXG4gICAgZGljb21RdWFsaXR5TW9kZUxhYmVscyxcbiAgICBkaWNvbVJlYWRpbmVzc0NoZWNrTGFiZWxzLFxuICAgIGRpY29tUmVuZGVyQ2FjaGVQbGFuLFxuICAgIGRpY29tUmVuZGVyTWVtb3J5QnVkZ2V0Q2xhc3NMYWJlbHMsXG4gICAgZGljb21SdW50aW1lVGllckxhYmVscyxcbiAgICBkaWNvbVNlcmllc1ByZXZpZXcsXG4gICAgZGljb21TZXJpZXNWaWV3ZXJMYWJlbHMsXG4gICAgZGljb21UZXh0dXJlU3RyYXRlZ3lMYWJlbHMsXG4gICAgZGljb21WaWV3ZXJMYXVuY2hNYW5pZmVzdCxcbiAgICBkaWNvbVZpZXdlckxhdW5jaE1vZGVMYWJlbHMsXG4gICAgZGljb21WaWV3ZXJUb29sU3RhdGVCdW5kbGUsXG4gICAgZGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdCxcbiAgICBkaWNvbVdlYkNoZWNrLFxuICAgIGRpY29tV2ViRW5kcG9pbnRVcmwsXG4gICAgZGljb21XZWJTdGF0dXNMYWJlbHMsXG4gICAgZGljb21Xb3JrYmVuY2hMb2NhbFNhdmVkQXQsXG4gICAgZGljb21Xb3JrYmVuY2hTZXJ2ZXJCdW5kbGUsXG4gICAgZGljb21Xb3JrYmVuY2hTb3VyY2VJc1JlZGFjdGVkLFxuICAgIGRpY29tV29ya3N0YXRpb25SZWFkaW5lc3MsXG4gICAgZGljdGF0aW9uUXVpY2tQaHJhc2VzLFxuICAgIGRpc2NvdmVyRGljb21Gb2xkZXJzLFxuICAgIGRpc2NvdmVyTWlncmF0aW9uU291cmNlcyxcbiAgICBkaXNtaXNzT25ib2FyZGluZyxcbiAgICBkb2N1bWVudEFjdGlvbkxhYmVscyxcbiAgICBkb2N1bWVudERldGVjdGVkS2luZExhYmVsLFxuICAgIGRvY3VtZW50RmFjdG9yeUdyb3VwcyxcbiAgICBkb2N1bWVudEluZ2VzdGlvbixcbiAgICBkb2N1bWVudEluZ2VzdGlvblF1YWxpdHlMYWJlbHMsXG4gICAgZG9jdW1lbnRJbmdlc3Rpb25UYXJnZXQsXG4gICAgZG9jdW1lbnRJc3N1ZUF0dGVzdGF0aW9uUmVhZHksXG4gICAgZG9jdW1lbnRJc3N1ZUNvbmZpcm1hdGlvbixcbiAgICBkb2N1bWVudElzc3VlU2lnbmF0dXJlTW9kZUxhYmVscyxcbiAgICBkb2N1bWVudEtpbmRzRm9yQ29tbXVuaWNhdGlvblRhc2ssXG4gICAgZG9jdW1lbnRMYWJlbHMsXG4gICAgZG9jdW1lbnRQYXRpZW50LFxuICAgIGRvY3VtZW50U291cmNlU3RhdHVzQ2xhc3NOYW1lcyxcbiAgICBkb2N1bWVudFN0YXR1c0xhYmVscyxcbiAgICBkb2N1bWVudFZvaWRDb25maXJtYXRpb24sXG4gICAgZG9jdW1lbnRWb2lkUmVhZHksXG4gICAgZG9jdW1lbnRWb2lkUmVhc29uTGFiZWxzLFxuICAgIGRvd25sb2FkRGljb21WaWV3ZXJUb29sU3RhdGVCdW5kbGUsXG4gICAgZG93bmxvYWREaWNvbVdvcmtiZW5jaE1hbmlmZXN0LFxuICAgIGRvd25sb2FkSXNzdWVkRG9jdW1lbnRIdG1sLFxuICAgIGRvd25sb2FkSXNzdWVkRG9jdW1lbnRQZGYsXG4gICAgZG93bmxvYWRNaWdyYXRpb25IYW5kb2ZmUmVwb3J0LFxuICAgIGRvd25sb2FkUGVyc2lzdGVuY2VFeHBvcnQsXG4gICAgZG93bmxvYWRTbWFydEltcG9ydFJlcG9ydCxcbiAgICBkb3dubG9hZFNtYXJ0SW1wb3J0U2FmZUhhbmRvZmZSZXBvcnQsXG4gICAgZG93bmxvYWRUYXhEb2N1bWVudFhtbCxcbiAgICBkb3dubG9hZFRlbGVncmFtUXJTdmcsXG4gICAgZHJhZnQsXG4gICAgZWRpdGluZ0FwcG9pbnRtZW50SWQsXG4gICAgZWxpZ2libGVQYXltZW50UmVjZWlwdFBheW1lbnRzLFxuICAgIGVsaWdpYmxlUmVmdW5kQ29ycmVjdGlvblBheW1lbnRzLFxuICAgIGVsaWdpYmxlVGF4UGF5bWVudHMsXG4gICAgZW1wdHlEaWN0YXRpb25Wb2ljZUFjdGlvbkxhYmVsLFxuICAgIGVycm9yLFxuICAgIGZpbHRlcmVkUGF0aWVudHMsXG4gICAgZmlsdGVyZWRUZWxlZ3JhbU91dGJveEl0ZW1zLFxuICAgIGZsdXNoUGVuZGluZ1NwZWVjaENodW5rcyxcbiAgICBmbHVzaFBlbmRpbmdWaXNpdFNhdmVzLFxuICAgIGZvcm1hdEJ5dGVTaXplLFxuICAgIGZvcm1hdERhdGVUaW1lLFxuICAgIGZvcm1hdE1lZ2FieXRlcyxcbiAgICBmb3JtYXRTaG9ydERhdGUsXG4gICAgZm9ybWF0U2lnbmVkTXByU3RlcCxcbiAgICBmb3JtYXRUaW1lLFxuICAgIGZyb21EYXRlVGltZUxvY2FsVmFsdWUsXG4gICAgZ29Ub1Zpc2l0RGljdGF0aW9uLFxuICAgIGhhbmRsZUJyb3dzZXJEaXJlY3RvcnlJbnB1dENoYW5nZSxcbiAgICBoYW5kbGVCcm93c2VyTWlncmF0aW9uSW5wdXRDaGFuZ2UsXG4gICAgaGFuZGxlTXByS2V5Ym9hcmROYXZpZ2F0aW9uLFxuICAgIGhhc1Zpc2l0VHJhbnNjcmlwdFRleHQsXG4gICAgaGlkZGVuVGVsZWdyYW1PdXRib3hJdGVtQ291bnQsXG4gICAgaW1hZ2luZ0NvbXBhcmlzb25DYW5kaWRhdGVzLFxuICAgIGltYWdpbmdDb25uZWN0b3JDYXJkcyxcbiAgICBpbWFnaW5nQ3JlYXRlU2F2aW5nS2luZCxcbiAgICBpbWFnaW5nRm9sZGVyUGF0aCxcbiAgICBpbWFnaW5nRm9sZGVyU2NhbixcbiAgICBpbWFnaW5nSW1wb3J0Q29tbWl0LFxuICAgIGltYWdpbmdJbXBvcnRQcmV2aWV3LFxuICAgIGltYWdpbmdJbXBvcnRTb3VyY2VLaW5kLFxuICAgIGltYWdpbmdJbXBvcnRUZXh0LFxuICAgIGltYWdpbmdLaW5kRmlsdGVyLFxuICAgIGltYWdpbmdLaW5kTGFiZWxzLFxuICAgIGltYWdpbmdLaW5kT3B0aW9ucyxcbiAgICBpbWFnaW5nUHJldmlld1NvdXJjZSxcbiAgICBpbWFnaW5nU291cmNlQ2hvaWNlcyxcbiAgICBpbWFnaW5nU291cmNlRGV0YWlscyxcbiAgICBpbWFnaW5nU291cmNlTGFiZWxzLFxuICAgIGltYWdpbmdWaWV3ZXJBY3RpdmVUb29sLFxuICAgIGltYWdpbmdWaWV3ZXJBbm5vdGF0aW9ucyxcbiAgICBpbWFnaW5nVmlld2VyQ2FwYWJpbGl0aWVzLFxuICAgIGltYWdpbmdWaWV3ZXJIcmVmLFxuICAgIGltYWdpbmdWaWV3ZXJJbWFnZVN0eWxlLFxuICAgIGltYWdpbmdWaWV3ZXJOb3RlLFxuICAgIGltYWdpbmdWaWV3ZXJOb3RlTWlzc2luZ0lkLFxuICAgIGltYWdpbmdWaWV3ZXJOb3RlUmVhZHksXG4gICAgaW1hZ2luZ1ZpZXdlclJldHJ5TWlzc2luZ0lkLFxuICAgIGltYWdpbmdWaWV3ZXJTYXZlRGV0YWlsLFxuICAgIGltYWdpbmdWaWV3ZXJTYXZlU3RhdGUsXG4gICAgaW1hZ2luZ1ZpZXdlclNhdmVUaXRsZSxcbiAgICBpbWFnaW5nVmlld2VyU2Vzc2lvblJlYWR5LFxuICAgIGltYWdpbmdWaWV3ZXJTdGF0ZSxcbiAgICBpbWFnaW5nVmlld2VyVG9vbExhYmVscyxcbiAgICBpbXBvcnRDb21taXQsXG4gICAgaW1wb3J0SW50YWtlLFxuICAgIGltcG9ydFByZXZpZXcsXG4gICAgaW1wb3J0U291cmNlS2luZCxcbiAgICBpbXBvcnRTb3VyY2VMYWJlbHMsXG4gICAgaW1wb3J0VGV4dCxcbiAgICBpbmZlcnJlZFRyZWF0bWVudEFyZWEsXG4gICAgaW5nZXN0SW1wb3J0RmlsZSxcbiAgICBpbmdlc3Rpb25UYXJnZXRMYWJlbHMsXG4gICAgaW5zdGFsbG1lbnRTY2hlZHVsZUJhc2VEb2N1bWVudFRpdGxlVmFsdWUsXG4gICAgaW5zdGFsbG1lbnRTY2hlZHVsZUluc3RhbGxtZW50Um93cyxcbiAgICBpbnN0YWxsbWVudFNjaGVkdWxlUHJlcGFpZFJ1YlZhbHVlLFxuICAgIGluc3RhbGxtZW50U2NoZWR1bGVSZW1haW5pbmdSdWJWYWx1ZSxcbiAgICBpbnN0YWxsbWVudFNjaGVkdWxlVG90YWxSdWJWYWx1ZSxcbiAgICBpbnRlZ3JhdGlvbkNhcGFiaWxpdHlMYWJlbHMsXG4gICAgaW50ZWdyYXRpb25DYXRlZ29yeUxhYmVscyxcbiAgICBpbnRlZ3JhdGlvblN0YXR1c0xhYmVscyxcbiAgICBpc0Jyb3dzZXJJbWFnaW5nRm9sZGVyUGlja2luZyxcbiAgICBpc0Jyb3dzZXJNaWdyYXRpb25TY2FubmluZyxcbiAgICBpc0NsaW5pY1B1YmxpY0xvb2t1cExvYWRpbmcsXG4gICAgaXNDbGluaWNhbFJ1bGVTYXZpbmcsXG4gICAgaXNEaWNvbUZpcnN0RnJhbWVQcmV2aWV3aW5nLFxuICAgIGlzRGljb21Gb2xkZXJXb3JrdXBQbGFubmluZyxcbiAgICBpc0RpY29tTG9jYWxEaXNjb3ZlcmluZyxcbiAgICBpc0RpY29tTWFuaWZlc3RCdWlsZGluZyxcbiAgICBpc0RpY29tUmVuZGVyQ2FjaGVQbGFubmluZyxcbiAgICBpc0RpY29tU2VyaWVzUHJldmlld0xvYWRpbmcsXG4gICAgaXNEaWNvbVRvb2xTdGF0ZUJ1aWxkaW5nLFxuICAgIGlzRGljb21XZWJDaGVja2luZyxcbiAgICBpc0RpY29tV29ya2JlbmNoQnVpbGRpbmcsXG4gICAgaXNEaWNvbVdvcmtiZW5jaFJlY29ubmVjdGluZyxcbiAgICBpc0RpY29tV29ya2JlbmNoU2VydmVyU2F2aW5nLFxuICAgIGlzRGljb21Xb3Jrc3RhdGlvbkNoZWNraW5nLFxuICAgIGlzRHJhZnRBY2NlcHRpbmcsXG4gICAgaXNEcmFmdExvYWRpbmcsXG4gICAgaXNJbWFnaW5nRm9sZGVyU2Nhbm5pbmcsXG4gICAgaXNJbWFnaW5nSW1wb3J0Q29tbWl0dGluZyxcbiAgICBpc0ltYWdpbmdJbXBvcnRMb2FkaW5nLFxuICAgIGlzSW1wb3J0Q29tbWl0dGluZyxcbiAgICBpc0ltcG9ydERpY3RhdGluZyxcbiAgICBpc0ltcG9ydExvYWRpbmcsXG4gICAgaXNMb2NhbERpY29tT3BlcmF0aW9uQWN0aXZlLFxuICAgIGlzTG9jYWxJbWFnaW5nT3JnYW5pemluZyxcbiAgICBpc01pZ3JhdGlvbkF1dG9waWxvdExvYWRpbmcsXG4gICAgaXNNaWdyYXRpb25IYW5kb2ZmUmVwb3J0TG9hZGluZyxcbiAgICBpc01pZ3JhdGlvblNvdXJjZURpc2NvdmVyaW5nLFxuICAgIGlzTWlncmF0aW9uU291cmNlUHJvYmVMb2FkaW5nLFxuICAgIGlzTWlncmF0aW9uU291cmNlV29ya3VwTG9hZGluZyxcbiAgICBpc09ubGluZSxcbiAgICBpc1BheW1lbnRTYXZpbmcsXG4gICAgaXNQZW5kaW5nVmlzaXRTeW5jaW5nLFxuICAgIGlzUGVyc2lzdGVuY2VFeHBvcnRpbmcsXG4gICAgaXNQcmljZWxpc3RBbmFseXppbmcsXG4gICAgaXNSZWNvZ25pdGlvbkxvYWRpbmcsXG4gICAgaXNTZXJ2ZXJWb2ljZVJlY29yZGluZyxcbiAgICBpc1NtYXJ0SW1wb3J0Q29tbWl0dGluZyxcbiAgICBpc1NtYXJ0SW1wb3J0TG9hZGluZyxcbiAgICBpc1NtYXJ0UmVwb3J0TG9hZGluZyxcbiAgICBpc1NtYXJ0U2FmZVJlcG9ydExvYWRpbmcsXG4gICAgaXNUZWxlZ3JhbUNoYXRMaW5rc0xvYWRpbmdNb3JlLFxuICAgIGlzVGVsZWdyYW1MaW5rQ29kZXNMb2FkaW5nTW9yZSxcbiAgICBpc1RlbGVncmFtTGlua0NyZWF0aW5nLFxuICAgIGlzVGVsZWdyYW1Mb2FkaW5nLFxuICAgIGlzVGVsZWdyYW1PdXRib3hJdGVtRHVlRm9yVWksXG4gICAgaXNUZWxlZ3JhbU91dGJveExvYWRpbmdNb3JlLFxuICAgIGlzVGVsZWdyYW1TZW5kaW5nRHVlLFxuICAgIGlzVGVsZWdyYW1TZXR0aW5nc1NhdmluZyxcbiAgICBpc1RyYW5zY3JpcHRQb2xpc2hpbmcsXG4gICAgaXNWaXNpdERpY3RhdGluZyxcbiAgICBpc1Zpc2l0Tm90ZURpcnR5LFxuICAgIGlzc3VlZE1lZGljYWxDb3B5UmVxdWVzdERvY3VtZW50cyxcbiAgICBsYXN0TG9jYWxTYXZlZEF0LFxuICAgIGxhc3RQZW5kaW5nVmlzaXRTYXZlQXQsXG4gICAgbGFzdFNlcnZlckRyYWZ0U2F2ZWRBdCxcbiAgICBsYXN0VmlzaXRTYXZlUmVjZWlwdCxcbiAgICBsYXRlc3REaWNvbVdvcmtiZW5jaFNlcnZlckJ1bmRsZSxcbiAgICBsZWdhbE1pc3NpbmdGaWVsZHMsXG4gICAgbGVnYWxSZWFkaW5lc3NQZXJjZW50LFxuICAgIGxvYWREb2N1bWVudEF1ZGl0RmFjdHMsXG4gICAgbG9hZExvY2FsQnJpZGdlVXNlUGxhbnMsXG4gICAgbG9hZE1vcmVUZWxlZ3JhbUNoYXRMaW5rcyxcbiAgICBsb2FkTW9yZVRlbGVncmFtTGlua0NvZGVzLFxuICAgIGxvYWRNb3JlVGVsZWdyYW1PdXRib3gsXG4gICAgbG9hZFBlcnNpc3RlbmNlSGVhbHRoLFxuICAgIGxvYWRQZXJzaXN0ZW5jZUludGVncml0eSxcbiAgICBsb2FkVGVsZWdyYW1Db250cm9sUGxhbmUsXG4gICAgbG9jYWxCcmlkZ2VSZWFkaW5lc3MsXG4gICAgbG9jYWxCcmlkZ2VTdGF0dXNMYWJlbHMsXG4gICAgbG9jYWxCcmlkZ2VTdGF0dXNTdGF0ZSxcbiAgICBsb2NhbEJyaWRnZVN0YXR1c1ZhbHVlLFxuICAgIGxvY2FsQnJpZGdlVXNlUGF0aExhYmVscyxcbiAgICBsb2NhbEJyaWRnZVVzZVBsYW5zLFxuICAgIGxvY2FsRHJhZnRXYXNSZXN0b3JlZCxcbiAgICBsb2NhbEltYWdpbmdGb2xkZXJEcmFmdCxcbiAgICBsb2NhbEltYWdpbmdNb2RlbFJvbGVMYWJlbHMsXG4gICAgbG9jYWxJbWFnaW5nT3JnYW5pemVyLFxuICAgIGxvY2FsSW1hZ2luZ09yZ2FuaXplckFjdGlvbkxhYmVscyxcbiAgICBsb2NrVGVsZWdyYW1BZG1pblNlc3Npb24sXG4gICAgbG9va3VwQ2xpbmljUHVibGljUHJvZmlsZSxcbiAgICBtYXJrUG9zdFZpc2l0TWFudWFsRWRpdGVkLFxuICAgIG1hcmtUZWxlZ3JhbVNldHRpbmdzRGlydHksXG4gICAgbWVkaWNhbERvY3VtZW50UmVsZWFzZUNoYW5uZWxMYWJlbHMsXG4gICAgbWlncmF0aW9uQXV0b3BpbG90LFxuICAgIG1pZ3JhdGlvblNvdXJjZURpc2NvdmVyeSxcbiAgICBtaWdyYXRpb25Tb3VyY2VQcm9iZSxcbiAgICBtaWdyYXRpb25Tb3VyY2VXb3JrdXAsXG4gICAgbWlub3JDb25zZW50RGlhZ25vc2lzT3JJbmRpY2F0aW9uVmFsdWUsXG4gICAgbWlub3JDb25zZW50SW50ZXJ2ZW50aW9uU2NvcGVWYWx1ZSxcbiAgICBtaW5vckNvbnNlbnRQYXRpZW50QmlydGhEYXRlVmFsdWUsXG4gICAgbWlub3JDb25zZW50UGF0aWVudEZ1bGxOYW1lVmFsdWUsXG4gICAgbWlub3JSZXByZXNlbnRhdGl2ZUZ1bGxOYW1lVmFsdWUsXG4gICAgbWlub3JSZXByZXNlbnRhdGl2ZUlkZW50aXR5RG9jdW1lbnRWYWx1ZSxcbiAgICBtaW5vclJlcHJlc2VudGF0aXZlUGhvbmVWYWx1ZSxcbiAgICBtaW5vclJlcHJlc2VudGF0aXZlUmVsYXRpb25zaGlwVmFsdWUsXG4gICAgbW9uZXksXG4gICAgbW9zdExvYWRlZFJlc291cmNlLFxuICAgIG1vdmVPbmJvYXJkaW5nVG8sXG4gICAgbXByQWN0aXZlUHJvamVjdGlvbkxhYmVsLFxuICAgIG1wckFjdGl2ZVByb2plY3Rpb25PcmllbnRhdGlvbixcbiAgICBtcHJBeGlzQW5nbGVCYWRnZSxcbiAgICBtcHJBeGlzQm91bmRzLFxuICAgIG1wckF4aXNEZWcsXG4gICAgbXByQXhpc0RpcmVjdGlvbkxhYmVsLFxuICAgIG1wckF4aXNHdWlkYW5jZSxcbiAgICBtcHJBeGlzTnVkZ2VEZWcsXG4gICAgbXByQXhpc1ByZXNldERlZyxcbiAgICBtcHJBeGlzUmFuZ2VWYWx1ZSxcbiAgICBtcHJBeGlzVmlzdWFsaXplckxhYmVsLFxuICAgIG1wckF4aXNWaXN1YWxpemVyU3R5bGUsXG4gICAgbXByQ2FjaGVNb2RlTGFiZWxzLFxuICAgIG1wckNsaW5pY2FsQ2hlY2tsaXN0LFxuICAgIG1wckNsaW5pY2FsTmV4dFN0ZXAsXG4gICAgbXByQ2xpbmljYWxQcmVzZXRCdXR0b25DbGFzcyxcbiAgICBtcHJDbGluaWNhbFByZXNldHMsXG4gICAgbXByQ29udHJvbHNBdXRvT3BlbixcbiAgICBtcHJDb250cm9sc1JlYWR5LFxuICAgIG1wckNyb3NzaGFpckVuYWJsZWQsXG4gICAgbXByTGlua2VkUGxhbmVzRW5hYmxlZCxcbiAgICBtcHJMb2FkU3RyYXRlZ3lMYWJlbHMsXG4gICAgbXByTmVhcmVzdENsaW5pY2FsUHJlc2V0LFxuICAgIG1wck9wZXJhdG9yU3VtbWFyeUNhcmRzLFxuICAgIG1wclByb2plY3Rpb24sXG4gICAgbXByUHJvamVjdGlvbkNvbXBhc3MsXG4gICAgbXByUHJvamVjdGlvbkxhYmVscyxcbiAgICBtcHJSZXNvdXJjZVRpZXJMYWJlbHMsXG4gICAgbXByU2FmZVNsaWNlSW5kZXgsXG4gICAgbXByU2VyaWVzUmVxdWlyZWRQcm9qZWN0aW9uTGFiZWwsXG4gICAgbXByU2xhYkJhZGdlLFxuICAgIG1wclNsYWJCb3VuZHMsXG4gICAgbXByU2xhYk1tLFxuICAgIG1wclNsYWJOdWRnZU1tLFxuICAgIG1wclNsYWJQcmVzZXRNbSxcbiAgICBtcHJTbGFiUmFuZ2VWYWx1ZSxcbiAgICBtcHJTbGljZUJhZGdlLFxuICAgIG1wclNsaWNlSW5kZXgsXG4gICAgbXByU2xpY2VJbmRleEZyb21GcmFjdGlvbixcbiAgICBtcHJTbGljZUxhYmVsLFxuICAgIG1wclNsaWNlTWF4SW5kZXgsXG4gICAgbXByU2xpY2VOdWRnZVN0ZXBzLFxuICAgIG1wclNsaWNlUHJlc2V0RnJhY3Rpb25zLFxuICAgIG1wclNsaWNlUmFuZ2VWYWx1ZSxcbiAgICBtcHJUb29sTGFiZWxzLFxuICAgIG1wclVuYXZhaWxhYmxlUHJvamVjdGlvbkxhYmVsLFxuICAgIG1wcldpbmRvd1ByZXNldCxcbiAgICBtcHJXaW5kb3dQcmVzZXRMYWJlbHMsXG4gICAgbXByV29ya2JlbmNoRHJhZnRSZXN0b3JlZCxcbiAgICBtcHJXb3JrYmVuY2hMb2NhbFNhdmVkQXQsXG4gICAgbXByV29ya2JlbmNoU3VtbWFyeVRleHQsXG4gICAgbmV3QXBwb2ludG1lbnRFcnJvcixcbiAgICBuZXdDaGFpckhhc01pY3Jvc2NvcGUsXG4gICAgbmV3Q2hhaXJIYXNTdXJnZXJ5S2l0LFxuICAgIG5ld0NoYWlySGFzWHJheVNlbnNvcixcbiAgICBuZXdDaGFpck5hbWUsXG4gICAgbmV3Q2hhaXJSZWFkeVRvQ3JlYXRlLFxuICAgIG5ld1J1bGVBY3Rpb24sXG4gICAgbmV3UnVsZUJsb2NrZWRTZXJ2aWNlSWQsXG4gICAgbmV3UnVsZUNhdGVnb3J5LFxuICAgIG5ld1J1bGVDb21wbGV0ZWRTZXJ2aWNlSWQsXG4gICAgbmV3UnVsZU93bmVyUm9sZSxcbiAgICBuZXdSdWxlUmVxdWlyZWRTZXJ2aWNlSWQsXG4gICAgbmV3UnVsZVNldmVyaXR5LFxuICAgIG5ld1J1bGVTcGVjaWFsdHksXG4gICAgbmV3UnVsZVRpdGxlLFxuICAgIG5ld1J1bGVUcmlnZ2VyU2VydmljZUlkLFxuICAgIG5ld1J1bGVXYXJuaW5nVGV4dCxcbiAgICBuZXdTdGFmZk5hbWUsXG4gICAgbmV3U3RhZmZSZWFkeVRvQ3JlYXRlLFxuICAgIG5ld1N0YWZmUm9sZSxcbiAgICBuZXdTdGFmZlNwZWNpYWx0eSxcbiAgICBuZXh0T25ib2FyZGluZ1N0ZXAsXG4gICAgbm9ybWFsaXplT3B0aW9uYWxXb3JraW5nRGF5c0RyYWZ0LFxuICAgIG5vcm1hbGl6ZVVpTGFuZ3VhZ2VJbnB1dCxcbiAgICBub3JtYWxpemVkQXBwb2ludG1lbnRTdGF0dXMsXG4gICAgbm9ybWFsaXplZEFwcG9pbnRtZW50U3RhdHVzRmlsdGVyLFxuICAgIG5vcm1hbGl6ZWRDbGluaWNhbFJ1bGVBY3Rpb24sXG4gICAgbm9ybWFsaXplZENsaW5pY2FsUnVsZVNldmVyaXR5LFxuICAgIG5vcm1hbGl6ZWREZW50YWxTcGVjaWFsdHksXG4gICAgbm9ybWFsaXplZERvY3VtZW50SXNzdWVTaWduYXR1cmVNb2RlLFxuICAgIG5vcm1hbGl6ZWREb2N1bWVudEtpbmQsXG4gICAgbm9ybWFsaXplZERvY3VtZW50Vm9pZFJlYXNvbkNvZGUsXG4gICAgbm9ybWFsaXplZE1lZGljYWxEb2N1bWVudFJlbGVhc2VDaGFubmVsLFxuICAgIG5vcm1hbGl6ZWRPdXRwYXRpZW50MDI1dURlbW9ncmFwaGljQ29kZSxcbiAgICBub3JtYWxpemVkUGF0aWVudEludGFrZVByZWduYW5jeVN0YXR1cyxcbiAgICBub3JtYWxpemVkUGF5bWVudFJlZnVuZENvcnJlY3Rpb25BY3Rpb24sXG4gICAgbm9ybWFsaXplZFBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uTWV0aG9kLFxuICAgIG5vcm1hbGl6ZWRQb3N0VmlzaXRDYXJlVG9waWMsXG4gICAgbm9ybWFsaXplZFByb2NlZHVyZVNwZWNpZmljQ29uc2VudFByb2NlZHVyZSxcbiAgICBub3JtYWxpemVkU2VydmljZUNhdGVnb3J5LFxuICAgIG5vcm1hbGl6ZWRTdGFmZlJvbGUsXG4gICAgbm9ybWFsaXplZFRheEFwcGxpY2F0aW9uRGVsaXZlcnlDaGFubmVsLFxuICAgIG5vcm1hbGl6ZWRUYXhBcHBsaWNhdGlvbkZvcm0sXG4gICAgbm9ybWFsaXplZFRheEFwcGxpY2F0aW9uUmVsYXRpb25zaGlwU2VsZWN0LFxuICAgIG5vcm1hbGl6ZWRUZWxlZ3JhbUJvdE1vZGUsXG4gICAgbm9ybWFsaXplZFRlbGVncmFtTGlua1N1YmplY3RUeXBlLFxuICAgIG5vcm1hbGl6ZWRUZWxlZ3JhbU91dGJveFN0YXR1c0ZpbHRlcixcbiAgICBub3JtYWxpemVkVGVsZWdyYW1PdXRib3hUZW1wbGF0ZUZpbHRlcixcbiAgICBub3JtYWxpemVkVGVsZWdyYW1Qcml2YWN5TW9kZSxcbiAgICBub3JtYWxpemVkVHJlYXRtZW50UGxhbkFjY2VwdGFuY2VWYXJpYW50LFxuICAgIG5vcm1hbGl6ZWRYcmF5UHJlZ25hbmN5U3RhdHVzLFxuICAgIG5vcm1hbGl6ZWRYcmF5UHJpb3JpdHksXG4gICAgbm9ybWFsaXplZFhyYXlTdHVkeVR5cGUsXG4gICAgb2hpZkJhc2VVcmwsXG4gICAgb25ib2FyZGluZ0Jsb2NraW5nSXNzdWVzLFxuICAgIG9uYm9hcmRpbmdDaGFpckNyZWF0ZUd1aWRhbmNlSWQsXG4gICAgb25ib2FyZGluZ0Rpc21pc3NlZCxcbiAgICBvbmJvYXJkaW5nRG9jdW1lbnRSZWFkaW5lc3NJc3N1ZXMsXG4gICAgb25ib2FyZGluZ0RvY3VtZW50c1JlYWR5LFxuICAgIG9uYm9hcmRpbmdEcmFmdE1vZGUsXG4gICAgb25ib2FyZGluZ0ZpbmlzaEd1aWRhbmNlSWQsXG4gICAgb25ib2FyZGluZ1JlYWR5VG9GaW5pc2gsXG4gICAgb25ib2FyZGluZ1N0YWZmQ3JlYXRlR3VpZGFuY2VJZCxcbiAgICBvbmJvYXJkaW5nU3RlcCxcbiAgICBvbmJvYXJkaW5nU3RlcHMsXG4gICAgb25ib2FyZGluZ1RlbGVncmFtUmVjb21tZW5kYXRpb25zLFxuICAgIG9uYm9hcmRpbmdUZWxlZ3JhbVZpc3VhbENhcmRLZXlzLFxuICAgIG9wZW5BcHBvaW50bWVudEVkaXRvcixcbiAgICBvcGVuQ29tbXVuaWNhdGlvblRhc2tEb2N1bWVudFdvcmtmbG93LFxuICAgIG9wZW5Jc3N1ZWREb2N1bWVudEh0bWwsXG4gICAgb3Blbk9uYm9hcmRpbmdHdWlkZSxcbiAgICBvcGVuU2NoZWR1bGVXYXJuaW5nLFxuICAgIG9wZW5WaXNpdFdhcm5pbmdBY3Rpb24sXG4gICAgb3JnYW5pemVMb2NhbEltYWdpbmdTb3VyY2VzLFxuICAgIG91dHBhdGllbnQwMjV1TWVkaWNhbENhcmROdW1iZXJWYWx1ZSxcbiAgICBwYWlkQ29udHJhY3RUb3RhbFJ1YlZhbHVlLFxuICAgIHBhdGllbnRBZG1pbmlzdHJhdGl2ZVByb2ZpbGVWYWxpZGF0aW9uTWVzc2FnZSxcbiAgICBwYXRpZW50QmlsbGluZ1N1bW1hcnksXG4gICAgcGF0aWVudENsaW5pY2FsUnVsZUV2YWx1YXRpb25zLFxuICAgIHBhdGllbnRDbGluaWNhbFJ1bGVTdW1tYXJ5LFxuICAgIHBhdGllbnRJbnNpZ2h0QnlJZCxcbiAgICBwYXRpZW50SW5zaWdodFJpc2tMYWJlbHMsXG4gICAgcGF0aWVudEludGFrZVByZWduYW5jeVN0YXR1c09wdGlvbnMsXG4gICAgcGF0aWVudE5hbWUsXG4gICAgcGF5bWVudEFtb3VudCxcbiAgICBwYXltZW50RmVlZGJhY2ssXG4gICAgcGF5bWVudEZpc2NhbENhc2hpZXJOYW1lLFxuICAgIHBheW1lbnRGaXNjYWxGZCxcbiAgICBwYXltZW50RmlzY2FsRm4sXG4gICAgcGF5bWVudEZpc2NhbEZwZCxcbiAgICBwYXltZW50RmlzY2FsUmVjZWlwdElzc3VlZEF0LFxuICAgIHBheW1lbnRGaXNjYWxSZWNlaXB0TGFiZWxGb3JVaSxcbiAgICBwYXltZW50RmlzY2FsUmVjZWlwdE51bWJlcixcbiAgICBwYXltZW50RmlzY2FsUmVjZWlwdFVybCxcbiAgICBwYXltZW50SW52b2ljZVRvdGFsUnViVmFsdWUsXG4gICAgcGF5bWVudE1ldGhvZCxcbiAgICBwYXltZW50TWV0aG9kTGFiZWxzLFxuICAgIHBheW1lbnRQYXRpZW50Q29udGV4dE1lc3NhZ2UsXG4gICAgcGF5bWVudFBhdGllbnRDb250ZXh0UmVhZHksXG4gICAgcGF5bWVudFBheWVyQmlydGhEYXRlLFxuICAgIHBheW1lbnRQYXllckZ1bGxOYW1lLFxuICAgIHBheW1lbnRQYXllcklkZW50aXR5RG9jdW1lbnQsXG4gICAgcGF5bWVudFBheWVySW5uLFxuICAgIHBheW1lbnRQYXllclJlbGF0aW9uc2hpcCxcbiAgICBwYXltZW50UmVjZWlwdEZpc2NhbFJlY2VpcHRMaW5lcyxcbiAgICBwYXltZW50UmVjZWlwdElzc3VlZEJ5VmFsdWUsXG4gICAgcGF5bWVudFJlY2VpcHRQYXllckJpcnRoRGF0ZVZhbHVlLFxuICAgIHBheW1lbnRSZWNlaXB0UGF5ZXJGdWxsTmFtZVZhbHVlLFxuICAgIHBheW1lbnRSZWNlaXB0UGF5ZXJJZGVudGl0eURvY3VtZW50VmFsdWUsXG4gICAgcGF5bWVudFJlY2VpcHRQYXllcklublZhbHVlLFxuICAgIHBheW1lbnRSZWNlaXB0UGF5ZXJSZWxhdGlvbnNoaXBWYWx1ZSxcbiAgICBwYXltZW50VGF4RGVkdWN0aW9uQ29kZSxcbiAgICBwZW5kaW5nU3BlZWNoQ2h1bmtDb3VudCxcbiAgICBwZW5kaW5nU3BlZWNoRmx1c2hBY3Rpb25MYWJlbCxcbiAgICBwZW5kaW5nU3BlZWNoRmx1c2hBY3Rpb25UaXRsZSxcbiAgICBwZW5kaW5nVmlzaXRTYXZlQ291bnQsXG4gICAgcGVyc2lzdGVuY2VIZWFsdGgsXG4gICAgcGVyc2lzdGVuY2VJbnRlZ3JpdHksXG4gICAgcGhvdG9WaWRlb01hdGVyaWFsT3B0aW9ucyxcbiAgICBwaWNrQnJvd3NlckltYWdpbmdGb2xkZXIsXG4gICAgcGlja0Jyb3dzZXJNaWdyYXRpb25Tb3VyY2UsXG4gICAgcGxhbk1pZ3JhdGlvbkRpc2NvdmVyeUNhbmRpZGF0ZSxcbiAgICBwbGFubmVkU2VydmljZUxpbmVzRm9yRmluYW5jaWFsUGF5bG9hZCxcbiAgICBwb2xpY3lBdWRpdEV2ZW50TGFiZWxzLFxuICAgIHBvbGlzaFRyYW5zY3JpcHQsXG4gICAgcG9saXNoaW5nRmllbGQsXG4gICAgcG9saXNoU2luZ2xlRmllbGQsXG4gICAgcG9zdFZpc2l0Q2FyZVRvcGljT3B0aW9ucyxcbiAgICBwcmVsb2FkV29ya3NwYWNlVmlldyxcbiAgICBwcmVwYXJlRGljb21Xb3JrYmVuY2hGcm9tRm9sZGVyLFxuICAgIHByZXZpZXdEaWNvbUZpcnN0RnJhbWUsXG4gICAgcHJldmlld0RpY29tRmlyc3RGcmFtZVNsaWNlLFxuICAgIHByZXZpZXdEaWNvbVNlcmllcyxcbiAgICBwcmV2aWV3SW1hZ2luZ0ltcG9ydCxcbiAgICBwcmV2aWV3SW1wb3J0LFxuICAgIHByZXZpZXdNaWdyYXRpb25BdXRvcGlsb3RTb3VyY2VzLFxuICAgIHByZXZpZXdNaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGUsXG4gICAgcHJldmlld1NtYXJ0SW1wb3J0LFxuICAgIHByZXZpZXdUZWxlZ3JhbVRlbXBsYXRlLFxuICAgIHByZXZpb3VzT25ib2FyZGluZ1N0ZXAsXG4gICAgcHJpY2VsaXN0QW5hbHlzaXMsXG4gICAgcHJpY2VsaXN0SW1hZ2VCYXNlNjQsXG4gICAgcHJpY2VsaXN0SW1hZ2VOYW1lLFxuICAgIHByaWNlbGlzdEltYWdlTm90ZSxcbiAgICBwcmljZWxpc3RJdGVtTWF0ZXJpYWxUZXh0LFxuICAgIHByaWNlbGlzdE1hdGVyaWFsU3VtbWFyeVRleHQsXG4gICAgcHJpY2VsaXN0UGFyc2VyTW9kZUxhYmVscyxcbiAgICBwcmljZWxpc3RSZWNvZ25pdGlvbkJyYW5kR3JvdXBzLFxuICAgIHByaWNlbGlzdFJlY29nbml0aW9uU2VydmljZUdyb3VwcyxcbiAgICBwcmljZWxpc3RTb3VyY2VLaW5kLFxuICAgIHByaWNlbGlzdFNvdXJjZUtpbmRMYWJlbHMsXG4gICAgcHJpY2VsaXN0VGV4dCxcbiAgICBwcmljZWxpc3RXYXJuaW5nc1RleHQsXG4gICAgcHJpbWFyeVZpc2l0V2FybmluZyxcbiAgICBwcm9iZU1pZ3JhdGlvbkRpc2NvdmVyeUNhbmRpZGF0ZSxcbiAgICBwcm9jZWR1cmVTcGVjaWZpY0NvbnNlbnRQcm9jZWR1cmVPcHRpb25zLFxuICAgIHF1ZXJ5LFxuICAgIHJlY29nbml0aW9uSm9iLFxuICAgIHJlY29nbml0aW9uS2luZCxcbiAgICByZWNvZ25pdGlvblByZXNldHMsXG4gICAgcmVjb2duaXRpb25UYXJnZXQsXG4gICAgcmVjb2duaXRpb25UYXJnZXRMYWJlbHMsXG4gICAgcmVjb2duaXRpb25UZXh0LFxuICAgIHJlY29tbWVuZGVkQWN0aW9uUHJpb3JpdHlMYWJlbHMsXG4gICAgcmVjb25uZWN0RGljb21Xb3JrYmVuY2hGcm9tQ3VycmVudEZvbGRlcixcbiAgICByZWNvcmRQYXltZW50LFxuICAgIHJlZnJlc2hCcm93c2VyQ29udGludWl0eSxcbiAgICByZWZyZXNoU3BlZWNoUnVudGltZSxcbiAgICByZWxlYXNlUHJvdGVjdGlvbk5vdGUsXG4gICAgcmVtZW1iZXJMb2NhbEltYWdpbmdGb2xkZXIsXG4gICAgcmVuZGVyQ2xpbmljYWxUb290aFJvd3NFZGl0b3IsXG4gICAgcmVvcGVuT25ib2FyZGluZyxcbiAgICByZXF1ZXN0QnJvd3NlclN0b3JhZ2VQZXJzaXN0ZW5jZSxcbiAgICByZXF1ZXN0RG9jdW1lbnRJc3N1ZSxcbiAgICByZXF1ZXN0RG9jdW1lbnRWb2lkLFxuICAgIHJlc2V0TXByQ29udHJvbHMsXG4gICAgcmVzZXROZXdBcHBvaW50bWVudERyYWZ0LFxuICAgIHJlc3RvcmVEaWNvbVdvcmtiZW5jaFNlcnZlckJ1bmRsZSxcbiAgICByZXN0b3JlTXByV29ya2JlbmNoTG9jYWxEcmFmdCxcbiAgICByZXRyeUltYWdpbmdWaWV3ZXJTZXNzaW9uU2F2ZSxcbiAgICByZXZva2VUZWxlZ3JhbUNoYXRMaW5rLFxuICAgIHJvbGVGb2N1c09yZGVyLFxuICAgIHJ1bk1pZ3JhdGlvbkF1dG9waWxvdCxcbiAgICBydW5SZWNvZ25pdGlvbkpvYixcbiAgICBzYXZlQXBwb2ludG1lbnRTY2hlZHVsZSxcbiAgICBzYXZlQ2hhaXJTY2hlZHVsZSxcbiAgICBzYXZlQ2xpbmljUHJvZmlsZUZyb21EcmFmdCxcbiAgICBzYXZlRGljb21Xb3JrYmVuY2hCdW5kbGVUb1NlcnZlcixcbiAgICBzYXZlUGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZSxcbiAgICBzYXZlUGF0aWVudENvcmUsXG4gICAgc2F2ZVN0YWZmU2NoZWR1bGUsXG4gICAgc2F2ZVRlbGVncmFtU2V0dGluZ3MsXG4gICAgc2NhbkRpY29tRm9sZGVyU2VyaWVzLFxuICAgIHNjYW5JbWFnaW5nRm9sZGVyLFxuICAgIHNjZW5hcmlvUHJpb3JpdHlMYWJlbHMsXG4gICAgc2NlbmFyaW9TdHJhdGVneUxhYmVscyxcbiAgICBzY2hlZHVsZUFkbWluU2VjcmV0RHJhZnQsXG4gICAgc2NoZWR1bGVBZG1pblNlY3JldFNlc3Npb24sXG4gICAgc2Nyb2xsVG9WaXNpdEFyZWEsXG4gICAgc2VsZWN0QWxsRWxpZ2libGVUYXhQYXltZW50c0ZvckN1cnJlbnREb2N1bWVudCxcbiAgICBzZWxlY3RDdFBsYW5uaW5nSW1wbGFudCxcbiAgICBzZWxlY3RSZWZ1bmRPcmlnaW5hbFBheW1lbnQsXG4gICAgc2VsZWN0ZWRDb21wbGV0ZWRBY3RDb250cmFjdERvY3VtZW50SWQsXG4gICAgc2VsZWN0ZWREb2N1bWVudE1ldGFkYXRhLFxuICAgIHNlbGVjdGVkRG9jdW1lbnRVc2VzVGF4UGF5bWVudFNlbGVjdGlvbixcbiAgICBzZWxlY3RlZEVsaWdpYmxlVGF4UGF5bWVudHMsXG4gICAgc2VsZWN0ZWRJbWFnaW5nU3R1ZHksXG4gICAgc2VsZWN0ZWRJbWFnaW5nVmlld2VyUGxhbixcbiAgICBzZWxlY3RlZFBhdGllbnQsXG4gICAgc2VsZWN0ZWRQYXltZW50UmVjZWlwdElkU2V0LFxuICAgIHNlbGVjdGVkUGF5bWVudFJlY2VpcHRQYXltZW50cyxcbiAgICBzZWxlY3RlZFBheW1lbnRSZWNlaXB0VG90YWxSdWIsXG4gICAgc2VsZWN0ZWRQcm90b2NvbFRlbXBsYXRlLFxuICAgIHNlbGVjdGVkUmVmdW5kQ29ycmVjdGlvblBheW1lbnQsXG4gICAgc2VsZWN0ZWRSZWxlYXNlU291cmNlUmVxdWVzdERvY3VtZW50SWQsXG4gICAgc2VsZWN0ZWRTcGVjaWFsdHksXG4gICAgc2VsZWN0ZWRUYXhEb2N1bWVudFBheWVyS2V5LFxuICAgIHNlbGVjdGVkVGF4UGF5bWVudElkU2V0LFxuICAgIHNlbGVjdGVkVGF4UGF5bWVudFRvdGFsUnViLFxuICAgIHNlbGVjdGVkVWlMYW5ndWFnZU9wdGlvbixcbiAgICBzZWxlY3RlZFdvcmtzcGFjZVJvbGUsXG4gICAgc2VuZER1ZVRlbGVncmFtT3V0Ym94LFxuICAgIHNlbmRSZWNvZ25pdGlvblJlc3VsdFRvSW1wb3J0LFxuICAgIHNlbmRUZWxlZ3JhbU91dGJveEl0ZW0sXG4gICAgc2VydmVyRHJhZnRTeW5jU3RhdGUsXG4gICAgc2VydmljZUNhdGVnb3J5TGFiZWxzLFxuICAgIHNlcnZpY2VUaXRsZSxcbiAgICBzZXRDbGVhcmVkVHJhbnNjcmlwdFNuYXBzaG90LFxuICAgIHNldENvbW11bmljYXRpb25Ob3RlLFxuICAgIHNldEN0UGxhbm5pbmdBY3RpdmVRdWlja0FjdGlvbklkLFxuICAgIHNldEN0UGxhbm5pbmdJbXBsYW50UGxhbixcbiAgICBzZXRDdXJyZW50VmlldyxcbiAgICBzZXREaWNvbUZpcnN0RnJhbWVQcmV2aWV3LFxuICAgIHNldERpY29tRmlyc3RGcmFtZVZpZXdlclN0YXRlLFxuICAgIHNldERpY29tRm9sZGVyU2VyaWVzU2NhbixcbiAgICBzZXREaWNvbUZvbGRlcldvcmt1cFBsYW4sXG4gICAgc2V0RGljb21Mb2NhbEZvbGRlckRpc2NvdmVyeSxcbiAgICBzZXREaWNvbVJlbmRlckNhY2hlUGxhbixcbiAgICBzZXREaWNvbVNlcmllc1ByZXZpZXcsXG4gICAgc2V0RGljb21WaWV3ZXJMYXVuY2hNYW5pZmVzdCxcbiAgICBzZXREaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZSxcbiAgICBzZXREaWNvbVZpZXdlcldvcmtiZW5jaE1hbmlmZXN0LFxuICAgIHNldERpY29tV2ViQ2hlY2ssXG4gICAgc2V0RGljb21XZWJFbmRwb2ludFVybCxcbiAgICBzZXREaWNvbVdvcmtiZW5jaExvY2FsU2F2ZWRBdCxcbiAgICBzZXREaWNvbVdvcmtzdGF0aW9uUmVhZGluZXNzLFxuICAgIHNldERvY3VtZW50SW5nZXN0aW9uVGFyZ2V0LFxuICAgIHNldEVycm9yLFxuICAgIHNldEltYWdpbmdGb2xkZXJQYXRoLFxuICAgIHNldEltYWdpbmdGb2xkZXJTY2FuLFxuICAgIHNldEltYWdpbmdJbXBvcnRDb21taXQsXG4gICAgc2V0SW1hZ2luZ0ltcG9ydFByZXZpZXcsXG4gICAgc2V0SW1hZ2luZ0ltcG9ydFNvdXJjZUtpbmQsXG4gICAgc2V0SW1hZ2luZ0ltcG9ydFRleHQsXG4gICAgc2V0SW1hZ2luZ0tpbmRGaWx0ZXIsXG4gICAgc2V0SW1hZ2luZ1ZpZXdlckFjdGl2ZVRvb2wsXG4gICAgc2V0SW1hZ2luZ1ZpZXdlck5vdGUsXG4gICAgc2V0SW1hZ2luZ1ZpZXdlclN0YXRlLFxuICAgIHNldEltcG9ydENvbW1pdCxcbiAgICBzZXRJbXBvcnRJbnRha2UsXG4gICAgc2V0SW1wb3J0UHJldmlldyxcbiAgICBzZXRJbXBvcnRTb3VyY2VLaW5kLFxuICAgIHNldEltcG9ydFRleHQsXG4gICAgc2V0TG9jYWxJbWFnaW5nT3JnYW5pemVyLFxuICAgIHNldE1wckF4aXNEZWcsXG4gICAgc2V0TXByQ3Jvc3NoYWlyRW5hYmxlZCxcbiAgICBzZXRNcHJMaW5rZWRQbGFuZXNFbmFibGVkLFxuICAgIHNldE1wclByb2plY3Rpb24sXG4gICAgc2V0TXByU2xhYk1tLFxuICAgIHNldE1wclNsaWNlSW5kZXgsXG4gICAgc2V0TXByV2luZG93UHJlc2V0LFxuICAgIHNldE5ld0NoYWlySGFzTWljcm9zY29wZSxcbiAgICBzZXROZXdDaGFpckhhc1N1cmdlcnlLaXQsXG4gICAgc2V0TmV3Q2hhaXJIYXNYcmF5U2Vuc29yLFxuICAgIHNldE5ld0NoYWlyTmFtZSxcbiAgICBzZXROZXdSdWxlQWN0aW9uLFxuICAgIHNldE5ld1J1bGVCbG9ja2VkU2VydmljZUlkLFxuICAgIHNldE5ld1J1bGVDYXRlZ29yeSxcbiAgICBzZXROZXdSdWxlQ29tcGxldGVkU2VydmljZUlkLFxuICAgIHNldE5ld1J1bGVPd25lclJvbGUsXG4gICAgc2V0TmV3UnVsZVJlcXVpcmVkU2VydmljZUlkLFxuICAgIHNldE5ld1J1bGVTZXZlcml0eSxcbiAgICBzZXROZXdSdWxlU3BlY2lhbHR5LFxuICAgIHNldE5ld1J1bGVUaXRsZSxcbiAgICBzZXROZXdSdWxlVHJpZ2dlclNlcnZpY2VJZCxcbiAgICBzZXROZXdSdWxlV2FybmluZ1RleHQsXG4gICAgc2V0TmV3U3RhZmZOYW1lLFxuICAgIHNldE5ld1N0YWZmUm9sZSxcbiAgICBzZXROZXdTdGFmZlNwZWNpYWx0eSxcbiAgICBzZXRPaGlmQmFzZVVybCxcbiAgICBzZXRQYXltZW50QW1vdW50LFxuICAgIHNldFBheW1lbnRGaXNjYWxDYXNoaWVyTmFtZSxcbiAgICBzZXRQYXltZW50RmlzY2FsRmQsXG4gICAgc2V0UGF5bWVudEZpc2NhbEZuLFxuICAgIHNldFBheW1lbnRGaXNjYWxGcGQsXG4gICAgc2V0UGF5bWVudEZpc2NhbFJlY2VpcHRJc3N1ZWRBdCxcbiAgICBzZXRQYXltZW50RmlzY2FsUmVjZWlwdE51bWJlcixcbiAgICBzZXRQYXltZW50RmlzY2FsUmVjZWlwdFVybCxcbiAgICBzZXRQYXltZW50TWV0aG9kLFxuICAgIHNldFBheW1lbnRQYXllckJpcnRoRGF0ZSxcbiAgICBzZXRQYXltZW50UGF5ZXJGdWxsTmFtZSxcbiAgICBzZXRQYXltZW50UGF5ZXJJZGVudGl0eURvY3VtZW50LFxuICAgIHNldFBheW1lbnRQYXllcklubixcbiAgICBzZXRQYXltZW50UGF5ZXJSZWxhdGlvbnNoaXAsXG4gICAgc2V0UGF5bWVudFRheERlZHVjdGlvbkNvZGUsXG4gICAgc2V0UHJpY2VsaXN0QW5hbHlzaXMsXG4gICAgc2V0UHJpY2VsaXN0U291cmNlS2luZCxcbiAgICBzZXRQcmljZWxpc3RUZXh0LFxuICAgIHNldFF1ZXJ5LFxuICAgIHNldFJlY29nbml0aW9uSm9iLFxuICAgIHNldFJlY29nbml0aW9uVGV4dCxcbiAgICBzZXRSZWxlYXNlUHJvdGVjdGlvbk5vdGUsXG4gICAgc2V0U2VsZWN0ZWRJbWFnaW5nU3R1ZHlJZCxcbiAgICBzZXRTZWxlY3RlZFByb3RvY29sSWQsXG4gICAgc2V0U2VsZWN0ZWRTcGVjaWFsdHksXG4gICAgc2V0U2VsZWN0ZWRXb3Jrc3BhY2VSb2xlLFxuICAgIHNldFNldHRpbmdzQWRtaW5TZWNyZXREcmFmdCxcbiAgICBzZXRTZXR0aW5nc1RhYixcbiAgICBzZXRTbWFydEltcG9ydENvbW1pdCxcbiAgICBzZXRTbWFydEltcG9ydE1vZGUsXG4gICAgc2V0U21hcnRJbXBvcnRQcmV2aWV3LFxuICAgIHNldFNtYXJ0SW1wb3J0VGV4dCxcbiAgICBzZXRUZWxlZ3JhbUFkbWluU2VjcmV0RHJhZnQsXG4gICAgc2V0VGVsZWdyYW1Cb3RVc2VybmFtZURyYWZ0LFxuICAgIHNldFRlbGVncmFtSGFuZG9mZk5vdGljZSxcbiAgICBzZXRUZWxlZ3JhbU1hcHNVcmxEcmFmdCxcbiAgICBzZXRUZWxlZ3JhbVBhdGllbnRQb3J0YWxCYXNlVXJsRHJhZnQsXG4gICAgc2V0VGVsZWdyYW1Qcml2YWN5TW9kZURyYWZ0LFxuICAgIHNldFRlbGVncmFtUmVtaW5kZXJMZWFkVGltZXNEcmFmdCxcbiAgICBzZXRUZWxlZ3JhbVJldmlld1JlcXVlc3REZWxheURyYWZ0LFxuICAgIHNldFRlbGVncmFtUmV2aWV3VXJsRHJhZnQsXG4gICAgc2V0VGVsZWdyYW1Ub2tlblR0bERyYWZ0LFxuICAgIHNldFRlbGVncmFtV2VsY29tZUltYWdlVXJsRHJhZnQsXG4gICAgc2V0VHJhbnNjcmlwdCxcbiAgICBzZXRVaUxhbmd1YWdlLFxuICAgIHNldFVpUHJlZmVyZW5jZXNTeW5jRXJyb3IsXG4gICAgc2V0VXNlUHJpY2VsaXN0QWksXG4gICAgc2V0dGluZ3NBZG1pblNlY3JldERvbWFpbixcbiAgICBzZXR0aW5nc0FkbWluU2VjcmV0RHJhZnQsXG4gICAgc2V0dGluZ3NBZG1pblNlY3JldFNlc3Npb24sXG4gICAgc2V0dGluZ3NUYWIsXG4gICAgc2V0dGluZ3NUYWJzLFxuICAgIHNoaWZ0V2FybmluZ3MsXG4gICAgc2hvd0FkbWluaXN0cmF0aW9uVG9wQWN0aW9ucyxcbiAgICBzaG93RG9jdG9yVmlzaXRTaG9ydGN1dCxcbiAgICBzaG93RnVsbE9uYm9hcmRpbmdHdWlkZSxcbiAgICBzbWFydEltcG9ydENvbW1pdCxcbiAgICBzbWFydEltcG9ydE1vZGUsXG4gICAgc21hcnRJbXBvcnRNb2RlTGFiZWxzLFxuICAgIHNtYXJ0SW1wb3J0UHJldmlldyxcbiAgICBzbWFydEltcG9ydFRleHQsXG4gICAgc29ydGVkQXBwb2ludG1lbnRzLFxuICAgIHNvcnRlZENvbW11bmljYXRpb25UYXNrcyxcbiAgICBzcGVjaWFsdGllc1dpdGhUZW1wbGF0ZXMsXG4gICAgc3BlY2lhbHR5TGFiZWxzLFxuICAgIHNwZWNpYWx0eVByb3RvY29sVGVtcGxhdGVzLFxuICAgIHNwZWVjaEdhdGV3YXlBY3RpdmVQcm92aWRlcklzTG9jYWwsXG4gICAgc3BlZWNoR2F0ZXdheUNhblVwbG9hZCxcbiAgICBzcGVlY2hHYXRld2F5SGVhbHRoUmVwb3J0LFxuICAgIHNwZWVjaEdhdGV3YXlTdGF0dXMsXG4gICAgc3BlZWNoUHJvdmlkZXJDb25uZWN0b3JMYWJlbHMsXG4gICAgc3BlZWNoUHJvdmlkZXJIZWFsdGhCeUlkLFxuICAgIHNwZWVjaFByb3ZpZGVySGVhbHRoTGFiZWxzLFxuICAgIHNwZWVjaFByb3ZpZGVyTW9kZUxhYmVscyxcbiAgICBzcGVlY2hQcm92aWRlclJ1bnRpbWVCeUlkLFxuICAgIHNwZWVjaFByb3ZpZGVyU2VsZWN0aW9uTGFiZWxzLFxuICAgIHNwZWVjaFByb3ZpZGVyU3RhdHVzTGFiZWxzLFxuICAgIHNwZWVjaFJlY29nbml0aW9uUmVhZHksXG4gICAgc3BlZWNoUmVjb3JkaW5nUGF0aExhYmVscyxcbiAgICBzcGVlY2hSZWNvcmRpbmdSZWNvdmVyeSxcbiAgICBzcGVlY2hSZWNvcmRpbmdTdHJhdGVneSxcbiAgICBzcGVlY2hSZWNvdmVyeVN0YXRlTGFiZWxzLFxuICAgIHNwZWVjaFN0YXR1c05vdGUsXG4gICAgc3BlZWNoVHJhbnNjcmlwdGlvbkJ1c3ksXG4gICAgc3BlZWNoTGl2ZVJtcyxcbiAgICBzdGFmZlJvbGVMYWJlbHMsXG4gICAgc3RhZmZTY2hlZHVsZURpcnR5SWRzLFxuICAgIHN0YWZmU2NoZWR1bGVEcmFmdEZyb21Xb3JraW5nSG91cnMsXG4gICAgc3RhZmZTY2hlZHVsZURyYWZ0cyxcbiAgICBzdGFmZlNjaGVkdWxlU2F2ZVN0YXRlcyxcbiAgICBzdGFmZlNjaGVkdWxlU2F2aW5nSWQsXG4gICAgc3RhZ2VMb2NhbEltYWdpbmdGb2xkZXJSZWNvdmVyeSxcbiAgICBzdGFydEltcG9ydERpY3RhdGlvbixcbiAgICBzdGFydFNlcnZlclZvaWNlUmVjb3JkaW5nLFxuICAgIHN0YXJ0VmlzaXREaWN0YXRpb24sXG4gICAgc3RvcFNlcnZlclZvaWNlUmVjb3JkaW5nLFxuICAgIHN0cnVjdHVyZWRQYXlsb2FkRG9jdW1lbnRLaW5kcyxcbiAgICB0YXhBcHBsaWNhdGlvbkRlbGl2ZXJ5Q2hhbm5lbE9wdGlvbnMsXG4gICAgdGF4QXBwbGljYXRpb25Gb3JtT3B0aW9ucyxcbiAgICB0YXhBcHBsaWNhdGlvblJlbGF0aW9uc2hpcE9wdGlvbnMsXG4gICAgdGF4RG9jdW1lbnRQYXllck9wdGlvbnMsXG4gICAgdGVsZWdyYW1BZG1pblNlY3JldERyYWZ0LFxuICAgIHRlbGVncmFtQWRtaW5TZWNyZXRTZXNzaW9uLFxuICAgIHRlbGVncmFtQWxsb3dWb2ljZUludGFrZURyYWZ0LFxuICAgIHRlbGVncmFtQm90Q29uZmlnSWQsXG4gICAgdGVsZWdyYW1Cb3RVc2VybmFtZURyYWZ0LFxuICAgIHRlbGVncmFtQ2hhdExpbmtMZWRnZXIsXG4gICAgdGVsZWdyYW1DaGF0TGlua3MsXG4gICAgdGVsZWdyYW1DbGFzc2lmaWNhdGlvbkxhYmVscyxcbiAgICB0ZWxlZ3JhbURlbGl2ZXJ5U3RhdHVzTGFiZWxzLFxuICAgIHRlbGVncmFtRW5hYmxlZEZlYXR1cmVzRHJhZnQsXG4gICAgdGVsZWdyYW1GZWF0dXJlSGVscCxcbiAgICB0ZWxlZ3JhbUZlYXR1cmVMYWJlbCxcbiAgICB0ZWxlZ3JhbUZlYXR1cmVPcHRpb25zLFxuICAgIHRlbGVncmFtRmVhdHVyZVBsYW4sXG4gICAgdGVsZWdyYW1IYW5kb2ZmTm90aWNlLFxuICAgIHRlbGVncmFtSHVtYW5NZXNzYWdlLFxuICAgIHRlbGVncmFtSW5saW5lQnV0dG9uS2luZExhYmVscyxcbiAgICB0ZWxlZ3JhbUlubGluZUJ1dHRvblJvd3NGcm9tUmVwbHlNYXJrdXAsXG4gICAgdGVsZWdyYW1MaW5rQWN0aW9uU3RhdGUsXG4gICAgdGVsZWdyYW1MaW5rQ29kZSxcbiAgICB0ZWxlZ3JhbUxpbmtDb2RlTGVkZ2VyLFxuICAgIHRlbGVncmFtTGlua0NvZGVTdGF0dXNMYWJlbHMsXG4gICAgdGVsZWdyYW1MaW5rQ29kZXMsXG4gICAgdGVsZWdyYW1MaW5rU3RhZmZJZCxcbiAgICB0ZWxlZ3JhbUxpbmtTdGFmZk9wdGlvbnMsXG4gICAgdGVsZWdyYW1MaW5rU3ViamVjdFR5cGUsXG4gICAgdGVsZWdyYW1NYXBzVXJsRHJhZnQsXG4gICAgdGVsZWdyYW1Nb2RlRHJhZnQsXG4gICAgdGVsZWdyYW1Nb2RlSGludHMsXG4gICAgdGVsZWdyYW1Nb2RlTGFiZWxzLFxuICAgIHRlbGVncmFtT3V0Ym94LFxuICAgIHRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyLFxuICAgIHRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyTGFiZWxzLFxuICAgIHRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyT3B0aW9ucyxcbiAgICB0ZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyLFxuICAgIHRlbGVncmFtT3V0Ym94VGVtcGxhdGVGaWx0ZXJMYWJlbHMsXG4gICAgdGVsZWdyYW1PdXRib3hUZW1wbGF0ZUZpbHRlck9wdGlvbnMsXG4gICAgdGVsZWdyYW1Pd25Cb3RVc2VybmFtZURyYWZ0LFxuICAgIHRlbGVncmFtUGF0aWVudFBvcnRhbEJhc2VVcmxEcmFmdCxcbiAgICB0ZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheURyYWZ0cyxcbiAgICB0ZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheUZpZWxkcyxcbiAgICB0ZWxlZ3JhbVByZXZpZXcsXG4gICAgdGVsZWdyYW1Qcml2YWN5TW9kZURyYWZ0LFxuICAgIHRlbGVncmFtUHJpdmFjeU1vZGVIaW50cyxcbiAgICB0ZWxlZ3JhbVByaXZhY3lNb2RlTGFiZWxzLFxuICAgIHRlbGVncmFtUXJTdmdUb0RhdGFVcmwsXG4gICAgdGVsZWdyYW1SZW1pbmRlckxlYWRUaW1lc0RyYWZ0LFxuICAgIHRlbGVncmFtUmV2aWV3UmVxdWVzdERlbGF5RHJhZnQsXG4gICAgdGVsZWdyYW1SZXZpZXdVcmxEcmFmdCxcbiAgICB0ZWxlZ3JhbVJldm9raW5nTGlua0lkLFxuICAgIHRlbGVncmFtU2VuZGluZ0l0ZW1JZCxcbiAgICB0ZWxlZ3JhbVNldHRpbmdzRGlydHksXG4gICAgdGVsZWdyYW1TZXR0aW5nc1NhdmVFcnJvcixcbiAgICB0ZWxlZ3JhbVNldHRpbmdzU2F2ZVN0YXRlLFxuICAgIHRlbGVncmFtU3RhZmZFc2NhbGF0aW9uQ2hhbm5lbERyYWZ0LFxuICAgIHRlbGVncmFtU3RhdHVzLFxuICAgIHRlbGVncmFtU3ViamVjdE5hbWUsXG4gICAgdGVsZWdyYW1UZW1wbGF0ZUxhYmVscyxcbiAgICB0ZWxlZ3JhbVRva2VuVHRsRHJhZnQsXG4gICAgdGVsZWdyYW1WaXN1YWxDYXJkRmllbGRzLFxuICAgIHRlbGVncmFtVmlzdWFsQ2FyZFVybERyYWZ0cyxcbiAgICB0ZWxlZ3JhbVdlYmhvb2tCYXNlVXJsRHJhZnQsXG4gICAgdGVsZWdyYW1XZWxjb21lSW1hZ2VVcmxEcmFmdCxcbiAgICB0b0RhdGVUaW1lTG9jYWxWYWx1ZSxcbiAgICB0b2dnbGVDaGFpcldvcmtpbmdEYXksXG4gICAgdG9nZ2xlQ2xpbmljV29ya2luZ0RheSxcbiAgICB0b2dnbGVDbGluaWNhbFJ1bGUsXG4gICAgdG9nZ2xlUGhvdG9WaWRlb01hdGVyaWFsLFxuICAgIHRvZ2dsZVN0YWZmV29ya2luZ0RheSxcbiAgICB0b2dnbGVUZWxlZ3JhbUZlYXR1cmUsXG4gICAgdG9vdGhSb3dzLFxuICAgIHRvb3RoU3RhdGVCeUNvZGUsXG4gICAgc2V0VG9vdGhTdGF0ZSxcbiAgICB0cmFuc2NyaXB0LFxuICAgIHRyZWF0bWVudEFjY2VwdGFuY2VQbGFubmVkVG90YWxSdWIsXG4gICAgdHJlYXRtZW50RXN0aW1hdGVQYXRpZW50T3JQYXllckZ1bGxOYW1lVmFsdWUsXG4gICAgdHJlYXRtZW50RXN0aW1hdGVUb3RhbFJ1YlZhbHVlLFxuICAgIHRyZWF0bWVudEVzdGltYXRlVHJlYXRtZW50QmFzaXNWYWx1ZSxcbiAgICB0cmVhdG1lbnRTdGF0dXNMYWJlbHMsXG4gICAgdWlMYW5ndWFnZSxcbiAgICB1aUxhbmd1YWdlT3B0aW9ucyxcbiAgICB1aVByZWZlcmVuY2VzU3luY0Vycm9yLFxuICAgIHVuZG9UcmFuc2NyaXB0Q2xlYXIsXG4gICAgdW5sb2NrVGVsZWdyYW1BZG1pblNlc3Npb24sXG4gICAgdXBkYXRlQXBwb2ludG1lbnRTY2hlZHVsZURyYWZ0LFxuICAgIHVwZGF0ZUNoYWlyU2NoZWR1bGVEYXksXG4gICAgdXBkYXRlQ2hhaXJTY2hlZHVsZURyYWZ0LFxuICAgIHVwZGF0ZUNsaW5pY1Byb2ZpbGVEcmFmdCxcbiAgICB1cGRhdGVOZXdBcHBvaW50bWVudERyYWZ0LFxuICAgIHVwZGF0ZVBhdGllbnRBZG1pbmlzdHJhdGl2ZVByb2ZpbGVEcmFmdCxcbiAgICB1cGRhdGVQYXRpZW50Q29yZURyYWZ0LFxuICAgIHVwZGF0ZVN0YWZmU2NoZWR1bGVEYXksXG4gICAgdXBkYXRlU3RhZmZTY2hlZHVsZURyYWZ0LFxuICAgIHVwZGF0ZVRlbGVncmFtUG9zdFZpc2l0Q2hlY2t1cERlbGF5RHJhZnQsXG4gICAgdXBkYXRlVGVsZWdyYW1WaXN1YWxDYXJkVXJsRHJhZnQsXG4gICAgdXBkYXRlVmlzaXROb3RlRmllbGQsXG4gICAgdXNlUHJpY2VsaXN0QWksXG4gICAgdmlld0xhYmVscyxcbiAgICB2aXNpYmxlSW1hZ2luZ1N0dWRpZXMsXG4gICAgdmlzaWJsZVJlY29tbWVuZGVkQWN0aW9ucyxcbiAgICB2aXNpYmxlU2NoZWR1bGVTdWdnZXN0aW9ucyxcbiAgICB2aXNpYmxlVGVsZWdyYW1PdXRib3hJdGVtcyxcbiAgICB2aXNpYmxlVmlzaXRTcGVjaWFsdHlGb2N1c09wdGlvbnMsXG4gICAgdmlzaXRDbG9zZUNoZWNrbGlzdCxcbiAgICB2aXNpdERyYWZ0QnVpbGRNaXNzaW5nU3RlcHMsXG4gICAgdmlzaXREcmFmdE1pc3NpbmdGaWVsZExhYmVsLFxuICAgIHZpc2l0RHJhZnRRdWFsaXR5TGFiZWxzLFxuICAgIHZpc2l0RHJhZnRSZWFkeVRvQnVpbGQsXG4gICAgdmlzaXREcmFmdFNpZ25hbExhYmVsLFxuICAgIHZpc2l0RHJhZnRVc2VyRWRpdGVkUmVmLFxuICAgIHZpc2l0Tm90ZUFjY2VwdE1pc3NpbmdTdGVwcyxcbiAgICB2aXNpdE5vdGVBY3Rpb25MYWJlbCxcbiAgICB2aXNpdE5vdGVGaWVsZERlZmluaXRpb25zLFxuICAgIHZpc2l0Tm90ZUZvcm0sXG4gICAgdmlzaXROb3RlUmVhZHlUb0FjY2VwdCxcbiAgICB2aXNpdE5vdGVTdGF0dXNMYWJlbCxcbiAgICB2aXNpdFByaW1hcnlBY3Rpb24sXG4gICAgdmlzaXRTYWZldHlDYXJkcyxcbiAgICB2aXNpdFNhdmVSZWNlaXB0VGV4dCxcbiAgICB2aXNpdFdhcm5pbmdzLFxuICAgIHZpc2l0V29ya2Zsb3dTdGVwcyxcbiAgICB3YXJuaW5nU2V2ZXJpdHlMYWJlbHMsXG4gICAgd2FycmFudHlMaW5rZWRBY3RPckNvbnRyYWN0VmFsdWUsXG4gICAgd2FycmFudHlTZXJ2aWNlT3JXb3JrTmFtZVZhbHVlLFxuICAgIHdhcnJhbnR5VGVldGhPckFyZWFWYWx1ZSxcbiAgICB3ZWVrZGF5T3B0aW9ucyxcbiAgICB3b3Jrc3BhY2VTY29wZUxhYmVscyxcbiAgICB4cmF5UHJlZ25hbmN5U3RhdHVzT3B0aW9ucyxcbiAgICB4cmF5U3R1ZHlUeXBlT3B0aW9ucyxcbiAgXG4gIGFjY2Vzc1VubG9ja1JlcXVpcmVkLFxuICBhY2Nlc3NVbmxvY2tNZXNzYWdlLFxuICBjbGluaWNhbEFkbWluU2VjcmV0RHJhZnQsXG4gIHNldENsaW5pY2FsQWRtaW5TZWNyZXREcmFmdCxcbiAgbG9hZERhc2hib2FyZCxcbiAgb3BlcmF0b3JXb3JrZmxvd0ZhaWx1cmVNZXNzYWdlLFxuICBoYW5kbGVTZWxlY3REZW1vTW9kZSxcbiAgaGFuZGxlU2VsZWN0WmVyb01vZGUsXG4gIHNldFNlbGVjdGVkUGF0aWVudElkLFxuICBzZXRTY2hlZHVsZURhdGVGaWx0ZXIsXG4gIHNjaGVkdWxlRGF0ZUZpbHRlcixcbiAgaGFuZGxlRmluaXNoT25ib2FyZGluZ1xufSA9IHVzZUFwcExvZ2ljKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHNjaGVkdWxlSWRsZVdvcmtzcGFjZVByZWxvYWQoY3VycmVudFZpZXcpLCBbY3VycmVudFZpZXddKTtcblxuICBjb25zdCBbcmVzZXR0aW5nLCBzZXRSZXNldHRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIC8vIC0tLSBEVUFMLVRJRVIgQVVUSCBTVEFURSAtLS1cbiAgY29uc3QgW2NsaW5pY0F1dGhlZCwgc2V0Q2xpbmljQXV0aGVkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KCgpID0+IHtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZGVudGVfY2xpbmljX3Rva2VuXCIpO1xuICB9KTtcbiAgY29uc3QgW3N0YWZmQXV0aGVkLCBzZXRTdGFmZkF1dGhlZF0gPSB1c2VTdGF0ZTxib29sZWFuPigoKSA9PiB7XG4gICAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgISFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRlbnRlX3N0YWZmX3Rva2VuXCIpO1xuICB9KTtcbiAgY29uc3QgW3Nob3dTdGFmZlBpblBhZCwgc2V0U2hvd1N0YWZmUGluUGFkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgY29uc3QgW2FjdGl2ZVN0YWZmVXNlciwgc2V0QWN0aXZlU3RhZmZVc2VyXSA9IHVzZVN0YXRlPGFueT4obnVsbCk7XG5cbiAgLy8gT24gbW91bnQ6IGlmIGNsaW5pYyB0b2tlbiBhbHJlYWR5IGluIGxvY2FsU3RvcmFnZSAocGFnZSByZWZyZXNoIC8gcGVyc2lzdGVkIHNlc3Npb24pLCBsb2FkIGRhc2hib2FyZCArIHJlc3RvcmUgdXNlciBwcm9maWxlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNsaW5pY0F1dGhlZCAmJiAhZGFzaGJvYXJkKSB7XG4gICAgICB2b2lkIGxvYWREYXNoYm9hcmQoKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAvLyBUb2tlbiBleHBpcmVkIG9yIGludmFsaWQgLSBmb3JjZSByZS1sb2dpblxuICAgICAgICBjb25zb2xlLndhcm4oXCJbRGVudGVdIFBlcnNpc3RlZCBjbGluaWMgdG9rZW4gaW52YWxpZCwgZm9yY2luZyByZS1sb2dpbjpcIiwgZSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZGVudGVfY2xpbmljX3Rva2VuXCIpO1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImRlbnRlX3N0YWZmX3Rva2VuXCIpO1xuICAgICAgICBzZXRDbGluaWNBdXRoZWQoZmFsc2UpO1xuICAgICAgICBzZXRTdGFmZkF1dGhlZChmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gUmVzdG9yZSBzdGFmZiB1c2VyIHByb2ZpbGUgZnJvbSB0b2tlbiBvbiBwYWdlIHJlZnJlc2hcbiAgICBjb25zdCBzdGFmZlRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkZW50ZV9zdGFmZl90b2tlblwiKTtcbiAgICBpZiAoc3RhZmZUb2tlbiAmJiAhYWN0aXZlU3RhZmZVc2VyKSB7XG4gICAgICBmZXRjaChcIi9hcGkvYXV0aC91c2VyL21lXCIsIHtcbiAgICAgICAgaGVhZGVyczogeyBcIngtZGVudGUtc3RhZmYtdG9rZW5cIjogc3RhZmZUb2tlbiB9XG4gICAgICB9KS50aGVuKHIgPT4gci5vayA/IHIuanNvbigpIDogbnVsbClcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGE/LnVzZXIpIHNldEFjdGl2ZVN0YWZmVXNlcihkYXRhLnVzZXIpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyAvKiBzaWxlbnQgLSB1c2VyIHdpbGwgYmUgcHJvbXB0ZWQgdG8gcmUtbG9naW4gKi8gfSk7XG4gICAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtdKTsgLy8gUnVuIG9uY2Ugb24gbW91bnQgb25seVxuXG4gIC8vIEF1dG8tbG9jayBvbiBpbmFjdGl2aXR5ICg1IG1pbnV0ZXMpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFjbGluaWNBdXRoZWQpIHJldHVybjtcbiAgICBsZXQgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+O1xuICAgIGNvbnN0IHJlc2V0VGltZXIgPSAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2V0U3RhZmZBdXRoZWQoZmFsc2UpO1xuICAgICAgICBzZXRTaG93U3RhZmZQaW5QYWQodHJ1ZSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZGVudGVfc3RhZmZfdG9rZW5cIik7XG4gICAgICB9LCA1ICogNjAgKiAxMDAwKTtcbiAgICB9O1xuICAgIGNvbnN0IGV2ZW50cyA9IFtcIm1vdXNlbW92ZVwiLCBcImtleWRvd25cIiwgXCJwb2ludGVyZG93blwiLCBcInRvdWNoc3RhcnRcIl07XG4gICAgZXZlbnRzLmZvckVhY2goKGUpID0+IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgcmVzZXRUaW1lciwgeyBwYXNzaXZlOiB0cnVlIH0pKTtcbiAgICByZXNldFRpbWVyKCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICBldmVudHMuZm9yRWFjaCgoZSkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCByZXNldFRpbWVyKSk7XG4gICAgfTtcbiAgfSwgW2NsaW5pY0F1dGhlZF0pO1xuXG4gIGNvbnN0IGhhbmRsZUNsaW5pY0xvZ291dCA9ICgpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImRlbnRlX2NsaW5pY190b2tlblwiKTtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImRlbnRlX3N0YWZmX3Rva2VuXCIpO1xuICAgIHNldENsaW5pY0F1dGhlZChmYWxzZSk7XG4gICAgc2V0U3RhZmZBdXRoZWQoZmFsc2UpO1xuICAgIHNldFNob3dTdGFmZlBpblBhZChmYWxzZSk7XG4gICAgc2V0QWN0aXZlU3RhZmZVc2VyKG51bGwpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUxvY2tTZXNzaW9uID0gKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZGVudGVfc3RhZmZfdG9rZW5cIik7XG4gICAgc2V0U3RhZmZBdXRoZWQoZmFsc2UpO1xuICAgIHNldFNob3dTdGFmZlBpblBhZCh0cnVlKTtcbiAgfTtcblxuICAvLyBTaG93IGNsaW5pYyBsb2dpbiBnYXRlIGlmIG5vdCBhdXRoZWRcbiAgaWYgKCFjbGluaWNBdXRoZWQpIHtcbiAgICByZXR1cm4gPEF1dGhIdWIgb25TdWNjZXNzPXsoY3AsIHVwKSA9PiB7XG4gICAgICBzZXRDbGluaWNBdXRoZWQodHJ1ZSk7XG4gICAgICBpZiAodXApIHtcbiAgICAgICAgc2V0U3RhZmZBdXRoZWQodHJ1ZSk7XG4gICAgICAgIHNldEFjdGl2ZVN0YWZmVXNlcih1cCk7XG4gICAgICB9XG4gICAgICB2b2lkIGxvYWREYXNoYm9hcmQoKTtcbiAgICB9fSAvPjtcbiAgfVxuXG4gIC8vIFNob3cgc3RhZmYgUElOIHBhZCBpZiBjbGluaWMgYXV0aGVkIGJ1dCBubyBzdGFmZiBzZXNzaW9uIChvciBhZnRlciBsb2NrKVxuICBpZiAoIXN0YWZmQXV0aGVkIHx8IHNob3dTdGFmZlBpblBhZCkge1xuICAgIGlmICghZGFzaGJvYXJkKSB7XG4gICAgICByZXR1cm4gPEFwcExvYWRpbmdTdGF0ZSBtZXNzYWdlPVwi0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0LrQu9C40L3QuNC60LguLi5cIiAvPjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFmZlBpblBhZFxuICAgICAgICBzdGFmZk1lbWJlcnM9e2Rhc2hib2FyZC5jbGluaWNTZXR0aW5ncz8uc3RhZmYgPz8gW119XG4gICAgICAgIG9uVW5sb2NrU3VjY2Vzcz17KHVzZXIpID0+IHtcbiAgICAgICAgICBzZXRBY3RpdmVTdGFmZlVzZXIodXNlcik7XG4gICAgICAgICAgc2V0U3RhZmZBdXRoZWQodHJ1ZSk7XG4gICAgICAgICAgc2V0U2hvd1N0YWZmUGluUGFkKGZhbHNlKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25DbGluaWNMb2dvdXQ9e2hhbmRsZUNsaW5pY0xvZ291dH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG5cbiAgaWYgKCFvbmJvYXJkaW5nRGlzbWlzc2VkKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cImFwcC1zaGVsbCBvbmJvYXJkaW5nLWZ1bGxzY3JlZW5cIiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgbWluSGVpZ2h0OiBcIjEwMHZoXCIsIHBhZGRpbmc6IFwiNDBweCAyMHB4XCIsIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzBkOTQ4OCAwJSwgIzExMTgyNyAxMDAlKVwiLCBvdmVyZmxvd1k6IFwiYXV0b1wiIH19PlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ3b3Jrc3BhY2Ugb25ib2FyZGluZy1vbmx5LXdvcmtzcGFjZVwiIGlkPVwid29ya3NwYWNlLWNvbnRlbnRcIiBzdHlsZT17eyBtYXhXaWR0aDogXCI4MDBweFwiLCB3aWR0aDogXCIxMDAlXCIsIG1hcmdpbjogXCJhdXRvXCIsIHBhZGRpbmc6IFwiMFwiLCBiYWNrZ3JvdW5kOiBcIm5vbmVcIiwgYm94U2hhZG93OiBcIm5vbmVcIiB9fT5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXNoZWxsXCIgYXJpYS1sYWJlbD1cItCf0LXRgNCy0LjRh9C90LDRjyDQvdCw0YHRgtGA0L7QudC60LAg0LrQu9C40L3QuNC60LhcIiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLCBib3JkZXJSYWRpdXM6IFwiMTZweFwiLCBib3hTaGFkb3c6IFwiMCAxMHB4IDI1cHggLTVweCByZ2JhKDAsIDAsIDAsIDAuMSksIDAgOHB4IDEwcHggLTZweCByZ2JhKDAsIDAsIDAsIDAuMSlcIiwgcGFkZGluZzogXCIzMnB4XCIsIGJvcmRlcjogXCIxcHggc29saWQgI2U1ZTdlYlwiIH19PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB7LyogT25ib2FyZGluZyBIZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctaGVhZFwiIHN0eWxlPXt7IGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgI2YzZjRmNlwiLCBwYWRkaW5nQm90dG9tOiBcIjIwcHhcIiwgbWFyZ2luQm90dG9tOiBcIjI0cHhcIiB9fT5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJleWVicm93XCIgc3R5bGU9e3sgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgZm9udFNpemU6IFwiMTJweFwiLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDVlbVwiLCBjb2xvcjogXCIjMGQ5NDg4XCIsIGZvbnRXZWlnaHQ6IFwiNjAwXCIgfX0+0J/QtdGA0LLRi9C5INC30LDQv9GD0YHQujwvcD5cbiAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6IFwiMjRweFwiLCBmb250V2VpZ2h0OiBcIjcwMFwiLCBjb2xvcjogXCIjMTExODI3XCIsIG1hcmdpblRvcDogXCI0cHhcIiB9fT7QkdGL0YHRgtGA0LDRjyDQvdCw0YHRgtGA0L7QudC60LAgQ1JNIERlbnRlPC9oMj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFN0ZXAgbGlzdCBpZiBub3QgaW50cm8gKi99XG4gICAgICAgICAgICB7b25ib2FyZGluZ1N0ZXAgIT09IFwiaW50cm9cIiA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aXphcmQtc3RlcC1saXN0XCIgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogXCIxMnB4XCIsIG1hcmdpbkJvdHRvbTogXCIzMnB4XCIgfX0+XG4gICAgICAgICAgICAgICAge29uYm9hcmRpbmdTdGVwcy5tYXAoKHN0ZXAsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGtleT17c3RlcC5pZH1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4OiBcIjFcIixcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHhcIixcbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogc3RlcC5pZCA9PT0gb25ib2FyZGluZ1N0ZXAgPyBcIiNmMGZkZmFcIiA6IFwiI2Y5ZmFmYlwiLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWRcIixcbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogc3RlcC5pZCA9PT0gb25ib2FyZGluZ1N0ZXAgPyBcIiMwZDk0ODhcIiA6IFwiI2U1ZTdlYlwiLFxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgZ2FwOiBcIjJweFwiXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiBcIjExcHhcIiwgY29sb3I6IHN0ZXAuaWQgPT09IG9uYm9hcmRpbmdTdGVwID8gXCIjMGQ5NDg4XCIgOiBcIiM2YjcyODBcIiwgZm9udFdlaWdodDogXCI2MDBcIiB9fT7QqNCw0LMge2luZGV4ICsgMX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBjb2xvcjogc3RlcC5pZCA9PT0gb25ib2FyZGluZ1N0ZXAgPyBcIiMwZjc2NmVcIiA6IFwiIzM3NDE1MVwiIH19PntzdGVwLnRpdGxlfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIxMXB4XCIsIGNvbG9yOiBcIiM2YjcyODBcIiB9fT57c3RlcC5kZXRhaWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICAgIHsvKiBJbnRybyBTdGVwICovfVxuICAgICAgICAgICAge29uYm9hcmRpbmdTdGVwID09PSBcImludHJvXCIgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1wYW5lbFwiIHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IFwiMjRweFwiIH19PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3sgZm9udFNpemU6IFwiMjBweFwiLCBmb250V2VpZ2h0OiBcIjYwMFwiLCBtYXJnaW5Cb3R0b206IFwiOHB4XCIgfX0+0KDQtdC20LjQvCDQt9Cw0L/Rg9GB0LrQsCDQv9GA0LjQu9C+0LbQtdC90LjRjzwvaDM+XG4gICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBjb2xvcjogXCIjNGI1NTYzXCIgfX0+XG4gICAgICAgICAgICAgICAgICAgINCS0YvQsdC10YDQuNGC0LUsINCyINC60LDQutC+0Lwg0YDQtdC20LjQvNC1INCy0Ysg0YXQvtGC0LjRgtC1INC30LDQv9GD0YHRgtC40YLRjCBDUk0uINCU0LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGC0LXRgdGC0LjRgNC+0LLQsNC90LjRjyDQuNGB0L/QvtC70YzQt9GD0LnRgtC1INC00LXQvNC+LdGA0LXQttC40LwsINC00LvRjyDRgNC10LDQu9GM0L3QvtC5INGA0LDQsdC+0YLRiyDigJQg0YfQuNGB0YLRi9C5INC30LDQv9GD0YHQui5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLCBnYXA6IFwiMjBweFwiIH19PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNldFJlc2V0dGluZyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBoYW5kbGVTZWxlY3REZW1vTW9kZSgpO1xuICAgICAgICAgICAgICAgICAgICAgIHNldFJlc2V0dGluZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtyZXNldHRpbmd9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImZsZXgtc3RhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMjBweFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2UwZjJmZSAwJSwgI2JhZTZmZCAxMDAlKVwiLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIycHggc29saWQgIzM4YmRmOFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcInRyYW5zZm9ybSAwLjJzLCBib3gtc2hhZG93IDAuMnNcIlxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIyOHB4XCIsIG1hcmdpbkJvdHRvbTogXCIxMnB4XCIgfX0+8J+agDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogXCIxNnB4XCIsIGNvbG9yOiBcIiMwMzY5YTFcIiwgbWFyZ2luQm90dG9tOiBcIjZweFwiIH19PtCf0L7Qv9GA0L7QsdC+0LLQsNGC0Ywg0LTQtdC80L4t0YDQtdC20LjQvDwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIxM3B4XCIsIGNvbG9yOiBcIiMwYzRhNmVcIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICDQl9Cw0L/Rg9GB0YLQuNGC0Ywg0YHQuNGB0YLQtdC80YMg0YEg0LPQvtGC0L7QstGL0LzQuCDQtNC10LzQvtC90YHRgtGA0LDRhtC40L7QvdC90YvQvNC4INC00LDQvdC90YvQvNC4ICjRgtC10YHRgtC+0LLRi9C1INC/0LDRhtC40LXQvdGC0YssINGA0LDRgdC/0LjRgdCw0L3QuNC1LCDQv9GA0LjQtdC80Ysg0Lgg0L7Qv9C70LDRgtGLKSwg0YfRgtC+0LHRiyDQsdGL0YHRgtGA0L4g0L7Qt9C90LDQutC+0LzQuNGC0YzRgdGPINGBINCy0L7Qt9C80L7QttC90L7RgdGC0Y/QvNC4LlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNldFJlc2V0dGluZyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBoYW5kbGVTZWxlY3RaZXJvTW9kZSgpO1xuICAgICAgICAgICAgICAgICAgICAgIHNldFJlc2V0dGluZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtyZXNldHRpbmd9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImZsZXgtc3RhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMjBweFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2YwZmRmNCAwJSwgI2RjZmNlNyAxMDAlKVwiLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIycHggc29saWQgIzRhZGU4MFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcInRyYW5zZm9ybSAwLjJzLCBib3gtc2hhZG93IDAuMnNcIlxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIyOHB4XCIsIG1hcmdpbkJvdHRvbTogXCIxMnB4XCIgfX0+4pyoPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiBcIjE2cHhcIiwgY29sb3I6IFwiIzE1ODAzZFwiLCBtYXJnaW5Cb3R0b206IFwiNnB4XCIgfX0+0J3QsNGH0LDRgtGMINGBINGH0LjRgdGC0L7Qs9C+INC70LjRgdGC0LA8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTNweFwiLCBjb2xvcjogXCIjMTQ1MzJkXCIgfX0+XG4gICAgICAgICAgICAgICAgICAgICAg0J/QvtC70L3QvtGB0YLRjNGOINC/0YPRgdGC0LDRjyDQsdCw0LfQsCDQtNCw0L3QvdGL0YUg0LTQu9GPINC90LDRgdGC0YDQvtC50LrQuCDQutC70LjQvdC40LrQuCDRgSDQvdGD0LvRjy4g0JLRiyDRgdC80L7QttC10YLQtSDQstCy0LXRgdGC0Lgg0YHQstC+0Lgg0LTQsNC90L3Ri9C1LCDQtNC+0LHQsNCy0LjRgtGMINCy0YDQsNGH0LXQuSDQuCDQutCw0LHQuNC90LXRgtGLINGI0LDQsyDQt9CwINGI0LDQs9C+0LwuXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICB7LyogQ2xpbmljIHN0ZXAgKi99XG4gICAgICAgICAgICB7b25ib2FyZGluZ1N0ZXAgPT09IFwiY2xpbmljXCIgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1wYW5lbFwiIHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IFwiMjBweFwiIH19PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3sgZm9udFNpemU6IFwiMThweFwiLCBmb250V2VpZ2h0OiBcIjYwMFwiLCBtYXJnaW5Cb3R0b206IFwiNnB4XCIgfX0+0J4g0LrQu9C40L3QuNC60LU8L2gzPlxuICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgY29sb3I6IFwiIzRiNTU2M1wiIH19PtCd0LDQt9Cy0LDQvdC40LUg0Lgg0YLQtdC70LXRhNC+0L0g0L/QvtC90LDQtNC+0LHRj9GC0YHRjyDQtNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INC00L7Qs9C+0LLQvtGA0L7QsiDQuCDQvNC10LTQuNGG0LjQvdGB0LrQuNGFINC60LDRgNGCLjwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IFwiMTZweFwiIH19PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiBcIjZweFwiIH19PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBmb250V2VpZ2h0OiBcIjUwMFwiLCBjb2xvcjogXCIjMzc0MTUxXCIgfX0+0J3QsNC30LLQsNC90LjQtSDQutC70LjQvdC40LrQuDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwib25ib2FyZGluZy1jbGluaWMtbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgcGFkZGluZzogXCIxMHB4XCIsIGJvcmRlclJhZGl1czogXCI4cHhcIiwgYm9yZGVyOiBcIjFweCBzb2xpZCAjZDFkNWRiXCIsIGZvbnRTaXplOiBcIjE1cHhcIiB9fVxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjbGluaWNQcm9maWxlRHJhZnQuY2xpbmljTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJjbGluaWNOYW1lXCIsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLQodGC0L7QvNCw0YLQvtC70L7Qs9C40Y8uLi5cIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IFwiNnB4XCIgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250U2l6ZTogXCIxNHB4XCIsIGZvbnRXZWlnaHQ6IFwiNTAwXCIsIGNvbG9yOiBcIiMzNzQxNTFcIiB9fT7QotC10LvQtdGE0L7QvSDQtNC70Y8g0YHQstGP0LfQuDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwib25ib2FyZGluZy1jbGluaWMtcGhvbmVcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHBhZGRpbmc6IFwiMTBweFwiLCBib3JkZXJSYWRpdXM6IFwiOHB4XCIsIGJvcmRlcjogXCIxcHggc29saWQgI2QxZDVkYlwiLCBmb250U2l6ZTogXCIxNXB4XCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2xpbmljUHJvZmlsZURyYWZ0LnBob25lfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNsaW5pY1Byb2ZpbGVEcmFmdChcInBob25lXCIsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI4OS4uLlwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgICAgey8qIFRlYW0gc3RlcCAqL31cbiAgICAgICAgICAgIHtvbmJvYXJkaW5nU3RlcCA9PT0gXCJ0ZWFtXCIgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1wYW5lbFwiIHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IFwiMjBweFwiIH19PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3sgZm9udFNpemU6IFwiMThweFwiLCBmb250V2VpZ2h0OiBcIjYwMFwiLCBtYXJnaW5Cb3R0b206IFwiNnB4XCIgfX0+0JLQsNGI0LAg0YDQvtC70Ywg0Lgg0LTQsNC90L3Ri9C1PC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiBcIiM0YjU1NjNcIiB9fT7Qo9C60LDQttC40YLQtSDRgdCy0L7RjiDRgNCw0LHQvtGH0YPRjiDRgNC+0LvRjCDQsiDQutC70LjQvdC40LrQtSDQuCDQu9C40YfQvdGL0LUg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YHRgtGA0L7QudC60Lgg0LjQvdGC0LXRgNGE0LXQudGB0LAuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogXCIxNnB4XCIgfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IFwiNnB4XCIgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250U2l6ZTogXCIxNHB4XCIsIGZvbnRXZWlnaHQ6IFwiNTAwXCIsIGNvbG9yOiBcIiMzNzQxNTFcIiB9fT7QktCw0YjQsCDRgNCw0LHQvtGH0LDRjyDRgNC+0LvRjDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogXCI4cHhcIiwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtyb2xlRm9jdXNPcmRlci5tYXAoKHJvbGUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzZWxlY3RlZFdvcmtzcGFjZVJvbGUgPT09IHJvbGUgPyBcImFjdGl2ZVwiIDogXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtyb2xlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPXtzZWxlY3RlZFdvcmtzcGFjZVJvbGUgPT09IHJvbGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkV29ya3NwYWNlUm9sZShyb2xlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjhweCAxNnB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IHNlbGVjdGVkV29ya3NwYWNlUm9sZSA9PT0gcm9sZSA/IFwiIzBkOTQ4OFwiIDogXCIjZDFkNWRiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogc2VsZWN0ZWRXb3Jrc3BhY2VSb2xlID09PSByb2xlID8gXCIjMGQ5NDg4XCIgOiBcIiNmZmZmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogc2VsZWN0ZWRXb3Jrc3BhY2VSb2xlID09PSByb2xlID8gXCIjZmZmZmZmXCIgOiBcIiMzNzQxNTFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBcIjUwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3N0YWZmUm9sZUxhYmVsc1tyb2xlXX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiBcIjZweFwiIH19PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBmb250V2VpZ2h0OiBcIjUwMFwiLCBjb2xvcjogXCIjMzc0MTUxXCIgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkV29ya3NwYWNlUm9sZSA9PT0gXCJvd25lclwiID8gXCLQpNCY0J4g0LLQu9Cw0LTQtdC70YzRhtCwINC60LvQuNC90LjQutC4XCIgOlxuICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFdvcmtzcGFjZVJvbGUgPT09IFwiZG9jdG9yXCIgPyBcItCk0JjQniDQstGA0LDRh9CwXCIgOlxuICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFdvcmtzcGFjZVJvbGUgPT09IFwiYWRtaW5pc3RyYXRvclwiID8gXCLQpNCY0J4g0LDQtNC80LjQvdC40YHRgtGA0LDRgtC+0YDQsFwiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRXb3Jrc3BhY2VSb2xlID09PSBcImFzc2lzdGFudFwiID8gXCLQpNCY0J4g0LDRgdGB0LjRgdGC0LXQvdGC0LBcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgIFwi0KTQmNCeINGB0L7RgtGA0YPQtNC90LjQutCwXCJ9XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwib25ib2FyZGluZy1zdGFmZi1uYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nOiBcIjEwcHhcIiwgYm9yZGVyUmFkaXVzOiBcIjhweFwiLCBib3JkZXI6IFwiMXB4IHNvbGlkICNkMWQ1ZGJcIiwgZm9udFNpemU6IFwiMTVweFwiIH19XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e25ld1N0YWZmTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXROZXdTdGFmZk5hbWUoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItCY0LLQsNC90L7QsiDQmNCy0LDQvSDQmNCy0LDQvdC+0LLQuNGHXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgeyhzZWxlY3RlZFdvcmtzcGFjZVJvbGUgPT09IFwiZG9jdG9yXCIgfHwgc2VsZWN0ZWRXb3Jrc3BhY2VSb2xlID09PSBcImFzc2lzdGFudFwiKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogXCI2cHhcIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBmb250V2VpZ2h0OiBcIjUwMFwiLCBjb2xvcjogXCIjMzc0MTUxXCIgfX0+0J3QsNC30LLQsNC90LjQtSDQutCw0LHQuNC90LXRgtCwL9C60YDQtdGB0LvQsDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZD1cIm9uYm9hcmRpbmctY2hhaXItbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nOiBcIjEwcHhcIiwgYm9yZGVyUmFkaXVzOiBcIjhweFwiLCBib3JkZXI6IFwiMXB4IHNvbGlkICNkMWQ1ZGJcIiwgZm9udFNpemU6IFwiMTVweFwiIH19XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bmV3Q2hhaXJOYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0TmV3Q2hhaXJOYW1lKGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItCa0LDQsdC40L3QtdGCINGC0LXRgNCw0L/QtdCy0YLQsFwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICB7LyogRG9uZSBzdGVwICovfVxuICAgICAgICAgICAge29uYm9hcmRpbmdTdGVwID09PSBcImRvbmVcIiA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXBhbmVsXCIgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogXCIyMHB4XCIgfX0+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogXCIyMHB4XCIsIGZvbnRXZWlnaHQ6IFwiNjAwXCIsIG1hcmdpbkJvdHRvbTogXCI4cHhcIiB9fT7QktGB0LUg0LPQvtGC0L7QstC+INC6INC30LDQv9GD0YHQutGDITwvaDM+XG4gICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBjb2xvcjogXCIjNGI1NTYzXCIgfX0+XG4gICAgICAgICAgICAgICAgICAgINCf0YDQvtCy0LXRgNGM0YLQtSDQv9Cw0YDQsNC80LXRgtGA0Ysg0L/QtdGA0LXQtCDQvtGC0LrRgNGL0YLQuNC10Lwg0YDQsNCx0L7Rh9C10Lkg0YHQvNC10L3Riy4g0JLRiyDRgdC80L7QttC10YLQtSDQuNC30LzQtdC90LjRgtGMINC70Y7QsdGL0LUg0L3QsNGB0YLRgNC+0LnQutC4INC/0L7Qt9C20LUuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ3JpZFRlbXBsYXRlQ29sdW1uczogKHNlbGVjdGVkV29ya3NwYWNlUm9sZSA9PT0gXCJkb2N0b3JcIiB8fCBzZWxlY3RlZFdvcmtzcGFjZVJvbGUgPT09IFwiYXNzaXN0YW50XCIpID8gXCIxZnIgMWZyXCIgOiBcIjFmclwiLCBnYXA6IFwiMTZweFwiLCBiYWNrZ3JvdW5kOiBcIiNmOWZhZmJcIiwgcGFkZGluZzogXCIyMHB4XCIsIGJvcmRlclJhZGl1czogXCIxMnB4XCIsIGJvcmRlcjogXCIxcHggc29saWQgI2U1ZTdlYlwiIH19PlxuICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLCBjb2xvcjogXCIjNmI3MjgwXCIsIGRpc3BsYXk6IFwiYmxvY2tcIiB9fT7QndCw0LfQstCw0L3QuNC1INC60LvQuNC90LjQutC4PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiBcIjE1cHhcIiwgY29sb3I6IFwiIzExMTgyN1wiIH19PntjbGluaWNQcm9maWxlRHJhZnQuY2xpbmljTmFtZSB8fCBcItCd0L7QstCw0Y8g0YHRgtC+0LzQsNGC0L7Qu9C+0LPQuNGPXCJ9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEycHhcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgY29sb3I6IFwiIzZiNzI4MFwiLCBkaXNwbGF5OiBcImJsb2NrXCIgfX0+0JLQsNGI0LAg0YDQsNCx0L7Rh9Cw0Y8g0YDQvtC70Yw8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgZm9udFNpemU6IFwiMTVweFwiLCBjb2xvcjogXCIjMTExODI3XCIgfX0+e3N0YWZmUm9sZUxhYmVsc1tzZWxlY3RlZFdvcmtzcGFjZVJvbGVdfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIxMnB4XCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsIGNvbG9yOiBcIiM2YjcyODBcIiwgZGlzcGxheTogXCJibG9ja1wiIH19PtCf0LXRgNCy0YvQuSDRgdC/0LXRhtC40LDQu9C40YHRgjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogXCIxNXB4XCIsIGNvbG9yOiBcIiMxMTE4MjdcIiB9fT57bmV3U3RhZmZOYW1lIHx8IFwi0JDQtNC80LjQvdC40YHRgtGA0LDRgtC+0YBcIn08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgeyhzZWxlY3RlZFdvcmtzcGFjZVJvbGUgPT09IFwiZG9jdG9yXCIgfHwgc2VsZWN0ZWRXb3Jrc3BhY2VSb2xlID09PSBcImFzc2lzdGFudFwiKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLCBjb2xvcjogXCIjNmI3MjgwXCIsIGRpc3BsYXk6IFwiYmxvY2tcIiB9fT7QmtCw0LHQuNC90LXRgiAvINC60YDQtdGB0LvQvjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiBcIjE1cHhcIiwgY29sb3I6IFwiIzExMTgyN1wiIH19PntuZXdDaGFpck5hbWUgfHwgXCLQmtCw0LHQuNC90LXRgiDihJYxXCJ9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgICAgey8qIEFjdGlvbnMgRm9vdGVyICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWFjdGlvbnNcIiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwiZmxleC1lbmRcIiwgZ2FwOiBcIjEycHhcIiwgbWFyZ2luVG9wOiBcIjI0cHhcIiB9fT5cbiAgICAgICAgICAgICAge29uYm9hcmRpbmdTdGVwICE9PSBcImludHJvXCIgJiYgcHJldmlvdXNPbmJvYXJkaW5nU3RlcCA/IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdm9pZCBtb3ZlT25ib2FyZGluZ1RvKHByZXZpb3VzT25ib2FyZGluZ1N0ZXAuaWQpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxMHB4IDIwcHhcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNkMWQ1ZGJcIixcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiMzNzQxNTFcIixcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogXCI1MDBcIixcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICDQndCw0LfQsNC0XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICB7b25ib2FyZGluZ1N0ZXAgIT09IFwiaW50cm9cIiAmJiBuZXh0T25ib2FyZGluZ1N0ZXAgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJpbWFyeS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB2b2lkIG1vdmVPbmJvYXJkaW5nVG8obmV4dE9uYm9hcmRpbmdTdGVwLmlkKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAyNHB4XCIsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI4cHhcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjMGQ5NDg4XCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogXCI2MDBcIixcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICDQlNCw0LvRjNGI0LVcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIHtvbmJvYXJkaW5nU3RlcCA9PT0gXCJkb25lXCIgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJpbWFyeS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB2b2lkIGhhbmRsZUZpbmlzaE9uYm9hcmRpbmcobmV3U3RhZmZOYW1lLCBuZXdDaGFpck5hbWUpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxMHB4IDI0cHhcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiMwZDk0ODhcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBcIjYwMFwiLFxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgINCd0LDRh9Cw0YLRjCDRgNCw0LHQvtGC0YNcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9tYWluPlxuICAgICk7XG4gIH1cblxuICBpZiAoYWNjZXNzVW5sb2NrUmVxdWlyZWQgJiYgIWRhc2hib2FyZCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QXBwVW5sb2NrU3RhdGVcbiAgICAgICAgYWNjZXNzTWVzc2FnZT17YWNjZXNzVW5sb2NrTWVzc2FnZX1cbiAgICAgICAgYWRtaW5TZWNyZXREcmFmdD17Y2xpbmljYWxBZG1pblNlY3JldERyYWZ0fVxuICAgICAgICBvbkFkbWluU2VjcmV0Q2hhbmdlPXtzZXRDbGluaWNhbEFkbWluU2VjcmV0RHJhZnR9XG4gICAgICAgIG9uVW5sb2NrPXsoKSA9PiB1bmxvY2tUZWxlZ3JhbUFkbWluU2Vzc2lvbihcImFsbFwiKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChlcnJvciAmJiAhZGFzaGJvYXJkKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBcHBMb2FkaW5nU3RhdGVcbiAgICAgICAgbWVzc2FnZT17YNCg0LDQsdC+0YfQuNC5INGB0LXRgNCy0LXRgCDQvdC10LTQvtGB0YLRg9C/0LXQvTogJHtlcnJvcn1gfVxuICAgICAgICBhY3Rpb25MYWJlbD1cItCf0L7QstGC0L7RgNC40YLRjCDQt9Cw0LPRgNGD0LfQutGDXCJcbiAgICAgICAgb25BY3Rpb249eygpID0+IHtcbiAgICAgICAgICBzZXRFcnJvcihudWxsKTtcbiAgICAgICAgICB2b2lkIGxvYWREYXNoYm9hcmQoKS5jYXRjaCgobG9hZEVycm9yOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICBzZXRFcnJvcihvcGVyYXRvcldvcmtmbG93RmFpbHVyZU1lc3NhZ2UoXCLQndC1INGD0LTQsNC70L7RgdGMINC30LDQs9GA0YPQt9C40YLRjCDQtNCw0L3QvdGL0LUg0LrQu9C40L3QuNC60LhcIiwgbG9hZEVycm9yKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBpZiAoIWRhc2hib2FyZCkge1xuICAgIHJldHVybiA8QXBwTG9hZGluZ1N0YXRlIG1lc3NhZ2U9XCLQl9Cw0LPRgNGD0LfQutCwINGA0LDQsdC+0YfQtdC5INGB0LzQtdC90YtcIiAvPjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPG1haW4gY2xhc3NOYW1lPVwiYXBwLXNoZWxsXCI+XG4gICAgICA8YSBjbGFzc05hbWU9XCJza2lwLWxpbmtcIiBocmVmPVwiI3dvcmtzcGFjZS1jb250ZW50XCI+XG4gICAgICAgINCf0LXRgNC10LnRgtC4INC6INGA0LDQsdC+0YfQtdC5INC+0LHQu9Cw0YHRgtC4XG4gICAgICA8L2E+XG4gICAgICA8V29ya3NwYWNlU2lkZWJhciBjdXJyZW50Vmlldz17Y3VycmVudFZpZXd9IG9uVmlld0ludGVudD17cHJlbG9hZFdvcmtzcGFjZVZpZXd9IHJvbGU9e3NlbGVjdGVkV29ya3NwYWNlUm9sZX0gLz5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPXtgd29ya3NwYWNlIHZpZXctJHtjdXJyZW50Vmlld31gfSBpZD1cIndvcmtzcGFjZS1jb250ZW50XCIgdGFiSW5kZXg9ey0xfSBhcmlhLWxhYmVsPVwi0KDQsNCx0L7Rh9Cw0Y8g0L7QsdC70LDRgdGC0YxcIj5cbiAgICAgICAge2Rhc2hib2FyZD8uY2xpbmljTmFtZSA9PT0gXCLQodGC0L7QvNCw0YLQvtC70L7Qs9C40Y8sIDEg0LrQsNCx0LjQvdC10YJcIiAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZWZhdWx0LWNsaW5pYy1iYW5uZXJcIiByb2xlPVwiYWxlcnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFubmVyLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmFubmVyLWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj7wn5qAPC9zcGFuPlxuICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPtCU0LXQvNC+LdGA0LXQttC40LwuPC9zdHJvbmc+INCi0LXRgdGC0L7QstGL0LUg0LTQsNC90L3Ri9C1INC30LDQs9GA0YPQttC10L3Riy4g0JTQu9GPINC90LDRgdGC0YDQvtC50LrQuCDRgdCy0L7QtdC5INC60LvQuNC90LjQutC4INC90LDQttC80LjRgtC1IMKr0JfQsNC/0YPRgdGC0LjRgtGMINC80LDRgdGC0LXRgMK7LlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicHJpbWFyeS1idXR0b24gYmFubmVyLWJ0blwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXtyZW9wZW5PbmJvYXJkaW5nfT5cbiAgICAgICAgICAgICAg0JfQsNC/0YPRgdGC0LjRgtGMINC80LDRgdGC0LXRgFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgPFdvcmtzcGFjZVRvcGJhclxuICAgICAgICAgIGNsaW5pY05hbWU9e2Rhc2hib2FyZC5jbGluaWNOYW1lfVxuICAgICAgICAgIG9uR29Ub0RpY3RhdGlvbj17Z29Ub1Zpc2l0RGljdGF0aW9ufVxuICAgICAgICAgIG9uR29Ub1NjaGVkdWxlPXsoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwic2NoZWR1bGVcIjtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uR29Ub1Zpc2l0PXsoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwidmlzaXRcIjtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uUmVvcGVuT25ib2FyZGluZz17cmVvcGVuT25ib2FyZGluZ31cbiAgICAgICAgICBvblJvbGVDaGFuZ2U9e3NldFNlbGVjdGVkV29ya3NwYWNlUm9sZX1cbiAgICAgICAgICBvblZpZXdJbnRlbnQ9e3ByZWxvYWRXb3Jrc3BhY2VWaWV3fVxuICAgICAgICAgIHJvbGVGb2N1c09yZGVyPXtyb2xlRm9jdXNPcmRlcn1cbiAgICAgICAgICBzZWxlY3RlZFdvcmtzcGFjZVJvbGU9e3NlbGVjdGVkV29ya3NwYWNlUm9sZX1cbiAgICAgICAgICBzaG93QWRtaW5pc3RyYXRpb25Ub3BBY3Rpb25zPXtzaG93QWRtaW5pc3RyYXRpb25Ub3BBY3Rpb25zfVxuICAgICAgICAgIHNob3dEb2N0b3JWaXNpdFNob3J0Y3V0PXtzaG93RG9jdG9yVmlzaXRTaG9ydGN1dH1cbiAgICAgICAgICBzdGFmZlJvbGVMYWJlbHM9e3N0YWZmUm9sZUxhYmVsc31cbiAgICAgICAgICB0b2RheUlzbz17ZGFzaGJvYXJkLnRvZGF5SXNvfVxuICAgICAgICAgIG9uTG9ja1Nlc3Npb249e2hhbmRsZUxvY2tTZXNzaW9ufVxuICAgICAgICAvPlxuXG4gICAgICAgIDxXb3Jrc3BhY2VDb250aW51aXR5U3RyaXBcbiAgICAgICAgICBicm93c2VyQ29udGludWl0eUNyaXRpY2FsPXticm93c2VyQ29udGludWl0eUNyaXRpY2FsfVxuICAgICAgICAgIGJyb3dzZXJXYXJuaW5ncz17YnJvd3NlckNvbnRpbnVpdHk/Lndhcm5pbmdzID8/IFtdfVxuICAgICAgICAgIGlzT25saW5lPXtpc09ubGluZX1cbiAgICAgICAgICBpc1BlbmRpbmdWaXNpdFN5bmNpbmc9e2lzUGVuZGluZ1Zpc2l0U3luY2luZ31cbiAgICAgICAgICBvbkNoZWNrRGV2aWNlPXsoKSA9PiB2b2lkIHJlZnJlc2hCcm93c2VyQ29udGludWl0eSh7IHNpbGVudDogZmFsc2UgfSl9XG4gICAgICAgICAgb25GbHVzaFNwZWVjaD17KCkgPT4gdm9pZCBmbHVzaFBlbmRpbmdTcGVlY2hDaHVua3MoeyBzaWxlbnQ6IGZhbHNlIH0pfVxuICAgICAgICAgIG9uRmx1c2hWaXNpdD17KCkgPT4gdm9pZCBmbHVzaFBlbmRpbmdWaXNpdFNhdmVzKHsgc2lsZW50OiBmYWxzZSB9KX1cbiAgICAgICAgICBwZW5kaW5nU3BlZWNoQ2h1bmtDb3VudD17cGVuZGluZ1NwZWVjaENodW5rQ291bnR9XG4gICAgICAgICAgcGVuZGluZ1Zpc2l0U2F2ZUNvdW50PXtwZW5kaW5nVmlzaXRTYXZlQ291bnR9XG4gICAgICAgIC8+XG5cbiAgICAgICAge2Vycm9yID8gKFxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImFwcC1ub3RpY2VcIiByb2xlPVwiYWxlcnRcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICAgICAgICAgIDxBbGVydFRyaWFuZ2xlIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XG4gICAgICAgICAgICA8cD57ZXJyb3J9PC9wPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldEVycm9yKG51bGwpfT5cbiAgICAgICAgICAgICAg0J/QvtC90Y/RgtC90L5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgeyFlcnJvciAmJiB1aVByZWZlcmVuY2VzU3luY0Vycm9yID8gKFxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImFwcC1ub3RpY2VcIiByb2xlPVwiYWxlcnRcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICAgICAgICAgIDxBbGVydFRyaWFuZ2xlIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XG4gICAgICAgICAgICA8cD57dWlQcmVmZXJlbmNlc1N5bmNFcnJvcn08L3A+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0VWlQcmVmZXJlbmNlc1N5bmNFcnJvcihudWxsKX0+XG4gICAgICAgICAgICAgINCf0L7QvdGP0YLQvdC+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHshZXJyb3IgJiYgIXVpUHJlZmVyZW5jZXNTeW5jRXJyb3IgJiYgdGVsZWdyYW1IYW5kb2ZmTm90aWNlID8gKFxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImFwcC1ub3RpY2UgdGVsZWdyYW0taGFuZG9mZi1ub3RpY2VcIiByb2xlPVwic3RhdHVzXCIgYXJpYS1saXZlPVwicG9saXRlXCI+XG4gICAgICAgICAgICA8Qm90IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAg0J7RgtC60YDRi9GC0L4g0LjQtyBUZWxlZ3JhbTogPHN0cm9uZz57dGVsZWdyYW1IYW5kb2ZmTm90aWNlLnRpdGxlfTwvc3Ryb25nPi4ge3RlbGVncmFtSGFuZG9mZk5vdGljZS5kZXRhaWx9INCh0YHRi9C70LrQsCDQvdC1INGB0L7QtNC10YDQttC40YJcbiAgICAgICAgICAgICAg0L/QsNGG0LjQtdC90YLQsCwg0LTQvtC60YPQvNC10L3Rgiwg0LfQsNC/0LjRgdGMINC40LvQuCDQvtC/0LvQsNGC0YMuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0VGVsZWdyYW1IYW5kb2ZmTm90aWNlKG51bGwpfT5cbiAgICAgICAgICAgICAg0J/QvtC90Y/RgtC90L5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgeyFvbmJvYXJkaW5nRGlzbWlzc2VkICYmICFzaG93RnVsbE9uYm9hcmRpbmdHdWlkZSA/IChcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWNvbXBhY3Qtc3RyaXBcIiBhcmlhLWxhYmVsPVwi0J/QtdGA0LLQuNGH0L3QsNGPINC90LDRgdGC0YDQvtC50LrQsCDQutC70LjQvdC40LrQuFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHN0cm9uZz7QnNC+0LbQvdC+INC90LDRh9Cw0YLRjCDQv9GA0LjQtdC8INCx0LXQtyDQvNCw0YHRgtC10YDQsDwvc3Ryb25nPlxuICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICDQlNC+0LrRg9C80LXQvdGC0Ysg0L/RgNC10LTRg9C/0YDQtdC00Y/RgiDQviDRgNC10LrQstC40LfQuNGC0LDRhSDQv9C+0LfQttC1LiDQodC10LnRh9Cw0YEg0LLQsNC20L3QtdC1INC+0YLQutGA0YvRgtGMINC/0LDRhtC40LXQvdGC0LAsINC00LjQutGC0L7QstC60YMg0Lgg0YDQsNGB0L/QuNGB0LDQvdC40LUuXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib25ib2FyZGluZy1jb21wYWN0LXNjb3JlXCI+XG4gICAgICAgICAgICAgIHtjdXJyZW50T25ib2FyZGluZ0luZGV4ICsgMX0ve29uYm9hcmRpbmdTdGVwcy5sZW5ndGh9IMK3INC00L7QutGD0LzQtdC90YLRiyB7bGVnYWxSZWFkaW5lc3NQZXJjZW50fSVcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicHJpbWFyeS1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gdm9pZCBjb250aW51ZU9uYm9hcmRpbmdJbkRyYWZ0TW9kZShcInZpc2l0XCIpfT5cbiAgICAgICAgICAgICAgPENsaXBib2FyZENoZWNrIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+INCf0YDQuNC10LxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IG9wZW5PbmJvYXJkaW5nR3VpZGUoKX0+XG4gICAgICAgICAgICAgIDxTaGllbGRDaGVjayBhcmlhLWhpZGRlbj1cInRydWVcIiAvPiDQndCw0YHRgtGA0L7QuNGC0YxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3Nob3dGdWxsT25ib2FyZGluZ0d1aWRlID8gKFxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctc2hlbGxcIiBhcmlhLWxhYmVsPVwi0J/QtdGA0LLQuNGH0L3QsNGPINC90LDRgdGC0YDQvtC50LrQsCDQutC70LjQvdC40LrQuFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWhlYWRcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJleWVicm93XCI+0J/QtdGA0LLQvtC1INC+0YLQutGA0YvRgtC40LU8L3A+XG4gICAgICAgICAgICAgICAgPGgyPtCd0LDRgdGC0YDQvtC50LrQsCDQvdC+0LLQvtC5INC60LvQuNC90LjQutC4INC4INGA0LDQsdC+0YfQtdCz0L4g0LzQtdGB0YLQsCDQstGA0LDRh9CwPC9oMj5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgINCc0L7QttC90L4g0L3QsNGH0LDRgtGMINC/0YDQuNC10Lwg0YHRgNCw0LfRgy4g0K7RgNC40LTQuNGH0LXRgdC60LjQtSDQv9C+0LvRjywg0LjQvNC/0L7RgNGCINC4IFRlbGVncmFtINC+0YHRgtCw0Y7RgtGB0Y8g0LIg0L3QsNGB0YLRgNC+0LnQutC1INC4INC90LUg0LzQtdGI0LDRjtGCINC00LjQutGC0L7QstC60LUsXG4gICAgICAgICAgICAgICAgICDRgNCw0YHQv9C40YHQsNC90LjRjiDQuCDQutCw0YDRgtC+0YfQutC1INC/0LDRhtC40LXQvdGC0LAuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXNjb3JlXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+e2N1cnJlbnRPbmJvYXJkaW5nSW5kZXggKyAxfS97b25ib2FyZGluZ1N0ZXBzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz57bGVnYWxSZWFkaW5lc3NQZXJjZW50fSU8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICA8c21hbGw+0LPQvtGC0L7QstC90L7RgdGC0Ywg0LTQvtC60YPQvNC10L3RgtC+0LI8L3NtYWxsPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctZmFzdC1zdGFydFwiIGFyaWEtbGFiZWw9XCLQkdGL0YHRgtGA0YvQuSDRgdGC0LDRgNGCINGA0LDQsdC+0YLRi1wiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+0KDQsNCx0L7Rh9C40Lkg0LLRhdC+0LQg0LHQtdC3INC80LDRgdGC0LXRgNCwPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICDQp9C10YDQvdC+0LLQuNC60Lgg0L/RgNC40LXQvNCwINGB0L7RhdGA0LDQvdGP0Y7RgtGB0Y8uINCU0L7QutGD0LzQtdC90YLRiyDQuCDQvdCw0LvQvtCz0L7QstGL0LUg0YTQvtGA0LzRiyDRgdCw0LzQuCDQv9C+0LrQsNC20YPRgiwg0LrQsNC60LjRhSDRgNC10LrQstC40LfQuNGC0L7QsiDQvdC1INGF0LLQsNGC0LDQtdGCLlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicHJpbWFyeS1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gdm9pZCBjb250aW51ZU9uYm9hcmRpbmdJbkRyYWZ0TW9kZShcInZpc2l0XCIpfT5cbiAgICAgICAgICAgICAgICA8Q2xpcGJvYXJkQ2hlY2sgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz4g0J7RgtC60YDRi9GC0Ywg0L/RgNC40LXQvFxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHZvaWQgY29udGludWVPbmJvYXJkaW5nSW5EcmFmdE1vZGUoXCJzY2hlZHVsZVwiKX0+XG4gICAgICAgICAgICAgICAgPENhbGVuZGFyRGF5cyBhcmlhLWhpZGRlbj1cInRydWVcIiAvPiDQoNCw0YHQv9C40YHQsNC90LjQtVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHZvaWQgbW92ZU9uYm9hcmRpbmdUbyhcImxlZ2FsXCIpfT5cbiAgICAgICAgICAgICAgICA8U2hpZWxkQ2hlY2sgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz4g0KDQtdC60LLQuNC30LjRgtGLXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zdGVwLWxpc3RcIiBhcmlhLWxhYmVsPVwi0KjQsNCz0Lgg0LfQvdCw0LrQvtC80YHRgtCy0LBcIj5cbiAgICAgICAgICAgICAge29uYm9hcmRpbmdTdGVwcy5tYXAoKHN0ZXAsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzdGVwLmlkID09PSBvbmJvYXJkaW5nU3RlcCA/IFwiYWN0aXZlXCIgOiBpbmRleCA8IGN1cnJlbnRPbmJvYXJkaW5nSW5kZXggPyBcImRvbmVcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgICAgICBrZXk9e3N0ZXAuaWR9XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIGFyaWEtY3VycmVudD17c3RlcC5pZCA9PT0gb25ib2FyZGluZ1N0ZXAgPyBcInN0ZXBcIiA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtcHJlc3NlZD17c3RlcC5pZCA9PT0gb25ib2FyZGluZ1N0ZXB9XG4gICAgICAgICAgICAgICAgICBhcmlhLWRlc2NyaWJlZGJ5PXtzdGVwLmlkID09PSBcImRvbmVcIiAmJiAhb25ib2FyZGluZ1JlYWR5VG9GaW5pc2ggPyBvbmJvYXJkaW5nRmluaXNoR3VpZGFuY2VJZCA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzdGVwLmlkID09PSBcImRvbmVcIiAmJiAhb25ib2FyZGluZ1JlYWR5VG9GaW5pc2h9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB2b2lkIG1vdmVPbmJvYXJkaW5nVG8oc3RlcC5pZCl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2luZGV4ICsgMX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPntzdGVwLnRpdGxlfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPHNtYWxsPntzdGVwLmRldGFpbH08L3NtYWxsPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7b25ib2FyZGluZ1N0ZXAgPT09IFwiaW50cm9cIiA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXBhbmVsXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxoMz7QmtC+0YDQvtGC0LrQsNGPINC60LDRgNGC0LAg0L/RgNC40LvQvtC20LXQvdC40Y88L2gzPlxuICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgINCh0LzQtdC90LAg0L/QvtC60LDQt9GL0LLQsNC10YIg0L7Rh9C10YDQtdC00Ywg0Lgg0YHRgNC+0YfQvdGL0LUg0LTQtdC50YHRgtCy0LjRjy4g0J/RgNC40LXQvCDRhdGA0LDQvdC40YIg0YfQtdGA0L3QvtCy0LjQutC4INC70L7QutCw0LvRjNC90L4g0Lgg0L3QsCDRgdC10YDQstC10YDQtS4g0JTQvtC60YPQvNC10L3RgtGLXG4gICAgICAgICAgICAgICAgICAgINCz0LXQvdC10YDQuNGA0YPRjtGC0YHRjyDQuNC3INC/0YDQvtCy0LXRgNC10L3QvdGL0YUg0LTQsNC90L3Ri9GFINC/0LDRhtC40LXQvdGC0LAsINC+0L/Qu9Cw0YLRiyDQuCDQu9C40YbQtdC90LfQuNC4INC60LvQuNC90LjQutC4LlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zb3VyY2UtZ3JpZFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+0J/RgNC40LXQvDog0L/RgNC+0YLQvtC60L7Qu9GLLCDQs9C+0LvQvtGBLCDQvtGE0LvQsNC50L0t0YfQtdGA0L3QvtCy0LjQujwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPtCU0L7QutGD0LzQtdC90YLRizog0L/QsNGG0LjQtdC90YIsINC+0L/Qu9Cw0YLQsCwg0L3QsNC70L7Qs9C+0LLQsNGPPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+0JjQvNC/0L7RgNGCOiDQv9GA0LDQudGBLCDRgdGC0LDRgNGL0LUg0LHQsNC30YssINGB0L3QuNC80LrQuDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPtCd0LDRgdGC0YDQvtC50LrQuDog0YDQvtC70YwsINC60LDQsdC40L3QtdGCLCDRjtGA0LjQtNC40YfQtdGB0LrQuNC5INC/0YDQvtGE0LjQu9GMPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICB7b25ib2FyZGluZ1N0ZXAgPT09IFwicm9sZVwiID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctcGFuZWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzPtCa0YLQviDRgdC10LnRh9Cw0YEg0YDQsNCx0L7RgtCw0LXRgjwvaDM+XG4gICAgICAgICAgICAgICAgICA8cD7QktGL0LHQvtGAINGA0L7Qu9C4INC4INGB0L/QtdGG0LjQsNC70LjQt9Cw0YbQuNC4INGB0L7RhdGA0LDQvdGP0LXRgtGB0Y8g0LrQsNC6INC90LDRgdGC0YDQvtC50LrQsCDRgNCw0LHQvtGH0LXQs9C+INC80LXRgdGC0LAg0Lgg0L3QtSDQv9C+0LTQvNC10YjQuNCy0LDQtdGCINGH0YPQttC40LUg0YDQsNC30LTQtdC70YsuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1mb3JtLWdyaWRcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm9sZS1waWNrZXIgZm9ybS1zcGFuLTJcIiBhcmlhLWxhYmVsPVwi0KDQvtC70Ywg0L3QvtCy0L7Qs9C+INGB0L7RgtGA0YPQtNC90LjQutCwXCI+XG4gICAgICAgICAgICAgICAgICAgIHtyb2xlRm9jdXNPcmRlci5tYXAoKHJvbGUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3NlbGVjdGVkV29ya3NwYWNlUm9sZSA9PT0gcm9sZSA/IFwiYWN0aXZlXCIgOiBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtyb2xlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLXByZXNzZWQ9e3NlbGVjdGVkV29ya3NwYWNlUm9sZSA9PT0gcm9sZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkV29ya3NwYWNlUm9sZShyb2xlKX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c3RhZmZSb2xlTGFiZWxzW3JvbGVdfVxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGVjaWFsdHktc3RyaXAgZm9ybS1zcGFuLTJcIiBhcmlhLWxhYmVsPVwi0KHQv9C10YbQuNCw0LvQuNC30LDRhtC40Y8g0LLRgNCw0YfQsFwiPlxuICAgICAgICAgICAgICAgICAgICB7KE9iamVjdC5rZXlzKHNwZWNpYWx0eUxhYmVscykgYXMgRGVudGFsU3BlY2lhbHR5W10pLm1hcCgoc3BlY2lhbHR5KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzZWxlY3RlZFNwZWNpYWx0eSA9PT0gc3BlY2lhbHR5ID8gXCJhY3RpdmVcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3NwZWNpYWx0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPXtzZWxlY3RlZFNwZWNpYWx0eSA9PT0gc3BlY2lhbHR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VsZWN0ZWRTcGVjaWFsdHkoc3BlY2lhbHR5KX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c3BlY2lhbHR5TGFiZWxzW3NwZWNpYWx0eV19XG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICAgIHtvbmJvYXJkaW5nU3RlcCA9PT0gXCJjbGluaWNcIiA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXBhbmVsXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxoMz7QoNC10LbQuNC8INC4INCx0LDQt9C+0LLRi9C1INC60L7QvdGC0LDQutGC0Ys8L2gzPlxuICAgICAgICAgICAgICAgICAgPHA+0KDQtdC20LjQvCDQvNC10L3Rj9C10YIg0L/QtdGA0LLRi9C5INGN0LrRgNCw0L0sINC+0YfQtdGA0LXQtNC4INGA0L7Qu9C10Lkg0Lgg0L/QvtC00YHQutCw0LfQutC4INCx0LXQtyDRgNGD0YfQvdC+0Lkg0L/QtdGA0LXQvdCw0YHRgtGA0L7QudC60Lgg0LjQvdGC0LXRgNGE0LXQudGB0LAuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kZS1ncmlkIGZvcm0tc3Bhbi0yXCIgYXJpYS1sYWJlbD1cItCg0LXQttC40Lwg0LrQu9C40L3QuNC60LhcIj5cbiAgICAgICAgICAgICAgICAgIHsoT2JqZWN0LmtleXMoY2xpbmljTW9kZUxhYmVscykgYXMgQ2xpbmljTW9kZVtdKS5tYXAoKG1vZGUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YG1vZGUtY2FyZCAke2Rhc2hib2FyZC5jbGluaWNTZXR0aW5ncy5wcm9maWxlPy5tb2RlID09PSBtb2RlID8gXCJhY3RpdmVcIiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e21vZGV9XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPXtkYXNoYm9hcmQuY2xpbmljU2V0dGluZ3MucHJvZmlsZT8ubW9kZSA9PT0gbW9kZX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBjaGFuZ2VDbGluaWNNb2RlKG1vZGUpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57Y2xpbmljTW9kZUxhYmVsc1ttb2RlXS50aXRsZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y2xpbmljTW9kZUxhYmVsc1ttb2RlXS5kZXRhaWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1mb3JtLWdyaWRcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0J3QsNC30LLQsNC90LjQtSDQutC70LjQvdC40LrQuFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdmFsdWU9e2NsaW5pY1Byb2ZpbGVEcmFmdC5jbGluaWNOYW1lfSBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJjbGluaWNOYW1lXCIsIGV2ZW50LnRhcmdldC52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQotC10LvQtdGE0L7QvVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdmFsdWU9e2NsaW5pY1Byb2ZpbGVEcmFmdC5waG9uZX0gb25DaGFuZ2U9eyhldmVudCkgPT4gdXBkYXRlQ2xpbmljUHJvZmlsZURyYWZ0KFwicGhvbmVcIiwgZXZlbnQudGFyZ2V0LnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCn0LDRgdC+0LLQvtC5INC/0L7Rj9GBXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB2YWx1ZT17Y2xpbmljUHJvZmlsZURyYWZ0LnRpbWV6b25lfSBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJ0aW1lem9uZVwiLCBldmVudC50YXJnZXQudmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0K/Qt9GL0Log0LjQvdGC0LXRgNGE0LXQudGB0LBcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCB2YWx1ZT17dWlMYW5ndWFnZX0gb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0VWlMYW5ndWFnZShub3JtYWxpemVVaUxhbmd1YWdlSW5wdXQoZXZlbnQudGFyZ2V0LnZhbHVlKSl9PlxuICAgICAgICAgICAgICAgICAgICAgIHt1aUxhbmd1YWdlT3B0aW9ucy5tYXAoKG9wdGlvbikgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e29wdGlvbi52YWx1ZX0gdmFsdWU9e29wdGlvbi52YWx1ZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb24ubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzc05hbWU9XCJmaWVsZC1ub3RlXCI+e3NlbGVjdGVkVWlMYW5ndWFnZU9wdGlvbi5kZXRhaWx9PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCc0LjQvdGD0YIg0L3QsCDQstC40LfQuNGCXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjbGluaWNQcm9maWxlRHJhZnQuZGVmYXVsdFZpc2l0TWludXRlc31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJkZWZhdWx0VmlzaXRNaW51dGVzXCIsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIikuc2xpY2UoMCwgMykpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0J3QsNGH0LDQu9C+INGB0LzQtdC90YtcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0aW1lXCIgdmFsdWU9e2NsaW5pY1Byb2ZpbGVEcmFmdC53b3JrZGF5U3RhcnR9IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNsaW5pY1Byb2ZpbGVEcmFmdChcIndvcmtkYXlTdGFydFwiLCBldmVudC50YXJnZXQudmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0JrQvtC90LXRhiDRgdC80LXQvdGLXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGltZVwiIHZhbHVlPXtjbGluaWNQcm9maWxlRHJhZnQud29ya2RheUVuZH0gb25DaGFuZ2U9eyhldmVudCkgPT4gdXBkYXRlQ2xpbmljUHJvZmlsZURyYWZ0KFwid29ya2RheUVuZFwiLCBldmVudC50YXJnZXQudmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0JHRg9GE0LXRgCwg0LzQuNC9XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjbGluaWNQcm9maWxlRHJhZnQuYXBwb2ludG1lbnRCdWZmZXJNaW51dGVzfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNsaW5pY1Byb2ZpbGVEcmFmdChcImFwcG9pbnRtZW50QnVmZmVyTWludXRlc1wiLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpLnNsaWNlKDAsIDMpKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlZWtkYXktdG9nZ2xlLXJvdyBmb3JtLXNwYW4tMlwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCLQoNCw0LHQvtGH0LjQtSDQtNC90Lgg0LrQu9C40L3QuNC60LhcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+0KDQsNCx0L7Rh9C40LUg0LTQvdC4PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7d2Vla2RheU9wdGlvbnMubWFwKChkYXk6IGFueSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xpbmljUHJvZmlsZURyYWZ0LndvcmtpbmdEYXlzLmluY2x1ZGVzKGRheS52YWx1ZSkgPyBcImFjdGl2ZVwiIDogXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17ZGF5LnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLXByZXNzZWQ9e2NsaW5pY1Byb2ZpbGVEcmFmdC53b3JraW5nRGF5cy5pbmNsdWRlcyhkYXkudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlQ2xpbmljV29ya2luZ0RheShkYXkudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtkYXkubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICAgIHtvbmJvYXJkaW5nU3RlcCA9PT0gXCJsZWdhbFwiID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctcGFuZWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzPtCu0YDQuNC00LjRh9C10YHQutC40LUg0LTQsNC90L3Ri9C1INC00LvRjyDQtNC+0LPQvtCy0L7RgNC+0LIg0Lgg0L3QsNC70L7Qs9C+0LLRi9GFINGB0L/RgNCw0LLQvtC6PC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICDQkdC10Lcg0Y3RgtC40YUg0L/QvtC70LXQuSDQv9GA0LjQu9C+0LbQtdC90LjQtSDQvdC1INC00L7Qu9C20L3QviDQstGL0LTQsNCy0LDRgtGMINGE0LjQvdCw0LvRjNC90YvQtSDQtNC+0LPQvtCy0L7RgNGLLCDQsNC60YLRiyDQuCDQvdCw0LvQvtCz0L7QstGL0LUg0LTQvtC60YPQvNC10L3RgtGLINC60LDQuiDQs9C+0YLQvtCy0YvQtS5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctZm9ybS1ncmlkXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCu0YDQuNC00LjRh9C10YHQutC+0LUg0LvQuNGG0L5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHZhbHVlPXtjbGluaWNQcm9maWxlRHJhZnQubGVnYWxOYW1lfSBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJsZWdhbE5hbWVcIiwgZXZlbnQudGFyZ2V0LnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCY0J3QnVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdmFsdWU9e2NsaW5pY1Byb2ZpbGVEcmFmdC5pbm59IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNsaW5pY1Byb2ZpbGVEcmFmdChcImlublwiLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpLnNsaWNlKDAsIDEyKSl9IC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQmtCf0J9cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHZhbHVlPXtjbGluaWNQcm9maWxlRHJhZnQua3BwfSBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJrcHBcIiwgZXZlbnQudGFyZ2V0LnZhbHVlLnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKS5zbGljZSgwLCA5KSl9IC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQntCT0KDQnSAvINCe0JPQoNCd0JjQn1xuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdmFsdWU9e2NsaW5pY1Byb2ZpbGVEcmFmdC5vZ3JufSBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJvZ3JuXCIsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIikuc2xpY2UoMCwgMTUpKX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZm9ybS1zcGFuLTJcIj5cbiAgICAgICAgICAgICAgICAgICAg0JDQtNGA0LXRgVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdmFsdWU9e2NsaW5pY1Byb2ZpbGVEcmFmdC5hZGRyZXNzfSBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJhZGRyZXNzXCIsIGV2ZW50LnRhcmdldC52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQndC+0LzQtdGAINC70LjRhtC10L3Qt9C40LhcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHZhbHVlPXtjbGluaWNQcm9maWxlRHJhZnQubWVkaWNhbExpY2Vuc2VOdW1iZXJ9IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNsaW5pY1Byb2ZpbGVEcmFmdChcIm1lZGljYWxMaWNlbnNlTnVtYmVyXCIsIGV2ZW50LnRhcmdldC52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQlNCw0YLQsCDQu9C40YbQtdC90LfQuNC4XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB2YWx1ZT17Y2xpbmljUHJvZmlsZURyYWZ0Lm1lZGljYWxMaWNlbnNlSXNzdWVkQXR9IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNsaW5pY1Byb2ZpbGVEcmFmdChcIm1lZGljYWxMaWNlbnNlSXNzdWVkQXRcIiwgZXZlbnQudGFyZ2V0LnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZm9ybS1zcGFuLTJcIj5cbiAgICAgICAgICAgICAgICAgICAg0JrQtdC8INCy0YvQtNCw0L3QsCDQu9C40YbQtdC90LfQuNGPXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB2YWx1ZT17Y2xpbmljUHJvZmlsZURyYWZ0Lm1lZGljYWxMaWNlbnNlSXNzdWVyfSBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVDbGluaWNQcm9maWxlRHJhZnQoXCJtZWRpY2FsTGljZW5zZUlzc3VlclwiLCBldmVudC50YXJnZXQudmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaW5pYy1sZWdhbC1zdW1tYXJ5XCI+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPntsZWdhbFJlYWRpbmVzc1BlcmNlbnR9JTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2xlZ2FsTWlzc2luZ0ZpZWxkcy5sZW5ndGggPyBg0J3QtSDRhdCy0LDRgtCw0LXRgjogJHtsZWdhbE1pc3NpbmdGaWVsZHMuam9pbihcIiwgXCIpfWAgOiBcItCc0LjQvdC40LzQsNC70YzQvdGL0LUg0L/QvtC70Y8g0LfQsNC/0L7Qu9C90LXQvdGLXCJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICB7b25ib2FyZGluZ1N0ZXAgPT09IFwidGVhbVwiID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctcGFuZWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzPtCa0L7QvNCw0L3QtNCwINC4INC60LDQsdC40L3QtdGCPC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwPtCh0L7RgtGA0YPQtNC90LjQutC4INC4INC60YDQtdGB0LvQsCDRgdGA0LDQt9GDINC/0L7Qv9Cw0LTQsNGO0YIg0LIg0YHQtdGA0LLQtdGA0L3QvtC1INGB0L7RgdGC0L7Rj9C90LjQtSwg0LDRg9C00LjRgiDQuCDRgNCw0YHQv9C40YHQsNC90LjQtS48L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWZvcm0tZ3JpZFwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQndC+0LLRi9C5INGB0L7RgtGA0YPQtNC90LjQulxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdmFsdWU9e25ld1N0YWZmTmFtZX0gb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0TmV3U3RhZmZOYW1lKGV2ZW50LnRhcmdldC52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb2xlLXBpY2tlciBmb3JtLXNwYW4tMlwiIGFyaWEtbGFiZWw9XCLQoNC+0LvRjCDQvdC+0LLQvtCz0L4g0YHQvtGC0YDRg9C00L3QuNC60LBcIj5cbiAgICAgICAgICAgICAgICAgICAgeyhbXCJkb2N0b3JcIiwgXCJhZG1pbmlzdHJhdG9yXCIsIFwiYXNzaXN0YW50XCIsIFwibWFuYWdlclwiXSBhcyBTdGFmZlJvbGVbXSkubWFwKChyb2xlKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtuZXdTdGFmZlJvbGUgPT09IHJvbGUgPyBcImFjdGl2ZVwiIDogXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17cm9sZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPXtuZXdTdGFmZlJvbGUgPT09IHJvbGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXROZXdTdGFmZlJvbGUocm9sZSl9XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3N0YWZmUm9sZUxhYmVsc1tyb2xlXX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIHtuZXdTdGFmZlJvbGUgPT09IFwiZG9jdG9yXCIgfHwgbmV3U3RhZmZSb2xlID09PSBcImFzc2lzdGFudFwiID8gKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwZWNpYWx0eS1zdHJpcCBzdGFmZi1zcGVjaWFsdHktcGlja2VyIGZvcm0tc3Bhbi0yXCIgYXJpYS1sYWJlbD1cItCh0L/QtdGG0LjQsNC70YzQvdC+0YHRgtGMINC90L7QstC+0LPQviDRgdC+0YLRgNGD0LTQvdC40LrQsFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHsoT2JqZWN0LmtleXMoc3BlY2lhbHR5TGFiZWxzKSBhcyBEZW50YWxTcGVjaWFsdHlbXSkubWFwKChzcGVjaWFsdHkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtuZXdTdGFmZlNwZWNpYWx0eSA9PT0gc3BlY2lhbHR5ID8gXCJhY3RpdmVcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17c3BlY2lhbHR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPXtuZXdTdGFmZlNwZWNpYWx0eSA9PT0gc3BlY2lhbHR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXROZXdTdGFmZlNwZWNpYWx0eShzcGVjaWFsdHkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7c3BlY2lhbHR5TGFiZWxzW3NwZWNpYWx0eV19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2Vjb25kYXJ5LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBhZGRTdGFmZk1lbWJlcihuZXdTdGFmZlJvbGUpfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWRlc2NyaWJlZGJ5PXshbmV3U3RhZmZSZWFkeVRvQ3JlYXRlID8gb25ib2FyZGluZ1N0YWZmQ3JlYXRlR3VpZGFuY2VJZCA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFuZXdTdGFmZlJlYWR5VG9DcmVhdGV9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxQbHVzIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+INCU0L7QsdCw0LLQuNGC0Ywg0YHQvtGC0YDRg9C00L3QuNC60LBcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgeyFuZXdTdGFmZlJlYWR5VG9DcmVhdGUgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInF1aWNrLWNyZWF0ZS1ndWlkYW5jZSBmb3JtLXNwYW4tMlwiIGlkPXtvbmJvYXJkaW5nU3RhZmZDcmVhdGVHdWlkYW5jZUlkfSByb2xlPVwic3RhdHVzXCIgYXJpYS1saXZlPVwicG9saXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAg0JLQstC10LTQuNGC0LUg0KTQmNCeINGB0L7RgtGA0YPQtNC90LjQutCwLCDQt9Cw0YLQtdC8INCy0YvQsdC10YDQuNGC0LUg0YDQvtC70YwuXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQmtGA0LXRgdC70L4gLyDQutCw0LHQuNC90LXRglxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdmFsdWU9e25ld0NoYWlyTmFtZX0gb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0TmV3Q2hhaXJOYW1lKGV2ZW50LnRhcmdldC52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2FkZENoYWlyfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWRlc2NyaWJlZGJ5PXshbmV3Q2hhaXJSZWFkeVRvQ3JlYXRlID8gb25ib2FyZGluZ0NoYWlyQ3JlYXRlR3VpZGFuY2VJZCA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFuZXdDaGFpclJlYWR5VG9DcmVhdGV9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxQbHVzIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+INCU0L7QsdCw0LLQuNGC0Ywg0LrRgNC10YHQu9C+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIHshbmV3Q2hhaXJSZWFkeVRvQ3JlYXRlID8gKFxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJxdWljay1jcmVhdGUtZ3VpZGFuY2UgZm9ybS1zcGFuLTJcIiBpZD17b25ib2FyZGluZ0NoYWlyQ3JlYXRlR3VpZGFuY2VJZH0gcm9sZT1cInN0YXR1c1wiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgINCS0LLQtdC00LjRgtC1INC/0L7QvdGP0YLQvdC+0LUg0L3QsNC30LLQsNC90LjQtSDQutGA0LXRgdC70LAg0LjQu9C4INC60LDQsdC40L3QtdGC0LAuXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zY2hlZHVsZS1ncmlkIGZvcm0tc3Bhbi0yXCIgYXJpYS1sYWJlbD1cItCg0LDRgdC/0LjRgdCw0L3QuNC1INC60L7QvNCw0L3QtNGLINC/0YDQuCDQv9C10YDQstC+0Lwg0LfQsNC/0YPRgdC60LVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zY2hlZHVsZS1zZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGg0PtCg0LDRgdC/0LjRgdCw0L3QuNC1INC60L7QvNCw0L3QtNGLPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICA8cD7QodGA0LDQt9GDINC30LDQtNCw0LnRgtC1INGA0LDQsdC+0YfQuNC1INC00L3QuCDQuCDRh9Cw0YHRiy4g0JjQt9C80LXQvdC10L3QuNGPINCw0LLRgtC+0YHQvtGF0YDQsNC90Y/RjtGC0YHRjyDQuCDQvtGB0YLQsNGO0YLRgdGPINCy0YvQsdGA0LDQvdC90YvQvNC4LCDQv9C+0LrQsCDQstGLINC40YUg0L3QtSDQv9C+0LzQtdC90Y/QtdGC0LUuPC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFmZi1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAge2Rhc2hib2FyZC5jbGluaWNTZXR0aW5ncy5zdGFmZlxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigobWVtYmVyKSA9PiBtZW1iZXIucm9sZSA9PT0gXCJkb2N0b3JcIiB8fCBtZW1iZXIucm9sZSA9PT0gXCJhc3Npc3RhbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKG1lbWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzY2hlZHVsZURyYWZ0ID0gc3RhZmZTY2hlZHVsZURyYWZ0c1ttZW1iZXIuaWRdID8/IHN0YWZmU2NoZWR1bGVEcmFmdEZyb21Xb3JraW5nSG91cnMobWVtYmVyLndvcmtpbmdIb3VycyA/PyBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGVTYXZlU3RhdGUgPSBzdGFmZlNjaGVkdWxlU2F2ZVN0YXRlc1ttZW1iZXIuaWRdID8/IFwic2F2ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGVEaXJ0eSA9IHN0YWZmU2NoZWR1bGVEaXJ0eUlkcy5oYXMobWVtYmVyLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGVTYXZpbmcgPSBzdGFmZlNjaGVkdWxlU2F2aW5nSWQgPT09IG1lbWJlci5pZCB8fCBzY2hlZHVsZVNhdmVTdGF0ZSA9PT0gXCJzYXZpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGVTYXZlTGFiZWwgPSBzY2hlZHVsZVNhdmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCLQkNCy0YLQvtGB0L7RhdGA0LDQvdC10L3QuNC1XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNjaGVkdWxlU2F2ZVN0YXRlID09PSBcImVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCLQndC1INGB0L7RhdGA0LDQvdC10L3QvlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNjaGVkdWxlRGlydHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcItCW0LTQtdGCINCw0LLRgtC+0YHQvtGF0YDQsNC90LXQvdC40Y9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwi0KHQvtGF0YDQsNC90LXQvdC+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFmZi1yb3cgb25ib2FyZGluZy1zY2hlZHVsZS1yb3dcIiBrZXk9e2BvbmJvYXJkaW5nLXN0YWZmLXNjaGVkdWxlLSR7bWVtYmVyLmlkfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgYmFja2dyb3VuZDogbWVtYmVyLmNvbG9yIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPnttZW1iZXIuZnVsbE5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzdGFmZlJvbGVMYWJlbHNbbWVtYmVyLnJvbGVdfSDCtyB7bWVtYmVyLnNwZWNpYWx0aWVzLm1hcCgoaXRlbSkgPT4gc3BlY2lhbHR5TGFiZWxzW2l0ZW1dKS5qb2luKFwiLCBcIil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFmZi1zY2hlZHVsZS1lZGl0b3Igb25ib2FyZGluZy1jb21wYWN0LXNjaGVkdWxlLWVkaXRvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg0KFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2DQndCw0YfQsNC70L4g0YHQvNC10L3RizogJHttZW1iZXIuZnVsbE5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzY2hlZHVsZURyYWZ0LnN0YXJ0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdXBkYXRlU3RhZmZTY2hlZHVsZURyYWZ0KG1lbWJlci5pZCwgeyBzdGFydDogZXZlbnQudGFyZ2V0LnZhbHVlIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDQlNC+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtg0JrQvtC90LXRhiDRgdC80LXQvdGLOiAke21lbWJlci5mdWxsTmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRpbWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NjaGVkdWxlRHJhZnQuZW5kfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdXBkYXRlU3RhZmZTY2hlZHVsZURyYWZ0KG1lbWJlci5pZCwgeyBlbmQ6IGV2ZW50LnRhcmdldC52YWx1ZSB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlZWtkYXktdG9nZ2xlLXJvdyBzdGFmZi13ZWVrZGF5LXJvd1wiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9e2DQoNCw0LHQvtGH0LjQtSDQtNC90Lgg0YHQvtGC0YDRg9C00L3QuNC60LA6ICR7bWVtYmVyLmZ1bGxOYW1lfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt3ZWVrZGF5T3B0aW9ucy5tYXAoKGRheTogYW55KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17c2NoZWR1bGVEcmFmdC53b3JraW5nRGF5cy5pbmNsdWRlcyhkYXkudmFsdWUpID8gXCJhY3RpdmVcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17ZGF5LnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPXtzY2hlZHVsZURyYWZ0LndvcmtpbmdEYXlzLmluY2x1ZGVzKGRheS52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVN0YWZmV29ya2luZ0RheShtZW1iZXIuaWQsIGRheS52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtkYXkubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZmYtc2NoZWR1bGUtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHNhdmUtc3RhdGUgc2F2ZS1zdGF0ZS0ke3NjaGVkdWxlU2F2ZVN0YXRlfWB9PntzY2hlZHVsZVNhdmVMYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2Vjb25kYXJ5LWJ1dHRvbiBjb21wYWN0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHZvaWQgc2F2ZVN0YWZmU2NoZWR1bGUobWVtYmVyLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzY2hlZHVsZVNhdmluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2NoZWR1bGVTYXZpbmcgPyBcItCh0L7RhdGA0LDQvdGP0Y5cIiA6IFwi0KHQvtGF0YDQsNC90LjRgtGMINGB0LXQudGH0LDRgVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctc2NoZWR1bGUtc2VjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxoND7QoNCw0YHQv9C40YHQsNC90LjQtSDQutGA0LXRgdC10Ls8L2g0PlxuICAgICAgICAgICAgICAgICAgICAgIDxwPtCa0LDQsdC40L3QtdGCINC80L7QttC10YIg0YDQsNCx0L7RgtCw0YLRjCDQuNC90LDRh9C1LCDRh9C10Lwg0LLRgNCw0YcuINCt0YLQviDRgdGA0LDQt9GDINGD0YfQuNGC0YvQstCw0LXRgtGB0Y8g0LIg0LfQsNC/0LjRgdC4INC4INC60L7QvdGE0LvQuNC60YLQvdGL0YUg0YHQu9C+0YLQsNGFLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZmYtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtkYXNoYm9hcmQuY2xpbmljU2V0dGluZ3MuY2hhaXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChjaGFpcikgPT4gY2hhaXIuYWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoY2hhaXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGVEcmFmdCA9IGNoYWlyU2NoZWR1bGVEcmFmdHNbY2hhaXIuaWRdID8/IHN0YWZmU2NoZWR1bGVEcmFmdEZyb21Xb3JraW5nSG91cnMoY2hhaXIud29ya2luZ0hvdXJzID8/IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzY2hlZHVsZVNhdmVTdGF0ZSA9IGNoYWlyU2NoZWR1bGVTYXZlU3RhdGVzW2NoYWlyLmlkXSA/PyBcInNhdmVkXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjaGVkdWxlRGlydHkgPSBjaGFpclNjaGVkdWxlRGlydHlJZHMuaGFzKGNoYWlyLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGVTYXZpbmcgPSBjaGFpclNjaGVkdWxlU2F2aW5nSWQgPT09IGNoYWlyLmlkIHx8IHNjaGVkdWxlU2F2ZVN0YXRlID09PSBcInNhdmluZ1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzY2hlZHVsZVNhdmVMYWJlbCA9IHNjaGVkdWxlU2F2aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcItCQ0LLRgtC+0YHQvtGF0YDQsNC90LXQvdC40LVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc2NoZWR1bGVTYXZlU3RhdGUgPT09IFwiZXJyb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcItCd0LUg0YHQvtGF0YDQsNC90LXQvdC+XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc2NoZWR1bGVEaXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwi0JbQtNC10YIg0LDQstGC0L7RgdC+0YXRgNCw0L3QtdC90LjRj1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCLQodC+0YXRgNCw0L3QtdC90L5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWZmLXJvdyBvbmJvYXJkaW5nLXNjaGVkdWxlLXJvd1wiIGtleT17YG9uYm9hcmRpbmctY2hhaXItc2NoZWR1bGUtJHtjaGFpci5pZH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDYWxlbmRhckRheXMgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e2NoYWlyLm5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPntjaGFpci5zcGVjaWFsaXphdGlvbiA/IHNwZWNpYWx0eUxhYmVsc1tjaGFpci5zcGVjaWFsaXphdGlvbl0gOiBcItGD0L3QuNCy0LXRgNGB0LDQu9GM0L3QvlwifTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFmZi1zY2hlZHVsZS1lZGl0b3Igb25ib2FyZGluZy1jb21wYWN0LXNjaGVkdWxlLWVkaXRvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg0KFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2DQndCw0YfQsNC70L4g0YDQsNCx0L7RgtGLINC60YDQtdGB0LvQsDogJHtjaGFpci5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGltZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2NoZWR1bGVEcmFmdC5zdGFydH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNoYWlyU2NoZWR1bGVEcmFmdChjaGFpci5pZCwgeyBzdGFydDogZXZlbnQudGFyZ2V0LnZhbHVlIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDQlNC+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtg0JrQvtC90LXRhiDRgNCw0LHQvtGC0Ysg0LrRgNC10YHQu9CwOiAke2NoYWlyLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzY2hlZHVsZURyYWZ0LmVuZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZUNoYWlyU2NoZWR1bGVEcmFmdChjaGFpci5pZCwgeyBlbmQ6IGV2ZW50LnRhcmdldC52YWx1ZSB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlZWtkYXktdG9nZ2xlLXJvdyBzdGFmZi13ZWVrZGF5LXJvd1wiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9e2DQoNCw0LHQvtGH0LjQtSDQtNC90Lgg0LrRgNC10YHQu9CwOiAke2NoYWlyLm5hbWV9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3dlZWtkYXlPcHRpb25zLm1hcCgoZGF5OiBhbnkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzY2hlZHVsZURyYWZ0LndvcmtpbmdEYXlzLmluY2x1ZGVzKGRheS52YWx1ZSkgPyBcImFjdGl2ZVwiIDogXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtkYXkudmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLXByZXNzZWQ9e3NjaGVkdWxlRHJhZnQud29ya2luZ0RheXMuaW5jbHVkZXMoZGF5LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlQ2hhaXJXb3JraW5nRGF5KGNoYWlyLmlkLCBkYXkudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGF5LmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWZmLXNjaGVkdWxlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BzYXZlLXN0YXRlIHNhdmUtc3RhdGUtJHtzY2hlZHVsZVNhdmVTdGF0ZX1gfT57c2NoZWR1bGVTYXZlTGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b24gY29tcGFjdC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB2b2lkIHNhdmVDaGFpclNjaGVkdWxlKGNoYWlyLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzY2hlZHVsZVNhdmluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2NoZWR1bGVTYXZpbmcgPyBcItCh0L7RhdGA0LDQvdGP0Y5cIiA6IFwi0KHQvtGF0YDQsNC90LjRgtGMINGB0LXQudGH0LDRgVwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICAgIHtvbmJvYXJkaW5nU3RlcCA9PT0gXCJzb3VyY2VzXCIgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1wYW5lbFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8aDM+0JjRgdGC0L7Rh9C90LjQutC4INC00LDQvdC90YvRhTwvaDM+XG4gICAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAg0JLRi9Cx0LXRgNC40YLQtSDRgNCw0LHQvtGH0LjQtSDQuNGB0YLQvtGH0L3QuNC60Lgg0L7QtNC40L0g0YDQsNC3LiDQodC40YHRgtC10LzQsCDRgdC+0YXRgNCw0L3QuNGCINGN0YLQuCDQvdCw0YHRgtGA0L7QudC60Lgg0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0Lgg0LHRg9C00LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LjRhSDQsiDQv9GA0LDQudGB0LDRhSxcbiAgICAgICAgICAgICAgICAgICAg0L/QtdGA0LXQvdC+0YHQtSDQv9Cw0YbQuNC10L3RgtC+0LIsINC00L7QutGD0LzQtdC90YLQsNGFLCDRgdC90LjQvNC60LDRhSDQuCDQstC90LXRiNC90LXQvCDQv9GA0L7RgdC80L7RgtGA0LUg0JrQoiwg0L/QvtC60LAg0LrQu9C40L3QuNC60LAg0YHQsNC80LAg0LjRhSDQvdC1INC/0L7QvNC10L3Rj9C10YIuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctc291cmNlLWNvbmZpZ1wiIGFyaWEtbGFiZWw9XCLQkdGL0YHRgtGA0LDRjyDQvdCw0YHRgtGA0L7QudC60LAg0LjRgdGC0L7Rh9C90LjQutC+0LIg0LTQsNC90L3Ri9GFXCI+XG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXNvdXJjZS1zZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz7Qn9GA0LDQudGBINC60LvQuNC90LjQutC4PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4+0J7RgtC60YPQtNCwINCw0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAINGH0LDRidC1INCy0YHQtdCz0L4g0LfQsNC90L7RgdC40YIg0YbQtdC90Ysg0Lgg0LzQsNGC0LXRgNC40LDQu9GLLjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zb3VyY2UtY2hvaWNlLXJvd1wiIGFyaWEtbGFiZWw9XCLQmNGB0YLQvtGH0L3QuNC6INC/0YDQsNC50YHQsFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHsoT2JqZWN0LmtleXMocHJpY2VsaXN0U291cmNlS2luZExhYmVscykgYXMgUHJpY2VsaXN0U291cmNlS2luZFtdKS5tYXAoKGtpbmQpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtwcmljZWxpc3RTb3VyY2VLaW5kID09PSBraW5kID8gXCJhY3RpdmVcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17a2luZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtcHJlc3NlZD17cHJpY2VsaXN0U291cmNlS2luZCA9PT0ga2luZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFByaWNlbGlzdFNvdXJjZUtpbmQoa2luZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtpbmQgIT09IFwicGhvdG9fb2NyXCIpIGNsZWFyUHJpY2VsaXN0SW1hZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRQcmljZWxpc3RBbmFseXNpcyhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3ByaWNlbGlzdFNvdXJjZUtpbmRMYWJlbHNba2luZF19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctc291cmNlLXNlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPtCf0LXRgNC10L3QvtGBINC/0LDRhtC40LXQvdGC0L7Qsjwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtCe0YHQvdC+0LLQvdC+0Lkg0YTQvtGA0LzQsNGCINGB0YLQsNGA0L7QuSDQsdCw0LfRiyDQuNC70Lgg0LHRg9C80LDQttC90L7Qs9C+INC20YPRgNC90LDQu9CwLjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zb3VyY2UtY2hvaWNlLXJvd1wiIGFyaWEtbGFiZWw9XCLQmNGB0YLQvtGH0L3QuNC6INC/0LXRgNC10L3QvtGB0LAg0L/QsNGG0LjQtdC90YLQvtCyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgeyhPYmplY3Qua2V5cyhpbXBvcnRTb3VyY2VMYWJlbHMpIGFzIEltcG9ydFNvdXJjZUtpbmRbXSkubWFwKChraW5kKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aW1wb3J0U291cmNlS2luZCA9PT0ga2luZCA/IFwiYWN0aXZlXCIgOiBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2tpbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLXByZXNzZWQ9e2ltcG9ydFNvdXJjZUtpbmQgPT09IGtpbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJbXBvcnRTb3VyY2VLaW5kKGtpbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEltcG9ydFByZXZpZXcobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW1wb3J0Q29tbWl0KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aW1wb3J0U291cmNlTGFiZWxzW2tpbmRdLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXNvdXJjZS1zZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz7QodC80LXRiNCw0L3QvdCw0Y8g0LLRi9Cz0YDRg9C30LrQsDwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtCa0LDQuiDRgNCw0LfQsdC40YDQsNGC0Ywg0YTQsNC50LssINCz0LTQtSDQstC80LXRgdGC0LUg0L/QsNGG0LjQtdC90YLRiywg0YHQvdC40LzQutC4INC4INGB0LvRg9C20LXQsdC90YvQtSDRgdGC0YDQvtC60LguPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXNvdXJjZS1jaG9pY2Utcm93XCIgYXJpYS1sYWJlbD1cItCg0LXQttC40Lwg0YHQvNC10YjQsNC90L3QvtCz0L4g0LjQvNC/0L7RgNGC0LBcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7KE9iamVjdC5rZXlzKHNtYXJ0SW1wb3J0TW9kZUxhYmVscykgYXMgU21hcnRJbXBvcnRNb2RlW10pLm1hcCgobW9kZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3NtYXJ0SW1wb3J0TW9kZSA9PT0gbW9kZSA/IFwiYWN0aXZlXCIgOiBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e21vZGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLXByZXNzZWQ9e3NtYXJ0SW1wb3J0TW9kZSA9PT0gbW9kZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFNtYXJ0SW1wb3J0TW9kZShtb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTbWFydEltcG9ydFByZXZpZXcobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U21hcnRJbXBvcnRDb21taXQobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtzbWFydEltcG9ydE1vZGVMYWJlbHNbbW9kZV0udGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctc291cmNlLXNlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPtCU0L7QutGD0LzQtdC90YLRiyDQuCDRhNCw0LnQu9GLPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4+0JrRg9C00LAg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L7RgtC/0YDQsNCy0LvRj9GC0Ywg0YDQsNGB0L/QvtC30L3QsNC90L3Ri9C5INC00L7QutGD0LzQtdC90YIsINGC0LDQsdC70LjRhtGDLCDQsNGA0YXQuNCyINC40LvQuCDRhNC+0YLQvi48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctc291cmNlLWNob2ljZS1yb3dcIiBhcmlhLWxhYmVsPVwi0JzQsNGA0YjRgNGD0YIg0YDQsNGB0L/QvtC30L3QsNC90L3Ri9GFINC00L7QutGD0LzQtdC90YLQvtCyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgeyhPYmplY3Qua2V5cyhpbmdlc3Rpb25UYXJnZXRMYWJlbHMpIGFzIERvY3VtZW50SW5nZXN0aW9uVGFyZ2V0W10pLm1hcCgodGFyZ2V0KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17ZG9jdW1lbnRJbmdlc3Rpb25UYXJnZXQgPT09IHRhcmdldCA/IFwiYWN0aXZlXCIgOiBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3RhcmdldH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtcHJlc3NlZD17ZG9jdW1lbnRJbmdlc3Rpb25UYXJnZXQgPT09IHRhcmdldH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RG9jdW1lbnRJbmdlc3Rpb25UYXJnZXQodGFyZ2V0KX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2luZ2VzdGlvblRhcmdldExhYmVsc1t0YXJnZXRdfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXNvdXJjZS1zZWN0aW9uIG9uYm9hcmRpbmctc291cmNlLXNlY3Rpb24td2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+0KHQvdC40LzQutC4INC4INCa0KI8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7QntGB0L3QvtCy0L3QvtC5INC/0L7RgtC+0LogUlZHLCDQntCf0KLQkywg0JrQoiwg0LDRgNGF0LjQstCwINGB0L3QuNC80LrQvtCyINC40LvQuCDQu9C+0LrQsNC70YzQvdGL0YUg0L/QsNC/0L7Qui48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctc291cmNlLWNob2ljZS1yb3dcIiBhcmlhLWxhYmVsPVwi0JjRgdGC0L7Rh9C90LjQuiDRgdC90LjQvNC60L7QslwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtpbWFnaW5nU291cmNlQ2hvaWNlcy5tYXAoKGtpbmQpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtpbWFnaW5nSW1wb3J0U291cmNlS2luZCA9PT0ga2luZCA/IFwiYWN0aXZlXCIgOiBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2tpbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLXByZXNzZWQ9e2ltYWdpbmdJbXBvcnRTb3VyY2VLaW5kID09PSBraW5kfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW1hZ2luZ0ltcG9ydFNvdXJjZUtpbmQoa2luZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW1hZ2luZ0ltcG9ydFByZXZpZXcobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW1hZ2luZ0ltcG9ydENvbW1pdChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXREaWNvbVNlcmllc1ByZXZpZXcobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpbWFnaW5nU291cmNlTGFiZWxzW2tpbmRdfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXNvdXJjZS1zZWN0aW9uIG9uYm9hcmRpbmctc291cmNlLXNlY3Rpb24td2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+0JDRgNGF0LjQsiDRgdC90LjQvNC60L7QsiDQuCDQstC90LXRiNC90LjQuSDQv9GA0L7RgdC80L7RgtGAPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4+0JDQtNGA0LXRgdCwINC/0YDQvtGB0LzQvtGC0YDRidC40LrQsCDRgdC+0YXRgNCw0L3Rj9GO0YLRgdGPINCy0LzQtdGB0YLQtSDRgSDQvtGB0YLQsNC70YzQvdGL0LzQuCDQvdCw0YHRgtGA0L7QudC60LDQvNC4INC40YHRgtC+0YfQvdC40LrQvtCyLjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zb3VyY2UtdXJsLWdyaWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICDQkNC00YDQtdGBINCw0YDRhdC40LLQsCDRgdC90LjQvNC60L7QslxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtkaWNvbVdlYkVuZHBvaW50VXJsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RGljb21XZWJFbmRwb2ludFVybChldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldERpY29tV2ViQ2hlY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RGljb21WaWV3ZXJMYXVuY2hNYW5pZmVzdChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXREaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXREaWNvbVZpZXdlcldvcmtiZW5jaE1hbmlmZXN0KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImh0dHA6Ly8xMjcuMC4wLjE6ODA0Mi9kaWNvbS13ZWJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgINCQ0LTRgNC10YEg0LLQvdC10YjQvdC10LPQviDQv9GA0L7RgdC80L7RgtGA0LBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17b2hpZkJhc2VVcmx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRPaGlmQmFzZVVybChldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldERpY29tVmlld2VyTGF1bmNoTWFuaWZlc3QobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJodHRwOi8vMTI3LjAuMC4xOjMwMDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1zb3VyY2UtZ3JpZFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+0JDQstGC0L7RgdC+0YXRgNCw0L3QtdC90L46INC/0YDQsNC50YEsINC40LzQv9C+0YDRgiwg0LTQvtC60YPQvNC10L3RgtGLLCDRgdC90LjQvNC60LgsINCw0YDRhdC40LIg0Lgg0LLQvdC10YjQvdC40Lkg0L/RgNC+0YHQvNC+0YLRgDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHsgc2V0U2V0dGluZ3NUYWIoXCJwcmljZXNcIik7IHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJzZXR0aW5ncy9wcmljZXNcIjsgfX0+0J7RgtC60YDRi9GC0Ywg0L/RgNCw0LnRgTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4geyBzZXRTZXR0aW5nc1RhYihcImltcG9ydHNcIik7IHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJzZXR0aW5ncy9pbXBvcnRzXCI7IH19PtCe0YLQutGA0YvRgtGMINC/0LXRgNC10L3QvtGBPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB7IHNldFNldHRpbmdzVGFiKFwic291cmNlc1wiKTsgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcInNldHRpbmdzL3NvdXJjZXNcIjsgfX0+0J7RgtC60YDRi9GC0Ywg0YHQvdC40LzQutC4PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICAgIHtvbmJvYXJkaW5nU3RlcCA9PT0gXCJ0ZWxlZ3JhbVwiID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctcGFuZWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzPlRlbGVncmFtLCBRUiDQuCDRgdCy0Y/Qt9GMINGBINC/0LDRhtC40LXQvdGC0LDQvNC4PC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICDQndCw0YHRgtGA0L7QudGC0LUgVGVsZWdyYW0t0LHQvtGCINGB0YDQsNC30YMg0L/RgNC4INC/0LXRgNCy0L7QvCDQt9Cw0L/Rg9GB0LrQtTogUVIt0L/RgNC40LLRj9C30LrQsCDQv9Cw0YbQuNC10L3RgtCwLCDQvdCw0L/QvtC80LjQvdCw0L3QuNGPLCDQv9Cw0LzRj9GC0LrQuCDQv9C+0YHQu9C1INC70LXRh9C10L3QuNGPLFxuICAgICAgICAgICAgICAgICAgICDQvtGC0LfRi9Cy0Ysg0Lgg0YHRgdGL0LvQutC4INC90LAg0L/QvtGA0YLQsNC7INGB0L7RhdGA0LDQvdGP0Y7RgtGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0Lgg0L/RgNC40LzQtdC90Y/RjtGC0YHRjyDQutC+INCy0YHQtdC5INC60LvQuNC90LjQutC1LlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy10ZWxlZ3JhbS1zdGF0dXNcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICDQkdC+0YJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57dGVsZWdyYW1TdGF0dXM/LmJvdFVzZXJuYW1lID8gYEAke3RlbGVncmFtU3RhdHVzLmJvdFVzZXJuYW1lLnJlcGxhY2UoL15ALywgXCJcIil9YCA6IFwi0L3QtSDQt9Cw0LPRgNGD0LbQtdC9XCJ9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAg0KLRgNCw0L3RgdC/0L7RgNGCXG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3RlbGVncmFtU3RhdHVzPy53ZWJob29rUmVhZHkgPyBcItCz0L7RgtC+0LJcIiA6IFwi0L3Rg9C20L3QsCDQv9GA0L7QstC10YDQutCwXCJ9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgUVIt0LrQvtC00YtcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57dGVsZWdyYW1TdGF0dXM/LnBlbmRpbmdMaW5rQ29kZUNvdW50ID8/IDB9INC+0LbQuNC00LDRjtGCPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAg0KfQsNGC0YtcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57dGVsZWdyYW1TdGF0dXM/LmFjdGl2ZUNoYXRMaW5rQ291bnQgPz8gMH0g0YHQstGP0LfQsNC90Ys8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctZm9ybS1ncmlkXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCY0LzRjyDQvtCx0YnQtdCz0L4g0LHQvtGC0LAg0LIgVGVsZWdyYW1cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RlbGVncmFtQm90VXNlcm5hbWVEcmFmdH1cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImRlbnRlY3JtX2JvdFwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGVsZWdyYW1Cb3RVc2VybmFtZURyYWZ0KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrVGVsZWdyYW1TZXR0aW5nc0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCf0L7RgNGC0LDQuyDQv9Cw0YbQuNC10L3RgtCwXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ1cmxcIlxuICAgICAgICAgICAgICAgICAgICAgIGlucHV0TW9kZT1cInVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJodHRwczovL3BvcnRhbC5leGFtcGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVsZWdyYW1QYXRpZW50UG9ydGFsQmFzZVVybERyYWZ0fVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRlbGVncmFtUGF0aWVudFBvcnRhbEJhc2VVcmxEcmFmdChldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya1RlbGVncmFtU2V0dGluZ3NEaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICDQmtCw0YDRgtC40L3QutCwINC/0YDQuNCy0LXRgtGB0YLQstC40Y9cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwidXJsXCJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImh0dHBzOi8vLi4uL3dlbGNvbWUuanBnXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVsZWdyYW1XZWxjb21lSW1hZ2VVcmxEcmFmdH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUZWxlZ3JhbVdlbGNvbWVJbWFnZVVybERyYWZ0KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrVGVsZWdyYW1TZXR0aW5nc0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCh0YHRi9C70LrQsCDQvdCwINC+0YLQt9GL0LJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwidXJsXCJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImh0dHBzOi8vLi4uXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVsZWdyYW1SZXZpZXdVcmxEcmFmdH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUZWxlZ3JhbVJldmlld1VybERyYWZ0KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrVGVsZWdyYW1TZXR0aW5nc0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCh0YHRi9C70LrQsCDQvdCwINC60LDRgNGC0YNcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwidXJsXCJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImh0dHBzOi8vLi4uXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVsZWdyYW1NYXBzVXJsRHJhZnR9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGVsZWdyYW1NYXBzVXJsRHJhZnQoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtUZWxlZ3JhbVNldHRpbmdzRGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0KHRgNC+0LogUVIt0LrQvtC00LAsINC80LjQvdGD0YJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgbWluPXs1fVxuICAgICAgICAgICAgICAgICAgICAgIG1heD17MTQ0MH1cbiAgICAgICAgICAgICAgICAgICAgICBzdGVwPXs1fVxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZWxlZ3JhbVRva2VuVHRsRHJhZnR9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGVsZWdyYW1Ub2tlblR0bERyYWZ0KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrVGVsZWdyYW1TZXR0aW5nc0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCd0LDQv9C+0LzQuNC90LDQvdC40Y8g0LTQviDQv9GA0LjQtdC80LAsINGH0LDRgdGLXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGlucHV0TW9kZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMjQsIDJcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZWxlZ3JhbVJlbWluZGVyTGVhZFRpbWVzRHJhZnR9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGVsZWdyYW1SZW1pbmRlckxlYWRUaW1lc0RyYWZ0KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrVGVsZWdyYW1TZXR0aW5nc0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPtCd0LDQv9C+0LzQuNC90LDQvdC40Y8g0LTQviDQv9GA0LjQtdC80LAg0LIg0YfQsNGB0LDRhTog0L7RgiAxINC00L4gMTY4LCDQvNCw0LrRgdC40LzRg9C8IDYg0LfQvdCw0YfQtdC90LjQuS48L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0J/RgNC+0YHRjNCx0LAg0L7RhtC10L3QuNGC0Ywg0LrQu9C40L3QuNC60YMsINGH0LDRgdGLINC/0L7RgdC70LUg0LLQuNC30LjRgtCwXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIG1pbj17MX1cbiAgICAgICAgICAgICAgICAgICAgICBtYXg9ezcyMH1cbiAgICAgICAgICAgICAgICAgICAgICBzdGVwPXsxfVxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZWxlZ3JhbVJldmlld1JlcXVlc3REZWxheURyYWZ0fVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRlbGVncmFtUmV2aWV3UmVxdWVzdERlbGF5RHJhZnQoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtUZWxlZ3JhbVNldHRpbmdzRGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8c21hbGw+0JrQu9C40L3QuNC60LAg0YHQsNC80LAg0LLRi9Cx0LjRgNCw0LXRgiDQvNC+0LzQtdC90YIg0L/RgNC+0YHRjNCx0Ysg0L7RgdGC0LDQstC40YLRjCDQvtGC0LfRi9CyOiDQvtGCIDEg0LTQviA3MjAg0YfQsNGB0L7QsiDQv9C+0YHQu9C1INC30LDQutGA0YvRgtC+0LPQviDQstC40LfQuNGC0LAg0LjQu9C4INC+0L/Qu9Cw0YLRiy48L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxmaWVsZHNldCBjbGFzc05hbWU9XCJ0ZWxlZ3JhbS1jaGVja3VwLWRlbGF5LWZpZWxkcyBmdWxsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsZWdlbmQ+0JrQvtC90YLRgNC+0LvRjCDQv9C+0YHQu9C1INC70LXRh9C10L3QuNGPPC9sZWdlbmQ+XG4gICAgICAgICAgICAgICAgICAgIDxzbWFsbD7Qp9C10YDQtdC3INGB0LrQvtC70YzQutC+INGH0LDRgdC+0LIgVGVsZWdyYW0g0YHQv9GA0L7RgdC40YIg0L/QsNGG0LjQtdC90YLQsCDQviDRgdCw0LzQvtGH0YPQstGB0YLQstC40Lgg0L/QvtGB0LvQtSDQstGL0LTQsNC90L3QvtC5INC/0LDQvNGP0YLQutC4Ljwvc21hbGw+XG4gICAgICAgICAgICAgICAgICAgIHt0ZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheUZpZWxkcy5tYXAoKGZpZWxkKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17ZmllbGQua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZC5sYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPXsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg9ezcyMH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD17MX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RlbGVncmFtUG9zdFZpc2l0Q2hlY2t1cERlbGF5RHJhZnRzW2ZpZWxkLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZVRlbGVncmFtUG9zdFZpc2l0Q2hlY2t1cERlbGF5RHJhZnQoZmllbGQua2V5LCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD57ZmllbGQuaGVscH08L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAg0KHQtdC60YDQtdGCINCw0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGA0LAg0LrQu9C40L3QuNC60LhcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVsZWdyYW1BZG1pblNlY3JldERyYWZ0fVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFRlbGVncmFtQWRtaW5TZWNyZXREcmFmdChldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdW5sb2NrVGVsZWdyYW1BZG1pblNlc3Npb24oXCJ0ZWxlZ3JhbVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0LXRgdC70Lgg0LfQsNGJ0LjRidC10L3QvdGL0LUg0L3QsNGB0YLRgNC+0LnQutC4INCy0LrQu9GO0YfQtdC90Ysg0L3QsCDRgdC10YDQstC10YDQtSDQutC70LjQvdC40LrQuFwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzbWFsbD57dGVsZWdyYW1BZG1pblNlY3JldFNlc3Npb24gPyBcItCg0LDQt9Cx0LvQvtC60LjRgNC+0LLQsNC90L4g0LTQviDQv9C10YDQtdC30LDQs9GA0YPQt9C60Lgg0YHRgtGA0LDQvdC40YbRiy5cIiA6IFwi0KHQtdC60YDQtdGCINC90LUg0YHQvtGF0YDQsNC90Y/QtdGC0YHRjyDQsiDQsdGA0LDRg9C30LXRgNC1LlwifTwvc21hbGw+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHVubG9ja1RlbGVncmFtQWRtaW5TZXNzaW9uKFwidGVsZWdyYW1cIil9PlxuICAgICAgICAgICAgICAgICAgICA8U2hpZWxkQ2hlY2sgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz4g0KDQsNC30LHQu9C+0LrQuNGA0L7QstCw0YLRjFxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgINCf0YDQuNCy0LDRgtC90L7RgdGC0YxcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZWxlZ3JhbVByaXZhY3lNb2RlRHJhZnR9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGVsZWdyYW1Qcml2YWN5TW9kZURyYWZ0KG5vcm1hbGl6ZWRUZWxlZ3JhbVByaXZhY3lNb2RlKGV2ZW50LnRhcmdldC52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya1RlbGVncmFtU2V0dGluZ3NEaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibm9fcGhpX2J5X2RlZmF1bHRcIj57dGVsZWdyYW1Qcml2YWN5TW9kZUxhYmVscy5ub19waGlfYnlfZGVmYXVsdH08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibGltaXRlZF9hZG1pbl9vbmx5XCI+e3RlbGVncmFtUHJpdmFjeU1vZGVMYWJlbHMubGltaXRlZF9hZG1pbl9vbmx5fTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJjb25zZW50ZWRfcGhpX3RlbXBsYXRlc1wiIGRpc2FibGVkPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RlbGVncmFtUHJpdmFjeU1vZGVMYWJlbHMuY29uc2VudGVkX3BoaV90ZW1wbGF0ZXN9ICjQv9C+0YHQu9C1INCw0YPQtNC40YLQsClcbiAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1mZWF0dXJlLWxpc3RcIiBhcmlhLWxhYmVsPVwi0JHRi9GB0YLRgNGL0LUg0YHRhtC10L3QsNGA0LjQuCBUZWxlZ3JhbVwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXRlbGVncmFtLXZpc3VhbC1jYXJkc1wiPlxuICAgICAgICAgICAgICAgICAgICB7dGVsZWdyYW1WaXN1YWxDYXJkRmllbGRzXG4gICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoZmllbGQpID0+IG9uYm9hcmRpbmdUZWxlZ3JhbVZpc3VhbENhcmRLZXlzLmluY2x1ZGVzKGZpZWxkLmtleSkpXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcCgoZmllbGQpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2ZpZWxkLmtleX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZC5sYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwidXJsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17ZmllbGQucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RlbGVncmFtVmlzdWFsQ2FyZFVybERyYWZ0c1tmaWVsZC5rZXldID8/IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdXBkYXRlVGVsZWdyYW1WaXN1YWxDYXJkVXJsRHJhZnQoZmllbGQua2V5LCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+e2ZpZWxkLmhlbHB9INCV0YHQu9C4INC/0L7Qu9C1INC/0YPRgdGC0L7QtSwg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC60LDRgNGC0LjQvdC60LAg0L/RgNC40LLQtdGC0YHRgtCy0LjRjy48L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAge3RlbGVncmFtRmVhdHVyZU9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoZmVhdHVyZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhdGllbnRfbGlua2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcHBvaW50bWVudF9yZW1pbmRlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXBwb2ludG1lbnRfY29uZmlybWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50X3JlYWR5X25vdGljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXhfZG9jdW1lbnRfcmVxdWVzdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXltZW50X3JlbWluZGVyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3N0X3Zpc2l0X2luc3RydWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWNhbGxzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJldmlld19yZXF1ZXN0c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjYWxsYmFja19yZXF1ZXN0c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWN1cmVfcG9ydGFsX2xpbmtzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YWZmX3Rhc2tfYWxlcnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YWZmX2RhaWx5X2RpZ2VzdFwiXG4gICAgICAgICAgICAgICAgICAgICAgXS5pbmNsdWRlcyhmZWF0dXJlKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKGZlYXR1cmUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPXt0ZWxlZ3JhbUVuYWJsZWRGZWF0dXJlc0RyYWZ0LmluY2x1ZGVzKGZlYXR1cmUpID8gXCJhY3RpdmVcIiA6IFwiXCJ9IGtleT17ZmVhdHVyZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17dGVsZWdyYW1FbmFibGVkRmVhdHVyZXNEcmFmdC5pbmNsdWRlcyhmZWF0dXJlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHRvZ2dsZVRlbGVncmFtRmVhdHVyZShmZWF0dXJlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57dGVsZWdyYW1GZWF0dXJlTGFiZWwoZmVhdHVyZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25ib2FyZGluZy1pbmxpbmUtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHZvaWQgc2F2ZVRlbGVncmFtU2V0dGluZ3MoKX0gZGlzYWJsZWQ9e2lzVGVsZWdyYW1TZXR0aW5nc1NhdmluZ30+XG4gICAgICAgICAgICAgICAgICAgIDxTaGllbGRDaGVjayBhcmlhLWhpZGRlbj1cInRydWVcIiAvPiB7aXNUZWxlZ3JhbVNldHRpbmdzU2F2aW5nID8gXCLQodC+0YXRgNCw0L3Rj9GOXCIgOiBcItCh0L7RhdGA0LDQvdC40YLRjCBUZWxlZ3JhbVwifVxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNldFNldHRpbmdzVGFiKFwidGVsZWdyYW1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcInNldHRpbmdzL3RlbGVncmFtXCI7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxCb3QgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz4g0J7RgtC60YDRi9GC0Ywg0L/QvtC70L3Rg9GOINC/0LDQvdC10LvRjFxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0ZWxlZ3JhbS1zYXZlLXN0YXRlIHNhdmUtJHt0ZWxlZ3JhbVNldHRpbmdzU2F2ZVN0YXRlfWB9PlxuICAgICAgICAgICAgICAgICAgICB7dGVsZWdyYW1TZXR0aW5nc1NhdmVTdGF0ZSA9PT0gXCJzYXZpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgID8gXCLQkNCy0YLQvtGB0L7RhdGA0LDQvdC10L3QuNC1Li4uXCJcbiAgICAgICAgICAgICAgICAgICAgICA6IHRlbGVncmFtU2V0dGluZ3NTYXZlU3RhdGUgPT09IFwic2F2ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcIlRlbGVncmFtINGB0L7RhdGA0LDQvdC10L0uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdGVsZWdyYW1TZXR0aW5nc1NhdmVTdGF0ZSA9PT0gXCJlcnJvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gdGVsZWdyYW1TZXR0aW5nc1NhdmVFcnJvciA/PyBcIlRlbGVncmFtINC90LUg0YHQvtGF0YDQsNC90LXQvS5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRlbGVncmFtU2V0dGluZ3NEaXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCLQmNC30LzQtdC90LXQvdC40Y8g0LHRg9C00YPRgiDRgdC+0YXRgNCw0L3QtdC90Ysg0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60LguXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwi0JrQvtC90YTQuNCz0YPRgNCw0YbQuNGPIFRlbGVncmFtINGB0L7RhdGA0LDQvdC10L3QsC5cIn1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgICAge29uYm9hcmRpbmdTdGVwID09PSBcImRvbmVcIiA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXBhbmVsXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxoMz7Qn9GA0L7QstC10YDQutCwINC/0LXRgNC10LQg0YDQsNCx0L7RgtC+0Lk8L2gzPlxuICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgINCf0YDQvtGE0LjQu9GMINC60LvQuNC90LjQutC4OiB7bGVnYWxSZWFkaW5lc3NQZXJjZW50fSUuINCa0L7QvNCw0L3QtNCwOiB7ZGFzaGJvYXJkLmNsaW5pY1NldHRpbmdzLnN0YWZmLmxlbmd0aH0uINCa0LDQsdC40L3QtdGC0Ys6e1wiIFwifVxuICAgICAgICAgICAgICAgICAgICB7ZGFzaGJvYXJkLmNsaW5pY1NldHRpbmdzLmNoYWlycy5sZW5ndGh9LiBUZWxlZ3JhbToge3RlbGVncmFtU3RhdHVzPy53ZWJob29rUmVhZHkgPyBcItCz0L7RgtC+0LIg0Log0L7RgtC/0YDQsNCy0LrQtVwiIDogXCLQvdGD0LbQvdCwINC90LDRgdGC0YDQvtC50LrQsCDQvtGC0L/RgNCw0LLQutC4XCJ9LiDQlNC+0LrRg9C80LXQvdGC0Ys6e1wiIFwifVxuICAgICAgICAgICAgICAgICAgICB7ZG9jdW1lbnRGYWN0b3J5R3JvdXBzLnJlZHVjZSgodG90YWwsIGdyb3VwKSA9PiB0b3RhbCArIGdyb3VwLmtpbmRzLmxlbmd0aCwgMCl9INGI0LDQsdC70L7QvdC+0LIuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLXJlYWRpbmVzcy1ncmlkXCI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57Y2xpbmljTW9kZUxhYmVsc1tkYXNoYm9hcmQuY2xpbmljU2V0dGluZ3MucHJvZmlsZT8ubW9kZV0udGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3N0YWZmUm9sZUxhYmVsc1tzZWxlY3RlZFdvcmtzcGFjZVJvbGVdfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPntzcGVjaWFsdHlMYWJlbHNbc2VsZWN0ZWRTcGVjaWFsdHldfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt0ZWxlZ3JhbUVuYWJsZWRGZWF0dXJlc0RyYWZ0Lmxlbmd0aH0gVGVsZWdyYW0t0YHRhtC10L3QsNGA0LjQtdCyINCy0LrQu9GO0YfQtdC90L48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57b25ib2FyZGluZ0RvY3VtZW50c1JlYWR5ID8gXCLQtNC+0LrRg9C80LXQvdGC0Ysg0LPQvtGC0L7QstGLINC6INCy0YvQtNCw0YfQtVwiIDogXCLQtNC+0LrRg9C80LXQvdGC0Ysg0YLRgNC10LHRg9GO0YIg0YDQtdC60LLQuNC30LjRgtC+0LJcIn08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgeyFvbmJvYXJkaW5nUmVhZHlUb0ZpbmlzaCA/IChcbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctYmxvY2tlclwiPtCU0L4g0LfQsNCy0LXRgNGI0LXQvdC40Y8g0L3Rg9C20L3QviDQt9Cw0L/QvtC70L3QuNGC0Yw6IHtvbmJvYXJkaW5nQmxvY2tpbmdJc3N1ZXMuam9pbihcIiwgXCIpfS48L3A+XG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgICAgeyFvbmJvYXJkaW5nRG9jdW1lbnRzUmVhZHkgPyAoXG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWJsb2NrZXIgb25ib2FyZGluZy1hZHZpc29yeVwiPlxuICAgICAgICAgICAgICAgICAgICDQn9C10YDQstGL0Lkg0YDQsNCx0L7Rh9C40Lkg0Y3QutGA0LDQvSDQvNC+0LbQvdC+INC+0YLQutGA0YvRgtGMINGB0LXQudGH0LDRgS4g0JTQu9GPINC00L7Qs9C+0LLQvtGA0L7Qsiwg0LDQutGC0L7QsiDQuCDQvdCw0LvQvtCz0L7QstGL0YUg0YTQvtGA0Lwg0L/QvtC30LbQtSDQt9Cw0L/QvtC70L3QuNGC0LU6e1wiIFwifVxuICAgICAgICAgICAgICAgICAgICB7b25ib2FyZGluZ0RvY3VtZW50UmVhZGluZXNzSXNzdWVzLmpvaW4oXCIsIFwiKX0uXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgICAge29uYm9hcmRpbmdUZWxlZ3JhbVJlY29tbWVuZGF0aW9ucy5sZW5ndGggPyAoXG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWJsb2NrZXIgb25ib2FyZGluZy1hZHZpc29yeVwiPlxuICAgICAgICAgICAgICAgICAgICBUZWxlZ3JhbSDQvNC+0LbQvdC+INCy0LrQu9GO0YfQuNGC0Ywg0L/QvtC30LbQtToge29uYm9hcmRpbmdUZWxlZ3JhbVJlY29tbWVuZGF0aW9ucy5qb2luKFwiLCBcIil9LlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICB7IW9uYm9hcmRpbmdSZWFkeVRvRmluaXNoID8gKFxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWJsb2NrZXIgb25ib2FyZGluZy1hY3Rpb24tZ3VpZGFuY2VcIiBpZD17b25ib2FyZGluZ0ZpbmlzaEd1aWRhbmNlSWR9IHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj5cbiAgICAgICAgICAgICAgICDQp9GC0L7QsdGLINC30LDQstC10YDRiNC40YLRjCDQvdCw0YHRgtGA0L7QudC60YMsINC30LDQv9C+0LvQvdC40YLQtToge29uYm9hcmRpbmdCbG9ja2luZ0lzc3Vlcy5qb2luKFwiLCBcIil9LlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b25cIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Rpc21pc3NPbmJvYXJkaW5nfVxuICAgICAgICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9eyFvbmJvYXJkaW5nUmVhZHlUb0ZpbmlzaCA/IG9uYm9hcmRpbmdGaW5pc2hHdWlkYW5jZUlkIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshb25ib2FyZGluZ1JlYWR5VG9GaW5pc2h9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICDQodC60YDRi9GC0YxcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIHshb25ib2FyZGluZ1JlYWR5VG9GaW5pc2ggPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWNvbmRhcnktYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHZvaWQgY29udGludWVPbmJvYXJkaW5nSW5EcmFmdE1vZGUoKX0+XG4gICAgICAgICAgICAgICAgICDQn9GA0L7QtNC+0LvQttC40YLRjCDQsiDRh9C10YDQvdC+0LLQuNC60LVcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwic2Vjb25kYXJ5LWJ1dHRvblwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB2b2lkIHNhdmVDbGluaWNQcm9maWxlRnJvbURyYWZ0KCl9IGRpc2FibGVkPXtjbGluaWNQcm9maWxlU2F2ZVN0YXRlID09PSBcInNhdmluZ1wifT5cbiAgICAgICAgICAgICAgICA8U2hpZWxkQ2hlY2sgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz4ge2NsaW5pY1Byb2ZpbGVTYXZlU3RhdGUgPT09IFwic2F2aW5nXCIgPyBcItCh0L7RhdGA0LDQvdGP0Y5cIiA6IFwi0KHQvtGF0YDQsNC90LjRgtGMINC/0YDQvtGE0LjQu9GMXCJ9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICB7cHJldmlvdXNPbmJvYXJkaW5nU3RlcCA/IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gdm9pZCBtb3ZlT25ib2FyZGluZ1RvKHByZXZpb3VzT25ib2FyZGluZ1N0ZXAuaWQpfT5cbiAgICAgICAgICAgICAgICAgINCd0LDQt9Cw0LRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIHtuZXh0T25ib2FyZGluZ1N0ZXAgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJpbWFyeS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB2b2lkIG1vdmVPbmJvYXJkaW5nVG8obmV4dE9uYm9hcmRpbmdTdGVwLmlkKX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e25leHRPbmJvYXJkaW5nU3RlcC5pZCA9PT0gXCJkb25lXCIgJiYgIW9uYm9hcmRpbmdSZWFkeVRvRmluaXNoID8gb25ib2FyZGluZ0ZpbmlzaEd1aWRhbmNlSWQgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17bmV4dE9uYm9hcmRpbmdTdGVwLmlkID09PSBcImRvbmVcIiAmJiAhb25ib2FyZGluZ1JlYWR5VG9GaW5pc2h9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAg0JTQsNC70YzRiNC1IDxBcnJvd1JpZ2h0IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJpbWFyeS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtkaXNtaXNzT25ib2FyZGluZ31cbiAgICAgICAgICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9eyFvbmJvYXJkaW5nUmVhZHlUb0ZpbmlzaCA/IG9uYm9hcmRpbmdGaW5pc2hHdWlkYW5jZUlkIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFvbmJvYXJkaW5nUmVhZHlUb0ZpbmlzaH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICDQl9Cw0LLQtdGA0YjQuNGC0Ywg0L3QsNGB0YLRgNC+0LnQutGDXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHtvbmJvYXJkaW5nRGlzbWlzc2VkICYmIG9uYm9hcmRpbmdEcmFmdE1vZGUgJiYgIW9uYm9hcmRpbmdSZWFkeVRvRmluaXNoID8gKFxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cIm9uYm9hcmRpbmctZHJhZnQtc3RyaXBcIiBhcmlhLWxhYmVsPVwi0J/QtdGA0LLQuNGH0L3QsNGPINC90LDRgdGC0YDQvtC50LrQsCDQsiDRh9C10YDQvdC+0LLQuNC60LVcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxzdHJvbmc+0J/QtdGA0LLQuNGH0L3QsNGPINC90LDRgdGC0YDQvtC50LrQsCDQvdC1INC30LDQstC10YDRiNC10L3QsDwvc3Ryb25nPlxuICAgICAgICAgICAgICA8c3Bhbj7QnNC+0LbQvdC+INGA0LDQsdC+0YLQsNGC0Ywg0LIg0YfQtdGA0L3QvtCy0LjQutC1LCDQvdC+INC/0LXRgNC10LQg0LLRi9C00LDRh9C10Lkg0LTQvtC60YPQvNC10L3RgtC+0LIg0LfQsNC/0L7Qu9C90LjRgtC1OiB7b25ib2FyZGluZ0Jsb2NraW5nSXNzdWVzLmpvaW4oXCIsIFwiKX0uPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17cmVvcGVuT25ib2FyZGluZ30+XG4gICAgICAgICAgICAgINCS0LXRgNC90YPRgtGM0YHRjyDQuiDQvdCw0YHRgtGA0L7QudC60LVcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge29uYm9hcmRpbmdEaXNtaXNzZWQgJiYgb25ib2FyZGluZ1JlYWR5VG9GaW5pc2ggJiYgIW9uYm9hcmRpbmdEb2N1bWVudHNSZWFkeSA/IChcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJvbmJvYXJkaW5nLWRyYWZ0LXN0cmlwXCIgYXJpYS1sYWJlbD1cItCU0L7QutGD0LzQtdC90YLRiyDRgtGA0LXQsdGD0Y7RgiDRgNC10LrQstC40LfQuNGC0L7QslwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHN0cm9uZz7QlNC+0LrRg9C80LXQvdGC0Ysg0YLRgNC10LHRg9GO0YIg0YDQtdC60LLQuNC30LjRgtC+0LI8L3N0cm9uZz5cbiAgICAgICAgICAgICAgPHNwYW4+0JTQu9GPINC00L7Qs9C+0LLQvtGA0L7Qsiwg0LDQutGC0L7QsiDQuCDQvdCw0LvQvtCz0L7QstGL0YUg0YTQvtGA0Lwg0LfQsNC/0L7Qu9C90LjRgtC1OiB7b25ib2FyZGluZ0RvY3VtZW50UmVhZGluZXNzSXNzdWVzLmpvaW4oXCIsIFwiKX0uPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNlY29uZGFyeS1idXR0b25cIlxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEN1cnJlbnRWaWV3KFwic2V0dGluZ3NcIik7XG4gICAgICAgICAgICAgICAgc2V0U2V0dGluZ3NUYWIoXCJjbGluaWNcIik7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcInNldHRpbmdzL2NsaW5pY1wiO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICDQl9Cw0L/QvtC70L3QuNGC0Ywg0YDQtdC60LLQuNC30LjRgtGLXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHtjdXJyZW50VmlldyA9PT0gXCJzaGlmdFwiID8gKFxuICAgICAgICA8U2hpZnRWaWV3XG4gICAgICAgICAgYWN0aXZlUGF0aWVudD17YWN0aXZlUGF0aWVudH1cbiAgICAgICAgICBhY3RpdmVQYXRpZW50SGFzQ2FsbGFibGVQaG9uZT17YWN0aXZlUGF0aWVudEhhc0NhbGxhYmxlUGhvbmV9XG4gICAgICAgICAgYWN0aXZlUGF0aWVudENhbGxhYmxlUGhvbmU9e2FjdGl2ZVBhdGllbnRDYWxsYWJsZVBob25lfVxuICAgICAgICAgIHZpc2libGVSZWNvbW1lbmRlZEFjdGlvbnM9e3Zpc2libGVSZWNvbW1lbmRlZEFjdGlvbnN9XG4gICAgICAgICAgcmVjb21tZW5kZWRBY3Rpb25Qcmlvcml0eUxhYmVscz17cmVjb21tZW5kZWRBY3Rpb25Qcmlvcml0eUxhYmVsc31cbiAgICAgICAgICBzdGFmZlJvbGVMYWJlbHM9e3N0YWZmUm9sZUxhYmVsc31cbiAgICAgICAgICBzZWxlY3RlZFdvcmtzcGFjZVJvbGU9e3NlbGVjdGVkV29ya3NwYWNlUm9sZX1cbiAgICAgICAgICBhY3RpdmVSb2xlUXVldWU9e2FjdGl2ZVJvbGVRdWV1ZX1cbiAgICAgICAgICBhY3RpdmVSb2xlUG9saWN5PXthY3RpdmVSb2xlUG9saWN5fVxuICAgICAgICAgIGFjdGl2ZVJvbGVXcml0YWJsZVNlY3Rpb25zPXthY3RpdmVSb2xlV3JpdGFibGVTZWN0aW9uc31cbiAgICAgICAgICB2aWV3TGFiZWxzPXt2aWV3TGFiZWxzfVxuICAgICAgICAgIGFjdGl2ZVJvbGVSZXN0cmljdGVkU2VjdGlvbnM9e2FjdGl2ZVJvbGVSZXN0cmljdGVkU2VjdGlvbnN9XG4gICAgICAgICAgZGFzaGJvYXJkPXtkYXNoYm9hcmR9XG4gICAgICAgICAgYWN0aXZlUXVldWVSb2xlPXthY3RpdmVRdWV1ZVJvbGV9XG4gICAgICAgICAgc2hpZnRXYXJuaW5ncz17c2hpZnRXYXJuaW5nc31cbiAgICAgICAgICB3YXJuaW5nU2V2ZXJpdHlMYWJlbHM9e3dhcm5pbmdTZXZlcml0eUxhYmVsc31cbiAgICAgICAgICBvcGVuU2NoZWR1bGVXYXJuaW5nPXtvcGVuU2NoZWR1bGVXYXJuaW5nfVxuICAgICAgICAgIHNldEVycm9yPXtzZXRFcnJvcn1cbiAgICAgICAgICBtb3N0TG9hZGVkUmVzb3VyY2U9e21vc3RMb2FkZWRSZXNvdXJjZX1cbiAgICAgICAgICBzZXRTZWxlY3RlZFBhdGllbnRJZD17c2V0U2VsZWN0ZWRQYXRpZW50SWR9XG4gICAgICAgICAgYWN0aXZlRG9jdG9yPXthY3RpdmVEb2N0b3J9XG4gICAgICAgIC8+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHtbXCJzaGlmdFwiLCBcInBhdGllbnRzXCJdLmluY2x1ZGVzKGN1cnJlbnRWaWV3KSA/IChcbiAgICAgICAgICA8UGF0aWVudENvY2twaXRcbiAgICAgICAgICAgIGFjdGl2ZVBhdGllbnQ9e2FjdGl2ZVBhdGllbnR9XG4gICAgICAgICAgICBhY3RpdmVQYXRpZW50SW5zaWdodD17YWN0aXZlUGF0aWVudEluc2lnaHR9XG4gICAgICAgICAgICBkYXNoYm9hcmQ9e2Rhc2hib2FyZH1cbiAgICAgICAgICAgIGFjdGl2ZUNvbW11bmljYXRpb25UYXNrcz17YWN0aXZlQ29tbXVuaWNhdGlvblRhc2tzfVxuICAgICAgICAgICAgYWN0aXZlSW1hZ2luZ1N0dWRpZXM9e2FjdGl2ZUltYWdpbmdTdHVkaWVzfVxuICAgICAgICAgICAgYWN0aXZlVXNhYmxlRG9jdW1lbnRzPXthY3RpdmVVc2FibGVEb2N1bWVudHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge2N1cnJlbnRWaWV3ID09PSBcImltYWdpbmdcIiA/IChcbiAgPFdvcmtzcGFjZVJvdXRlRXJyb3JCb3VuZGFyeSB2aWV3PVwiaW1hZ2luZ1wiIGxhYmVsPXt2aWV3TGFiZWxzLmltYWdpbmd9IHBhbmVsQ2xhc3NOYW1lPVwicGFuZWwgaW1hZ2luZy1wYW5lbFwiIHBhbmVsSWQ9XCJpbWFnaW5nXCI+XG4gICAgPFN1c3BlbnNlXG4gICAgICBmYWxsYmFjaz17XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgaW1hZ2luZy1wYW5lbFwiIGlkPVwiaW1hZ2luZ1wiIGFyaWEtYnVzeT1cInRydWVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxoMj7QodC90LjQvNC60Lgg0L/QsNGG0LjQtdC90YLQsDwvaDI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzdGF0dXMtcGlsbCBzdGF0dXMtcGxhbm5lZFwiPtC30LDQs9GA0YPQt9C60LA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgfVxuICAgID5cbiAgICAgIDxJbWFnaW5nVmlld1xuICAgICAgICBDdFBsYW5uaW5nVG9vbHNQYW5lbD17Q3RQbGFubmluZ1Rvb2xzUGFuZWx9XG4gICAgICAgIEV4dGVybmFsTGluaz17RXh0ZXJuYWxMaW5rfVxuICAgICAgICBGbGlwSG9yaXpvbnRhbD17RmxpcEhvcml6b250YWx9XG4gICAgICAgIEltYWdlSWNvbj17SW1hZ2VJY29ufVxuICAgICAgICBQbHVzPXtQbHVzfVxuICAgICAgICBSZWZyZXNoQ3c9e1JlZnJlc2hDd31cbiAgICAgICAgUm90YXRlQ2N3PXtSb3RhdGVDY3d9XG4gICAgICAgIFJvdGF0ZUN3PXtSb3RhdGVDd31cbiAgICAgICAgWm9vbUluPXtab29tSW59XG4gICAgICAgIFpvb21PdXQ9e1pvb21PdXR9XG4gICAgICAgIGFjdGl2ZUFwcG9pbnRtZW50PXthY3RpdmVBcHBvaW50bWVudH1cbiAgICAgICAgYWN0aXZlSW1hZ2luZ1N0dWRpZXM9e2FjdGl2ZUltYWdpbmdTdHVkaWVzfVxuICAgICAgICBhY3RpdmVQYXRpZW50PXthY3RpdmVQYXRpZW50fVxuICAgICAgICBhZGRJbWFnaW5nVmlld2VyTm90ZUFubm90YXRpb249e2FkZEltYWdpbmdWaWV3ZXJOb3RlQW5ub3RhdGlvbn1cbiAgICAgICAgYXBwbHlDdFBsYW5uaW5nUXVpY2tBY3Rpb249e2FwcGx5Q3RQbGFubmluZ1F1aWNrQWN0aW9ufVxuICAgICAgICBhcHBseU1wckNsaW5pY2FsUHJlc2V0PXthcHBseU1wckNsaW5pY2FsUHJlc2V0fVxuICAgICAgICBhcHBseU5lYXJlc3RNcHJDbGluaWNhbFByZXNldD17YXBwbHlOZWFyZXN0TXByQ2xpbmljYWxQcmVzZXR9XG4gICAgICAgIGNhblJldHJ5SW1hZ2luZ1ZpZXdlclNhdmU9e2NhblJldHJ5SW1hZ2luZ1ZpZXdlclNhdmV9XG4gICAgICAgIGNiY3RXb3JrYmVuY2hQbGFuZXM9e2NiY3RXb3JrYmVuY2hQbGFuZXN9XG4gICAgICAgIGNiY3RXb3JrYmVuY2hQcm9qZWN0aW9ucz17Y2JjdFdvcmtiZW5jaFByb2plY3Rpb25zfVxuICAgICAgICBjYmN0V29ya2JlbmNoU2VyaWVzPXtjYmN0V29ya2JlbmNoU2VyaWVzfVxuICAgICAgICBjbGFtcE1wckF4aXNEZWc9e2NsYW1wTXByQXhpc0RlZ31cbiAgICAgICAgY2xhbXBNcHJTbGFiTW09e2NsYW1wTXByU2xhYk1tfVxuICAgICAgICBjbGFtcE1wclNsaWNlSW5kZXg9e2NsYW1wTXByU2xpY2VJbmRleH1cbiAgICAgICAgY3JlYXRlQ3RQbGFubmluZ0FydGlmYWN0PXtjcmVhdGVDdFBsYW5uaW5nQXJ0aWZhY3R9XG4gICAgICAgIGNyZWF0ZUltYWdpbmdTdHVkeT17Y3JlYXRlSW1hZ2luZ1N0dWR5fVxuICAgICAgICBjdFBsYW5uaW5nQWN0aXZlUXVpY2tBY3Rpb25JZD17Y3RQbGFubmluZ0FjdGl2ZVF1aWNrQWN0aW9uSWR9XG4gICAgICAgIGN0UGxhbm5pbmdBbm5vdGF0aW9uUmVmcz17Y3RQbGFubmluZ0Fubm90YXRpb25SZWZzfVxuICAgICAgICBjdFBsYW5uaW5nSW1wbGFudFBsYW49e2N0UGxhbm5pbmdJbXBsYW50UGxhbn1cbiAgICAgICAgY3VycmVudFZpZXc9e2N1cnJlbnRWaWV3fVxuICAgICAgICBkZWZhdWx0SW1hZ2luZ1ZpZXdlclN0YXRlPXtkZWZhdWx0SW1hZ2luZ1ZpZXdlclN0YXRlfVxuICAgICAgICBkZXNjcmliZU1wckNsaW5pY2FsUHJlc2V0UHJvamVjdGlvbkZhbGxiYWNrPXtkZXNjcmliZU1wckNsaW5pY2FsUHJlc2V0UHJvamVjdGlvbkZhbGxiYWNrfVxuICAgICAgICBkaWNvbUxhYmVsPXtkaWNvbUxhYmVsfVxuICAgICAgICBkaWNvbVF1YWxpdHlNb2RlTGFiZWxzPXtkaWNvbVF1YWxpdHlNb2RlTGFiZWxzfVxuICAgICAgICBkaWNvbVRleHR1cmVTdHJhdGVneUxhYmVscz17ZGljb21UZXh0dXJlU3RyYXRlZ3lMYWJlbHN9XG4gICAgICAgIGRpY29tVmlld2VyVG9vbFN0YXRlQnVuZGxlPXtkaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZX1cbiAgICAgICAgZGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdD17ZGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdH1cbiAgICAgICAgZm9ybWF0U2hvcnREYXRlPXtmb3JtYXRTaG9ydERhdGV9XG4gICAgICAgIGZvcm1hdFNpZ25lZE1wclN0ZXA9e2Zvcm1hdFNpZ25lZE1wclN0ZXB9XG4gICAgICAgIGZvcm1hdFRpbWU9e2Zvcm1hdFRpbWV9XG4gICAgICAgIGhhbmRsZU1wcktleWJvYXJkTmF2aWdhdGlvbj17aGFuZGxlTXByS2V5Ym9hcmROYXZpZ2F0aW9ufVxuICAgICAgICBoYW5kbGVCcm93c2VyRGlyZWN0b3J5SW5wdXRDaGFuZ2U9e2hhbmRsZUJyb3dzZXJEaXJlY3RvcnlJbnB1dENoYW5nZX1cbiAgICAgICAgYnJvd3NlckRpcmVjdG9yeUlucHV0UmVmPXticm93c2VyRGlyZWN0b3J5SW5wdXRSZWZ9XG4gICAgICAgIGF0dGFjaEJyb3dzZXJEaXJlY3RvcnlJbnB1dFJlZj17YnJvd3NlckRpcmVjdG9yeUlucHV0UmVmfVxuICAgICAgICBicm93c2VySW1hZ2luZ1NjYW5Qcm9ncmVzcz17YnJvd3NlckltYWdpbmdTY2FuUHJvZ3Jlc3N9XG4gICAgICAgIGJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyPXticm93c2VyUGlja2VkSW1hZ2luZ0ZvbGRlcn1cbiAgICAgICAgY2FuY2VsQnJvd3NlckltYWdpbmdGb2xkZXJTY2FuPXtjYW5jZWxCcm93c2VySW1hZ2luZ0ZvbGRlclNjYW59XG4gICAgICAgIGZvcm1hdEJ5dGVTaXplPXtmb3JtYXRCeXRlU2l6ZX1cbiAgICAgICAgaXNCcm93c2VySW1hZ2luZ0ZvbGRlclBpY2tpbmc9e2lzQnJvd3NlckltYWdpbmdGb2xkZXJQaWNraW5nfVxuICAgICAgICBwaWNrQnJvd3NlckltYWdpbmdGb2xkZXI9e3BpY2tCcm93c2VySW1hZ2luZ0ZvbGRlcn1cbiAgICAgICAgaW1hZ2luZ0NvbXBhcmlzb25DYW5kaWRhdGVzPXtpbWFnaW5nQ29tcGFyaXNvbkNhbmRpZGF0ZXN9XG4gICAgICAgIGltYWdpbmdDcmVhdGVTYXZpbmdLaW5kPXtpbWFnaW5nQ3JlYXRlU2F2aW5nS2luZH1cbiAgICAgICAgaW1hZ2luZ0tpbmRGaWx0ZXI9e2ltYWdpbmdLaW5kRmlsdGVyfVxuICAgICAgICBpbWFnaW5nS2luZExhYmVscz17aW1hZ2luZ0tpbmRMYWJlbHN9XG4gICAgICAgIGltYWdpbmdLaW5kT3B0aW9ucz17aW1hZ2luZ0tpbmRPcHRpb25zfVxuICAgICAgICBpbWFnaW5nUHJldmlld1NvdXJjZT17aW1hZ2luZ1ByZXZpZXdTb3VyY2V9XG4gICAgICAgIGltYWdpbmdTb3VyY2VMYWJlbHM9e2ltYWdpbmdTb3VyY2VMYWJlbHN9XG4gICAgICAgIGltYWdpbmdWaWV3ZXJBY3RpdmVUb29sPXtpbWFnaW5nVmlld2VyQWN0aXZlVG9vbH1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlckFubm90YXRpb25zPXtpbWFnaW5nVmlld2VyQW5ub3RhdGlvbnN9XG4gICAgICAgIGltYWdpbmdWaWV3ZXJIcmVmPXtpbWFnaW5nVmlld2VySHJlZn1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlckltYWdlU3R5bGU9e2ltYWdpbmdWaWV3ZXJJbWFnZVN0eWxlfVxuICAgICAgICBpbWFnaW5nVmlld2VyTm90ZT17aW1hZ2luZ1ZpZXdlck5vdGV9XG4gICAgICAgIGltYWdpbmdWaWV3ZXJOb3RlTWlzc2luZ0lkPXtpbWFnaW5nVmlld2VyTm90ZU1pc3NpbmdJZH1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlck5vdGVSZWFkeT17aW1hZ2luZ1ZpZXdlck5vdGVSZWFkeX1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlclJldHJ5TWlzc2luZ0lkPXtpbWFnaW5nVmlld2VyUmV0cnlNaXNzaW5nSWR9XG4gICAgICAgIGltYWdpbmdWaWV3ZXJTYXZlRGV0YWlsPXtpbWFnaW5nVmlld2VyU2F2ZURldGFpbH1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlclNhdmVTdGF0ZT17aW1hZ2luZ1ZpZXdlclNhdmVTdGF0ZX1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlclNhdmVUaXRsZT17aW1hZ2luZ1ZpZXdlclNhdmVUaXRsZX1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlclNlc3Npb25SZWFkeT17aW1hZ2luZ1ZpZXdlclNlc3Npb25SZWFkeX1cbiAgICAgICAgaW1hZ2luZ1ZpZXdlclN0YXRlPXtpbWFnaW5nVmlld2VyU3RhdGV9XG4gICAgICAgIGltYWdpbmdWaWV3ZXJUb29sTGFiZWxzPXtpbWFnaW5nVmlld2VyVG9vbExhYmVsc31cbiAgICAgICAgaXNPbmxpbmU9e2lzT25saW5lfVxuICAgICAgICBtcHJBY3RpdmVQcm9qZWN0aW9uTGFiZWw9e21wckFjdGl2ZVByb2plY3Rpb25MYWJlbH1cbiAgICAgICAgbXByQWN0aXZlUHJvamVjdGlvbk9yaWVudGF0aW9uPXttcHJBY3RpdmVQcm9qZWN0aW9uT3JpZW50YXRpb259XG4gICAgICAgIG1wckF4aXNBbmdsZUJhZGdlPXttcHJBeGlzQW5nbGVCYWRnZX1cbiAgICAgICAgbXByQXhpc0JvdW5kcz17bXByQXhpc0JvdW5kc31cbiAgICAgICAgbXByQXhpc0RlZz17bXByQXhpc0RlZ31cbiAgICAgICAgbXByQXhpc0RpcmVjdGlvbkxhYmVsPXttcHJBeGlzRGlyZWN0aW9uTGFiZWx9XG4gICAgICAgIG1wckF4aXNHdWlkYW5jZT17bXByQXhpc0d1aWRhbmNlfVxuICAgICAgICBtcHJBeGlzTnVkZ2VEZWc9e21wckF4aXNOdWRnZURlZ31cbiAgICAgICAgbXByQXhpc1ByZXNldERlZz17bXByQXhpc1ByZXNldERlZ31cbiAgICAgICAgbXByQXhpc1JhbmdlVmFsdWU9e21wckF4aXNSYW5nZVZhbHVlfVxuICAgICAgICBtcHJBeGlzVmlzdWFsaXplckxhYmVsPXttcHJBeGlzVmlzdWFsaXplckxhYmVsfVxuICAgICAgICBtcHJBeGlzVmlzdWFsaXplclN0eWxlPXttcHJBeGlzVmlzdWFsaXplclN0eWxlfVxuICAgICAgICBtcHJDbGluaWNhbENoZWNrbGlzdD17bXByQ2xpbmljYWxDaGVja2xpc3R9XG4gICAgICAgIG1wckNsaW5pY2FsTmV4dFN0ZXA9e21wckNsaW5pY2FsTmV4dFN0ZXB9XG4gICAgICAgIG1wckNsaW5pY2FsUHJlc2V0QnV0dG9uQ2xhc3M9e21wckNsaW5pY2FsUHJlc2V0QnV0dG9uQ2xhc3N9XG4gICAgICAgIG1wckNsaW5pY2FsUHJlc2V0cz17bXByQ2xpbmljYWxQcmVzZXRzfVxuICAgICAgICBtcHJDb250cm9sc0F1dG9PcGVuPXttcHJDb250cm9sc0F1dG9PcGVufVxuICAgICAgICBtcHJDb250cm9sc1JlYWR5PXttcHJDb250cm9sc1JlYWR5fVxuICAgICAgICBtcHJDcm9zc2hhaXJFbmFibGVkPXttcHJDcm9zc2hhaXJFbmFibGVkfVxuICAgICAgICBtcHJMaW5rZWRQbGFuZXNFbmFibGVkPXttcHJMaW5rZWRQbGFuZXNFbmFibGVkfVxuICAgICAgICBtcHJOZWFyZXN0Q2xpbmljYWxQcmVzZXQ9e21wck5lYXJlc3RDbGluaWNhbFByZXNldH1cbiAgICAgICAgbXByT3BlcmF0b3JTdW1tYXJ5Q2FyZHM9e21wck9wZXJhdG9yU3VtbWFyeUNhcmRzfVxuICAgICAgICBtcHJQcm9qZWN0aW9uPXttcHJQcm9qZWN0aW9ufVxuICAgICAgICBtcHJQcm9qZWN0aW9uQ29tcGFzcz17bXByUHJvamVjdGlvbkNvbXBhc3N9XG4gICAgICAgIG1wclByb2plY3Rpb25MYWJlbHM9e21wclByb2plY3Rpb25MYWJlbHN9XG4gICAgICAgIG1wclNhZmVTbGljZUluZGV4PXttcHJTYWZlU2xpY2VJbmRleH1cbiAgICAgICAgbXByU2VyaWVzUmVxdWlyZWRQcm9qZWN0aW9uTGFiZWw9e21wclNlcmllc1JlcXVpcmVkUHJvamVjdGlvbkxhYmVsfVxuICAgICAgICBtcHJTbGFiQmFkZ2U9e21wclNsYWJCYWRnZX1cbiAgICAgICAgbXByU2xhYkJvdW5kcz17bXByU2xhYkJvdW5kc31cbiAgICAgICAgbXByU2xhYk1tPXttcHJTbGFiTW19XG4gICAgICAgIG1wclNsYWJOdWRnZU1tPXttcHJTbGFiTnVkZ2VNbX1cbiAgICAgICAgbXByU2xhYlByZXNldE1tPXttcHJTbGFiUHJlc2V0TW19XG4gICAgICAgIG1wclNsYWJSYW5nZVZhbHVlPXttcHJTbGFiUmFuZ2VWYWx1ZX1cbiAgICAgICAgbXByU2xpY2VCYWRnZT17bXByU2xpY2VCYWRnZX1cbiAgICAgICAgbXByU2xpY2VJbmRleEZyb21GcmFjdGlvbj17bXByU2xpY2VJbmRleEZyb21GcmFjdGlvbn1cbiAgICAgICAgbXByU2xpY2VMYWJlbD17bXByU2xpY2VMYWJlbH1cbiAgICAgICAgbXByU2xpY2VNYXhJbmRleD17bXByU2xpY2VNYXhJbmRleH1cbiAgICAgICAgbXByU2xpY2VOdWRnZVN0ZXBzPXttcHJTbGljZU51ZGdlU3RlcHN9XG4gICAgICAgIG1wclNsaWNlUHJlc2V0RnJhY3Rpb25zPXttcHJTbGljZVByZXNldEZyYWN0aW9uc31cbiAgICAgICAgbXByU2xpY2VSYW5nZVZhbHVlPXttcHJTbGljZVJhbmdlVmFsdWV9XG4gICAgICAgIG1wclVuYXZhaWxhYmxlUHJvamVjdGlvbkxhYmVsPXttcHJVbmF2YWlsYWJsZVByb2plY3Rpb25MYWJlbH1cbiAgICAgICAgbXByV2luZG93UHJlc2V0PXttcHJXaW5kb3dQcmVzZXR9XG4gICAgICAgIG1wcldpbmRvd1ByZXNldExhYmVscz17bXByV2luZG93UHJlc2V0TGFiZWxzfVxuICAgICAgICBtcHJXb3JrYmVuY2hEcmFmdFJlc3RvcmVkPXttcHJXb3JrYmVuY2hEcmFmdFJlc3RvcmVkfVxuICAgICAgICBtcHJXb3JrYmVuY2hMb2NhbFNhdmVkQXQ9e21wcldvcmtiZW5jaExvY2FsU2F2ZWRBdH1cbiAgICAgICAgbXByV29ya2JlbmNoU3VtbWFyeVRleHQ9e21wcldvcmtiZW5jaFN1bW1hcnlUZXh0fVxuICAgICAgICByZXNldE1wckNvbnRyb2xzPXtyZXNldE1wckNvbnRyb2xzfVxuICAgICAgICByZXN0b3JlTXByV29ya2JlbmNoTG9jYWxEcmFmdD17cmVzdG9yZU1wcldvcmtiZW5jaExvY2FsRHJhZnR9XG4gICAgICAgIHJldHJ5SW1hZ2luZ1ZpZXdlclNlc3Npb25TYXZlPXtyZXRyeUltYWdpbmdWaWV3ZXJTZXNzaW9uU2F2ZX1cbiAgICAgICAgc2VsZWN0Q3RQbGFubmluZ0ltcGxhbnQ9e3NlbGVjdEN0UGxhbm5pbmdJbXBsYW50fVxuICAgICAgICBzZWxlY3RlZEltYWdpbmdTdHVkeT17c2VsZWN0ZWRJbWFnaW5nU3R1ZHl9XG4gICAgICAgIHNlbGVjdGVkSW1hZ2luZ1ZpZXdlclBsYW49e3NlbGVjdGVkSW1hZ2luZ1ZpZXdlclBsYW59XG4gICAgICAgIHNldEN0UGxhbm5pbmdBY3RpdmVRdWlja0FjdGlvbklkPXtzZXRDdFBsYW5uaW5nQWN0aXZlUXVpY2tBY3Rpb25JZH1cbiAgICAgICAgc2V0Q3RQbGFubmluZ0ltcGxhbnRQbGFuPXtzZXRDdFBsYW5uaW5nSW1wbGFudFBsYW59XG4gICAgICAgIHNldEltYWdpbmdLaW5kRmlsdGVyPXtzZXRJbWFnaW5nS2luZEZpbHRlcn1cbiAgICAgICAgc2V0SW1hZ2luZ1ZpZXdlckFjdGl2ZVRvb2w9e3NldEltYWdpbmdWaWV3ZXJBY3RpdmVUb29sfVxuICAgICAgICBzZXRJbWFnaW5nVmlld2VyTm90ZT17c2V0SW1hZ2luZ1ZpZXdlck5vdGV9XG4gICAgICAgIHNldEltYWdpbmdWaWV3ZXJTdGF0ZT17c2V0SW1hZ2luZ1ZpZXdlclN0YXRlfVxuICAgICAgICBzZXRNcHJBeGlzRGVnPXtzZXRNcHJBeGlzRGVnfVxuICAgICAgICBzZXRNcHJDcm9zc2hhaXJFbmFibGVkPXtzZXRNcHJDcm9zc2hhaXJFbmFibGVkfVxuICAgICAgICBzZXRNcHJMaW5rZWRQbGFuZXNFbmFibGVkPXtzZXRNcHJMaW5rZWRQbGFuZXNFbmFibGVkfVxuICAgICAgICBzZXRNcHJQcm9qZWN0aW9uPXtzZXRNcHJQcm9qZWN0aW9ufVxuICAgICAgICBzZXRNcHJTbGFiTW09e3NldE1wclNsYWJNbX1cbiAgICAgICAgc2V0TXByU2xpY2VJbmRleD17c2V0TXByU2xpY2VJbmRleH1cbiAgICAgICAgc2V0TXByV2luZG93UHJlc2V0PXtzZXRNcHJXaW5kb3dQcmVzZXR9XG4gICAgICAgIHNldFNlbGVjdGVkSW1hZ2luZ1N0dWR5SWQ9e3NldFNlbGVjdGVkSW1hZ2luZ1N0dWR5SWR9XG4gICAgICAgIHZpc2libGVJbWFnaW5nU3R1ZGllcz17dmlzaWJsZUltYWdpbmdTdHVkaWVzfVxuICAgICAgLz5cbiAgICA8L1N1c3BlbnNlPlxuICA8L1dvcmtzcGFjZVJvdXRlRXJyb3JCb3VuZGFyeT5cbikgOiBudWxsfVxuXG5cblxuICAgICAgICB7W1wic2NoZWR1bGVcIiwgXCJwYXRpZW50c1wiLCBcInZpc2l0XCIsIFwiZG9jdW1lbnRzXCIsIFwiZmluYW5jZVwiLCBcImNvbW11bmljYXRpb25zXCJdLmluY2x1ZGVzKGN1cnJlbnRWaWV3KSA/IChcbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwid29yay1ncmlkIHBhZ2UtZ3JpZFwiPlxuICAgICAgICAgIHtjdXJyZW50VmlldyA9PT0gXCJzY2hlZHVsZVwiID8gKFxuICAgICAgICAgIDxXb3Jrc3BhY2VSb3V0ZUVycm9yQm91bmRhcnkgdmlldz1cInNjaGVkdWxlXCIgbGFiZWw9e3ZpZXdMYWJlbHMuc2NoZWR1bGV9IHBhbmVsQ2xhc3NOYW1lPVwicGFuZWwgc2NoZWR1bGUtcGFuZWxcIiBwYW5lbElkPVwic2NoZWR1bGVcIj5cbiAgICAgICAgICAgIDxTdXNwZW5zZVxuICAgICAgICAgICAgICBmYWxsYmFjaz17XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBzY2hlZHVsZS1wYW5lbFwiIGlkPVwic2NoZWR1bGVcIiBhcmlhLWJ1c3k9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyPtCg0LDRgdC/0LjRgdCw0L3QuNC1PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3RhdHVzLXBpbGwgc3RhdHVzLXBsYW5uZWRcIj7Qt9Cw0LPRgNGD0LfQutCwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFNjaGVkdWxlVmlld1xuICAgICAgICAgICAgICAgIGFwcG9pbnRtZW50TGFiZWxzPXthcHBvaW50bWVudExhYmVsc31cbiAgICAgICAgICAgICAgICBhcHBvaW50bWVudFJlYWRpbmVzc0J5SWQ9e2FwcG9pbnRtZW50UmVhZGluZXNzQnlJZH1cbiAgICAgICAgICAgICAgICBhcHBvaW50bWVudFJlYWRpbmVzc0xhYmVscz17YXBwb2ludG1lbnRSZWFkaW5lc3NMYWJlbHN9XG4gICAgICAgICAgICAgICAgYXBwb2ludG1lbnRTY2hlZHVsZURyYWZ0RnJvbUFwcG9pbnRtZW50PXthcHBvaW50bWVudFNjaGVkdWxlRHJhZnRGcm9tQXBwb2ludG1lbnR9XG4gICAgICAgICAgICAgICAgY2xvc2VBcHBvaW50bWVudEVkaXRvcj17Y2xvc2VBcHBvaW50bWVudEVkaXRvcn1cbiAgICAgICAgICAgICAgICBjcmVhdGVBcHBvaW50bWVudEZyb21EcmFmdD17Y3JlYXRlQXBwb2ludG1lbnRGcm9tRHJhZnR9XG4gICAgICAgICAgICAgICAgZGFzaGJvYXJkPXtkYXNoYm9hcmR9XG4gICAgICAgICAgICAgICAgZWRpdGluZ0FwcG9pbnRtZW50SWQ9e2VkaXRpbmdBcHBvaW50bWVudElkfVxuICAgICAgICAgICAgICAgIGZvcm1hdFRpbWU9e2Zvcm1hdFRpbWV9XG4gICAgICAgICAgICAgICAgZnJvbURhdGVUaW1lTG9jYWxWYWx1ZT17ZnJvbURhdGVUaW1lTG9jYWxWYWx1ZX1cbiAgICAgICAgICAgICAgICBsb2NrU2NoZWR1bGVBZG1pblNlc3Npb249eygpID0+IGxvY2tUZWxlZ3JhbUFkbWluU2Vzc2lvbihcInNjaGVkdWxlXCIpfVxuICAgICAgICAgICAgICAgIG5ld0FwcG9pbnRtZW50RXJyb3I9e25ld0FwcG9pbnRtZW50RXJyb3J9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZEFwcG9pbnRtZW50U3RhdHVzPXtub3JtYWxpemVkQXBwb2ludG1lbnRTdGF0dXN9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZEFwcG9pbnRtZW50U3RhdHVzRmlsdGVyPXtub3JtYWxpemVkQXBwb2ludG1lbnRTdGF0dXNGaWx0ZXJ9XG4gICAgICAgICAgICAgICAgb3BlbkFwcG9pbnRtZW50RWRpdG9yPXtvcGVuQXBwb2ludG1lbnRFZGl0b3J9XG4gICAgICAgICAgICAgICAgcGF0aWVudE5hbWU9e3BhdGllbnROYW1lfVxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGVkQWN0aW9uUHJpb3JpdHlMYWJlbHM9e3JlY29tbWVuZGVkQWN0aW9uUHJpb3JpdHlMYWJlbHN9XG4gICAgICAgICAgICAgICAgcmVzZXROZXdBcHBvaW50bWVudERyYWZ0PXtyZXNldE5ld0FwcG9pbnRtZW50RHJhZnR9XG4gICAgICAgICAgICAgICAgc2F2ZUFwcG9pbnRtZW50U2NoZWR1bGU9e3NhdmVBcHBvaW50bWVudFNjaGVkdWxlfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNoaWZ0V2FybmluZ3M9e3NoaWZ0V2FybmluZ3N9XG4gICAgICAgICAgICAgICAgc29ydGVkQXBwb2ludG1lbnRzPXtzb3J0ZWRBcHBvaW50bWVudHN9XG4gICAgICAgICAgICAgICAgc3RhZmZSb2xlTGFiZWxzPXtzdGFmZlJvbGVMYWJlbHN9XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVBZG1pblNlY3JldERyYWZ0PXtzY2hlZHVsZUFkbWluU2VjcmV0RHJhZnR9XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVBZG1pblNlY3JldFNlc3Npb249e3NjaGVkdWxlQWRtaW5TZWNyZXRTZXNzaW9ufVxuICAgICAgICAgICAgICAgIHRvRGF0ZVRpbWVMb2NhbFZhbHVlPXt0b0RhdGVUaW1lTG9jYWxWYWx1ZX1cbiAgICAgICAgICAgICAgICB1bmxvY2tTY2hlZHVsZUFkbWluU2Vzc2lvbj17KCkgPT4gdW5sb2NrVGVsZWdyYW1BZG1pblNlc3Npb24oXCJzY2hlZHVsZVwiKX1cbiAgICAgICAgICAgICAgICB1cGRhdGVBcHBvaW50bWVudFNjaGVkdWxlRHJhZnQ9e3VwZGF0ZUFwcG9pbnRtZW50U2NoZWR1bGVEcmFmdH1cbiAgICAgICAgICAgICAgICB1cGRhdGVOZXdBcHBvaW50bWVudERyYWZ0PXt1cGRhdGVOZXdBcHBvaW50bWVudERyYWZ0fVxuICAgICAgICAgICAgICAgIHZpc2libGVTY2hlZHVsZVN1Z2dlc3Rpb25zPXt2aXNpYmxlU2NoZWR1bGVTdWdnZXN0aW9uc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgICAgPC9Xb3Jrc3BhY2VSb3V0ZUVycm9yQm91bmRhcnk+XG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICB7Y3VycmVudFZpZXcgPT09IFwicGF0aWVudHNcIiA/IChcbiAgICAgICAgICA8V29ya3NwYWNlUm91dGVFcnJvckJvdW5kYXJ5IHZpZXc9XCJwYXRpZW50c1wiIGxhYmVsPXt2aWV3TGFiZWxzLnBhdGllbnRzfSBwYW5lbENsYXNzTmFtZT1cInBhbmVsIHBhdGllbnRzLXBhbmVsXCIgcGFuZWxJZD1cInBhdGllbnRzXCI+XG4gICAgICAgICAgICA8U3VzcGVuc2VcbiAgICAgICAgICAgICAgZmFsbGJhY2s9e1xuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGF0aWVudHMtcGFuZWxcIiBpZD1cInBhdGllbnRzXCIgYXJpYS1idXN5PVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMj7QkdGL0YHRgtGA0YvQuSDQv9C+0LjRgdC6PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3RhdHVzLXBpbGwgc3RhdHVzLXBsYW5uZWRcIj7Qt9Cw0LPRgNGD0LfQutCwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFBhdGllbnRzVmlld1xuICAgICAgICAgICAgICAgIGNyZWF0ZVBhdGllbnQ9e2NyZWF0ZVBhdGllbnR9XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRQYXRpZW50cz17ZmlsdGVyZWRQYXRpZW50c31cbiAgICAgICAgICAgICAgICBtb25leT17bW9uZXl9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplT3B0aW9uYWxXb3JraW5nRGF5c0RyYWZ0PXtub3JtYWxpemVPcHRpb25hbFdvcmtpbmdEYXlzRHJhZnR9XG4gICAgICAgICAgICAgICAgcGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZVZhbGlkYXRpb25NZXNzYWdlPXtwYXRpZW50QWRtaW5pc3RyYXRpdmVQcm9maWxlVmFsaWRhdGlvbk1lc3NhZ2V9XG4gICAgICAgICAgICAgICAgcGF0aWVudEluc2lnaHRCeUlkPXtwYXRpZW50SW5zaWdodEJ5SWR9XG4gICAgICAgICAgICAgICAgcGF0aWVudEluc2lnaHRSaXNrTGFiZWxzPXtwYXRpZW50SW5zaWdodFJpc2tMYWJlbHN9XG4gICAgICAgICAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICAgICAgICAgIHNhdmVQYXRpZW50QWRtaW5pc3RyYXRpdmVQcm9maWxlPXtzYXZlUGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZX1cbiAgICAgICAgICAgICAgICBzYXZlUGF0aWVudENvcmU9e3NhdmVQYXRpZW50Q29yZX1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFBhdGllbnQ9e3NlbGVjdGVkUGF0aWVudH1cbiAgICAgICAgICAgICAgICBzZXRRdWVyeT17c2V0UXVlcnl9XG4gICAgICAgICAgICAgICAgdXBkYXRlUGF0aWVudEFkbWluaXN0cmF0aXZlUHJvZmlsZURyYWZ0PXt1cGRhdGVQYXRpZW50QWRtaW5pc3RyYXRpdmVQcm9maWxlRHJhZnR9XG4gICAgICAgICAgICAgICAgdXBkYXRlUGF0aWVudENvcmVEcmFmdD17dXBkYXRlUGF0aWVudENvcmVEcmFmdH1cbiAgICAgICAgICAgICAgICB3ZWVrZGF5T3B0aW9ucz17d2Vla2RheU9wdGlvbnN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgIDwvV29ya3NwYWNlUm91dGVFcnJvckJvdW5kYXJ5PlxuXG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICB7Y3VycmVudFZpZXcgPT09IFwidmlzaXRcIiA/IChcbiAgPFdvcmtzcGFjZVJvdXRlRXJyb3JCb3VuZGFyeSB2aWV3PVwidmlzaXRcIiBsYWJlbD17dmlld0xhYmVscy52aXNpdH0gcGFuZWxDbGFzc05hbWU9XCJwYW5lbCB2aXNpdC1wYW5lbFwiIHBhbmVsSWQ9XCJ2aXNpdFwiPlxuICAgIDxTdXNwZW5zZVxuICAgICAgZmFsbGJhY2s9e1xuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHZpc2l0LXBhbmVsXCIgaWQ9XCJ2aXNpdFwiIGFyaWEtYnVzeT1cInRydWVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxoMj7QotC10LrRg9GJ0LjQuSDQv9GA0LjQtdC8PC9oMj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN0YXR1cy1waWxsIHN0YXR1cy1wbGFubmVkXCI+0LfQsNCz0YDRg9C30LrQsDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICB9XG4gICAgPlxuICAgICAgPFZpc2l0Vmlld1xuICAgICAgICBBbGVydFRyaWFuZ2xlPXtBbGVydFRyaWFuZ2xlfVxuICAgICAgICBCb3Q9e0JvdH1cbiAgICAgICAgQ2hlY2s9e0NoZWNrfVxuICAgICAgICBDaGVja0NpcmNsZTI9e0NoZWNrQ2lyY2xlMn1cbiAgICAgICAgQ2xpbmljYWxSdWxlUGFuZWw9e0NsaW5pY2FsUnVsZVBhbmVsfVxuICAgICAgICBDbGlwYm9hcmRDaGVjaz17Q2xpcGJvYXJkQ2hlY2t9XG4gICAgICAgIE1pYz17TWljfVxuICAgICAgICBTcGFya2xlcz17U3BhcmtsZXN9XG4gICAgICAgIGFjY2VwdERyYWZ0VG9WaXNpdD17YWNjZXB0RHJhZnRUb1Zpc2l0fVxuICAgICAgICBhY3RpdmVBcHBvaW50bWVudD17YWN0aXZlQXBwb2ludG1lbnR9XG4gICAgICAgIGFjdGl2ZUNoYWlyPXthY3RpdmVDaGFpcn1cbiAgICAgICAgYWN0aXZlRG9jdG9yPXthY3RpdmVEb2N0b3J9XG4gICAgICAgIGFjdGl2ZUltYWdpbmdTdHVkaWVzPXthY3RpdmVJbWFnaW5nU3R1ZGllc31cbiAgICAgICAgYWN0aXZlUGF0aWVudD17YWN0aXZlUGF0aWVudH1cbiAgICAgICAgYWN0aXZlUGF0aWVudEluc2lnaHQ9e2FjdGl2ZVBhdGllbnRJbnNpZ2h0fVxuICAgICAgICBhY3RpdmVVc2FibGVEb2N1bWVudHM9e2FjdGl2ZVVzYWJsZURvY3VtZW50c31cbiAgICAgICAgYWN0aXZlVmlzaXRDbGluaWNhbFJ1bGVFdmFsdWF0aW9ucz17YWN0aXZlVmlzaXRDbGluaWNhbFJ1bGVFdmFsdWF0aW9uc31cbiAgICAgICAgYWN0aXZlVmlzaXRDbGluaWNhbFJ1bGVTdW1tYXJ5PXthY3RpdmVWaXNpdENsaW5pY2FsUnVsZVN1bW1hcnl9XG4gICAgICAgIGFwcGVuZFRvVHJhbnNjcmlwdD17YXBwZW5kVG9UcmFuc2NyaXB0fVxuICAgICAgICBhcHBseVByb3RvY29sVGVtcGxhdGU9e2FwcGx5UHJvdG9jb2xUZW1wbGF0ZX1cbiAgICAgICAgYnVpbGREcmFmdD17YnVpbGREcmFmdH1cbiAgICAgICAgYnVpbGRPZmZsaW5lRHJhZnQ9e2J1aWxkT2ZmbGluZURyYWZ0fVxuICAgICAgICBjbGVhclRyYW5zY3JpcHRXaXRoVW5kbz17Y2xlYXJUcmFuc2NyaXB0V2l0aFVuZG99XG4gICAgICAgIGNsZWFyZWRUcmFuc2NyaXB0U25hcHNob3Q9e2NsZWFyZWRUcmFuc2NyaXB0U25hcHNob3R9XG4gICAgICAgIGNsaW5pY2FsUnVsZUFjdGlvbkxhYmVscz17Y2xpbmljYWxSdWxlQWN0aW9uTGFiZWxzfVxuICAgICAgICBjbGluaWNhbFJ1bGVTZXZlcml0eUxhYmVscz17Y2xpbmljYWxSdWxlU2V2ZXJpdHlMYWJlbHN9XG4gICAgICAgIGRhc2hib2FyZD17ZGFzaGJvYXJkfVxuICAgICAgICBkaWN0YXRpb25RdWlja1BocmFzZXM9e2RpY3RhdGlvblF1aWNrUGhyYXNlc31cbiAgICAgICAgZHJhZnQ9e2RyYWZ0fVxuICAgICAgICBlbXB0eURpY3RhdGlvblZvaWNlQWN0aW9uTGFiZWw9e2VtcHR5RGljdGF0aW9uVm9pY2VBY3Rpb25MYWJlbH1cbiAgICAgICAgZmx1c2hQZW5kaW5nU3BlZWNoQ2h1bmtzPXtmbHVzaFBlbmRpbmdTcGVlY2hDaHVua3N9XG4gICAgICAgIGZsdXNoUGVuZGluZ1Zpc2l0U2F2ZXM9e2ZsdXNoUGVuZGluZ1Zpc2l0U2F2ZXN9XG4gICAgICAgIGZvcm1hdFRpbWU9e2Zvcm1hdFRpbWV9XG4gICAgICAgIGhhc1Zpc2l0VHJhbnNjcmlwdFRleHQ9e2hhc1Zpc2l0VHJhbnNjcmlwdFRleHR9XG4gICAgICAgIGltYWdpbmdLaW5kTGFiZWxzPXtpbWFnaW5nS2luZExhYmVsc31cbiAgICAgICAgaXNEcmFmdEFjY2VwdGluZz17aXNEcmFmdEFjY2VwdGluZ31cbiAgICAgICAgaXNEcmFmdExvYWRpbmc9e2lzRHJhZnRMb2FkaW5nfVxuICAgICAgICBpc09ubGluZT17aXNPbmxpbmV9XG4gICAgICAgIGlzUGVuZGluZ1Zpc2l0U3luY2luZz17aXNQZW5kaW5nVmlzaXRTeW5jaW5nfVxuICAgICAgICBpc1NlcnZlclZvaWNlUmVjb3JkaW5nPXtpc1NlcnZlclZvaWNlUmVjb3JkaW5nfVxuICAgICAgICBpc1RyYW5zY3JpcHRQb2xpc2hpbmc9e2lzVHJhbnNjcmlwdFBvbGlzaGluZ31cbiAgICAgICAgaXNWaXNpdERpY3RhdGluZz17aXNWaXNpdERpY3RhdGluZ31cbiAgICAgICAgaXNWaXNpdE5vdGVEaXJ0eT17aXNWaXNpdE5vdGVEaXJ0eX1cbiAgICAgICAgbGFzdExvY2FsU2F2ZWRBdD17bGFzdExvY2FsU2F2ZWRBdH1cbiAgICAgICAgbGFzdFBlbmRpbmdWaXNpdFNhdmVBdD17bGFzdFBlbmRpbmdWaXNpdFNhdmVBdH1cbiAgICAgICAgbGFzdFNlcnZlckRyYWZ0U2F2ZWRBdD17bGFzdFNlcnZlckRyYWZ0U2F2ZWRBdH1cbiAgICAgICAgbGFzdFZpc2l0U2F2ZVJlY2VpcHQ9e2xhc3RWaXNpdFNhdmVSZWNlaXB0fVxuICAgICAgICBsb2NhbERyYWZ0V2FzUmVzdG9yZWQ9e2xvY2FsRHJhZnRXYXNSZXN0b3JlZH1cbiAgICAgICAgb3BlblZpc2l0V2FybmluZ0FjdGlvbj17b3BlblZpc2l0V2FybmluZ0FjdGlvbn1cbiAgICAgICAgcGVuZGluZ1NwZWVjaENodW5rQ291bnQ9e3BlbmRpbmdTcGVlY2hDaHVua0NvdW50fVxuICAgICAgICBwZW5kaW5nU3BlZWNoRmx1c2hBY3Rpb25MYWJlbD17cGVuZGluZ1NwZWVjaEZsdXNoQWN0aW9uTGFiZWx9XG4gICAgICAgIHBlbmRpbmdTcGVlY2hGbHVzaEFjdGlvblRpdGxlPXtwZW5kaW5nU3BlZWNoRmx1c2hBY3Rpb25UaXRsZX1cbiAgICAgICAgcGVuZGluZ1Zpc2l0U2F2ZUNvdW50PXtwZW5kaW5nVmlzaXRTYXZlQ291bnR9XG4gICAgICAgIHBvbGlzaFRyYW5zY3JpcHQ9e3BvbGlzaFRyYW5zY3JpcHR9XG4gICAgICAgIHBvbGlzaGluZ0ZpZWxkPXtwb2xpc2hpbmdGaWVsZH1cbiAgICAgICAgcG9saXNoU2luZ2xlRmllbGQ9e3BvbGlzaFNpbmdsZUZpZWxkfVxuICAgICAgICBwcmltYXJ5VmlzaXRXYXJuaW5nPXtwcmltYXJ5VmlzaXRXYXJuaW5nfVxuICAgICAgICBzY3JvbGxUb1Zpc2l0QXJlYT17c2Nyb2xsVG9WaXNpdEFyZWF9XG4gICAgICAgIHNlbGVjdGVkUHJvdG9jb2xUZW1wbGF0ZT17c2VsZWN0ZWRQcm90b2NvbFRlbXBsYXRlfVxuICAgICAgICBzZWxlY3RlZFNwZWNpYWx0eT17c2VsZWN0ZWRTcGVjaWFsdHl9XG4gICAgICAgIHNlcnZlckRyYWZ0U3luY1N0YXRlPXtzZXJ2ZXJEcmFmdFN5bmNTdGF0ZX1cbiAgICAgICAgc2VydmljZVRpdGxlPXtzZXJ2aWNlVGl0bGV9XG4gICAgICAgIHNldENsZWFyZWRUcmFuc2NyaXB0U25hcHNob3Q9e3NldENsZWFyZWRUcmFuc2NyaXB0U25hcHNob3R9XG4gICAgICAgIHNldFNlbGVjdGVkUHJvdG9jb2xJZD17c2V0U2VsZWN0ZWRQcm90b2NvbElkfVxuICAgICAgICBzZXRTZWxlY3RlZFNwZWNpYWx0eT17c2V0U2VsZWN0ZWRTcGVjaWFsdHl9XG4gICAgICAgIHNldFRyYW5zY3JpcHQ9e3NldFRyYW5zY3JpcHR9XG4gICAgICAgIHNwZWNpYWx0aWVzV2l0aFRlbXBsYXRlcz17c3BlY2lhbHRpZXNXaXRoVGVtcGxhdGVzfVxuICAgICAgICBzcGVjaWFsdHlMYWJlbHM9e3NwZWNpYWx0eUxhYmVsc31cbiAgICAgICAgc3BlY2lhbHR5UHJvdG9jb2xUZW1wbGF0ZXM9e3NwZWNpYWx0eVByb3RvY29sVGVtcGxhdGVzfVxuICAgICAgICBzcGVlY2hHYXRld2F5QWN0aXZlUHJvdmlkZXJJc0xvY2FsPXtzcGVlY2hHYXRld2F5QWN0aXZlUHJvdmlkZXJJc0xvY2FsfVxuICAgICAgICBzcGVlY2hHYXRld2F5U3RhdHVzPXtzcGVlY2hHYXRld2F5U3RhdHVzfVxuICAgICAgICBzcGVlY2hSZWNvZ25pdGlvblJlYWR5PXtzcGVlY2hSZWNvZ25pdGlvblJlYWR5fVxuICAgICAgICBzcGVlY2hTdGF0dXNOb3RlPXtzcGVlY2hTdGF0dXNOb3RlfVxuICAgICAgICBzcGVlY2hUcmFuc2NyaXB0aW9uQnVzeT17c3BlZWNoVHJhbnNjcmlwdGlvbkJ1c3l9XG4gICAgICAgIHN0YWZmUm9sZUxhYmVscz17c3RhZmZSb2xlTGFiZWxzfVxuICAgICAgICBzdGFydFNlcnZlclZvaWNlUmVjb3JkaW5nPXtzdGFydFNlcnZlclZvaWNlUmVjb3JkaW5nfVxuICAgICAgICBzdGFydFZpc2l0RGljdGF0aW9uPXtzdGFydFZpc2l0RGljdGF0aW9ufVxuICAgICAgICBzdG9wU2VydmVyVm9pY2VSZWNvcmRpbmc9e3N0b3BTZXJ2ZXJWb2ljZVJlY29yZGluZ31cbiAgICAgICAgdG9vdGhSb3dzPXt0b290aFJvd3N9XG4gICAgICAgIHRvb3RoU3RhdGVCeUNvZGU9e3Rvb3RoU3RhdGVCeUNvZGV9XG4gICAgICAgIHNldFRvb3RoU3RhdGU9e3NldFRvb3RoU3RhdGV9XG4gICAgICAgIHRyYW5zY3JpcHQ9e3RyYW5zY3JpcHR9XG4gICAgICAgIHVuZG9UcmFuc2NyaXB0Q2xlYXI9e3VuZG9UcmFuc2NyaXB0Q2xlYXJ9XG4gICAgICAgIHVwZGF0ZVZpc2l0Tm90ZUZpZWxkPXt1cGRhdGVWaXNpdE5vdGVGaWVsZH1cbiAgICAgICAgdmlzaWJsZVZpc2l0U3BlY2lhbHR5Rm9jdXNPcHRpb25zPXt2aXNpYmxlVmlzaXRTcGVjaWFsdHlGb2N1c09wdGlvbnN9XG4gICAgICAgIHZpc2l0Q2xvc2VDaGVja2xpc3Q9e3Zpc2l0Q2xvc2VDaGVja2xpc3R9XG4gICAgICAgIHZpc2l0RHJhZnRCdWlsZE1pc3NpbmdTdGVwcz17dmlzaXREcmFmdEJ1aWxkTWlzc2luZ1N0ZXBzfVxuICAgICAgICB2aXNpdERyYWZ0TWlzc2luZ0ZpZWxkTGFiZWw9e3Zpc2l0RHJhZnRNaXNzaW5nRmllbGRMYWJlbH1cbiAgICAgICAgdmlzaXREcmFmdFF1YWxpdHlMYWJlbHM9e3Zpc2l0RHJhZnRRdWFsaXR5TGFiZWxzfVxuICAgICAgICB2aXNpdERyYWZ0UmVhZHlUb0J1aWxkPXt2aXNpdERyYWZ0UmVhZHlUb0J1aWxkfVxuICAgICAgICB2aXNpdERyYWZ0U2lnbmFsTGFiZWw9e3Zpc2l0RHJhZnRTaWduYWxMYWJlbH1cbiAgICAgICAgdmlzaXREcmFmdFVzZXJFZGl0ZWRSZWY9e3Zpc2l0RHJhZnRVc2VyRWRpdGVkUmVmfVxuICAgICAgICB2aXNpdE5vdGVBY2NlcHRNaXNzaW5nU3RlcHM9e3Zpc2l0Tm90ZUFjY2VwdE1pc3NpbmdTdGVwc31cbiAgICAgICAgdmlzaXROb3RlQWN0aW9uTGFiZWw9e3Zpc2l0Tm90ZUFjdGlvbkxhYmVsfVxuICAgICAgICB2aXNpdE5vdGVGaWVsZERlZmluaXRpb25zPXt2aXNpdE5vdGVGaWVsZERlZmluaXRpb25zfVxuICAgICAgICB2aXNpdE5vdGVGb3JtPXt2aXNpdE5vdGVGb3JtfVxuICAgICAgICB2aXNpdE5vdGVSZWFkeVRvQWNjZXB0PXt2aXNpdE5vdGVSZWFkeVRvQWNjZXB0fVxuICAgICAgICB2aXNpdE5vdGVTdGF0dXNMYWJlbD17dmlzaXROb3RlU3RhdHVzTGFiZWx9XG4gICAgICAgIHZpc2l0UHJpbWFyeUFjdGlvbj17dmlzaXRQcmltYXJ5QWN0aW9ufVxuICAgICAgICB2aXNpdFNhZmV0eUNhcmRzPXt2aXNpdFNhZmV0eUNhcmRzfVxuICAgICAgICB2aXNpdFNhdmVSZWNlaXB0VGV4dD17dmlzaXRTYXZlUmVjZWlwdFRleHR9XG4gICAgICAgIHZpc2l0V2FybmluZ3M9e3Zpc2l0V2FybmluZ3N9XG4gICAgICAgIHZpc2l0V29ya2Zsb3dTdGVwcz17dmlzaXRXb3JrZmxvd1N0ZXBzfVxuICAgICAgICBzZWxlY3RlZFdvcmtzcGFjZVJvbGU9e3NlbGVjdGVkV29ya3NwYWNlUm9sZX1cbiAgICAgIC8+XG4gICAgPC9TdXNwZW5zZT5cbiAgPC9Xb3Jrc3BhY2VSb3V0ZUVycm9yQm91bmRhcnk+XG4pIDogbnVsbH1cblxue2N1cnJlbnRWaWV3ID09PSBcImRvY3VtZW50c1wiID8gKFxuICAgICAgICAgICAgPFdvcmtzcGFjZVJvdXRlRXJyb3JCb3VuZGFyeSB2aWV3PVwiZG9jdW1lbnRzXCIgbGFiZWw9e3ZpZXdMYWJlbHMuZG9jdW1lbnRzfSBwYW5lbENsYXNzTmFtZT1cInBhbmVsIGRvY3VtZW50cy1wYW5lbFwiIHBhbmVsSWQ9XCJkb2N1bWVudHNcIj5cbiAgICAgICAgICAgIDxTdXNwZW5zZVxuICAgICAgICAgICAgICBmYWxsYmFjaz17XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBkb2N1bWVudHMtcGFuZWxcIiBpZD1cImRvY3VtZW50c1wiIGFyaWEtYnVzeT1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8aDI+0JTQvtC60YPQvNC10L3RgtGLINC4INGB0L7Qs9C70LDRgdC40Y88L2gyPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzdGF0dXMtcGlsbCBzdGF0dXMtcGxhbm5lZFwiPtC30LDQs9GA0YPQt9C60LA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RG9jdW1lbnRzVmlld1xuICAgICAgICAgICAgICAgIGFjdGl2ZUFwcG9pbnRtZW50PXthY3RpdmVBcHBvaW50bWVudH1cbiAgICAgICAgICAgICAgICBhY3RpdmVEb2N0b3I9e2FjdGl2ZURvY3Rvcn1cbiAgICAgICAgICAgICAgICBhY3RpdmVEb2N1bWVudHM9e2FjdGl2ZURvY3VtZW50c31cbiAgICAgICAgICAgICAgICBhY3RpdmVJc3N1ZWRQYWlkQ29udHJhY3RzPXthY3RpdmVJc3N1ZWRQYWlkQ29udHJhY3RzfVxuICAgICAgICAgICAgICAgIGFjdGl2ZVBhdGllbnQ9e2FjdGl2ZVBhdGllbnR9XG4gICAgICAgICAgICAgICAgYWN0aXZlVXNhYmxlRG9jdW1lbnRzPXthY3RpdmVVc2FibGVEb2N1bWVudHN9XG4gICAgICAgICAgICAgICAgYXBwbHlQb3N0VmlzaXRDYXJlUHJlc2V0PXthcHBseVBvc3RWaXNpdENhcmVQcmVzZXR9XG4gICAgICAgICAgICAgICAgY2hhbmdlUG9zdFZpc2l0Q2FyZVRvcGljPXtjaGFuZ2VQb3N0VmlzaXRDYXJlVG9waWN9XG4gICAgICAgICAgICAgICAgY2xpbmljUHJvZmlsZURyYWZ0PXtjbGluaWNQcm9maWxlRHJhZnR9XG4gICAgICAgICAgICAgICAgY29tcGFjdERvY3VtZW50VGV4dD17Y29tcGFjdERvY3VtZW50VGV4dH1cbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRBY3RDb250cmFjdFJlZmVyZW5jZUZvclVpPXtjb21wbGV0ZWRBY3RDb250cmFjdFJlZmVyZW5jZUZvclVpfVxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZEFjdEZpc2NhbFJlY2VpcHRMaW5lcz17Y29tcGxldGVkQWN0RmlzY2FsUmVjZWlwdExpbmVzfVxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZEFjdFBhaWRSdWJWYWx1ZT17Y29tcGxldGVkQWN0UGFpZFJ1YlZhbHVlfVxuICAgICAgICAgICAgICAgIGNvbmZpcm1Eb2N1bWVudElzc3VlPXtjb25maXJtRG9jdW1lbnRJc3N1ZX1cbiAgICAgICAgICAgICAgICBjb25maXJtRG9jdW1lbnRWb2lkPXtjb25maXJtRG9jdW1lbnRWb2lkfVxuICAgICAgICAgICAgICAgIGNyZWF0ZURvY3VtZW50PXtjcmVhdGVEb2N1bWVudH1cbiAgICAgICAgICAgICAgICBkYXNoYm9hcmQ9e2Rhc2hib2FyZH1cbiAgICAgICAgICAgICAgICBkb2N1bWVudEFjdGlvbkxhYmVscz17ZG9jdW1lbnRBY3Rpb25MYWJlbHN9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRJc3N1ZUF0dGVzdGF0aW9uUmVhZHk9e2RvY3VtZW50SXNzdWVBdHRlc3RhdGlvblJlYWR5fVxuICAgICAgICAgICAgICAgIGRvY3VtZW50SXNzdWVDb25maXJtYXRpb249e2RvY3VtZW50SXNzdWVDb25maXJtYXRpb259XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRJc3N1ZVNpZ25hdHVyZU1vZGVMYWJlbHM9e2RvY3VtZW50SXNzdWVTaWduYXR1cmVNb2RlTGFiZWxzfVxuICAgICAgICAgICAgICAgIGRvY3VtZW50TGFiZWxzPXtkb2N1bWVudExhYmVsc31cbiAgICAgICAgICAgICAgICBkb2N1bWVudFBhdGllbnQ9e2RvY3VtZW50UGF0aWVudH1cbiAgICAgICAgICAgICAgICBkb2N1bWVudFNvdXJjZVN0YXR1c0NsYXNzTmFtZXM9e2RvY3VtZW50U291cmNlU3RhdHVzQ2xhc3NOYW1lc31cbiAgICAgICAgICAgICAgICBkb2N1bWVudFN0YXR1c0xhYmVscz17ZG9jdW1lbnRTdGF0dXNMYWJlbHN9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRWb2lkQ29uZmlybWF0aW9uPXtkb2N1bWVudFZvaWRDb25maXJtYXRpb259XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRWb2lkUmVhZHk9e2RvY3VtZW50Vm9pZFJlYWR5fVxuICAgICAgICAgICAgICAgIGRvY3VtZW50Vm9pZFJlYXNvbkxhYmVscz17ZG9jdW1lbnRWb2lkUmVhc29uTGFiZWxzfVxuICAgICAgICAgICAgICAgIGRvd25sb2FkSXNzdWVkRG9jdW1lbnRIdG1sPXtkb3dubG9hZElzc3VlZERvY3VtZW50SHRtbH1cbiAgICAgICAgICAgICAgICBkb3dubG9hZElzc3VlZERvY3VtZW50UGRmPXtkb3dubG9hZElzc3VlZERvY3VtZW50UGRmfVxuICAgICAgICAgICAgICAgIGRvd25sb2FkVGF4RG9jdW1lbnRYbWw9e2Rvd25sb2FkVGF4RG9jdW1lbnRYbWx9XG4gICAgICAgICAgICAgICAgZWxpZ2libGVQYXltZW50UmVjZWlwdFBheW1lbnRzPXtlbGlnaWJsZVBheW1lbnRSZWNlaXB0UGF5bWVudHN9XG4gICAgICAgICAgICAgICAgZWxpZ2libGVSZWZ1bmRDb3JyZWN0aW9uUGF5bWVudHM9e2VsaWdpYmxlUmVmdW5kQ29ycmVjdGlvblBheW1lbnRzfVxuICAgICAgICAgICAgICAgIGVsaWdpYmxlVGF4UGF5bWVudHM9e2VsaWdpYmxlVGF4UGF5bWVudHN9XG4gICAgICAgICAgICAgICAgZm9ybWF0RGF0ZVRpbWU9e2Zvcm1hdERhdGVUaW1lfVxuICAgICAgICAgICAgICAgIGZvcm1hdFNob3J0RGF0ZT17Zm9ybWF0U2hvcnREYXRlfVxuICAgICAgICAgICAgICAgIGluZmVycmVkVHJlYXRtZW50QXJlYT17aW5mZXJyZWRUcmVhdG1lbnRBcmVhfVxuICAgICAgICAgICAgICAgIGluc3RhbGxtZW50U2NoZWR1bGVCYXNlRG9jdW1lbnRUaXRsZVZhbHVlPXtpbnN0YWxsbWVudFNjaGVkdWxlQmFzZURvY3VtZW50VGl0bGVWYWx1ZX1cbiAgICAgICAgICAgICAgICBpbnN0YWxsbWVudFNjaGVkdWxlSW5zdGFsbG1lbnRSb3dzPXtpbnN0YWxsbWVudFNjaGVkdWxlSW5zdGFsbG1lbnRSb3dzfVxuICAgICAgICAgICAgICAgIGluc3RhbGxtZW50U2NoZWR1bGVQcmVwYWlkUnViVmFsdWU9e2luc3RhbGxtZW50U2NoZWR1bGVQcmVwYWlkUnViVmFsdWV9XG4gICAgICAgICAgICAgICAgaW5zdGFsbG1lbnRTY2hlZHVsZVJlbWFpbmluZ1J1YlZhbHVlPXtpbnN0YWxsbWVudFNjaGVkdWxlUmVtYWluaW5nUnViVmFsdWV9XG4gICAgICAgICAgICAgICAgaW5zdGFsbG1lbnRTY2hlZHVsZVRvdGFsUnViVmFsdWU9e2luc3RhbGxtZW50U2NoZWR1bGVUb3RhbFJ1YlZhbHVlfVxuICAgICAgICAgICAgICAgIGlzc3VlZE1lZGljYWxDb3B5UmVxdWVzdERvY3VtZW50cz17aXNzdWVkTWVkaWNhbENvcHlSZXF1ZXN0RG9jdW1lbnRzfVxuICAgICAgICAgICAgICAgIGxvYWREb2N1bWVudEF1ZGl0RmFjdHM9e2xvYWREb2N1bWVudEF1ZGl0RmFjdHN9XG4gICAgICAgICAgICAgICAgbWFya1Bvc3RWaXNpdE1hbnVhbEVkaXRlZD17bWFya1Bvc3RWaXNpdE1hbnVhbEVkaXRlZH1cbiAgICAgICAgICAgICAgICBtZWRpY2FsRG9jdW1lbnRSZWxlYXNlQ2hhbm5lbExhYmVscz17bWVkaWNhbERvY3VtZW50UmVsZWFzZUNoYW5uZWxMYWJlbHN9XG4gICAgICAgICAgICAgICAgbWlub3JDb25zZW50RGlhZ25vc2lzT3JJbmRpY2F0aW9uVmFsdWU9e21pbm9yQ29uc2VudERpYWdub3Npc09ySW5kaWNhdGlvblZhbHVlfVxuICAgICAgICAgICAgICAgIG1pbm9yQ29uc2VudEludGVydmVudGlvblNjb3BlVmFsdWU9e21pbm9yQ29uc2VudEludGVydmVudGlvblNjb3BlVmFsdWV9XG4gICAgICAgICAgICAgICAgbWlub3JDb25zZW50UGF0aWVudEJpcnRoRGF0ZVZhbHVlPXttaW5vckNvbnNlbnRQYXRpZW50QmlydGhEYXRlVmFsdWV9XG4gICAgICAgICAgICAgICAgbWlub3JDb25zZW50UGF0aWVudEZ1bGxOYW1lVmFsdWU9e21pbm9yQ29uc2VudFBhdGllbnRGdWxsTmFtZVZhbHVlfVxuICAgICAgICAgICAgICAgIG1pbm9yUmVwcmVzZW50YXRpdmVGdWxsTmFtZVZhbHVlPXttaW5vclJlcHJlc2VudGF0aXZlRnVsbE5hbWVWYWx1ZX1cbiAgICAgICAgICAgICAgICBtaW5vclJlcHJlc2VudGF0aXZlSWRlbnRpdHlEb2N1bWVudFZhbHVlPXttaW5vclJlcHJlc2VudGF0aXZlSWRlbnRpdHlEb2N1bWVudFZhbHVlfVxuICAgICAgICAgICAgICAgIG1pbm9yUmVwcmVzZW50YXRpdmVQaG9uZVZhbHVlPXttaW5vclJlcHJlc2VudGF0aXZlUGhvbmVWYWx1ZX1cbiAgICAgICAgICAgICAgICBtaW5vclJlcHJlc2VudGF0aXZlUmVsYXRpb25zaGlwVmFsdWU9e21pbm9yUmVwcmVzZW50YXRpdmVSZWxhdGlvbnNoaXBWYWx1ZX1cbiAgICAgICAgICAgICAgICBtb25leT17bW9uZXl9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZERvY3VtZW50SXNzdWVTaWduYXR1cmVNb2RlPXtub3JtYWxpemVkRG9jdW1lbnRJc3N1ZVNpZ25hdHVyZU1vZGV9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZERvY3VtZW50S2luZD17bm9ybWFsaXplZERvY3VtZW50S2luZH1cbiAgICAgICAgICAgICAgICBub3JtYWxpemVkRG9jdW1lbnRWb2lkUmVhc29uQ29kZT17bm9ybWFsaXplZERvY3VtZW50Vm9pZFJlYXNvbkNvZGV9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZE1lZGljYWxEb2N1bWVudFJlbGVhc2VDaGFubmVsPXtub3JtYWxpemVkTWVkaWNhbERvY3VtZW50UmVsZWFzZUNoYW5uZWx9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZE91dHBhdGllbnQwMjV1RGVtb2dyYXBoaWNDb2RlPXtub3JtYWxpemVkT3V0cGF0aWVudDAyNXVEZW1vZ3JhcGhpY0NvZGV9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFBhdGllbnRJbnRha2VQcmVnbmFuY3lTdGF0dXM9e25vcm1hbGl6ZWRQYXRpZW50SW50YWtlUHJlZ25hbmN5U3RhdHVzfVxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQYXltZW50UmVmdW5kQ29ycmVjdGlvbkFjdGlvbj17bm9ybWFsaXplZFBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uQWN0aW9ufVxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQYXltZW50UmVmdW5kQ29ycmVjdGlvbk1ldGhvZD17bm9ybWFsaXplZFBheW1lbnRSZWZ1bmRDb3JyZWN0aW9uTWV0aG9kfVxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQb3N0VmlzaXRDYXJlVG9waWM9e25vcm1hbGl6ZWRQb3N0VmlzaXRDYXJlVG9waWN9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb2NlZHVyZVNwZWNpZmljQ29uc2VudFByb2NlZHVyZT17bm9ybWFsaXplZFByb2NlZHVyZVNwZWNpZmljQ29uc2VudFByb2NlZHVyZX1cbiAgICAgICAgICAgICAgICBub3JtYWxpemVkVGF4QXBwbGljYXRpb25EZWxpdmVyeUNoYW5uZWw9e25vcm1hbGl6ZWRUYXhBcHBsaWNhdGlvbkRlbGl2ZXJ5Q2hhbm5lbH1cbiAgICAgICAgICAgICAgICBub3JtYWxpemVkVGF4QXBwbGljYXRpb25Gb3JtPXtub3JtYWxpemVkVGF4QXBwbGljYXRpb25Gb3JtfVxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRUYXhBcHBsaWNhdGlvblJlbGF0aW9uc2hpcFNlbGVjdD17bm9ybWFsaXplZFRheEFwcGxpY2F0aW9uUmVsYXRpb25zaGlwU2VsZWN0fVxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRUcmVhdG1lbnRQbGFuQWNjZXB0YW5jZVZhcmlhbnQ9e25vcm1hbGl6ZWRUcmVhdG1lbnRQbGFuQWNjZXB0YW5jZVZhcmlhbnR9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFhyYXlQcmVnbmFuY3lTdGF0dXM9e25vcm1hbGl6ZWRYcmF5UHJlZ25hbmN5U3RhdHVzfVxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRYcmF5UHJpb3JpdHk9e25vcm1hbGl6ZWRYcmF5UHJpb3JpdHl9XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFhyYXlTdHVkeVR5cGU9e25vcm1hbGl6ZWRYcmF5U3R1ZHlUeXBlfVxuICAgICAgICAgICAgICAgIG9wZW5Jc3N1ZWREb2N1bWVudEh0bWw9e29wZW5Jc3N1ZWREb2N1bWVudEh0bWx9XG4gICAgICAgICAgICAgICAgb3V0cGF0aWVudDAyNXVNZWRpY2FsQ2FyZE51bWJlclZhbHVlPXtvdXRwYXRpZW50MDI1dU1lZGljYWxDYXJkTnVtYmVyVmFsdWV9XG4gICAgICAgICAgICAgICAgcGFpZENvbnRyYWN0VG90YWxSdWJWYWx1ZT17cGFpZENvbnRyYWN0VG90YWxSdWJWYWx1ZX1cbiAgICAgICAgICAgICAgICBwYXRpZW50SW50YWtlUHJlZ25hbmN5U3RhdHVzT3B0aW9ucz17cGF0aWVudEludGFrZVByZWduYW5jeVN0YXR1c09wdGlvbnN9XG4gICAgICAgICAgICAgICAgcGF0aWVudE5hbWU9e3BhdGllbnROYW1lfVxuICAgICAgICAgICAgICAgIHBheW1lbnRGaXNjYWxSZWNlaXB0TGFiZWxGb3JVaT17cGF5bWVudEZpc2NhbFJlY2VpcHRMYWJlbEZvclVpfVxuICAgICAgICAgICAgICAgIHBheW1lbnRJbnZvaWNlVG90YWxSdWJWYWx1ZT17cGF5bWVudEludm9pY2VUb3RhbFJ1YlZhbHVlfVxuICAgICAgICAgICAgICAgIHBheW1lbnRSZWNlaXB0RmlzY2FsUmVjZWlwdExpbmVzPXtwYXltZW50UmVjZWlwdEZpc2NhbFJlY2VpcHRMaW5lc31cbiAgICAgICAgICAgICAgICBwYXltZW50UmVjZWlwdElzc3VlZEJ5VmFsdWU9e3BheW1lbnRSZWNlaXB0SXNzdWVkQnlWYWx1ZX1cbiAgICAgICAgICAgICAgICBwYXltZW50UmVjZWlwdFBheWVyQmlydGhEYXRlVmFsdWU9e3BheW1lbnRSZWNlaXB0UGF5ZXJCaXJ0aERhdGVWYWx1ZX1cbiAgICAgICAgICAgICAgICBwYXltZW50UmVjZWlwdFBheWVyRnVsbE5hbWVWYWx1ZT17cGF5bWVudFJlY2VpcHRQYXllckZ1bGxOYW1lVmFsdWV9XG4gICAgICAgICAgICAgICAgcGF5bWVudFJlY2VpcHRQYXllcklkZW50aXR5RG9jdW1lbnRWYWx1ZT17cGF5bWVudFJlY2VpcHRQYXllcklkZW50aXR5RG9jdW1lbnRWYWx1ZX1cbiAgICAgICAgICAgICAgICBwYXltZW50UmVjZWlwdFBheWVySW5uVmFsdWU9e3BheW1lbnRSZWNlaXB0UGF5ZXJJbm5WYWx1ZX1cbiAgICAgICAgICAgICAgICBwYXltZW50UmVjZWlwdFBheWVyUmVsYXRpb25zaGlwVmFsdWU9e3BheW1lbnRSZWNlaXB0UGF5ZXJSZWxhdGlvbnNoaXBWYWx1ZX1cbiAgICAgICAgICAgICAgICBwaG90b1ZpZGVvTWF0ZXJpYWxPcHRpb25zPXtwaG90b1ZpZGVvTWF0ZXJpYWxPcHRpb25zfVxuICAgICAgICAgICAgICAgIHBsYW5uZWRTZXJ2aWNlTGluZXNGb3JGaW5hbmNpYWxQYXlsb2FkPXtwbGFubmVkU2VydmljZUxpbmVzRm9yRmluYW5jaWFsUGF5bG9hZH1cbiAgICAgICAgICAgICAgICBwb3N0VmlzaXRDYXJlVG9waWNPcHRpb25zPXtwb3N0VmlzaXRDYXJlVG9waWNPcHRpb25zfVxuICAgICAgICAgICAgICAgIHByb2NlZHVyZVNwZWNpZmljQ29uc2VudFByb2NlZHVyZU9wdGlvbnM9e3Byb2NlZHVyZVNwZWNpZmljQ29uc2VudFByb2NlZHVyZU9wdGlvbnN9XG4gICAgICAgICAgICAgICAgcmVsZWFzZVByb3RlY3Rpb25Ob3RlPXtyZWxlYXNlUHJvdGVjdGlvbk5vdGV9XG4gICAgICAgICAgICAgICAgcmVuZGVyQ2xpbmljYWxUb290aFJvd3NFZGl0b3I9e3JlbmRlckNsaW5pY2FsVG9vdGhSb3dzRWRpdG9yfVxuICAgICAgICAgICAgICAgIHJlcXVlc3REb2N1bWVudElzc3VlPXtyZXF1ZXN0RG9jdW1lbnRJc3N1ZX1cbiAgICAgICAgICAgICAgICByZXF1ZXN0RG9jdW1lbnRWb2lkPXtyZXF1ZXN0RG9jdW1lbnRWb2lkfVxuICAgICAgICAgICAgICAgIHNlbGVjdEFsbEVsaWdpYmxlVGF4UGF5bWVudHNGb3JDdXJyZW50RG9jdW1lbnQ9e3NlbGVjdEFsbEVsaWdpYmxlVGF4UGF5bWVudHNGb3JDdXJyZW50RG9jdW1lbnR9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb21wbGV0ZWRBY3RDb250cmFjdERvY3VtZW50SWQ9e3NlbGVjdGVkQ29tcGxldGVkQWN0Q29udHJhY3REb2N1bWVudElkfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRG9jdW1lbnRNZXRhZGF0YT17c2VsZWN0ZWREb2N1bWVudE1ldGFkYXRhfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRG9jdW1lbnRVc2VzVGF4UGF5bWVudFNlbGVjdGlvbj17c2VsZWN0ZWREb2N1bWVudFVzZXNUYXhQYXltZW50U2VsZWN0aW9ufVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRWxpZ2libGVUYXhQYXltZW50cz17c2VsZWN0ZWRFbGlnaWJsZVRheFBheW1lbnRzfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkUGF5bWVudFJlY2VpcHRJZFNldD17c2VsZWN0ZWRQYXltZW50UmVjZWlwdElkU2V0fVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkUGF5bWVudFJlY2VpcHRQYXltZW50cz17c2VsZWN0ZWRQYXltZW50UmVjZWlwdFBheW1lbnRzfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkUGF5bWVudFJlY2VpcHRUb3RhbFJ1Yj17c2VsZWN0ZWRQYXltZW50UmVjZWlwdFRvdGFsUnVifVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkUmVmdW5kQ29ycmVjdGlvblBheW1lbnQ9e3NlbGVjdGVkUmVmdW5kQ29ycmVjdGlvblBheW1lbnR9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRSZWxlYXNlU291cmNlUmVxdWVzdERvY3VtZW50SWQ9e3NlbGVjdGVkUmVsZWFzZVNvdXJjZVJlcXVlc3REb2N1bWVudElkfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVGF4RG9jdW1lbnRQYXllcktleT17c2VsZWN0ZWRUYXhEb2N1bWVudFBheWVyS2V5fVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVGF4UGF5bWVudElkU2V0PXtzZWxlY3RlZFRheFBheW1lbnRJZFNldH1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFRheFBheW1lbnRUb3RhbFJ1Yj17c2VsZWN0ZWRUYXhQYXltZW50VG90YWxSdWJ9XG4gICAgICAgICAgICAgICAgc2VsZWN0UmVmdW5kT3JpZ2luYWxQYXltZW50PXtzZWxlY3RSZWZ1bmRPcmlnaW5hbFBheW1lbnR9XG4gICAgICAgICAgICAgICAgc2V0UmVsZWFzZVByb3RlY3Rpb25Ob3RlPXtzZXRSZWxlYXNlUHJvdGVjdGlvbk5vdGV9XG4gICAgICAgICAgICAgICAgc3RydWN0dXJlZFBheWxvYWREb2N1bWVudEtpbmRzPXtzdHJ1Y3R1cmVkUGF5bG9hZERvY3VtZW50S2luZHN9XG4gICAgICAgICAgICAgICAgdGF4QXBwbGljYXRpb25EZWxpdmVyeUNoYW5uZWxPcHRpb25zPXt0YXhBcHBsaWNhdGlvbkRlbGl2ZXJ5Q2hhbm5lbE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgdGF4QXBwbGljYXRpb25Gb3JtT3B0aW9ucz17dGF4QXBwbGljYXRpb25Gb3JtT3B0aW9uc31cbiAgICAgICAgICAgICAgICB0YXhBcHBsaWNhdGlvblJlbGF0aW9uc2hpcE9wdGlvbnM9e3RheEFwcGxpY2F0aW9uUmVsYXRpb25zaGlwT3B0aW9uc31cbiAgICAgICAgICAgICAgICB0YXhEb2N1bWVudFBheWVyT3B0aW9ucz17dGF4RG9jdW1lbnRQYXllck9wdGlvbnN9XG4gICAgICAgICAgICAgICAgdG9nZ2xlUGhvdG9WaWRlb01hdGVyaWFsPXt0b2dnbGVQaG90b1ZpZGVvTWF0ZXJpYWx9XG4gICAgICAgICAgICAgICAgdHJlYXRtZW50QWNjZXB0YW5jZVBsYW5uZWRUb3RhbFJ1Yj17dHJlYXRtZW50QWNjZXB0YW5jZVBsYW5uZWRUb3RhbFJ1Yn1cbiAgICAgICAgICAgICAgICB0cmVhdG1lbnRFc3RpbWF0ZVBhdGllbnRPclBheWVyRnVsbE5hbWVWYWx1ZT17dHJlYXRtZW50RXN0aW1hdGVQYXRpZW50T3JQYXllckZ1bGxOYW1lVmFsdWV9XG4gICAgICAgICAgICAgICAgdHJlYXRtZW50RXN0aW1hdGVUb3RhbFJ1YlZhbHVlPXt0cmVhdG1lbnRFc3RpbWF0ZVRvdGFsUnViVmFsdWV9XG4gICAgICAgICAgICAgICAgdHJlYXRtZW50RXN0aW1hdGVUcmVhdG1lbnRCYXNpc1ZhbHVlPXt0cmVhdG1lbnRFc3RpbWF0ZVRyZWF0bWVudEJhc2lzVmFsdWV9XG4gICAgICAgICAgICAgICAgd2FycmFudHlMaW5rZWRBY3RPckNvbnRyYWN0VmFsdWU9e3dhcnJhbnR5TGlua2VkQWN0T3JDb250cmFjdFZhbHVlfVxuICAgICAgICAgICAgICAgIHdhcnJhbnR5U2VydmljZU9yV29ya05hbWVWYWx1ZT17d2FycmFudHlTZXJ2aWNlT3JXb3JrTmFtZVZhbHVlfVxuICAgICAgICAgICAgICAgIHdhcnJhbnR5VGVldGhPckFyZWFWYWx1ZT17d2FycmFudHlUZWV0aE9yQXJlYVZhbHVlfVxuICAgICAgICAgICAgICAgIHhyYXlQcmVnbmFuY3lTdGF0dXNPcHRpb25zPXt4cmF5UHJlZ25hbmN5U3RhdHVzT3B0aW9uc31cbiAgICAgICAgICAgICAgICB4cmF5U3R1ZHlUeXBlT3B0aW9ucz17eHJheVN0dWR5VHlwZU9wdGlvbnN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgICAgPC9Xb3Jrc3BhY2VSb3V0ZUVycm9yQm91bmRhcnk+XG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICB7Y3VycmVudFZpZXcgPT09IFwiZmluYW5jZVwiID8gKFxuICAgICAgICAgICAgPFdvcmtzcGFjZVJvdXRlRXJyb3JCb3VuZGFyeSB2aWV3PVwiZmluYW5jZVwiIGxhYmVsPXt2aWV3TGFiZWxzLmZpbmFuY2V9IHBhbmVsQ2xhc3NOYW1lPVwicGFuZWwgZmluYW5jZS1wYW5lbFwiIHBhbmVsSWQ9XCJmaW5hbmNlXCI+XG4gICAgICAgICAgICA8U3VzcGVuc2VcbiAgICAgICAgICAgICAgZmFsbGJhY2s9e1xuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgZmluYW5jZS1wYW5lbFwiIGlkPVwiZmluYW5jZVwiIGFyaWEtYnVzeT1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8aDI+0J7Qv9C70LDRgtGLLCDQv9C70LDQvSDQu9C10YfQtdC90LjRjyDQuCDQstGL0YfQtdGCPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3RhdHVzLXBpbGwgc3RhdHVzLXBsYW5uZWRcIj7Qt9Cw0LPRgNGD0LfQutCwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEZpbmFuY2VWaWV3XG4gICAgICAgICAgICAgICAgYWN0aXZlUGF5bWVudHM9e2FjdGl2ZVBheW1lbnRzfVxuICAgICAgICAgICAgICAgIGFjdGl2ZVRyZWF0bWVudFBsYW5JdGVtcz17YWN0aXZlVHJlYXRtZW50UGxhbkl0ZW1zfVxuICAgICAgICAgICAgICAgIGFjdGl2ZVRyZWF0bWVudFBsYW5TY2VuYXJpb3M9e2FjdGl2ZVRyZWF0bWVudFBsYW5TY2VuYXJpb3N9XG4gICAgICAgICAgICAgICAgYmlsbGluZ1N1bW1hcnk9e3BhdGllbnRCaWxsaW5nU3VtbWFyeX1cbiAgICAgICAgICAgICAgICBjbGluaWNhbFJ1bGVFdmFsdWF0aW9ucz17cGF0aWVudENsaW5pY2FsUnVsZUV2YWx1YXRpb25zfVxuICAgICAgICAgICAgICAgIGNsaW5pY2FsUnVsZUFjdGlvbkxhYmVscz17Y2xpbmljYWxSdWxlQWN0aW9uTGFiZWxzfVxuICAgICAgICAgICAgICAgIGNsaW5pY2FsUnVsZVNldmVyaXR5TGFiZWxzPXtjbGluaWNhbFJ1bGVTZXZlcml0eUxhYmVsc31cbiAgICAgICAgICAgICAgICBjbGluaWNhbFJ1bGVTdW1tYXJ5PXtwYXRpZW50Q2xpbmljYWxSdWxlU3VtbWFyeX1cbiAgICAgICAgICAgICAgICBkYXNoYm9hcmQ9e2Rhc2hib2FyZH1cbiAgICAgICAgICAgICAgICBkb2N1bWVudFBhdGllbnQ9e2RvY3VtZW50UGF0aWVudH1cbiAgICAgICAgICAgICAgICBmb3JtYXREYXRlVGltZT17Zm9ybWF0RGF0ZVRpbWV9XG4gICAgICAgICAgICAgICAgaXNQYXltZW50U2F2aW5nPXtpc1BheW1lbnRTYXZpbmd9XG4gICAgICAgICAgICAgICAgbW9uZXk9e21vbmV5fVxuICAgICAgICAgICAgICAgIG9uR29Ub0RvY3VtZW50cz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcImRvY3VtZW50c1wiO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25Hb1RvUHJpY2VzPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRTZXR0aW5nc1RhYihcInByaWNlc1wiKTtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJzZXR0aW5ncy9wcmljZXNcIjtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uR29Ub1Zpc2l0PXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwidmlzaXRcIjtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uUmVjb3JkUGF5bWVudD17cmVjb3JkUGF5bWVudH1cbiAgICAgICAgICAgICAgICBwYXltZW50QW1vdW50PXtwYXltZW50QW1vdW50fVxuICAgICAgICAgICAgICAgIHBheW1lbnRGZWVkYmFjaz17cGF5bWVudEZlZWRiYWNrfVxuICAgICAgICAgICAgICAgIHBheW1lbnRGaXNjYWxDYXNoaWVyTmFtZT17cGF5bWVudEZpc2NhbENhc2hpZXJOYW1lfVxuICAgICAgICAgICAgICAgIHBheW1lbnRGaXNjYWxGZD17cGF5bWVudEZpc2NhbEZkfVxuICAgICAgICAgICAgICAgIHBheW1lbnRGaXNjYWxGbj17cGF5bWVudEZpc2NhbEZufVxuICAgICAgICAgICAgICAgIHBheW1lbnRGaXNjYWxGcGQ9e3BheW1lbnRGaXNjYWxGcGR9XG4gICAgICAgICAgICAgICAgcGF5bWVudEZpc2NhbFJlY2VpcHRJc3N1ZWRBdD17cGF5bWVudEZpc2NhbFJlY2VpcHRJc3N1ZWRBdH1cbiAgICAgICAgICAgICAgICBwYXltZW50RmlzY2FsUmVjZWlwdExhYmVsPXtwYXltZW50RmlzY2FsUmVjZWlwdExhYmVsRm9yVWl9XG4gICAgICAgICAgICAgICAgcGF5bWVudEZpc2NhbFJlY2VpcHROdW1iZXI9e3BheW1lbnRGaXNjYWxSZWNlaXB0TnVtYmVyfVxuICAgICAgICAgICAgICAgIHBheW1lbnRGaXNjYWxSZWNlaXB0VXJsPXtwYXltZW50RmlzY2FsUmVjZWlwdFVybH1cbiAgICAgICAgICAgICAgICBwYXltZW50TWV0aG9kPXtwYXltZW50TWV0aG9kfVxuICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2RMYWJlbHM9e3BheW1lbnRNZXRob2RMYWJlbHN9XG4gICAgICAgICAgICAgICAgcGF5bWVudFBhdGllbnRDb250ZXh0TWVzc2FnZT17cGF5bWVudFBhdGllbnRDb250ZXh0TWVzc2FnZX1cbiAgICAgICAgICAgICAgICBwYXltZW50UGF0aWVudENvbnRleHRSZWFkeT17cGF5bWVudFBhdGllbnRDb250ZXh0UmVhZHl9XG4gICAgICAgICAgICAgICAgcGF5bWVudFBheWVyQmlydGhEYXRlPXtwYXltZW50UGF5ZXJCaXJ0aERhdGV9XG4gICAgICAgICAgICAgICAgcGF5bWVudFBheWVyRnVsbE5hbWU9e3BheW1lbnRQYXllckZ1bGxOYW1lfVxuICAgICAgICAgICAgICAgIHBheW1lbnRQYXllcklkZW50aXR5RG9jdW1lbnQ9e3BheW1lbnRQYXllcklkZW50aXR5RG9jdW1lbnR9XG4gICAgICAgICAgICAgICAgcGF5bWVudFBheWVySW5uPXtwYXltZW50UGF5ZXJJbm59XG4gICAgICAgICAgICAgICAgcGF5bWVudFBheWVyUmVsYXRpb25zaGlwPXtwYXltZW50UGF5ZXJSZWxhdGlvbnNoaXB9XG4gICAgICAgICAgICAgICAgcGF5bWVudFRheERlZHVjdGlvbkNvZGU9e3BheW1lbnRUYXhEZWR1Y3Rpb25Db2RlfVxuICAgICAgICAgICAgICAgIHNjZW5hcmlvUHJpb3JpdHlMYWJlbHM9e3NjZW5hcmlvUHJpb3JpdHlMYWJlbHN9XG4gICAgICAgICAgICAgICAgc2NlbmFyaW9TdHJhdGVneUxhYmVscz17c2NlbmFyaW9TdHJhdGVneUxhYmVsc31cbiAgICAgICAgICAgICAgICBzZXJ2aWNlQ2F0ZWdvcnlMYWJlbHM9e3NlcnZpY2VDYXRlZ29yeUxhYmVsc31cbiAgICAgICAgICAgICAgICBzZXJ2aWNlVGl0bGU9e3NlcnZpY2VUaXRsZX1cbiAgICAgICAgICAgICAgICBzZXRQYXltZW50QW1vdW50PXtzZXRQYXltZW50QW1vdW50fVxuICAgICAgICAgICAgICAgIHNldFBheW1lbnRGaXNjYWxDYXNoaWVyTmFtZT17c2V0UGF5bWVudEZpc2NhbENhc2hpZXJOYW1lfVxuICAgICAgICAgICAgICAgIHNldFBheW1lbnRGaXNjYWxGZD17c2V0UGF5bWVudEZpc2NhbEZkfVxuICAgICAgICAgICAgICAgIHNldFBheW1lbnRGaXNjYWxGbj17c2V0UGF5bWVudEZpc2NhbEZufVxuICAgICAgICAgICAgICAgIHNldFBheW1lbnRGaXNjYWxGcGQ9e3NldFBheW1lbnRGaXNjYWxGcGR9XG4gICAgICAgICAgICAgICAgc2V0UGF5bWVudEZpc2NhbFJlY2VpcHRJc3N1ZWRBdD17c2V0UGF5bWVudEZpc2NhbFJlY2VpcHRJc3N1ZWRBdH1cbiAgICAgICAgICAgICAgICBzZXRQYXltZW50RmlzY2FsUmVjZWlwdE51bWJlcj17c2V0UGF5bWVudEZpc2NhbFJlY2VpcHROdW1iZXJ9XG4gICAgICAgICAgICAgICAgc2V0UGF5bWVudEZpc2NhbFJlY2VpcHRVcmw9e3NldFBheW1lbnRGaXNjYWxSZWNlaXB0VXJsfVxuICAgICAgICAgICAgICAgIHNldFBheW1lbnRNZXRob2Q9e3NldFBheW1lbnRNZXRob2R9XG4gICAgICAgICAgICAgICAgc2V0UGF5bWVudFBheWVyQmlydGhEYXRlPXtzZXRQYXltZW50UGF5ZXJCaXJ0aERhdGV9XG4gICAgICAgICAgICAgICAgc2V0UGF5bWVudFBheWVyRnVsbE5hbWU9e3NldFBheW1lbnRQYXllckZ1bGxOYW1lfVxuICAgICAgICAgICAgICAgIHNldFBheW1lbnRQYXllcklkZW50aXR5RG9jdW1lbnQ9e3NldFBheW1lbnRQYXllcklkZW50aXR5RG9jdW1lbnR9XG4gICAgICAgICAgICAgICAgc2V0UGF5bWVudFBheWVySW5uPXtzZXRQYXltZW50UGF5ZXJJbm59XG4gICAgICAgICAgICAgICAgc2V0UGF5bWVudFBheWVyUmVsYXRpb25zaGlwPXtzZXRQYXltZW50UGF5ZXJSZWxhdGlvbnNoaXB9XG4gICAgICAgICAgICAgICAgc2V0UGF5bWVudFRheERlZHVjdGlvbkNvZGU9e3NldFBheW1lbnRUYXhEZWR1Y3Rpb25Db2RlfVxuICAgICAgICAgICAgICAgIHN0YWZmUm9sZUxhYmVscz17c3RhZmZSb2xlTGFiZWxzfVxuICAgICAgICAgICAgICAgIHRyZWF0bWVudFN0YXR1c0xhYmVscz17dHJlYXRtZW50U3RhdHVzTGFiZWxzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgICAgIDwvV29ya3NwYWNlUm91dGVFcnJvckJvdW5kYXJ5PlxuICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAge2N1cnJlbnRWaWV3ID09PSBcImNvbW11bmljYXRpb25zXCIgPyAoXG4gICAgICAgICAgICA8V29ya3NwYWNlUm91dGVFcnJvckJvdW5kYXJ5IHZpZXc9XCJjb21tdW5pY2F0aW9uc1wiIGxhYmVsPXt2aWV3TGFiZWxzLmNvbW11bmljYXRpb25zfSBwYW5lbENsYXNzTmFtZT1cInBhbmVsIGNvbW11bmljYXRpb25zLXBhbmVsXCIgcGFuZWxJZD1cImNvbW11bmljYXRpb25zXCI+XG4gICAgICAgICAgICA8U3VzcGVuc2VcbiAgICAgICAgICAgICAgZmFsbGJhY2s9e1xuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgY29tbXVuaWNhdGlvbnMtcGFuZWxcIiBpZD1cImNvbW11bmljYXRpb25zXCIgYXJpYS1idXN5PVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMj7QodCy0Y/Qt9GMINGBINC/0LDRhtC40LXQvdGC0LDQvNC4PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3RhdHVzLXBpbGwgc3RhdHVzLXBsYW5uZWRcIj7Qt9Cw0LPRgNGD0LfQutCwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPENvbW11bmljYXRpb25zVmlld1xuICAgICAgICAgICAgICAgIGNvbW11bmljYXRpb25DaGFubmVsTGFiZWxzPXtjb21tdW5pY2F0aW9uQ2hhbm5lbExhYmVsc31cbiAgICAgICAgICAgICAgICBjb21tdW5pY2F0aW9uRG9jdW1lbnRUYXNrQWN0aW9uTGFiZWxzPXtjb21tdW5pY2F0aW9uRG9jdW1lbnRUYXNrQWN0aW9uTGFiZWxzfVxuICAgICAgICAgICAgICAgIGNvbW11bmljYXRpb25JbnRlbnRMYWJlbHM9e2NvbW11bmljYXRpb25JbnRlbnRMYWJlbHN9XG4gICAgICAgICAgICAgICAgY29tbXVuaWNhdGlvbk5vdGU9e2NvbW11bmljYXRpb25Ob3RlfVxuICAgICAgICAgICAgICAgIGNvbW11bmljYXRpb25Qcmlvcml0eUxhYmVscz17Y29tbXVuaWNhdGlvblByaW9yaXR5TGFiZWxzfVxuICAgICAgICAgICAgICAgIGNvbW11bmljYXRpb25TdGF0dXNMYWJlbHM9e2NvbW11bmljYXRpb25TdGF0dXNMYWJlbHN9XG4gICAgICAgICAgICAgICAgY29tcGxldGVDb21tdW5pY2F0aW9uVGFzaz17Y29tcGxldGVDb21tdW5pY2F0aW9uVGFza31cbiAgICAgICAgICAgICAgICBkYXNoYm9hcmQ9e2Rhc2hib2FyZH1cbiAgICAgICAgICAgICAgICBkb2N1bWVudEtpbmRzRm9yQ29tbXVuaWNhdGlvblRhc2s9e2RvY3VtZW50S2luZHNGb3JDb21tdW5pY2F0aW9uVGFza31cbiAgICAgICAgICAgICAgICBkb2N1bWVudExhYmVscz17ZG9jdW1lbnRMYWJlbHN9XG4gICAgICAgICAgICAgICAgZm9ybWF0RGF0ZVRpbWU9e2Zvcm1hdERhdGVUaW1lfVxuICAgICAgICAgICAgICAgIGNvbW11bmljYXRpb25TYXZpbmdUYXNrSWQ9e2NvbW11bmljYXRpb25TYXZpbmdUYXNrSWR9XG4gICAgICAgICAgICAgICAgb25Db21tdW5pY2F0aW9uTm90ZUNoYW5nZT17c2V0Q29tbXVuaWNhdGlvbk5vdGV9XG4gICAgICAgICAgICAgICAgb25Hb1RvU2NoZWR1bGU9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJzY2hlZHVsZVwiO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb3BlbkNvbW11bmljYXRpb25UYXNrRG9jdW1lbnRXb3JrZmxvdz17b3BlbkNvbW11bmljYXRpb25UYXNrRG9jdW1lbnRXb3JrZmxvd31cbiAgICAgICAgICAgICAgICBzb3J0ZWRDb21tdW5pY2F0aW9uVGFza3M9e3NvcnRlZENvbW11bmljYXRpb25UYXNrc31cbiAgICAgICAgICAgICAgICBzdGFmZlJvbGVMYWJlbHM9e3N0YWZmUm9sZUxhYmVsc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgICAgICA8L1dvcmtzcGFjZVJvdXRlRXJyb3JCb3VuZGFyeT5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7W1wiZG9jdW1lbnRzXCIsIFwiZmluYW5jZVwiLCBcImNvbW11bmljYXRpb25zXCIsIFwic2V0dGluZ3NcIl0uaW5jbHVkZXMoY3VycmVudFZpZXcpID8gKFxuICAgICAgICA8ZGV0YWlscyBjbGFzc05hbWU9XCJjb21wbGlhbmNlLWJhclwiIGFyaWEtbGFiZWw9XCLQmtC+0L3RgtGA0L7Qu9GMXCI+XG4gICAgICAgICAgPHN1bW1hcnk+XG4gICAgICAgICAgICA8U2hpZWxkQ2hlY2sgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cbiAgICAgICAgICAgIDxzcGFuPtCh0LvRg9C20LXQsdC90YvQtSDQvtCz0YDQsNC90LjRh9C10L3QuNGPPC9zcGFuPlxuICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge2Rhc2hib2FyZC5jb21wbGlhbmNlV2FybmluZ3MubWFwKCh3YXJuaW5nKSA9PiAoXG4gICAgICAgICAgICAgIDxwIGtleT17d2FybmluZ30+e3dhcm5pbmd9PC9wPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge2N1cnJlbnRWaWV3ID09PSBcInNldHRpbmdzXCIgPyAoXG4gICAgICAgICAgPFdvcmtzcGFjZVJvdXRlRXJyb3JCb3VuZGFyeSB2aWV3PVwic2V0dGluZ3NcIiBsYWJlbD17dmlld0xhYmVscy5zZXR0aW5nc30gcGFuZWxDbGFzc05hbWU9XCJzZXR0aW5ncy16b25lXCIgcGFuZWxJZD1cInNldHRpbmdzXCI+XG4gICAgICAgICAgPFN1c3BlbnNlXG4gICAgICAgICAgICBmYWxsYmFjaz17XG4gICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInNldHRpbmdzLXpvbmVcIiBpZD1cInNldHRpbmdzXCIgYXJpYS1idXN5PVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZyBzZXR0aW5ncy1oZWFkaW5nXCI+XG4gICAgICAgICAgICAgICAgICA8aDI+0J3QsNGB0YLRgNC+0LnQutC4PC9oMj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN0YXR1cy1waWxsIHN0YXR1cy1wbGFubmVkXCI+0LfQsNCz0YDRg9C30LrQsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTZXR0aW5nc1ZpZXdcbiAgICAgICAgICAgICAgYWN0aXZlU3RhZmZVc2VyPXthY3RpdmVTdGFmZlVzZXJ9XG4gICAgICAgICAgICAgIGFjdGl2ZVBhdGllbnQ9e2FjdGl2ZVBhdGllbnR9XG4gICAgICAgICAgICAgIGFjdGl2ZVNldHRpbmdzVGFiQnV0dG9uUmVmPXthY3RpdmVTZXR0aW5nc1RhYkJ1dHRvblJlZn1cbiAgICAgICAgICAgICAgYWN0aXZlU3BlZWNoUHJvdmlkZXJIZWFsdGg9e2FjdGl2ZVNwZWVjaFByb3ZpZGVySGVhbHRofVxuICAgICAgICAgICAgICBhY3RpdmVXb3Jrc3BhY2VQcm9maWxlPXthY3RpdmVXb3Jrc3BhY2VQcm9maWxlfVxuICAgICAgICAgICAgICBhZGRDaGFpcj17YWRkQ2hhaXJ9XG4gICAgICAgICAgICAgIGFkZFN0YWZmTWVtYmVyPXthZGRTdGFmZk1lbWJlcn1cbiAgICAgICAgICAgICAgYW5hbHl6ZVByaWNlbGlzdD17YW5hbHl6ZVByaWNlbGlzdH1cbiAgICAgICAgICAgICAgYXBwbHlQcm90b2NvbFRlbXBsYXRlPXthcHBseVByb3RvY29sVGVtcGxhdGV9XG4gICAgICAgICAgICAgIGF0dGFjaFByaWNlbGlzdEltYWdlPXthdHRhY2hQcmljZWxpc3RJbWFnZX1cbiAgICAgICAgICAgICAgYnJvd3NlckNhblJlcXVlc3RQZXJzaXN0ZW50U3RvcmFnZT17YnJvd3NlckNhblJlcXVlc3RQZXJzaXN0ZW50U3RvcmFnZX1cbiAgICAgICAgICAgICAgYnJvd3NlckNvbnRpbnVpdHk9e2Jyb3dzZXJDb250aW51aXR5fVxuICAgICAgICAgICAgICBicm93c2VyQ29udGludWl0eUNoZWNrcz17YnJvd3NlckNvbnRpbnVpdHlDaGVja3N9XG4gICAgICAgICAgICAgIGJyb3dzZXJDb250aW51aXR5U3RhdGU9e2Jyb3dzZXJDb250aW51aXR5U3RhdGV9XG4gICAgICAgICAgICAgIGJyb3dzZXJDb250aW51aXR5VmFsdWU9e2Jyb3dzZXJDb250aW51aXR5VmFsdWV9XG4gICAgICAgICAgICAgIGJyb3dzZXJEaXJlY3RvcnlJbnB1dFJlZj17YnJvd3NlckRpcmVjdG9yeUlucHV0UmVmfVxuICAgICAgICAgICAgICBicm93c2VyRGlyZWN0b3J5UGlja2VyQXZhaWxhYmxlPXticm93c2VyRGlyZWN0b3J5UGlja2VyQXZhaWxhYmxlfVxuICAgICAgICAgICAgICBicm93c2VySW1hZ2luZ1NjYW5Qcm9ncmVzcz17YnJvd3NlckltYWdpbmdTY2FuUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGJyb3dzZXJNaWdyYXRpb25EaXNjb3Zlcnk9e2Jyb3dzZXJNaWdyYXRpb25EaXNjb3Zlcnl9XG4gICAgICAgICAgICAgIGJyb3dzZXJNaWdyYXRpb25TY2FuUHJvZ3Jlc3M9e2Jyb3dzZXJNaWdyYXRpb25TY2FuUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGJyb3dzZXJNaWdyYXRpb25JbnB1dFJlZj17YnJvd3Nlck1pZ3JhdGlvbklucHV0UmVmfVxuICAgICAgICAgICAgICBicm93c2VyUGlja2VkSW1hZ2luZ0ZvbGRlcj17YnJvd3NlclBpY2tlZEltYWdpbmdGb2xkZXJ9XG4gICAgICAgICAgICAgIGJ1aWxkRGljb21Gb2xkZXJXb3JrdXBQbGFuPXtidWlsZERpY29tRm9sZGVyV29ya3VwUGxhbn1cbiAgICAgICAgICAgICAgYnVpbGREaWNvbVJlbmRlckNhY2hlUGxhbj17YnVpbGREaWNvbVJlbmRlckNhY2hlUGxhbn1cbiAgICAgICAgICAgICAgYnVpbGREaWNvbVZpZXdlckxhdW5jaE1hbmlmZXN0PXtidWlsZERpY29tVmlld2VyTGF1bmNoTWFuaWZlc3R9XG4gICAgICAgICAgICAgIGJ1aWxkRGljb21WaWV3ZXJUb29sU3RhdGVCdW5kbGU9e2J1aWxkRGljb21WaWV3ZXJUb29sU3RhdGVCdW5kbGV9XG4gICAgICAgICAgICAgIGJ1aWxkRGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdD17YnVpbGREaWNvbVZpZXdlcldvcmtiZW5jaE1hbmlmZXN0fVxuICAgICAgICAgICAgICBjYmN0V29ya2JlbmNoUGxhbmVzPXtjYmN0V29ya2JlbmNoUGxhbmVzfVxuICAgICAgICAgICAgICBjYmN0V29ya2JlbmNoUHJvamVjdGlvbnM9e2NiY3RXb3JrYmVuY2hQcm9qZWN0aW9uc31cbiAgICAgICAgICAgICAgY2JjdFdvcmtiZW5jaFNlcmllcz17Y2JjdFdvcmtiZW5jaFNlcmllc31cbiAgICAgICAgICAgICAgY2JjdFdvcmtiZW5jaFRvb2xzPXtjYmN0V29ya2JlbmNoVG9vbHN9XG4gICAgICAgICAgICAgIGNoYW5nZUNsaW5pY01vZGU9e2NoYW5nZUNsaW5pY01vZGV9XG4gICAgICAgICAgICAgIGNoZWNrRGljb21XZWJDb25uZWN0b3I9e2NoZWNrRGljb21XZWJDb25uZWN0b3J9XG4gICAgICAgICAgICAgIGNoZWNrRGljb21Xb3Jrc3RhdGlvblJlYWRpbmVzcz17Y2hlY2tEaWNvbVdvcmtzdGF0aW9uUmVhZGluZXNzfVxuICAgICAgICAgICAgICBjaG9vc2VSZWNvZ25pdGlvblByZXNldD17Y2hvb3NlUmVjb2duaXRpb25QcmVzZXR9XG4gICAgICAgICAgICAgIGNhbmNlbEJyb3dzZXJJbWFnaW5nRm9sZGVyU2Nhbj17Y2FuY2VsQnJvd3NlckltYWdpbmdGb2xkZXJTY2FufVxuICAgICAgICAgICAgICBjYW5jZWxCcm93c2VyTWlncmF0aW9uU2Nhbj17Y2FuY2VsQnJvd3Nlck1pZ3JhdGlvblNjYW59XG4gICAgICAgICAgICAgIGNsZWFyQnJvd3NlclBpY2tlZEltYWdpbmdGb2xkZXJQcmV2aWV3PXtjbGVhckJyb3dzZXJQaWNrZWRJbWFnaW5nRm9sZGVyUHJldmlld31cbiAgICAgICAgICAgICAgY2xlYXJEaWNvbVdvcmtiZW5jaFJlY292ZXJ5PXtjbGVhckRpY29tV29ya2JlbmNoUmVjb3Zlcnl9XG4gICAgICAgICAgICAgIGNsZWFyTG9jYWxJbWFnaW5nRm9sZGVyUmVjb3Zlcnk9e2NsZWFyTG9jYWxJbWFnaW5nRm9sZGVyUmVjb3Zlcnl9XG4gICAgICAgICAgICAgIGNsZWFyUHJpY2VsaXN0SW1hZ2U9e2NsZWFyUHJpY2VsaXN0SW1hZ2V9XG4gICAgICAgICAgICAgIGNsaW5pY2FsUnVsZUFjdGlvbkxhYmVscz17Y2xpbmljYWxSdWxlQWN0aW9uTGFiZWxzfVxuICAgICAgICAgICAgICBjbGluaWNhbFJ1bGVTZXZlcml0eUxhYmVscz17Y2xpbmljYWxSdWxlU2V2ZXJpdHlMYWJlbHN9XG4gICAgICAgICAgICAgIGNsaW5pY01vZGVMYWJlbHM9e2NsaW5pY01vZGVMYWJlbHN9XG4gICAgICAgICAgICAgIGNsaW5pY1Byb2ZpbGVEcmFmdD17Y2xpbmljUHJvZmlsZURyYWZ0fVxuICAgICAgICAgICAgICBjbGluaWNQcm9maWxlU2F2ZVN0YXRlPXtjbGluaWNQcm9maWxlU2F2ZVN0YXRlfVxuICAgICAgICAgICAgICBjb21taXRJbWFnaW5nSW1wb3J0PXtjb21taXRJbWFnaW5nSW1wb3J0fVxuICAgICAgICAgICAgICBjb21taXRJbXBvcnQ9e2NvbW1pdEltcG9ydH1cbiAgICAgICAgICAgICAgY29tbWl0U21hcnRJbXBvcnQ9e2NvbW1pdFNtYXJ0SW1wb3J0fVxuICAgICAgICAgICAgICBjb3B5VGVsZWdyYW1UZXh0VG9DbGlwYm9hcmQ9e2NvcHlUZWxlZ3JhbVRleHRUb0NsaXBib2FyZH1cbiAgICAgICAgICAgICAgY3JlYXRlQ2xpbmljYWxSdWxlRnJvbVNldHRpbmdzPXtjcmVhdGVDbGluaWNhbFJ1bGVGcm9tU2V0dGluZ3N9XG4gICAgICAgICAgICAgIGNyZWF0ZVRlbGVncmFtTGlua0NvZGU9e2NyZWF0ZVRlbGVncmFtTGlua0NvZGV9XG4gICAgICAgICAgICAgIGRhc2hib2FyZD17ZGFzaGJvYXJkfVxuICAgICAgICAgICAgICBkZWZhdWx0RGljb21GaXJzdEZyYW1lVmlld2VyU3RhdGU9e2RlZmF1bHREaWNvbUZpcnN0RnJhbWVWaWV3ZXJTdGF0ZX1cbiAgICAgICAgICAgICAgZGVudGFsTWF0ZXJpYWxLaW5kTGFiZWxzPXtkZW50YWxNYXRlcmlhbEtpbmRMYWJlbHN9XG4gICAgICAgICAgICAgIGRlbnRhbFJlc3RvcmF0aW9uVHlwZUxhYmVscz17ZGVudGFsUmVzdG9yYXRpb25UeXBlTGFiZWxzfVxuICAgICAgICAgICAgICBkaWNvbUZpcnN0RnJhbWVJbWFnZVN0eWxlPXtkaWNvbUZpcnN0RnJhbWVJbWFnZVN0eWxlfVxuICAgICAgICAgICAgICBkaWNvbUZpcnN0RnJhbWVQcmV2aWV3PXtkaWNvbUZpcnN0RnJhbWVQcmV2aWV3fVxuICAgICAgICAgICAgICBkaWNvbUZpcnN0RnJhbWVTdGF0dXNMYWJlbHM9e2RpY29tRmlyc3RGcmFtZVN0YXR1c0xhYmVsc31cbiAgICAgICAgICAgICAgZGljb21GaXJzdEZyYW1lVmlld2VyU3RhdGU9e2RpY29tRmlyc3RGcmFtZVZpZXdlclN0YXRlfVxuICAgICAgICAgICAgICBkaWNvbUZvbGRlclNlcmllc1NjYW49e2RpY29tRm9sZGVyU2VyaWVzU2Nhbn1cbiAgICAgICAgICAgICAgZGljb21Gb2xkZXJXb3JrdXBQYXRoTGFiZWxzPXtkaWNvbUZvbGRlcldvcmt1cFBhdGhMYWJlbHN9XG4gICAgICAgICAgICAgIGRpY29tRm9sZGVyV29ya3VwUGxhbj17ZGljb21Gb2xkZXJXb3JrdXBQbGFufVxuICAgICAgICAgICAgICBkaWNvbURpYWdub3N0aWNQaXhlbFBvbGljeUxhYmVscz17ZGljb21EaWFnbm9zdGljUGl4ZWxQb2xpY3lMYWJlbHN9XG4gICAgICAgICAgICAgIGRpY29tRXhlY3V0aW9uTGFuZUxhYmVscz17ZGljb21FeGVjdXRpb25MYW5lTGFiZWxzfVxuICAgICAgICAgICAgICBkaWNvbUdwdUNsYXNzTGFiZWxzPXtkaWNvbUdwdUNsYXNzTGFiZWxzfVxuICAgICAgICAgICAgICBkaWNvbUxhYmVsPXtkaWNvbUxhYmVsfVxuICAgICAgICAgICAgICBkaWNvbUxvY2FsRm9sZGVyRGlzY292ZXJ5PXtkaWNvbUxvY2FsRm9sZGVyRGlzY292ZXJ5fVxuICAgICAgICAgICAgICBkaWNvbVF1YWxpdHlNb2RlTGFiZWxzPXtkaWNvbVF1YWxpdHlNb2RlTGFiZWxzfVxuICAgICAgICAgICAgICBkaWNvbVJlYWRpbmVzc0NoZWNrTGFiZWxzPXtkaWNvbVJlYWRpbmVzc0NoZWNrTGFiZWxzfVxuICAgICAgICAgICAgICBkaWNvbVJlbmRlck1lbW9yeUJ1ZGdldENsYXNzTGFiZWxzPXtkaWNvbVJlbmRlck1lbW9yeUJ1ZGdldENsYXNzTGFiZWxzfVxuICAgICAgICAgICAgICBkaWNvbVJlbmRlckNhY2hlUGxhbj17ZGljb21SZW5kZXJDYWNoZVBsYW59XG4gICAgICAgICAgICAgIGRpY29tUnVudGltZVRpZXJMYWJlbHM9e2RpY29tUnVudGltZVRpZXJMYWJlbHN9XG4gICAgICAgICAgICAgIGRpY29tU2VyaWVzUHJldmlldz17ZGljb21TZXJpZXNQcmV2aWV3fVxuICAgICAgICAgICAgICBkaWNvbVNlcmllc1ZpZXdlckxhYmVscz17ZGljb21TZXJpZXNWaWV3ZXJMYWJlbHN9XG4gICAgICAgICAgICAgIGRpY29tVGV4dHVyZVN0cmF0ZWd5TGFiZWxzPXtkaWNvbVRleHR1cmVTdHJhdGVneUxhYmVsc31cbiAgICAgICAgICAgICAgZGljb21WaWV3ZXJMYXVuY2hNYW5pZmVzdD17ZGljb21WaWV3ZXJMYXVuY2hNYW5pZmVzdH1cbiAgICAgICAgICAgICAgZGljb21WaWV3ZXJMYXVuY2hNb2RlTGFiZWxzPXtkaWNvbVZpZXdlckxhdW5jaE1vZGVMYWJlbHN9XG4gICAgICAgICAgICAgIGRpY29tVmlld2VyVG9vbFN0YXRlQnVuZGxlPXtkaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZX1cbiAgICAgICAgICAgICAgZGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdD17ZGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdH1cbiAgICAgICAgICAgICAgZGljb21XZWJDaGVjaz17ZGljb21XZWJDaGVja31cbiAgICAgICAgICAgICAgZGljb21XZWJFbmRwb2ludFVybD17ZGljb21XZWJFbmRwb2ludFVybH1cbiAgICAgICAgICAgICAgZGljb21XZWJTdGF0dXNMYWJlbHM9e2RpY29tV2ViU3RhdHVzTGFiZWxzfVxuICAgICAgICAgICAgICBkaWNvbVdvcmtiZW5jaExvY2FsU2F2ZWRBdD17ZGljb21Xb3JrYmVuY2hMb2NhbFNhdmVkQXR9XG4gICAgICAgICAgICAgIGRpY29tV29ya2JlbmNoU2VydmVyQnVuZGxlPXtkaWNvbVdvcmtiZW5jaFNlcnZlckJ1bmRsZX1cbiAgICAgICAgICAgICAgZGljb21Xb3JrYmVuY2hTb3VyY2VJc1JlZGFjdGVkPXtkaWNvbVdvcmtiZW5jaFNvdXJjZUlzUmVkYWN0ZWR9XG4gICAgICAgICAgICAgIGRpY29tV29ya3N0YXRpb25SZWFkaW5lc3M9e2RpY29tV29ya3N0YXRpb25SZWFkaW5lc3N9XG4gICAgICAgICAgICAgIGRpc2NvdmVyTWlncmF0aW9uU291cmNlcz17ZGlzY292ZXJNaWdyYXRpb25Tb3VyY2VzfVxuICAgICAgICAgICAgICBkaXNjb3ZlckRpY29tRm9sZGVycz17ZGlzY292ZXJEaWNvbUZvbGRlcnN9XG4gICAgICAgICAgICAgIGRvY3VtZW50RGV0ZWN0ZWRLaW5kTGFiZWw9e2RvY3VtZW50RGV0ZWN0ZWRLaW5kTGFiZWx9XG4gICAgICAgICAgICAgIGRvY3VtZW50SW5nZXN0aW9uPXtkb2N1bWVudEluZ2VzdGlvbn1cbiAgICAgICAgICAgICAgZG9jdW1lbnRJbmdlc3Rpb25RdWFsaXR5TGFiZWxzPXtkb2N1bWVudEluZ2VzdGlvblF1YWxpdHlMYWJlbHN9XG4gICAgICAgICAgICAgIGRvY3VtZW50SW5nZXN0aW9uVGFyZ2V0PXtkb2N1bWVudEluZ2VzdGlvblRhcmdldH1cbiAgICAgICAgICAgICAgZG9jdW1lbnRMYWJlbHM9e2RvY3VtZW50TGFiZWxzfVxuICAgICAgICAgICAgICBkb3dubG9hZERpY29tVmlld2VyVG9vbFN0YXRlQnVuZGxlPXtkb3dubG9hZERpY29tVmlld2VyVG9vbFN0YXRlQnVuZGxlfVxuICAgICAgICAgICAgICBkb3dubG9hZERpY29tV29ya2JlbmNoTWFuaWZlc3Q9e2Rvd25sb2FkRGljb21Xb3JrYmVuY2hNYW5pZmVzdH1cbiAgICAgICAgICAgICAgZG93bmxvYWRNaWdyYXRpb25IYW5kb2ZmUmVwb3J0PXtkb3dubG9hZE1pZ3JhdGlvbkhhbmRvZmZSZXBvcnR9XG4gICAgICAgICAgICAgIGRvd25sb2FkUGVyc2lzdGVuY2VFeHBvcnQ9e2Rvd25sb2FkUGVyc2lzdGVuY2VFeHBvcnR9XG4gICAgICAgICAgICAgIGRvd25sb2FkU21hcnRJbXBvcnRTYWZlSGFuZG9mZlJlcG9ydD17ZG93bmxvYWRTbWFydEltcG9ydFNhZmVIYW5kb2ZmUmVwb3J0fVxuICAgICAgICAgICAgICBkb3dubG9hZFNtYXJ0SW1wb3J0UmVwb3J0PXtkb3dubG9hZFNtYXJ0SW1wb3J0UmVwb3J0fVxuICAgICAgICAgICAgICBkb3dubG9hZFRlbGVncmFtUXJTdmc9e2Rvd25sb2FkVGVsZWdyYW1RclN2Z31cbiAgICAgICAgICAgICAgZmlsdGVyZWRUZWxlZ3JhbU91dGJveEl0ZW1zPXtmaWx0ZXJlZFRlbGVncmFtT3V0Ym94SXRlbXN9XG4gICAgICAgICAgICAgIGZvcm1hdEJ5dGVTaXplPXtmb3JtYXRCeXRlU2l6ZX1cbiAgICAgICAgICAgICAgZm9ybWF0RGF0ZVRpbWU9e2Zvcm1hdERhdGVUaW1lfVxuICAgICAgICAgICAgICBmb3JtYXRNZWdhYnl0ZXM9e2Zvcm1hdE1lZ2FieXRlc31cbiAgICAgICAgICAgICAgZm9ybWF0VGltZT17Zm9ybWF0VGltZX1cbiAgICAgICAgICAgICAgaGFuZGxlQnJvd3NlckRpcmVjdG9yeUlucHV0Q2hhbmdlPXtoYW5kbGVCcm93c2VyRGlyZWN0b3J5SW5wdXRDaGFuZ2V9XG4gICAgICAgICAgICAgIGhhbmRsZUJyb3dzZXJNaWdyYXRpb25JbnB1dENoYW5nZT17aGFuZGxlQnJvd3Nlck1pZ3JhdGlvbklucHV0Q2hhbmdlfVxuICAgICAgICAgICAgICBoaWRkZW5UZWxlZ3JhbU91dGJveEl0ZW1Db3VudD17aGlkZGVuVGVsZWdyYW1PdXRib3hJdGVtQ291bnR9XG4gICAgICAgICAgICAgIGltYWdpbmdDb25uZWN0b3JDYXJkcz17aW1hZ2luZ0Nvbm5lY3RvckNhcmRzfVxuICAgICAgICAgICAgICBpbWFnaW5nRm9sZGVyUGF0aD17aW1hZ2luZ0ZvbGRlclBhdGh9XG4gICAgICAgICAgICAgIGltYWdpbmdGb2xkZXJTY2FuPXtpbWFnaW5nRm9sZGVyU2Nhbn1cbiAgICAgICAgICAgICAgaW1hZ2luZ0ltcG9ydENvbW1pdD17aW1hZ2luZ0ltcG9ydENvbW1pdH1cbiAgICAgICAgICAgICAgaW1hZ2luZ0ltcG9ydFByZXZpZXc9e2ltYWdpbmdJbXBvcnRQcmV2aWV3fVxuICAgICAgICAgICAgICBpbWFnaW5nSW1wb3J0U291cmNlS2luZD17aW1hZ2luZ0ltcG9ydFNvdXJjZUtpbmR9XG4gICAgICAgICAgICAgIGltYWdpbmdJbXBvcnRUZXh0PXtpbWFnaW5nSW1wb3J0VGV4dH1cbiAgICAgICAgICAgICAgaW1hZ2luZ0tpbmRMYWJlbHM9e2ltYWdpbmdLaW5kTGFiZWxzfVxuICAgICAgICAgICAgICBjdFBsYW5uaW5nSW1wbGFudFBsYW49e2N0UGxhbm5pbmdJbXBsYW50UGxhbn1cbiAgICAgICAgICAgICAgY3RQbGFubmluZ0FjdGl2ZVF1aWNrQWN0aW9uSWQ9e2N0UGxhbm5pbmdBY3RpdmVRdWlja0FjdGlvbklkfVxuICAgICAgICAgICAgICBpbWFnaW5nVmlld2VyQWN0aXZlVG9vbD17aW1hZ2luZ1ZpZXdlckFjdGl2ZVRvb2x9XG4gICAgICAgICAgICAgIGltYWdpbmdTb3VyY2VDaG9pY2VzPXtpbWFnaW5nU291cmNlQ2hvaWNlc31cbiAgICAgICAgICAgICAgaW1hZ2luZ1NvdXJjZURldGFpbHM9e2ltYWdpbmdTb3VyY2VEZXRhaWxzfVxuICAgICAgICAgICAgICBpbWFnaW5nU291cmNlTGFiZWxzPXtpbWFnaW5nU291cmNlTGFiZWxzfVxuICAgICAgICAgICAgICBpbWFnaW5nVmlld2VyQ2FwYWJpbGl0aWVzPXtpbWFnaW5nVmlld2VyQ2FwYWJpbGl0aWVzfVxuICAgICAgICAgICAgICBpbXBvcnRDb21taXQ9e2ltcG9ydENvbW1pdH1cbiAgICAgICAgICAgICAgaW1wb3J0SW50YWtlPXtpbXBvcnRJbnRha2V9XG4gICAgICAgICAgICAgIGltcG9ydFByZXZpZXc9e2ltcG9ydFByZXZpZXd9XG4gICAgICAgICAgICAgIGltcG9ydFNvdXJjZUtpbmQ9e2ltcG9ydFNvdXJjZUtpbmR9XG4gICAgICAgICAgICAgIGltcG9ydFNvdXJjZUxhYmVscz17aW1wb3J0U291cmNlTGFiZWxzfVxuICAgICAgICAgICAgICBpbXBvcnRUZXh0PXtpbXBvcnRUZXh0fVxuICAgICAgICAgICAgICBpbmdlc3RJbXBvcnRGaWxlPXtpbmdlc3RJbXBvcnRGaWxlfVxuICAgICAgICAgICAgICBpbmdlc3Rpb25UYXJnZXRMYWJlbHM9e2luZ2VzdGlvblRhcmdldExhYmVsc31cbiAgICAgICAgICAgICAgaW50ZWdyYXRpb25DYXBhYmlsaXR5TGFiZWxzPXtpbnRlZ3JhdGlvbkNhcGFiaWxpdHlMYWJlbHN9XG4gICAgICAgICAgICAgIGludGVncmF0aW9uQ2F0ZWdvcnlMYWJlbHM9e2ludGVncmF0aW9uQ2F0ZWdvcnlMYWJlbHN9XG4gICAgICAgICAgICAgIGludGVncmF0aW9uU3RhdHVzTGFiZWxzPXtpbnRlZ3JhdGlvblN0YXR1c0xhYmVsc31cbiAgICAgICAgICAgICAgaXNCcm93c2VySW1hZ2luZ0ZvbGRlclBpY2tpbmc9e2lzQnJvd3NlckltYWdpbmdGb2xkZXJQaWNraW5nfVxuICAgICAgICAgICAgICBpc0Jyb3dzZXJNaWdyYXRpb25TY2FubmluZz17aXNCcm93c2VyTWlncmF0aW9uU2Nhbm5pbmd9XG4gICAgICAgICAgICAgIGlzQ2xpbmljYWxSdWxlU2F2aW5nPXtpc0NsaW5pY2FsUnVsZVNhdmluZ31cbiAgICAgICAgICAgICAgaXNEaWNvbUZpcnN0RnJhbWVQcmV2aWV3aW5nPXtpc0RpY29tRmlyc3RGcmFtZVByZXZpZXdpbmd9XG4gICAgICAgICAgICAgIGlzRGljb21Gb2xkZXJXb3JrdXBQbGFubmluZz17aXNEaWNvbUZvbGRlcldvcmt1cFBsYW5uaW5nfVxuICAgICAgICAgICAgICBpc0RpY29tTG9jYWxEaXNjb3ZlcmluZz17aXNEaWNvbUxvY2FsRGlzY292ZXJpbmd9XG4gICAgICAgICAgICAgIGlzRGljb21NYW5pZmVzdEJ1aWxkaW5nPXtpc0RpY29tTWFuaWZlc3RCdWlsZGluZ31cbiAgICAgICAgICAgICAgaXNEaWNvbVJlbmRlckNhY2hlUGxhbm5pbmc9e2lzRGljb21SZW5kZXJDYWNoZVBsYW5uaW5nfVxuICAgICAgICAgICAgICBpc0RpY29tU2VyaWVzUHJldmlld0xvYWRpbmc9e2lzRGljb21TZXJpZXNQcmV2aWV3TG9hZGluZ31cbiAgICAgICAgICAgICAgaXNEaWNvbVRvb2xTdGF0ZUJ1aWxkaW5nPXtpc0RpY29tVG9vbFN0YXRlQnVpbGRpbmd9XG4gICAgICAgICAgICAgIGlzRGljb21XZWJDaGVja2luZz17aXNEaWNvbVdlYkNoZWNraW5nfVxuICAgICAgICAgICAgICBpc0RpY29tV29ya2JlbmNoQnVpbGRpbmc9e2lzRGljb21Xb3JrYmVuY2hCdWlsZGluZ31cbiAgICAgICAgICAgICAgaXNEaWNvbVdvcmtiZW5jaFJlY29ubmVjdGluZz17aXNEaWNvbVdvcmtiZW5jaFJlY29ubmVjdGluZ31cbiAgICAgICAgICAgICAgaXNEaWNvbVdvcmtiZW5jaFNlcnZlclNhdmluZz17aXNEaWNvbVdvcmtiZW5jaFNlcnZlclNhdmluZ31cbiAgICAgICAgICAgICAgaXNEaWNvbVdvcmtzdGF0aW9uQ2hlY2tpbmc9e2lzRGljb21Xb3Jrc3RhdGlvbkNoZWNraW5nfVxuICAgICAgICAgICAgICBpc0NsaW5pY1B1YmxpY0xvb2t1cExvYWRpbmc9e2lzQ2xpbmljUHVibGljTG9va3VwTG9hZGluZ31cbiAgICAgICAgICAgICAgaXNJbWFnaW5nRm9sZGVyU2Nhbm5pbmc9e2lzSW1hZ2luZ0ZvbGRlclNjYW5uaW5nfVxuICAgICAgICAgICAgICBpc0xvY2FsRGljb21PcGVyYXRpb25BY3RpdmU9e2lzTG9jYWxEaWNvbU9wZXJhdGlvbkFjdGl2ZX1cbiAgICAgICAgICAgICAgaXNJbWFnaW5nSW1wb3J0Q29tbWl0dGluZz17aXNJbWFnaW5nSW1wb3J0Q29tbWl0dGluZ31cbiAgICAgICAgICAgICAgaXNJbWFnaW5nSW1wb3J0TG9hZGluZz17aXNJbWFnaW5nSW1wb3J0TG9hZGluZ31cbiAgICAgICAgICAgICAgaXNJbXBvcnRDb21taXR0aW5nPXtpc0ltcG9ydENvbW1pdHRpbmd9XG4gICAgICAgICAgICAgIGlzSW1wb3J0RGljdGF0aW5nPXtpc0ltcG9ydERpY3RhdGluZ31cbiAgICAgICAgICAgICAgaXNJbXBvcnRMb2FkaW5nPXtpc0ltcG9ydExvYWRpbmd9XG4gICAgICAgICAgICAgIGlzTG9jYWxJbWFnaW5nT3JnYW5pemluZz17aXNMb2NhbEltYWdpbmdPcmdhbml6aW5nfVxuICAgICAgICAgICAgICBpc01pZ3JhdGlvbkF1dG9waWxvdExvYWRpbmc9e2lzTWlncmF0aW9uQXV0b3BpbG90TG9hZGluZ31cbiAgICAgICAgICAgICAgaXNNaWdyYXRpb25IYW5kb2ZmUmVwb3J0TG9hZGluZz17aXNNaWdyYXRpb25IYW5kb2ZmUmVwb3J0TG9hZGluZ31cbiAgICAgICAgICAgICAgaXNNaWdyYXRpb25Tb3VyY2VEaXNjb3ZlcmluZz17aXNNaWdyYXRpb25Tb3VyY2VEaXNjb3ZlcmluZ31cbiAgICAgICAgICAgICAgaXNNaWdyYXRpb25Tb3VyY2VQcm9iZUxvYWRpbmc9e2lzTWlncmF0aW9uU291cmNlUHJvYmVMb2FkaW5nfVxuICAgICAgICAgICAgICBpc01pZ3JhdGlvblNvdXJjZVdvcmt1cExvYWRpbmc9e2lzTWlncmF0aW9uU291cmNlV29ya3VwTG9hZGluZ31cbiAgICAgICAgICAgICAgaXNQZXJzaXN0ZW5jZUV4cG9ydGluZz17aXNQZXJzaXN0ZW5jZUV4cG9ydGluZ31cbiAgICAgICAgICAgICAgaXNQcmljZWxpc3RBbmFseXppbmc9e2lzUHJpY2VsaXN0QW5hbHl6aW5nfVxuICAgICAgICAgICAgICBpc1JlY29nbml0aW9uTG9hZGluZz17aXNSZWNvZ25pdGlvbkxvYWRpbmd9XG4gICAgICAgICAgICAgIGlzU21hcnRJbXBvcnRDb21taXR0aW5nPXtpc1NtYXJ0SW1wb3J0Q29tbWl0dGluZ31cbiAgICAgICAgICAgICAgaXNTbWFydEltcG9ydExvYWRpbmc9e2lzU21hcnRJbXBvcnRMb2FkaW5nfVxuICAgICAgICAgICAgICBpc1NtYXJ0UmVwb3J0TG9hZGluZz17aXNTbWFydFJlcG9ydExvYWRpbmd9XG4gICAgICAgICAgICAgIGlzU21hcnRTYWZlUmVwb3J0TG9hZGluZz17aXNTbWFydFNhZmVSZXBvcnRMb2FkaW5nfVxuICAgICAgICAgICAgICBpc1RlbGVncmFtQ2hhdExpbmtzTG9hZGluZ01vcmU9e2lzVGVsZWdyYW1DaGF0TGlua3NMb2FkaW5nTW9yZX1cbiAgICAgICAgICAgICAgaXNUZWxlZ3JhbUxpbmtDb2Rlc0xvYWRpbmdNb3JlPXtpc1RlbGVncmFtTGlua0NvZGVzTG9hZGluZ01vcmV9XG4gICAgICAgICAgICAgIGlzVGVsZWdyYW1MaW5rQ3JlYXRpbmc9e2lzVGVsZWdyYW1MaW5rQ3JlYXRpbmd9XG4gICAgICAgICAgICAgIGlzVGVsZWdyYW1Mb2FkaW5nPXtpc1RlbGVncmFtTG9hZGluZ31cbiAgICAgICAgICAgICAgaXNUZWxlZ3JhbU91dGJveEl0ZW1EdWVGb3JVaT17aXNUZWxlZ3JhbU91dGJveEl0ZW1EdWVGb3JVaX1cbiAgICAgICAgICAgICAgaXNUZWxlZ3JhbU91dGJveExvYWRpbmdNb3JlPXtpc1RlbGVncmFtT3V0Ym94TG9hZGluZ01vcmV9XG4gICAgICAgICAgICAgIGlzVGVsZWdyYW1TZW5kaW5nRHVlPXtpc1RlbGVncmFtU2VuZGluZ0R1ZX1cbiAgICAgICAgICAgICAgaXNUZWxlZ3JhbVNldHRpbmdzU2F2aW5nPXtpc1RlbGVncmFtU2V0dGluZ3NTYXZpbmd9XG4gICAgICAgICAgICAgIGxhdGVzdERpY29tV29ya2JlbmNoU2VydmVyQnVuZGxlPXtsYXRlc3REaWNvbVdvcmtiZW5jaFNlcnZlckJ1bmRsZX1cbiAgICAgICAgICAgICAgbGVnYWxNaXNzaW5nRmllbGRzPXtsZWdhbE1pc3NpbmdGaWVsZHN9XG4gICAgICAgICAgICAgIGxlZ2FsUmVhZGluZXNzUGVyY2VudD17bGVnYWxSZWFkaW5lc3NQZXJjZW50fVxuICAgICAgICAgICAgICBsb2FkTG9jYWxCcmlkZ2VVc2VQbGFucz17bG9hZExvY2FsQnJpZGdlVXNlUGxhbnN9XG4gICAgICAgICAgICAgIGxvYWRNb3JlVGVsZWdyYW1DaGF0TGlua3M9e2xvYWRNb3JlVGVsZWdyYW1DaGF0TGlua3N9XG4gICAgICAgICAgICAgIGxvYWRNb3JlVGVsZWdyYW1MaW5rQ29kZXM9e2xvYWRNb3JlVGVsZWdyYW1MaW5rQ29kZXN9XG4gICAgICAgICAgICAgIGxvYWRNb3JlVGVsZWdyYW1PdXRib3g9e2xvYWRNb3JlVGVsZWdyYW1PdXRib3h9XG4gICAgICAgICAgICAgIGxvYWRQZXJzaXN0ZW5jZUhlYWx0aD17bG9hZFBlcnNpc3RlbmNlSGVhbHRofVxuICAgICAgICAgICAgICBsb2FkUGVyc2lzdGVuY2VJbnRlZ3JpdHk9e2xvYWRQZXJzaXN0ZW5jZUludGVncml0eX1cbiAgICAgICAgICAgICAgbG9hZFRlbGVncmFtQ29udHJvbFBsYW5lPXtsb2FkVGVsZWdyYW1Db250cm9sUGxhbmV9XG4gICAgICAgICAgICAgIGxvY2FsQnJpZGdlUmVhZGluZXNzPXtsb2NhbEJyaWRnZVJlYWRpbmVzc31cbiAgICAgICAgICAgICAgbG9jYWxCcmlkZ2VTdGF0dXNMYWJlbHM9e2xvY2FsQnJpZGdlU3RhdHVzTGFiZWxzfVxuICAgICAgICAgICAgICBsb2NhbEJyaWRnZVN0YXR1c1N0YXRlPXtsb2NhbEJyaWRnZVN0YXR1c1N0YXRlfVxuICAgICAgICAgICAgICBsb2NhbEJyaWRnZVN0YXR1c1ZhbHVlPXtsb2NhbEJyaWRnZVN0YXR1c1ZhbHVlfVxuICAgICAgICAgICAgICBsb2NhbEJyaWRnZVVzZVBhdGhMYWJlbHM9e2xvY2FsQnJpZGdlVXNlUGF0aExhYmVsc31cbiAgICAgICAgICAgICAgbG9jYWxCcmlkZ2VVc2VQbGFucz17bG9jYWxCcmlkZ2VVc2VQbGFuc31cbiAgICAgICAgICAgICAgbG9jYWxJbWFnaW5nRm9sZGVyRHJhZnQ9e2xvY2FsSW1hZ2luZ0ZvbGRlckRyYWZ0fVxuICAgICAgICAgICAgICBsb2NhbEltYWdpbmdNb2RlbFJvbGVMYWJlbHM9e2xvY2FsSW1hZ2luZ01vZGVsUm9sZUxhYmVsc31cbiAgICAgICAgICAgICAgbG9jYWxJbWFnaW5nT3JnYW5pemVyPXtsb2NhbEltYWdpbmdPcmdhbml6ZXJ9XG4gICAgICAgICAgICAgIGxvY2FsSW1hZ2luZ09yZ2FuaXplckFjdGlvbkxhYmVscz17bG9jYWxJbWFnaW5nT3JnYW5pemVyQWN0aW9uTGFiZWxzfVxuICAgICAgICAgICAgICBjYW5jZWxMb2NhbERpY29tT3BlcmF0aW9uPXtjYW5jZWxMb2NhbERpY29tT3BlcmF0aW9ufVxuICAgICAgICAgICAgICBsb29rdXBDbGluaWNQdWJsaWNQcm9maWxlPXtsb29rdXBDbGluaWNQdWJsaWNQcm9maWxlfVxuICAgICAgICAgICAgICBsb2NrVGVsZWdyYW1BZG1pblNlc3Npb249eygpID0+IGxvY2tUZWxlZ3JhbUFkbWluU2Vzc2lvbihzZXR0aW5nc0FkbWluU2VjcmV0RG9tYWluKX1cbiAgICAgICAgICAgICAgbWFya1RlbGVncmFtU2V0dGluZ3NEaXJ0eT17bWFya1RlbGVncmFtU2V0dGluZ3NEaXJ0eX1cbiAgICAgICAgICAgICAgbWlncmF0aW9uQXV0b3BpbG90PXttaWdyYXRpb25BdXRvcGlsb3R9XG4gICAgICAgICAgICAgIG1pZ3JhdGlvblNvdXJjZURpc2NvdmVyeT17bWlncmF0aW9uU291cmNlRGlzY292ZXJ5fVxuICAgICAgICAgICAgICBtaWdyYXRpb25Tb3VyY2VQcm9iZT17bWlncmF0aW9uU291cmNlUHJvYmV9XG4gICAgICAgICAgICAgIG1pZ3JhdGlvblNvdXJjZVdvcmt1cD17bWlncmF0aW9uU291cmNlV29ya3VwfVxuICAgICAgICAgICAgICBtcHJBeGlzRGVnPXttcHJBeGlzRGVnfVxuICAgICAgICAgICAgICBtcHJDYWNoZU1vZGVMYWJlbHM9e21wckNhY2hlTW9kZUxhYmVsc31cbiAgICAgICAgICAgICAgbXByQ3Jvc3NoYWlyRW5hYmxlZD17bXByQ3Jvc3NoYWlyRW5hYmxlZH1cbiAgICAgICAgICAgICAgbXByTGlua2VkUGxhbmVzRW5hYmxlZD17bXByTGlua2VkUGxhbmVzRW5hYmxlZH1cbiAgICAgICAgICAgICAgbXByTG9hZFN0cmF0ZWd5TGFiZWxzPXttcHJMb2FkU3RyYXRlZ3lMYWJlbHN9XG4gICAgICAgICAgICAgIG1wclByb2plY3Rpb249e21wclByb2plY3Rpb259XG4gICAgICAgICAgICAgIG1wclByb2plY3Rpb25MYWJlbHM9e21wclByb2plY3Rpb25MYWJlbHN9XG4gICAgICAgICAgICAgIG1wclJlc291cmNlVGllckxhYmVscz17bXByUmVzb3VyY2VUaWVyTGFiZWxzfVxuICAgICAgICAgICAgICBtcHJTbGljZUluZGV4PXttcHJTbGljZUluZGV4fVxuICAgICAgICAgICAgICBtcHJTbGFiTW09e21wclNsYWJNbX1cbiAgICAgICAgICAgICAgbXByVG9vbExhYmVscz17bXByVG9vbExhYmVsc31cbiAgICAgICAgICAgICAgbXByV29ya2JlbmNoRHJhZnRSZXN0b3JlZD17bXByV29ya2JlbmNoRHJhZnRSZXN0b3JlZH1cbiAgICAgICAgICAgICAgbXByV29ya2JlbmNoTG9jYWxTYXZlZEF0PXttcHJXb3JrYmVuY2hMb2NhbFNhdmVkQXR9XG4gICAgICAgICAgICAgIG1wcldpbmRvd1ByZXNldD17bXByV2luZG93UHJlc2V0fVxuICAgICAgICAgICAgICBtcHJXaW5kb3dQcmVzZXRMYWJlbHM9e21wcldpbmRvd1ByZXNldExhYmVsc31cbiAgICAgICAgICAgICAgbmV3Q2hhaXJIYXNNaWNyb3Njb3BlPXtuZXdDaGFpckhhc01pY3Jvc2NvcGV9XG4gICAgICAgICAgICAgIG5ld0NoYWlySGFzU3VyZ2VyeUtpdD17bmV3Q2hhaXJIYXNTdXJnZXJ5S2l0fVxuICAgICAgICAgICAgICBuZXdDaGFpckhhc1hyYXlTZW5zb3I9e25ld0NoYWlySGFzWHJheVNlbnNvcn1cbiAgICAgICAgICAgICAgbmV3Q2hhaXJOYW1lPXtuZXdDaGFpck5hbWV9XG4gICAgICAgICAgICAgIG5ld1J1bGVBY3Rpb249e25ld1J1bGVBY3Rpb259XG4gICAgICAgICAgICAgIG5ld1J1bGVCbG9ja2VkU2VydmljZUlkPXtuZXdSdWxlQmxvY2tlZFNlcnZpY2VJZH1cbiAgICAgICAgICAgICAgbmV3UnVsZUNhdGVnb3J5PXtuZXdSdWxlQ2F0ZWdvcnl9XG4gICAgICAgICAgICAgIG5ld1J1bGVDb21wbGV0ZWRTZXJ2aWNlSWQ9e25ld1J1bGVDb21wbGV0ZWRTZXJ2aWNlSWR9XG4gICAgICAgICAgICAgIG5ld1J1bGVPd25lclJvbGU9e25ld1J1bGVPd25lclJvbGV9XG4gICAgICAgICAgICAgIG5ld1J1bGVSZXF1aXJlZFNlcnZpY2VJZD17bmV3UnVsZVJlcXVpcmVkU2VydmljZUlkfVxuICAgICAgICAgICAgICBuZXdSdWxlU2V2ZXJpdHk9e25ld1J1bGVTZXZlcml0eX1cbiAgICAgICAgICAgICAgbmV3UnVsZVNwZWNpYWx0eT17bmV3UnVsZVNwZWNpYWx0eX1cbiAgICAgICAgICAgICAgbmV3UnVsZVRpdGxlPXtuZXdSdWxlVGl0bGV9XG4gICAgICAgICAgICAgIG5ld1J1bGVUcmlnZ2VyU2VydmljZUlkPXtuZXdSdWxlVHJpZ2dlclNlcnZpY2VJZH1cbiAgICAgICAgICAgICAgbmV3UnVsZVdhcm5pbmdUZXh0PXtuZXdSdWxlV2FybmluZ1RleHR9XG4gICAgICAgICAgICAgIG5ld1N0YWZmTmFtZT17bmV3U3RhZmZOYW1lfVxuICAgICAgICAgICAgICBuZXdTdGFmZlJvbGU9e25ld1N0YWZmUm9sZX1cbiAgICAgICAgICAgICAgbmV3U3RhZmZTcGVjaWFsdHk9e25ld1N0YWZmU3BlY2lhbHR5fVxuICAgICAgICAgICAgICBub3JtYWxpemVkQ2xpbmljYWxSdWxlQWN0aW9uPXtub3JtYWxpemVkQ2xpbmljYWxSdWxlQWN0aW9ufVxuICAgICAgICAgICAgICBub3JtYWxpemVkQ2xpbmljYWxSdWxlU2V2ZXJpdHk9e25vcm1hbGl6ZWRDbGluaWNhbFJ1bGVTZXZlcml0eX1cbiAgICAgICAgICAgICAgbm9ybWFsaXplZERlbnRhbFNwZWNpYWx0eT17bm9ybWFsaXplZERlbnRhbFNwZWNpYWx0eX1cbiAgICAgICAgICAgICAgbm9ybWFsaXplZFNlcnZpY2VDYXRlZ29yeT17bm9ybWFsaXplZFNlcnZpY2VDYXRlZ29yeX1cbiAgICAgICAgICAgICAgbm9ybWFsaXplZFN0YWZmUm9sZT17bm9ybWFsaXplZFN0YWZmUm9sZX1cbiAgICAgICAgICAgICAgbm9ybWFsaXplZFRlbGVncmFtQm90TW9kZT17bm9ybWFsaXplZFRlbGVncmFtQm90TW9kZX1cbiAgICAgICAgICAgICAgbm9ybWFsaXplZFRlbGVncmFtTGlua1N1YmplY3RUeXBlPXtub3JtYWxpemVkVGVsZWdyYW1MaW5rU3ViamVjdFR5cGV9XG4gICAgICAgICAgICAgIG5vcm1hbGl6ZWRUZWxlZ3JhbU91dGJveFN0YXR1c0ZpbHRlcj17bm9ybWFsaXplZFRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyfVxuICAgICAgICAgICAgICBub3JtYWxpemVkVGVsZWdyYW1PdXRib3hUZW1wbGF0ZUZpbHRlcj17bm9ybWFsaXplZFRlbGVncmFtT3V0Ym94VGVtcGxhdGVGaWx0ZXJ9XG4gICAgICAgICAgICAgIG5vcm1hbGl6ZWRUZWxlZ3JhbVByaXZhY3lNb2RlPXtub3JtYWxpemVkVGVsZWdyYW1Qcml2YWN5TW9kZX1cbiAgICAgICAgICAgICAgbm9ybWFsaXplVWlMYW5ndWFnZUlucHV0PXtub3JtYWxpemVVaUxhbmd1YWdlSW5wdXR9XG4gICAgICAgICAgICAgIG9oaWZCYXNlVXJsPXtvaGlmQmFzZVVybH1cbiAgICAgICAgICAgICAgb3JnYW5pemVMb2NhbEltYWdpbmdTb3VyY2VzPXtvcmdhbml6ZUxvY2FsSW1hZ2luZ1NvdXJjZXN9XG4gICAgICAgICAgICAgIHBlcnNpc3RlbmNlSGVhbHRoPXtwZXJzaXN0ZW5jZUhlYWx0aH1cbiAgICAgICAgICAgICAgcGVyc2lzdGVuY2VJbnRlZ3JpdHk9e3BlcnNpc3RlbmNlSW50ZWdyaXR5fVxuICAgICAgICAgICAgICBwaWNrQnJvd3NlckltYWdpbmdGb2xkZXI9e3BpY2tCcm93c2VySW1hZ2luZ0ZvbGRlcn1cbiAgICAgICAgICAgICAgcGlja0Jyb3dzZXJNaWdyYXRpb25Tb3VyY2U9e3BpY2tCcm93c2VyTWlncmF0aW9uU291cmNlfVxuICAgICAgICAgICAgICBwb2xpY3lBdWRpdEV2ZW50TGFiZWxzPXtwb2xpY3lBdWRpdEV2ZW50TGFiZWxzfVxuICAgICAgICAgICAgICBwcmVwYXJlRGljb21Xb3JrYmVuY2hGcm9tRm9sZGVyPXtwcmVwYXJlRGljb21Xb3JrYmVuY2hGcm9tRm9sZGVyfVxuICAgICAgICAgICAgICBwcmV2aWV3RGljb21GaXJzdEZyYW1lPXtwcmV2aWV3RGljb21GaXJzdEZyYW1lfVxuICAgICAgICAgICAgICBwcmV2aWV3RGljb21GaXJzdEZyYW1lU2xpY2U9e3ByZXZpZXdEaWNvbUZpcnN0RnJhbWVTbGljZX1cbiAgICAgICAgICAgICAgcHJldmlld0RpY29tU2VyaWVzPXtwcmV2aWV3RGljb21TZXJpZXN9XG4gICAgICAgICAgICAgIHBsYW5NaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGU9e3BsYW5NaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGV9XG4gICAgICAgICAgICAgIHByZXZpZXdNaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGU9e3ByZXZpZXdNaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGV9XG4gICAgICAgICAgICAgIHByZXZpZXdNaWdyYXRpb25BdXRvcGlsb3RTb3VyY2VzPXtwcmV2aWV3TWlncmF0aW9uQXV0b3BpbG90U291cmNlc31cbiAgICAgICAgICAgICAgcHJvYmVNaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGU9e3Byb2JlTWlncmF0aW9uRGlzY292ZXJ5Q2FuZGlkYXRlfVxuICAgICAgICAgICAgICBydW5NaWdyYXRpb25BdXRvcGlsb3Q9e3J1bk1pZ3JhdGlvbkF1dG9waWxvdH1cbiAgICAgICAgICAgICAgcHJldmlld0ltYWdpbmdJbXBvcnQ9e3ByZXZpZXdJbWFnaW5nSW1wb3J0fVxuICAgICAgICAgICAgICBwcmV2aWV3SW1wb3J0PXtwcmV2aWV3SW1wb3J0fVxuICAgICAgICAgICAgICBwcmV2aWV3U21hcnRJbXBvcnQ9e3ByZXZpZXdTbWFydEltcG9ydH1cbiAgICAgICAgICAgICAgcHJldmlld1RlbGVncmFtVGVtcGxhdGU9e3ByZXZpZXdUZWxlZ3JhbVRlbXBsYXRlfVxuICAgICAgICAgICAgICBwcmljZWxpc3RBbmFseXNpcz17cHJpY2VsaXN0QW5hbHlzaXN9XG4gICAgICAgICAgICAgIHByaWNlbGlzdEltYWdlQmFzZTY0PXtwcmljZWxpc3RJbWFnZUJhc2U2NH1cbiAgICAgICAgICAgICAgcHJpY2VsaXN0SW1hZ2VOYW1lPXtwcmljZWxpc3RJbWFnZU5hbWV9XG4gICAgICAgICAgICAgIHByaWNlbGlzdEltYWdlTm90ZT17cHJpY2VsaXN0SW1hZ2VOb3RlfVxuICAgICAgICAgICAgICBwcmljZWxpc3RJdGVtTWF0ZXJpYWxUZXh0PXtwcmljZWxpc3RJdGVtTWF0ZXJpYWxUZXh0fVxuICAgICAgICAgICAgICBwcmljZWxpc3RNYXRlcmlhbFN1bW1hcnlUZXh0PXtwcmljZWxpc3RNYXRlcmlhbFN1bW1hcnlUZXh0fVxuICAgICAgICAgICAgICBwcmljZWxpc3RXYXJuaW5nc1RleHQ9e3ByaWNlbGlzdFdhcm5pbmdzVGV4dH1cbiAgICAgICAgICAgICAgcHJpY2VsaXN0UGFyc2VyTW9kZUxhYmVscz17cHJpY2VsaXN0UGFyc2VyTW9kZUxhYmVsc31cbiAgICAgICAgICAgICAgcHJpY2VsaXN0UmVjb2duaXRpb25CcmFuZEdyb3Vwcz17cHJpY2VsaXN0UmVjb2duaXRpb25CcmFuZEdyb3Vwc31cbiAgICAgICAgICAgICAgcHJpY2VsaXN0UmVjb2duaXRpb25TZXJ2aWNlR3JvdXBzPXtwcmljZWxpc3RSZWNvZ25pdGlvblNlcnZpY2VHcm91cHN9XG4gICAgICAgICAgICAgIHByaWNlbGlzdFNvdXJjZUtpbmQ9e3ByaWNlbGlzdFNvdXJjZUtpbmR9XG4gICAgICAgICAgICAgIHByaWNlbGlzdFNvdXJjZUtpbmRMYWJlbHM9e3ByaWNlbGlzdFNvdXJjZUtpbmRMYWJlbHN9XG4gICAgICAgICAgICAgIHByaWNlbGlzdFRleHQ9e3ByaWNlbGlzdFRleHR9XG4gICAgICAgICAgICAgIHJlY29nbml0aW9uSm9iPXtyZWNvZ25pdGlvbkpvYn1cbiAgICAgICAgICAgICAgcmVjb2duaXRpb25LaW5kPXtyZWNvZ25pdGlvbktpbmR9XG4gICAgICAgICAgICAgIHJlY29nbml0aW9uUHJlc2V0cz17cmVjb2duaXRpb25QcmVzZXRzfVxuICAgICAgICAgICAgICByZWNvZ25pdGlvblRhcmdldD17cmVjb2duaXRpb25UYXJnZXR9XG4gICAgICAgICAgICAgIHJlY29nbml0aW9uVGFyZ2V0TGFiZWxzPXtyZWNvZ25pdGlvblRhcmdldExhYmVsc31cbiAgICAgICAgICAgICAgcmVjb2duaXRpb25UZXh0PXtyZWNvZ25pdGlvblRleHR9XG4gICAgICAgICAgICAgIHJlY29ubmVjdERpY29tV29ya2JlbmNoRnJvbUN1cnJlbnRGb2xkZXI9e3JlY29ubmVjdERpY29tV29ya2JlbmNoRnJvbUN1cnJlbnRGb2xkZXJ9XG4gICAgICAgICAgICAgIHJlZnJlc2hCcm93c2VyQ29udGludWl0eT17cmVmcmVzaEJyb3dzZXJDb250aW51aXR5fVxuICAgICAgICAgICAgICByZWZyZXNoU3BlZWNoUnVudGltZT17cmVmcmVzaFNwZWVjaFJ1bnRpbWV9XG4gICAgICAgICAgICAgIGNsaW5pY1B1YmxpY0xvb2t1cD17Y2xpbmljUHVibGljTG9va3VwfVxuICAgICAgICAgICAgICBhZGRNaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGVUb1NtYXJ0SW1wb3J0PXthZGRNaWdyYXRpb25EaXNjb3ZlcnlDYW5kaWRhdGVUb1NtYXJ0SW1wb3J0fVxuICAgICAgICAgICAgICByZW1lbWJlckxvY2FsSW1hZ2luZ0ZvbGRlcj17cmVtZW1iZXJMb2NhbEltYWdpbmdGb2xkZXJ9XG4gICAgICAgICAgICAgIHJlb3Blbk9uYm9hcmRpbmc9e3Jlb3Blbk9uYm9hcmRpbmd9XG4gICAgICAgICAgICAgIHJlcXVlc3RCcm93c2VyU3RvcmFnZVBlcnNpc3RlbmNlPXtyZXF1ZXN0QnJvd3NlclN0b3JhZ2VQZXJzaXN0ZW5jZX1cbiAgICAgICAgICAgICAgcmVzdG9yZURpY29tV29ya2JlbmNoU2VydmVyQnVuZGxlPXtyZXN0b3JlRGljb21Xb3JrYmVuY2hTZXJ2ZXJCdW5kbGV9XG4gICAgICAgICAgICAgIHJlc3RvcmVNcHJXb3JrYmVuY2hMb2NhbERyYWZ0PXtyZXN0b3JlTXByV29ya2JlbmNoTG9jYWxEcmFmdH1cbiAgICAgICAgICAgICAgcmV2b2tlVGVsZWdyYW1DaGF0TGluaz17cmV2b2tlVGVsZWdyYW1DaGF0TGlua31cbiAgICAgICAgICAgICAgcnVuUmVjb2duaXRpb25Kb2I9e3J1blJlY29nbml0aW9uSm9ifVxuICAgICAgICAgICAgICBzYXZlQ2hhaXJTY2hlZHVsZT17c2F2ZUNoYWlyU2NoZWR1bGV9XG4gICAgICAgICAgICAgIHNhdmVDbGluaWNQcm9maWxlRnJvbURyYWZ0PXtzYXZlQ2xpbmljUHJvZmlsZUZyb21EcmFmdH1cbiAgICAgICAgICAgICAgc2F2ZURpY29tV29ya2JlbmNoQnVuZGxlVG9TZXJ2ZXI9e3NhdmVEaWNvbVdvcmtiZW5jaEJ1bmRsZVRvU2VydmVyfVxuICAgICAgICAgICAgICBzYXZlU3RhZmZTY2hlZHVsZT17c2F2ZVN0YWZmU2NoZWR1bGV9XG4gICAgICAgICAgICAgIHNhdmVUZWxlZ3JhbVNldHRpbmdzPXtzYXZlVGVsZWdyYW1TZXR0aW5nc31cbiAgICAgICAgICAgICAgc2NhbkRpY29tRm9sZGVyU2VyaWVzPXtzY2FuRGljb21Gb2xkZXJTZXJpZXN9XG4gICAgICAgICAgICAgIHNjYW5JbWFnaW5nRm9sZGVyPXtzY2FuSW1hZ2luZ0ZvbGRlcn1cbiAgICAgICAgICAgICAgc2VsZWN0ZWRVaUxhbmd1YWdlT3B0aW9uPXtzZWxlY3RlZFVpTGFuZ3VhZ2VPcHRpb259XG4gICAgICAgICAgICAgIHNlbmREdWVUZWxlZ3JhbU91dGJveD17c2VuZER1ZVRlbGVncmFtT3V0Ym94fVxuICAgICAgICAgICAgICBzZW5kUmVjb2duaXRpb25SZXN1bHRUb0ltcG9ydD17c2VuZFJlY29nbml0aW9uUmVzdWx0VG9JbXBvcnR9XG4gICAgICAgICAgICAgIHNlbmRUZWxlZ3JhbU91dGJveEl0ZW09e3NlbmRUZWxlZ3JhbU91dGJveEl0ZW19XG4gICAgICAgICAgICAgIHNlcnZpY2VDYXRlZ29yeUxhYmVscz17c2VydmljZUNhdGVnb3J5TGFiZWxzfVxuICAgICAgICAgICAgICBzZXJ2aWNlVGl0bGU9e3NlcnZpY2VUaXRsZX1cbiAgICAgICAgICAgICAgc2V0RGljb21GaXJzdEZyYW1lUHJldmlldz17c2V0RGljb21GaXJzdEZyYW1lUHJldmlld31cbiAgICAgICAgICAgICAgc2V0RGljb21GaXJzdEZyYW1lVmlld2VyU3RhdGU9e3NldERpY29tRmlyc3RGcmFtZVZpZXdlclN0YXRlfVxuICAgICAgICAgICAgICBzZXREaWNvbUZvbGRlclNlcmllc1NjYW49e3NldERpY29tRm9sZGVyU2VyaWVzU2Nhbn1cbiAgICAgICAgICAgICAgc2V0RGljb21Gb2xkZXJXb3JrdXBQbGFuPXtzZXREaWNvbUZvbGRlcldvcmt1cFBsYW59XG4gICAgICAgICAgICAgIHNldERpY29tTG9jYWxGb2xkZXJEaXNjb3Zlcnk9e3NldERpY29tTG9jYWxGb2xkZXJEaXNjb3Zlcnl9XG4gICAgICAgICAgICAgIHNldERpY29tUmVuZGVyQ2FjaGVQbGFuPXtzZXREaWNvbVJlbmRlckNhY2hlUGxhbn1cbiAgICAgICAgICAgICAgc2V0RGljb21TZXJpZXNQcmV2aWV3PXtzZXREaWNvbVNlcmllc1ByZXZpZXd9XG4gICAgICAgICAgICAgIHNldERpY29tVmlld2VyTGF1bmNoTWFuaWZlc3Q9e3NldERpY29tVmlld2VyTGF1bmNoTWFuaWZlc3R9XG4gICAgICAgICAgICAgIHNldERpY29tVmlld2VyVG9vbFN0YXRlQnVuZGxlPXtzZXREaWNvbVZpZXdlclRvb2xTdGF0ZUJ1bmRsZX1cbiAgICAgICAgICAgICAgc2V0RGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdD17c2V0RGljb21WaWV3ZXJXb3JrYmVuY2hNYW5pZmVzdH1cbiAgICAgICAgICAgICAgc2V0RGljb21XZWJDaGVjaz17c2V0RGljb21XZWJDaGVja31cbiAgICAgICAgICAgICAgc2V0RGljb21XZWJFbmRwb2ludFVybD17c2V0RGljb21XZWJFbmRwb2ludFVybH1cbiAgICAgICAgICAgICAgc2V0RGljb21Xb3JrYmVuY2hMb2NhbFNhdmVkQXQ9e3NldERpY29tV29ya2JlbmNoTG9jYWxTYXZlZEF0fVxuICAgICAgICAgICAgICBzZXREaWNvbVdvcmtzdGF0aW9uUmVhZGluZXNzPXtzZXREaWNvbVdvcmtzdGF0aW9uUmVhZGluZXNzfVxuICAgICAgICAgICAgICBzZXREb2N1bWVudEluZ2VzdGlvblRhcmdldD17c2V0RG9jdW1lbnRJbmdlc3Rpb25UYXJnZXR9XG4gICAgICAgICAgICAgIHNldEltYWdpbmdGb2xkZXJQYXRoPXtzZXRJbWFnaW5nRm9sZGVyUGF0aH1cbiAgICAgICAgICAgICAgc2V0SW1hZ2luZ0ZvbGRlclNjYW49e3NldEltYWdpbmdGb2xkZXJTY2FufVxuICAgICAgICAgICAgICBzZXRJbWFnaW5nSW1wb3J0Q29tbWl0PXtzZXRJbWFnaW5nSW1wb3J0Q29tbWl0fVxuICAgICAgICAgICAgICBzZXRJbWFnaW5nSW1wb3J0UHJldmlldz17c2V0SW1hZ2luZ0ltcG9ydFByZXZpZXd9XG4gICAgICAgICAgICAgIHNldEltYWdpbmdJbXBvcnRTb3VyY2VLaW5kPXtzZXRJbWFnaW5nSW1wb3J0U291cmNlS2luZH1cbiAgICAgICAgICAgICAgc2V0SW1hZ2luZ0ltcG9ydFRleHQ9e3NldEltYWdpbmdJbXBvcnRUZXh0fVxuICAgICAgICAgICAgICBzZWxlY3RDdFBsYW5uaW5nSW1wbGFudD17c2VsZWN0Q3RQbGFubmluZ0ltcGxhbnR9XG4gICAgICAgICAgICAgIHNldEltYWdpbmdWaWV3ZXJBY3RpdmVUb29sPXtzZXRJbWFnaW5nVmlld2VyQWN0aXZlVG9vbH1cbiAgICAgICAgICAgICAgc2V0Q3RQbGFubmluZ0FjdGl2ZVF1aWNrQWN0aW9uSWQ9e3NldEN0UGxhbm5pbmdBY3RpdmVRdWlja0FjdGlvbklkfVxuICAgICAgICAgICAgICBzZXRJbXBvcnRDb21taXQ9e3NldEltcG9ydENvbW1pdH1cbiAgICAgICAgICAgICAgc2V0SW1wb3J0SW50YWtlPXtzZXRJbXBvcnRJbnRha2V9XG4gICAgICAgICAgICAgIHNldEltcG9ydFByZXZpZXc9e3NldEltcG9ydFByZXZpZXd9XG4gICAgICAgICAgICAgIHNldEltcG9ydFNvdXJjZUtpbmQ9e3NldEltcG9ydFNvdXJjZUtpbmR9XG4gICAgICAgICAgICAgIHNldEltcG9ydFRleHQ9e3NldEltcG9ydFRleHR9XG4gICAgICAgICAgICAgIHNldExvY2FsSW1hZ2luZ09yZ2FuaXplcj17c2V0TG9jYWxJbWFnaW5nT3JnYW5pemVyfVxuICAgICAgICAgICAgICBzZXRNcHJBeGlzRGVnPXtzZXRNcHJBeGlzRGVnfVxuICAgICAgICAgICAgICBzZXRNcHJDcm9zc2hhaXJFbmFibGVkPXtzZXRNcHJDcm9zc2hhaXJFbmFibGVkfVxuICAgICAgICAgICAgICBzZXRNcHJMaW5rZWRQbGFuZXNFbmFibGVkPXtzZXRNcHJMaW5rZWRQbGFuZXNFbmFibGVkfVxuICAgICAgICAgICAgICBzZXRNcHJQcm9qZWN0aW9uPXtzZXRNcHJQcm9qZWN0aW9ufVxuICAgICAgICAgICAgICBzZXRNcHJTbGljZUluZGV4PXtzZXRNcHJTbGljZUluZGV4fVxuICAgICAgICAgICAgICBzZXRNcHJTbGFiTW09e3NldE1wclNsYWJNbX1cbiAgICAgICAgICAgICAgc2V0TXByV2luZG93UHJlc2V0PXtzZXRNcHJXaW5kb3dQcmVzZXR9XG4gICAgICAgICAgICAgIHNldE5ld0NoYWlySGFzTWljcm9zY29wZT17c2V0TmV3Q2hhaXJIYXNNaWNyb3Njb3BlfVxuICAgICAgICAgICAgICBzZXROZXdDaGFpckhhc1N1cmdlcnlLaXQ9e3NldE5ld0NoYWlySGFzU3VyZ2VyeUtpdH1cbiAgICAgICAgICAgICAgc2V0TmV3Q2hhaXJIYXNYcmF5U2Vuc29yPXtzZXROZXdDaGFpckhhc1hyYXlTZW5zb3J9XG4gICAgICAgICAgICAgIHNldE5ld0NoYWlyTmFtZT17c2V0TmV3Q2hhaXJOYW1lfVxuICAgICAgICAgICAgICBzZXROZXdSdWxlQWN0aW9uPXtzZXROZXdSdWxlQWN0aW9ufVxuICAgICAgICAgICAgICBzZXROZXdSdWxlQmxvY2tlZFNlcnZpY2VJZD17c2V0TmV3UnVsZUJsb2NrZWRTZXJ2aWNlSWR9XG4gICAgICAgICAgICAgIHNldE5ld1J1bGVDYXRlZ29yeT17c2V0TmV3UnVsZUNhdGVnb3J5fVxuICAgICAgICAgICAgICBzZXROZXdSdWxlQ29tcGxldGVkU2VydmljZUlkPXtzZXROZXdSdWxlQ29tcGxldGVkU2VydmljZUlkfVxuICAgICAgICAgICAgICBzZXROZXdSdWxlT3duZXJSb2xlPXtzZXROZXdSdWxlT3duZXJSb2xlfVxuICAgICAgICAgICAgICBzZXROZXdSdWxlUmVxdWlyZWRTZXJ2aWNlSWQ9e3NldE5ld1J1bGVSZXF1aXJlZFNlcnZpY2VJZH1cbiAgICAgICAgICAgICAgc2V0TmV3UnVsZVNldmVyaXR5PXtzZXROZXdSdWxlU2V2ZXJpdHl9XG4gICAgICAgICAgICAgIHNldE5ld1J1bGVTcGVjaWFsdHk9e3NldE5ld1J1bGVTcGVjaWFsdHl9XG4gICAgICAgICAgICAgIHNldE5ld1J1bGVUaXRsZT17c2V0TmV3UnVsZVRpdGxlfVxuICAgICAgICAgICAgICBzZXROZXdSdWxlVHJpZ2dlclNlcnZpY2VJZD17c2V0TmV3UnVsZVRyaWdnZXJTZXJ2aWNlSWR9XG4gICAgICAgICAgICAgIHNldE5ld1J1bGVXYXJuaW5nVGV4dD17c2V0TmV3UnVsZVdhcm5pbmdUZXh0fVxuICAgICAgICAgICAgICBzZXROZXdTdGFmZk5hbWU9e3NldE5ld1N0YWZmTmFtZX1cbiAgICAgICAgICAgICAgc2V0TmV3U3RhZmZSb2xlPXtzZXROZXdTdGFmZlJvbGV9XG4gICAgICAgICAgICAgIHNldE5ld1N0YWZmU3BlY2lhbHR5PXtzZXROZXdTdGFmZlNwZWNpYWx0eX1cbiAgICAgICAgICAgICAgc2V0T2hpZkJhc2VVcmw9e3NldE9oaWZCYXNlVXJsfVxuICAgICAgICAgICAgICBzZXRQcmljZWxpc3RBbmFseXNpcz17c2V0UHJpY2VsaXN0QW5hbHlzaXN9XG4gICAgICAgICAgICAgIHNldFByaWNlbGlzdFNvdXJjZUtpbmQ9e3NldFByaWNlbGlzdFNvdXJjZUtpbmR9XG4gICAgICAgICAgICAgIHNldFByaWNlbGlzdFRleHQ9e3NldFByaWNlbGlzdFRleHR9XG4gICAgICAgICAgICAgIHNldFJlY29nbml0aW9uSm9iPXtzZXRSZWNvZ25pdGlvbkpvYn1cbiAgICAgICAgICAgICAgc2V0UmVjb2duaXRpb25UZXh0PXtzZXRSZWNvZ25pdGlvblRleHR9XG4gICAgICAgICAgICAgIHNldFNldHRpbmdzVGFiPXtzZXRTZXR0aW5nc1RhYn1cbiAgICAgICAgICAgICAgc2V0U21hcnRJbXBvcnRDb21taXQ9e3NldFNtYXJ0SW1wb3J0Q29tbWl0fVxuICAgICAgICAgICAgICBzZXRTbWFydEltcG9ydE1vZGU9e3NldFNtYXJ0SW1wb3J0TW9kZX1cbiAgICAgICAgICAgICAgc2V0U21hcnRJbXBvcnRQcmV2aWV3PXtzZXRTbWFydEltcG9ydFByZXZpZXd9XG4gICAgICAgICAgICAgIHNldFNtYXJ0SW1wb3J0VGV4dD17c2V0U21hcnRJbXBvcnRUZXh0fVxuICAgICAgICAgICAgICBzZXRUZWxlZ3JhbUFkbWluU2VjcmV0RHJhZnQ9e1xuICAgICAgICAgICAgICAgIHNldHRpbmdzQWRtaW5TZWNyZXREb21haW4gPT09IFwidGVsZWdyYW1cIiA/IHNldFRlbGVncmFtQWRtaW5TZWNyZXREcmFmdCA6IHNldFNldHRpbmdzQWRtaW5TZWNyZXREcmFmdFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBzZXR0aW5nc1RhYj17c2V0dGluZ3NUYWJ9XG4gICAgICAgICAgICAgIHNldHRpbmdzVGFicz17c2V0dGluZ3NUYWJzfVxuICAgICAgICAgICAgICBzZXRVaUxhbmd1YWdlPXtzZXRVaUxhbmd1YWdlfVxuICAgICAgICAgICAgICBzZXRVc2VQcmljZWxpc3RBaT17c2V0VXNlUHJpY2VsaXN0QWl9XG4gICAgICAgICAgICAgIHNtYXJ0SW1wb3J0Q29tbWl0PXtzbWFydEltcG9ydENvbW1pdH1cbiAgICAgICAgICAgICAgc21hcnRJbXBvcnRNb2RlPXtzbWFydEltcG9ydE1vZGV9XG4gICAgICAgICAgICAgIHNtYXJ0SW1wb3J0TW9kZUxhYmVscz17c21hcnRJbXBvcnRNb2RlTGFiZWxzfVxuICAgICAgICAgICAgICBzbWFydEltcG9ydFByZXZpZXc9e3NtYXJ0SW1wb3J0UHJldmlld31cbiAgICAgICAgICAgICAgc21hcnRJbXBvcnRUZXh0PXtzbWFydEltcG9ydFRleHR9XG4gICAgICAgICAgICAgIHNwZWNpYWx0eUxhYmVscz17c3BlY2lhbHR5TGFiZWxzfVxuICAgICAgICAgICAgICBzcGVlY2hHYXRld2F5Q2FuVXBsb2FkPXtzcGVlY2hHYXRld2F5Q2FuVXBsb2FkfVxuICAgICAgICAgICAgICBzcGVlY2hHYXRld2F5SGVhbHRoUmVwb3J0PXtzcGVlY2hHYXRld2F5SGVhbHRoUmVwb3J0fVxuICAgICAgICAgICAgICBzcGVlY2hHYXRld2F5U3RhdHVzPXtzcGVlY2hHYXRld2F5U3RhdHVzfVxuICAgICAgICAgICAgICBzcGVlY2hQcm92aWRlckNvbm5lY3RvckxhYmVscz17c3BlZWNoUHJvdmlkZXJDb25uZWN0b3JMYWJlbHN9XG4gICAgICAgICAgICAgIHNwZWVjaFByb3ZpZGVySGVhbHRoQnlJZD17c3BlZWNoUHJvdmlkZXJIZWFsdGhCeUlkfVxuICAgICAgICAgICAgICBzcGVlY2hQcm92aWRlckhlYWx0aExhYmVscz17c3BlZWNoUHJvdmlkZXJIZWFsdGhMYWJlbHN9XG4gICAgICAgICAgICAgIHNwZWVjaFByb3ZpZGVyTW9kZUxhYmVscz17c3BlZWNoUHJvdmlkZXJNb2RlTGFiZWxzfVxuICAgICAgICAgICAgICBzcGVlY2hQcm92aWRlclJ1bnRpbWVCeUlkPXtzcGVlY2hQcm92aWRlclJ1bnRpbWVCeUlkfVxuICAgICAgICAgICAgICBzcGVlY2hQcm92aWRlclNlbGVjdGlvbkxhYmVscz17c3BlZWNoUHJvdmlkZXJTZWxlY3Rpb25MYWJlbHN9XG4gICAgICAgICAgICAgIHNwZWVjaFByb3ZpZGVyU3RhdHVzTGFiZWxzPXtzcGVlY2hQcm92aWRlclN0YXR1c0xhYmVsc31cbiAgICAgICAgICAgICAgc3BlZWNoUmVjb3JkaW5nUGF0aExhYmVscz17c3BlZWNoUmVjb3JkaW5nUGF0aExhYmVsc31cbiAgICAgICAgICAgICAgc3BlZWNoUmVjb3JkaW5nUmVjb3Zlcnk9e3NwZWVjaFJlY29yZGluZ1JlY292ZXJ5fVxuICAgICAgICAgICAgICBzcGVlY2hSZWNvcmRpbmdTdHJhdGVneT17c3BlZWNoUmVjb3JkaW5nU3RyYXRlZ3l9XG4gICAgICAgICAgICAgIHNwZWVjaFJlY292ZXJ5U3RhdGVMYWJlbHM9e3NwZWVjaFJlY292ZXJ5U3RhdGVMYWJlbHN9XG4gICAgICAgICAgICAgIHN0YWZmUm9sZUxhYmVscz17c3RhZmZSb2xlTGFiZWxzfVxuICAgICAgICAgICAgICBzdGFmZlNjaGVkdWxlRHJhZnRGcm9tV29ya2luZ0hvdXJzPXtzdGFmZlNjaGVkdWxlRHJhZnRGcm9tV29ya2luZ0hvdXJzfVxuICAgICAgICAgICAgICBzdGFnZUxvY2FsSW1hZ2luZ0ZvbGRlclJlY292ZXJ5PXtzdGFnZUxvY2FsSW1hZ2luZ0ZvbGRlclJlY292ZXJ5fVxuICAgICAgICAgICAgICBzdGFydEltcG9ydERpY3RhdGlvbj17c3RhcnRJbXBvcnREaWN0YXRpb259XG4gICAgICAgICAgICAgIHRlbGVncmFtQWRtaW5TZWNyZXREcmFmdD17c2V0dGluZ3NBZG1pblNlY3JldERvbWFpbiA9PT0gXCJ0ZWxlZ3JhbVwiID8gdGVsZWdyYW1BZG1pblNlY3JldERyYWZ0IDogc2V0dGluZ3NBZG1pblNlY3JldERyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUFkbWluU2VjcmV0U2Vzc2lvbj17c2V0dGluZ3NBZG1pblNlY3JldERvbWFpbiA9PT0gXCJ0ZWxlZ3JhbVwiID8gdGVsZWdyYW1BZG1pblNlY3JldFNlc3Npb24gOiBzZXR0aW5nc0FkbWluU2VjcmV0U2Vzc2lvbn1cbiAgICAgICAgICAgICAgdGVsZWdyYW1BbGxvd1ZvaWNlSW50YWtlRHJhZnQ9e3RlbGVncmFtQWxsb3dWb2ljZUludGFrZURyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUJvdENvbmZpZ0lkPXt0ZWxlZ3JhbUJvdENvbmZpZ0lkfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUJvdFVzZXJuYW1lRHJhZnQ9e3RlbGVncmFtQm90VXNlcm5hbWVEcmFmdH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1DaGF0TGlua0xlZGdlcj17dGVsZWdyYW1DaGF0TGlua0xlZGdlcn1cbiAgICAgICAgICAgICAgdGVsZWdyYW1DaGF0TGlua3M9e3RlbGVncmFtQ2hhdExpbmtzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUNsYXNzaWZpY2F0aW9uTGFiZWxzPXt0ZWxlZ3JhbUNsYXNzaWZpY2F0aW9uTGFiZWxzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbURlbGl2ZXJ5U3RhdHVzTGFiZWxzPXt0ZWxlZ3JhbURlbGl2ZXJ5U3RhdHVzTGFiZWxzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUVuYWJsZWRGZWF0dXJlc0RyYWZ0PXt0ZWxlZ3JhbUVuYWJsZWRGZWF0dXJlc0RyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUZlYXR1cmVIZWxwPXt0ZWxlZ3JhbUZlYXR1cmVIZWxwfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUZlYXR1cmVMYWJlbD17dGVsZWdyYW1GZWF0dXJlTGFiZWx9XG4gICAgICAgICAgICAgIHRlbGVncmFtRmVhdHVyZU9wdGlvbnM9e3RlbGVncmFtRmVhdHVyZU9wdGlvbnN9XG4gICAgICAgICAgICAgIHRlbGVncmFtRmVhdHVyZVBsYW49e3RlbGVncmFtRmVhdHVyZVBsYW59XG4gICAgICAgICAgICAgIHRlbGVncmFtSHVtYW5NZXNzYWdlPXt0ZWxlZ3JhbUh1bWFuTWVzc2FnZX1cbiAgICAgICAgICAgICAgdGVsZWdyYW1JbmxpbmVCdXR0b25LaW5kTGFiZWxzPXt0ZWxlZ3JhbUlubGluZUJ1dHRvbktpbmRMYWJlbHN9XG4gICAgICAgICAgICAgIHRlbGVncmFtSW5saW5lQnV0dG9uUm93c0Zyb21SZXBseU1hcmt1cD17dGVsZWdyYW1JbmxpbmVCdXR0b25Sb3dzRnJvbVJlcGx5TWFya3VwfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbUxpbmtBY3Rpb25TdGF0ZT17dGVsZWdyYW1MaW5rQWN0aW9uU3RhdGV9XG4gICAgICAgICAgICAgIHRlbGVncmFtTGlua0NvZGU9e3RlbGVncmFtTGlua0NvZGV9XG4gICAgICAgICAgICAgIHRlbGVncmFtTGlua0NvZGVMZWRnZXI9e3RlbGVncmFtTGlua0NvZGVMZWRnZXJ9XG4gICAgICAgICAgICAgIHRlbGVncmFtTGlua0NvZGVzPXt0ZWxlZ3JhbUxpbmtDb2Rlc31cbiAgICAgICAgICAgICAgdGVsZWdyYW1MaW5rQ29kZVN0YXR1c0xhYmVscz17dGVsZWdyYW1MaW5rQ29kZVN0YXR1c0xhYmVsc31cbiAgICAgICAgICAgICAgdGVsZWdyYW1MaW5rU3RhZmZJZD17dGVsZWdyYW1MaW5rU3RhZmZJZH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1MaW5rU3RhZmZPcHRpb25zPXt0ZWxlZ3JhbUxpbmtTdGFmZk9wdGlvbnN9XG4gICAgICAgICAgICAgIHRlbGVncmFtTGlua1N1YmplY3RUeXBlPXt0ZWxlZ3JhbUxpbmtTdWJqZWN0VHlwZX1cbiAgICAgICAgICAgICAgdGVsZWdyYW1NYXBzVXJsRHJhZnQ9e3RlbGVncmFtTWFwc1VybERyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbU1vZGVEcmFmdD17dGVsZWdyYW1Nb2RlRHJhZnR9XG4gICAgICAgICAgICAgIHRlbGVncmFtTW9kZUhpbnRzPXt0ZWxlZ3JhbU1vZGVIaW50c31cbiAgICAgICAgICAgICAgdGVsZWdyYW1Nb2RlTGFiZWxzPXt0ZWxlZ3JhbU1vZGVMYWJlbHN9XG4gICAgICAgICAgICAgIHRlbGVncmFtT3V0Ym94PXt0ZWxlZ3JhbU91dGJveH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1PdXRib3hTdGF0dXNGaWx0ZXI9e3RlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbU91dGJveFN0YXR1c0ZpbHRlckxhYmVscz17dGVsZWdyYW1PdXRib3hTdGF0dXNGaWx0ZXJMYWJlbHN9XG4gICAgICAgICAgICAgIHRlbGVncmFtT3V0Ym94U3RhdHVzRmlsdGVyT3B0aW9ucz17dGVsZWdyYW1PdXRib3hTdGF0dXNGaWx0ZXJPcHRpb25zfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyPXt0ZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyTGFiZWxzPXt0ZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyTGFiZWxzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbU91dGJveFRlbXBsYXRlRmlsdGVyT3B0aW9ucz17dGVsZWdyYW1PdXRib3hUZW1wbGF0ZUZpbHRlck9wdGlvbnN9XG4gICAgICAgICAgICAgIHRlbGVncmFtT3duQm90VXNlcm5hbWVEcmFmdD17dGVsZWdyYW1Pd25Cb3RVc2VybmFtZURyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVBhdGllbnRQb3J0YWxCYXNlVXJsRHJhZnQ9e3RlbGVncmFtUGF0aWVudFBvcnRhbEJhc2VVcmxEcmFmdH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1Qb3N0VmlzaXRDaGVja3VwRGVsYXlEcmFmdHM9e3RlbGVncmFtUG9zdFZpc2l0Q2hlY2t1cERlbGF5RHJhZnRzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheUZpZWxkcz17dGVsZWdyYW1Qb3N0VmlzaXRDaGVja3VwRGVsYXlGaWVsZHN9XG4gICAgICAgICAgICAgIHRlbGVncmFtUHJldmlldz17dGVsZWdyYW1QcmV2aWV3fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVByaXZhY3lNb2RlRHJhZnQ9e3RlbGVncmFtUHJpdmFjeU1vZGVEcmFmdH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1Qcml2YWN5TW9kZUhpbnRzPXt0ZWxlZ3JhbVByaXZhY3lNb2RlSGludHN9XG4gICAgICAgICAgICAgIHRlbGVncmFtUHJpdmFjeU1vZGVMYWJlbHM9e3RlbGVncmFtUHJpdmFjeU1vZGVMYWJlbHN9XG4gICAgICAgICAgICAgIHRlbGVncmFtUXJTdmdUb0RhdGFVcmw9e3RlbGVncmFtUXJTdmdUb0RhdGFVcmx9XG4gICAgICAgICAgICAgIHRlbGVncmFtUmVtaW5kZXJMZWFkVGltZXNEcmFmdD17dGVsZWdyYW1SZW1pbmRlckxlYWRUaW1lc0RyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVJldmlld1JlcXVlc3REZWxheURyYWZ0PXt0ZWxlZ3JhbVJldmlld1JlcXVlc3REZWxheURyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVJldmlld1VybERyYWZ0PXt0ZWxlZ3JhbVJldmlld1VybERyYWZ0fVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVJldm9raW5nTGlua0lkPXt0ZWxlZ3JhbVJldm9raW5nTGlua0lkfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVNlbmRpbmdJdGVtSWQ9e3RlbGVncmFtU2VuZGluZ0l0ZW1JZH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1TZXR0aW5nc0RpcnR5PXt0ZWxlZ3JhbVNldHRpbmdzRGlydHl9XG4gICAgICAgICAgICAgIHRlbGVncmFtU2V0dGluZ3NTYXZlRXJyb3I9e3RlbGVncmFtU2V0dGluZ3NTYXZlRXJyb3J9XG4gICAgICAgICAgICAgIHRlbGVncmFtU2V0dGluZ3NTYXZlU3RhdGU9e3RlbGVncmFtU2V0dGluZ3NTYXZlU3RhdGV9XG4gICAgICAgICAgICAgIHRlbGVncmFtU3RhZmZFc2NhbGF0aW9uQ2hhbm5lbERyYWZ0PXt0ZWxlZ3JhbVN0YWZmRXNjYWxhdGlvbkNoYW5uZWxEcmFmdH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1TdGF0dXM9e3RlbGVncmFtU3RhdHVzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVN1YmplY3ROYW1lPXt0ZWxlZ3JhbVN1YmplY3ROYW1lfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVRlbXBsYXRlTGFiZWxzPXt0ZWxlZ3JhbVRlbXBsYXRlTGFiZWxzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVRva2VuVHRsRHJhZnQ9e3RlbGVncmFtVG9rZW5UdGxEcmFmdH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1WaXN1YWxDYXJkRmllbGRzPXt0ZWxlZ3JhbVZpc3VhbENhcmRGaWVsZHN9XG4gICAgICAgICAgICAgIHRlbGVncmFtVmlzdWFsQ2FyZFVybERyYWZ0cz17dGVsZWdyYW1WaXN1YWxDYXJkVXJsRHJhZnRzfVxuICAgICAgICAgICAgICB0ZWxlZ3JhbVdlYmhvb2tCYXNlVXJsRHJhZnQ9e3RlbGVncmFtV2ViaG9va0Jhc2VVcmxEcmFmdH1cbiAgICAgICAgICAgICAgdGVsZWdyYW1XZWxjb21lSW1hZ2VVcmxEcmFmdD17dGVsZWdyYW1XZWxjb21lSW1hZ2VVcmxEcmFmdH1cbiAgICAgICAgICAgICAgdG9nZ2xlQ2hhaXJXb3JraW5nRGF5PXt0b2dnbGVDaGFpcldvcmtpbmdEYXl9XG4gICAgICAgICAgICAgIHRvZ2dsZUNsaW5pY2FsUnVsZT17dG9nZ2xlQ2xpbmljYWxSdWxlfVxuICAgICAgICAgICAgICB0b2dnbGVDbGluaWNXb3JraW5nRGF5PXt0b2dnbGVDbGluaWNXb3JraW5nRGF5fVxuICAgICAgICAgICAgICB0b2dnbGVTdGFmZldvcmtpbmdEYXk9e3RvZ2dsZVN0YWZmV29ya2luZ0RheX1cbiAgICAgICAgICAgICAgdG9nZ2xlVGVsZWdyYW1GZWF0dXJlPXt0b2dnbGVUZWxlZ3JhbUZlYXR1cmV9XG4gICAgICAgICAgICAgIHVpTGFuZ3VhZ2U9e3VpTGFuZ3VhZ2V9XG4gICAgICAgICAgICAgIHVpTGFuZ3VhZ2VPcHRpb25zPXt1aUxhbmd1YWdlT3B0aW9uc31cbiAgICAgICAgICAgICAgdW5sb2NrVGVsZWdyYW1BZG1pblNlc3Npb249eygpID0+IHVubG9ja1RlbGVncmFtQWRtaW5TZXNzaW9uKHNldHRpbmdzQWRtaW5TZWNyZXREb21haW4pfVxuICAgICAgICAgICAgICB1cGRhdGVDaGFpclNjaGVkdWxlRGF5PXt1cGRhdGVDaGFpclNjaGVkdWxlRGF5fVxuICAgICAgICAgICAgICB1cGRhdGVDaGFpclNjaGVkdWxlRHJhZnQ9e3VwZGF0ZUNoYWlyU2NoZWR1bGVEcmFmdH1cbiAgICAgICAgICAgICAgdXBkYXRlQ2xpbmljUHJvZmlsZURyYWZ0PXt1cGRhdGVDbGluaWNQcm9maWxlRHJhZnR9XG4gICAgICAgICAgICAgIHVwZGF0ZVN0YWZmU2NoZWR1bGVEYXk9e3VwZGF0ZVN0YWZmU2NoZWR1bGVEYXl9XG4gICAgICAgICAgICAgIHVwZGF0ZVN0YWZmU2NoZWR1bGVEcmFmdD17dXBkYXRlU3RhZmZTY2hlZHVsZURyYWZ0fVxuICAgICAgICAgICAgICB1cGRhdGVUZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheURyYWZ0PXt1cGRhdGVUZWxlZ3JhbVBvc3RWaXNpdENoZWNrdXBEZWxheURyYWZ0fVxuICAgICAgICAgICAgICB1cGRhdGVUZWxlZ3JhbVZpc3VhbENhcmRVcmxEcmFmdD17dXBkYXRlVGVsZWdyYW1WaXN1YWxDYXJkVXJsRHJhZnR9XG4gICAgICAgICAgICAgIHVzZVByaWNlbGlzdEFpPXt1c2VQcmljZWxpc3RBaX1cbiAgICAgICAgICAgICAgdmlzaWJsZVRlbGVncmFtT3V0Ym94SXRlbXM9e3Zpc2libGVUZWxlZ3JhbU91dGJveEl0ZW1zfVxuICAgICAgICAgICAgICB3ZWVrZGF5T3B0aW9ucz17d2Vla2RheU9wdGlvbnN9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZVNjb3BlTGFiZWxzPXt3b3Jrc3BhY2VTY29wZUxhYmVsc31cbiAgICAgICAgICAgICAgc3RhZmZTY2hlZHVsZURpcnR5SWRzPXtzdGFmZlNjaGVkdWxlRGlydHlJZHN9XG4gICAgICAgICAgICAgIHN0YWZmU2NoZWR1bGVEcmFmdHM9e3N0YWZmU2NoZWR1bGVEcmFmdHN9XG4gICAgICAgICAgICAgIHN0YWZmU2NoZWR1bGVTYXZlU3RhdGVzPXtzdGFmZlNjaGVkdWxlU2F2ZVN0YXRlc31cbiAgICAgICAgICAgICAgc3RhZmZTY2hlZHVsZVNhdmluZ0lkPXtzdGFmZlNjaGVkdWxlU2F2aW5nSWR9XG4gICAgICAgICAgICAgIGNoYWlyU2NoZWR1bGVEaXJ0eUlkcz17Y2hhaXJTY2hlZHVsZURpcnR5SWRzfVxuICAgICAgICAgICAgICBjaGFpclNjaGVkdWxlRHJhZnRzPXtjaGFpclNjaGVkdWxlRHJhZnRzfVxuICAgICAgICAgICAgICBjaGFpclNjaGVkdWxlU2F2ZVN0YXRlcz17Y2hhaXJTY2hlZHVsZVNhdmVTdGF0ZXN9XG4gICAgICAgICAgICAgIGNoYWlyU2NoZWR1bGVTYXZpbmdJZD17Y2hhaXJTY2hlZHVsZVNhdmluZ0lkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgIDwvV29ya3NwYWNlUm91dGVFcnJvckJvdW5kYXJ5PlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7Y3VycmVudFZpZXcgPT09IFwibWFya2V0aW5nXCIgPyAoXG4gICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8QXBwTG9hZGluZ1N0YXRlIG1lc3NhZ2U9XCLQl9Cw0LPRgNGD0LfQutCwINC80LDRgNC60LXRgtC40L3Qs9CwXCIgLz59PlxuICAgICAgICAgICAgPE1hcmtldGluZ1ZpZXcgY2xpbmljTmFtZT17ZGFzaGJvYXJkLmNsaW5pY05hbWV9IGNsaW5pY1Bob25lPXtjbGluaWNQcm9maWxlRHJhZnQucGhvbmV9IC8+XG4gICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgPFZvaWNlQXNzaXN0YW50VUkgXG4gICAgICAgICAgb25OYXZpZ2F0ZT17KHZpZXcpID0+IHtcbiAgICAgICAgICAgIHNldEN1cnJlbnRWaWV3KHZpZXcpO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSB2aWV3O1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25TZWFyY2hRdWVyeT17KHEpID0+IHtcbiAgICAgICAgICAgIHNldFF1ZXJ5KHEpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25EYXRlQ2hhbmdlPXsoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgc2V0U2NoZWR1bGVEYXRlRmlsdGVyKGRhdGUpO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxPbW5pYmFyIC8+XG4gICAgICAgIDxDb21tYW5kUGFsZXR0ZSBcbiAgICAgICAgICBwYXRpZW50cz17ZmlsdGVyZWRQYXRpZW50c30gXG4gICAgICAgICAgb25TZWxlY3RQYXRpZW50PXsoaWQpID0+IHtcbiAgICAgICAgICAgIHNldFNlbGVjdGVkUGF0aWVudElkKGlkKTtcbiAgICAgICAgICAgIHNldEN1cnJlbnRWaWV3KFwicGF0aWVudHNcIik7XG4gICAgICAgICAgfX0gXG4gICAgICAgICAgb25OYXZpZ2F0ZT17KHZpZXcpID0+IHNldEN1cnJlbnRWaWV3KHZpZXcgYXMgYW55KX0gXG4gICAgICAgIC8+XG4gICAgICA8L3NlY3Rpb24+XG4gICAgPC9tYWluPlxuICApO1xufVxuXG4iXSwiZmlsZSI6IkM6L0NsaW5pY19NVlAvZGVudGFsLWNybS9hcHBzL3dlYi9zcmMvQXBwLnRzeCJ9