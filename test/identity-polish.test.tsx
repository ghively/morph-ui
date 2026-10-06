import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InitialsAvatar } from '../src/components/InitialsAvatar';
import { AvatarStack } from '../src/components/AvatarStack';
import { ToggleSwitch } from '../src/components/ToggleSwitch';
import { FormField } from '../src/components/FormField';
import { GlyphIcon } from '../src/components/GlyphIcon';
import { initials, identityHue } from '../src/components/agentOps.shared';
import { initials as mediaInitials } from '../src/components/mediaLibrary.shared';

describe('identity helpers', () => {
  it('one initials() everywhere, including non-Latin names', () => {
    expect(mediaInitials).toBe(initials);
    expect(initials('Émile Zola')).toBe('ÉZ');
    expect(initials('李 小龙')).toBe('李小');
  });

  it('identityHue is stable and in 1–6', () => {
    const names = ['Ada Lovelace', 'Grace Hopper', 'Priya Nair', 'Tom Becker', 'June Park', 'Sam Okafor', ''];
    for (const n of names) {
      const h = identityHue(n);
      expect(h).toBeGreaterThanOrEqual(1);
      expect(h).toBeLessThanOrEqual(6);
      expect(identityHue(n)).toBe(h);
    }
    expect(new Set(names.map(identityHue)).size).toBeGreaterThan(1);
  });
});

describe('InitialsAvatar identity', () => {
  it('keeps initials for accented names (was stripped to "Z")', () => {
    const { container } = render(<InitialsAvatar name="Émile Zola" />);
    expect(container.textContent).toBe('ÉZ');
  });

  it('people get a data-hue keyed by name or colorKey; agents do not', () => {
    const { container, rerender } = render(<InitialsAvatar name="Ada Lovelace" />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('data-hue')).toBe(String(identityHue('Ada Lovelace')));
    rerender(<InitialsAvatar name="Ada Lovelace" colorKey="@ada:example.org" />);
    expect(el.getAttribute('data-hue')).toBe(String(identityHue('@ada:example.org')));
    rerender(<InitialsAvatar name="Atlas" agent />);
    expect(el.hasAttribute('data-hue')).toBe(false);
  });

  it('is decorative by default and an image when labelled', () => {
    const { container, rerender } = render(<InitialsAvatar name="Ada Lovelace" />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    rerender(<InitialsAvatar name="Ada Lovelace" label="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBe(el);
    expect(el.hasAttribute('aria-hidden')).toBe(false);
  });

  it('scopes its styles with a class and keeps the host className', () => {
    const { container } = render(<InitialsAvatar name="Ada" className="initials-avatar" />);
    const el = container.firstChild as HTMLElement;
    expect(el.classList.contains('morph-avatar')).toBe(true);
    expect(el.classList.contains('initials-avatar')).toBe(true);
  });

  it('quotes the image URL so parentheses and quotes cannot break out', () => {
    const src = 'https://example.com/a(1)".png';
    const { container } = render(<InitialsAvatar name="Ada" src={src} />);
    expect((container.firstChild as HTMLElement).style.backgroundImage).toBe(`url(${JSON.stringify(src)})`);
  });
});

describe('AvatarStack identity', () => {
  it('matches InitialsAvatar hue and initials for the same person', () => {
    const { container } = render(<AvatarStack people={[{ name: 'Émile Zola' }, { name: 'Atlas', agent: true }]} />);
    const [person, agent] = Array.from(container.querySelectorAll('[data-stackavatar]'));
    expect(person!.textContent).toBe('ÉZ');
    expect(person!.getAttribute('data-hue')).toBe(String(identityHue('Émile Zola')));
    expect(agent!.hasAttribute('data-hue')).toBe(false);
  });
});

describe('ToggleSwitch polish', () => {
  it('can be targeted by a FormField label via id', () => {
    const onChange = vi.fn();
    render(
      <FormField id="sw" label="Notifications" hint="Mentions only">
        <ToggleSwitch id="sw" on={false} onChange={onChange} label="Notifications" aria-describedby="sw-hint" />
      </FormField>,
    );
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    expect(sw.id).toBe('sw');
    expect(sw.getAttribute('aria-describedby')).toBe('sw-hint');
    fireEvent.click(screen.getByText('Notifications', { selector: 'label' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('GlyphIcon polish', () => {
  it('is decorative by default', () => {
    const { container } = render(<GlyphIcon name="search" />);
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('label makes it a named image with a <title>', () => {
    const { container } = render(<GlyphIcon name="search" label="Search" className="x" />);
    const svg = screen.getByRole('img', { name: 'Search' });
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
    expect(svg.getAttribute('class')).toBe('x');
    expect(svg.querySelector('title')!.textContent).toBe('Search');
    expect(container.querySelectorAll('path').length).toBe(2);
  });

  it('thread glyph stays inside its 16-unit viewBox', () => {
    const { container } = render(<GlyphIcon name="thread" />);
    const d = container.querySelector('path')!.getAttribute('d')!;
    // The arrowhead ends at y = 9 + 3 + 3; it used to reach y = 17 and clip.
    expect(d).toBe('M4 1v10a1 1 0 001 1h9M11 9l3 3-3 3');
  });
});
