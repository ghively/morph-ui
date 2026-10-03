import { AttachmentPreviewPanel } from '../../src/components/AttachmentPreviewPanel';

// Inline SVG so the preview never depends on network access.
const chartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200" viewBox="0 0 480 200">
<rect width="480" height="200" rx="12" fill="#101640"/>
<g fill="#6c9cf0"><rect x="40" y="110" width="44" height="60" rx="4"/><rect x="110" y="80" width="44" height="90" rx="4"/><rect x="180" y="95" width="44" height="75" rx="4"/><rect x="250" y="50" width="44" height="120" rx="4"/><rect x="320" y="35" width="44" height="135" rx="4"/><rect x="390" y="60" width="44" height="110" rx="4"/></g>
<line x1="30" y1="170" x2="450" y2="170" stroke="#2a3370" stroke-width="2"/>
<text x="40" y="26" font-family="sans-serif" font-size="14" fill="#eef1fc">Weekly refund requests</text>
</svg>`;
const chartUrl = `data:image/svg+xml;utf8,${encodeURIComponent(chartSvg)}`;

export const Default = () => (
  <div style={{ height: 520, border: '1px solid var(--app-line)' }}>
    <AttachmentPreviewPanel
      title="refunds-weekly.svg"
      byline="Shared by Priya N. · 2 min ago"
      onClose={() => {}}
      attachment={{
        kind: 'image',
        name: 'refunds-weekly.svg',
        url: chartUrl,
        mimeType: 'image/svg+xml',
        size: 48_213,
        downloadable: true,
      }}
    />
  </div>
);
