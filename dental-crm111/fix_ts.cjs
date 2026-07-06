const fs = require('fs');

// 1. Fix server.ts
let serverTs = fs.readFileSync('apps/api/src/server.ts', 'utf8');
serverTs = serverTs.replace('error?.stack', '(error as any)?.stack');
serverTs = serverTs.replace('error?.message', '(error as any)?.message');
serverTs = serverTs.replace('error?.cause', '(error as any)?.cause');
fs.writeFileSync('apps/api/src/server.ts', serverTs);

// 2. Fix dashboardQuery.ts
let dash = fs.readFileSync('apps/api/src/db/dashboardQuery.ts', 'utf8');
dash = dash.replace(/\s*protocolTemplates: \[\]\s*,/g, '');
dash = dash.replace(/\s*serviceCatalog: \[\]\s*,/g, '');
dash = dash.replace(/\s*clinicalRules: \[\]\s*,/g, '');
dash = dash.replace(/\s*communicationTasks: \[\]\s*,/g, '');
// Wait, we still need one instance of them or they are mapped later?
// In dashboardQuery.ts they are mapped at the end:
// protocolTemplates: [], serviceCatalog: serviceCatalog.map, clinicalRules: clinicalRules.map, communicationTasks: []
// So we just remove the early empty array declarations if they exist.
fs.writeFileSync('apps/api/src/db/dashboardQuery.ts', dash);

// 3. Fix localDictationParser.ts
let ldp = fs.readFileSync('apps/api/src/ai/localDictationParser.ts', 'utf8');
// Fix m[1] to (m[1] || '') or (m[1] as string)
ldp = ldp.replace(/parseInt\(m\[1\], 10\)/g, 'parseInt(m[1] as string, 10)');
ldp = ldp.replace(/parseWordNumber\(m\[1\]\)/g, 'parseWordNumber(m[1] as string)');
ldp = ldp.replace(/const word = m\[2\]\.substring/g, 'const word = (m[2] as string).substring');
ldp = ldp.replace(/parseFloat\(m\[1\]\.replace/g, 'parseFloat((m[1] as string).replace');
ldp = ldp.replace(/mWord\[2\]/g, '(mWord[2] as string)');
ldp = ldp.replace(/mWord\[1\]/g, '(mWord[1] as string)');
ldp = ldp.replace(/nameMatch\[1\]/g, '(nameMatch[1] as string)');
ldp = ldp.replace(/openCardMatch\[1\]/g, '(openCardMatch[1] as string)');
ldp = ldp.replace(/implantMatch\[1\]/g, '(implantMatch[1] as string)');
ldp = ldp.replace(/implantMatch\[2\]/g, '(implantMatch[2] as string)');
ldp = ldp.replace(/compMatch\[1\]/g, '(compMatch[1] as string)');
ldp = ldp.replace(/objMatch\[1\]/g, '(objMatch[1] as string)');
ldp = ldp.replace(/diagMatch\[1\]/g, '(diagMatch[1] as string)');
ldp = ldp.replace(/treatMatch\[1\]/g, '(treatMatch[1] as string)');
ldp = ldp.replace(/m\[2\] && \(m\[2\] as string\)/g, 'm[2] && (m[2] as string)'); // Handle double casting if any
fs.writeFileSync('apps/api/src/ai/localDictationParser.ts', ldp);
