const fs = require('fs');
let src = fs.readFileSync('apps/web/src/ScheduleView.tsx', 'utf8');

const importLine1 = 'import { AppointmentCard } from "./components/schedule/AppointmentCard";\n';
const importLine2 = 'import { NewAppointmentForm } from "./components/schedule/NewAppointmentForm";\n';
if (!src.includes('AppointmentCard')) src = importLine1 + src;
if (!src.includes('NewAppointmentForm')) src = importLine2 + src;

// 1. Remove the huge state vars that went to NewAppointmentForm.
// Actually, NewAppointmentForm needs `useManualSelects` which is NOT in NewAppointmentForm, but it is in ScheduleView.
// But wait! ScheduleView currently HAS useManualSelects. I just need to remove the others.
const stateVarsToRemove = `  const [smartInputText, setSmartInputText] = useState("");
  const [showSmartPreview, setShowSmartPreview] = useState(false);
  const [smartParsedData, setSmartParsedData] = useState<Partial<AppointmentScheduleDraft> | null>(null);
  const [showHints, setShowHints] = useState(false);`;
src = src.replace(stateVarsToRemove, '');

const isolatedVarsToRemove = `  const newAppointmentStartsAtMs = Date.parse(newAppointmentDraft.startsAt);
  const newAppointmentEndsAtMs = Date.parse(newAppointmentDraft.endsAt);
  const newAppointmentMissingSteps = [
    !newAppointmentDraft.patientId ? "выберите пациента" : null,
    !newAppointmentDraft.doctorUserId ? "выберите врача" : null,
    dashboard.clinicSettings.profile.mode !== "solo_doctor" && dashboard.clinicSettings.staff.some(s => s.role === "assistant" && s.active) && !newAppointmentDraft.assistantUserId ? "выберите ассистента" : null,
    !newAppointmentDraft.chairId ? "выберите кресло" : null,
    !newAppointmentDraft.startsAt.trim() ? "укажите начало приема" : null,
    newAppointmentDraft.startsAt.trim() && !Number.isFinite(newAppointmentStartsAtMs) ? "проверьте дату начала" : null,
    !newAppointmentDraft.endsAt.trim() ? "укажите окончание приема" : null,
    newAppointmentDraft.endsAt.trim() && !Number.isFinite(newAppointmentEndsAtMs) ? "проверьте дату окончания" : null,
    Number.isFinite(newAppointmentStartsAtMs) && Number.isFinite(newAppointmentEndsAtMs) && newAppointmentEndsAtMs <= newAppointmentStartsAtMs
      ? "окончание должно быть позже начала"
      : null
  ].filter((step): step is string => Boolean(step));
  const newAppointmentReadyToCreate = newAppointmentMissingSteps.length === 0;`;
src = src.replace(isolatedVarsToRemove, '');

// 2. Replace the form block
const formStart = src.indexOf('<div className="appointment-create-wrapper"');
const formEnd = src.indexOf('<div className="schedule-timeline timeline">');
if (formStart !== -1 && formEnd !== -1) {
  const newFormBlock = `<NewAppointmentForm
              dashboard={dashboard}
              appointmentLabels={appointmentLabels}
              newAppointmentDraft={newAppointmentDraft}
              newAppointmentSaveState={newAppointmentSaveState}
              newAppointmentError={newAppointmentError}
              updateNewAppointmentDraft={updateNewAppointmentDraft as any}
              createAppointmentFromDraft={createAppointmentFromDraft}
              resetNewAppointmentDraft={resetNewAppointmentDraft}
              toDateTimeLocalValue={toDateTimeLocalValue}
              fromDateTimeLocalValue={fromDateTimeLocalValue}
              useManualSelects={useManualSelects}
              setUseManualSelects={setUseManualSelects}
            />\n            `;
  src = src.substring(0, formStart) + newFormBlock + src.substring(formEnd);
} else {
  throw new Error("Form block not found");
}

// 3. Replace the map block
const mapStartString = '{sortedAppointments.map((appointment) => {';
const mapStartIndex = src.indexOf(mapStartString);
const emptyStateString = '{sortedAppointments.length === 0 ? (';
const emptyStateIndex = src.indexOf(emptyStateString);

