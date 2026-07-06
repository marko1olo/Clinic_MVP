const fs = require('fs');

const content = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = content.split('\n');

const stateBlock = lines.slice(734, 1352).join('\n');

// Block 1: 3893 to 4819 (inside {settingsTab === "imports" ? ()
const tab1 = lines.slice(3893, 4820).join('\n'); 

// Block 2: 4823 to 5897 (inside {clinicPublicLookup && settingsTab === "imports" ? ()
const tab2 = `      {clinicPublicLookup ? (\n` + lines.slice(4823, 5898).join('\n') + `\n      ) : null}`;

// Block 3: 6137 to 6339 (inside {settingsTab === "imports" ? ()
const tab3 = lines.slice(6137, 6340).join('\n');

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
` + tab1 + `\n` + tab2 + `\n` + tab3 + `
    </>
  );
}
`;

fs.writeFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', newFileContent, 'utf8');

// Now we need to remove Block 1, Block 2, and Block 3 from SettingsView.tsx, and insert <SettingsImportsTab {...props} />.
// Block 1 starts at 3892, ends at 4820
// Block 2 starts at 4822, ends at 5898
// Block 3 starts at 6136, ends at 6340

const newSettingsView = [
  ...lines.slice(0, 3892),
  '          {settingsTab === "imports" ? <SettingsImportsTab {...props} /> : null}',
  ...lines.slice(5899, 6136),
  ...lines.slice(6341)
];

const finalSettingsView = newSettingsView.join('\n').replace(
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";',
  'import { SettingsAuditTab } from "./components/settings/SettingsAuditTab";\nimport { SettingsImportsTab } from "./components/settings/SettingsImportsTab";'
);

fs.writeFileSync('apps/web/src/SettingsView.tsx', finalSettingsView, 'utf8');
