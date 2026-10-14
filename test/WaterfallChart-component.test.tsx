import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WaterfallChart } from '../src/components/WaterfallChart';

describe('WaterfallChart', () => {
  it('marks increases, decreases and totals with data-dir', () => {
    const { container } = render(
      <WaterfallChart
        steps={[
          { label: 'Start', value: 100, kind: 'total' },
          { label: 'Add', value: 30 },
          { label: 'Cut', value: -10 },
          { label: 'End', value: 120, kind: 'total' },
        ]}
      />,
    );
    const dirs = [...container.querySelectorAll('[data-waterfallstep]')].map((el) =>
      el.getAttribute('data-dir'),
    );
    expect(dirs).toEqual(['total', 'up', 'down', 'total']);
  });

  it('prints signed deltas and running levels as text', () => {
    render(
      <WaterfallChart
        steps={[
          { label: 'Base', value: 10, kind: 'total' },
          { label: 'Plus', value: 5 },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: /Base: 10 \(total\); Plus: \+5 → 15/ })).toBeTruthy();
  });

  it('renders empty state without steps', () => {
    const { container } = render(<WaterfallChart steps={[]} />);
    expect(container.querySelector('[data-waterfalempty]')).toBeTruthy();
  });
});