if (mapStartIndex !== -1 && emptyStateIndex !== -1) {
  let mapEndIndex = src.lastIndexOf('}', emptyStateIndex); // } from '})}'
  mapEndIndex = src.lastIndexOf(')', mapEndIndex - 1); // )
  mapEndIndex = src.lastIndexOf('}', mapEndIndex - 1); // } from '})'

  const newMapBlock = `{sortedAppointments.map((appointment) => {
                const draft = appointmentScheduleDrafts.get(appointment.id) || appointmentScheduleDraftFromAppointment(appointment);
                const saveState = appointmentScheduleSaveStates.get(appointment.id) || 'idle';
                const error = appointmentScheduleErrors.get(appointment.id) || null;
                const dirty = appointmentScheduleDirtyIds.has(appointment.id);
                const isEditing = editingAppointmentId === appointment.id;
                const hasOpenVisit = dashboard.activeVisit && dashboard.activeVisit.appointmentId === appointment.id;
                const startsAtMs = Date.parse(draft.startsAt);
                const endsAtMs = Date.parse(draft.endsAt);
                
                const missingSteps = [
                  !draft.patientId ? 'выберите пациента' : null,
                  !draft.doctorUserId ? 'выберите врача' : null,
                  dashboard.clinicSettings.profile.mode !== 'solo_doctor' && dashboard.clinicSettings.staff.some(s => s.role === 'assistant' && s.active) && !draft.assistantUserId ? 'выберите ассистента' : null,
                  !draft.chairId ? 'выберите кресло' : null,
                  !draft.startsAt.trim() ? 'укажите начало приема' : null,
                  draft.startsAt.trim() && !Number.isFinite(startsAtMs) ? 'проверьте дату начала' : null,
                  !draft.endsAt.trim() ? 'укажите окончание приема' : null,
                  draft.endsAt.trim() && !Number.isFinite(endsAtMs) ? 'проверьте дату окончания' : null,
                  Number.isFinite(startsAtMs) && Number.isFinite(endsAtMs) && endsAtMs <= startsAtMs
                    ? 'окончание должно быть позже начала'
                    : null
                ].filter((step) => Boolean(step));
                const readyToSave = missingSteps.length === 0 && dirty;

                return (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    dashboard={dashboard}
                    visibleScheduleSuggestions={visibleScheduleSuggestions}
                    appointmentReadinessById={appointmentReadinessById}
                    appointmentLabels={appointmentLabels}
                    appointmentDraft={draft}
                    appointmentSaveState={saveState}
                    appointmentSaveError={error}
                    appointmentDirty={dirty}
                    appointmentEditing={isEditing}
                    appointmentHasOpenVisit={Boolean(hasOpenVisit)}
                    appointmentActiveVisitStatusLocked={Boolean(hasOpenVisit && activeVisitLockedAppointmentStatuses.has(draft.status))}
                    appointmentMissingSteps={missingSteps as string[]}
                    appointmentReadyToSave={readyToSave}
                    openScheduleSuggestion={openScheduleSuggestion}
                    formatTime={formatTime}
                    patientName={patientName}
                    openAppointmentEditor={openAppointmentEditor}
                    closeAppointmentEditor={closeAppointmentEditor}
                    updateAppointmentScheduleDraft={updateAppointmentScheduleDraft as any}
                    saveAppointmentSchedule={saveAppointmentSchedule}
                    normalizedAppointmentStatus={normalizedAppointmentStatus}
                    toDateTimeLocalValue={toDateTimeLocalValue}
                    fromDateTimeLocalValue={fromDateTimeLocalValue}
                    useManualSelects={useManualSelects}
                    activeVisitLockedAppointmentStatuses={activeVisitLockedAppointmentStatuses}
                  />
                );
              })}
              `;
  src = src.substring(0, mapStartIndex) + newMapBlock + src.substring(emptyStateIndex);
} else {
  throw new Error("Map block not found");
}

fs.writeFileSync('apps/web/src/ScheduleView.tsx', src);
console.log('Complete refactor performed safely.');
