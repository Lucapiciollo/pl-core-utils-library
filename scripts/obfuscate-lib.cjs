const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const fesmDir = path.join(process.cwd(), 'dist', 'pl-core-utils-library', 'fesm2022');

if (!fs.existsSync(fesmDir)) {
  throw new Error(`FESM directory not found: ${fesmDir}. Run build:lib before obfuscation.`);
}

const mjsFiles = fs
  .readdirSync(fesmDir)
  .filter(fileName => fileName.endsWith('.mjs'));

if (mjsFiles.length === 0) {
  throw new Error(`No .mjs bundle found in ${fesmDir}`);
}

for (const fileName of mjsFiles) {
  const filePath = path.join(fesmDir, fileName);
  const sourceCode = fs.readFileSync(filePath, 'utf8');

  const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, {
    compact: true,
    simplify: true,
    stringArray: true,
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    renameProperties: false,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    selfDefending: false,
    target: 'browser-no-eval'
  });

  fs.writeFileSync(filePath, obfuscated.getObfuscatedCode(), 'utf8');
  console.log(`Obfuscated: ${path.relative(process.cwd(), filePath)}`);
}
