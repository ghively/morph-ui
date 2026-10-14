import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CandlestickChart } from '../src/components/CandlestickChart';

describe('CandlestickChart', () => {
  it('marks rising candles up and falling candles down', () => {
    const { container } = render(
      <CandlestickChart
        candles={[
          { label: 'Mon', open: 10, high: 12, low: 9, close: 11 },
          { label: 'Tue', open: 11, high: 12, low: 8, close: 9 },
        ]}
      />,
    );
    const candles = container.querySelectorAll('[data-candle]');
    expect(candles.length).toBe(2);
    expect(candles[0]!.getAttribute('data-dir')).toBe('up');
    expect(candles[1]!.getAttribute('data-dir')).toBe('down');
  });

  it('exposes OHLC as text in the summary', () => {
    render(
      <CandlestickChart
        label="Price"
        candles={[{ label: 'Mon', open: 10, high: 12, low: 9, close: 11 }]}
      />,
    );
    expect(
      screen.getByRole('img', { name: /Mon: open 10, high 12, low 9, close 11/ }),
    ).toBeTruthy();
  });

  it('renders empty state for no candles', () => {
    const { container } = render(<CandlestickChart candles={[]} />);
    expect(container.querySelector('[data-candlesempty]')).toBeTruthy();
  });
});
