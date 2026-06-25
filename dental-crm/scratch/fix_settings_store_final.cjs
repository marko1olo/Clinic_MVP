const fs = require('fs');

let storeCode = fs.readFileSync('./dental-crm/apps/web/src/store/settingsStore.ts', 'utf8');

// 1. Remove my hardcoded variables
storeCode = storeCode.replace(/const currentView = "settings";\n/g, '');
storeCode = storeCode.replace(/const settingsTab = "clinic";\n/g, '');
storeCode = storeCode.replace(/const emptyTelegramVisualCardUrlDrafts.*\n/g, '');
storeCode = storeCode.replace(/const defaultTelegramPostVisitCheckupDelayDrafts.*\n/g, '');

// 2. Add imports
storeCode = storeCode.replace('initialUiPreferences', 'loadUiPreferences, defaultUiPreferences, emptyTelegramVisualCardUrlDrafts, defaultTelegramPostVisitCheckupDelayDrafts');

// 3. Fix initialUiPreferences usages
storeCode = storeCode.replace(/initialUiPreferences\./g, '(loadUiPreferences() ?? defaultUiPreferences).');

// 4. Fix type imports. Types need `type` keyword or just imported normally, but TypeScript might complain if it's imported normally but only exported as type.
// I will just use `type` for all of them.
storeCode = storeCode.replace(
  /(?<!type\s+)TelegramFeaturePlan,/, 'type TelegramFeaturePlan,'
).replace(
  /(?<!type\s+)TelegramOutboxStatusFilter,/, 'type TelegramOutboxStatusFilter,'
).replace(
  /(?<!type\s+)TelegramOutboxTemplateFilter,/, 'type TelegramOutboxTemplateFilter,'
).replace(
  /(?<!type\s+)TelegramLinkSubjectType,/, 'type TelegramLinkSubjectType,'
).replace(
  /(?<!type\s+)\bTelegramPostVisitCheckupDelayDrafts,/, 'type TelegramPostVisitCheckupDelayDrafts,'
).replace(
  /(?<!type\s+)DenteTelegramHandoffTarget,/, 'type DenteTelegramHandoffTarget,'
).replace(
  /(?<!type\s+)OnboardingStep,/, 'type OnboardingStep,'
);

// 5. Fix emptyTelegramVisualCardUrlDrafts and defaultTelegramPostVisitCheckupDelayDrafts calls in the object
// Only replace in the object values, not the import
storeCode = storeCode.replace(/telegramVisualCardUrlDrafts:\s*emptyTelegramVisualCardUrlDrafts,/g, 'telegramVisualCardUrlDrafts: emptyTelegramVisualCardUrlDrafts(),');
// For defaultTelegramPostVisitCheckupDelayDrafts it's an object exported from AppHelpers, keep it as is, just imported.

// 6. Fix currentView and settingsTab usages (they were inside a lambda)
// The initial state had `onboardingGuideExpanded: currentView === "settings" && settingsTab === "clinic"`
// Let's replace it with false, as a default initial state for store.
storeCode = storeCode.replace(/currentView === "settings" && settingsTab === "clinic"/g, 'false');

fs.writeFileSync('./dental-crm/apps/web/src/store/settingsStore.ts', storeCode);
console.log('settingsStore fixed');
