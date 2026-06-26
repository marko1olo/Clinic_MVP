const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'apps', 'web', 'src', 'store', 'scheduleStore.ts');
const appPath = path.join(__dirname, '..', 'apps', 'web', 'src', 'App.tsx');

let storeCode = fs.readFileSync(storePath, 'utf8');

// Resolve emptyAppointmentScheduleDraft being a function
storeCode = storeCode.replace(
    'newAppointmentDraft: emptyAppointmentScheduleDraft,',
    'newAppointmentDraft: emptyAppointmentScheduleDraft(),'
);

fs.writeFileSync(storePath, storeCode);

let appCode = fs.readFileSync(appPath, 'utf8');

// Resolve 'day' any types in .map
appCode = appCode.replace(/\.map\(\(day\) =>/g, '.map((day: any) =>');

fs.writeFileSync(appPath, appCode);

console.log('Resolved TS errors in scheduleStore and App.tsx');
