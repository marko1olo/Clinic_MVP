const fs = require('fs');
const path = require('path');

function findLoops(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory() && !fullPath.includes('test') && !fullPath.includes('node_modules')) {
            findLoops(fullPath);
        } else if (file.isFile() && fullPath.endsWith('.ts') && !fullPath.includes('.test.ts') && !fullPath.includes('Proof.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            let inLoop = false;
            let loopStartLine = 0;
            let bracketCount = 0;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!inLoop) {
                    if (line.match(/\b(for\s*\(|while\s*\()/)) {
                        inLoop = true;
                        loopStartLine = i + 1;
                        bracketCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                    }
                } else {
                    bracketCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                    if (line.match(/await\s+(db|tx|tenantTx)\./)) {
                        console.log(`N+1 Warning in ${fullPath}:${i+1} (Loop started at line ${loopStartLine})`);
                        console.log(`  > ${line.trim()}`);
                    }
                    if (bracketCount <= 0 && i >= loopStartLine - 1) {
                        inLoop = false;
                    }
                }
            }
        }
    }
}
findLoops('C:/Clinic_MVP/dental-crm/apps/api/src');
