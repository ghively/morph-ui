import { SplitPane } from './SplitPane';

export default {
  title: 'SplitPane',
  component: SplitPane,
};

export const Default = () => (
  <div style={{ height: 340, border: '1px solid var(--app-line)', borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
    <SplitPane
      label="Browser"
      defaultSize={260}
      start={
        <div style={{ padding: 12 }}>
          <b style={{ fontSize: 13 }}>Corpus tree</b>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--app-dim)' }}>
            support-2019 · 48,210 docs<br />engineering · 12,004 docs<br />sales · 9,310 docs
          </p>
        </div>
      }
      end={
        <div style={{ padding: 12 }}>
          <b style={{ fontSize: 13 }}>Preview</b>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--app-dim)' }}>
            Drag the divider (or focus it and use arrow keys; double-click resets).
          </p>
        </div>
      }
    />
  </div>
);

export const Column = () => (
  <div style={{ height: 340, border: '1px solid var(--app-line)', borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
    <SplitPane
      orientation="column"
      label="Editor stack"
      defaultSize={180}
      start={<div style={{ padding: 12, fontSize: 12, color: 'var(--app-dim)' }}>Query editor</div>}
      end={<div style={{ padding: 12, fontSize: 12, color: 'var(--app-dim)' }}>Results</div>}
    />
  </div>
);
