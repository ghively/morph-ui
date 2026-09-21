const fs = require('fs');
let code = fs.readFileSync('test/MessageTimeline-component.test.tsx', 'utf8');

// The issue with data-continuation is that for 'own' messages we don't render data-continuation in MessageTile
// We render it for 'assistant' messages. Let's make the test messages assistant ones.
code = code.replace(
  `const baseMsg: TimelineMessage = {
    id: '1', senderId: 'u1', senderName: 'User 1', mine: true, ts: mockNow - 1000, kind: 'text'
  };`,
  `const baseMsg: TimelineMessage = {
    id: '1', senderId: 'u1', senderName: 'User 1', mine: false, ts: mockNow - 1000, kind: 'text'
  };`
);

// For state messages, they render as data-stateline and do not render data-turn at all!
code = code.replace(
  `const tilesInDetail = detail?.querySelectorAll('[data-turn]');`,
  `const tilesInDetail = detail?.querySelectorAll('[data-stateline]');`
);

fs.writeFileSync('test/MessageTimeline-component.test.tsx', code);
