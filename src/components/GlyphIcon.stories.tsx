import { GlyphIcon, glyphs, type GlyphName } from './GlyphIcon';

export default {
  title: 'GlyphIcon',
  component: GlyphIcon,
};

export const Default = () => <GlyphIcon name="search" />;

export const AllGlyphs = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))', gap: 'var(--s2)', color: 'var(--app-text)' }}>
    {(Object.keys(glyphs) as GlyphName[]).map((n) => (
      <div key={n} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s1h)', padding: 'var(--s2)', borderRadius: 'var(--r-sm)', background: 'var(--app-panel)' }}>
        <GlyphIcon name={n} size={20} label={n} />
        <span style={{ fontSize: 'var(--t-xs)', color: 'var(--app-dim)' }}>{n}</span>
      </div>
    ))}
  </div>
);
