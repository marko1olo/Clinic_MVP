
const fs = require('fs');
let code = fs.readFileSync('apps/api/src/ai/localDictationParser.ts', 'utf8');

// Fix 1: Time minutes
code = code.replace(/\\\\s\*\\\\(\\\\d\\{1,2\\\\}\\\\)\[:\\.\\\\s\]\\\\(\\\\d\\{2\\\\}\\\\)/g, '\\\\s*(\\\\d{1,2})[:.\\\\s]([0-5]\\\\d)');

// Fix 2: extractPatientName lookahead
code = code.replace(/\\\\\\\\s\\+\\\\(?:на\\|в\\|к\\|телефон\\|с\\|завтра\\|сегодня\\|послезавтра\\|\\\\\\\\d\\\\)\\|\\\\$/g, '\\\\s+(?:на|в|к|телефон|с|завтра|сегодня|послезавтра)(?:\\\\s|)|\\\\s+\\\\d|');

// Fix 3: extractEmkSections cyrillic split
code = code.replace(/text\\.split\\(\\/\\\\b\\(жалоб\.\*\?\\)\\\\b\\/i\\)/, 'text.split(/(^|[^а-яё])(жалоб[а-я]*|анамнез[а-я]*|объективн[а-я]*|осмотр[а-я]*|диагноз[а-я]*|лечени[а-я]*|план[а-я]*|рекомендаци[а-я]*|проведен[а-я]*)([^а-яё]|$)/i)');

fs.writeFileSync('apps/api/src/ai/localDictationParser.ts', code);
console.log('Fixed');

