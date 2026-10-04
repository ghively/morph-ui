/**
 * One semantic vocabulary for every tone-taking component. Components accept
 * any ToneInput and normalize it, so `tone="success"` means the same thing on a
 * Badge, an AlertBanner, a toast or a status dot.
 */
export type Tone = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

/** Common synonyms, accepted everywhere a Tone is: ok/good → success, warning → warn, bad/error → danger, default → neutral. */
export type ToneAlias = 'ok' | 'good' | 'warning' | 'bad' | 'error' | 'default';

export type ToneInput = Tone | ToneAlias;

const ALIASES: Record<ToneAlias, Tone> = {
  ok: 'success',
  good: 'success',
  warning: 'warn',
  bad: 'danger',
  error: 'danger',
  default: 'neutral',
};

/** Canonical tone for any accepted spelling; `fallback` when unset. */
export function toTone(tone: ToneInput | undefined, fallback: Tone = 'neutral'): Tone {
  if (!tone) return fallback;
  return (ALIASES as Record<string, Tone>)[tone] ?? (tone as Tone);
}

/** Legacy `ok | warn | danger` hook values used by status dots, tags and toasts; neutral/info render neutral. */
export function statusHook(tone: ToneInput | undefined): 'ok' | 'warn' | 'danger' | undefined {
  const t = toTone(tone);
  return t === 'success' ? 'ok' : t === 'warn' || t === 'danger' ? t : undefined;
}
