import { useState } from 'react';
import { CommandPalette, type CommandPaletteCommand } from './CommandPalette';

export default {
  title: 'CommandPalette',
};

const baseCommands: CommandPaletteCommand[] = [
  { id: '1', label: 'Create new project', run: () => alert('Create project') },
  { id: '2', label: 'Search documents', run: () => alert('Search docs'), shortcut: '⌘K' },
  { id: '3', label: 'Settings', run: () => alert('Settings'), group: 'System' },
  { id: '4', label: 'Log out', run: () => alert('Log out'), group: 'System' },
];

export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: 600, height: 400, border: '1px solid var(--app-line)', position: 'relative' }}>
      <button onClick={() => setOpen(true)} style={{ position: 'absolute', top: 20, left: 20 }}>
        Open Command Palette
      </button>
      <CommandPalette
        commands={baseCommands}
        open={open}
        onRequestClose={() => setOpen(false)}
      />
    </div>
  );
};

export const Grouped = () => {
  const [open, setOpen] = useState(false);
  const complexCommands: CommandPaletteCommand[] = [
    { id: 'c1', label: 'Join #engineering', hint: 'Room', group: 'Rooms', run: () => {} },
    { id: 'c2', label: 'Alice', hint: 'Agent', group: 'Agents & people', run: () => {} },
    { id: 'c3', label: 'System status', hint: 'Thread', group: 'Threads', run: () => {} },
  ];

  return (
    <div style={{ width: 600, height: 400, border: '1px solid var(--app-line)', position: 'relative' }}>
      <button onClick={() => setOpen(true)} style={{ position: 'absolute', top: 20, left: 20 }}>
        Open Complex Palette
      </button>
      <CommandPalette
        commands={complexCommands}
        open={open}
        onRequestClose={() => setOpen(false)}
        groupOrder={['Rooms', 'Agents & people', 'Threads']}
        status={<span>Searching messages...</span>}
      />
    </div>
  );
};

export const Empty = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: 600, height: 400, border: '1px solid var(--app-line)', position: 'relative' }}>
      <button onClick={() => setOpen(true)} style={{ position: 'absolute', top: 20, left: 20 }}>
        Open Empty Palette
      </button>
      <CommandPalette
        commands={[]}
        open={open}
        onRequestClose={() => setOpen(false)}
        emptyTitle="Nothing matches"
        emptyHint="Try a room name, an agent, or 'new'."
      />
    </div>
  );
};
