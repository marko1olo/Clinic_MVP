const { Project } = require('ts-morph');
const project = new Project();
const sourceFile = project.addSourceFileAtPath('apps/web/src/useAppLogic.tsx');

const funcs = sourceFile.getFunctions();
console.log('Top-level functions:', funcs.map(f => f.getName()).join(', '));
