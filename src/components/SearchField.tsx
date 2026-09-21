import { useEffect, useRef } from 'react';
import './SearchField.css';

export interface SearchFieldProps {
  id: string;
  value: string;
  onChange: (next: string) => void;
  onSubmit?: (query: string) => void;
  label?: string;
  placeholder?: string;
  /** Debounce ms applied before onChange fires. 0 = immediate. */
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
}

/** Search input with icon, clear button, and optional submit (Enter). */
export function SearchField({
  id,
  value,
  onChange,
  onSubmit,
  label = 'Search',
  placeholder = 'Search…',
  debounceMs = 0,
  disabled,
  className = '',
}: SearchFieldProps) {
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const emit = (next: string) => {
    if (debounceMs <= 0) {
      onChange(next);
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onChange(next), debounceMs);
  };

  return (
    <div className={className} data-searchfield="">
      <label htmlFor={id} data-sronly="">
        {label}
      </label>
      <svg data-searchicon="" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => emit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit(value);
          }
        }}
      />
      {value && !disabled && (
        <button type="button" data-searchclear="" aria-label="Clear search" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </div>
  );
}
