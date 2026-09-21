import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuroraGlowCard } from '../src/components/AuroraGlowCard';

describe('AuroraGlowCard', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <AuroraGlowCard>
        <div>Test Content</div>
      </AuroraGlowCard>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies active data attribute', () => {
    const { container: activeContainer } = render(
      <AuroraGlowCard active={true}>Content</AuroraGlowCard>
    );
    expect(activeContainer.querySelector('[data-aurora-glow-card]')?.getAttribute('data-active')).toBe('true');

    const { container: inactiveContainer } = render(
      <AuroraGlowCard active={false}>Content</AuroraGlowCard>
    );
    expect(inactiveContainer.querySelector('[data-aurora-glow-card]')?.getAttribute('data-active')).toBe('false');
  });

  it('applies intensity and custom colors via CSS custom properties', () => {
    const { container } = render(
      <AuroraGlowCard intensity={0.5} glowColor1="red" glowColor2="green" glowColor3="blue">
        Content
      </AuroraGlowCard>
    );
    
    const card = container.querySelector('[data-aurora-glow-card]') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.style.getPropertyValue('--aurora-intensity')).toBe('0.5');
    expect(card.style.getPropertyValue('--aurora-color-1')).toBe('red');
    expect(card.style.getPropertyValue('--aurora-color-2')).toBe('green');
    expect(card.style.getPropertyValue('--aurora-color-3')).toBe('blue');
  });
});
