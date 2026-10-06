import './ToggleSwitch.css';

export interface ToggleSwitchProps {
  /** Current state. `checked` is accepted as an alias for parity with Checkbox. */
  on?: boolean;
  checked?: boolean;
  onChange: (next: boolean) => void;
  /** Accessible name — required; the switch renders no visible text. */
  label: string;
  disabled?: boolean;
  /** Lets a `<label htmlFor>` (e.g. FormField) target the switch. */
  id?: string;
  /** Id of an element describing the switch (hint text). */
  'aria-describedby'?: string;
  className?: string;
}

export function ToggleSwitch({ on: onProp, checked, onChange, label, disabled, id, 'aria-describedby': describedBy, className = '' }: ToggleSwitchProps) {
  const on = onProp ?? checked ?? false;
  return (
    <button
      type="button"
      id={id}
      className={className}
      data-push=""
      data-sw=""
      data-on={String(on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange(!on);
        }
      }}
    />
  );
}
