import { parseDictationLocally } from './apps/api/src/ai/localDictationParser.js';

const res = parseDictationLocally('записать ивана иванова на завтра', 'schedule');
console.log(JSON.stringify(res, null, 2));

const res2 = parseDictationLocally('отмени запись петров петр', 'schedule');
console.log(JSON.stringify(res2, null, 2));
