import './SasVerificationPanel.css';

export type VerificationPhase = 'idle' | 'requested' | 'ready' | 'started' | 'done' | 'cancelled';

export interface SasEmoji { symbol: string; name: string; }

export interface SasVerificationPanelProps {
  phase: VerificationPhase;
  initiatedByMe?: boolean;
  emoji?: SasEmoji[] | null;
  onStart: () => void;
  onAccept?: () => void;
  onCancel?: () => void;
  onConfirmMatch?: () => void;
  onReportMismatch?: () => void;
  eyebrow?: string;
  copy?: Partial<{
    intro: string;
    startLabel: string;
    comparePrompt: string;
    matchLabel: string;
    mismatchLabel: string;
    incoming: string;
    doneText: string;
    cancelledText: string;
    waitingText: string;
    acceptLabel: string;
    cancelLabel: string;
  }>;
  className?: string;
}

export function SasVerificationPanel(props: SasVerificationPanelProps) {
  const {
    phase,
    initiatedByMe = false,
    emoji,
    onStart,
    onAccept,
    onCancel,
    onConfirmMatch,
    onReportMismatch,
    eyebrow = 'Verify with another session',
    copy = {},
    className
  } = props;

  const c = {
    intro: 'Compare emoji with one of your other signed-in clients.',
    startLabel: 'Start verification',
    comparePrompt: 'Confirm the other session shows the same emoji, in the same order.',
    matchLabel: 'They match',
    mismatchLabel: "They don't match",
    incoming: 'Another session wants to verify.',
    doneText: 'Verified.',
    cancelledText: 'Cancelled.',
    waitingText: 'Waiting for your other session…',
    acceptLabel: 'Accept',
    cancelLabel: 'Cancel',
    ...copy
  };

  const renderContent = () => {
    if (phase === 'idle') {
      return (
        <>
          <p data-meta="">{c.intro}</p>
          <button data-btn="" data-state="" onClick={onStart}>{c.startLabel}</button>
        </>
      );
    }

    if (emoji) {
      return (
        <>
          <p data-meta="">{c.comparePrompt}</p>
          <div style={{ display: "flex", gap: "var(--s3)", flexWrap: "wrap", margin: "var(--s3) 0" }}>
            {emoji.map((e, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
                <span style={{ fontSize: 28 }} aria-hidden="true">{e.symbol}</span>
                <span data-meta="">{e.name}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--s2)" }}>
            <button data-btn="fill" data-state="" onClick={onConfirmMatch}>{c.matchLabel}</button>
            <button data-btn="" data-state="" onClick={onReportMismatch}>{c.mismatchLabel}</button>
          </div>
        </>
      );
    }

    let statusText = c.waitingText;
    if (phase === 'requested' && !initiatedByMe) statusText = c.incoming;
    else if (phase === 'done') statusText = c.doneText;
    else if (phase === 'cancelled') statusText = c.cancelledText;

    return (
      <>
        <p data-meta="">{statusText}</p>
        <div style={{ display: "flex", gap: "var(--s2)" }}>
          {phase === 'requested' && !initiatedByMe ? (
            <button data-btn="fill" data-state="" onClick={onAccept}>{c.acceptLabel}</button>
          ) : null}
          <button data-btn="" data-state="" onClick={onCancel}>{c.cancelLabel}</button>
        </div>
      </>
    );
  };

  return (
    <div data-card="" data-pad="roomy" aria-live="polite" className={className}>
      <div data-eyebrow="">{eyebrow}</div>
      {renderContent()}
    </div>
  );
}
