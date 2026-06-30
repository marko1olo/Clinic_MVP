const fs = require('fs');

let storeCode = fs.readFileSync('/app/dental-crm111/apps/web/src/store/settingsStore.ts', 'utf8');

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
  'TelegramFeaturePlan,', 'type TelegramFeaturePlan,'
).replace(
  'TelegramOutboxStatusFilter,', 'type TelegramOutboxStatusFilter,'
).replace(
  'TelegramOutboxTemplateFilter,', 'type TelegramOutboxTemplateFilter,'
).replace(
  'TelegramLinkSubjectType,', 'type TelegramLinkSubjectType,'
).replace(
  'TelegramPostVisitCheckupDelayDrafts,', 'type TelegramPostVisitCheckupDelayDrafts,'
).replace(
  'DenteTelegramHandoffTarget,', 'type DenteTelegramHandoffTarget,'
).replace(
  'OnboardingStep,', 'type OnboardingStep,'
);

// 5. Fix emptyTelegramVisualCardUrlDrafts and defaultTelegramPostVisitCheckupDelayDrafts calls in the object
storeCode = storeCode.replace(/telegramVisualCardUrlDrafts: emptyTelegramVisualCardUrlDrafts,/g, 'telegramVisualCardUrlDrafts: emptyTelegramVisualCardUrlDrafts(),');
storeCode = storeCode.replace(/telegramPostVisitCheckupDelayDrafts: defaultTelegramPostVisitCheckupDelayDrafts,/g, 'telegramPostVisitCheckupDelayDrafts: { ...defaultTelegramPostVisitCheckupDelayDrafts },');

// 6. Fix currentView and settingsTab usages (they were inside a lambda)
// The initial state had `onboardingGuideExpanded: currentView === "settings" && settingsTab === "clinic"`
// Let's replace it with false, as a default initial state for store.
storeCode = storeCode.replace(/currentView === "settings" && settingsTab === "clinic"/g, 'false');

fs.writeFileSync('/app/dental-crm111/apps/web/src/store/settingsStore.ts', storeCode);
console.log('settingsStore fixed');
