import { Fragment } from 'react';
import './StreamingStageIndicator.css';
import { useStages, STAGE_C, cv, type StreamingStageIndicatorProps } from './ragAnswer.shared';

export function StreamingStageIndicator(props: StreamingStageIndicatorProps) {
  const s = useStages(props);
  if (s.hidden) return null;
  return (
    <div className={'rag-stages ' + (props.className || '')} data-stages="" role="status" aria-live="polite" aria-label={s.aria}>
      {s.settled ? (
        <span className="rag-stages-step" data-s="done" style={cv(STAGE_C.done)} aria-hidden="true"><span className="rag-stages-ok">[ OK ]</span><span className="rag-stages-label">{s.doneLabel}</span></span>
      ) : s.items.map((it, i) => (
        <Fragment key={it.key}>
          <span className="rag-stages-step" data-s={it.state} style={cv(STAGE_C[it.state])} aria-hidden="true">
            <span className="rag-stages-mark">{it.state === 'done' ? '✓' : it.n}</span>
            <span className="rag-stages-label">{it.label}</span>
            {it.state === 'active' && <span className="rag-stages-cursor" />}
          </span>
          {i < s.items.length - 1 && <span className="rag-stages-rule" data-done={it.state === 'done' ? '' : undefined} aria-hidden="true" />}
        </Fragment>
      ))}
    </div>
  );
}

export type { RagStage, StreamingStageIndicatorProps } from './ragAnswer.shared';
