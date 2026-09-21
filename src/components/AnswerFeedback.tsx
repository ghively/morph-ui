import { useState } from 'react';
import './AnswerFeedback.css';

export interface FeedbackSubmit {
  rating: 'up' | 'down';
  reasons: string[];
  correction: string;
}

export interface AnswerFeedbackProps {
  /** Reason codes offered on thumbs-down. */
  reasons?: string[];
  onSubmit?: (feedback: FeedbackSubmit) => void;
  className?: string;
}

const DEFAULT_REASONS = ['Wrong department', 'Stale source', 'Missing citation', 'Too vague', 'Hallucinated detail'];

/** Thumbs up/down with reason codes and an optional correction. Fires once, then thanks. */
export function AnswerFeedback({ reasons = DEFAULT_REASONS, onSubmit, className = '' }: AnswerFeedbackProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [correction, setCorrection] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className={className} data-feedback="" role="status">
        Thanks — this improves future answers.
      </div>
    );
  }

  const toggleReason = (r: string) => setPicked((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  const submit = (finalRating: 'up' | 'down') => {
    onSubmit?.({ rating: finalRating, reasons: finalRating === 'down' ? picked : [], correction: correction.trim() });
    setDone(true);
  };

  return (
    <div className={className} data-feedback="">
      <div data-feedbackrow="">
        <button
          type="button"
          data-thumb=""
          data-active={rating === 'up' ? '' : undefined}
          aria-label="Good answer"
          aria-pressed={rating === 'up'}
          onClick={() => {
            setRating('up');
            setPicked([]);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 7v6H2.5v-6H5zm1 6h6.2a1.5 1.5 0 001.5-1.2l1-4.6a1.5 1.5 0 00-1.5-1.7H9.5l.6-2.8a1.4 1.4 0 00-2.7-.7L6 7z" />
          </svg>
        </button>
        <button
          type="button"
          data-thumb=""
          data-active={rating === 'down' ? '' : undefined}
          aria-label="Bad answer"
          aria-pressed={rating === 'down'}
          onClick={() => setRating('down')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 9V3h2.5v6H11zm-1-6H3.8a1.5 1.5 0 00-1.5 1.2l-1 4.6a1.5 1.5 0 001.5 1.7h3.7l-.6 2.8a1.4 1.4 0 002.7.7L10 9z" />
          </svg>
        </button>
        {rating === null ? (
          <span data-feedbackhint="">Rate this answer</span>
        ) : (
          <button type="button" data-feedbacksend="" onClick={() => submit(rating)}>
            Send {rating === 'up' ? 'praise' : 'report'}
          </button>
        )}
      </div>
      {rating === 'down' && (
        <div data-feedbackdetail="">
          <div data-reasonchips="" role="group" aria-label="What went wrong">
            {reasons.map((r) => (
              <button
                key={r}
                type="button"
                data-reasonchip=""
                data-on={picked.includes(r) ? '' : undefined}
                aria-pressed={picked.includes(r)}
                onClick={() => toggleReason(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <label data-correctionlabel="">
            What should it have said?
            <textarea value={correction} onChange={(e) => setCorrection(e.target.value)} rows={2} placeholder="Optional correction…" />
          </label>
        </div>
      )}
    </div>
  );
}
