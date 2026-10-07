import type { AriaAttributes, MouseEvent, ReactNode } from 'react';
import './Link.css';

export type LinkTone = 'accent' | 'muted';

export interface LinkProps extends AriaAttributes {
  /** Destination. When given, renders an `<a>`; otherwise a `<button type="button">` styled as an inline link. */
  href?: string;
  /** Click handler for either form. */
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children: ReactNode;
  /** 'accent' = the frame accent (default). 'muted' = dim ink that turns accent on hover/focus. */
  tone?: LinkTone;
  /** Opens in a new tab: adds `target="_blank"`, `rel="noopener noreferrer"` and a visually-hidden "(opens in new tab)". Anchor form only. */
  external?: boolean;
  /** Disables the button form. Ignored when `href` is given (an anchor can't be disabled). */
  disabled?: boolean;
  id?: string;
  title?: string;
  className?: string;
}

/**
 * Inline text link. Renders an anchor when `href` is set, otherwise a button
 * that looks identical, so link-style actions ("Forgot password?", "Resend
 * code") no longer need ghost Buttons or hand-styled anchors. Underlines on
 * hover and keyboard focus; both tones meet 4.5:1 on `--app-bg` and
 * `--app-panel`.
 *
 * Provenance: original morph-ui design (2026-10).
 */
export function Link({
  href,
  onClick,
  children,
  tone = 'accent',
  external = false,
  disabled,
  className = '',
  ...rest
}: LinkProps) {
  const common = {
    ...rest,
    className: `morph-link ${className}`.trim(),
    'data-link': '',
    'data-tone': tone,
    onClick,
  };

  if (href !== undefined) {
    return (
      <a
        {...common}
        href={href}
        data-external={external ? '' : undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
        {external && (
          <>
            <svg data-linkicon="" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path d="M4.5 2.5h5v5M9.5 2.5 3 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span data-linksr="">{' '}(opens in new tab)</span>
          </>
        )}
      </a>
    );
  }

  return (
    <button {...common} type="button" disabled={disabled}>
      {children}
    </button>
  );
}
