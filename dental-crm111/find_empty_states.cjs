const fs = require('fs');
const glob = require('C:/Clinic_MVP/dental-crm/node_modules/glob');
const files = glob.sync('C:/Clinic_MVP/dental-crm/apps/web/src/**/*.tsx');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let m = content.match(/<div className=\"[^\"]*p-[48][^\"]*\">([^<]*?(Нет|пуст|не найдено)[^<]*)<\/div>/gi);
  if (m) console.log(f.split('/').pop(), m);
});
