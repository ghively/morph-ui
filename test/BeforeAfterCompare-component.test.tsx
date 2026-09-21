import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BeforeAfterCompare } from '../src/components/BeforeAfterCompare';

describe('BeforeAfterCompare', () => {
  it('renders both images and handle', () => {
    const { getByAltText, getByRole } = render(
      <BeforeAfterCompare beforeImage="b.jpg" afterImage="a.jpg" />
    );
    
    expect(getByAltText('Before')).toBeTruthy();
    expect(getByAltText('After')).toBeTruthy();
    expect(getByRole('slider')).toBeTruthy();
  });

  it('renders labels if provided', () => {
    const { getByText } = render(
      <BeforeAfterCompare beforeImage="b.jpg" afterImage="a.jpg" beforeLabel="Old" afterLabel="New" />
    );
    
    expect(getByText('Old')).toBeTruthy();
    expect(getByText('New')).toBeTruthy();
  });

  it('updates position on arrow keys', () => {
    const { getByRole } = render(
      <BeforeAfterCompare beforeImage="b.jpg" afterImage="a.jpg" initialPosition={0.5} />
    );
    
    const slider = getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('50');

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider.getAttribute('aria-valuenow')).toBe('45');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
  });

  // Note: Drag testing in jsdom is complex and usually requires mocking getBoundingClientRect
  // We tested keyboard interaction which relies on the same state update.
});
