import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ConfettiCannon, type ConfettiCannonRef } from '../../src/components/ConfettiCannon';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';

/**
 * ConfettiCannon is an overlay canvas with an imperative `fire()`; it renders
 * nothing until fired. Each preview places it over a Morph Card and fires a few
 * staggered bursts on mount so a static capture catches particles in flight.
 */
function CelebrationStage({
  particleCount,
  title,
  body,
  cta,
  variant = 'primary',
  autoBursts = 3,
}: {
  particleCount: number;
  title: string;
  body: ReactNode;
  cta: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  autoBursts?: number;
}) {
  const cannonRef = useRef<ConfettiCannonRef>(null);
  const [bursts, setBursts] = useState(0);

  useEffect(() => {
    const timers = Array.from({ length: autoBursts }, (_, i) =>
      setTimeout(() => cannonRef.current?.fire(), 250 + i * 450),
    );
    return () => timers.forEach(clearTimeout);
  }, [autoBursts]);

  return (
    <div style={{ position: 'relative', maxWidth: 520, height: 320, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
      <ConfettiCannon ref={cannonRef} particleCount={particleCount} />
      <div style={{ width: '100%' }}>
        <Card title={title} subtitle={`${particleCount} particles per burst`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span>{body}</span>
            <Button
              variant={variant}
              onClick={() => {
                cannonRef.current?.fire();
                setBursts((b) => b + 1);
              }}
            >
              {cta}{bursts > 0 ? ` (${bursts})` : ''}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export const Default = () => (
  <CelebrationStage
    particleCount={100}
    title="Corpus reindexed"
    body="All 43 sources are fresh. Fire a celebration burst for the team."
    cta="Fire confetti"
  />
);

export const GrandCelebration = () => (
  <CelebrationStage
    particleCount={300}
    title="Milestone: 1M answers served"
    body="High-density blast reserved for major achievements."
    cta="Launch grand blast"
  />
);

export const SubtleBurst = () => (
  <CelebrationStage
    particleCount={25}
    title="Task completed"
    body="A lightweight pop for small wins and micro-interactions."
    cta="Subtle pop"
    variant="secondary"
    autoBursts={2}
  />
);

export const InteractiveCelebrationCard = () => (
  <CelebrationStage
    particleCount={150}
    title="Daily reward ready"
    body="Claim your bonus to trigger the celebration."
    cta="Claim reward"
  />
);
