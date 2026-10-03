import { useState, useMemo, useRef, type KeyboardEvent, type CSSProperties } from 'react';
import './AgentActivityHeatmap.css';

export interface HeatmapDataPoint {
  date: string;
  metric: string;
  count: number;
}

export interface AgentActivityHeatmapProps {
  data: HeatmapDataPoint[];
  metrics?: string[];
  onCellSelect?: (date: string, metric: string, count: number) => void;
  /** Eyebrow above the headline number. */
  title?: string;
  className?: string;
}

const DEFAULT_METRICS = ['agent runs/day', 'messages/day', 'tool calls/day', 'failures/day', 'completed tasks/day', 'human interventions/day'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = (iso: string) => { const d = new Date(iso + 'T00:00:00Z'); return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

export function AgentActivityHeatmap({ data, metrics = DEFAULT_METRICS, onCellSelect, title, className = '' }: AgentActivityHeatmapProps) {
  const [metric, setMetric] = useState(metrics[0] || '');
  const [focus, setFocus] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hov, setHov] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const dates = useMemo(() => Array.from(new Set(data.map(d => d.date))).sort(), [data]);
  const m = useMemo(() => {
    const byDate = new Map<string, number>();
    data.forEach(d => { if (d.metric === metric) byDate.set(d.date, d.count); });
    const counts = dates.map(d => byDate.get(d) || 0);
    const max = counts.reduce((a, b) => Math.max(a, b), 0);
    const level = (c: number) => (c === 0 ? 0 : max === 0 ? 1 : c / max <= 0.33 ? 1 : c / max <= 0.66 ? 2 : 3);
    // Weekday-aligned, Sunday-first rows; columns are weeks.
    const t0 = dates.length ? Date.parse(dates[0] + 'T00:00:00Z') : 0;
    const offset = dates.length ? new Date(t0).getUTCDay() : 0;
    const cells = dates.map((date, i) => ({ date, count: counts[i], level: level(counts[i]), pos: offset + Math.round((Date.parse(date + 'T00:00:00Z') - t0) / 864e5), i }));
    const byPos = new Map(cells.map(c => [c.pos, c.i]));
    const cols = Math.max(1, Math.ceil(((cells[cells.length - 1]?.pos ?? 0) + 1) / 7));
    const colTotals = Array.from({ length: cols }, (_, k) => cells.filter(c => Math.floor(c.pos / 7) === k).reduce((a, c) => a + c.count, 0));
    let streak = 0, run = 0;
    counts.forEach(c => { run = c > 0 ? run + 1 : 0; streak = Math.max(streak, run); });
    return { cells, byPos, cols, max, offset, colTotals, streak, total: counts.reduce((a, b) => a + b, 0), active: counts.filter(c => c > 0).length };
  }, [data, dates, metric]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    const pos = m.cells[i].pos;
    const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : e.key === 'ArrowRight' ? 7 : e.key === 'ArrowLeft' ? -7 : 0;
    if (!step) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const c = m.cells[i]; setSelected(i); onCellSelect?.(c.date, metric, c.count); }
      return;
    }
    e.preventDefault();
    if ((step === 1 && pos % 7 === 6) || (step === -1 && pos % 7 === 0)) return;
    const n = m.byPos.get(pos + step);
    if (n === undefined) return;
    setFocus(n);
    gridRef.current?.querySelector<HTMLElement>(`[data-index="${n}"]`)?.focus();
  };

  const shown = hov != null ? m.cells[hov] : selected != null ? m.cells[selected] : null;
  const colMax = Math.max(1, ...m.colTotals);

  return (
    <div className={`agent-activity-heatmap ${className}`.trim()}>
      <div className="agent-activity-heatmap-top">
        <div className="agent-activity-heatmap-stat">
          <span className="agent-activity-heatmap-k">{title || 'Activity'}</span>
          <span className="agent-activity-heatmap-v">{(shown ? shown.count : m.total).toLocaleString()}</span>
          <span className="agent-activity-heatmap-s">{shown ? `${metric} · ${fmtDay(shown.date)}` : `${metric} · last ${m.cells.length} days`}</span>
        </div>
        <div className="agent-activity-heatmap-metrics agent-activity-heatmap-controls" role="group" aria-label="Select metric">
          {metrics.map(x => (
            <button key={x} type="button" className="agent-activity-heatmap-metric-btn" aria-pressed={metric === x} onClick={() => setMetric(x)}>{x}</button>
          ))}
        </div>
      </div>

      {m.cells.length === 0 ? <div className="agent-activity-heatmap-empty">No activity recorded yet</div> : (
        <div className="agent-activity-heatmap-scroll">
          <div className="agent-activity-heatmap-grid" role="grid" aria-label="Activity heatmap" ref={gridRef}
            style={{ gridTemplateColumns: `repeat(${m.cols}, 14px)` }} onMouseLeave={() => setHov(null)}>
            {m.cells.map(c => (
              <div
                key={c.date}
                role="gridcell"
                className={`agent-activity-heatmap-cell ${selected === c.i ? 'is-sel' : ''}`}
                data-index={c.i}
                data-level={c.level}
                style={{ gridColumn: Math.floor(c.pos / 7) + 1, gridRow: (c.pos % 7) + 1 }}
                tabIndex={focus === c.i ? 0 : -1}
                aria-label={`${c.date}: ${c.count} ${metric}`}
                onMouseEnter={() => setHov(c.i)}
                onFocus={() => setHov(c.i)}
                onBlur={() => setHov(null)}
                onClick={() => { setSelected(c.i); setFocus(c.i); onCellSelect?.(c.date, metric, c.count); }}
                onKeyDown={e => onKey(e, c.i)}
              ><i /></div>
            ))}
            {m.colTotals.map((t, k) => (
              <span key={k} aria-hidden="true" className={`agent-activity-heatmap-bar ${shown && Math.floor(shown.pos / 7) === k ? 'is-on' : ''}`}
                style={{ gridColumn: k + 1, gridRow: 9, ['--h' as string]: `${Math.max(6, (t / colMax) * 100)}%` } as CSSProperties} />
            ))}
          </div>
        </div>
      )}

      <div className="agent-activity-heatmap-foot agent-activity-heatmap-legend" aria-hidden="true">
        <span>Peak {m.max.toLocaleString()}</span>
        <span>{m.active} active days</span>
        <span>{m.streak}-day streak</span>
        <span className="agent-activity-heatmap-sp" />
        {[0, 1, 2, 3].map(l => <span key={l} className="agent-activity-heatmap-cell" data-level={l}><i /></span>)}
      </div>
    </div>
  );
}
