import './AnswerFeedback.css';
import { useFeedback, type AnswerFeedbackProps } from './ragAnswer.shared';

export function AnswerFeedback(props: AnswerFeedbackProps) {
  const f = useFeedback(props);
  const cls = 'answer-feedback ' + (props.className || '');
  if (f.sent) {
    return <div className={cls} data-feedback="" data-sent="" role="status"><span className="answer-feedback-log">&gt; FEEDBACK_LOGGED</span><span>{f.sent.rating === 'up' ? 'helpful' : 'report' + (f.sent.reasons.length ? ' · ' + f.sent.reasons.join(', ').toLowerCase() : '')}</span></div>;
  }
  return (
    <div className={cls} data-feedback="" data-rating={f.rating || undefined}>
      <div className="answer-feedback-row">
        <span className="answer-feedback-q" id={f.id + '-p'}>{f.prompt}</span>
        <div className="answer-feedback-opts" role="group" aria-labelledby={f.id + '-p'}>
          <button type="button" className="answer-feedback-opt" data-k="up" aria-pressed={f.rating === 'up'} onClick={() => f.setRating('up')}>Helpful</button>
          <button type="button" className="answer-feedback-opt" data-k="down" aria-pressed={f.rating === 'down'} onClick={() => f.setRating('down')}>Not helpful</button>
        </div>
        {f.rating && <button type="button" className="answer-feedback-send" onClick={f.submit}>{f.sendLabel} <span aria-hidden="true">↵</span></button>}
      </div>
      {f.rating === 'down' && (
        <div className="answer-feedback-detail">
          <ul className="answer-feedback-reasons" aria-label="What went wrong">
            {f.reasons.map(r => {
              const on = f.picked.includes(r);
              return (
                <li key={r}>
                  <button type="button" role="checkbox" aria-checked={on} className="answer-feedback-reason" onClick={() => f.toggle(r)}>
                    <span className="answer-feedback-box" aria-hidden="true">{on ? '[x]' : '[ ]'}</span>{r}
                  </button>
                </li>
              );
            })}
          </ul>
          <label className="answer-feedback-field">
            <span className="answer-feedback-lab">Correction</span>
            <textarea className="answer-feedback-text" rows={2} value={f.correction} onChange={e => f.setCorrection(e.target.value)} placeholder="What should it have said? (optional)" />
          </label>
        </div>
      )}
    </div>
  );
}

export type { FeedbackSubmit, AnswerFeedbackProps } from './ragAnswer.shared';
