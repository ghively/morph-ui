import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContextMeter } from '../src/components/ContextMeter';

describe('ContextMeter', () => {
  it('renders label and humanized readout', () => {
    render(<ContextMeter used={12400} total={128000} />);
    
    expect(screen.getByText('Context window')).toBeTruthy();
    expect(screen.getByText('12.4k / 128k')).toBeTruthy();
  });

  it('determines data-level ok correctly (<80%)', () => {
    const { container } = render(<ContextMeter used={50} total={100} />);
    const meter = container.querySelector('[data-context-meter]');
    expect(meter?.getAttribute('data-level')).toBe('ok');
    
    const fill = container.querySelector('[data-context-meter-fill]') as HTMLElement;
    expect(fill?.style.width).toBe('50%');
  });

  it('determines data-level warn correctly (80% to 94%)', () => {
    const { container } = render(<ContextMeter used={85} total={100} />);
    const meter = container.querySelector('[data-context-meter]');
    expect(meter?.getAttribute('data-level')).toBe('warn');
  });

  it('determines data-level danger correctly (>=95%)', () => {
    const { container } = render(<ContextMeter used={98} total={100} />);
    const meter = container.querySelector('[data-context-meter]');
    expect(meter?.getAttribute('data-level')).toBe('danger');
  });

  it('mixes the percentage ink toward --app-text so it holds contrast on lighter panels', async () => {
    const { readFileSync } = await import('node:fs');
    const css = readFileSync('src/components/ContextMeter.css', 'utf8');
    const rule = css.match(/\.context-meter-pct\s*{([^}]+)}/)![1]!;
    expect(rule).toMatch(/color:\s*color-mix\(in srgb, var\(--c\) \d+%, var\(--app-text\)\)/);
  });
});
