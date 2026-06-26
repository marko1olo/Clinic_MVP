const fs = require('fs');

// Resolve appStore.ts
const path = 'C:/Clinic_MVP/dental-crm/apps/web/src/store/appStore.ts';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(/initialRecognitionText/g, '""');
fs.writeFileSync(path, code);
console.log('Fixed appStore.ts');

// Resolve App.tsx implicit any errors
const appPath = 'C:/Clinic_MVP/dental-crm/apps/web/src/App.tsx';
let appCode = fs.readFileSync(appPath, 'utf8');

appCode = appCode.replace(/\.map\(\(day\) =>/g, '.map((day: any) =>');
appCode = appCode.replace(/\.map\(\(item\) =>/g, '.map((item: any) =>');
appCode = appCode.replace(/\.map\(\(shift\) =>/g, '.map((shift: any) =>');

appCode = appCode.replace(/setScheduleSelectedCalendarItems\(\(current\) =>/g, 'setScheduleSelectedCalendarItems((current: any) =>');
appCode = appCode.replace(/setShiftSelectedCalendarItems\(\(current\) =>/g, 'setShiftSelectedCalendarItems((current: any) =>');
appCode = appCode.replace(/setScheduleVisibleDate\(\(current\) =>/g, 'setScheduleVisibleDate((current: any) =>');

fs.writeFileSync(appPath, appCode);
console.log('Fixed implicit anys in App.tsx');

