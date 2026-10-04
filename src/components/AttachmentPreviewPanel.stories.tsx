import type { StoryDefault, Story } from "@ladle/react";
import type { ReactNode } from "react";
import { AttachmentPreviewPanel } from './AttachmentPreviewPanel';
import { GlyphIcon } from './GlyphIcon';

export default {
  title: 'Features/AttachmentPreviewPanel',
} satisfies StoryDefault;

const Shell = ({ children }: { children: ReactNode }) => (
  <div style={{ height: 460, maxWidth: 520, border: '1px solid var(--app-line)', borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--app-bg)' }}>
    {children}
  </div>
);

/** No mimeType passed: the panel infers image/png from the extension. */
export const Default: Story = () => (
  <Shell>
    <AttachmentPreviewPanel
      title="example.png"
      byline="Ada · 14:02"
      icon={<GlyphIcon name="file" size={14} />}
      onClose={() => {}}
      attachment={{
        kind: 'image',
        name: 'example.png',
        url: 'https://placehold.co/400',
        size: 1024,
        downloadable: true
      }}
    />
  </Shell>
);

/** A URL that fails to load shows a placeholder, not the browser broken-image icon. */
export const BrokenImage: Story = () => (
  <Shell>
    <AttachmentPreviewPanel
      title="missing.jpg"
      icon={<GlyphIcon name="file" size={14} />}
      onClose={() => {}}
      attachment={{ kind: 'image', name: 'missing.jpg', url: 'data:image/png;base64,broken', size: 48213 }}
    />
  </Shell>
);
