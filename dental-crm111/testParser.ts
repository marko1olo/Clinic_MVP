import { parseDictationLocally } from './apps/api/src/ai/localDictationParser.js';

const tests = [
  { text: 'создай запись для петрова ивана на послезавтра в половине третьего', ctx: 'schedule' },
  { text: 'пациент иванова анна оплатила пять тысяч рублей', ctx: 'visit' },
  { text: 'удалить запись смирнова', ctx: 'schedule' },
  { text: 'запиши меня к хирургу на десятое число в десять утра', ctx: 'schedule' },
  { text: 'глубокий кариес и эндодонтия на двадцать первый', ctx: 'visit' }
];

for (const t of tests) {
  console.log('Text: ' + t.text);
  console.log(JSON.stringify(parseDictationLocally(t.text, t.ctx as any), null, 2));
}
