import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroPanel } from '../src/components/HeroPanel';

describe('HeroPanel', () => {
  it('renders mark ornament and h1 title', () => {
    const { container } = render(
      <HeroPanel title="Welcome" ornament="mark" />
    );
    const mark = container.querySelector('[data-mark]');
    expect(mark).toBeTruthy();
    expect(container.querySelector('[data-sheen]')).toBeTruthy();
    
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1!.textContent).toBe('Welcome');
  });

  it('renders tile ornament and eyebrow title', () => {
    const { container } = render(
      <HeroPanel title="Status" ornament="tile" busy={false} />
    );
    const tile = container.querySelector('[data-tile]');
    expect(tile).toBeTruthy();
    
    const dot = tile!.querySelector('[data-dot]');
    expect(dot).toBeTruthy();
    expect(dot!.hasAttribute('data-live')).toBe(false);

    expect(container.querySelector('h1')).toBeNull();
    const eyebrow = container.querySelector('[data-eyebrow]');
    expect(eyebrow).toBeTruthy();
    expect(eyebrow!.textContent).toBe('Status');

    // aria-live="polite" should be present even if not busy
    const empty = container.querySelector('[data-empty]');
    expect(empty!.getAttribute('aria-live')).toBe('polite');
    expect(empty!.getAttribute('role')).toBeNull();
  });

  it('renders busy state for tile ornament', () => {
    const { container } = render(
      <HeroPanel title="Status" ornament="tile" busy={true} />
    );
    const dot = container.querySelector('[data-dot]');
    expect(dot!.hasAttribute('data-live')).toBe(true);
    
    const empty = container.querySelector('[data-empty]');
    expect(empty!.getAttribute('role')).toBe('status');
  });

  it('renders none ornament', () => {
    const { container } = render(
      <HeroPanel title="No Ornament" ornament="none" />
    );
    expect(container.querySelector('[data-mark]')).toBeNull();
    expect(container.querySelector('[data-tile]')).toBeNull();
    
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1!.textContent).toBe('No Ornament');
  });

  it('renders chip groups correctly with stagger', () => {
    const onSelect = vi.fn();
    const { container, getByText } = render(
      <HeroPanel 
        title="Launcher"
        groups={[
          {
            id: 'g1',
            label: 'Group 1',
            stagger: true,
            chips: [
              { id: 'c1', label: 'Chip 1', prefix: '# ', onSelect },
              { id: 'c2', label: 'Chip 2', tag: 'Solid', onSelect }
            ]
          },
          {
            id: 'g2',
            label: 'Group 2',
            stagger: false,
            chips: [
              { id: 'c3', label: 'Chip 3', onSelect }
            ]
          }
        ]}
      />
    );

    const staggers = container.querySelectorAll('[data-stagger]');
    expect(staggers.length).toBe(2);
    expect(staggers[0]!.getAttribute('data-enter')).toBe('3');
    expect(staggers[1]!.getAttribute('data-enter')).toBeNull();

    const c1 = getByText('# Chip 1');
    expect(c1).toBeTruthy();
    fireEvent.click(c1);
    expect(onSelect).toHaveBeenCalledTimes(1);

    const c2 = getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'button' && content.includes('Chip 2');
    });
    expect(c2).toBeTruthy();
    const tag = c2.querySelector('[data-tag][data-solid]');
    expect(tag).toBeTruthy();
    expect(tag!.textContent).toBe('Solid');
  });

  it('renders actions', () => {
    const { getByText } = render(
      <HeroPanel title="Action Test" actions={<button>My Action</button>} />
    );
    expect(getByText('My Action')).toBeTruthy();
  });
});
