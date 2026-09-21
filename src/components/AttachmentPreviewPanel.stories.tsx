import type { StoryDefault, Story } from "@ladle/react";
import { AttachmentPreviewPanel } from './AttachmentPreviewPanel';

export default {
  title: 'Features/AttachmentPreviewPanel',
} satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ height: 400, border: '1px solid var(--app-line)' }}>
    <AttachmentPreviewPanel
      title="example.png"
      onClose={() => {}}
      attachment={{
        kind: 'image',
        name: 'example.png',
        url: 'https://placehold.co/400',
        size: 1024,
        downloadable: true
      }}
    />
  </div>
);
