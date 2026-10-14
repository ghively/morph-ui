import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AreaChart } from '../src/components/AreaChart';

describe('AreaChart', () => {
  it('renders an accessible summary of every series', () => {
    render(
      <AreaChart
        label="Cost"
        series={[
          { label: 'Compute', values: [1, 2, 3] },
          { label: 'Storage', values: [2, 1, 2] },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: /Cost/i })).toBeTruthy();
    expect(screen.getByText(/Compute: #1 1, #2 2, #3 3/)).toBeTruthy();
    expect(screen.getByText(/Storage: #1 2, #2 1, #3 2/)).toBeTruthy();
  });

  it('draws one band per series and a legend row per series', () => {
    const { container } = render(
      <AreaChart
        series={[
          { label: 'A', values: [4, 5] },
          { label: 'B', values: [1, 2] },
          { label: 'C', values: [0, 3] },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-areaband]').length).toBe(3);
    expect(container.querySelectorAll('[data-arealegend] li').length).toBe(3);
  });

  it('shows an empty state without bands', () => {
    const { container } = render(<AreaChart series={[]} />);
    expect(container.querySelector('[data-areaempty]')).toBeTruthy();
    expect(container.querySelectorAll('[data-areaband]').length).toBe(0);
  });
});
