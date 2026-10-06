import { useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react';
import './OtpInput.css';
import { fieldIds, useFieldId, FieldNotes } from './forms.shared';

export interface OtpInputProps {
  /** Number of cells (characters in the code). Default 6. */
  length?: number;
  /** Controlled code. Characters fill the cells left to right; the string is never longer than `length`. */
  value?: string;
  /** Initial code when uncontrolled. */
  defaultValue?: string;
  /** Called with the whole code whenever it changes. */
  onChange?: (value: string) => void;
  /** Called once each time the last empty cell is filled (by typing or pasting). */
  onComplete?: (code: string) => void;
  /** Accessible name for the cell group, also shown above the cells. Required. */
  label: string;
  /** Base id; cells get `${id}-1 … ${id}-N`, notes get `${id}-hint` / `${id}-error`. Generated when omitted. */
  id?: string;
  /** Helper text under the cells (hidden while an error shows). */
  hint?: ReactNode;
  /** Error message; marks the group invalid (`data-invalid`, `aria-invalid` on each cell). */
  error?: ReactNode;
  /** Render each filled cell as a dot instead of its character. */
  mask?: boolean;
  /** Accept letters as well as digits (also switches the default `inputMode` to `text`). */
  alphanumeric?: boolean;
  /** Virtual keyboard hint. Default `numeric` (`text` when `alphanumeric`). */
  inputMode?: 'numeric' | 'text' | 'decimal' | 'tel';
  /** Regex source one character must match. Default `[0-9]` (`[0-9A-Za-z]` when `alphanumeric`). */
  pattern?: string;
  /** Disable every cell. */
  disabled?: boolean;
  /** Focus the first empty cell on mount. */
  autoFocus?: boolean;
  className?: string;
}

/**
 * One-time-code / PIN entry: a row of single-character cells read as one value. Typing advances
 * to the next cell, Backspace on an empty cell steps back and clears, the arrow / Home / End keys
 * move between cells, and pasting a code into any cell fills the row (characters that do not match
 * `pattern` are stripped). Cells are filled left to right, so focusing past the first empty cell
 * lands on that cell. The group is labelled by `label` and described by the hint or error, and
 * `onComplete` fires when the last cell fills. Provenance: original morph-ui design (2026-10).
 */
export function OtpInput({
  length = 6, value: valueProp, defaultValue = '', onChange, onComplete, label, id: idProp, hint, error,
  mask, alphanumeric, inputMode, pattern, disabled, autoFocus, className = '',
}: OtpInputProps) {
  const id = useFieldId(idProp);
  const ids = fieldIds(id, hint, error);
  const n = Math.max(1, Math.floor(length));
  const re = new RegExp('^(?:' + (pattern ?? (alphanumeric ? '[0-9A-Za-z]' : '[0-9]')) + ')$');
  const clean = (s: string) => Array.from(s).filter(ch => re.test(ch)).join('').slice(0, n);

  const [inner, setInner] = useState(() => clean(defaultValue));
  const value = clean(valueProp ?? inner);
  const cells = useRef<(HTMLInputElement | null)[]>([]);
  // Filled length as of the latest commit, so a focus moved in the same event is not redirected by a stale render.
  const filled = useRef(value.length);
  filled.current = value.length;

  const focus = (i: number) => {
    const el = cells.current[Math.max(0, Math.min(n - 1, i))];
    if (el) { el.focus(); el.select(); }
  };
  const commit = (next: string) => {
    next = next.slice(0, n);
    if (next === value) return;
    filled.current = next.length;
    if (valueProp === undefined) setInner(next);
    onChange?.(next);
    if (next.length === n) onComplete?.(next);
  };
  /** Write `chars` starting at cell `at` (clamped to the first empty cell), then focus what follows. */
  const write = (at: number, chars: string) => {
    if (!chars) return;
    const start = Math.min(at, value.length);
    const next = (value.slice(0, start) + chars + value.slice(start + chars.length)).slice(0, n);
    commit(next);
    focus(Math.min(start + chars.length, n - 1));
  };

  const remove = (i: number) => {
    if (i >= value.length) return;
    commit(value.slice(0, i) + value.slice(i + 1));
  };

  const onInput = (i: number, raw: string) => {
    const old = value[i] ?? '';
    // A cell that already held a character receives old + new; keep only what was typed.
    const typed = old && raw.length > 1 && raw.includes(old) ? raw.replace(old, '') : raw;
    const chars = clean(typed);
    if (!raw) { remove(i); return; }
    if (!chars) return; // rejected character: the controlled cell keeps its value
    if (chars.length >= n) { commit(chars); focus(n - 1); } else write(i, chars); // autofill delivers the whole code
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    const k = e.key;
    if (k === 'Backspace') {
      e.preventDefault();
      if (i < value.length) remove(i);
      else if (i > 0) { remove(i - 1); focus(i - 1); }
    } else if (k === 'Delete') { e.preventDefault(); remove(i); }
    else if (k === 'ArrowLeft') { e.preventDefault(); focus(i - 1); }
    else if (k === 'ArrowRight') { e.preventDefault(); focus(Math.min(i + 1, value.length)); }
    else if (k === 'Home') { e.preventDefault(); focus(0); }
    else if (k === 'End') { e.preventDefault(); focus(value.length); }
  };

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const chars = clean(e.clipboardData.getData('text'));
    if (!chars) return;
    if (chars.length >= n) { commit(chars); focus(n - 1); } else write(i, chars);
  };

  const active = Math.min(value.length, n - 1);
  return (
    <div className={className} data-otp="" {...ids.root} data-disabled={disabled ? '' : undefined} data-complete={value.length === n ? '' : undefined}>
      <span data-otplabel="" aria-hidden="true">{label}</span>
      <div data-otpcells="" role="group" aria-label={label} aria-describedby={error ? ids.errorId : ids.hintId}>
        {Array.from({ length: n }, (_, i) => {
          const ch = value[i] ?? '';
          return (
            <input
              key={i}
              ref={el => { cells.current[i] = el; }}
              id={i === 0 ? id : id + '-' + (i + 1)}
              data-otpcell=""
              data-filled={ch ? '' : undefined}
              data-next={!disabled && i === value.length ? '' : undefined}
              type={mask ? 'password' : 'text'}
              value={ch}
              inputMode={inputMode ?? (alphanumeric ? 'text' : 'numeric')}
              pattern={pattern ?? (alphanumeric ? '[0-9A-Za-z]' : '[0-9]')}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus={autoFocus && i === active}
              disabled={disabled}
              aria-label={'Digit ' + (i + 1) + ' of ' + n}
              aria-invalid={ids.invalid}
              onFocus={e => { if (i > filled.current) focus(filled.current); else e.currentTarget.select(); }}
              onChange={e => onInput(i, e.currentTarget.value)}
              onKeyDown={e => onKey(i, e)}
              onPaste={e => onPaste(i, e)}
            />
          );
        })}
      </div>
      <FieldNotes ids={ids} hint={hint} error={error} attr="data-fieldhint" />
    </div>
  );
}
