const fs = require('fs');
let code = fs.readFileSync('src/components/MessageTile.tsx', 'utf8');
console.log(code.match(/reactpicker/));
console.log(code.match(/React /));
