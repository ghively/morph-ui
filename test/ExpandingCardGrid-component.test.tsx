import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExpandingCardGrid } from '../src/components/ExpandingCardGrid';

describe('ExpandingCardGrid', () => {
  const items = [
    { id: 1, thumbnail: <span>Thumb 1</span>, content: <span>Content 1</span> },
    { id: 2, thumbnail: <span>Thumb 2</span>, content: <span>Content 2</span> },
    { id: 3, thumbnail: <span>Thumb 3</span>, content: <span>Content 3</span> },
  ];

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<ExpandingCardGrid items={items} />);
    expect(getByTestId('expanding-card-grid')).toBeTruthy();
    expect(getByText('Thumb 1')).toBeTruthy();
  });

  it('expands on click and collapses siblings', () => {
    const { getByTestId } = render(<ExpandingCardGrid items={items} />);
    const card1 = getByTestId('expanding-card-1');
    const card2 = getByTestId('expanding-card-2');

    fireEvent.click(card1);
    
    expect(card1.classList.contains('is-expanded')).toBe(true);
    expect(card2.classList.contains('is-collapsed')).toBe(true);
  });

  it('collapses on second click', () => {
    const { getByTestId } = render(<ExpandingCardGrid items={items} />);
    const card1 = getByTestId('expanding-card-1');

    fireEvent.click(card1); // expand
    expect(card1.classList.contains('is-expanded')).toBe(true);
    
    fireEvent.click(card1); // collapse
    expect(card1.classList.contains('is-expanded')).toBe(false);
  });

  it('collapses on escape key', () => {
    const { getByTestId } = render(<ExpandingCardGrid items={items} />);
    const card1 = getByTestId('expanding-card-1');

    fireEvent.click(card1);
    expect(card1.classList.contains('is-expanded')).toBe(true);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(card1.classList.contains('is-expanded')).toBe(false);
  });

  it('handles keyboard activation', () => {
    const { getByTestId } = render(<ExpandingCardGrid items={items} />);
    const card1 = getByTestId('expanding-card-1');

    fireEvent.keyDown(card1, { key: 'Enter' });
    expect(card1.classList.contains('is-expanded')).toBe(true);
    
    fireEvent.keyDown(card1, { key: ' ' }); // Space to toggle off
    expect(card1.classList.contains('is-expanded')).toBe(false);
  });
});
