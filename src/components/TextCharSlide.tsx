import './TextCharSlide.css';

export interface TextCharSlideProps {
  /** The text to animate. */
  text: string;
  /** Direction from which the characters should slide in. Default is 'up'. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Stagger delay between each character in milliseconds. Default is 50. */
  staggerDelay?: number;
  /** Initial delay before the animation starts in milliseconds. Default is 0. */
  initialDelay?: number;
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextCharSlide({
  text,
  direction = 'up',
  staggerDelay = 50,
  initialDelay = 0,
  as: Component = 'span',
  className = '',
}: TextCharSlideProps) {
  const chars = text.split('');

  return (
    <Component
      data-text-char-slide=""
      data-direction={direction}
      className={className}
      aria-label={text}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          data-text-char-slide-char=""
          aria-hidden="true"
          style={{
            '--stagger-delay': `${initialDelay + index * staggerDelay}ms`,
          } as React.CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  );
}
