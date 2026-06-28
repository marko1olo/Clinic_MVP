const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../apps/web/src/store/scheduleStore.ts');
const appPath = path.join(__dirname, '../apps/web/src/App.tsx');

let storeCode = fs.readFileSync(storePath, 'utf8');

// Fix emptyAppointmentScheduleDraft being a function
storeCode = storeCode.replace(
    'newAppointmentDraft: emptyAppointmentScheduleDraft,',
    'newAppointmentDraft: emptyAppointmentScheduleDraft(),'
);

fs.writeFileSync(storePath, storeCode);

let appCode = fs.readFileSync(appPath, 'utf8');

// Fix 'day' any types in .map
appCode = appCode.replace(/\.map\(\(day\) =>/g, '.map((day: any) =>');

fs.writeFileSync(appPath, appCode);

console.log('Fixed TS errors in scheduleStore and App.tsx');
