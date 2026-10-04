import { useState, type ReactNode } from 'react';
import {
  AmbientState,
  type AmbientStateIntensity,
  type AmbientStateStatus,
} from './AmbientState';

function StateCard({
  state,
  intensity = 'normal',
  paused = false,
  title,
  description,
  badge,
  badgeColor,
  children,
}: {
  state: AmbientStateStatus;
  intensity?: AmbientStateIntensity;
  paused?: boolean;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        minHeight: '280px',
        margin: '0 auto',
        backgroundColor: 'var(--app-panel)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--app-line)',
        boxShadow: 'var(--el2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--s6)',
        boxSizing: 'border-box',
        color: 'var(--app-text)',
      }}
    >
      <AmbientState state={state} intensity={intensity} paused={paused} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontSize: 'var(--t-eyebrow)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--app-dim)',
            }}
          >
            Ambient Engine
          </span>
          <span
            style={{
              fontSize: 'var(--t-meta)',
              fontWeight: 700,
              padding: 'var(--s0) var(--s2)',
              borderRadius: 'var(--r-pill)',
              // Opaque panel behind the badge so its ink holds contrast over any glow.
              backgroundColor: `color-mix(in srgb, ${badgeColor} 18%, var(--app-panel))`,
              color: `color-mix(in srgb, ${badgeColor} 55%, var(--app-text))`,
              border: `1px solid color-mix(in srgb, ${badgeColor} 45%, transparent)`,
            }}
          >
            {badge}
          </span>
        </div>

        <h3 style={{ margin: '0 0 var(--s2) 0', fontSize: 'var(--t-h3)', fontWeight: 600, color: 'var(--app-text)' }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--t-lead)', color: 'var(--app-dim)', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: '1.5rem' }}>
        {children}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid var(--app-line)',
            fontSize: 'var(--t-meta)',
            color: 'var(--app-dim)',
          }}
        >
          <span>
            State: <strong style={{ color: 'var(--app-text)' }}>{state}</strong>
          </span>
          <span>
            Intensity: <strong style={{ color: 'var(--app-text)' }}>{intensity}</strong>
          </span>
          <span>
            Motion: <strong style={{ color: paused ? 'var(--danger-ink)' : 'var(--ok-ink)' }}>{paused ? 'Paused' : 'Active'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export const Default = () => (
  <div style={{ padding: '2rem' }}>
    <StateCard
      state="idle"
      title="Agent Idle & Ready"
      description="Calm azure radiance indicating the autonomous system is in standby, awaiting user interaction or background trigger."
      badge="Standby"
      badgeColor="var(--state-idle)"
    />
  </div>
);

export const Thinking = () => (
  <div style={{ padding: '2rem' }}>
    <StateCard
      state="thinking"
      title="Autonomous Reasoning"
      description="Active purple dynamic aura with oscillating radius and figure-eight motion signifying deep multi-step execution."
      badge="Thinking"
      badgeColor="var(--state-think)"
    />
  </div>
);

export const Speaking = () => (
  <div style={{ padding: '2rem' }}>
    <StateCard
      state="speaking"
      title="Synthesizing Speech"
      description="Rhythmic teal-green radial pulse synchronized to conversational cadence (~1Hz) indicating real-time voice streaming."
      badge="Speaking"
      badgeColor="var(--state-live)"
    />
  </div>
);

export const ErrorState = () => (
  <div style={{ padding: '2rem' }}>
    <StateCard
      state="error"
      title="Exception Detected"
      description="Static danger-red ambient tint alerting users to an unexpected failure, network timeout, or policy violation."
      badge="Error"
      badgeColor="var(--state-error)"
    />
  </div>
);

export const SubtleIntensity = () => (
  <div style={{ padding: '2rem' }}>
    <StateCard
      state="idle"
      intensity="subtle"
      title="Subtle Intensity"
      description="Low-contrast alpha scale (0.3) designed for content-heavy views, dense dashboards, and unobtrusive ambient feedback."
      badge="Subtle"
      badgeColor="var(--app-faint)"
    />
  </div>
);

export const PausedAnimation = () => (
  <div style={{ padding: '2rem' }}>
    <StateCard
      state="thinking"
      paused={true}
      title="Paused / Reduced Motion"
      description="Renders a static single-frame radial snapshot without a requestAnimationFrame loop, respecting reduced-motion accessibility."
      badge="Paused"
      badgeColor="var(--state-warn)"
    />
  </div>
);

export const InteractiveConsole = () => {
  const [state, setState] = useState<AmbientStateStatus>('thinking');
  const [intensity, setIntensity] = useState<AmbientStateIntensity>('normal');
  const [paused, setPaused] = useState(false);

  const stateColors: Record<AmbientStateStatus, string> = {
    idle: 'var(--state-idle)',
    thinking: 'var(--state-think)',
    speaking: 'var(--state-live)',
    error: 'var(--state-error)',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <StateCard
        state={state}
        intensity={intensity}
        paused={paused}
        title="Interactive State Switcher"
        description="Switch between agent operational states and toggle intensity or pause controls to inspect live canvas animations."
        badge={state.toUpperCase()}
        badgeColor={stateColors[state]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <div
              style={{
                fontSize: 'var(--t-eyebrow)',
                color: 'var(--app-dim)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Select State
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['idle', 'thinking', 'speaking', 'error'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setState(s)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: 'var(--t-meta)',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: state === s ? `1px solid ${stateColors[s]}` : '1px solid var(--app-line)',
                    backgroundColor: state === s ? `color-mix(in srgb, ${stateColors[s]} 16%, var(--app-panel))` : 'var(--app-hover)',
                    color: state === s ? `color-mix(in srgb, ${stateColors[s]} 55%, var(--app-text))` : 'var(--app-dim)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setIntensity((i) => (i === 'normal' ? 'subtle' : 'normal'))}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: 'var(--t-meta)',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--app-line)',
                backgroundColor: 'var(--app-hover)',
                color: 'var(--app-text)',
                cursor: 'pointer',
              }}
            >
              Intensity: {intensity}
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: 'var(--t-meta)',
                borderRadius: 'var(--r-sm)',
                border: paused ? '1px solid var(--warn-line)' : '1px solid var(--app-line)',
                backgroundColor: paused ? 'var(--warn-soft)' : 'var(--app-hover)',
                color: paused ? 'var(--warn-ink)' : 'var(--app-text)',
                cursor: 'pointer',
              }}
            >
              {paused ? 'Resume Animation' : 'Pause Animation'}
            </button>
          </div>
        </div>
      </StateCard>
    </div>
  );
};
