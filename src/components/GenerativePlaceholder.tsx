import type { CSSProperties } from 'react';
import './GenerativePlaceholder.css';

export type GenerativePlaceholderVariant = 'text' | 'conversation' | 'card' | 'artifact' | 'table' | 'graph' | 'agent';

export interface GenerativePlaceholderProps {
  variant: GenerativePlaceholderVariant;
  /** Accessible label. Defaults to "Generating {variant}". */
  label?: string;
  className?: string;
}

export function GenerativePlaceholder({ variant, label, className = '' }: GenerativePlaceholderProps) {
  return (
    <div className={`gen-placeholder gen-placeholder-${variant} ${className}`.trim()} role="progressbar" aria-busy="true" aria-label={label || `Generating ${variant}`}>
      <Skeleton variant={variant} />
      <span className="gen-placeholder-beam" aria-hidden="true" />
    </div>
  );
}

/* One geometry per variant; `--i` sequences the assemble animation. */
function Skeleton({ variant }: { variant: GenerativePlaceholderVariant }) {
  let n = 0;
  const b = (w: number | string, h: number | string = 10, mod = '', extra: Record<string, string | number> = {}) => (
    <span className={`gen-placeholder-b ${mod}`} style={{ width: w, height: h, ['--i' as string]: n++, ...extra } as CSSProperties} />
  );
  const col = (gap = 8, s: CSSProperties = {}): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap, minWidth: 0, ...s });
  const row = (gap = 10, s: CSSProperties = {}): CSSProperties => ({ display: 'flex', alignItems: 'center', gap, minWidth: 0, ...s });
  const S = 'gen-placeholder-surface';
  switch (variant) {
    case 'conversation':
      return (
        <div style={col(14)}>
          <div style={row(10, { alignItems: 'flex-start' })}>{b(28, 28, 'is-circ', { flex: 'none' })}<div style={col(6, { flex: 1 })}>{b('68%', 40, 'is-bub')}{b('44%', 28, 'is-bub')}</div></div>
          <div style={row(10, { justifyContent: 'flex-end' })}>{b('52%', 36, 'is-bub is-me')}</div>
          <div style={row(10, { alignItems: 'flex-start' })}>{b(28, 28, 'is-circ', { flex: 'none' })}<div style={col(6, { flex: 1 })}>{b('80%', 56, 'is-bub')}</div></div>
        </div>
      );
    case 'card':
      return (
        <div className={S} style={col(10)}>
          {b('100%', 120, 'is-media')}{b('58%', 14)}{b('94%')}{b('76%')}
          <div style={row(8, { marginTop: 4 })}>{b(64, 22, 'is-pill')}{b(48, 22, 'is-pill')}</div>
        </div>
      );
    case 'artifact':
      return (
        <div className={S} style={col(9)}>
          <div style={row(6, { marginBottom: 6 })}>{b(8, 8, 'is-circ')}{b(8, 8, 'is-circ')}{b(8, 8, 'is-circ')}<span style={{ flex: 1 }} />{b(96, 9)}</div>
          {b('42%')}{b('64%', 10, '', { marginLeft: 18 })}{b('52%', 10, '', { marginLeft: 36 })}{b('70%', 10, '', { marginLeft: 36 })}{b('34%', 10, '', { marginLeft: 18 })}{b('20%')}
        </div>
      );
    case 'table':
      return (
        <div className={S} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px 16px', alignItems: 'center' }}>
          {b('60%', 8, 'is-th')}{b('70%', 8, 'is-th')}{b('50%', 8, 'is-th')}{b('40%', 8, 'is-th')}
          {b('86%')}{b('60%')}{b('70%')}{b('44%')}
          {b('72%')}{b('52%')}{b('64%')}{b('50%')}
          {b('90%')}{b('66%')}{b('48%')}{b('38%')}
          {b('64%')}{b('58%')}{b('72%')}{b('46%')}
        </div>
      );
    case 'graph':
      return (
        <div className={S} style={col(10)}>
          <div style={row(8)}>{b(110, 12)}<span style={{ flex: 1 }} />{b(56, 20, 'is-pill')}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {b('100%', '38%', 'is-bar', { flex: 1 })}{b('100%', '64%', 'is-bar', { flex: 1 })}{b('100%', '52%', 'is-bar', { flex: 1 })}{b('100%', '88%', 'is-bar', { flex: 1 })}
            {b('100%', '60%', 'is-bar', { flex: 1 })}{b('100%', '100%', 'is-bar', { flex: 1 })}{b('100%', '74%', 'is-bar', { flex: 1 })}{b('100%', '82%', 'is-bar', { flex: 1 })}
          </div>
          {b('100%', 1, 'is-axis')}
        </div>
      );
    case 'agent':
      return (
        <div className={S} style={col(14)}>
          <div style={row(12)}>{b(36, 36, 'is-circ', { flex: 'none' })}<div style={col(6, { flex: 1 })}>{b(120, 12)}{b(80, 9)}</div></div>
          <div style={row(10)}>{b(10, 10, 'is-circ', { flex: 'none' })}{b('62%')}</div>
          <div style={row(10)}>{b(10, 10, 'is-circ', { flex: 'none' })}{b('74%')}</div>
          <div style={row(10)}>{b(10, 10, 'is-circ', { flex: 'none' })}{b('48%')}</div>
        </div>
      );
    default:
      return <div style={col(9)}>{b('100%')}{b('96%')}{b('99%')}{b('62%')}</div>;
  }
}
