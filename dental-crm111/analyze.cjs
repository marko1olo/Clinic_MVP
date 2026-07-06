const { Project } = require('ts-morph');
const project = new Project();
const sourceFile = project.addSourceFileAtPath('apps/web/src/useAppLogic.tsx');
const hook = sourceFile.getFunction('useAppLogic');
if (!hook) { console.log('No hook found'); process.exit(1); }

const stmts = hook.getStatements();
console.log('Total statements:', stmts.length);

let varDecls = 0;
let funcDecls = 0;
let effectCalls = 0;

stmts.forEach(s => {
  if (s.getKindName() === 'VariableStatement') varDecls++;
  if (s.getKindName() === 'FunctionDeclaration') funcDecls++;
  if (s.getKindName() === 'ExpressionStatement' && s.getText().startsWith('useEffect')) effectCalls++;
});

console.log('Variables:', varDecls);
console.log('Functions:', funcDecls);
console.log('Effects:', effectCalls);
