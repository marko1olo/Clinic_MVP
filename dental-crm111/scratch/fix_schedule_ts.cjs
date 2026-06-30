const fs = require('fs');
const path = require('path');

let storeCode = fs.readFileSync(path.join(__dirname, '../apps/web/src/store/scheduleStore.ts'), 'utf8');

// Fix imports
storeCode = storeCode.replace(
    'import { Appointment, StaffScheduleDraft, StaffScheduleSaveState, AppointmentScheduleDraft, AppointmentScheduleSaveState } from "@dental/shared";',
    'import { Appointment } from "@dental/shared";'
);
storeCode = storeCode.replace(
    '// We import these for default values\nimport { initialUiPreferences } from "../workspaceStaticOptions";\nimport { emptyAppointmentScheduleDraft } from "../AppHelpers";',
    'import { emptyAppointmentScheduleDraft, StaffScheduleDraft, StaffScheduleSaveState, AppointmentScheduleDraft, AppointmentScheduleSaveState, loadUiPreferences, defaultUiPreferences } from "../AppHelpers";\n\nconst initialUiPreferences = loadUiPreferences() ?? defaultUiPreferences;'
);

fs.writeFileSync(path.join(__dirname, '../apps/web/src/store/scheduleStore.ts'), storeCode);

let appCode = fs.readFileSync(path.join(__dirname, '../apps/web/src/App.tsx'), 'utf8');

// Fix 'day' any types

// Fix 'day' any types
let useAppLogicCode = fs.readFileSync(path.join(__dirname, '../apps/web/src/useAppLogic.tsx'), 'utf8');
useAppLogicCode = useAppLogicCode.replace(/\(day\) =>/g, '(day: any) =>');
fs.writeFileSync(path.join(__dirname, '../apps/web/src/useAppLogic.tsx'), useAppLogicCode);

let settingsCode = fs.readFileSync(path.join(__dirname, '../apps/web/src/SettingsView.tsx'), 'utf8');
settingsCode = settingsCode.replace(/\(day\) =>/g, '(day: any) =>');
fs.writeFileSync(path.join(__dirname, '../apps/web/src/SettingsView.tsx'), settingsCode);

let patientsCode = fs.readFileSync(path.join(__dirname, '../apps/web/src/PatientsView.tsx'), 'utf8');
patientsCode = patientsCode.replace(/\(day\) =>/g, '(day: any) =>');
fs.writeFileSync(path.join(__dirname, '../apps/web/src/PatientsView.tsx'), patientsCode);

// Fix 'item' any types
appCode = appCode.replace(/onChange=\{\(item\) =>/g, 'onChange={(item: any) =>');

// Fix 'current' any types in setters that might not have been caught
appCode = appCode.replace(/set([A-Za-z0-9_]+)\(\(current\) =>/g, "set$1((current: any) =>");

fs.writeFileSync(path.join(__dirname, '../apps/web/src/App.tsx'), appCode);

console.log('Fixed TS errors in scheduleStore and App.tsx');
