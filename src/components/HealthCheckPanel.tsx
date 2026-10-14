import './HealthCheckPanel.css';

export type HealthCheckStatus = 'ok' | 'degraded' | 'down';

export interface HealthService {
  id: string;
  name: string;
  status: HealthCheckStatus;
  /** Recent latency samples in ms, newest last; 5–12 points makes a good sparkline. */
  latency?: number[];
  /** Current latency in ms (derived from the last sample when omitted). */
  latencyNow?: number;
  /** Uptime fraction 0–1, shown as a percentage. */
  uptime?: number;
  /** Short note, e.g. the failing region. */
  note?: string;
}

export interface HealthCheckPanelProps {
  services: HealthService[];
  /** Panel heading. Default "Service health". */
  title?: string;
  /** Accessible name for the list. Default "Services". */
  label?: string;
  className?: string;
}

const STATUS_LABEL: Record<HealthCheckStatus, string> = {
  ok: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

const W = 96;
const H = 22;
const PAD = 2;

function Spark({ v, status }: { v: number[]; status: HealthCheckStatus }) {
  const n = v.length;
  if (!n) return null;
  const min = Math.min(...v);
  const max = Math.max(...v);
  const range = max - min || 1;
  const pts = v.map((x, i) => [
    n === 1 ? W / 2 : PAD + (i * (W - PAD * 2)) / (n - 1),
    PAD + (H - PAD * 2) * (1 - (x - min) / range),
  ] as [number, number]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${+p[0].toFixed(2)} ${+p[1].toFixed(2)}`).join(' ');
  const area = `${d} L ${pts[n - 1]![0].toFixed(2)} ${H} L ${pts[0]![0].toFixed(2)} ${H} Z`;
  return (
    <svg className="hcp-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="hcp-area" data-status={status} d={area} />
      <path className="hcp-line" data-status={status} d={d} fill="none" vectorEffect="non-scaling-stroke" />
      {n > 1 && (
        <circle
          className="hcp-last"
          data-status={status}
          cx={pts[n - 1]![0]}
          cy={pts[n - 1]![1]}
          r="2"
        />
      )}
    </svg>
  );
}

const fmtMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`);

/**
 * Operate-archetype status board: one dense row per service with a status dot,
 * latency sparkline (pure SVG), current latency and uptime. Complements
 * IndexerHealth (media fleet) and StatusRowList (generic rows).
 * Provenance: original morph-ui design (2026-10).
 */
export function HealthCheckPanel({ services, title = 'Service health', label = 'Services', className = '' }: HealthCheckPanelProps) {
  const down = services.filter((s) => s.status !== 'ok').length;
  return (
    <section className={className} data-hcp="" data-all-ok={down === 0 ? '' : undefined}>
      <header data-hcphead="">
        <h3 data-hcptitle="">{title}</h3>
        <span data-hcpsum="">
          {down === 0 ? (
            <>All {services.length} operational</>
          ) : (
            <><b data-hcpbad="">{down}</b> of {services.length} need attention</>
          )}
        </span>
      </header>
      <ul data-hcplist="" aria-label={label}>
        {services.map((s) => {
          const now = s.latencyNow ?? s.latency?.[s.latency.length - 1];
          return (
            <li key={s.id} data-hcprow="" data-status={s.status}>
              <span data-hcpdot="" role="img" aria-label={STATUS_LABEL[s.status]} />
              <span data-hcpname="">{s.name}</span>
              {s.latency && s.latency.length > 0 ? (
                <span data-hcpspark="" title={`Latency, last ${s.latency.length} checks`}>
                  <Spark v={s.latency} status={s.status} />
                </span>
              ) : (
                <span data-hcpspark="" data-none="" />
              )}
              <span data-hcplat="">{now !== undefined ? fmtMs(now) : '—'}</span>
              {s.uptime !== undefined && (
                <span data-hcpup="">{(s.uptime * 100).toFixed(s.uptime >= 0.999 ? 0 : 1)}%</span>
              )}
              {s.note && <span data-hcpnote="">{s.note}</span>}
              <span data-sronly="">{STATUS_LABEL[s.status]}{now !== undefined ? `, ${fmtMs(now)}` : ''}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
