import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextScribble } from '../src/components/TextScribble';

describe('TextScribble', () => {
  it('renders children and svg path', () => {
    render(<TextScribble type="underline">Important</TextScribble>);
    
    expect(screen.getByText('Important')).toBeTruthy();
    
    const svg = document.querySelector('.text-scribble-svg');
    expect(svg).toBeTruthy();
    
    const path = document.querySelector('.text-scribble-path');
    expect(path).toBeTruthy();
    
    // Default underline check (starts with M 5 90)
    expect(path?.getAttribute('d')).toContain('M 5 90');
  });

  it('renders strike type correctly', () => {
    render(<TextScribble type="strike">Deleted</TextScribble>);
    const path = document.querySelector('.text-scribble-path');
    expect(path?.getAttribute('d')).toContain('M 5 50');
  });

  it('renders circle type correctly', () => {
    render(<TextScribble type="circle">Focus</TextScribble>);
    const path = document.querySelector('.text-scribble-path');
    expect(path?.getAttribute('d')).toContain('M 150 10');
  });

  it('applies custom duration and color', () => {
    const { container } = render(
      <TextScribble duration="2s" delay="1s" color="red" className="my-scribble">
        Test
      </TextScribble>
    );
    
    const root = container.querySelector('[data-text-scribble]') as HTMLElement;
    expect(root.className).toContain('my-scribble');
    expect(root.style.getPropertyValue('--scribble-duration')).toBe('2s');
    expect(root.style.getPropertyValue('--scribble-delay')).toBe('1s');
    expect(root.style.getPropertyValue('--scribble-color')).toBe('red');
  });
});
