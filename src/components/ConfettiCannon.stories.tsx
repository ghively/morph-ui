import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ConfettiCannon, type ConfettiCannonRef } from './ConfettiCannon';
import { Button } from './Button';

/**
 * Shared stage: a themed panel (tokens only, so it follows the frame's theme and
 * font) that the cannon fills. `--c` tints the panel edge and glow per story.
 */
function Stage({ accent = 'var(--app-blue)', children }: { accent?: string; children: ReactNode }) {
  return (
    <div style={{ padding: 'var(--s6)' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 560,
          height: 360,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(ellipse at top, color-mix(in srgb, ${accent} 14%, var(--app-panel)) 0%, var(--app-panel) 70%)`,
          borderRadius: 'var(--r-xl)',
          border: `1px solid color-mix(in srgb, ${accent} 30%, var(--app-line))`,
          boxShadow: 'var(--el2)',
          overflow: 'hidden',
          color: 'var(--app-text)',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Copy({ glyph, title, body, children }: { glyph: string; title: string; body: string; children: ReactNode }) {
  return (
    <div style={{ position: 'relative', zIndex: 1, padding: 'var(--s6)' }}>
      <div style={{ fontSize: 'var(--t-hero)', lineHeight: 1, marginBottom: 'var(--s3)' }} aria-hidden="true">{glyph}</div>
      <h3 style={{ margin: '0 0 var(--s2)', fontSize: 'var(--t-h3)', fontWeight: 600, color: 'var(--app-text)' }}>{title}</h3>
      <p style={{ margin: '0 0 var(--s5)', color: 'var(--app-dim)', fontSize: 'var(--t-lead)' }}>{body}</p>
      <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

export const Default = () => {
  const cannonRef = useRef<ConfettiCannonRef>(null);
  const [burstCount, setBurstCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      cannonRef.current?.fire();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleFire = () => {
    cannonRef.current?.fire();
    setBurstCount((c) => c + 1);
  };

  return (
    <Stage>
      <ConfettiCannon ref={cannonRef} particleCount={100} />
      <Copy glyph="🎉" title="Confetti Cannon" body="Click the button below to fire a celebration burst (100 particles).">
        <Button variant="primary" onClick={handleFire}>
          Fire Confetti {burstCount > 0 ? `(${burstCount})` : ''}
        </Button>
      </Copy>
    </Stage>
  );
};

export const GrandCelebration = () => {
  const cannonRef = useRef<ConfettiCannonRef>(null);

  return (
    <Stage accent="var(--app-gold)">
      <ConfettiCannon ref={cannonRef} particleCount={300} />
      <Copy glyph="🏆" title="Grand Milestone Achieved!" body="High-density particle blast (300 particles) for major achievements.">
        <Button variant="primary" onClick={() => cannonRef.current?.fire()}>Launch Grand Blast 🚀</Button>
      </Copy>
    </Stage>
  );
};

export const SubtleBurst = () => {
  const cannonRef = useRef<ConfettiCannonRef>(null);

  return (
    <Stage accent="var(--app-green)">
      <ConfettiCannon ref={cannonRef} particleCount={25} />
      <Copy glyph="✨" title="Task Completed" body="Lightweight particle burst (25 particles) for micro-interactions.">
        <Button variant="secondary" onClick={() => cannonRef.current?.fire()}>Subtle Pop ✨</Button>
      </Copy>
    </Stage>
  );
};

export const InteractiveCelebrationCard = () => {
  const cannonRef = useRef<ConfettiCannonRef>(null);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    cannonRef.current?.fire();
  };

  return (
    <Stage accent="var(--ai)">
      <ConfettiCannon ref={cannonRef} particleCount={150} className="reward-cannon" />
      <Copy
        glyph={claimed ? '🎁' : '🔒'}
        title={claimed ? 'Reward Unlocked!' : 'Special Reward Ready'}
        body={claimed
          ? 'Congratulations! Confetti has been launched across the container.'
          : 'Claim your daily bonus reward to trigger celebratory effects.'}
      >
        <Button variant="primary" onClick={handleClaim}>{claimed ? 'Fire Again! 🎉' : 'Claim Reward 🎁'}</Button>
        {claimed && <Button variant="ghost" onClick={() => setClaimed(false)}>Reset</Button>}
      </Copy>
    </Stage>
  );
};
