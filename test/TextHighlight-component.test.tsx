import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextHighlight } from '../src/components/TextHighlight';

describe('TextHighlight', () => {
  it('renders correctly', () => {
    const { container } = render(<TextHighlight text="Highlight" />);
    
    const wrapper = container.querySelector('[data-text-highlight]');
    expect(wrapper).toBeDefined();
    expect(wrapper?.hasAttribute('data-active')).toBe(false);

    const content = container.querySelector('.text-highlight-content');
    expect(content?.textContent).toBe('Highlight');
  });

  it('applies active state', () => {
    const { container } = render(<TextHighlight text="Highlight" active />);
    const wrapper = container.querySelector('[data-text-highlight]');
    expect(wrapper?.hasAttribute('data-active')).toBe(true);
  });

  it('supports custom props', () => {
    const { container } = render(<TextHighlight text="Test" as="em" className="custom" />);
    const wrapper = container.querySelector('[data-text-highlight]');
    expect(wrapper?.tagName.toLowerCase()).toBe('em');
    expect(wrapper?.className).toBe('custom');
  });
});
