const fs = require('fs');

let content = fs.readFileSync('c:/PORTFOLIO ####/index.html', 'utf8');

// Use relative local path for frame images
content = content
  .replace(
    /const getPath1 = \(i\) => `.*`;/,
    "const getPath1 = (i) => `./ezgif-frame-${String(i).padStart(3, '0')}.jpg`;"
  )
  .replace(
    /const getPath2 = \(i\) => `.*`;/,
    "const getPath2 = (i) => `../ezgif-3cf9a17403fe8e56-jpg/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;"
  );

fs.writeFileSync('c:/ezgif-3cf9a17403fe8e56-jpg/index.html', content, 'utf8');
fs.writeFileSync('c:/PORTFOLIO ####/index.html', content, 'utf8');

console.log('Successfully synced index.html from PORTFOLIO folder to ezgif folder!');
