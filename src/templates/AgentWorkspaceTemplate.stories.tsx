import type { StoryDefault, Story } from '@ladle/react';
import { AgentWorkspaceTemplate, demoAgentWorkspace } from './AgentWorkspaceTemplate';

export default {
  title: 'Templates/AgentWorkspace',
} satisfies StoryDefault;

/** The catalog captures 1000x760 with 24px frame padding, so the template fills a 712px-tall host. */
export const Default: Story = () => (
  <div style={{ height: 712 }}>
    <AgentWorkspaceTemplate />
  </div>
);

/** A fresh conversation: no turns yet, starter prompts fill the composer. */
export const NewConversation: Story = () => (
  <div style={{ height: 712 }}>
    <AgentWorkspaceTemplate
      entries={[]}
      activeConversationId={null}
      plan={[]}
      approval={null}
      agent={{ ...demoAgentWorkspace.agent, status: 'idle', presence: 'available', lastActive: '2 minutes ago' }}
      context={{ used: 6200, total: 200000, breakdown: [{ label: 'System', value: 6200 }] }}
    />
  </div>
);

/** Phone width: the side panes collapse behind the header toggles. */
export const Narrow: Story = () => (
  <div style={{ height: 712, maxWidth: 380 }}>
    <AgentWorkspaceTemplate />
  </div>
);
