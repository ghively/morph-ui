import './Button.css';
import type { ButtonProps } from './forms.shared';

/**
 * Standard push button. Agents rendering dashboards and dialogs should
 * reach for this before the effect-styled MagneticButton.
 */
export function Button({ children, variant = 'secondary', size = 'md', loading = false, disabled, type = 'button', className = '', ...rest }: ButtonProps) {
  const off = disabled || loading;
  return (
    <button type={type} className={className} data-button="" data-variant={variant} data-size={size} data-loading={loading ? '' : undefined} disabled={off} aria-busy={loading || undefined} aria-disabled={off || undefined} {...rest}>
      {loading && <span data-btnspinner="" aria-hidden="true" />}
      <span data-btnlabel="">{children}</span>
    </button>
  );
}

export type { ButtonProps, ButtonVariant, ButtonSize } from './forms.shared';
