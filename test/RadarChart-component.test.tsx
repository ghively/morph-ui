import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RadarChart } from '../src/components/RadarChart';

const AXES = ['Speed', 'Cost', 'Quality', 'Context'];

describe('RadarChart', () => {
  it('draws one polygon per series over shared axes', () => {
    const { container } = render(
      <RadarChart
        axes={AXES}
        series={[
          { label: 'A', values: [1, 2, 3, 4] },
          { label: 'B', values: [4, 3, 2, 1] },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-radarshape]').length).toBe(2);
    // 4 rings + 4 spokes + 4 axis labels
    expect(container.querySelectorAll('[data-radarring]').length).toBe(4);
    expect(container.querySelectorAll('[data-radarspoke]').length).toBe(4);
    expect(container.querySelectorAll('[data-radaraxis]').length).toBe(4);
  });

  it('puts every series value in the legend as text', () => {
    render(
      <RadarChart
        axes={AXES}
        series={[{ label: 'Solo', values: [1, 2, 3, 4] }]}
      />,
    );
    expect(screen.getByText('1 · 2 · 3 · 4')).toBeTruthy();
    expect(screen.getByRole('img', { name: /Solo \(1, 2, 3, 4\)/ })).toBeTruthy();
  });

  it('requires at least three axes', () => {
    const { container } = render(
      <RadarChart axes={['A', 'B']} series={[{ label: 'S', values: [1, 2] }]} />,
    );
    expect(container.querySelector('[data-radarempty]')).toBeTruthy();
  });
});
