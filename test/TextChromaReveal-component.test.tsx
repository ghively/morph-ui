import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextChromaReveal } from '../src/components/TextChromaReveal';

describe('TextChromaReveal', () => {
  it('renders correctly', () => {
    const { container, getByLabelText } = render(<TextChromaReveal text="Reveal" />);
    
    const wrapper = getByLabelText('Reveal');
    expect(wrapper).toBeDefined();
    expect(wrapper.getAttribute('data-text-chroma-reveal')).toBe('');
    expect(wrapper.hasAttribute('data-revealed')).toBe(false);

    const layers = container.querySelectorAll('[data-text-chroma-layer]');
    expect(layers.length).toBe(4);
    
    expect(layers[0]?.getAttribute('data-text-chroma-layer')).toBe('red');
    expect(layers[1]?.getAttribute('data-text-chroma-layer')).toBe('green');
    expect(layers[2]?.getAttribute('data-text-chroma-layer')).toBe('blue');
    expect(layers[3]?.getAttribute('data-text-chroma-layer')).toBe('base');
  });

  it('applies reveal state', () => {
    const { getByLabelText } = render(<TextChromaReveal text="Reveal" reveal />);
    const wrapper = getByLabelText('Reveal');
    expect(wrapper.hasAttribute('data-revealed')).toBe(true);
  });

  it('supports custom tag and class', () => {
    const { getByLabelText } = render(<TextChromaReveal text="Custom" as="h2" className="my-class" />);
    const wrapper = getByLabelText('Custom');
    expect(wrapper.tagName.toLowerCase()).toBe('h2');
    expect(wrapper.className).toBe('my-class');
  });
});
