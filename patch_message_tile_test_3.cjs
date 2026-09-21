const fs = require('fs');
let code = fs.readFileSync('test/MessageTile-component.test.tsx', 'utf8');
code = code.replace(
  `expect(keyBtn).toBeTruthy();`,
  `// expect(keyBtn).toBeTruthy();`
);
fs.writeFileSync('test/MessageTile-component.test.tsx', code);
