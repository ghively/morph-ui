import type { StoryDefault, Story } from '@ladle/react';
import {
  AgentPresence,
  type AgentPresenceSize,
  type AgentPresenceState,
} from './AgentPresence';

export const Default = () => (
  <div style={{ padding: '2rem' }}>
    <AgentPresence state="available" label="Agent is online and ready" />
  </div>
);

const ALL_STATES: AgentPresenceState[] = [
  'available',
  'listening',
  'thinking',
  'speaking',
  'streaming',
  'tool-use',
  'delegating',
  'waiting',
  'idle',
  'offline',
  'success',
  'warning',
  'error',
];

export const AllStates = () => (
  <div style={{ padding: '2rem' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {ALL_STATES.map((state) => (
        <div
          key={state}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AgentPresence state={state} size="md" />
          </div>
          <span
            style={{
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              color: 'inherit',
              opacity: 0.9,
            }}
          >
            {state}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const ActiveProcessing = () => (
  <div style={{ padding: '2rem' }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '440px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <AgentPresence state="listening" size="md" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Listening</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Awaiting user input with animated radial wave pulses
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <AgentPresence state="thinking" size="md" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Thinking</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Reasoning and evaluating next step with spinning ring
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <AgentPresence state="tool-use" size="md" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tool Execution</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Invoking external tools with square shape morph and warning spinner
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <AgentPresence state="speaking" size="md" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Speaking / Streaming</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Synthesizing audio and streaming tokens to user
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SIZE_VARIANTS: { size: AgentPresenceSize; label: string; desc: string }[] = [
  { size: 'xs', label: 'Extra Small (16px)', desc: 'Compact inline badges and table rows' },
  { size: 'sm', label: 'Small (24px)', desc: 'Header breadcrumbs and mobile action bars' },
  { size: 'md', label: 'Medium (32px)', desc: 'Default component avatar and card headers' },
  { size: 'hero', label: 'Hero (64px)', desc: 'Splash panels and prominent workspace modals' },
];

export const SizeVariants = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {SIZE_VARIANTS.map(({ size, label, desc }) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              width: '72px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AgentPresence state="listening" size={size} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ShapeMorphOutcomes = () => (
  <div style={{ padding: '2rem' }}>
    <div
      style={{
        display: 'flex',
        gap: '3rem',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <AgentPresence state="tool-use" size="hero" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tool Use</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Rounded rectangle</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <AgentPresence state="success" size="hero" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Success</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Hexagonal seal</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <AgentPresence state="error" size="hero" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Error</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Warning triangle</div>
        </div>
      </div>
    </div>
  </div>
);
