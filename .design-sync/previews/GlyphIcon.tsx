import { GlyphIcon } from '../../src/components/GlyphIcon';
import type { GlyphName } from '../../src/components/GlyphIcon';

const NAMES: GlyphName[] = [
  'search', 'plus', 'chats', 'notes', 'workspace', 'agents', 'dashboard', 'theme',
  'close', 'pin', 'split', 'threads', 'artifacts', 'share', 'swap', 'chevronLeft',
  'chevronDown', 'trash', 'send', 'attach', 'reply', 'thread', 'edit', 'react',
  'copy', 'lock', 'file', 'bookmark', 'link', 'people', 'back', 'more', 'settings',
];

export const Default = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 12, maxWidth: 640 }}>
    {NAMES.map((n) => (
      <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--app-text)' }}>
        <GlyphIcon name={n} size={20} />
        <span style={{ fontSize: 11, color: 'var(--app-dim)', fontFamily: 'var(--app-mono)' }}>{n}</span>
      </div>
    ))}
  </div>
);
