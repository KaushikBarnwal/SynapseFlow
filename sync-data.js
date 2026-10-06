// SynapseFlow Automatic Curriculum Synchronizer
// Reads pure Markdown from subjects/ and compiles to offline-safe Zero-CORS data/*.js scripts.
const fs = require('fs');
const path = require('path');

const subjectsDir = path.join(__dirname, 'subjects');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Map filenames to subject keys
const subjectMap = {
  'java-prep.md': 'java',
  'python-prep.md': 'python',
  'os-prep.md': 'os',
  'networking-prep.md': 'networking',
  'sql-prep.md': 'sql',
  'dsa-prep.md': 'dsa'
};

console.log('⚡ SynapseFlow: Syncing subjects/ -> data/*.js ...');

Object.entries(subjectMap).forEach(([file, key]) => {
  const filePath = path.join(subjectsDir, file);
  if (!fs.existsSync(filePath)) return;

  const rawMd = fs.readFileSync(filePath, 'utf8');
  // Safe JS template escaping
  const escaped = rawMd
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  const jsContent = `// Auto-generated from subjects/${file} - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['${key}'] = \`${escaped}\`;
`;

  const targetPath = path.join(dataDir, `${key}.js`);
  fs.writeFileSync(targetPath, jsContent, 'utf8');
  console.log(`  ✓ Synced ${file} -> data/${key}.js (${(jsContent.length / 1024).toFixed(1)} KB)`);
});

console.log('✨ All subjects synchronized successfully!');
