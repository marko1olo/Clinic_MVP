import os

with open("apps/web/src/useAppLogic.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

def get_lines(start, end):
    return "".join(lines[start-1:end])

fn1 = get_lines(7004, 7039)
fn2 = get_lines(7042, 7077)
fn3 = get_lines(7080, 7144)
fn4 = get_lines(7150, 7211)

hook_content = f"""import {{ useAppStore }} from "../store/appStore";
import {{ useScheduleStore }} from "../store/scheduleStore";
import {{ 
  operatorWorkflowFailureMessage, 
  responseErrorMessage, 
  appointmentScheduleMissingFields, 
  appointmentScheduleDraftSignature, 
  appointmentUpdateInputFromDraft,
  appointmentCreateInputFromDraft,
  appointmentScheduleDraftFromAppointment,
  newAppointmentDraftFromDashboard,
  staffWorkingHoursFromDraft,
  staffScheduleDraftSignature,
  type AppointmentScheduleDraft 
}} from "../AppHelpers";
import {{ dashboardSchema }} from "@dental/shared";

export function useScheduleLogic(
  scheduleMutationHeaders: (extra?: Record<string, string>, adminSecretOverride?: string) => Record<string, string>,
  settingsAccessHeaders: (extra?: Record<string, string>) => Record<string, string>,
  loadDashboard: () => Promise<void>,
  selectedPatientId: string | null,
  selectedSpecialty: any,
  setSelectedPatientId: (id: string | null) => void,
  setEditingAppointmentId: (id: string | null) => void,
  setScheduleDefaultDoctorUserId: (id: string | null) => void,
  setScheduleDefaultAssistantUserId: (id: string | null) => void,
  setScheduleDefaultChairId: (id: string | null) => void
) {{
  const {{ dashboard, setDashboard, setError }} = useAppStore();
  const scheduleStore = useScheduleStore();
  
  // Destructure setters used in the functions
  const {{ 
    staffScheduleDrafts, setStaffScheduleSavingId, setStaffScheduleSaveStates, setStaffScheduleDirtyIds,
    chairScheduleDrafts, setChairScheduleSavingId, setChairScheduleSaveStates, setChairScheduleDirtyIds,
    appointmentScheduleDrafts, setAppointmentScheduleSaveStates, setAppointmentScheduleErrors,
    setAppointmentScheduleDrafts, setAppointmentScheduleDirtyIds,
    newAppointmentDraft, newAppointmentSaveState, setNewAppointmentError, setNewAppointmentSaveState, setNewAppointmentDraft
  }} = scheduleStore;

  const appointmentScheduleDraftsRef = {{ current: scheduleStore.appointmentScheduleDrafts }};
  const staffScheduleDraftsRef = {{ current: scheduleStore.staffScheduleDrafts }};
  const chairScheduleDraftsRef = {{ current: scheduleStore.chairScheduleDrafts }};
  const newAppointmentDraftUserEditedRef = {{ current: false }};

{fn1}
{fn2}
{fn3}

  function newAppointmentMissingFields(draft: AppointmentScheduleDraft): string[] {{
    return appointmentScheduleMissingFields(draft, dashboard?.clinicSettings.profile.mode, dashboard?.clinicSettings.staff);
  }}

{fn4}

  return {{
    saveStaffSchedule,
    saveChairSchedule,
    saveAppointmentSchedule,
    createAppointmentFromDraft
  }};
}}
"""

with open("apps/web/src/hooks/useScheduleLogic.ts", "w", encoding="utf-8") as f:
    f.write(hook_content)

print("Created useScheduleLogic.ts")

# Remove from useAppLogic.tsx (in reverse order to keep indices stable)
blocks_to_remove = [(7146, 7211), (7080, 7144), (7042, 7077), (7004, 7039)]

for s, e in blocks_to_remove:
    # Delete lines
    del lines[s-1:e]

# Inject the hook usage inside useAppLogic.tsx
ret_idx = -1
for i, line in enumerate(lines):
    if "return {" in line and i > len(lines) - 500:
        ret_idx = i
        break

hook_usage = """  const {
    saveStaffSchedule,
    saveChairSchedule,
    saveAppointmentSchedule,
    createAppointmentFromDraft
  } = useScheduleLogic(
    scheduleMutationHeaders,
    settingsAccessHeaders,
    loadDashboard,
    selectedPatientId,
    selectedSpecialty,
    setSelectedPatientId,
    setEditingAppointmentId,
    setScheduleDefaultDoctorUserId,
    setScheduleDefaultAssistantUserId,
    setScheduleDefaultChairId
  );
"""

# Insert hook usage before return
if ret_idx != -1:
    lines.insert(ret_idx, hook_usage)

# Add import at the top
lines.insert(0, 'import { useScheduleLogic } from "./hooks/useScheduleLogic";\\n')

with open("apps/web/src/useAppLogic.tsx", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Updated useAppLogic.tsx")
