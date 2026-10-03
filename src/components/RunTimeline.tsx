import './RunTimeline.css';
import { useRun, cv, RUN_LABEL, type RunTimelineProps } from './agentOps.shared';

export function RunTimeline(props: RunTimelineProps) {
  const { dense = false, title, className = '' } = props;
  const r = useRun(props);
  return (
    <div className={'run-timeline ' + className} data-run-timeline="" data-dense={dense ? 'true' : undefined} style={cv(r.color)}>
      {title && <div className="run-timeline-top"><span className="run-timeline-dot" /><b>{title}</b><span>{RUN_LABEL[r.overall] + ' · ' + r.done + '/' + r.rows.length + ' · ' + r.elapsed}</span></div>}
      <ol className="run-timeline-list">
        {r.rows.map((s, i) => (
          <li key={s.id} className="run-timeline-step" data-run-timeline-step="" data-status={s.status} style={cv(s.color)}>
            <div className="run-timeline-col" data-run-timeline-indicator-column="">
              <span className="run-timeline-node" data-run-timeline-dot="">{s.status === 'succeeded' ? '✓' : s.status === 'failed' ? '!' : ''}</span>
              {i < r.rows.length - 1 && <span className="run-timeline-wire" data-run-timeline-connector="" data-lit={s.status === 'succeeded' ? '' : undefined} />}
            </div>
            <div className="run-timeline-body" data-run-timeline-content="">
              <div className="run-timeline-head" data-run-timeline-header="">
                <span className="run-timeline-label" data-run-timeline-label="">{s.label}</span>
                {s.durText && <span className="run-timeline-dur">{s.durText}</span>}
              </div>
              {(s.detail || s.time) && !dense && <div className="run-timeline-detail" data-run-timeline-detail="">{s.time && <span data-run-timeline-time="">{s.time}</span>}{s.detail}</div>}
              {dense && s.status === 'failed' && s.detail && <div className="run-timeline-detail" data-run-timeline-detail="">{s.detail}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export type { RunStep as RunTimelineStep, RunTimelineProps } from './agentOps.shared';
