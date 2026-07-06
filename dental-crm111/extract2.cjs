const fs = require('fs');

const content = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = content.split('\n');

// 733 is export function SettingsView(props: SettingsViewProps) {
// 734 is   const {
// Let's copy from 734 to 1351 (the end of dicomWorkstationGuidanceId)
const stateBlock = lines.slice(734, 1352).join('\n');

// imports tab logic
// 3892 to 4822
const tab1 = lines.slice(3893, 4821).join('\n'); 

// 4823 to 5900
const tab2 = lines.slice(4824, 5900).join('\n');

// 5901 and 5902 is audit tab logic. Then imports tab again 5903 to 6106.
// Wait, 5901 is           <SettingsAuditTab {...props} />
// 5903 is           {settingsTab === "imports" ? (
const tab3 = lines.slice(5904, 6106).join('\n');

const newFileContent = `import { Sparkles, Database, FileText, UploadCloud, ImageIcon, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, RotateCw, FlipHorizontal, ZoomOut, ZoomIn, RefreshCw, X, AlertTriangle, HelpCircle } from 'lucide-react';
import { SmartMicrophoneButton } from '../SmartMicrophoneButton';
import { useSettingsStore } from '../../store/settingsStore';
import {
  humanizeMigrationText,
  localBridgeEndpointSummary
} from '../../SettingsView';

export function SettingsImportsTab(props: Record<string, any>) {
` + stateBlock + `

  return (
    <>
` + tab1 + `\n` + tab2 + `\n` + tab3 + `
    </>
  );
}
`;

fs.writeFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', newFileContent, 'utf8');

// Now replace in SettingsView.tsx
// I will replace 3892 to 6106 with just the new tab logic
const newSettingsView = [
  ...lines.slice(0, 3892),
  '          {settingsTab === "imports" ? <SettingsImportsTab {...props} /> : null}',
  '          {settingsTab === "audit" ? <SettingsAuditTab {...props} /> : null}',
  ...lines.slice(6107)
];

// Add import to SettingsView.tsx
const finalSettingsView = newSettingsView.join('\n').replace(
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";',
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";\nimport { SettingsImportsTab } from "./components/settings/SettingsImportsTab";'
);

fs.writeFileSync('apps/web/src/SettingsView.tsx', finalSettingsView, 'utf8');
