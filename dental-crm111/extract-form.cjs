const fs = require('fs');
const src = fs.readFileSync('apps/web/src/ScheduleView.tsx', 'utf8');

const start = src.indexOf('<div className="appointment-create-wrapper"');
const end = src.indexOf('<div className="schedule-timeline timeline">');

fs.writeFileSync('create-form-backup.txt', src.substring(start, end));
