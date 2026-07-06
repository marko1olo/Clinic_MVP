const fs = require('fs');

const content = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = content.split('\n');

const stateBlock = lines.slice(734, 1352).join('\n');

const block1 = lines.slice(3892, 5032).join('\n'); 
const block2 = lines.slice(5033, 5900).join('\n');
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

const newSettingsView = [
  ...lines.slice(0, 3892),
  '          {["imports", "sources"].includes(settingsTab) ? <SettingsImportsTab {...props} /> : null}',
  ...lines.slice(5900, 6136),
  ...lines.slice(6341)
];

const finalSettingsView = newSettingsView.join('\n').replace(
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";',
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";\nimport { SettingsImportsTab } from "./components/settings/SettingsImportsTab";'
);

fs.writeFileSync('apps/web/src/SettingsView.tsx', finalSettingsView, 'utf8');
