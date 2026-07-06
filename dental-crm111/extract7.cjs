const fs = require('fs');

const content = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');
const lines = content.split('\n');

function findIndex(pattern, startIdx = 0) {
  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes(pattern)) return i;
  }
  return -1;
}

const stateStart = findIndex('export function SettingsView(props: SettingsViewProps) {') + 1;
const stateEnd = findIndex('  return (', stateStart) - 1; // Ends at empty line before return
console.log('State block: ', stateStart, 'to', stateEnd);
const stateBlock = lines.slice(stateStart, stateEnd).join('\n');

const block1Start = findIndex('{settingsTab === "imports" ? (');
const block1End = findIndex('{clinicPublicLookup && settingsTab === "imports" ? (', block1Start) - 1; 
// Wait, clinicPublicLookup is INSIDE the section. 
// We want block 1 to end at `) : null}` right before `clinicPublicLookup`.
console.log('Block 1: ', block1Start, 'to', block1End);
const block1 = lines.slice(block1Start + 1, block1End + 1).join('\n'); 
// +1 because we don't want `{settingsTab === "imports" ? (` and we DO want `) : null}`.
// Wait, no! If we do +1, it starts from `<section>`. We don't want the condition wrapper, we just want the JSX.
// And we don't want the closing `) : null}` for the wrapper, but earlier we saw `) : null}` at 4820 CLOSED the `typedMigrationSourceProbe`!
// So let's NOT try to slice the JSX without the wrapper! 
// Let's just slice WITH the wrapper `{settingsTab === "imports" ? (` for ALL blocks!
// This is safest because then we don't break ANY JSX.

const b1Start = findIndex('{settingsTab === "imports" ? (');
const b1End = findIndex('{["imports", "sources"].includes(settingsTab) ? (', b1Start) - 1; 
// b1End should be the `) : null}` that closes `{settingsTab === "imports" ? (`!
// This is right before `["imports", "sources"]...`!
console.log('B1: ', b1Start, 'to', b1End);
const block1Safe = lines.slice(b1Start, b1End + 1).join('\n');

const b2Start = b1End + 1; // '{["imports", "sources"].includes(settingsTab) ? ('
const b2End = findIndex('{settingsTab === "audit" ? (', b2Start) - 1;
// b2End should be the `) : null}` right before `settingsTab === "audit"`!
console.log('B2: ', b2Start, 'to', b2End);
const block2Safe = lines.slice(b2Start, b2End + 1).join('\n');

const auditStart = b2End + 1; // '{settingsTab === "audit" ? ('
const auditEnd = findIndex('{settingsTab === "imports" ? (', auditStart) - 1;
// auditEnd should be the `) : null}` right before the next `settingsTab === "imports"`!
console.log('Audit: ', auditStart, 'to', auditEnd);
const auditBlockSafe = lines.slice(auditStart, auditEnd + 1).join('\n');

const b3Start = auditEnd + 1; // '{settingsTab === "imports" ? ('
// Next block is `          </div>` right before `        </section>` which closes the `settings-zone`!
const b3End = findIndex('          </div>', b3Start) - 1; 
// b3End should be the `) : null}` right before `</div>`
console.log('B3: ', b3Start, 'to', b3End);
const block3Safe = lines.slice(b3Start, b3End + 1).join('\n');

const importsTabContent = `import { Sparkles, Database, FileText, UploadCloud, ImageIcon, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, RotateCw, FlipHorizontal, ZoomOut, ZoomIn, RefreshCw, X, AlertTriangle, HelpCircle, FileCheck2, Layers3 } from 'lucide-react';
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

export function SettingsImportsTab(props: Record<string, any>) {
` + stateBlock + `

  return (
    <>
` + block1Safe + `\n` + block2Safe + `\n` + block3Safe + `
    </>
  );
}
`;

fs.writeFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', importsTabContent, 'utf8');

const newSettingsView = [
  ...lines.slice(0, b1Start),
  '          <SettingsImportsTab {...props} />',
  '          <SettingsAuditTab {...props} />',
  ...lines.slice(b3End + 1)
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
