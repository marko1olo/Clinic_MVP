const fs = require('fs');
const path = require('path');

const scheduleStorePath = path.join(__dirname, '../apps/web/src/store/scheduleStore.ts');
let storeCode = fs.readFileSync(scheduleStorePath, 'utf8');

// Fix imports
storeCode = storeCode.replace(
    'import { Appointment, StaffScheduleDraft, StaffScheduleSaveState, AppointmentScheduleDraft, AppointmentScheduleSaveState } from "@dental/shared";',
    'import { Appointment } from "@dental/shared";'
);
storeCode = storeCode.replace(
    '// We import these for default values\nimport { initialUiPreferences } from "../workspaceStaticOptions";\nimport { emptyAppointmentScheduleDraft } from "../AppHelpers";',
    'import { emptyAppointmentScheduleDraft, StaffScheduleDraft, StaffScheduleSaveState, AppointmentScheduleDraft, AppointmentScheduleSaveState, loadUiPreferences, defaultUiPreferences } from "../AppHelpers";\n\nconst initialUiPreferences = loadUiPreferences() ?? defaultUiPreferences;'
);

fs.writeFileSync(scheduleStorePath, storeCode);

const appTsxPath = path.join(__dirname, '../apps/web/src/App.tsx');
let appCode = fs.readFileSync(appTsxPath, 'utf8');

// Fix 'day' any types
appCode = appCode.replace(/\.map\(\(day\) =>/g, '.map((day: any) =>');
// Fix 'item' any types
appCode = appCode.replace(/\.map\(\(item\) =>/g, '.map((item: any) =>');

// Fix 'current' any types in setters that might not have been caught
appCode = appCode.replace(/setStaffScheduleSaveStates\(\(current\) =>/g, 'setStaffScheduleSaveStates((current: any) =>');
appCode = appCode.replace(/setAppointmentScheduleSaveStates\(\(current\) =>/g, 'setAppointmentScheduleSaveStates((current: any) =>');
appCode = appCode.replace(/setStaffScheduleDrafts\(\(current\) =>/g, 'setStaffScheduleDrafts((current: any) =>');
appCode = appCode.replace(/setAppointmentScheduleDrafts\(\(current\) =>/g, 'setAppointmentScheduleDrafts((current: any) =>');
appCode = appCode.replace(/setChairScheduleDrafts\(\(current\) =>/g, 'setChairScheduleDrafts((current: any) =>');

fs.writeFileSync(appTsxPath, appCode);

console.log('Fixed TS errors in scheduleStore and App.tsx');
