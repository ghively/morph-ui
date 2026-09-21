import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextCharSlide } from '../src/components/TextCharSlide';

describe('TextCharSlide', () => {
  it('renders correctly with default props', () => {
    const { container, getByLabelText } = render(<TextCharSlide text="Hello" />);
    
    const wrapper = getByLabelText('Hello');
    expect(wrapper).toBeDefined();
    expect(wrapper.getAttribute('data-text-char-slide')).toBe('');
    expect(wrapper.getAttribute('data-direction')).toBe('up');
    expect(wrapper.tagName.toLowerCase()).toBe('span');

    const chars = container.querySelectorAll('[data-text-char-slide-char]');
    expect(chars.length).toBe(5);
    expect(chars[0]?.textContent).toBe('H');
    expect(chars[4]?.textContent).toBe('o');
  });

  it('renders spaces correctly', () => {
    const { container } = render(<TextCharSlide text="a b" />);
    const chars = container.querySelectorAll('[data-text-char-slide-char]');
    expect(chars.length).toBe(3);
    expect(chars[1]?.textContent).toBe('\u00A0'); // Non-breaking space
  });

  it('applies custom props correctly', () => {
    const { container, getByLabelText } = render(
      <TextCharSlide
        text="Test"
        direction="left"
        staggerDelay={100}
        initialDelay={200}
        as="h1"
        className="my-class"
      />
    );

    const wrapper = getByLabelText('Test');
    expect(wrapper.getAttribute('data-direction')).toBe('left');
    expect(wrapper.tagName.toLowerCase()).toBe('h1');
    expect(wrapper.className).toBe('my-class');

    const chars = container.querySelectorAll('[data-text-char-slide-char]');
    const firstCharStyle = (chars[0] as HTMLElement).style.getPropertyValue('--stagger-delay');
    const secondCharStyle = (chars[1] as HTMLElement).style.getPropertyValue('--stagger-delay');
    
    expect(firstCharStyle).toBe('200ms');
    expect(secondCharStyle).toBe('300ms');
  });
});
