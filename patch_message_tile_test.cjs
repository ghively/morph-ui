const fs = require('fs');
let code = fs.readFileSync('test/MessageTile-component.test.tsx', 'utf8');
code = code.replace(
  `expect(keyBtn).toBeTruthy();`,
  `// expect(keyBtn).toBeTruthy();`
);
code = code.replace(
  `const keyBtn = container.querySelector('[aria-label="React 👍"]');`,
  `const keyBtn = container.querySelector('[data-reactpicker] [aria-label="React 👍"]');\n    expect(keyBtn).toBeTruthy();`
);
fs.writeFileSync('test/MessageTile-component.test.tsx', code);
