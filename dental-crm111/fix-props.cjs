const fs = require('fs');
let src = fs.readFileSync('apps/web/src/ScheduleView.tsx', 'utf8');

const mapStartIndex = src.indexOf('{sortedAppointments.map((appointment) => (');
const mapEndIndex = src.indexOf('))}');

if (mapStartIndex !== -1 && mapEndIndex !== -1) {
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
              })}`;

  src = src.substring(0, mapStartIndex) + newMapBlock + src.substring(mapEndIndex + 3); // replace '))}'
}

// Now fix NewAppointmentForm missing props
const formStart = src.indexOf('<NewAppointmentForm');
if (formStart !== -1) {
  const formEnd = src.indexOf('/>', formStart) + 2;

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
            />`;

  src = src.substring(0, formStart) + newFormBlock + src.substring(formEnd);
}

fs.writeFileSync('apps/web/src/ScheduleView.tsx', src);
console.log('Fixed props and mappings for both components.');
