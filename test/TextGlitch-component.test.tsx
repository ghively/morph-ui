import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextGlitch } from '../src/components/TextGlitch';

describe('TextGlitch', () => {
  it('renders correctly', () => {
    const { container, getByLabelText } = render(<TextGlitch text="Glitch" />);
    
    const wrapper = getByLabelText('Glitch');
    expect(wrapper).toBeDefined();
    expect(wrapper.getAttribute('data-intensity')).toBe('medium');

    const base = container.querySelector('.text-glitch-base');
    expect(base?.textContent).toBe('Glitch');

    const layers = container.querySelectorAll('.text-glitch-layer');
    expect(layers.length).toBe(2);
    expect(layers[0]?.classList.contains('text-glitch-red')).toBe(true);
    expect(layers[1]?.classList.contains('text-glitch-blue')).toBe(true);
  });

  it('supports custom props', () => {
    const { getByLabelText } = render(<TextGlitch text="Test" intensity="high" as="h1" className="custom" />);
    const wrapper = getByLabelText('Test');
    
    expect(wrapper.getAttribute('data-intensity')).toBe('high');
    expect(wrapper.tagName.toLowerCase()).toBe('h1');
    expect(wrapper.className).toBe('custom');
  });
});
