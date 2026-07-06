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
    const names = props.map(p => p.getName());
    
    const mprKeys = names.filter(n => n.toLowerCase().includes('mpr'));
    console.log(`Found ${mprKeys.length} MPR-related keys:`);
    console.log(mprKeys.join(', '));
  }
}

main().catch(console.error);
