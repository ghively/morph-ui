import './ToggleSwitch.css';

export interface ToggleSwitchProps {
  on: boolean;
  onChange: (next: boolean) => void;
  /** Accessible name — required; the switch renders no visible text. */
  label: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({ on, onChange, label, disabled, className = '' }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      className={className}
      data-push=""
      data-sw=""
      data-on={String(on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange(!on);
        }
      }}
    />
  );
}
