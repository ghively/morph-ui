const fs = require('fs');
let code = fs.readFileSync('src/components/MessageTimeline.tsx', 'utf8');

code = code.replace(
  `// Temporary MessageTile placeholder to satisfy tests while developing Timeline
// In step 4, we will implement the real MessageTile and update the import.
function DummyMessageTile(props: any) {
  return <div data-dummy-tile={props.message.id} data-continuation={props.continuation ? '' : undefined} />;
}`,
  `import { MessageTile } from './MessageTile';`
);

code = code.replace(/<DummyMessageTile/g, '<MessageTile');

fs.writeFileSync('src/components/MessageTimeline.tsx', code);
