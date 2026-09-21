import type { StoryDefault, Story } from '@ladle/react';
import { MultimodalComposer } from "./MultimodalComposer";
import type { AttachmentStatus } from "./MultimodalComposer";

const attachmentStatuses: Record<string, AttachmentStatus> = {
  "architecture.png": { status: "done" },
  "trace-2026-09-20.json": { status: "uploading", progress: 0.42 },
  "postmortem.md": { status: "failed" },
};

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 680 }}>
    <MultimodalComposer
      placeholder="Message the agent…"
      onSend={() => {}}
      onDraftChange={() => {}}
      onAttach={() => {}}
    />
  </div>
);

export const WithAttachments = () => (
  <div style={{ padding: "2rem", maxWidth: 680 }}>
    <MultimodalComposer
      draftText="Here is the trace from the failed deploy — can you find the stall?"
      attachmentStatuses={attachmentStatuses}
      onSend={() => {}}
      onDraftChange={() => {}}
      onRetryAttachment={() => {}}
      onRemoveAttachment={() => {}}
    />
  </div>
);

export const Disabled = () => (
  <div style={{ padding: "2rem", maxWidth: 680 }}>
    <MultimodalComposer
      disabled
      placeholder="Agent is offline"
      draftText="Reconnecting to the relay…"
      onSend={() => {}}
    />
  </div>
);
