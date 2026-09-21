import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CoverFlowCarousel } from '../src/components/CoverFlowCarousel';

describe('CoverFlowCarousel', () => {
  const items = [
    { id: 1, content: 'Card 1' },
    { id: 2, content: 'Card 2' },
    { id: 3, content: 'Card 3' }
  ];

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<CoverFlowCarousel items={items} />);
    expect(getByTestId('cover-flow-carousel')).toBeTruthy();
    expect(getByText('Card 1')).toBeTruthy();
    expect(getByText('Card 2')).toBeTruthy();
    expect(getByText('Card 3')).toBeTruthy();
  });

  it('navigates with arrows', () => {
    const { getByLabelText, getByText } = render(<CoverFlowCarousel items={items} />);
    
    expect(getByText('1 / 3')).toBeTruthy();
    
    const nextBtn = getByLabelText('Next');
    fireEvent.click(nextBtn);
    expect(getByText('2 / 3')).toBeTruthy();
    
    const prevBtn = getByLabelText('Previous');
    fireEvent.click(prevBtn);
    expect(getByText('1 / 3')).toBeTruthy();
  });

  it('navigates with keyboard', () => {
    const { getByTestId, getByText } = render(<CoverFlowCarousel items={items} />);
    const carousel = getByTestId('cover-flow-carousel');
    
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(getByText('2 / 3')).toBeTruthy();
    
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expect(getByText('1 / 3')).toBeTruthy();
  });

  it('navigates on click of side items', () => {
    const { getByTestId, getByText } = render(<CoverFlowCarousel items={items} />);
    const item3 = getByTestId('cover-flow-item-2');
    
    fireEvent.click(item3);
    expect(getByText('3 / 3')).toBeTruthy();
  });
  
  it('navigates via drag', () => {
    const { getByTestId, getByText } = render(<CoverFlowCarousel items={items} />);
    const carousel = getByTestId('cover-flow-carousel');
    
    fireEvent.mouseDown(carousel, { clientX: 200 });
    fireEvent.mouseMove(carousel, { clientX: 100 }); // dragged left
    fireEvent.mouseUp(carousel);
    
    expect(getByText('2 / 3')).toBeTruthy();
  });
  
  it('renders mirrored floor when prop is true', () => {
    const { container } = render(<CoverFlowCarousel items={items} mirroredFloor={true} />);
    const reflections = container.querySelectorAll('.cover-flow-item-reflection');
    expect(reflections.length).toBe(3);
  });
});
