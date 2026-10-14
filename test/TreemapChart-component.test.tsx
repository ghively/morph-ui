import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TreemapChart } from '../src/components/TreemapChart';

describe('TreemapChart', () => {
  it('lays out one cell per top-level node, covering the canvas', () => {
    const { container } = render(
      <TreemapChart
        data={[
          { label: 'A', value: 60 },
          { label: 'B', value: 40 },
        ]}
      />,
    );
    const roots = [...container.querySelectorAll('[data-treemapcell][data-depth="0"]')];
    expect(roots.length).toBe(2);
    // Squarified cells tile the canvas up to the 1px gutter between tiles.
    const rect = (el: Element) => {
      const r = el.querySelector('rect')!;
      return {
        x: Number(r.getAttribute('x')),
        y: Number(r.getAttribute('y')),
        w: Number(r.getAttribute('width')),
        h: Number(r.getAttribute('height')),
      };
    };
    const a = rect(roots[0]!);
    const b = rect(roots[1]!);
    const area = a.w * a.h + b.w * b.h;
    expect(area).toBeGreaterThan(560 * 240 * 0.98);
    // The two tiles are adjacent and share the full height (side-by-side split).
    expect(Math.abs(a.h - 240)).toBeLessThanOrEqual(2);
    expect(Math.abs(b.h - 240)).toBeLessThanOrEqual(2);
    expect(Math.abs(a.x + a.w - b.x)).toBeLessThanOrEqual(2);
  });

  it('recurses into children as depth-1 cells', () => {
    const { container } = render(
      <TreemapChart
        data={[
          {
            label: 'parent',
            value: 100,
            children: [
              { label: 'x', value: 70 },
              { label: 'y', value: 30 },
            ],
          },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-treemapcell][data-depth="1"]').length).toBe(2);
  });

  it('prints shares in the accessible summary', () => {
    render(
      <TreemapChart
        data={[
          { label: 'A', value: 3 },
          { label: 'B', value: 1 },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: /A: 3 \(75%\), B: 1 \(25%\)/ })).toBeTruthy();
  });

  it('renders empty state when values sum to zero', () => {
    const { container } = render(<TreemapChart data={[{ label: 'A', value: 0 }]} />);
    expect(container.querySelector('[data-treemapempty]')).toBeTruthy();
  });
});
