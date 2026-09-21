import { useState } from 'react';
import { MessageComposer, type ComposerDraft, type MessageComposerProps } from './MessageComposer';

export default {
  title: 'MessageComposer',
};

type FrameProps = Partial<MessageComposerProps> & {
  initial?: ComposerDraft;
  onSend: MessageComposerProps['onSend'];
  placeholder: string;
};

function ComposerFrame({ initial, ...rest }: FrameProps) {
  const [draft, setDraft] = useState<ComposerDraft>(initial ?? { text: '', mentions: [] });
  return <MessageComposer {...rest} draft={draft} onDraftChange={setDraft} />;
}

export const Default = () => (
  <ComposerFrame onSend={() => {}} placeholder="Message..." />
);

export const ReplyContext = () => (
  <ComposerFrame
    onSend={() => {}}
    placeholder="Reply..."
    context={{
      mode: 'reply',
      senderName: 'Alice',
      preview: 'Hello there!',
      onCancel: () => {},
    }}
  />
);

export const EditContext = () => (
  <ComposerFrame
    initial={{ text: 'Hello there!', mentions: [] }}
    onSend={() => {}}
    placeholder="Edit..."
    context={{
      mode: 'edit',
      preview: 'Hello there!',
      onCancel: () => {},
    }}
  />
);

export const Offline = () => (
  <ComposerFrame onSend={() => {}} placeholder="Message..." offline={true} />
);

export const Uploads = () => (
  <ComposerFrame
    onSend={() => {}}
    placeholder="Message..."
    uploads={[
      { name: 'document.pdf', pct: 40 },
      { name: 'image.png', pct: 85 },
    ]}
  />
);
