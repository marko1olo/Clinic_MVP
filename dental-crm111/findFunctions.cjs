const fs = require('fs');
const content = fs.readFileSync('apps/web/src/useAppLogic.tsx', 'utf8');
const lines = content.split('\n');

let extracting = false;
let braceCount = 0;
let currentFunction = '';
const extractedFunctions = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!extracting) {
    if (line.match(/^\s*async function (saveStaffSchedule|saveChairSchedule|saveAppointmentSchedule|createAppointmentFromDraft)/)) {
      extracting = true;
      braceCount = 0;
      const match = line.match(/^\s*async function ([a-zA-Z0-9_]+)/);
      currentFunction = match[1];
      extractedFunctions[currentFunction] = { startLine: i, lines: [] };
    }
  }

  if (extracting) {
    extractedFunctions[currentFunction].lines.push(line);
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceCount += openBraces - closeBraces;
    if (braceCount === 0 && line.includes('}')) {
      extracting = false;
      extractedFunctions[currentFunction].endLine = i;
    }
  }
}

for (const fn of Object.keys(extractedFunctions)) {
  console.log(`Found ${fn} from ${extractedFunctions[fn].startLine} to ${extractedFunctions[fn].endLine}`);
}
