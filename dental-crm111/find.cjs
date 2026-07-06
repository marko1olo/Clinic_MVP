const fs = require('fs');
const lines = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8').split('\n');
console.log('State End:', lines.findIndex(l => l === '  return ('));
console.log('B1 Start:', lines.findIndex(l => l === '          {settingsTab === "imports" ? ('));
console.log('B2 Start:', lines.findIndex(l => l === '            {clinicPublicLookup && settingsTab === "imports" ? ('));
console.log('Audit Start:', lines.findIndex(l => l === '          {settingsTab === "audit" ? ('));
console.log('B3 Start:', lines.findIndex((l, i) => i > 6000 && l === '          {settingsTab === "imports" ? ('));
console.log('End:', lines.findIndex((l, i) => i > 6300 && l === '          </div>'));
