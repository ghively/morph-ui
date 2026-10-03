import { MultimodalComposer, type AttachmentStatus } from './MultimodalComposer';

const mk = (name: string, type = '') => new File(['x'], name, { type });
const files = [mk('architecture.png', 'image/png'), mk('trace-2026-09-20.json'), mk('postmortem.md')];
const attachmentStatuses: Record<string, AttachmentStatus> = {
  'architecture.png': { status: 'done' },
  'trace-2026-09-20.json': { status: 'uploading', progress: 0.42 },
  'postmortem.md': { status: 'failed' },
};

export const Default = () => (
  <div style={{ maxWidth: 680 }}>
    <MultimodalComposer placeholder="Message the agent…" onSend={() => {}} />
  </div>
);

export const WithAttachments = () => (
  <div style={{ maxWidth: 680 }}>
    <MultimodalComposer
      draftText="Here is the trace from the failed deploy — can you find the stall?"
      defaultAttachments={files}
      attachmentStatuses={attachmentStatuses}
      onSend={() => {}}
      onRetryAttachment={() => {}}
      onRemoveAttachment={() => {}}
    />
  </div>
);

export const VoiceMode = () => (
  <div style={{ maxWidth: 680 }}>
    <MultimodalComposer defaultVoiceMode placeholder="Message the agent…" />
  </div>
);

export const ReplyHeader = () => (
  <div style={{ maxWidth: 680 }}>
    <div style={{ padding: '8px 14px', fontSize: 12, color: 'var(--app-dim)', border: '1px solid var(--app-line)', borderBottom: 0, borderRadius: '14px 14px 0 0', background: 'color-mix(in srgb, var(--app-text) 4%, transparent)' }}>
      Replying to <b style={{ color: 'var(--app-text)' }}>Hermes</b>
    </div>
    <MultimodalComposer replyOrEditMode placeholder="Reply…" onSend={() => {}} />
  </div>
);

export const Disabled = () => (
  <div style={{ maxWidth: 680 }}>
    <MultimodalComposer disabled placeholder="Agent is offline" draftText="Reconnecting to the relay…" />
  </div>
);
