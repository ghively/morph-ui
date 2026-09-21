import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlyphIcon, glyphs } from '../src/components/GlyphIcon';
import type { GlyphName } from '../src/components/GlyphIcon';

describe('GlyphIcon', () => {
  it('renders an <svg> with width="16" height="16" and viewBox="0 0 16 16" for search', () => {
    const { container } = render(<GlyphIcon name="search" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('width')).toBe('16');
    expect(svg!.getAttribute('height')).toBe('16');
    expect(svg!.getAttribute('viewBox')).toBe('0 0 16 16');
  });

  it('honors per-glyph default sizes', () => {
    let { container } = render(<GlyphIcon name="close" />);
    expect(container.querySelector('svg')!.getAttribute('width')).toBe('14');
    
    container = render(<GlyphIcon name="trash" />).container;
    expect(container.querySelector('svg')!.getAttribute('width')).toBe('12');
  });

  it('explicit size overrides the default', () => {
    const { container } = render(<GlyphIcon name="close" size={20} />);
    const svg = container.querySelector('svg');
    expect(svg!.getAttribute('width')).toBe('20');
    expect(svg!.getAttribute('height')).toBe('20');
  });

  it('every GlyphName renders without throwing', () => {
    const allNames = Object.keys(glyphs) as GlyphName[];
    allNames.forEach(name => {
      const { container } = render(<GlyphIcon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });

  it('has stroke="currentColor" and aria-hidden="true" on every glyph', () => {
    const { container } = render(<GlyphIcon name="plus" />);
    const svg = container.querySelector('svg');
    expect(svg!.getAttribute('stroke')).toBe('currentColor');
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });

  it('glyphs.plus() returns an element with stroke-width="1.9"', () => {
    const plusElement = glyphs.plus();
    expect((plusElement as unknown as { props: { strokeWidth: number } }).props.strokeWidth).toBe(1.9);
  });
});
