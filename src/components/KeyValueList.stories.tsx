import { KeyValueList } from './KeyValueList';

export default {
  title: 'KeyValueList',
  component: KeyValueList,
};

const frame = { maxWidth: 520 };

export const Inline = () => (
  <div style={frame}>
    <KeyValueList
      label="Server details"
      items={[
        { id: 'host', label: 'Hostname', value: 'edge-ams-04.morph.internal', mono: true, copyable: 'edge-ams-04.morph.internal' },
        { id: 'ip', label: 'Public IP', value: '203.0.113.42', mono: true, copyable: '203.0.113.42' },
        { id: 'region', label: 'Region', value: 'eu-west · Amsterdam' },
        { id: 'status', label: 'Health', value: 'Healthy', tone: 'success', hint: 'Last probe 12s ago' },
        { id: 'cert', label: 'TLS certificate', value: 'Expires in 9 days', tone: 'warn' },
        { id: 'errors', label: '5xx rate', value: '2.4%', tone: 'danger', mono: true },
        { id: 'commit', label: 'Build', value: '9f3c2a1e7b4d', mono: true, copyable: '9f3c2a1e7b4d', tone: 'info' },
      ]}
    />
  </div>
);

export const Stacked = () => (
  <div style={{ maxWidth: 360 }}>
    <KeyValueList
      layout="stacked"
      label="Workspace settings"
      items={[
        { id: 'name', label: 'Workspace name', value: 'Research · Retrieval quality' },
        { id: 'model', label: 'Default model', value: 'claude-opus-5-5', mono: true },
        { id: 'retention', label: 'Retention', value: '30 days', hint: 'Applies to transcripts and uploads' },
        { id: 'sharing', label: 'External sharing', value: 'Disabled', tone: 'neutral' },
        {
          id: 'webhook',
          label: 'Webhook',
          value: 'https://hooks.example.com/morph/retrieval-quality/notifications/v2',
          mono: true,
          copyable: 'https://hooks.example.com/morph/retrieval-quality/notifications/v2',
        },
      ]}
    />
  </div>
);

export const Grid = () => (
  <div style={{ maxWidth: 720 }}>
    <KeyValueList
      layout="grid"
      columns={3}
      label="Index metadata"
      items={[
        { id: 'docs', label: 'Documents', value: '12,480', mono: true },
        { id: 'chunks', label: 'Chunks', value: '318,902', mono: true },
        { id: 'fresh', label: 'Freshness', value: 'Synced 2m ago', tone: 'success' },
        { id: 'embed', label: 'Embedding', value: 'text-embed-3 · 1024d', mono: true },
        { id: 'stale', label: 'Stale sources', value: '3', tone: 'warn', hint: 'Confluence, 2 drives' },
        { id: 'id', label: 'Index ID', value: 'idx_7Hq2nV', mono: true, copyable: 'idx_7Hq2nV' },
      ]}
    />
  </div>
);

export const Empty = () => (
  <div style={frame}>
    <KeyValueList label="Metadata" items={[]} empty="No metadata recorded for this file." />
  </div>
);
