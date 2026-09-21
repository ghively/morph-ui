const fs = require('fs');
let code = fs.readFileSync('test/MessageContent-component.test.tsx', 'utf8');
// The issue is defaultPrevented is on the synthetic event, but our click handler binds to the native DOM element. 
// So fireEvent might not trigger it properly, or wait, e.preventDefault() was on the native event.
// Let's fix the test to fire native DOM event.
code = code.replace(
  "fireEvent.click(a);",
  "a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));"
);
fs.writeFileSync('test/MessageContent-component.test.tsx', code);
