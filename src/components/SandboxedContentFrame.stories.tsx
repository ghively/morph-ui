import type { StoryDefault, Story } from "@ladle/react";
import { SandboxedContentFrame, SourceFallbackCard } from './SandboxedContentFrame';

export default {
  title: 'Features/SandboxedContentFrame',
} satisfies StoryDefault;

export const Live: Story = () => (
  <SandboxedContentFrame
    title="Example"
    srcDoc="<html><body>Hello Sandboxed World</body></html>"
    payload={{}}
  />
);

export const Fallback: Story = () => (
  <SourceFallbackCard
    note="The artifact failed to render."
    source="<div>Hello Fallback</div>"
  />
);
