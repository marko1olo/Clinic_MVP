const fs = require('fs');

const content = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = content.split('\n');

const stateBlock = lines.slice(733, 1352).join('\n');

const block1 = lines.slice(3892, 5032).join('\n'); 
const block2 = lines.slice(5033, 5899).join('\n');
const block3 = lines.slice(6136, 6341).join('\n');

const newFileContent = `import { Sparkles, Database, FileText, UploadCloud, ImageIcon, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, RotateCw, FlipHorizontal, ZoomOut, ZoomIn, RefreshCw, X, AlertTriangle, HelpCircle } from 'lucide-react';
import { SmartMicrophoneButton } from '../SmartMicrophoneButton';
import { useSettingsStore } from '../../store/settingsStore';
import {
  humanizeMigrationText,
  localBridgeEndpointSummary
} from '../../SettingsView';
import { dicomFirstFrameStatusLabels, dicomFirstFrameFileFormatLabel, dicomTextureStrategyLabels, dicomFolderWorkupPathLabels, dicomLabel } from '../../imagingUiLabels';
import { importSourceLabels, smartImportModeLabels, smartImportLineKindLabels, patientImportRowWarningText, importRowStatusLabels, clinicPublicLookupProviderStatusLabels, documentDetectedKindLabel, ingestionTargetLabels, imagingImportRowWarningText } from '../../workspaceShell';

export function SettingsImportsTab(props: Record<string, any>) {
` + stateBlock + `

  return (
    <>
` + block1 + `\n` + block2 + `\n` + block3 + `
    </>
  );
}
`;

fs.writeFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', newFileContent, 'utf8');

// Replace blocks in SettingsView.tsx
// 3892 to 5031: Block 1
// 5033 to 5898: Block 2
// 5900 to 6135: Audit Tab (using 5901 in string for exact match)
// 6136 to 6340: Block 3
const newSettingsView = [
  ...lines.slice(0, 3892),
  '          {["imports", "sources"].includes(settingsTab) ? <SettingsImportsTab {...props} /> : null}',
  '          {settingsTab === "audit" ? <SettingsAuditTab {...props} /> : null}',
  ...lines.slice(6341)
];

const finalSettingsView = newSettingsView.join('\n').replace(
  'import { SettingsTelegramTab } from "./components/settings/SettingsTelegramTab";',
  'import { SettingsTelegramTab } from "./components/settings/SettingsTelegramTab";\nimport { SettingsAuditTab } from "./components/settings/SettingsAuditTab";\nimport { SettingsImportsTab } from "./components/settings/SettingsImportsTab";'
).replace(
  'const humanizeMigrationText = (value: unknown) => {',
  'export const humanizeMigrationText = (value: unknown) => {'
).replace(
  'const localBridgeEndpointSummary = (bridge: LocalBridgeReadinessResponse["bridges"][number]) => {',
  'export const localBridgeEndpointSummary = (bridge: LocalBridgeReadinessResponse["bridges"][number]) => {'
);

fs.writeFileSync('apps/web/src/SettingsView.tsx', finalSettingsView, 'utf8');
