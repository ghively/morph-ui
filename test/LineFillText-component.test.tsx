import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LineFillText } from '../src/components/LineFillText';

describe('LineFillText', () => {
  it('renders correctly', () => {
    const { container } = render(<LineFillText text="Morph" />);
    
    const containerEl = container.querySelector('[data-line-fill-text]');
    expect(containerEl).toBeTruthy();
    
    const strokeText = container.querySelector('.line-fill-text-stroke');
    expect(strokeText).toBeTruthy();
    expect(strokeText?.textContent).toBe('Morph');

    const fillText = container.querySelector('.line-fill-text-fill');
    expect(fillText).toBeTruthy();
    expect(fillText?.textContent).toBe('Morph');
  });

  it('applies custom delay and className', () => {
    const { container } = render(
      <LineFillText text="Test" fillDelay="2s" className="custom-class" />
    );
    
    const containerEl = container.querySelector('[data-line-fill-text]');
    expect(containerEl?.classList.contains('custom-class')).toBe(true);
    expect((containerEl as HTMLElement).style.getPropertyValue('--fill-delay')).toBe('2s');
  });
});
