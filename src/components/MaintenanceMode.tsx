import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import './MaintenanceMode.css';

export interface MaintenanceModeProps {
  /** Big notice, e.g. "Scheduled maintenance". */
  title?: ReactNode;
  /** What the user should know. */
  children?: ReactNode;
  /** Seconds until the surface comes back. Omit to hide the countdown. */
  untilSeconds?: number;
  /** Controlled remaining seconds; `untilSeconds` drives the countdown when omitted. */
  remaining?: number;
  /** Offer a notify-me signup. Provide `onSubscribe` to enable. */
  onSubscribe?: (email: string) => void;
  subscribeLabel?: string;
  /** Fires when the countdown reaches zero. */
  onBack?: () => void;
  backLabel?: string;
  /** Accessible name. Default "Maintenance". */
  label?: string;
  /** Fill the whole viewport (fixed) instead of its container. Default true. */
  fullscreen?: boolean;
  className?: string;
}

const fmt = (s: number) => {
  const t = Math.max(0, Math.round(s));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = t % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
};

/**
 * Full-surface maintenance notice: countdown to recovery, an optional
 * notify-me-when-back signup, and a Back action once the timer clears.
 * Provenance: original morph-ui design (2026-10).
 */
export function MaintenanceMode({
  title = 'Scheduled maintenance',
  children,
  untilSeconds,
  remaining,
  onSubscribe,
  subscribeLabel = 'Notify me',
  onBack,
  backLabel = 'Back to work',
  label = 'Maintenance',
  fullscreen = true,
  className = '',
}: MaintenanceModeProps) {
  const [tick, setTick] = useState(untilSeconds ?? 0);

  useEffect(() => {
    if (remaining !== undefined || untilSeconds === undefined) return;
    setTick(untilSeconds);
    if (untilSeconds <= 0) return;
    const iv = window.setInterval(() => {
      setTick((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => window.clearInterval(iv);
  }, [untilSeconds, remaining]);

  const left = remaining !== undefined ? Math.max(0, remaining) : tick;
  const back = left <= 0;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    if (email) onSubscribe?.(email);
    e.currentTarget.reset();
  };

  return (
    <div
      className={className}
      data-maintenance=""
      data-fullscreen={fullscreen ? '' : undefined}
      data-back={back ? '' : undefined}
      role="status"
      aria-label={label}
    >
      <div data-maintcard="">
        <span data-maintdot="" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 2.8a3.4 3.4 0 0 0-2.9 5.2L4.6 17.6a1.6 1.6 0 0 0 1.5 2.2h9.8a1.6 1.6 0 0 0 1.5-2.2l-3.5-9.6A3.4 3.4 0 0 0 11 2.8z" />
            <path d="M9 12.6h4M11 12.6v4" transform="rotate(180 11 13)" />
          </svg>
        </span>
        <h2 data-mainttitle="">{title}</h2>
        {children && <div data-maintbody="">{children}</div>}
        {untilSeconds !== undefined && (
          <div data-mainttimer="">
            <span data-maintcount="" aria-hidden="true">
              {fmt(left)}
            </span>
            <span data-maintuntil="">{back ? 'should be back any moment' : 'until we’re back'}</span>
            <span data-sronly="" aria-live="polite">
              {back ? 'Maintenance window has ended' : `Back in ${fmt(left)}`}
            </span>
          </div>
        )}
        {onSubscribe && (
          <form data-maintform="" onSubmit={submit}>
            <input
              data-maintemail=""
              type="email"
              name="email"
              placeholder="you@team.com"
              aria-label="Email address"
              required
            />
            <button type="submit" data-maintsub="">
              {subscribeLabel}
            </button>
          </form>
        )}
        {onBack && back && (
          <button type="button" data-maintback="" onClick={onBack}>
            {backLabel}
          </button>
        )}
      </div>
    </div>
  );
}
