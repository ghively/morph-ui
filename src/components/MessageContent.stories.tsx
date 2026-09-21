import type { StoryDefault, Story } from '@ladle/react';
import { MessageContent } from './MessageContent';

export default {
  title: 'Components / MessageContent',
} satisfies StoryDefault;

export const Text: Story = () => (
  <MessageContent
    kind="text"
    text="Hello, here is a link https://example.com/a. It works well."
  />
);

export const TrustedHtml: Story = () => (
  <MessageContent
    kind="text"
    html="<p>This is <strong>trusted</strong> HTML.</p>"
    htmlIsTrusted={true}
  />
);
