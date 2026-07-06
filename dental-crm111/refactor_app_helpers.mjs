import { Project } from "ts-morph";
import path from "path";
import fs from "fs";

const project = new Project();
const helpersFile = project.addSourceFileAtPath("apps/web/src/AppHelpers.tsx");

// Find all functions and constants
const functions = helpersFile.getFunctions();

let formatCount = 0;
const formattingPath = path.resolve("apps/web/src/utils/formatting.ts");
if (!fs.existsSync(path.dirname(formattingPath))) {
  fs.mkdirSync(path.dirname(formattingPath), { recursive: true });
}
const formattingFile = project.createSourceFile("apps/web/src/utils/formatting.ts", "", { overwrite: true });

// Move functions starting with "format" or similar formatting utilities
const funcsToExtract = functions.filter(f => {
  const name = f.getName();
  return name && (name.startsWith("format") || name.startsWith("humanize"));
});

for (const func of funcsToExtract) {
  const name = func.getName();
  const text = func.getText();
  
  // Quick and dirty copy: we just copy the raw text to formatting.ts and remove from original
  formattingFile.addStatements(text);
  func.remove();
  formatCount++;
}

// Ensure formatting.ts has all exported functions exported
formattingFile.getFunctions().forEach(f => {
  if (!f.isExported()) {
    f.setIsExported(true);
  }
});

// Add imports to formatting.ts (we just copy all imports from AppHelpers for safety)
const imports = helpersFile.getImportDeclarations();
for (const imp of imports) {
  formattingFile.addImportDeclaration({
    defaultImport: imp.getDefaultImport()?.getText(),
    namedImports: imp.getNamedImports().map(n => n.getText()),
    moduleSpecifier: imp.getModuleSpecifierValue()
  });
}

// In AppHelpers.tsx, export everything from formatting.ts so we don't break existing imports
helpersFile.addExportDeclaration({
  moduleSpecifier: "./utils/formatting"
});

project.saveSync();
console.log(`Extracted ${formatCount} formatting functions.`);
