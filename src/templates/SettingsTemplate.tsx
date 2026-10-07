import { useEffect, useRef, useState, type ReactNode } from 'react';
import './SettingsTemplate.css';
import { Breadcrumbs, type Crumb } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { Tabs } from '../components/Tabs';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { TextField } from '../components/TextField';
import { Select, type SelectOption } from '../components/Select';
import { FormField } from '../components/FormField';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { NumberInput } from '../components/NumberInput';
import { KeyValueList, type KeyValueItem } from '../components/KeyValueList';
import { AlertBanner } from '../components/AlertBanner';
import { KpiCard } from '../components/KpiCard';
import { ProgressBar } from '../components/ProgressBar';
import { Popover } from '../components/Popover';
import type { ToneInput } from '../tone';

export type SettingsSection = 'profile' | 'notifications' | 'security' | 'billing';

/** The editable part of the settings screen; Save commits it, Cancel reverts it. */
export interface SettingsValues {
  name: string;
  email: string;
  timezone: string;
  /** Notification preference id → on/off. */
  notifications: Record<string, boolean>;
  /** Digest cadence in hours; `null` turns the digest off. */
  digestHours: number | null;
}

export interface SettingsNotificationPref {
  id: string;
  label: string;
  hint?: string;
}

export interface SettingsBilling {
  plan: string;
  price: string;
  renews: string;
  /** Headline usage metric for the KpiCard. */
  usageLabel: string;
  usageValue: string;
  usageDelta?: string;
  usageDirection?: 'up' | 'down' | 'flat';
  usageSpark?: number[];
  /** 0–100 share of the plan's quota already used. */
  quotaPct: number;
  quotaLabel: string;
  seatsUsed: number;
  seatsTotal: number;
  features: string[];
}

export interface SettingsData {
  workspace: string;
  /** Breadcrumb trail leading to this screen; the page title is appended as the current crumb. */
  trail: Crumb[];
  values: SettingsValues;
  timezones: SelectOption[];
  notificationPrefs: SettingsNotificationPref[];
  security: KeyValueItem[];
  /** Optional notice above the security details. */
  securityNotice?: { tone?: ToneInput; lead?: ReactNode; text: ReactNode };
  billing: SettingsBilling;
}

export interface SettingsTemplateProps {
  data?: SettingsData;
  /** Section shown first. Default `profile`. */
  initialSection?: SettingsSection;
  /** Edits applied over `data.values` on mount, so the screen opens with unsaved changes. */
  initialEdits?: Partial<SettingsValues>;
  /** Renders the Save button busy (a save in flight). */
  saving?: boolean;
  /** Called with the edited values when Save is pressed. */
  onSave?: (values: SettingsValues) => void;
  className?: string;
}

export const demoSettings: SettingsData = {
  workspace: 'Northwind Labs',
  trail: [
    { label: 'Northwind Labs', href: '#workspace' },
    { label: 'Admin', href: '#admin' },
  ],
  values: {
    name: 'Ada Lovelace',
    email: 'ada@northwind.dev',
    timezone: 'Europe/London',
    notifications: { mentions: true, approvals: true, runs: false, weekly: true },
    digestHours: 6,
  },
  timezones: [
    { value: 'America/Los_Angeles', label: 'Pacific Time (UTC−08:00)' },
    { value: 'America/New_York', label: 'Eastern Time (UTC−05:00)' },
    { value: 'Europe/London', label: 'London (UTC+00:00)' },
    { value: 'Europe/Berlin', label: 'Berlin (UTC+01:00)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' },
  ],
  notificationPrefs: [
    { id: 'mentions', label: 'Mentions and replies', hint: 'When someone or an agent mentions you.' },
    { id: 'approvals', label: 'Approval requests', hint: 'Tool calls waiting on your sign-off.' },
    { id: 'runs', label: 'Finished runs', hint: 'Every completed agent run, including retries.' },
    { id: 'weekly', label: 'Weekly summary', hint: 'Usage and spend, every Monday.' },
  ],
  security: [
    { id: 'session', label: 'Current session', value: 'Chrome on macOS · London', hint: 'Signed in 12 Mar 2026, 09:14' },
    { id: 'sessions', label: 'Active sessions', value: '3 devices' },
    { id: '2fa', label: 'Two-factor auth', value: 'Enabled · authenticator app', tone: 'success' },
    { id: 'recovery', label: 'Recovery id', value: 'RC-7F3A-91D2-44BE', mono: true, copyable: 'RC-7F3A-91D2-44BE', hint: 'Store this somewhere offline.' },
    { id: 'password', label: 'Password', value: 'Changed 210 days ago', tone: 'warn' },
  ],
  securityNotice: { tone: 'warn', lead: 'Password is getting old.', text: 'Rotate it every 180 days to keep workspace access compliant.' },
  billing: {
    plan: 'Team',
    price: '$24 per seat / month',
    renews: 'Renews 1 Apr 2026',
    usageLabel: 'Tokens this cycle',
    usageValue: '18.4M',
    usageDelta: '+12% vs last cycle',
    usageDirection: 'up',
    usageSpark: [6, 8, 7, 9, 11, 10, 13, 12, 15, 18],
    quotaPct: 74,
    quotaLabel: 'Monthly token quota · 74% of 25M',
    seatsUsed: 9,
    seatsTotal: 12,
    features: ['25M tokens per month', 'Up to 12 seats', 'SSO and audit log', 'Priority support'],
  },
};

