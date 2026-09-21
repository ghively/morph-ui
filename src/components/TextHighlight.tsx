import './TextHighlight.css';

export interface TextHighlightProps {
  /** The text to highlight. */
  text: string;
  /** Whether the highlight should be active (e.g. triggered on mount/scroll). Default is false. */
  active?: boolean;
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextHighlight({
  text,
  active = false,
  as: Component = 'span',
  className = '',
}: TextHighlightProps) {
  return (
    <Component
      data-text-highlight=""
      data-active={active ? '' : undefined}
      className={className}
    >
      <span className="text-highlight-content">{text}</span>
    </Component>
  );
}
