import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdaptiveBento } from '../src/components/AdaptiveBento';

describe('AdaptiveBento', () => {
  it('renders an empty state when no items are provided', () => {
    const { container } = render(<AdaptiveBento items={[]} />);
    const bento = container.firstChild as HTMLElement;
    
    expect(bento.getAttribute('data-empty')).toBe('true');
    expect(screen.getByText('No items')).toBeTruthy();
  });

  it('renders tiles with correct data-span and data-rowspan attributes', () => {
    const items = [
      { id: '1', span: 2 as const, rowSpan: 2 as const, node: <div>Tile 1</div> },
      { id: '2', span: 3 as const, node: <div>Tile 2</div> },
      { id: '3', node: <div>Tile 3</div> }
    ];

    const { container } = render(<AdaptiveBento items={items} />);
    const bento = container.firstChild as HTMLElement;
    
    expect(bento.getAttribute('data-empty')).toBeNull();
    
    const tiles = bento.querySelectorAll('.adaptive-bento-tile');
    expect(tiles).toHaveLength(3);
    
    expect(tiles[0].getAttribute('data-span')).toBe('2');
    expect(tiles[0].getAttribute('data-rowspan')).toBe('2');
    
    expect(tiles[1].getAttribute('data-span')).toBe('3');
    // Default rowspan is 1
    expect(tiles[1].getAttribute('data-rowspan')).toBe('1');
    
    // Default span and rowspan are 1
    expect(tiles[2].getAttribute('data-span')).toBe('1');
    expect(tiles[2].getAttribute('data-rowspan')).toBe('1');
  });

  it('applies density attribute correctly', () => {
    const { container: compactContainer } = render(<AdaptiveBento items={[{ id: '1', node: <div /> }]} density="compact" />);
    const compactBento = compactContainer.firstChild as HTMLElement;
    expect(compactBento.getAttribute('data-density')).toBe('compact');

    const { container: normalContainer } = render(<AdaptiveBento items={[{ id: '1', node: <div /> }]} density="normal" />);
    const normalBento = normalContainer.firstChild as HTMLElement;
    expect(normalBento.getAttribute('data-density')).toBe('normal');
  });
  
  it('uses default density normal when not specified', () => {
    const { container } = render(<AdaptiveBento items={[{ id: '1', node: <div /> }]} />);
    const bento = container.firstChild as HTMLElement;
    expect(bento.getAttribute('data-density')).toBe('normal');
  });
});
