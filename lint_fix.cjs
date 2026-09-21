const fs = require('fs');

let mcTest = fs.readFileSync('test/MessageContent-component.test.tsx', 'utf8');
mcTest = mcTest.replace(/import { render, screen, fireEvent, act } from '@testing-library\/react';/, "import { render, fireEvent, act } from '@testing-library/react';");
fs.writeFileSync('test/MessageContent-component.test.tsx', mcTest);

let mtTest = fs.readFileSync('test/MessageTimeline-component.test.tsx', 'utf8');
mtTest = mtTest.replace(/import { render, screen, fireEvent } from '@testing-library\/react';/, "import { render } from '@testing-library/react';");
mtTest = mtTest.replace(/import { MessageTimeline, assignAccents, accentForSender, formatRelative, formatDayLabel } from '..\/src\/components\/MessageTimeline';/, "import { MessageTimeline, assignAccents, formatRelative, formatDayLabel } from '../src/components/MessageTimeline';");
mtTest = mtTest.replace(/const msgs: TimelineMessage\[\] = \[\n\s+{ \.\.\.baseMsg, id: 'msg1' },\n\s+\/\/ Mock needs the actual element to have the data-eventid which our dummy tile doesn't currently add exactly like the real one will\n\s+\];/g, "");
fs.writeFileSync('test/MessageTimeline-component.test.tsx', mtTest);

let rbTest = fs.readFileSync('test/ReactionBar-component.test.tsx', 'utf8');
rbTest = rbTest.replace(/import { render, screen, fireEvent } from '@testing-library\/react';/, "import { render, fireEvent } from '@testing-library/react';");
fs.writeFileSync('test/ReactionBar-component.test.tsx', rbTest);
