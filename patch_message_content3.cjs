const fs = require('fs');
let code = fs.readFileSync('test/MessageContent-component.test.tsx', 'utf8');

code = code.replace(
  `      a.addEventListener('click', (e) => {
        defaultPrevented = e.defaultPrevented;
      });
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));`,
  `      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      a.dispatchEvent(clickEvent);
      defaultPrevented = clickEvent.defaultPrevented;`
);
fs.writeFileSync('test/MessageContent-component.test.tsx', code);
