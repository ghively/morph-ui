import './GanttTimeline.css';
import { useMemo, useState } from 'react';
import { DAY, addDays, dayFloor } from './dataShell.shared';

export type GanttZoom = 'day' | 'week' | 'month';

export interface GanttTask {
  id: string;
  label: string;
  /** Epoch ms. */
  start: number;
  /** Epoch ms (inclusive end used for bar width). */
  end: number;
  /** 0–1; renders a filled progress strip inside the bar. */
  progress?: number;
  /** ids of tasks this one depends on (finish→start arrows). */
  dependsOn?: string[];
  tone?: 'neutral' | 'info' | 'success' | 'warn' | 'danger';
  meta?: string;
}

export interface GanttTimelineProps {
  tasks: GanttTask[];
  zoom?: GanttZoom;
  onZoomChange?: (z: GanttZoom) => void;
  /** Pin "today" for deterministic renders; defaults to now. */
  now?: number;
  /** First visible day (epoch ms). Defaults to the earliest task start. */
  start?: number;
  /** Visible span in units of the zoom (days for 'day', weeks for 'week', months for 'month'). */
  span?: number;
  onTaskActivate?: (task: GanttTask) => void;
  label?: string;
  className?: string;
}

const TONE_C: Record<NonNullable<GanttTask['tone']>, string> = {
  neutral: 'var(--app-faint)',
  info: 'var(--series-1)',
  success: 'var(--state-ok)',
  warn: 'var(--state-warn)',
  danger: 'var(--state-error)',
};

const ZOOM_UNIT: Record<GanttZoom, number> = { day: 1, week: 7, month: 30 };
const ZOOM_LABEL: Record<GanttZoom, string> = { day: 'Days', week: 'Weeks', month: 'Months' };

