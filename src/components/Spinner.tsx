import './Spinner.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** Announced to assistive tech. Defaults to "Loading". */
  label?: string;
  size?: SpinnerSize;
  className?: string;
}

/** Inline loading indicator; pairs with role="status" for polite announcements. */
export function Spinner({ label = 'Loading', size = 'md', className = '' }: SpinnerProps) {
  return (
    <span className={className} data-spinnerwrap="">
      <span data-spinner="" data-size={size} aria-hidden="true" />
      <span role="status" data-sronly="">
        {label}
      </span>
    </span>
  );
}
