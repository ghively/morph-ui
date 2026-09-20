import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricSparkline } from '../src/components/MetricSparkline';

describe('MetricSparkline', () => {
  it('renders correctly with multiple points', () => {
    const { container } = render(
      <MetricSparkline label="Test Label" value="123" series={[10, 20, 30]} />
    );
    const sparkline = container.querySelector('.metric-sparkline');
    expect(sparkline).toBeTruthy();
    expect(sparkline?.getAttribute('aria-label')).toBe('Test Label: 123');
    
    const path = container.querySelector('.metric-sparkline-path');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('d')).toContain('M');
  });

  it('renders correctly with 0 points', () => {
    const { container } = render(
      <MetricSparkline label="Empty" value="0" series={[]} />
    );
    const path = container.querySelector('.metric-sparkline-path');
    expect(path).toBeFalsy();
  });

  it('renders correctly with 1 point', () => {
    const { container } = render(
      <MetricSparkline label="Single" value="1" series={[100]} />
    );
    const path = container.querySelector('.metric-sparkline-path');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('d')).toBe('M 0 10 L 100 10');
  });

  it('applies trend classes correctly', () => {
    const { container: upContainer } = render(
      <MetricSparkline label="Up" value="up" series={[10, 20]} />
    );
    expect(upContainer.querySelector('.metric-sparkline')?.classList.contains('trend-up')).toBe(true);

    const { container: downContainer } = render(
      <MetricSparkline label="Down" value="down" series={[20, 10]} />
    );
    expect(downContainer.querySelector('.metric-sparkline')?.classList.contains('trend-down')).toBe(true);

    const { container: neutralContainer } = render(
      <MetricSparkline label="Neutral" value="neutral" series={[20, 20]} />
    );
    expect(neutralContainer.querySelector('.metric-sparkline')?.classList.contains('trend-neutral')).toBe(true);
  });
});
