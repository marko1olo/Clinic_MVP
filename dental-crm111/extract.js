import fs from 'fs';

const src = fs.readFileSync('apps/web/src/ScheduleView.tsx', 'utf8');

// Find the start of sortedAppointments.map
const mapStartIndex = src.indexOf('sortedAppointments.map((appointment) => {');
if (mapStartIndex === -1) throw new Error('Not found mapStart');

// Find the end of the map block
const mapEndIndex = src.indexOf('});', mapStartIndex) + 3;

const originalMapBlock = src.substring(mapStartIndex, mapEndIndex);

let extractedLogic = originalMapBlock.replace('sortedAppointments.map((appointment) => {', '');
extractedLogic = extractedLogic.replace(/return \(\s*<div className="timeline-node" key=\{appointment\.id\}>/, 'return (\n    <div className="timeline-node">');
extractedLogic = extractedLogic.replace(/\);\s*}\);/, ');');

const extractedComponent = `import type { ChangeEvent } from "react";
import type { Appointment, AppointmentReadiness, Dashboard, ScheduleSuggestion } from "@dental/shared";

type TextFieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type AppointmentCardProps = {
  appointment: Appointment;
  dashboard: Dashboard;
  visibleScheduleSuggestions: ScheduleSuggestion[];
  appointmentReadinessById: Map<string, AppointmentReadiness>;
  appointmentLabels: Record<Appointment["status"], string>;
  appointmentScheduleDrafts: Record<string, any>;
  appointmentScheduleSaveStates: Record<string, string>;
  appointmentScheduleErrors: Record<string, string | null>;
  appointmentScheduleDirtyIds: Set<string>;
  editingAppointmentId: string | null;
  activeVisitLockedAppointmentStatuses: Set<Appointment["status"]>;
  openScheduleSuggestion: (section: string) => void;
  formatTime: (value: string) => string;
  patientName: (patients: Dashboard["patients"], patientId: string | null) => string;
  appointmentDraftMissingSteps: (draft: any) => string[];
  openAppointmentEditor: (appointment: Appointment) => void;
  closeAppointmentEditor: (appointmentId: string) => void;
  updateAppointmentScheduleDraft: (appointmentId: string, key: string, value: any) => void;
  saveAppointmentSchedule: (appointmentId: string) => Promise<boolean>;
  normalizedAppointmentStatus: (value: unknown) => Appointment["status"];
  toDateTimeLocalValue: (value: string, timeZone?: string | null) => string;
  fromDateTimeLocalValue: (value: string, timeZone?: string | null) => string;
  useManualSelects: boolean;
  appointmentScheduleDraftFromAppointment: (appointment: Appointment) => any;
};

export function AppointmentCard(props: AppointmentCardProps) {
  const {
    appointment,
    dashboard,
    visibleScheduleSuggestions,
    appointmentReadinessById,
    appointmentLabels,
    appointmentScheduleDrafts,
    appointmentScheduleSaveStates,
    appointmentScheduleErrors,
    appointmentScheduleDirtyIds,
    editingAppointmentId,
    activeVisitLockedAppointmentStatuses,
    openScheduleSuggestion,
    formatTime,
    patientName,
    appointmentDraftMissingSteps,
    openAppointmentEditor,
    closeAppointmentEditor,
    updateAppointmentScheduleDraft,
    saveAppointmentSchedule,
    normalizedAppointmentStatus,
    toDateTimeLocalValue,
    fromDateTimeLocalValue,
    useManualSelects,
    appointmentScheduleDraftFromAppointment
  } = props;

${extractedLogic}
}
`;

fs.writeFileSync('apps/web/src/components/schedule/AppointmentCard.tsx', extractedComponent);

const newMapBlock = `sortedAppointments.map((appointment) => (
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
))`;

const newSrc = src.substring(0, mapStartIndex) + newMapBlock + src.substring(mapEndIndex);
const newSrcWithImport = 'import { AppointmentCard } from "./components/schedule/AppointmentCard";\n' + newSrc;

fs.writeFileSync('apps/web/src/ScheduleView.tsx', newSrcWithImport);
console.log('Extraction complete');
