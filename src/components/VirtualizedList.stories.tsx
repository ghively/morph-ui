import { VirtualizedList } from './VirtualizedList';

type Doc = { id: string; name: string; count: number };

const DOCS: Doc[] = Array.from({ length: 5000 }, (_, i) => ({
  id: `d${i}`,
  name: `document-${String(i).padStart(4, '0')}.md`,
  count: (i * 37) % 900,
}));

export default {
  title: 'VirtualizedList',
  component: VirtualizedList,
};

export const Default = () => (
  <div style={{ maxWidth: 520 }}>
    <VirtualizedList<Doc>
      items={DOCS}
      rowHeight={44}
      height={360}
      label="All documents"
      rowKey={(d) => d.id}
      renderRow={(d) => (
        <>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--app-faint)' }}>{d.count} hits</span>
        </>
      )}
    />
  </div>
);

export const ShortList = () => (
  <div style={{ maxWidth: 520 }}>
    <VirtualizedList<Doc>
      items={DOCS.slice(0, 8)}
      rowHeight={44}
      height={200}
      label="Recent documents"
      rowKey={(d) => d.id}
      renderRow={(d) => <span>{d.name}</span>}
    />
  </div>
);
