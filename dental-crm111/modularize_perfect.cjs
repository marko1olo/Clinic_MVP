const fs = require('fs');

const pristineSettingsView = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = pristineSettingsView.split('\n');

const stateBlock = lines.slice(733, 1924).join('\n');
const importsBlock1 = lines.slice(3891, 5899).join('\n');
const auditBlock = lines.slice(5900, 6135).join('\n');
const importsBlock2 = lines.slice(6136, 6341).join('\n');

// Grab EVERYTHING before the component starts
const importsEnd = pristineSettingsView.indexOf('export function SettingsView');
let importsBlock = pristineSettingsView.substring(0, importsEnd);

// Remove specific imports that might clash
importsBlock = importsBlock.replace(/import \{ SettingsTelegramTab \} from "\.\/components\/settings\/SettingsTelegramTab";\n/g, '');

// Adjust relative paths
importsBlock = importsBlock.replace(/(from\s+["'])(?:\.\.\/)(.*?["'])/g, '$1../../../$2');
importsBlock = importsBlock.replace(/(from\s+["'])(?:\.\/)(.*?["'])/g, '$1../../$2');

// Add specific Lucide icons to lucide-react import
importsBlock = importsBlock.replace(
  "import { Sparkles",
  "import { ClipboardCheck, ScanSearch, ExternalLink, ShieldCheck, Search, CircleStop, Gauge, Sparkles"
);

// We no longer need to export anything from SettingsView, because the tabs get a complete local copy of the helpers!

let importsTabContent = importsBlock + `
export function SettingsImportsTab(props: Record<string, any>) {
` + stateBlock + `

  return (
    <>
` + importsBlock1 + `\n` + importsBlock2 + `
    </>
  );
}
`;

importsTabContent = importsTabContent.replace(/\(event\.target\)\.files/g, "(event.target as HTMLInputElement).files");
importsTabContent = importsTabContent.replace(/\(event\.target\)\.value/g, "(event.target as HTMLInputElement).value");

let auditTabContent = importsBlock + `
export function SettingsAuditTab(props: Record<string, any>) {
` + stateBlock + `

  return (
    <>
` + auditBlock + `
    </>
  );
}
`;

fs.writeFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', importsTabContent, 'utf8');
fs.writeFileSync('apps/web/src/components/settings/SettingsAuditTab.tsx', auditTabContent, 'utf8');

const newSettingsViewLines = [
  ...lines.slice(0, 3891),
  '          <SettingsImportsTab {...props} />',
  '          <SettingsAuditTab {...props} />',
  ...lines.slice(6341)
];

let finalSettingsView = newSettingsViewLines.join('\n');

finalSettingsView = finalSettingsView.replace(
  'import { SettingsTelegramTab } from "./components/settings/SettingsTelegramTab";',
  'import { SettingsTelegramTab } from "./components/settings/SettingsTelegramTab";\nimport { SettingsAuditTab } from "./components/settings/SettingsAuditTab";\nimport { SettingsImportsTab } from "./components/settings/SettingsImportsTab";'
);

fs.writeFileSync('apps/web/src/SettingsView.tsx', finalSettingsView, 'utf8');
