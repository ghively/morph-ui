import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InitialsAvatar } from '../src/components/InitialsAvatar';

describe('InitialsAvatar', () => {
  it('renders initials text for "Ada Lovelace"', () => {
    const { container } = render(<InitialsAvatar name="Ada Lovelace" />);
    expect(container.textContent).toBe('AL');
  });

  it('agent toggles data-avatar attribute', () => {
    const { container, rerender } = render(<InitialsAvatar name="Ada" agent={true} />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('data-avatar')).toBe('');
    
    rerender(<InitialsAvatar name="Ada" agent={false} />);
    expect(el.getAttribute('data-avatar')).toBe('user');
    
    rerender(<InitialsAvatar name="Ada" />);
    expect(el.getAttribute('data-avatar')).toBe('user');
  });

  it('working sets data-ring attribute', () => {
    const { container, rerender } = render(<InitialsAvatar name="Ada" />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('data-ring')).toBeNull();

    rerender(<InitialsAvatar name="Ada" working={true} />);
    expect(el.getAttribute('data-ring')).toBe('');
  });

  it('size sets data-size attribute', () => {
    const { container, rerender } = render(<InitialsAvatar name="Ada" />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('data-size')).toBeNull();

    rerender(<InitialsAvatar name="Ada" size="lg" />);
    expect(el.getAttribute('data-size')).toBe('lg');

    rerender(<InitialsAvatar name="Ada" size="sm" />);
    expect(el.getAttribute('data-size')).toBe('sm');
  });

  it('sets styles correctly when src is provided', () => {
    const { container } = render(<InitialsAvatar name="Ada Lovelace" src="https://example.com/avatar.png" />);
    const el = container.firstChild as HTMLElement;
    // JSDOM normalize URLs in inline styles by wrapping them in quotes sometimes, test against truthy presence
    expect(el.style.backgroundImage).toContain('url(');
    expect(el.style.backgroundImage).toContain('https://example.com/avatar.png');
    expect(el.style.color).toBe('transparent');
    expect(el.textContent).toBe('AL');
  });

  it('does not set inline style block when src is absent or null', () => {
    const { container } = render(<InitialsAvatar name="Ada" src={null} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundImage).toBe('');
    expect(el.getAttribute('style')).toBeNull();
  });

  it('root has aria-hidden=true', () => {
    const { container } = render(<InitialsAvatar name="Ada" />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
