const fs = require('fs');
const path = require('path');

const srcDir = 'c:/ezgif-3cf9a17403fe8e56-jpg';
const destDir = 'c:/PORTFOLIO ####';

const files = fs.readdirSync(srcDir).filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.jpg'));
console.log(`Copying ${files.length} frame images...`);

let count = 0;
files.forEach(file => {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  count++;
});

console.log(`Successfully copied ${count} frame files to PORTFOLIO folder!`);
