const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../apps/web/src/store/settingsStore.ts');
let storeCode = fs.readFileSync(targetPath, 'utf8');

// 1. Remove my hardcoded variables
storeCode = storeCode.replace(/const currentView = "settings";\n/g, '');
storeCode = storeCode.replace(/const settingsTab = "clinic";\n/g, '');
storeCode = storeCode.replace(/const emptyTelegramVisualCardUrlDrafts.*\n/g, '');
storeCode = storeCode.replace(/const defaultTelegramPostVisitCheckupDelayDrafts.*\n/g, '');

// 2. Add imports
storeCode = storeCode.replace('initialUiPreferences', 'loadUiPreferences, defaultUiPreferences, emptyTelegramVisualCardUrlDrafts, defaultTelegramPostVisitCheckupDelayDrafts');

// 3. Replace occurrences of initialUiPreferences with loadUiPreferences
storeCode = storeCode.replace(/initialUiPreferences\./g, '(loadUiPreferences() ?? defaultUiPreferences).');

// 4. Update type imports. Types need `type` keyword or just imported normally, but TypeScript might complain if it's imported normally but only exported as type.
// I will just use `type` for all of them.
storeCode = storeCode.replace(
  /\b(?:type\s+)?TelegramFeaturePlan,/g, 'type TelegramFeaturePlan,'
).replace(
  /\b(?:type\s+)?TelegramOutboxStatusFilter,/g, 'type TelegramOutboxStatusFilter,'
).replace(
  /\b(?:type\s+)?TelegramOutboxTemplateFilter,/g, 'type TelegramOutboxTemplateFilter,'
).replace(
  /\b(?:type\s+)?TelegramLinkSubjectType,/g, 'type TelegramLinkSubjectType,'
).replace(
  /\b(?:type\s+)?TelegramPostVisitCheckupDelayDrafts,/g, 'type TelegramPostVisitCheckupDelayDrafts,'
).replace(
  /\b(?:type\s+)?DenteTelegramHandoffTarget,/g, 'type DenteTelegramHandoffTarget,'
).replace(
  /\b(?:type\s+)?OnboardingStep,/g, 'type OnboardingStep,'
);

// 5. Update emptyTelegramVisualCardUrlDrafts and defaultTelegramPostVisitCheckupDelayDrafts calls in the object
storeCode = storeCode.replace(/emptyTelegramVisualCardUrlDrafts:\s*emptyTelegramVisualCardUrlDrafts,/g, 'emptyTelegramVisualCardUrlDrafts: emptyTelegramVisualCardUrlDrafts(),');
// For defaultTelegramPostVisitCheckupDelayDrafts it's an object exported from AppHelpers, keep it as is, just imported.

// 6. Update currentView and settingsTab usages (they were inside a lambda)
// The initial state had `onboardingGuideExpanded: currentView === "settings" && settingsTab === "clinic"`
// Let's replace it with false, as a default initial state for store.
storeCode = storeCode.replace(/currentView === "settings" && settingsTab === "clinic"/g, 'false');

fs.writeFileSync(targetPath, storeCode);
console.log('settingsStore updated');
