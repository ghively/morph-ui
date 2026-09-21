import './TextChromaReveal.css';

export interface TextChromaRevealProps {
  /** The text to animate. */
  text: string;
  /** Whether the text should be revealed. */
  reveal?: boolean;
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextChromaReveal({
  text,
  reveal = false,
  as: Component = 'span',
  className = '',
}: TextChromaRevealProps) {
  return (
    <Component
      data-text-chroma-reveal=""
      data-revealed={reveal ? '' : undefined}
      className={className}
      aria-label={text}
    >
      <span aria-hidden="true" data-text-chroma-layer="red">{text}</span>
      <span aria-hidden="true" data-text-chroma-layer="green">{text}</span>
      <span aria-hidden="true" data-text-chroma-layer="blue">{text}</span>
      <span aria-hidden="true" data-text-chroma-layer="base">{text}</span>
    </Component>
  );
}
