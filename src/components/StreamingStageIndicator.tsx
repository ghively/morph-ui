import './StreamingStageIndicator.css';

export type RagStage = 'searching' | 'reading' | 'drafting';

export interface StreamingStageIndicatorProps {
  /** Current stage. Omit (with streaming=false) for the settled state. */
  stage?: RagStage;
  streaming?: boolean;
  /** Stage labels, in order. Defaults to Searching → Reading → Drafting. */
  stages?: [string, string, string];
  className?: string;
}

const ORDER: RagStage[] = ['searching', 'reading', 'drafting'];

/** "Searching… → Reading… → Drafting…" stepper shown while a RAG answer streams. */
export function StreamingStageIndicator({ stage, streaming = true, stages = ['Searching', 'Reading', 'Drafting'], className = '' }: StreamingStageIndicatorProps) {
  if (!streaming) return null;
  const current = stage ? ORDER.indexOf(stage) : 0;
  return (
    <div className={className} data-stages="" role="status" aria-label={`Working: ${stages[Math.max(0, current)]}…`}>
      {ORDER.map((key, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo';
        return (
          <span key={key} data-stage="" data-state={state}>
            <span data-stagedot="" aria-hidden="true">
              {state === 'done' ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5.5l2.5 2.5 4.5-5.5" />
                </svg>
              ) : (
                <span data-stagepulse="" />
              )}
            </span>
            {stages[i]}
            {i < ORDER.length - 1 && (
              <span data-stagearrow="" aria-hidden="true">
                →
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
