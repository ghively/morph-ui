import { MessageContent } from '../../src/components/MessageContent';

export const Text = () => (
  <MessageContent
    kind="text"
    text="Hello, here is a link https://example.com/a. It works well."
  />
);

export const TrustedHtml = () => (
  <MessageContent
    kind="text"
    html="<p>This is <strong>trusted</strong> HTML.</p>"
    htmlIsTrusted={true}
  />
);
