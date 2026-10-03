import { useState, type ReactNode } from 'react';
import { CommandPalette, type CommandPaletteCommand } from '../../src/components/CommandPalette';
import { Button } from '../../src/components/Button';

const noop = () => {};

const baseCommands: CommandPaletteCommand[] = [
  { id: 'new-room', label: 'Create new room', hint: 'Room', shortcut: '⌘N', run: noop },
  { id: 'search', label: 'Search documents', hint: 'Corpus', shortcut: '⌘K', run: noop },
  { id: 'reindex', label: 'Reindex support corpus', hint: 'Job', run: noop },
  { id: 'settings', label: 'Open settings', group: 'System', shortcut: '⌘,', run: noop },
  { id: 'theme', label: 'Toggle theme', group: 'System', run: noop },
  { id: 'logout', label: 'Log out', group: 'System', run: noop },
];

// The palette is a fixed overlay; the frame below is just the page it opens over.
function Stage({ label, onOpen, children }: { label: string; onOpen: () => void; children: ReactNode }) {
  return (
    <div style={{ minHeight: 480, position: 'relative' }}>
      <Button size="sm" variant="secondary" onClick={onOpen}>{label}</Button>
      {children}
    </div>
  );
}

export const Default = () => {
  const [open, setOpen] = useState(true);
  return (
    <Stage label="Open command palette  ⌘K" onOpen={() => setOpen(true)}>
      <CommandPalette
        commands={baseCommands}
        open={open}
        recentIds={['search']}
        onRequestClose={() => setOpen(false)}
      />
    </Stage>
  );
};

export const Grouped = () => {
  const [open, setOpen] = useState(true);
  const complexCommands: CommandPaletteCommand[] = [
    { id: 'c1', label: 'Join #engineering', hint: 'Room', group: 'Rooms', run: noop },
    { id: 'c1b', label: 'Join #support-escalations', hint: 'Room', group: 'Rooms', run: noop },
    { id: 'c2', label: 'Alice Moreno', hint: 'Person', group: 'Agents & people', run: noop },
    { id: 'c2b', label: 'claude-gh-ai', hint: 'Agent', group: 'Agents & people', run: noop },
    { id: 'c3', label: 'System status: degraded search', hint: 'Thread', group: 'Threads', run: noop },
  ];
  return (
    <Stage label="Open command palette  ⌘K" onOpen={() => setOpen(true)}>
      <CommandPalette
        commands={complexCommands}
        open={open}
        onRequestClose={() => setOpen(false)}
        groupOrder={['Rooms', 'Agents & people', 'Threads']}
        status={<span>Searching messages…</span>}
      />
    </Stage>
  );
};

export const Empty = () => {
  const [open, setOpen] = useState(true);
  return (
    <Stage label="Open command palette  ⌘K" onOpen={() => setOpen(true)}>
      <CommandPalette
        commands={baseCommands}
        open={open}
        initialQuery="deploy staging"
        onRequestClose={() => setOpen(false)}
        emptyTitle="Nothing matches"
        emptyHint="Try a room name, an agent, or 'new'."
      />
    </Stage>
  );
};
