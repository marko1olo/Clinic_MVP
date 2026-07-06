const fs = require('fs');
const content = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = content.split('\n');

// Destructuring block in SettingsView starts at 734, ends at 1276
const destructureBlock = lines.slice(734, 1277).join('\n');

const importsTabJSX = lines.slice(3893, 6106).join('\n'); // without the {settingsTab === ... wrappers

const newFileContent = `import { Sparkles, Database, FileText, UploadCloud, ImageIcon, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, RotateCw, FlipHorizontal, ZoomOut, ZoomIn, RefreshCw } from 'lucide-react';
import { SmartMicrophoneButton } from '../SmartMicrophoneButton';
import {
  humanizeMigrationText,
  localBridgeEndpointSummary
} from '../../SettingsView';

export function SettingsImportsTab(props: Record<string, any>) {
  const {
` + destructureBlock.substring(8) + `

  return (
    <>
` + importsTabJSX + `
    </>
  );
}
`;

fs.writeFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', newFileContent, 'utf8');

// Now replace in SettingsView.tsx
const newSettingsView = [
  ...lines.slice(0, 3892),
  '          {settingsTab === "imports" ? <SettingsImportsTab {...props} /> : null}',
  ...lines.slice(6107)
];

// Add import to SettingsView.tsx
const finalSettingsView = newSettingsView.join('\n').replace(
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";',
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";\nimport { SettingsImportsTab } from "./components/settings/SettingsImportsTab";'
);

fs.writeFileSync('apps/web/src/SettingsView.tsx', finalSettingsView, 'utf8');
