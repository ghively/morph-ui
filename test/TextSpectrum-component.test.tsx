import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextSpectrum } from '../src/components/TextSpectrum';

describe('TextSpectrum', () => {
  it('renders children correctly', () => {
    render(<TextSpectrum>Spectrum Text</TextSpectrum>);
    expect(screen.getByText('Spectrum Text')).toBeTruthy();
  });

  it('applies custom style properties and custom gradient', () => {
    const { container } = render(
      <TextSpectrum 
        duration="4s" 
        colors={['red', 'green', 'blue', 'red']} 
        className="spectrum-class"
      >
        Colors
      </TextSpectrum>
    );

    const el = container.querySelector('[data-text-spectrum]') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.className).toContain('spectrum-class');
    expect(el.style.getPropertyValue('--spectrum-duration')).toBe('4s');
    expect(el.style.backgroundImage).toContain('linear-gradient(90deg, red, green, blue, red)');
  });
});
