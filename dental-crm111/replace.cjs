const fs = require('fs');

const src = fs.readFileSync('apps/web/src/ScheduleView.tsx', 'utf8');

const mapStartIndex = src.indexOf('{sortedAppointments.map((appointment) => {');
if (mapStartIndex === -1) throw new Error('Not found mapStart');

const mapEndIndex = src.indexOf('{sortedAppointments.length === 0 ? (');
if (mapEndIndex === -1) throw new Error('Not found mapEnd');

// Find the precise end of the map block by stepping back from the empty state check
let actualEndIndex = src.lastIndexOf('}', mapEndIndex); // '}' from '})}'
actualEndIndex = src.lastIndexOf(')', actualEndIndex); // ')'
actualEndIndex = src.lastIndexOf('}', actualEndIndex); // '}' from '})'
// Let's just slice from mapStartIndex to mapEndIndex, and then prepend the `              ` spaces!
// Actually, mapEndIndex points to '{sortedAppointments...'.

const newMapBlock = `{sortedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  dashboard={dashboard}
                  visibleScheduleSuggestions={visibleScheduleSuggestions}
                  appointmentReadinessById={appointmentReadinessById}
                  appointmentLabels={appointmentLabels}
                  appointmentScheduleDrafts={appointmentScheduleDrafts}
                  appointmentScheduleSaveStates={appointmentScheduleSaveStates}
                  appointmentScheduleErrors={appointmentScheduleErrors}
                  appointmentScheduleDirtyIds={appointmentScheduleDirtyIds}
                  editingAppointmentId={editingAppointmentId}
                  activeVisitLockedAppointmentStatuses={activeVisitLockedAppointmentStatuses}
                  openScheduleSuggestion={openScheduleSuggestion}
                  formatTime={formatTime}
                  patientName={patientName}
                  appointmentDraftMissingSteps={appointmentDraftMissingSteps}
                  openAppointmentEditor={openAppointmentEditor}
                  closeAppointmentEditor={closeAppointmentEditor}
                  updateAppointmentScheduleDraft={updateAppointmentScheduleDraft}
                  saveAppointmentSchedule={saveAppointmentSchedule}
                  normalizedAppointmentStatus={normalizedAppointmentStatus}
                  toDateTimeLocalValue={toDateTimeLocalValue}
                  fromDateTimeLocalValue={fromDateTimeLocalValue}
                  useManualSelects={useManualSelects}
                  appointmentScheduleDraftFromAppointment={appointmentScheduleDraftFromAppointment}
                />
              ))}
              `;

const newSrc = src.substring(0, mapStartIndex) + newMapBlock + src.substring(mapEndIndex);
const importLine = 'import { AppointmentCard } from "./components/schedule/AppointmentCard";\n';

const finalSrc = src.includes('import { AppointmentCard }') ? newSrc : importLine + newSrc;

fs.writeFileSync('apps/web/src/ScheduleView.tsx', finalSrc);
console.log('Replacement complete.');
