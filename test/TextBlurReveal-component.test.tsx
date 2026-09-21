import './setup';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextBlurReveal } from '../src/components/TextBlurReveal';

// Mock IntersectionObserver for scroll tests
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('TextBlurReveal', () => {
  it('renders text split into characters by default', () => {
    const { container } = render(<TextBlurReveal text="Hello" />);
    const wrapper = container.querySelector('[data-text-blur-reveal]');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute('aria-label')).toBe('Hello');
    
    const items = container.querySelectorAll('.blur-item');
    expect(items.length).toBe(5); // H, e, l, l, o
  });

  it('renders text split into words when specified', () => {
    const { container } = render(<TextBlurReveal text="Hello world" mode="word" />);
    const items = container.querySelectorAll('.blur-item');
    expect(items.length).toBe(2); // "Hello", "world"
  });

  it('handles empty strings gracefully', () => {
    const { container } = render(<TextBlurReveal text="" />);
    const items = container.querySelectorAll('.blur-item');
    // Technically splitting '' by '' gives [], so 0 length
    expect(items.length).toBe(0);
  });
});
