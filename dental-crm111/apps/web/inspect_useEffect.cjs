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
  
  const expressions = useAppLogicDecl.getDescendantsOfKind(SyntaxKind.ExpressionStatement);
  expressions.forEach(expr => {
    const text = expr.getText();
    if (text.startsWith('useEffect')) {
      const lines = text.split('\n');
      console.log(`Line ${expr.getStartLineNumber()}: ${lines.slice(0, 3).join('\n    ')}...`);
    }
  });
}

main().catch(console.error);
