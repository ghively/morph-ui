import './GaugeCluster.css';

export interface GaugeRing {
  label: string;
  /** 0–100 fill. */
  value: number;
  /** Semantically colored arc; defaults to the accent. */
  tone?: 'success' | 'warn' | 'danger';
  /** Text under the value; defaults to '%'. */
  unit?: string;
}

export interface GaugeClusterProps {
  /** 2–6 rings render as a matched set. */
  gauges: GaugeRing[];
  size?: number;
  label?: string;
  className?: string;
}

const TONE_COLOR: Record<string, string> = {
  success: 'var(--morph-success)',
  warn: 'var(--morph-warn)',
  danger: 'var(--morph-danger)',
};

/**
 * Dependency-free set of concentric-ring gauges, pure SVG. Each ring starts
 * at its own spoke so a cluster of up to six reads as a matched set; values
 * are always printed as text (and the figcaption repeats them), so fill is
 * never the only channel.
 */
export function GaugeCluster({
  gauges,
  size = 220,
  label = 'Gauge cluster',
  className = '',
}: GaugeClusterProps) {
  const S = 220;
  const C = S / 2;
  const hasData = gauges.length > 0;
  const GAP_DEG = 8; // spacing between ring arcs
  const alloc = 360 - GAP_DEG * Math.max(gauges.length - 1, 0);
  const R0 = 34;
  const STEP = 22;

  const clamp = (v: number) => Math.min(100, Math.max(0, v));

  // Precompute each ring's arc geometry [startDeg, sweepDeg].
  const rings = (() => {
    let cursor = -90; // start at 12 o'clock
    return gauges.map(() => {
      const sweep = alloc / Math.max(gauges.length, 1);
      const ring = { start: cursor, sweep };
      cursor += sweep + GAP_DEG;
      return ring;
    });
  })();

  const arc = (r: number, startDeg: number, sweepDeg: number): { d: string; len: number } => {
    // A circular arc as an SVG path; large-arc picked by sweep.
    const a0 = (startDeg * Math.PI) / 180;
    const a1 = ((startDeg + sweepDeg) * Math.PI) / 180;
    const x0 = C + Math.cos(a0) * r;
    const y0 = C + Math.sin(a0) * r;
    const x1 = C + Math.cos(a1) * r;
    const y1 = C + Math.sin(a1) * r;
    const large = sweepDeg > 180 ? 1 : 0;
    return {
      d: `M${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`,
      len: (sweepDeg / 360) * 2 * Math.PI * r,
    };
  };

  const summary = hasData
    ? gauges.map((g) => `${g.label}: ${Math.round(clamp(g.value))}${g.unit ?? '%'}`).join(', ')
    : '';

  return (
    <figure className={className} data-gcluster="">
      <div data-gclusterrow="">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${S} ${S}`}
          role="img"
          aria-label={`${label}. ${summary || 'No data'}`}
          data-gclustersvg=""
        >
          {!hasData ? (
            <text x={C} y={C} textAnchor="middle" dominantBaseline="central" data-gclusterempty="">
              No data
            </text>
          ) : (
            gauges.map((g, gi) => {
              const { start, sweep } = rings[gi]!;
              const r = R0 + STEP * gi;
              const track = arc(r, start, sweep);
              const v = clamp(g.value);
              const valueArc = arc(r, start, (sweep * v) / 100);
              const color = g.tone ? TONE_COLOR[g.tone]! : `var(--series-${(gi % 6) + 1})`;
              const mid = ((start + (sweep * v) / 100) * Math.PI) / 180;
              const lx = C + Math.cos(mid) * (r + 12);
              const ly = C + Math.sin(mid) * (r + 12);
              return (
                <g key={g.label} data-gclusterring="" data-tone={g.tone ?? 'accent'}>
                  <path d={track.d} fill="none" data-gclustertrack="" strokeWidth="12" strokeLinecap="butt" />
                  {v > 0 && (
                    <path
                      d={valueArc.d}
                      fill="none"
                      stroke={color}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(valueArc.len * 0.96).toFixed(1)} ${valueArc.len.toFixed(1)}`}
                      data-gclustervalue=""
                    >
                      <title>{`${g.label}: ${Math.round(v)}${g.unit ?? '%'}`}</title>
                    </path>
                  )}
                  {v > 4 && (
                    <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor="middle" dominantBaseline="central" data-gclusternum="">
                      {Math.round(v)}
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>
        <ul data-gclusterlegend="">
          {gauges.map((g, gi) => (
            <li key={g.label}>
              <span
                data-gclusterswatch=""
                style={{ background: g.tone ? TONE_COLOR[g.tone]! : `var(--series-${(gi % 6) + 1})` }}
                aria-hidden="true"
              />
              <span data-gclustername="">{g.label}</span>
              <span data-gclusterval="">{`${Math.round(clamp(g.value))}${g.unit ?? '%'}`}</span>
            </li>
          ))}
          {gauges.length === 0 && <li data-gclusternone="">No data</li>}
        </ul>
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
