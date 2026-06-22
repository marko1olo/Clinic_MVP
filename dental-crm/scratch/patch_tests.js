import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const scriptsDir = "scripts";
const files = readdirSync(scriptsDir).filter(f => f.endsWith(".mjs") || f.endsWith(".js"));

for (const file of files) {
  const filePath = path.join(scriptsDir, file);
  let content = readFileSync(filePath, "utf8");
  
  // Match readFileSync("apps/web/src/App.tsx", "utf8") or similar
  const pattern = /(fs\.)?readFileSync\(['"]apps\/web\/src\/App\.tsx['"],\s*['"]utf8['"]\)/g;
  
  if (pattern.test(content)) {
    console.log(`Patching ${file}...`);
    content = content.replace(pattern, (match, fsPrefix) => {
      const read = fsPrefix ? "fs.readFileSync" : "readFileSync";
      return `(${read}("apps/web/src/App.tsx", "utf8") + "\\n" + ${read}("apps/web/src/useAppLogic.tsx", "utf8") + "\\n" + ${read}("apps/web/src/ImagingView.tsx", "utf8") + "\\n" + ${read}("apps/web/src/VisitView.tsx", "utf8"))`;
    });
    writeFileSync(filePath, content, "utf8");
  }
}

console.log("All matching tests patched successfully.");
