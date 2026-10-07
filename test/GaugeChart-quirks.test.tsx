import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GaugeChart } from '../src/components/GaugeChart';

const ZONES = [{ upTo: 25, tone: 'danger' as const }, { upTo: 100, tone: 'success' as const }];

describe('GaugeChart empty value', () => {
  it('draws no value arc (and so no round end-dot) at value 0, even with zones', () => {
    const { container } = render(<GaugeChart label="Budget" value={0} zones={ZONES} />);
    expect(container.querySelector('[data-gaugevalue]')).toBeNull();
    expect(container.querySelectorAll('path')).toHaveLength(1);
    expect(container.querySelector('[data-gaugetrack]')).toBeTruthy();
    expect(container.querySelector('figcaption')?.textContent).toBe('Budget: 0 of 100');
  });

  it('draws no value arc for negative values', () => {
    const { container } = render(<GaugeChart value={-12} />);
    expect(container.querySelector('[data-gaugevalue]')).toBeNull();
  });

  it('draws the value arc for any positive value', () => {
    const { container } = render(<GaugeChart value={1} zones={ZONES} />);
    const arc = container.querySelector('[data-gaugevalue]');
    expect(arc).toBeTruthy();
    expect(arc?.getAttribute('stroke')).toBe('var(--morph-danger)');
  });
});
