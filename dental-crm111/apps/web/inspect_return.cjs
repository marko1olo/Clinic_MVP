const fs = require('fs');
const { Project, SyntaxKind } = require('ts-morph');

async function main() {
  const filePath = 'C:/Clinic_MVP/dental-crm/apps/web/src/useAppLogic.tsx';
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  
  const useAppLogicDecl = sourceFile.getFunction('useAppLogic');
  if (!useAppLogicDecl) {
    console.log('useAppLogic not found');
    return;
  }
  
  const returnStatements = useAppLogicDecl.getDescendantsOfKind(SyntaxKind.ReturnStatement);
  console.log(`Found ${returnStatements.length} return statements.`);
  
  const lastReturn = returnStatements[returnStatements.length - 1];
  console.log(`Last return statement line: ${lastReturn.getStartLineNumber()}`);
  
  // Let's print the return statement text (first 2000 characters)
  console.log(lastReturn.getText().substring(0, 2000));
}

main().catch(console.error);
