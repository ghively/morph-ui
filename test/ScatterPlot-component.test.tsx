import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScatterPlot } from '../src/components/ScatterPlot';

describe('ScatterPlot', () => {
  it('renders one bubble per point with a text summary', () => {
    const { container } = render(
      <ScatterPlot
        points={[
          { label: 'mini', x: 1, y: 9 },
          { label: 'pro', x: 9, y: 1 },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-scatterdot]').length).toBe(2);
    expect(screen.getByRole('img', { name: /mini \(1, 9\), pro \(9, 1\)/ })).toBeTruthy();
  });

  it('draws quadrant crosshairs and labels', () => {
    const { container } = render(
      <ScatterPlot
        quadrantLabels={['a', 'b', 'c', 'd']}
        points={[{ label: 'solo', x: 4, y: 4 }]}
      />,
    );
    expect(container.querySelectorAll('[data-scatteraxis]').length).toBe(2);
    expect(container.querySelectorAll('[data-scatterquad]').length).toBe(4);
  });

  it('renders empty state for no points', () => {
    const { container } = render(<ScatterPlot points={[]} />);
    expect(container.querySelector('[data-scatterempty]')).toBeTruthy();
  });
});
