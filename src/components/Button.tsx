import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, announces busy state, and blocks clicks. */
  loading?: boolean;
}

/**
 * Standard push button. Agents rendering dashboards and dialogs should
 * reach for this before the effect-styled MagneticButton.
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      className={className}
      data-button=""
      data-variant={variant}
      data-size={size}
      data-loading={loading ? '' : undefined}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...rest}
    >
      {loading && <span data-btnspinner="" aria-hidden="true" />}
      <span data-btnlabel="">{children}</span>
    </button>
  );
}
