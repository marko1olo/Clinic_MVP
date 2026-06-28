const fs = require('fs');
const path = require('path');

let appStoreCode = fs.readFileSync(path.join(__dirname, '..', 'apps', 'web', 'src', 'store', 'appStore.ts'), 'utf8');
appStoreCode = appStoreCode.replace(/editClinicProfileDraft: emptyClinicProfileDraft,/g, 'editClinicProfileDraft: emptyClinicProfileDraft(),');
fs.writeFileSync(path.join(__dirname, '..', 'apps', 'web', 'src', 'store', 'appStore.ts'), appStoreCode);

console.log('Fixed appStore.ts');

// Fix App.tsx implicit any errors
let appCode = fs.readFileSync(path.join(__dirname, '..', 'apps', 'web', 'src', 'App.tsx'), 'utf8');

appCode = appCode.replace(/\.map\(\(day\) =>/g, '.map((day: any) =>');
appCode = appCode.replace(/\.map\(\(item\) =>/g, '.map((item: any) =>');
appCode = appCode.replace(/\.map\(\(shift\) =>/g, '.map((shift: any) =>');

appCode = appCode.replace(/setScheduleSelectedCalendarItems\(\(current\) =>/g, 'setScheduleSelectedCalendarItems((current: any) =>');
appCode = appCode.replace(/setShiftSelectedCalendarItems\(\(current\) =>/g, 'setShiftSelectedCalendarItems((current: any) =>');
appCode = appCode.replace(/setScheduleVisibleDate\(\(current\) =>/g, 'setScheduleVisibleDate((current: any) =>');

fs.writeFileSync(path.join(__dirname, '..', 'apps', 'web', 'src', 'App.tsx'), appCode);
console.log('Fixed App.tsx implicit any errors');

