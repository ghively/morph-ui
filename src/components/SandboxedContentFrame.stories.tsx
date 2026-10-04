import type { StoryDefault, Story } from "@ladle/react";
import { SandboxedContentFrame, SourceFallbackCard } from './SandboxedContentFrame';

export default {
  title: 'Features/SandboxedContentFrame',
} satisfies StoryDefault;

/**
 * A sandboxed document that speaks the frame protocol: it announces `ready`,
 * waits for `render`, then replies `rendered` with its height. Without that
 * handshake the frame stays on "Rendering…" and falls back after timeoutMs.
 * The iframe cannot read the host's tokens, so the document styles itself.
 */
const LIVE_DOC = `<!doctype html><html><head><meta charset="utf-8">
<style>
  html { color-scheme: dark; }
  body { margin: 0; padding: 20px 22px; font: 14px/1.55 system-ui, sans-serif; background: #15171c; color: #e7e9ee; }
  h1 { margin: 0 0 6px; font-size: 17px; }
  p { margin: 0; color: #a3a8b4; }
  .chip { display: inline-block; margin-top: 12px; padding: 3px 10px; border-radius: 999px; background: #233049; color: #9ec1ff; font-size: 12px; }
</style></head><body>
<h1 id="t">Hello, sandboxed world</h1>
<p>This document runs in an opaque-origin iframe with scripts only.</p>
<span class="chip" id="c">waiting for payload</span>
<script>
  addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'render') return;
    if (e.data.title) document.getElementById('t').textContent = e.data.title;
    document.getElementById('c').textContent = 'rendered from payload';
    parent.postMessage({ type: 'rendered', warnings: [], height: document.documentElement.scrollHeight }, '*');
  });
  parent.postMessage({ type: 'ready' }, '*');
</script></body></html>`;

export const Live: Story = () => (
  <div style={{ maxWidth: 560 }}>
    <SandboxedContentFrame
      title="Example"
      srcDoc={LIVE_DOC}
      payload={{ title: 'Quarterly summary' }}
    />
  </div>
);

/** A document that ignores the protocol: shows the default surface, unstyled ink stays legible. */
export const Unstyled: Story = () => (
  <div style={{ maxWidth: 560 }}>
    <SandboxedContentFrame
      title="Unstyled"
      srcDoc="<html><body>Hello Sandboxed World</body></html>"
      payload={{}}
    />
  </div>
);

export const Fallback: Story = () => (
  <div style={{ maxWidth: 560 }}>
    <SourceFallbackCard
      note="The artifact failed to render."
      source="<div>Hello Fallback</div>"
      onRetry={() => {}}
    />
  </div>
);
