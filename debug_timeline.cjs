const fs = require('fs');
let testCode = fs.readFileSync('test/MessageTimeline-component.test.tsx', 'utf8');
let tileCode = fs.readFileSync('src/components/MessageTile.tsx', 'utf8');
console.log(tileCode.match(/data-continuation/g));
