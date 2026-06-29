const fs = require('fs');

let storeCode = fs.readFileSync('dental-crm111/apps/web/src/store/scheduleStore.ts', 'utf8');

// Fix emptyAppointmentScheduleDraft being a function
storeCode = storeCode.replace(
    'newAppointmentDraft: emptyAppointmentScheduleDraft,',
    'newAppointmentDraft: emptyAppointmentScheduleDraft(),'
);

fs.writeFileSync('dental-crm111/apps/web/src/store/scheduleStore.ts', storeCode);

let appCode = fs.readFileSync('dental-crm111/apps/web/src/App.tsx', 'utf8');

// Fix 'day' any types in .map
appCode = appCode.replace(/\.map\(\(day(: any)?\) =>/g, '.map((day: { value: number; label: string }) =>');

fs.writeFileSync('dental-crm111/apps/web/src/App.tsx', appCode);

console.log('Fixed TS errors in scheduleStore and App.tsx');
