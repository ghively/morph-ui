import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextPath } from '../src/components/TextPath';

describe('TextPath', () => {
  it('renders text with wave preset', () => {
    render(<TextPath text="Hello wave" path="wave" />);
    // Check screen reader text is there
    expect(screen.getAllByText('Hello wave').length).toBeGreaterThan(0);
    
    // Check if the svg text is in the document (it will be present as standard text but might not be visible in DOM the same way, however, we look for 'Hello wave')
    const container = document.querySelector('[data-text-path]');
    expect(container).toBeTruthy();
    
    const svg = container?.querySelector('svg');
    expect(svg).toBeTruthy();
    
    const path = container?.querySelector('path');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('d')).toContain('M 0 50'); // the wave path starts like this
    
    const textPath = container?.querySelector('textPath');
    expect(textPath).toBeTruthy();
    expect(textPath?.textContent).toContain('Hello wave');
  });

  it('renders custom path string', () => {
    const customPath = 'M 0 0 L 100 100';
    render(<TextPath text="Custom path" path={customPath} />);
    
    const path = document.querySelector('path');
    expect(path?.getAttribute('d')).toBe(customPath);
  });

  it('repeats text', () => {
    render(<TextPath text="Repeat" repeat={3} />);
    const textPath = document.querySelector('textPath');
    expect(textPath?.textContent).toContain('Repeat \u00A0 Repeat \u00A0 Repeat');
  });
  
  it('applies custom duration and classes', () => {
    const { container } = render(<TextPath text="Test" duration="5s" className="my-class" />);
    const wrapper = container.querySelector('.text-path-container');
    expect(wrapper?.className).toContain('my-class');
    expect((wrapper as HTMLElement).style.getPropertyValue('--duration')).toBe('5s');
  });
});
