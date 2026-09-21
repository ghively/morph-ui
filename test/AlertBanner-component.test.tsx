import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertBanner } from '../src/components/AlertBanner';

describe('AlertBanner', () => {
  it('renders default info tone correctly', () => {
    const { container } = render(
      <AlertBanner lead="Info" />
    );
    const alert = container.querySelector('[data-alert]');
    expect(alert).toBeTruthy();
    expect(alert!.getAttribute('data-tone')).toBeNull();
    expect(alert!.getAttribute('role')).toBe('status');
    expect(alert!.getAttribute('aria-live')).toBe('polite');
  });

  it('renders tone="danger" correctly', () => {
    const { container } = render(
      <AlertBanner tone="danger" lead="Danger" />
    );
    const alert = container.querySelector('[data-alert]');
    expect(alert!.getAttribute('data-tone')).toBe('danger');
  });

  it('renders lead and children with space', () => {
    const { container } = render(
      <AlertBanner lead="Lead text">Child text</AlertBanner>
    );
    const bodyDiv = container.querySelector('[data-alert] > div');
    const strong = bodyDiv!.querySelector('strong');
    expect(strong).toBeTruthy();
    expect(strong!.textContent).toBe('Lead text');
    expect(bodyDiv!.textContent).toBe('Lead text Child text');
  });

  it('renders without lead', () => {
    const { container } = render(
      <AlertBanner>Only child text</AlertBanner>
    );
    const bodyDiv = container.querySelector('[data-alert] > div');
    expect(bodyDiv!.querySelector('strong')).toBeNull();
    expect(bodyDiv!.textContent).toBe('Only child text');
  });

  it('renders live dot based on flags', () => {
    const { container, rerender } = render(
      <AlertBanner live={true} />
    );
    
    let dot = container.querySelector('[data-dot]');
    expect(dot).toBeTruthy();
    expect(dot!.hasAttribute('data-live')).toBe(true);
    
    rerender(<AlertBanner live={false} />);
    dot = container.querySelector('[data-dot]');
    expect(dot!.hasAttribute('data-live')).toBe(false);
    
    rerender(<AlertBanner dot={false} />);
    expect(container.querySelector('[data-dot]')).toBeNull();
  });

  it('supports custom role and aria-live', () => {
    const { container } = render(
      <AlertBanner role="alert" />
    );
    const alert = container.querySelector('[data-alert]');
    expect(alert!.getAttribute('role')).toBe('alert');
    expect(alert!.getAttribute('aria-live')).toBeNull();
  });

  it('supports meta and action', () => {
    const { container } = render(
      <AlertBanner meta="10:00 AM" action={<button>Retry</button>} />
    );
    const meta = container.querySelector('[data-num][data-meta]');
    expect(meta).toBeTruthy();
    expect(meta!.textContent).toBe('10:00 AM');
    
    const action = container.querySelector('button');
    expect(action).toBeTruthy();
    expect(action!.textContent).toBe('Retry');
  });

  it('supports animateIn', () => {
    const { container } = render(
      <AlertBanner animateIn />
    );
    const alert = container.querySelector('[data-alert]');
    expect(alert!.hasAttribute('data-enter')).toBe(true);
  });
});
