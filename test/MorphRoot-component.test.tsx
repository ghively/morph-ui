import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MorphRoot } from '../src/components/MorphRoot';

describe('MorphRoot', () => {
  it('applies the frame class and attribute', () => {
    render(<MorphRoot data-testid="root">hello</MorphRoot>);
    const el = screen.getByTestId('root');
    expect(el.classList.contains('morph-frame')).toBe(true);
    expect(el.hasAttribute('data-morph-frame')).toBe(true);
    expect(el.textContent).toBe('hello');
  });

  it('keeps host classes and marks fill', () => {
    render(<MorphRoot data-testid="root" className="app" fill />);
    const el = screen.getByTestId('root');
    expect(el.className).toBe('morph-frame app');
    expect(el.hasAttribute('data-fill')).toBe(true);
  });

  it('uses lively sage by default', () => {
    render(<MorphRoot data-testid="root">hello</MorphRoot>);
    expect(screen.getByTestId('root').getAttribute('data-theme')).toBe('lively-sage');
  });

  it('supports switching built-in theme names on the root frame', () => {
    render(<MorphRoot data-testid="root" theme="jade-citrus">hello</MorphRoot>);
    const el = screen.getByTestId('root');
    expect(el.getAttribute('data-theme')).toBe('jade-citrus');
  });

  it('supports the terminal theme name on the root frame', () => {
    render(<MorphRoot data-testid="root" theme="genehively-terminal">hello</MorphRoot>);
    expect(screen.getByTestId('root').getAttribute('data-theme')).toBe('genehively-terminal');
  });

  it('applies token overrides and padding inline', () => {
    render(<MorphRoot data-testid="root" padding={16} tokens={{ '--app-blue': '#9b7bff' }} />);
    const el = screen.getByTestId('root');
    expect(el.style.getPropertyValue('--app-blue')).toBe('#9b7bff');
    expect(el.style.padding).toBe('16px');
  });
});
