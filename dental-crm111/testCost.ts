import { parseDictationLocally } from './apps/api/src/ai/localDictationParser.js';
console.log(JSON.stringify(parseDictationLocally('пациент иванова анна оплатила пять тысяч рублей', 'visit' as any), null, 2));
