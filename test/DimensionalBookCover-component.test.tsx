import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DimensionalBookCover } from '../src/components/DimensionalBookCover';

describe('DimensionalBookCover', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <DimensionalBookCover coverContent={<span>Front</span>} />
    );
    expect(getByTestId('dimensional-book-wrapper')).toBeTruthy();
    expect(getByText('Front')).toBeTruthy();
  });

  it('tilts on mouse move', () => {
    const { getByTestId } = render(
      <DimensionalBookCover coverContent={<span>Front</span>} />
    );
    const wrapper = getByTestId('dimensional-book-wrapper');
    const book = wrapper.querySelector('.dimensional-book') as HTMLElement;
    
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 250,
      height: 350,
      top: 0,
      left: 0,
      bottom: 350,
      right: 250,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));

    fireEvent.mouseMove(wrapper, { clientX: 125, clientY: 175 });
    // JS might output -0 or 0
    expect(book.style.transform).toMatch(/rotateX\(-?0deg\) rotateY\(0deg\)/);

    fireEvent.mouseMove(wrapper, { clientX: 250, clientY: 350 });
    // Center is 125, 175. Mouse at 250, 350. dx=125, dy=175
    // rotateX = -(175/350)*15 = -7.5
    // rotateY = (125/250)*15 = 7.5
    expect(book.style.transform).toBe('rotateX(-7.5deg) rotateY(7.5deg)');

    fireEvent.mouseLeave(wrapper);
    expect(book.style.transform).toBe('rotateX(0deg) rotateY(0deg)');
  });

  it('opens on click and ignores tilt when open', () => {
    const { getByTestId } = render(
      <DimensionalBookCover coverContent={<span>Front</span>} />
    );
    const wrapper = getByTestId('dimensional-book-wrapper');
    const book = wrapper.querySelector('.dimensional-book') as HTMLElement;
    
    fireEvent.click(wrapper);
    expect(book.classList.contains('is-open')).toBe(true);
    expect(book.style.transform).toBe('');

    fireEvent.mouseMove(wrapper, { clientX: 250, clientY: 350 });
    // Should not tilt when open
    expect(book.style.transform).toBe('');
  });
  
  it('renders custom spine and page content', () => {
    const { getByText } = render(
      <DimensionalBookCover 
        coverContent={<span>Front</span>} 
        spineContent={<span>Spine</span>}
        pageContent={<span>Page</span>}
      />
    );
    
    expect(getByText('Spine')).toBeTruthy();
    expect(getByText('Page')).toBeTruthy();
  });
});
