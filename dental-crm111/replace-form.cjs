const fs = require('fs');

let src = fs.readFileSync('apps/web/src/ScheduleView.tsx', 'utf8');

// 1. Remove state variables
const stateVarsToRemove = `  const [showCreateForm, setShowCreateForm] = useState(false);
  const [useManualSelects, setUseManualSelects] = useState(false);

  const [smartInputText, setSmartInputText] = useState("");
  const [showSmartPreview, setShowSmartPreview] = useState(false);
  const [smartParsedData, setSmartParsedData] = useState<Partial<AppointmentScheduleDraft> | null>(null);
  const [showHints, setShowHints] = useState(false);`;

src = src.replace(stateVarsToRemove, '');

// 2. Remove isolated variables
const variablesToRemove = `  const newAppointmentStartsAtMs = Date.parse(newAppointmentDraft.startsAt);
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

src = src.replace(variablesToRemove, '');

// 3. Replace the block
const startBlock = src.indexOf('<div className="appointment-create-wrapper"');
const endBlock = src.indexOf('<div className="schedule-timeline timeline">');

if (startBlock === -1 || endBlock === -1) throw new Error('Block not found');

const newFormBlock = `<NewAppointmentForm
              dashboard={dashboard}
              appointmentLabels={appointmentLabels}
              newAppointmentDraft={newAppointmentDraft}
              newAppointmentSaveState={newAppointmentSaveState}
              newAppointmentError={newAppointmentError}
              updateNewAppointmentDraft={updateNewAppointmentDraft}
              createAppointmentFromDraft={createAppointmentFromDraft}
              resetNewAppointmentDraft={resetNewAppointmentDraft}
              toDateTimeLocalValue={toDateTimeLocalValue}
              fromDateTimeLocalValue={fromDateTimeLocalValue}
            />\n            `;

src = src.substring(0, startBlock) + newFormBlock + src.substring(endBlock);

const importLine = 'import { NewAppointmentForm } from "./components/schedule/NewAppointmentForm";\n';
src = src.includes('import { NewAppointmentForm }') ? src : importLine + src;

fs.writeFileSync('apps/web/src/ScheduleView.tsx', src);
console.log('Replacement form complete.');
