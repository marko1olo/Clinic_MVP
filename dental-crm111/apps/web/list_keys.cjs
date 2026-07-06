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
  const lastReturn = returnStatements[returnStatements.length - 1];
  const objExpr = lastReturn.getExpression();
  
  if (objExpr.getKind() === SyntaxKind.ObjectLiteralExpression) {
    const props = objExpr.getProperties();
    console.log(`Total properties: ${props.length}`);
    const names = props.map(p => p.getName());
    console.log(names.join(', '));
  } else {
    console.log('Return expression is not an object literal');
  }
}

main().catch(console.error);
