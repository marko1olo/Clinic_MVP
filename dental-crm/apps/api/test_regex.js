const regex = /^\s*--\s*no-transaction(?:\s|$)/i;
console.log('regex:', regex);
console.log('mode:', regex.test('-- no-transaction-mode'));
console.log('exact:', regex.test('-- no-transaction'));
console.log('space:', regex.test('-- no-transaction '));
console.log('tab:', regex.test('-- no-transaction\t'));
console.log('windows newline:', regex.test('-- no-transaction\r\n'));
