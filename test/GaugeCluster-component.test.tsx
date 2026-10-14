import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GaugeCluster } from '../src/components/GaugeCluster';

describe('GaugeCluster', () => {
  it('renders one ring arc per gauge with the value in text', () => {
    const { container } = render(
      <GaugeCluster
        gauges={[
          { label: 'CPU', value: 62 },
          { label: 'Disk', value: 94, tone: 'danger' },
        ]}
      />,
    );
    const rings = container.querySelectorAll('[data-gclusterring]');
    expect(rings.length).toBe(2);
    expect(rings[0]!.getAttribute('data-tone')).toBe('accent');
    expect(rings[1]!.getAttribute('data-tone')).toBe('danger');
    expect(screen.getAllByText('62%').length).toBeGreaterThan(0);
  });

  it('clamps out-of-range values', () => {
    render(<GaugeCluster gauges={[{ label: 'Over', value: 140 }]} />);
    expect(screen.getAllByText('100%').length).toBeGreaterThan(0);
  });

  it('renders empty state without gauges', () => {
    const { container } = render(<GaugeCluster gauges={[]} />);
    expect(container.querySelector('[data-gclusterempty]')).toBeTruthy();
    expect(container.querySelector('[data-gclusternone]')).toBeTruthy();
  });
});
