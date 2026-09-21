import type { StoryDefault, Story } from '@ladle/react';
import { CodeBlockCard } from './CodeBlockCard';

export default {
  title: 'Components / CodeBlockCard',
} satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ padding: '20px', maxWidth: '600px' }}>
    <CodeBlockCard
      code={`function sayHello(name) {\n  console.log('Hello', name);\n}`}
      language="javascript"
    />
  </div>
);
