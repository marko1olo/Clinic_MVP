const fs = require('fs');
const fixDoubleEncoding = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('Р') && content.includes('Рё')) {
    const rawBuffer = Buffer.from(content, 'binary');
    const fixedContent = rawBuffer.toString('utf8');
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log('Fixed:', filePath);
  } else {
    console.log('No double encoding detected in:', filePath);
  }
}
fixDoubleEncoding('apps/web/src/ScheduleView.tsx');
fixDoubleEncoding('apps/web/src/components/schedule/AppointmentCard.tsx');
fixDoubleEncoding('apps/web/src/components/schedule/AppointmentDraftEditor.tsx');
