import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricSparkline } from '../src/components/MetricSparkline';

describe('MetricSparkline', () => {
  it('renders correctly with multiple points', () => {
    const { container } = render(<MetricSparkline label="Test Label" value="123" series={[10, 20, 30]} />);
    const sparkline = container.querySelector('.metric-sparkline');
    expect(sparkline?.getAttribute('aria-label')).toBe('Test Label: 123');
    expect(container.querySelector('.metric-sparkline-path')?.getAttribute('d')).toContain('M');
  });

  it('renders correctly with 0 points', () => {
    const { container } = render(<MetricSparkline label="Empty" value="0" series={[]} />);
    expect(container.querySelector('.metric-sparkline-path')).toBeFalsy();
  });

  it('renders a flat line for 1 point', () => {
    const { container } = render(<MetricSparkline label="Single" value="1" series={[100]} />);
    const d = container.querySelector('.metric-sparkline-path')?.getAttribute('d') || '';
    const ys = [...d.matchAll(/[ML] [\d.]+ ([\d.]+)/g)].map(m => m[1]);
    expect(ys.length).toBe(2);
    expect(ys[0]).toBe(ys[1]);
  });

  it('applies trend classes correctly', () => {
    const cls = (series: number[]) => render(<MetricSparkline label="x" value="x" series={series} />).container.querySelector('.metric-sparkline')!.classList;
    expect(cls([10, 20]).contains('trend-up')).toBe(true);
    expect(cls([20, 10]).contains('trend-down')).toBe(true);
    expect(cls([20, 20]).contains('trend-neutral')).toBe(true);
  });

  it('computes the delta and flips good/bad with invert', () => {
    const { container, getByText } = render(<MetricSparkline label="Latency" value="42 ms" series={[100, 50]} invert />);
    expect(getByText('−50%')).toBeTruthy();
    expect(container.querySelector('.metric-sparkline')!.classList.contains('is-good')).toBe(true);
  });

  it('shows the period caption', () => {
    const { getByText } = render(<MetricSparkline label="RPS" value="1" series={[1, 2]} period="24h" />);
    expect(getByText('24h')).toBeTruthy();
  });

  it('scrubs to a point value on hover', () => {
    const { container, getByText } = render(<MetricSparkline label="RPS" value="now" series={[5, 7, 9]} />);
    const chart = container.querySelector('.metric-sparkline-chart')!;
    chart.getBoundingClientRect = () => ({ left: 0, width: 100, top: 0, height: 32, right: 100, bottom: 32, x: 0, y: 0, toJSON() {} });
    fireEvent.mouseMove(chart, { clientX: 0 });
    expect(getByText('5')).toBeTruthy();
  });
});
