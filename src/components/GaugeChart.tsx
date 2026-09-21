import './GaugeChart.css';

export interface GaugeChartProps {
  /** 0–100 fill. */
  value: number;
  /** Zones color the arc: [upTo, tone]. Defaults to a single accent arc. */
  zones?: { upTo: number; tone: 'good' | 'ok' | 'bad' }[];
  label?: string;
  centerLabel?: string;
  className?: string;
}

const TONE_COLOR: Record<string, string> = {
  good: 'var(--morph-success, #30a46c)',
  ok: 'var(--morph-warn, #e8930c)',
  bad: 'var(--morph-danger, #e5484d)',
};

/** Semicircular gauge: SLAs, freshness scores, quota fill. Value always in text. */
export function GaugeChart({ value, zones, label = 'Gauge', centerLabel, className = '' }: GaugeChartProps) {
  const clamped = Math.min(100, Math.max(0, value));
  // Semicircle path: M20,100 A80,80 0 0 1 180,100 — length = π*80 ≈ 251.3
  const ARC = Math.PI * 80;
  const activeZone = zones ? [...zones].sort((a, b) => a.upTo - b.upTo).find((z) => clamped <= z.upTo) : undefined;
  const color = activeZone ? TONE_COLOR[activeZone.tone]! : 'var(--morph-accent, #2f7cf6)';
  return (
    <figure className={className} data-gauge="">
      <svg viewBox="0 0 200 118" role="img" aria-label={`${label}: ${centerLabel ?? `${Math.round(clamped)} of 100`}`} data-gaugesvg="">
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" data-gaugetrack="" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M20,100 A80,80 0 0 1 180,100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${((clamped / 100) * ARC).toFixed(1)} ${ARC.toFixed(1)}`}
        >
          <title>{`${Math.round(clamped)} of 100`}</title>
        </path>
        <text x="100" y="92" textAnchor="middle" data-gaugecenter="">
          {centerLabel ?? `${Math.round(clamped)}%`}
        </text>
      </svg>
      <figcaption data-sronly="">{`${label}: ${centerLabel ?? `${Math.round(clamped)} of 100`}`}</figcaption>
    </figure>
  );
}
