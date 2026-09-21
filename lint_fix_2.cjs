const fs = require('fs');

let mt = fs.readFileSync('src/components/MessageTile.tsx', 'utf8');
mt = mt.replace(
  `        const root = btn.closest('[data-turn]');\n        const picker = root.querySelector('[data-reactpicker]');\n        if (picker) picker.style.display = expanded ? 'none' : 'flex';`,
  `        const root = btn.closest('[data-turn]');\n        if (root) {\n          const picker = root.querySelector<HTMLElement>('[data-reactpicker]');\n          if (picker) picker.style.display = expanded ? 'none' : 'flex';\n        }`
);
fs.writeFileSync('src/components/MessageTile.tsx', mt);

['test/CodeBlockCard-component.test.tsx', 'test/MessageContent-component.test.tsx', 'test/MessageTile-component.test.tsx', 'test/MessageTimeline-component.test.tsx', 'test/ReactionBar-component.test.tsx', 'test/TypingIndicator-component.test.tsx'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import React from 'react';\n/g, '');
  fs.writeFileSync(f, c);
});

