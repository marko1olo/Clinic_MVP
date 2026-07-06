const fs = require('fs');

const exportsToMake = [
  'const clinicPublicLookupBoundaryText',
  'const clinicPublicLookupSuggestionSourceLabels',
  'const clinicPublicLookupFieldLabels',
  'const clinicPublicLookupWarningText',
  'const migrationOwnerLabels',
  'const migrationAdapterStatusLabels',
  'const migrationAutomationLevelLabels',
  'const migrationReadinessLevelLabels',
  'const migrationBridgeKitKindLabels',
  'const migrationBridgeKitStatusLabels',
  'const humanizeMigrationList',
  'const humanizeMigrationColumns',
  'const migrationEntityLabels',
  'const migrationHandoffRouteLabel',
  'const migrationWorkupStepStatusLabels',
  'const smartImportMigrationPlanStatusLabels',
  'const dicomFirstFrameImageTypeLabel',
  'const dicomSeriesDisplayText',
  'const dicomSeriesWarningText',
  'const formatBrowserImagingScanElapsed',
  'const migrationSourceKindLabel',
  'const migrationSourceDisplayName'
];

let settingsView = fs.readFileSync('apps/web/src/SettingsView.tsx', 'utf8');

exportsToMake.forEach(decl => {
  settingsView = settingsView.replace(
    new RegExp('^' + decl, 'm'),
    'export ' + decl
  );
});

fs.writeFileSync('apps/web/src/SettingsView.tsx', settingsView, 'utf8');

let importsTab = fs.readFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', 'utf8');

const additionalLucide = 'ClipboardCheck, ScanSearch, ExternalLink, ShieldCheck, Search, CircleStop, Gauge';
importsTab = importsTab.replace(
  "import { Sparkles",
  "import { " + additionalLucide + ", Sparkles"
);

const additionalSettingsImports = exportsToMake.map(decl => decl.replace('const ', '')).join(',\n  ');

importsTab = importsTab.replace(
  "humanizeMigrationText,",
  "humanizeMigrationText,\n  " + additionalSettingsImports + ","
);

importsTab = importsTab.replace(/\(event\.target\)\.files/g, "(event.target as HTMLInputElement).files");
importsTab = importsTab.replace(/\(event\.target\)\.value/g, "(event.target as HTMLInputElement).value");

fs.writeFileSync('apps/web/src/components/settings/SettingsImportsTab.tsx', importsTab, 'utf8');
