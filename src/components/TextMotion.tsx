import './TextMotion.css';

export interface TextMotionProps {
  /** The text to animate. */
  text: string;
  /** Whether the text should be revealed. Default is true. */
  active?: boolean;
  /** The preset choreography to use. Default is 'slide-fade-scale'. */
  preset?: 'slide-fade-scale' | 'fade-scale' | 'slide-fade';
  /** Stagger delay between words in milliseconds. Default is 50. */
  staggerDelay?: number;
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextMotion({
  text,
  active = true,
  preset = 'slide-fade-scale',
  staggerDelay = 50,
  as: Component = 'span',
  className = '',
}: TextMotionProps) {
  const words = text.split(' ');

  return (
    <Component
      data-text-motion=""
      data-preset={preset}
      data-active={active ? '' : undefined}
      className={className}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="text-motion-word"
          aria-hidden="true"
          style={{
            '--stagger-delay': `${index * staggerDelay}ms`,
          } as React.CSSProperties}
        >
          {word}{index < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Component>
  );
}
