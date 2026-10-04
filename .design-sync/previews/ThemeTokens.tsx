import { ThemeTokens, AppFrame, Button, Badge, ProgressBar, ToggleSwitch } from '@ghively/morph-ui';

const VIOLET = {
  '--app-blue': '#9b7bff',
  '--app-blue-strong': '#7c5cf0',
  '--app-blue-ink': '#c4b2ff',
  '--app-bg': '#120c24',
};

export const VioletTheme = () => (
  <>
    <ThemeTokens id="violet" tokens={VIOLET} />
    <AppFrame bare themeId="violet" style={{ height: 'auto', minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, maxWidth: 420 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary">Themed primary</Button>
          <Button>Secondary</Button>
          <Badge tone="info">Theme id: violet</Badge>
        </div>
        <ProgressBar value={64} label="Index rebuild" />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ToggleSwitch on onChange={() => {}} label="Use violet accent" />
          <span>Accent tokens scoped to this frame only</span>
        </div>
      </div>
    </AppFrame>
  </>
);
