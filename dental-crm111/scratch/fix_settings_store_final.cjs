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
const typesToAdd = [
  'TelegramFeaturePlan',
  'TelegramOutboxStatusFilter',
  'TelegramOutboxTemplateFilter',
  'TelegramLinkSubjectType',
  'TelegramPostVisitCheckupDelayDrafts',
  'DenteTelegramHandoffTarget',
  'OnboardingStep',
  // @dental/shared types
  'DenteTelegramBotStatus',
  'DenteTelegramOutboxResponse',
  'DenteTelegramLinkCodePublic',
  'DenteTelegramChatLinkPublic',
  'DenteTelegramLinkCodeListResponse',
  'DenteTelegramChatLinkListResponse',
  'DenteTelegramLinkCodeCreated',
  'DenteTelegramMessagePreview',
  'DenteTelegramBotMode',
  'DenteTelegramVisualCardUrls',
  'DenteTelegramFeature',
  'DenteTelegramPrivacyMode'
];

typesToAdd.forEach(type => {
  // Use regex to add 'type ' only if it's not already preceded by 'type '
  const regex = new RegExp(`(?<!type\\s+)\\b${type}\\b,`, 'g');
  storeCode = storeCode.replace(regex, `type ${type},`);
});

// 5. Fix emptyTelegramVisualCardUrlDrafts and defaultTelegramPostVisitCheckupDelayDrafts calls in the object
storeCode = storeCode.replace(/telegramVisualCardUrlDrafts: emptyTelegramVisualCardUrlDrafts,/g, 'telegramVisualCardUrlDrafts: emptyTelegramVisualCardUrlDrafts(),');
// For defaultTelegramPostVisitCheckupDelayDrafts it's an object exported from AppHelpers, keep it as is, just imported.

// 6. Fix currentView and settingsTab usages (they were inside a lambda)
// The initial state had `onboardingGuideExpanded: currentView === "settings" && settingsTab === "clinic"`
// Let's replace it with false, as a default initial state for store.
storeCode = storeCode.replace(/currentView === "settings" && settingsTab === "clinic"/g, 'false');

fs.writeFileSync('/app/dental-crm111/apps/web/src/store/settingsStore.ts', storeCode);
console.log('settingsStore fixed');
