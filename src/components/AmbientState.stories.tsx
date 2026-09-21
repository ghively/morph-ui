import type { StoryDefault, Story } from '@ladle/react';
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
        backgroundColor: '#090d16',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.75rem',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#94a3b8',
            }}
          >
            Ambient Engine
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: badgeColor,
              border: `1px solid ${badgeColor}40`,
            }}
          >
            {badge}
          </span>
        </div>

        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5 }}>
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
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <span>
            State: <strong style={{ color: '#e2e8f0' }}>{state}</strong>
          </span>
          <span>
            Intensity: <strong style={{ color: '#e2e8f0' }}>{intensity}</strong>
          </span>
          <span>
            Motion: <strong style={{ color: paused ? '#f87171' : '#4ade80' }}>{paused ? 'Paused' : 'Active'}</strong>
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
      badgeColor="#38bdf8"
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
      badgeColor="#a855f7"
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
      badgeColor="#34d399"
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
      badgeColor="#f87171"
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
      badgeColor="#94a3b8"
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
      badgeColor="#fbbf24"
    />
  </div>
);

export const InteractiveConsole = () => {
  const [state, setState] = useState<AmbientStateStatus>('thinking');
  const [intensity, setIntensity] = useState<AmbientStateIntensity>('normal');
  const [paused, setPaused] = useState(false);

  const stateColors: Record<AmbientStateStatus, string> = {
    idle: '#38bdf8',
    thinking: '#a855f7',
    speaking: '#34d399',
    error: '#f87171',
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
                fontSize: '0.7rem',
                color: '#94a3b8',
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
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: state === s ? `1px solid ${stateColors[s]}` : '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: state === s ? `${stateColors[s]}22` : 'rgba(255, 255, 255, 0.05)',
                    color: state === s ? stateColors[s] : '#94a3b8',
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
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#cbd5e1',
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
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: paused ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: paused ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: paused ? '#fbbf24' : '#cbd5e1',
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
