import './NumberInput.css';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { fieldIds, useFieldId, FieldNotes } from './forms.shared';

export interface NumberInputProps {
  /** Input id; a stable one is generated when omitted so label / hint / error wiring always works. */
  id?: string;
  /** Visible label. Also names the step buttons ("Decrease …" / "Increase …"). */
  label: string;
  /** Current value; `null` means the field is empty. */
  value: number | null;
  /** Called with the committed (parsed, clamped, rounded) value, or `null` when the field is cleared. */
  onChange: (value: number | null) => void;
  /** Lower bound. Typed and stepped values are clamped to it; Home jumps to it. */
  min?: number;
  /** Upper bound. Typed and stepped values are clamped to it; End jumps to it. */
  max?: number;
  /** Amount added / removed by ArrowUp / ArrowDown and the − / + buttons. Defaults to 1. */
  step?: number;
  /** Amount for PageUp / PageDown and Shift+Arrow. Defaults to `step * 10`. */
  largeStep?: number;
  /** Decimal places used for display and rounding. Defaults to the step's own decimals when stepping. */
  precision?: number;
  /** Custom display formatter for the committed value (e.g. thousands separators). */
  format?: (n: number) => string;
  /** Unit suffix shown inside the field after the number (e.g. "%", "°C", "tokens"). */
  unit?: string;
  /** Helper text under the field; hidden while an error is shown. */
  hint?: ReactNode;
  /** Error message; marks the field invalid and is announced via role="alert". */
  error?: ReactNode;
  /** Disables the input and both step buttons. */
  disabled?: boolean;
  /** Shows the value but blocks typing and stepping. */
  readOnly?: boolean;
  /** Control height: `md` matches TextField (default), `sm` is compact. */
  size?: 'sm' | 'md';
  /** Extra class on the root element. */
  className?: string;
}

const decimals = (n: number) => {
  const s = String(n);
  const e = s.indexOf('e-');
  if (e >= 0) return Number(s.slice(e + 2));
  const dot = s.indexOf('.');
  return dot < 0 ? 0 : s.length - dot - 1;
};

/** Lenient parse: tolerates spaces, thousands commas, a leading "+" and a trailing unit. NaN when unusable. */
function parseNumber(text: string, unit?: string) {
  let t = text.trim();
  if (unit && t.endsWith(unit)) t = t.slice(0, -unit.length).trim();
  t = t.replace(/[\s,]/g, '').replace(/^\+/, '');
  return /^-?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : NaN;
}

/**
 * Numeric field with − / + step buttons for quantities, limits, temperatures and token budgets.
 * The input is a `role="spinbutton"` text box: ArrowUp/Down step, Shift+Arrow and PageUp/PageDown
 * take a large step, Home/End jump to the bounds. Typing is free while focused and is parsed,
 * clamped and rounded on blur or Enter (invalid text reverts, empty text commits `null`, Escape
 * discards the draft). The step buttons stay out of the tab order and disable at the bounds.
 * Provenance: original morph-ui design (2026-10).
 */
export function NumberInput({
  id: idProp, label, value, onChange, min, max, step = 1, largeStep, precision, format, unit,
  hint, error, disabled, readOnly, size = 'md', className = '',
}: NumberInputProps) {
  const id = useFieldId(idProp);
  const ids = fieldIds(id, hint, error);
  const [draft, setDraft] = useState<string | null>(null);
  const big = largeStep ?? step * 10;
  const places = precision ?? Math.max(decimals(step), decimals(big), min != null ? decimals(min) : 0);
  const locked = disabled || readOnly;

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const round = (n: number, p?: number) => (p == null ? n : Number(n.toFixed(p)));
  const show = (n: number) => (format ? format(n) : precision != null ? n.toFixed(precision) : String(n));
  const emit = (n: number | null) => { if (n !== value) onChange(n); };

  /** The draft resolved to a committed value: parsed, clamped and rounded; unusable text keeps the old value. */
  const resolve = (): number | null => {
    if (draft == null) return value;
    if (draft.trim() === '') return null;
    const n = parseNumber(draft, unit);
    return Number.isNaN(n) ? value : clamp(round(n, precision));
  };
  const commit = () => { const next = resolve(); setDraft(null); emit(next); };
  const stepBy = (d: number) => {
    if (locked) return;
    const base = resolve();
    setDraft(null);
    emit(clamp(round((base ?? 0) + d, places)));
  };
  const jump = (n: number | undefined) => { if (n != null && !locked) { setDraft(null); emit(n); } };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const k = e.key;
    let handled = true;
    if (k === 'ArrowUp' || k === 'ArrowDown') stepBy((k === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? big : step));
    else if (k === 'PageUp' || k === 'PageDown') stepBy((k === 'PageUp' ? 1 : -1) * big);
    else if (k === 'Home' && min != null) jump(min);
    else if (k === 'End' && max != null) jump(max);
    else if (k === 'Enter') commit();
    else if (k === 'Escape' && draft != null) setDraft(null);
    else handled = false;
    if (handled) e.preventDefault();
  };

  const text = draft ?? (value == null ? '' : show(value));
  const valueText = value == null ? undefined : show(value) + (unit ? ' ' + unit : '');
  const atMin = value != null && min != null && value <= min;
  const atMax = value != null && max != null && value >= max;
  const btn = (dir: 'dec' | 'inc') => (
    <button
      type="button"
      tabIndex={-1}
      data-numstep={dir}
      aria-label={(dir === 'dec' ? 'Decrease ' : 'Increase ') + label}
      aria-controls={id}
      disabled={locked || (dir === 'dec' ? atMin : atMax)}
      onPointerDown={e => e.preventDefault()}
      onClick={() => stepBy(dir === 'dec' ? -step : step)}
    >
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d={dir === 'dec' ? 'M2.5 6h7' : 'M2.5 6h7M6 2.5v7'} />
      </svg>
    </button>
  );

  return (
    <div
      className={className}
      data-numberinput=""
      data-numsize={size}
      {...ids.root}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
    >
      <label htmlFor={id}>{label}</label>
      <div data-numfield="">
        {btn('dec')}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          autoComplete="off"
          spellCheck={false}
          value={text}
          disabled={disabled}
          readOnly={readOnly}
          aria-valuenow={value ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={valueText}
          aria-invalid={ids.invalid}
          aria-describedby={ids.describedBy}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { commit(); }}
          onKeyDown={onKeyDown}
        />
        {unit && <span data-numunit="" aria-hidden="true">{unit}</span>}
        {btn('inc')}
      </div>
      <FieldNotes ids={ids} hint={hint} error={error} attr="data-fieldhint" />
    </div>
  );
}
