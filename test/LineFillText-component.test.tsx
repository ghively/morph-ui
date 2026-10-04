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

describe('LineFillText viewBox fitting', () => {
  it('fits the viewBox to the measured text box', () => {
    const proto = (window as unknown as { SVGElement: typeof SVGElement }).SVGElement.prototype as unknown as {
      getBBox?: () => { x: number; y: number; width: number; height: number };
    };
    const original = proto.getBBox;
    proto.getBBox = () => ({ x: -200, y: 50, width: 1200, height: 100 });
    try {
      const { container } = render(<LineFillText text="Interfaces that morph" />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe('-208 42 1216 116');
    } finally {
      if (original) proto.getBBox = original;
      else delete proto.getBBox;
    }
  });

  it('keeps the fallback viewBox when text cannot be measured', () => {
    const { container } = render(<LineFillText text="Morph" />);
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 800 200');
  });
});
