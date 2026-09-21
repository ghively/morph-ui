import './TextGlitch.css';

export interface TextGlitchProps {
  /** The text to glitch. */
  text: string;
  /** Intensity of the glitch effect. Default is 'medium'. */
  intensity?: 'low' | 'medium' | 'high';
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextGlitch({
  text,
  intensity = 'medium',
  as: Component = 'span',
  className = '',
}: TextGlitchProps) {
  return (
    <Component
      data-text-glitch=""
      data-intensity={intensity}
      className={className}
      aria-label={text}
    >
      <span aria-hidden="true" className="text-glitch-base">{text}</span>
      <span aria-hidden="true" className="text-glitch-layer text-glitch-red">{text}</span>
      <span aria-hidden="true" className="text-glitch-layer text-glitch-blue">{text}</span>
    </Component>
  );
}
