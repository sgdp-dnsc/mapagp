const fs = require('fs');
const path = require('path');

const files = ['extract-data.js', 'src/data.json'];
files.forEach(f => {
    const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
    console.log(`--- FILE: ${f} ---`);
    console.log(content);
    console.log(`--- END FILE: ${f} ---`);
});