const SECTIONS: { id: SettingsSection; label: string; blurb: string }[] = [
  { id: 'profile', label: 'Profile', blurb: 'How you appear to teammates and agents.' },
  { id: 'notifications', label: 'Notifications', blurb: 'Choose what reaches you and how often.' },
  { id: 'security', label: 'Security', blurb: 'Sessions, two-factor and recovery.' },
  { id: 'billing', label: 'Billing', blurb: 'Plan, usage and seats.' },
];

const sameValues = (a: SettingsValues, b: SettingsValues) =>
  a.name === b.name && a.email === b.email && a.timezone === b.timezone && a.digestHours === b.digestHours &&
  Object.keys({ ...a.notifications, ...b.notifications }).every(k => !!a.notifications[k] === !!b.notifications[k]);

/**
 * SettingsTemplate — a workspace/account settings screen. A header carries the
 * breadcrumb trail, the page title and Cancel / Save; below it a vertical Tabs
 * list switches between Profile (avatar, name, email, timezone), Notifications
 * (ToggleSwitch rows labelled through FormField plus a digest NumberInput),
 * Security (KeyValueList with a copyable recovery id and an AlertBanner) and
 * Billing (KpiCard, quota ProgressBar and a plan-details Popover). Edits are
 * held in local state: Save commits them (and reports them via `onSave`),
 * Cancel reverts them, and an AlertBanner flags unsaved changes. The section
 * list moves above the content on narrow containers.
 *
 * Provenance: original morph-ui composition (2026-10).
 */
