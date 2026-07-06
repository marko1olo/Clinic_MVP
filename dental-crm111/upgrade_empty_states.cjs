const fs = require('fs');
const glob = require('C:/Clinic_MVP/dental-crm/node_modules/glob');
const files = glob.sync('C:/Clinic_MVP/dental-crm/apps/web/src/**/*.tsx');
let count = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/<div className=\"[^\"]*text-center[^\"]*text-gray-500[^\"]*\">([^<]+)<\/div>/g);
  if (matches) {
    matches.forEach(m => {
      const innerText = m.match(/>([^<]+)</)[1];
      if (innerText.includes('Нет ') || innerText.includes('пуст') || innerText.includes('найден')) {
        console.log('Upgrading in', f.split('/').pop(), ':', innerText);
        
        // Upgrade empty state
        const newMarkup = `
          <div className="flex flex-col items-center justify-center p-8 my-4 text-center bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-md shadow-inner animate-fade-in transition-all duration-300 hover:bg-gray-800/50">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg className="w-8 h-8 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-200 tracking-tight">${innerText}</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">Записи отсутствуют. Здесь пока нет данных для отображения.</p>
          </div>
        `;
        content = content.replace(m, newMarkup);
        count++;
      }
    });
    fs.writeFileSync(f, content);
  }
});
console.log('Upgraded empty states:', count);
