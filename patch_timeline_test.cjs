const fs = require('fs');
let code = fs.readFileSync('test/MessageTimeline-component.test.tsx', 'utf8');

// I replaced DummyMessageTile with MessageTile which has data-turn instead of data-dummy-tile
code = code.replace(
  /\[data-dummy-tile\]/g,
  `[data-turn]`
);

fs.writeFileSync('test/MessageTimeline-component.test.tsx', code);
