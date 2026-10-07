import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Link } from '../src/components/Link';

describe('Link', () => {
  it('renders an anchor when href is given', () => {
    render(<Link href="#docs">Docs</Link>);
    const a = screen.getByRole('link', { name: 'Docs' });
    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('#docs');
    expect(a.hasAttribute('data-link')).toBe(true);
    expect(a.getAttribute('data-tone')).toBe('accent');
    expect(a.getAttribute('target')).toBeNull();
    expect(a.getAttribute('rel')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders a type="button" button when href is omitted', () => {
    render(<Link tone="muted" className="extra">Resend</Link>);
    const b = screen.getByRole('button', { name: 'Resend' });
    expect(b.tagName).toBe('BUTTON');
    expect(b.getAttribute('type')).toBe('button');
    expect(b.getAttribute('data-tone')).toBe('muted');
    expect(b.className).toBe('morph-link extra');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('external adds target, rel and visually-hidden new-tab text', () => {
    const { container } = render(<Link href="https://example.com" external>Status</Link>);
    const a = screen.getByRole('link', { name: /^Status\s*\(opens in new tab\)$/ });
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    expect(a.hasAttribute('data-external')).toBe(true);
    expect(container.querySelector('[data-linksr]')!.textContent!.trim()).toBe('(opens in new tab)');
    expect(container.querySelector('[data-linkicon]')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('disabled button form blocks clicks', () => {
    const onClick = vi.fn();
    render(<Link disabled onClick={onClick}>Resend</Link>);
    const b = screen.getByRole('button', { name: 'Resend' }) as HTMLButtonElement;
    expect(b.disabled).toBe(true);
    fireEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls onClick for both forms and passes aria attributes through', () => {
    const onClick = vi.fn();
    render(
      <>
        <Link onClick={onClick} aria-describedby="hint">Resend</Link>
        <Link href="#x" onClick={onClick} aria-current="page">Here</Link>
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Resend' }));
    fireEvent.click(screen.getByRole('link', { name: 'Here' }));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toBe('hint');
    expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page');
  });
});
