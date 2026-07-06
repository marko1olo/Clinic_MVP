const fs = require('fs');

const path = 'C:/Clinic_MVP/dental-crm/apps/web/src/styles/main.css';
let content = fs.readFileSync(path, 'utf8');

// Replace very light backgrounds with dark theme paper layers
content = content.replace(/background:\s*#(f[a-z0-9]{2}){1,2}\b/gi, 'background: var(--paper)');
content = content.replace(/background-color:\s*#(f[a-z0-9]{2}){1,2}\b/gi, 'background-color: var(--paper)');
content = content.replace(/background:\s*#fff[a-z0-9]*\b/gi, 'background: var(--paper)');
content = content.replace(/background:\s*#e[a-z0-9]{5}\b/gi, 'background: var(--paper-strong)');

// Fix hardcoded borders
content = content.replace(/border-color:\s*#e[a-z0-9]{2,5}\b/gi, 'border-color: var(--line)');
content = content.replace(/border:\s*1px\s*solid\s*#(e|f)[a-z0-9]{2,5}\b/gi, 'border: 1px solid var(--line)');
content = content.replace(/border-bottom:\s*1px\s*solid\s*#(e|f)[a-z0-9]{2,5}\b/gi, 'border-bottom: 1px solid var(--line)');
content = content.replace(/border-top:\s*1px\s*solid\s*#(e|f)[a-z0-9]{2,5}\b/gi, 'border-top: 1px solid var(--line)');
content = content.replace(/border-left:\s*1px\s*solid\s*#(e|f)[a-z0-9]{2,5}\b/gi, 'border-left: 1px solid var(--line)');
content = content.replace(/border-right:\s*1px\s*solid\s*#(e|f)[a-z0-9]{2,5}\b/gi, 'border-right: 1px solid var(--line)');

// Fix dark text colors on what are now dark backgrounds
content = content.replace(/color:\s*#334155\b/g, 'color: var(--ink)');
content = content.replace(/color:\s*#475569\b/g, 'color: var(--ink)');
content = content.replace(/color:\s*#1e293b\b/g, 'color: var(--ink)');
content = content.replace(/color:\s*#0f172a\b/g, 'color: var(--ink)');
content = content.replace(/color:\s*#111827\b/g, 'color: var(--ink)');
content = content.replace(/color:\s*#1f2937\b/g, 'color: var(--ink)');
content = content.replace(/color:\s*#374151\b/g, 'color: var(--muted)');

// Update empty states specifically
content = content.replace(/\.schedule-empty-state\s*{[^}]+}/, `.schedule-empty-state { align-items: center; background: var(--paper-strong); border: 1px dashed var(--line-strong); border-radius: 12px; display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr) auto; padding: 24px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }`);

content = content.replace(/\.patient-empty-state\s*{[^}]+}/, `.patient-empty-state { text-align: center; background: var(--paper-strong); border: 1px dashed var(--line-strong); border-radius: 12px; padding: 40px 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }`);

content = content.replace(/\.finance-empty-state\s*{[^}]+}/, `.finance-empty-state { text-align: center; background: var(--paper-strong); border: 1px dashed var(--line-strong); border-radius: 12px; padding: 40px 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }`);

content = content.replace(/\.communication-empty-state\s*{[^}]+}/, `.communication-empty-state { text-align: center; background: var(--paper-strong); border: 1px dashed var(--line-strong); border-radius: 12px; padding: 40px 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }`);

content = content.replace(/\.telegram-empty-state\s*{[^}]+}/, `.telegram-empty-state { text-align: center; background: var(--paper-strong); border: 1px dashed var(--line-strong); border-radius: 12px; padding: 40px 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }`);

fs.writeFileSync(path, content);
console.log('Fixed main.css dark theme and empty states!');
