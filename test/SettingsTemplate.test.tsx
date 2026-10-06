import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsTemplate, demoSettings, type SettingsData } from '../src/templates/SettingsTemplate';

const emptyData: SettingsData = {
  workspace: '',
  trail: [],
  values: { name: '', email: '', timezone: '', notifications: {}, digestHours: null },
  timezones: [],
  notificationPrefs: [],
  security: [],
  billing: {
    plan: 'Free', price: '$0', renews: '', usageLabel: 'Tokens', usageValue: '0',
    quotaPct: 0, quotaLabel: 'Quota', seatsUsed: 0, seatsTotal: 0, features: [],
  },
};

const tab = (c: HTMLElement, name: string) =>
  Array.from(c.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(t => t.textContent === name)!;
const button = (c: HTMLElement, name: string) =>
  Array.from(c.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent === name)!;

describe('SettingsTemplate', () => {
  it('renders the landmarks, heading order and section tabs', () => {
    const { container } = render(<SettingsTemplate />);
    expect(container.querySelectorAll('main').length).toBe(1);
    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(container.querySelector('h1')!.textContent).toBe('Settings');
    expect(container.querySelector('nav[aria-label="Breadcrumb"]')).toBeTruthy();
    const tabs = Array.from(container.querySelectorAll('[role="tab"]')).map(t => t.textContent);
    expect(tabs).toEqual(['Profile', 'Notifications', 'Security', 'Billing']);
    expect(container.querySelector('h2')!.textContent).toBe('Profile');
    expect(container.querySelector<HTMLInputElement>('#settings-name')!.value).toBe('Ada Lovelace');
    expect(container.querySelector('select#settings-timezone')).toBeTruthy();
    expect(container.querySelector('[role="img"][data-size="lg"]')).toBeTruthy();
  });

  it('switches sections with local state', () => {
    const { container } = render(<SettingsTemplate />);
    fireEvent.click(tab(container, 'Notifications'));
    expect(container.querySelector('h2')!.textContent).toBe('Notifications');
    const sw = container.querySelector<HTMLButtonElement>('#settings-notify-runs')!;
    expect(sw.getAttribute('role')).toBe('switch');
    expect(container.querySelector('label[for="settings-notify-runs"]')).toBeTruthy();
    expect(container.querySelector('[role="spinbutton"]')).toBeTruthy();

    fireEvent.click(tab(container, 'Security'));
    expect(container.querySelector('dl')).toBeTruthy();
    expect(container.querySelector('button[aria-label="Copy Recovery id"]')).toBeTruthy();

    fireEvent.click(tab(container, 'Billing'));
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy();
    const trigger = button(container, 'Plan details');
    fireEvent.click(trigger);
    expect(container.querySelector('[role="dialog"]')!.textContent).toContain('SSO and audit log');
  });

  it('tracks unsaved edits, and Save / Cancel commit or revert them', () => {
    const onSave = vi.fn();
    const { container } = render(<SettingsTemplate onSave={onSave} initialSection="notifications" />);
    const save = button(container, 'Save changes');
    expect(save.disabled).toBe(true);

    const sw = container.querySelector<HTMLButtonElement>('#settings-notify-runs')!;
    fireEvent.click(sw);
    expect(sw.getAttribute('aria-checked')).toBe('true');
    expect(container.querySelector('[data-alert]')!.textContent).toContain('Unsaved changes');

    fireEvent.click(button(container, 'Cancel'));
    expect(container.querySelector<HTMLButtonElement>('#settings-notify-runs')!.getAttribute('aria-checked')).toBe('false');
    expect(container.querySelector('[data-alert]')).toBeNull();

    fireEvent.click(container.querySelector<HTMLButtonElement>('#settings-notify-runs')!);
    fireEvent.click(button(container, 'Save changes'));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0]![0].notifications.runs).toBe(true);
    expect(container.querySelector('[data-alert]')!.textContent).toContain('Saved.');
  });

  it('opens with pending edits and a busy Save when saving', () => {
    const { container } = render(<SettingsTemplate initialEdits={{ name: 'Ada King' }} saving />);
    expect(container.querySelector<HTMLInputElement>('#settings-name')!.value).toBe('Ada King');
    expect(container.querySelector('[data-button][aria-busy="true"]')).toBeTruthy();
  });

  it('renders with empty data', () => {
    const { container } = render(<SettingsTemplate data={emptyData} />);
    expect(container.querySelector('main')).toBeTruthy();
    fireEvent.click(tab(container, 'Notifications'));
    expect(container.textContent).toContain('No notification channels');
    fireEvent.click(tab(container, 'Security'));
    expect(container.textContent).toContain('No security details yet.');
    fireEvent.click(tab(container, 'Billing'));
    expect(container.querySelectorAll('[role="progressbar"]').length).toBe(2);
    expect(demoSettings.notificationPrefs.length).toBeGreaterThan(0);
  });
});
