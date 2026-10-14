import './InboxTriage.css';
import { useMemo, useState } from 'react';
import { cv } from './dataShell.shared';

export interface TriageItem {
  id: string;
  title: string;
  detail?: string;
  from?: string;
  time?: string;
  /** Default urgency from the Tone vocabulary. */
  tone?: 'neutral' | 'info' | 'success' | 'warn' | 'danger';
}

export interface InboxTriageProps {
  items: TriageItem[];
  /** Fires for every decision; the row animates out before it leaves. */
  onAccept?: (item: TriageItem) => void;
  onSnooze?: (item: TriageItem, untilLabel?: string) => void;
  onDecline?: (item: TriageItem) => void;
  /** Snooze durations offered (labels only). */
  snoozeOptions?: string[];
  title?: string;
  /** Show pending/snoozed/declined counts in the header. */
  showCounts?: boolean;
  emptyText?: string;
  className?: string;
}

const TONE_C: Record<NonNullable<TriageItem['tone']>, string> = {
  neutral: 'var(--app-faint)',
  info: 'var(--state-think)',
  success: 'var(--state-ok)',
  warn: 'var(--state-warn)',
  danger: 'var(--state-error)',
};

type Decision = 'accepted' | 'snoozed' | 'declined';

/**
 * InboxTriage — a decision queue: each row offers accept / snooze / decline,
 * shows running counts, and animates the row out on decision. Complements
 * ApprovalInbox (binary approve/reject) with a triage flow. Original design.
 */
export function InboxTriage({
  items,
  onAccept,
  onSnooze,
  onDecline,
  snoozeOptions = ['1h', 'tomorrow', 'next week'],
  title = 'Triage',
  showCounts = true,
  emptyText = 'Inbox zero.',
  className = '',
}: InboxTriageProps) {
  const [decided, setDecided] = useState<Record<string, Decision>>({});
  const [snoozeFor, setSnoozeFor] = useState<Record<string, string>>({});
  const [leaving, setLeaving] = useState<Record<string, true>>({});

  const counts = useMemo(() => {
    const c = { pending: 0, accepted: 0, snoozed: 0, declined: 0 };
    for (const item of items) {
      const d = decided[item.id];
      if (!d) c.pending += 1;
      else c[d] += 1;
    }
    return c;
  }, [items, decided]);

  const decide = (item: TriageItem, decision: Decision) => {
    setLeaving((l) => ({ ...l, [item.id]: true }));
    window.setTimeout(() => {
      setDecided((d) => ({ ...d, [item.id]: decision }));
      setLeaving((l) => { const n = { ...l }; delete n[item.id]; return n; });
    }, 180);
    if (decision === 'accepted') onAccept?.(item);
    else if (decision === 'declined') onDecline?.(item);
  };

  const snooze = (item: TriageItem, label: string) => {
    setSnoozeFor((s) => ({ ...s, [item.id]: label }));
    setLeaving((l) => ({ ...l, [item.id]: true }));
    window.setTimeout(() => {
      setDecided((d) => ({ ...d, [item.id]: 'snoozed' }));
      setLeaving((l) => { const n = { ...l }; delete n[item.id]; return n; });
    }, 180);
    onSnooze?.(item, label);
  };

  const pending = items.filter((i) => !decided[i.id]);

  return (
    <div className={className} data-triage="">
      <header data-triage-head="">
        <b>{title}</b>
        {showCounts && (
          <span data-triage-counts="">
            {counts.pending > 0 && <span data-triage-count="" data-kind="pending">{counts.pending} pending</span>}
            {counts.snoozed > 0 && <span data-triage-count="" data-kind="snoozed">{counts.snoozed} snoozed</span>}
            {counts.accepted > 0 && <span data-triage-count="" data-kind="accepted">{counts.accepted} done</span>}
            {counts.declined > 0 && <span data-triage-count="" data-kind="declined">{counts.declined} dropped</span>}
          </span>
        )}
      </header>

      {pending.length === 0 ? (
        <div data-triage-empty="" data-empty="">{emptyText}</div>
      ) : (
        <ul data-triage-list="">
          {pending.map((item) => (
            <li
              key={item.id}
              data-triage-row=""
              data-tone={item.tone ?? 'neutral'}
              data-leaving={leaving[item.id] ? '' : undefined}
              data-snoozed={decided[item.id] === 'snoozed' ? '' : undefined}
              style={cv(TONE_C[item.tone ?? 'neutral'])}
            >
              <span data-triage-flag="" role="img" aria-label={`${item.tone ?? 'neutral'} priority`} />
              <div data-triage-main="">
                <span data-triage-title="">{item.title}</span>
                <span data-triage-meta="">
                  {item.detail && <span>{item.detail}</span>}
                  {item.from && <span>{item.from}</span>}
                  {item.time && <span>{item.time}</span>}
                  {snoozeFor[item.id] && <span data-triage-until="">snoozed · {snoozeFor[item.id]}</span>}
                </span>
              </div>
              <div data-triage-actions="">
                <button type="button" data-triage-decline="" aria-label={`Decline: ${item.title}`} title="Decline" onClick={() => decide(item, 'declined')}>✕</button>
                <button type="button" data-triage-snooze="" aria-label={`Snooze: ${item.title}`} title="Snooze" onClick={() => snooze(item, snoozeOptions[0]!)}>⏱</button>
                <button type="button" data-triage-accept="" aria-label={`Accept: ${item.title}`} title="Accept" onClick={() => decide(item, 'accepted')}>✓</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {snoozeOptions.length > 0 && pending.length > 0 && (
        <div data-triage-foot="">
          <span data-triage-hint="">snooze defaults to {snoozeOptions[0]}</span>
        </div>
      )}
    </div>
  );
}

export type { TriageItem as InboxTriageItem };
