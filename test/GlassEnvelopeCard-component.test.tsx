import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassEnvelopeCard } from '../src/components/GlassEnvelopeCard';

describe('GlassEnvelopeCard', () => {
  const cards = [
    <span>Photo 1</span>,
    <span>Photo 2</span>,
    <span>Photo 3</span>
  ];

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <GlassEnvelopeCard envelopeContent={<span>Title</span>} cards={cards} />
    );
    expect(getByTestId('glass-envelope-card')).toBeTruthy();
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Photo 1')).toBeTruthy();
  });

  it('handles hover state', () => {
    const { getByTestId } = render(
      <GlassEnvelopeCard envelopeContent={<span>Title</span>} cards={cards} />
    );
    const envelope = getByTestId('glass-envelope-card');
    
    fireEvent.mouseEnter(envelope);
    expect(envelope.classList.contains('is-hovered')).toBe(true);

    fireEvent.mouseLeave(envelope);
    expect(envelope.classList.contains('is-hovered')).toBe(false);
  });

  it('opens on click and overrides hover', () => {
    const { getByTestId } = render(
      <GlassEnvelopeCard envelopeContent={<span>Title</span>} cards={cards} />
    );
    const envelope = getByTestId('glass-envelope-card');
    
    fireEvent.mouseEnter(envelope);
    fireEvent.click(envelope);
    
    expect(envelope.classList.contains('is-open')).toBe(true);
    expect(envelope.classList.contains('is-hovered')).toBe(false);
  });

  it('opens on enter key', () => {
    const { getByTestId } = render(
      <GlassEnvelopeCard envelopeContent={<span>Title</span>} cards={cards} />
    );
    const envelope = getByTestId('glass-envelope-card');
    
    fireEvent.keyDown(envelope, { key: 'Enter' });
    expect(envelope.classList.contains('is-open')).toBe(true);
  });
});
