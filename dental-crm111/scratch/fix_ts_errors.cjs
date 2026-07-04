const fs = require('fs');
const path = require('path');

// Fix appStore.ts
const appStorePath = path.resolve(__dirname, '../apps/web/src/store/appStore.ts');
if (fs.existsSync(appStorePath)) {
  let code = fs.readFileSync(appStorePath, 'utf8');
  code = code.replace(/initialRecognitionText/g, '""');
  fs.writeFileSync(appStorePath, code);
  console.log('Fixed appStore.ts');
} else {
  console.log(`Could not find ${appStorePath}`);
}

// Fix App.tsx implicit any errors
const appPath = path.resolve(__dirname, '../apps/web/src/App.tsx');
if (fs.existsSync(appPath)) {
  let appCode = fs.readFileSync(appPath, 'utf8');

  // Replace standard implicit anys
  // e.g. .map(payment => ...) -> .map((payment: any) => ...)
  const params = [
    'payment', 'document', 'current', 'item', 'source', 'warning', 'catalogItem',
    'line', 'profile', 'policy', 'queue', 'action', 'suggestion', 'service', 'member', 'chair'
  ];

  params.forEach(param => {
    const regex = new RegExp('\\b(' + param + ')\\s*=>', 'g');
    appCode = appCode.replace(regex, '($1: any) =>');

    const regex2 = new RegExp('\\(\\s*(' + param + ')\\s*\\)\\s*=>', 'g');
    appCode = appCode.replace(regex2, '($1: any) =>');
  });

  // Also Map types: `new Map()` -> `new Map<any, any>()`
  appCode = appCode.replace(/new Map\(\)/g, 'new Map<any, any>()');

  fs.writeFileSync(appPath, appCode);
  console.log('Fixed implicit anys in App.tsx');
} else {
  console.log(`Could not find ${appPath}`);
}
