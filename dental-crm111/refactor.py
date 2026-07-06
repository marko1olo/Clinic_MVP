import re
import os

with open("apps/web/src/useAppLogic.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

def get_block(start_match_str):
    start_idx = -1
    for i, line in enumerate(lines):
        if start_match_str in line:
            start_idx = i
            break
    if start_idx == -1: return None, -1, -1
    
    brace_count = 0
    extracting = True
    end_idx = start_idx
    
    for i in range(start_idx, len(lines)):
        line = lines[i]
        open_b = line.count("{")
        close_b = line.count("}")
        brace_count += (open_b - close_b)
        if brace_count <= 0 and "}" in line:
            end_idx = i
            break
            
    return "".join(lines[start_idx:end_idx+1]), start_idx, end_idx

fn1, s1, e1 = get_block("async function saveStaffSchedule")
fn2, s2, e2 = get_block("async function saveChairSchedule")
fn3, s3, e3 = get_block("async function saveAppointmentSchedule")
fn4, s4, e4 = get_block("async function createAppointmentFromDraft")

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
  setEditingAppointmentId: (id: string | null) => void
) {{
  const {{ dashboard, setDashboard, setError }} = useAppStore();
  const scheduleStore = useScheduleStore();
  
  // Expose refs for latest drafts (simplified logic here)
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
blocks_to_remove = [(s4, e4), (s3, e3), (s2, e2), (s1, e1)]
blocks_to_remove.sort(key=lambda x: x[0], reverse=True)

for s, e in blocks_to_remove:
    # Delete lines
    del lines[s:e+1]

# Also, we need to inject the hook usage inside useAppLogic.tsx
# Find `return {` at the end
ret_idx = -1
for i, line in enumerate(lines):
    if "return {" in line and i > len(lines) - 500:
        ret_idx = i
        break

hook_usage = """
  const {
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
    setEditingAppointmentId
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
