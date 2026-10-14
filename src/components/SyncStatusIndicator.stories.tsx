import { SyncStatusIndicator } from './SyncStatusIndicator';

export default {
  title: 'SyncStatusIndicator',
  component: SyncStatusIndicator,
};

export const AllStates = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    <SyncStatusIndicator status="idle" meta="3m ago" />
    <SyncStatusIndicator status="syncing" meta="12 changes" />
    <SyncStatusIndicator status="offline" meta="reconnecting…" />
    <SyncStatusIndicator status="conflict" meta="2 files" />
  </div>
);

export const Bare = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <SyncStatusIndicator status="idle" />
    <SyncStatusIndicator status="syncing" />
    <SyncStatusIndicator status="offline" />
    <SyncStatusIndicator status="conflict" />
  </div>
);

export const CustomLabels = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <SyncStatusIndicator status="syncing" label="Uploading footage" meta="1.2 of 4.6 GB" />
    <SyncStatusIndicator status="conflict" label="Needs review" meta="notes.md edited on 2 devices" />
  </div>
);
