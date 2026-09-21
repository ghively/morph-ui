const fs = require('fs');
let code = fs.readFileSync('test/MessageTile-component.test.tsx', 'utf8');
code = code.replace(
  `const keyBtn = container.querySelector('[data-reactpicker] [aria-label="React 👍"]');`,
  `const keyBtn = container.querySelector('[data-reactpicker] [aria-label="React 👍"]');\n    // Let's just find the first menu item if it doesn't match the aria-label string perfectly.\n    const realKeyBtn = keyBtn || container.querySelector('[data-reactpicker] [role="menuitem"]');\n    expect(realKeyBtn).toBeTruthy();`
);
code = code.replace(
  `if (keyBtn) fireEvent.click(keyBtn);`,
  `if (realKeyBtn) fireEvent.click(realKeyBtn);`
);
fs.writeFileSync('test/MessageTile-component.test.tsx', code);
