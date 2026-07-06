import fs from "fs";
import path from "path";

const targetFile = path.resolve("apps/web/src/components/settings/SettingsImportsTab.tsx");
const typesFile = path.resolve("apps/web/src/components/settings/SettingsImportsTab.types.ts");

const content = fs.readFileSync(targetFile, "utf-8");

// Find the start of the component
const componentStartIdx = content.indexOf("export function SettingsImportsTab");

if (componentStartIdx === -1) {
  console.error("Could not find component start!");
  process.exit(1);
}

// Get everything before the component
const preComponent = content.slice(0, componentStartIdx);

// The last import statement ends around line 217
// Let's find the last import
const lastImportIdx = preComponent.lastIndexOf("import ");
const endOfImportsIdx = preComponent.indexOf(";", lastImportIdx) + 1;

const imports = preComponent.slice(0, endOfImportsIdx);
let typesAndConstants = preComponent.slice(endOfImportsIdx);

// Replace "type " with "export type " and "const " with "export const "
typesAndConstants = typesAndConstants.replace(/^type /gm, "export type ");
typesAndConstants = typesAndConstants.replace(/^const /gm, "export const ");
typesAndConstants = typesAndConstants.replace(/^function /gm, "export function ");

// Now generate the types file
const typesContent = `${imports}\n${typesAndConstants}`;
fs.writeFileSync(typesFile, typesContent);

// Now we need to modify the original file to import these
// We need to extract all the names we just exported so we can import them
const exportRegex = /^export (?:const|type|function) ([a-zA-Z0-9_]+)/gm;
const exportedNames = [];
let match;
while ((match = exportRegex.exec(typesAndConstants)) !== null) {
  exportedNames.push(match[1]);
}

const importStatement = `import {\n  ${exportedNames.join(",\n  ")}\n} from "./SettingsImportsTab.types";\n\n`;

const newOriginalContent = `${imports}\n${importStatement}${content.slice(componentStartIdx)}`;
fs.writeFileSync(targetFile, newOriginalContent);

console.log("Extraction complete! Extracted " + exportedNames.length + " symbols.");
