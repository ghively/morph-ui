import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { ScrubRevealMedia } from '../src/components/ScrubRevealMedia';

const originalImage = globalThis.Image;

beforeAll(() => {
  globalThis.Image = class {
    src = '';
    onload: (() => void) | null = null;
    width = 100;
    height = 100;
    constructor() {
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  } as unknown as typeof Image;
});

afterAll(() => {
  globalThis.Image = originalImage;
});

describe('ScrubRevealMedia', () => {
  it('renders correctly and handles drag', async () => {
    render(<ScrubRevealMedia beforeImage="before.jpg" afterImage="after.jpg" />);
    
    // Wait for images to load
    await new Promise(r => setTimeout(r, 20));
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeTruthy();
    expect(slider.getAttribute('aria-valuenow')).toBe('50'); // Initial progress 0.5
    
    // Mock getBoundingClientRect
    slider.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      width: 500,
      height: 400,
    });

    fireEvent.mouseDown(slider);
    fireEvent.mouseMove(slider, { clientX: 375 }); // 375 / 500 = 0.75
    
    expect(slider.getAttribute('aria-valuenow')).toBe('75');
    
    fireEvent.mouseUp(slider);
  });
});
