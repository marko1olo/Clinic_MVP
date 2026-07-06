const fs = require('fs');

const content = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = content.split('\n');

const stateBlock = lines.slice(733, 1924).join('\n');
const importsBlock1 = lines.slice(3891, 5899).join('\n');
const auditBlock = lines.slice(5900, 6135).join('\n');
const importsBlock2 = lines.slice(6136, 6341).join('\n');

const commonImports = `import { Sparkles, Database, FileText, UploadCloud, ImageIcon, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, RotateCw, FlipHorizontal, ZoomOut, ZoomIn, RefreshCw, X, AlertTriangle, HelpCircle, FileCheck2, Layers3 } from 'lucide-react';
import { SmartMicrophoneButton } from '../SmartMicrophoneButton';
import { useSettingsStore } from '../../store/settingsStore';
import {
  humanizeMigrationText,
  localBridgeEndpointSummary
} from '../../SettingsView';
import { dicomFirstFrameStatusLabels, dicomFirstFrameFileFormatLabel, dicomTextureStrategyLabels, dicomFolderWorkupPathLabels, dicomLabel, localImagingModelWorkbenchTargetLabels } from '../../imagingUiLabels';
import { importSourceLabels, smartImportModeLabels, smartImportLineKindLabels, patientImportRowWarningText, importRowStatusLabels, clinicPublicLookupProviderStatusLabels, documentDetectedKindLabel, ingestionTargetLabels, imagingImportRowWarningText } from '../../workspaceShell';
import type { ChangeEvent as InputChangeEvent } from 'react';

type TextInputChangeEvent = InputChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
`;

const importsTabContent = commonImports + `
export function SettingsImportsTab(props: Record<string, any>) {
` + stateBlock + `

  return (
    <>
` + importsBlock1 + `\n` + importsBlock2 + `
    </>
  );
}
`;

const auditTabContent = commonImports + `
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

const newSettingsView = [
  ...lines.slice(0, 3891),
  '          <SettingsImportsTab {...props} />',
  '          <SettingsAuditTab {...props} />',
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