export function SettingsTemplate({
  data = demoSettings, initialSection = 'profile', initialEdits, saving = false, onSave, className = '',
}: SettingsTemplateProps) {
  const [section, setSection] = useState<SettingsSection>(initialSection);
  // The section nav is a vertical list beside the panel, and a horizontal strip
  // once the template itself is narrower than 640px (same breakpoint as the CSS
  // container query), so the arrow-key axis always matches the layout.
  const rootRef = useRef<HTMLElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => setNarrow((entry?.contentRect.width ?? Infinity) < 640));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [saved, setSaved] = useState<SettingsValues>(data.values);
  const [draft, setDraft] = useState<SettingsValues>(() => ({
    ...data.values,
    ...initialEdits,
    notifications: { ...data.values.notifications, ...initialEdits?.notifications },
  }));
  const [justSaved, setJustSaved] = useState(false);

  const dirty = !sameValues(draft, saved);
  const edit = (patch: Partial<SettingsValues>) => { setDraft(d => ({ ...d, ...patch })); setJustSaved(false); };
  const save = () => { setSaved(draft); setJustSaved(true); onSave?.(draft); };
  const cancel = () => { setDraft(saved); setJustSaved(false); };

  const current = SECTIONS.find(s => s.id === section) ?? SECTIONS[0]!;
  const { billing } = data;
  const seatPct = billing.seatsTotal > 0 ? Math.round((billing.seatsUsed / billing.seatsTotal) * 100) : 0;

  let body: ReactNode;
  if (section === 'profile') {
    body = (
      <div className="settings-tpl__stack">
        <div className="settings-tpl__identity">
          <InitialsAvatar name={draft.name || '?'} size="lg" label={draft.name ? `${draft.name}'s avatar` : 'Avatar'} />
          <div className="settings-tpl__identity-text">
            <span className="settings-tpl__identity-name">{draft.name || 'Unnamed member'}</span>
            <span className="settings-tpl__muted">{draft.email || 'No email on file'} · {data.workspace}</span>
          </div>
        </div>
        <div className="settings-tpl__grid">
          <TextField id="settings-name" label="Full name" value={draft.name} autoComplete="name"
            onChange={e => edit({ name: e.target.value })} />
          <TextField id="settings-email" label="Email" type="email" value={draft.email} autoComplete="email"
            hint="Used for sign-in and notifications." onChange={e => edit({ email: e.target.value })} />
        </div>
        <Select id="settings-timezone" label="Timezone" options={data.timezones} value={draft.timezone}
          placeholder={data.timezones.length ? undefined : 'No timezones available'}
          hint="Digest and quiet hours follow this zone." onChange={e => edit({ timezone: e.target.value })} />
      </div>
    );
  } else if (section === 'notifications') {
    body = (
      <div className="settings-tpl__stack">
        {data.notificationPrefs.length === 0 ? (
          <p className="settings-tpl__muted">No notification channels are configured for this workspace.</p>
        ) : (
          <div className="settings-tpl__toggles" role="group" aria-label="Notification types">
            {data.notificationPrefs.map(p => {
              const id = `settings-notify-${p.id}`;
              return (
                <div key={p.id} className="settings-tpl__toggle">
                  <FormField id={id} label={p.label} hint={p.hint}>
                    <ToggleSwitch id={id} label={p.label} on={!!draft.notifications[p.id]}
                      onChange={next => edit({ notifications: { ...draft.notifications, [p.id]: next } })} />
                  </FormField>
                </div>
              );
            })}
          </div>
        )}
        <NumberInput id="settings-digest" className="settings-tpl__digest" label="Digest frequency (hours)"
          value={draft.digestHours} min={1} max={168} step={1} largeStep={24} unit="h"
          hint="Batch quieter notifications into one digest. Clear to turn the digest off."
          onChange={v => edit({ digestHours: v })} />
      </div>
    );
  } else if (section === 'security') {
    const notice = data.securityNotice;
    body = (
      <div className="settings-tpl__stack">
        {notice && <AlertBanner tone={notice.tone ?? 'warn'} lead={notice.lead}>{notice.text}</AlertBanner>}
        <KeyValueList label="Sign-in and recovery" items={data.security} empty="No security details yet." />
      </div>
    );
  } else {
    body = (
      <div className="settings-tpl__stack">
        <div className="settings-tpl__plan">
          <div className="settings-tpl__identity-text">
            <span className="settings-tpl__identity-name">{billing.plan} plan</span>
            <span className="settings-tpl__muted">{billing.price} · {billing.renews}</span>
          </div>
          <Popover trigger="Plan details" title={`${billing.plan} plan`} placement="bottom-end" width={260}>
            <ul className="settings-tpl__features">
              {billing.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <span className="settings-tpl__muted">{billing.price}</span>
          </Popover>
        </div>
        <div className="settings-tpl__grid">
          <KpiCard label={billing.usageLabel} value={billing.usageValue} delta={billing.usageDelta}
            deltaDirection={billing.usageDirection} deltaTone="neutral" spark={billing.usageSpark} />
          <KpiCard label="Seats" value={`${billing.seatsUsed} / ${billing.seatsTotal}`}
            hint={`${Math.max(0, billing.seatsTotal - billing.seatsUsed)} seats free`} />
        </div>
        <ProgressBar value={billing.quotaPct} label={billing.quotaLabel} tone={billing.quotaPct >= 90 ? 'danger' : billing.quotaPct >= 70 ? 'warn' : 'info'} />
        <ProgressBar value={seatPct} label={`Seats in use · ${seatPct}%`} />
      </div>
    );
  }

  return (
    <main ref={rootRef} className={('settings-tpl ' + className).trim()} data-settings-template="" aria-labelledby="settings-tpl-title">
      <header className="settings-tpl__header">
        <div className="settings-tpl__heading">
          <Breadcrumbs trail={[...data.trail, { label: 'Settings' }]} />
          <h1 id="settings-tpl-title" className="settings-tpl__title">Settings</h1>
        </div>
        <div className="settings-tpl__actions">
          <Button variant="ghost" onClick={cancel} disabled={!dirty || saving}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!dirty} loading={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </header>

      {(dirty || justSaved) && (
        <AlertBanner className="settings-tpl__banner" tone={dirty ? (saving ? 'info' : 'warn') : 'success'}
          lead={dirty ? (saving ? 'Saving…' : 'Unsaved changes.') : 'Saved.'}>
          {dirty ? (saving ? 'Writing your changes to the workspace.' : 'Save to apply them, or Cancel to revert.') : 'Your settings are up to date.'}
        </AlertBanner>
      )}

      <Tabs className="settings-tpl__tabs" label="Settings sections" activeId={section} orientation={narrow ? 'horizontal' : 'vertical'}
        onTabChange={id => setSection(id as SettingsSection)}
        tabs={SECTIONS.map(s => ({ id: s.id, label: s.label }))}>
        <section className="settings-tpl__section" aria-labelledby="settings-tpl-section-title">
          <h2 id="settings-tpl-section-title" className="settings-tpl__section-title">{current.label}</h2>
          <p className="settings-tpl__muted settings-tpl__blurb">{current.blurb}</p>
          {body}
        </section>
      </Tabs>
    </main>
  );
}
