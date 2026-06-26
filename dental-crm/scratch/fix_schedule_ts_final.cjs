const fs = require('fs');
const path = require('path');

let storeCode = fs.readFileSync(path.join(__dirname, '../apps/web/src/store/scheduleStore.ts'), 'utf8');

// Fix emptyAppointmentScheduleDraft being a function
storeCode = storeCode.replace(
    'newAppointmentDraft: emptyAppointmentScheduleDraft,',
    'newAppointmentDraft: emptyAppointmentScheduleDraft(),'
);

fs.writeFileSync(path.join(__dirname, '../apps/web/src/store/scheduleStore.ts'), storeCode);

let appCode = fs.readFileSync(path.join(__dirname, '../apps/web/src/SettingsView.tsx'), 'utf8');

// Fix 'day' any types in .map
appCode = appCode.replace(/\.map\(\(day\) =>/g, '.map((day: any) =>');

fs.writeFileSync(path.join(__dirname, '../apps/web/src/SettingsView.tsx'), appCode);

console.log('Fixed TS errors in scheduleStore and SettingsView.tsx');
