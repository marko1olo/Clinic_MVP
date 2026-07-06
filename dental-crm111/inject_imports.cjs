const fs = require('fs');

const settingsView = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');

// Find the end of the imports block in SettingsView.tsx
const importsEnd = settingsView.indexOf('const integrationInputLabels');
let importsBlock = settingsView.substring(0, importsEnd);

// Remove specific imports that might clash or aren't needed
importsBlock = importsBlock.replace(/import \{ SettingsImportsTab \} from "\.\/components\/settings\/SettingsImportsTab";\n/g, '');
importsBlock = importsBlock.replace(/import \{ SettingsAuditTab \} from "\.\/components\/settings\/SettingsAuditTab";\n/g, '');

// Adjust relative paths
importsBlock = importsBlock.replace(/(from\s+["'])(?:\.\.\/)(.*?["'])/g, '$1../../../$2');
importsBlock = importsBlock.replace(/(from\s+["'])(?:\.\/)(.*?["'])/g, '$1../../$2');

// Add the missing helper functions exported from SettingsView.tsx
const exportsToImport = [
  'humanizeMigrationText',
  'localBridgeEndpointSummary',
  'clinicPublicLookupBoundaryText',
  'clinicPublicLookupSuggestionSourceLabels',
  'clinicPublicLookupFieldLabels',
  'clinicPublicLookupWarningText',
  'migrationOwnerLabels',
  'migrationAdapterStatusLabels',
  'migrationAutomationLevelLabels',
  'migrationReadinessLevelLabels',
  'migrationBridgeKitKindLabels',
  'migrationBridgeKitStatusLabels',
  'humanizeMigrationList',
  'humanizeMigrationColumns',
  'migrationEntityLabels',
  'migrationHandoffRouteLabel',
  'migrationWorkupStepStatusLabels',
  'smartImportMigrationPlanStatusLabels',
  'dicomFirstFrameImageTypeLabel',
  'dicomSeriesDisplayText',
  'dicomSeriesWarningText',
  'formatBrowserImagingScanElapsed',
  'migrationSourceKindLabel',
  'migrationSourceDisplayName'
];

importsBlock += '\nimport { ' + exportsToImport.join(', ') + ' } from "../../SettingsView";\n';

function fixTab(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  // Remove existing imports in the tab
  const tabComponentStart = content.indexOf('export function ');
  const componentBody = content.substring(tabComponentStart);
  
  // Combine the fixed imports block with the component body
  const newContent = importsBlock + '\n' + componentBody;
  fs.writeFileSync(filepath, newContent, 'utf8');
}

fixTab('apps/web/src/components/settings/SettingsImportsTab.tsx');
fixTab('apps/web/src/components/settings/SettingsAuditTab.tsx');
