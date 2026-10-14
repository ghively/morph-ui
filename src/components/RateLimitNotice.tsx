import { useEffect, useState } from 'react';
import './RateLimitNotice.css';

export interface RateLimitNoticeProps {
  /** Seconds until the limit resets. Drives the countdown. */
  retryAfter: number;
  /** Optional absolute reset time; shown as text when given (render it yourself if it's a string). */
  resetAt?: string;
  /** What was throttled, e.g. "Search". Default "This action". */
  subject?: string;
  /** Live remaining-seconds count for controlled hosts; `retryAfter` is used when omitted. */
  remaining?: number;
  onRetry?: () => void;
  retryLabel?: string;
  /** Hide the retry button until the countdown hits zero. Default false (disabled until ready). */
  hideRetryUntilReady?: boolean;
  className?: string;
}

const fmt = (s: number) => {
  const t = Math.max(0, Math.round(s));
  const m = Math.floor(t / 60);
  const r = t % 60;
  return m > 0 ? `${m}:${String(r).padStart(2, '0')}` : `${r}s`;
};

/**
 * Compact throttling banner: mono countdown to the reset, retry-after in text,
 * and a Retry action that stays disabled until the window clears. Announces
 * politely. Provenance: original morph-ui design (2026-10).
 */
export function RateLimitNotice({
  retryAfter,
  resetAt,
  subject = 'This action',
  remaining,
  onRetry,
  retryLabel = 'Retry',
  hideRetryUntilReady = false,
  className = '',
}: RateLimitNoticeProps) {
  const [tick, setTick] = useState(retryAfter);

  // Uncontrolled countdown from the last `retryAfter` change.
  useEffect(() => {
    if (remaining !== undefined) return;
    setTick(retryAfter);
    if (retryAfter <= 0) return;
    const iv = window.setInterval(() => {
      setTick((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => window.clearInterval(iv);
  }, [retryAfter, remaining]);

  const left = remaining !== undefined ? Math.max(0, remaining) : tick;
  const ready = left <= 0;

  return (
    <div className={className} data-ratelimit="" data-ready={ready ? '' : undefined} role="status">
      <span data-rlclock="" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" strokeWidth="1.6" strokeLinecap="round">
          <circle data-rlface="" cx="7" cy="7" r="5.6" />
          <path data-rlhand="" d="M7 4.2V7l2 1.4" />
        </svg>
      </span>
      <div data-rlbody="">
        <strong data-rllead="">{subject} is rate-limited</strong>{' '}
        <span data-rltext="">
          {ready ? 'The window has reset — you can retry now.' : <>Try again in <b data-rlcount="">{fmt(left)}</b>.</>}
        </span>
        {resetAt && (
          <span data-rlreset="">
            resets at {resetAt}
          </span>
        )}
      </div>
      <span data-rltimer="" aria-hidden="true">
        {fmt(left)}
      </span>
      {onRetry && !hideRetryUntilReady && (
        <button type="button" data-rlretry="" onClick={onRetry} disabled={!ready}>
          {retryLabel}
        </button>
      )}
      {onRetry && hideRetryUntilReady && ready && (
        <button type="button" data-rlretry="" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
      <span data-sronly="" aria-live="polite">
        {ready ? `${subject} rate limit cleared` : `${subject} rate-limited, retry in ${fmt(left)}`}
      </span>
    </div>
  );
}
