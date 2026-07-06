const fs = require('fs');

function main() {
  const filePath = 'src/useAppLogic.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add import
  const importAnchor = 'import { useSettingsStore } from "./store/settingsStore";';
  if (!content.includes('import { useMprLogic } from "./hooks/useMprLogic";')) {
    content = content.replace(importAnchor, `${importAnchor}\nimport { useMprLogic } from "./hooks/useMprLogic";`);
  }

  // 2. Locate starting block of MPR logic inside the hook
  const startTarget = `  const cbctWorkbenchSeries =
    dicomSeriesPreview?.series.find((series) => series.mprReadiness.volumeCandidate) ??
    dicomSeriesPreview?.series.find((series) => series.recommendedViewer === "cbct_mpr") ??
    null;
  const mprSliceMaxIndex = Math.max(0, (cbctWorkbenchSeries?.fileCount ?? 1) - 1);
  const mprSafeSliceIndex = clampMprSliceIndex(mprSliceIndex, mprSliceMaxIndex);`;

  const mprHookCall = `  const mpr = useMprLogic({
    selectedImagingStudy,
    activeOrganizationId,
    setError
  });
  const {
    mprSliceMaxIndex,
    mprSafeSliceIndex,
    currentMprWorkbenchState,
    cbctWorkbenchSeries,
    cbctWorkbenchSeriesKey,
    cbctWorkbenchProjections,
    cbctWorkbenchTools,
    cbctWorkbenchPlanes,
    mprControlsReady,
    mprControlsAutoOpen,
    mprCenterSliceIndex,
    mprAxisDirectionLabel,
    mprAxisAngleBadge,
    mprSlabBadge,
    mprSliceBadge,
    mprSlabVisualWidth,
    mprSlicePositionPercent,
    mprCurrentSliceFraction,
    mprSliceLabel,
    mprAxisRangeValue,
    mprSlabRangeValue,
    mprSliceRangeValue,
    mprAxisVisualizerStyle,
    mprActiveProjectionLabel,
    mprActiveProjectionOrientation,
    mprProjectionCompass,
    mprAxisGuidance,
    mprNearestClinicalPreset,
    mprClinicalInput,
    mprWorkbenchSummaryText,
    mprOperatorSummaryCards,
    mprAxisVisualizerLabel,
    mprClinicalChecklist,
    mprClinicalNextStep,
    mprClinicalPresetButtonClass,
    applyDefaultMprWorkbenchState,
    resetMprControls,
    applyMprClinicalPreset,
    applyCtPlanningQuickAction,
    createCtPlanningArtifact,
    selectCtPlanningImplant,
    applyNearestMprClinicalPreset,
    handleMprKeyboardNavigation,
    applyMprWorkbenchState,
    restoreMprWorkbenchLocalDraft
  } = mpr;`;

  if (!content.includes(startTarget)) {
    console.error('Could not find start target for MPR logic');
    process.exit(1);
  }
  content = content.replace(startTarget, mprHookCall);

  // 3. Remove currentMprWorkbenchState and cbctWorkbenchSeriesKey declarations
  const midTarget = `  const currentMprWorkbenchState = useMemo<MprWorkbenchState>(
    () => ({
      projection: mprProjection,
      axisDeg: mprAxisDeg,
      slabMm: mprSlabMm,
      sliceIndex: mprSafeSliceIndex,
      windowPreset: mprWindowPreset,
      crosshair: mprCrosshairEnabled,
      linkedPlanes: mprLinkedPlanesEnabled
    }),
    [mprAxisDeg, mprCrosshairEnabled, mprLinkedPlanesEnabled, mprProjection, mprSafeSliceIndex, mprSlabMm, mprWindowPreset]
  );
  const cbctWorkbenchSeriesKey = useMemo(() => mprWorkbenchSeriesKey(cbctWorkbenchSeries), [cbctWorkbenchSeries]);`;

  if (content.includes(midTarget)) {
    content = content.replace(midTarget, '');
  }

  // 4. Remove all computed MPR logic from cbctWorkbenchProjections to restoreMprWorkbenchLocalDraft
  // We locate the exact start and end of this block.
  const blockStartAnchor = '  const cbctWorkbenchProjections = useMemo<MprProjection[]>';
  const blockEndAnchor = `    applyMprWorkbenchState(draft.state);
    setMprWorkbenchLocalSavedAt(draft.clientSavedAt);
    setMprWorkbenchDraftRestored(true);
    setError(null);
  }`;

  const startIndex = content.indexOf(blockStartAnchor);
  const endIndex = content.indexOf(blockEndAnchor);

  if (startIndex === -1 || endIndex === -1) {
    console.error(`Could not locate MPR block boundaries: start=${startIndex}, end=${endIndex}`);
    process.exit(1);
  }

  const blockEndLength = blockEndAnchor.length;
  const fullBlock = content.substring(startIndex, endIndex + blockEndLength);
  content = content.replace(fullBlock, '');

  // 5. Remove useEffects for MPR
  const effectAnchor1 = `  useEffect(() => {
    if (!cbctWorkbenchProjections.includes(mprProjection)) {
      setMprProjection(resolveMprWorkbenchProjection(mprProjection, cbctWorkbenchProjections));
    }
  }, [cbctWorkbenchProjections, mprProjection]);`;

  const effectAnchor2 = `  useEffect(() => {
    setMprSliceIndex((value: any) => clampMprSliceIndex(value, mprSliceMaxIndex));
  }, [mprSliceMaxIndex]);`;

  const effectAnchor3 = `  useEffect(() => {
    if (!cbctWorkbenchSeriesKey || !mprControlsReady) {
      setMprWorkbenchLocalSavedAt(null);
      setMprWorkbenchDraftRestored(false);
      return;
    }
    let cancelled = false;
    const restore = async () => {
      const draft = await loadLocalMprWorkbenchDraft(cbctWorkbenchSeriesKey, activeOrganizationId);
      if (cancelled) return;
      if (!draft) {
        applyDefaultMprWorkbenchState();
        setMprWorkbenchLocalSavedAt(null);
        setMprWorkbenchDraftRestored(false);
        return;
      }
      applyMprWorkbenchState(draft.state);
      setMprWorkbenchLocalSavedAt(draft.clientSavedAt);
      setMprWorkbenchDraftRestored(true);
    };
    void restore();
    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId, cbctWorkbenchProjections, cbctWorkbenchSeriesKey, mprControlsReady]);`;

  const effectAnchor4 = `  useEffect(() => {
    if (!cbctWorkbenchSeriesKey || !mprControlsReady) return;
    if (mprWorkbenchSaveTimerRef.current) window.clearTimeout(mprWorkbenchSaveTimerRef.current);
    const clientSavedAt = new Date().toISOString();
    mprWorkbenchSaveTimerRef.current = window.setTimeout(() => {
      void saveLocalMprWorkbenchDraft(
        cbctWorkbenchSeriesKey,
        currentMprWorkbenchState,
        clientSavedAt,
        activeOrganizationId
      ).then((saved) => {
        if (saved) setMprWorkbenchLocalSavedAt(clientSavedAt);
      });
    }, 350);
    return () => {
      if (mprWorkbenchSaveTimerRef.current) window.clearTimeout(mprWorkbenchSaveTimerRef.current);
    };
  }, [activeOrganizationId, cbctWorkbenchSeriesKey, currentMprWorkbenchState, mprControlsReady]);`;

  if (content.includes(effectAnchor1)) content = content.replace(effectAnchor1, '');
  if (content.includes(effectAnchor2)) content = content.replace(effectAnchor2, '');
  if (content.includes(effectAnchor3)) content = content.replace(effectAnchor3, '');
  if (content.includes(effectAnchor4)) content = content.replace(effectAnchor4, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully refactored useAppLogic.tsx');
}

main();
