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
  
  const variableStatements = useAppLogicDecl.getDescendantsOfKind(SyntaxKind.VariableStatement);
  variableStatements.forEach(stmt => {
    if (stmt.getText().includes('useState')) {
      console.log(`Line ${stmt.getStartLineNumber()}: ${stmt.getText().trim()}`);
    }
  });
}

main().catch(console.error);
