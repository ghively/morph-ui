import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ColorArchiveScroll } from '../src/components/ColorArchiveScroll';

describe('ColorArchiveScroll', () => {
  const items = [
    { id: '1', title: 'Item 1', color: '#ff0000' },
    { id: '2', title: 'Item 2', color: '#00ff00' },
    { id: '3', title: 'Item 3', color: '#0000ff' }
  ];

  it('renders items correctly', () => {
    const { getByText, container } = render(<ColorArchiveScroll items={items} />);
    
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
    
    const wrapper = container.querySelector('[data-color-archive-scroll]') as HTMLElement;
    expect(wrapper.style.getPropertyValue('--active-bg-color')).toBe('#ff0000');
  });

  it('updates active item on scroll', () => {
    const { container } = render(<ColorArchiveScroll items={items} />);
    const viewport = container.querySelector('.color-archive-scroll-viewport') as HTMLElement;
    
    // Mock properties for scroll calculation
    Object.defineProperty(viewport, 'clientWidth', { value: 1000 });
    Object.defineProperty(viewport, 'scrollLeft', { value: 800, configurable: true });
    
    fireEvent.scroll(viewport);
    
    const wrapper = container.querySelector('[data-color-archive-scroll]') as HTMLElement;
    // 800 scrollLeft / (1000 * 0.8) = index 1
    expect(wrapper.style.getPropertyValue('--active-bg-color')).toBe('#00ff00');
  });
});