function startOfMonth(t: number): number {
  const d = new Date(t);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function addMonths(t: number, n: number): number {
  const d = new Date(t);
  d.setMonth(d.getMonth() + n);
  return d.getTime();
}

/**
 * GanttTimeline — task bars on a zoomable day/week/month grid with dependency
 * arrows (SVG, elbow paths), progress fill and a today marker. Pure SVG for the
 * dependency layer, CSS grid for rows. Original morph-ui design.
 */
export function GanttTimeline({
  tasks,
  zoom = 'week',
  onZoomChange,
  now,
  start,
  span = 8,
  onTaskActivate,
  label = 'Schedule',
  className = '',
}: GanttTimelineProps) {
  const [ownNow] = useState(() => now ?? Date.now());
  const today = dayFloor(now ?? ownNow);

  const window0 = useMemo(() => {
    if (start !== undefined) return dayFloor(start);
    const earliest = tasks.length ? Math.min(...tasks.map((t) => t.start)) : today;
    if (zoom === 'month') return startOfMonth(addDays(dayFloor(earliest), -3));
    return addDays(dayFloor(earliest), -2);
  }, [start, tasks, today, zoom]);

  const window1 = useMemo(() => {
    if (zoom === 'month') return addMonths(window0, span);
    return addDays(window0, span * ZOOM_UNIT[zoom]);
  }, [window0, span, zoom]);

  const width = 100; // percent
  const toPct = (t: number) => ((t - window0) / (window1 - window0)) * width;

  // Column ticks: one per unit.
  const ticks = useMemo(() => {
    const out: { t: number; label: string }[] = [];
    if (zoom === 'month') {
      for (let i = 0; i < span; i++) {
        const t = addMonths(window0, i);
        out.push({ t, label: new Date(t).toLocaleDateString([], { month: 'short', year: '2-digit' }) });
      }
    } else {
      const unit = ZOOM_UNIT[zoom];
      const labelOpt: Intl.DateTimeFormatOptions = zoom === 'day' ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric' };
      for (let i = 0; i < span; i++) {
        const t = addDays(window0, i * unit);
        out.push({ t, label: new Date(t).toLocaleDateString([], labelOpt) });
      }
    }
    return out;
  }, [window0, span, zoom]);

  const deps = useMemo(() => {
    const byId = new Map(tasks.map((t) => [t.id, t]));
    const out: { from: string; to: string; fromEnd: number; toStart: number }[] = [];
    for (const task of tasks) {
      for (const depId of task.dependsOn ?? []) {
        const dep = byId.get(depId);
        if (dep) out.push({ from: depId, to: task.id, fromEnd: Math.min(dep.end, window1), toStart: Math.max(task.start, window0) });
      }
    }
    return out;
  }, [tasks, window0, window1]);

  const taskIndex = useMemo(() => new Map(tasks.map((t, i) => [t.id, i])), [tasks]);
  const rowH = 40; // px, matches CSS --gantt-row-h
  const svgHeight = tasks.length * rowH;

  const zoomPicker = (z: GanttZoom) => () => onZoomChange?.(z);

  const todayPct = toPct(today + DAY / 2);

  return (
    <div className={className} data-gantt="" aria-label={label}>
      <div data-gantt-toolbar="">
        <span data-gantt-title="">{label}</span>
        <div data-gantt-zoom="" role="group" aria-label="Zoom">
          {(['day', 'week', 'month'] as GanttZoom[]).map((z) => (
            <button key={z} type="button" data-gantt-zoombtn="" data-active={zoom === z || undefined} aria-pressed={zoom === z} onClick={zoomPicker(z)}>
              {ZOOM_LABEL[z]}
            </button>
          ))}
        </div>
      </div>

      <div data-gantt-body="">
        <div data-gantt-labels="" aria-hidden="false">
          <div data-gantt-labels-spacer="" />
          {tasks.map((task) => (
            <div key={task.id} data-gantt-label="" data-tone={task.tone ?? 'neutral'}>
              <span data-gantt-labeltext="">{task.label}</span>
              {task.meta && <span data-gantt-labelmeta="">{task.meta}</span>}
            </div>
          ))}
        </div>

        <div data-gantt-chart="">
          <div data-gantt-ticks="" role="row">
            {ticks.map((tick, i) => (
              <span key={i} data-gantt-tick="" style={{ left: `${(i / span) * 100}%`, width: `${100 / span}%` }}>
                {tick.label}
              </span>
            ))}
          </div>

          <div data-gantt-rows="">
            {/* today marker */}
            {todayPct >= 0 && todayPct <= 100 && (
              <div data-gantt-today="" style={{ left: `${todayPct}%` }} aria-hidden="true" />
            )}

            {tasks.map((task) => {
              const left = Math.max(0, toPct(task.start));
              const right = Math.min(100, toPct(task.end));
              const widthPct = Math.max(0.5, right - left);
              const progress = Math.min(1, Math.max(0, task.progress ?? 0));
              return (
                <div key={task.id} data-gantt-row="" style={{ ['--gantt-c' as string]: TONE_C[task.tone ?? 'neutral'] }}>
                  <button
                    type="button"
                    data-gantt-bar=""
                    data-tone={task.tone ?? 'neutral'}
                    style={{ left: `${left}%`, width: `${widthPct}%` }}
                    aria-label={`${task.label}${task.meta ? ', ' + task.meta : ''}`}
                    onClick={() => onTaskActivate?.(task)}
                  >
                    {progress > 0 && <span data-gantt-progress="" style={{ width: `${progress * 100}%` }} />}
                    <span data-gantt-bartext="">{task.label}</span>
                  </button>
                </div>
              );
            })}

            {/* dependency arrows */}
            <svg data-gantt-deps="" viewBox={`0 0 100 ${svgHeight}`} preserveAspectRatio="none" aria-hidden="true">
              {deps.map((d, i) => {
                const x1 = toPct(d.fromEnd);
                const x2 = toPct(d.toStart);
                const y1 = (taskIndex.get(d.from)! + 0.5) * rowH;
                const y2 = (taskIndex.get(d.to)! + 0.75) * rowH;
                const midX = (x1 + x2) / 2;
                return (
                  <path
                    key={i}
                    d={`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`}
                    fill="none"
                    stroke="color-mix(in srgb, var(--app-dim) 70%, transparent)"
                    strokeWidth="0.4"
                    vectorEffect="non-scaling-stroke"
                    markerEnd="url(#gantt-arrow)"
                  />
                );
              })}
              <defs>
                <marker id="gantt-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill="color-mix(in srgb, var(--app-dim) 70%, transparent)" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div data-gantt-legend="">
        {(['neutral', 'info', 'success', 'warn', 'danger'] as const).map((tone) => (
          <span key={tone} data-gantt-key="" data-tone={tone}>
            <i data-gantt-keydot="" />
            {tone}
          </span>
        ))}
        <span data-gantt-key="">
          <i data-gantt-todaykey="" />
          today
        </span>
      </div>
    </div>
  );
}

export type { GanttTask as GanttTimelineTask };
