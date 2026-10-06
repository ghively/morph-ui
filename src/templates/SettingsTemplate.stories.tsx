import { SettingsTemplate, demoSettings } from './SettingsTemplate';

export default {
  title: 'Templates/Settings',
  component: SettingsTemplate,
};

/** Desktop screen sized to the 1000x760 catalog viewport; the section panel scrolls inside. */
export const Default = () => (
  <div style={{ height: 720 }}>
    <SettingsTemplate data={demoSettings} />
  </div>
);

/** Phone width with unsaved edits pending: the section list moves on top and the warn banner shows. */
export const NarrowUnsaved = () => (
  <div style={{ maxWidth: 380, height: 720 }}>
    <SettingsTemplate
      data={demoSettings}
      initialSection="notifications"
      initialEdits={{ digestHours: 12, notifications: { runs: true } }}
    />
  </div>
);

/** A save in flight: Save shows its spinner and Cancel is locked. */
export const Saving = () => (
  <div style={{ height: 720 }}>
    <SettingsTemplate data={demoSettings} initialSection="billing" initialEdits={{ name: 'Ada King' }} saving />
  </div>
);
