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
  
  const mprDecls = [];
  
  // Find variables/functions inside the hook body
  const statements = useAppLogicDecl.getBody().getStatements();
  statements.forEach(stmt => {
    const text = stmt.getText();
    if (stmt.getKind() === SyntaxKind.VariableStatement) {
      stmt.getDeclarations().forEach(dec => {
        const name = dec.getName();
        if (name.toLowerCase().includes('mpr')) {
          mprDecls.push({ name, kind: 'Variable', line: dec.getStartLineNumber() });
        }
      });
    } else if (stmt.getKind() === SyntaxKind.FunctionDeclaration) {
      const name = stmt.getName();
      if (name && name.toLowerCase().includes('mpr')) {
        mprDecls.push({ name, kind: 'Function', line: stmt.getStartLineNumber() });
      }
    }
  });

  console.log(`Found ${mprDecls.length} MPR declarations:`);
  mprDecls.forEach(d => {
    console.log(`- [${d.kind}] ${d.name} (Line ${d.line})`);
  });
}

main().catch(console.error);
