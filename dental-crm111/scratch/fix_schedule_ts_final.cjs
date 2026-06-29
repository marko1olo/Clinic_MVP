const fs = require('fs');

let storeCode = fs.readFileSync('/app/dental-crm/apps/web/src/store/scheduleStore.ts', 'utf8');

// Fix emptyAppointmentScheduleDraft being a function instead of a value
storeCode = storeCode.replace(
    'newAppointmentDraft: emptyAppointmentScheduleDraft(),',
    'newAppointmentDraft: emptyAppointmentScheduleDraft,'
);

fs.writeFileSync('/app/dental-crm/apps/web/src/store/scheduleStore.ts', storeCode);

let appCode = fs.readFileSync('/app/dental-crm/apps/web/src/App.tsx', 'utf8');

// Fix 'day' any types in .map
appCode = appCode.replace(/\.map\(\(day\) =>/g, '.map((day: any) =>');

fs.writeFileSync('/app/dental-crm/apps/web/src/App.tsx', appCode);

console.log('Fixed TS errors in scheduleStore and App.tsx');
