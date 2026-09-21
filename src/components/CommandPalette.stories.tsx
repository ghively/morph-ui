import { useState } from 'react';
import { CommandPalette, type CommandPaletteCommand } from './CommandPalette';

const frame: React.CSSProperties = {
  padding: '2rem',
  minHeight: '420px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#0f172a',
  backgroundColor: '#38bdf8',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const noteStyle: React.CSSProperties = {
  marginTop: '1rem',
  fontSize: '0.8125rem',
  color: '#64748b',
};

const makeCommands = (
  onRun: (label: string) => void
): CommandPaletteCommand[] => [
  { id: 'new-agent', label: 'Create new agent', group: 'Agents', shortcut: '⌘N', run: () => onRun('Create new agent') },
  { id: 'restart-agent', label: 'Restart agent', group: 'Agents', shortcut: '⌘R', run: () => onRun('Restart agent') },
  { id: 'open-run', label: 'Open latest run', group: 'Runs', shortcut: '⌘O', run: () => onRun('Open latest run') },
  { id: 'cancel-run', label: 'Cancel active run', group: 'Runs', run: () => onRun('Cancel active run') },
  { id: 'analytics', label: 'View analytics', group: 'Insights', shortcut: '⌘A', run: () => onRun('View analytics') },
  { id: 'settings', label: 'Open settings', group: 'System', shortcut: '⌘,', run: () => onRun('Open settings') },
];

export const Default = () => {
  const [open, setOpen] = useState(true);
  const [lastRun, setLastRun] = useState<string | null>(null);

  return (
    <div style={frame}>
      <button type="button" onClick={() => setOpen(true)} style={buttonStyle}>
        Open command palette
      </button>
      <p style={noteStyle}>{lastRun ? `Ran: ${lastRun}` : 'Type to filter, arrow keys to navigate, Enter to run.'}</p>
      <CommandPalette
        commands={makeCommands(setLastRun)}
        open={open}
        onSelect={() => setOpen(false)}
      />
    </div>
  );
};

export const Uncontrolled = () => {
  const [lastRun, setLastRun] = useState<string | null>(null);

  return (
    <div style={frame}>
      <p style={noteStyle}>
        Uncontrolled mode manages its own open state — running a command or clicking the
        overlay closes it.
      </p>
      <p style={noteStyle}>{lastRun ?? 'Nothing run yet.'}</p>
      <CommandPalette
        commands={makeCommands((label) => setLastRun(`Ran: ${label}`))}
        open
        controlled={false}
        placeholder="Jump to…"
        onRecentChange={(ids) => setLastRun(`Recently used: ${ids.join(', ')}`)}
      />
    </div>
  );
};

export const WithIcons = () => {
  const [lastRun, setLastRun] = useState<string | null>(null);

  const dot = (color: string) => (
    <span
      style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: color,
      }}
    />
  );

  const commands: CommandPaletteCommand[] = [
    { id: 'deploy', label: 'Deploy gh-ai', group: 'Deploy', icon: dot('#22c55e'), shortcut: '⌘D', run: () => setLastRun('Deploy gh-ai') },
    { id: 'rollback', label: 'Roll back last deploy', group: 'Deploy', icon: dot('#f59e0b'), run: () => setLastRun('Roll back last deploy') },
    { id: 'purge', label: 'Purge build cache', group: 'Danger', icon: dot('#ef4444'), run: () => setLastRun('Purge build cache') },
  ];

  return (
    <div style={frame}>
      <p style={noteStyle}>{lastRun ? `Ran: ${lastRun}` : 'Commands can carry an icon and a shortcut hint.'}</p>
      <CommandPalette commands={commands} open placeholder="Search deploy actions…" />
    </div>
  );
};
