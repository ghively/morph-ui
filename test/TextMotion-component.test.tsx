import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextMotion } from '../src/components/TextMotion';

describe('TextMotion', () => {
  it('renders correctly', () => {
    const { container, getByLabelText } = render(<TextMotion text="Hello World" />);
    
    const wrapper = getByLabelText('Hello World');
    expect(wrapper).toBeDefined();
    expect(wrapper.getAttribute('data-preset')).toBe('slide-fade-scale');
    expect(wrapper.hasAttribute('data-active')).toBe(true);

    const words = container.querySelectorAll('.text-motion-word');
    expect(words.length).toBe(2);
    expect(words[0]?.textContent).toBe('Hello\u00A0');
    expect(words[1]?.textContent).toBe('World');
  });

  it('handles inactive state', () => {
    const { container } = render(<TextMotion text="Test" active={false} />);
    const wrapper = container.querySelector('[data-text-motion]');
    expect(wrapper?.hasAttribute('data-active')).toBe(false);
  });

  it('supports custom props', () => {
    const { container } = render(
      <TextMotion text="Custom" preset="fade-scale" staggerDelay={100} as="h1" className="my-class" />
    );
    const wrapper = container.querySelector('[data-text-motion]');
    
    expect(wrapper?.tagName.toLowerCase()).toBe('h1');
    expect(wrapper?.className).toBe('my-class');
    expect(wrapper?.getAttribute('data-preset')).toBe('fade-scale');
    
    const words = container.querySelectorAll('.text-motion-word');
    const firstWordStyle = (words[0] as HTMLElement).style.getPropertyValue('--stagger-delay');
    expect(firstWordStyle).toBe('0ms');
  });
});
