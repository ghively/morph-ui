import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DeviceFrame } from '../src/components/DeviceFrame';

describe('DeviceFrame', () => {
  it('renders children within the screen area', () => {
    render(
      <DeviceFrame>
        <div data-testid="screenshot">App Content</div>
      </DeviceFrame>
    );
    
    expect(screen.getByTestId('screenshot')).toBeDefined();
    expect(screen.getByText('App Content')).toBeDefined();
  });

  it('renders notch by default', () => {
    const { container } = render(<DeviceFrame>Content</DeviceFrame>);
    expect(container.querySelector('.device-frame-notch')).toBeDefined();
  });

  it('hides notch when showNotch is false', () => {
    const { container } = render(<DeviceFrame showNotch={false}>Content</DeviceFrame>);
    expect(container.querySelector('.device-frame-notch')).toBeNull();
  });

  it('applies custom width', () => {
    const { container } = render(<DeviceFrame width={400}>Content</DeviceFrame>);
    const bezel = container.querySelector('.device-frame-bezel') as HTMLElement;
    expect(bezel.style.width).toBe('400px');
  });
});
