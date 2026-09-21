import { useEffect, useRef, useState } from 'react';
import { ConfettiCannon, type ConfettiCannonRef } from './ConfettiCannon';

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
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          height: '360px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          color: '#f8fafc',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          border: '1px solid #334155',
        }}
      >
        <ConfettiCannon ref={cannonRef} particleCount={100} />
        <div style={{ zIndex: 1, padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
            Confetti Cannon
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>
            Click the button below to fire a celebration burst (100 particles).
          </p>
          <button
            type="button"
            onClick={handleFire}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0f172a',
              backgroundColor: '#38bdf8',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)',
            }}
          >
            Fire Confetti {burstCount > 0 ? `(${burstCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export const GrandCelebration = () => {
  const cannonRef = useRef<ConfettiCannonRef>(null);

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          height: '360px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
          borderRadius: '16px',
          border: '1px solid #3f3f46',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          color: '#fafafa',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <ConfettiCannon ref={cannonRef} particleCount={300} />
        <div style={{ zIndex: 1, padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
            Grand Milestone Achieved!
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#a1a1aa', fontSize: '0.875rem' }}>
            High-density particle blast (300 particles) for major achievements.
          </p>
          <button
            type="button"
            onClick={() => cannonRef.current?.fire()}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
            }}
          >
            Launch Grand Blast 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export const SubtleBurst = () => {
  const cannonRef = useRef<ConfettiCannonRef>(null);

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          height: '360px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          color: '#0f172a',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <ConfettiCannon ref={cannonRef} particleCount={25} />
        <div style={{ zIndex: 1, padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✨</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
            Task Completed
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
            Lightweight particle burst (25 particles) for micro-interactions.
          </p>
          <button
            type="button"
            onClick={() => cannonRef.current?.fire()}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#10b981',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            Subtle Pop ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export const InteractiveCelebrationCard = () => {
  const cannonRef = useRef<ConfettiCannonRef>(null);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    cannonRef.current?.fire();
  };

  const handleReset = () => {
    setClaimed(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          height: '360px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #09090b 100%)',
          borderRadius: '16px',
          border: '1px solid #4338ca',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          color: '#e0e7ff',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <ConfettiCannon ref={cannonRef} particleCount={150} className="reward-cannon" />
        <div style={{ zIndex: 1, padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            {claimed ? '🎁' : '🔒'}
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
            {claimed ? 'Reward Unlocked!' : 'Special Reward Ready'}
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#a5b4fc', fontSize: '0.875rem' }}>
            {claimed
              ? 'Congratulations! Confetti has been launched across the container.'
              : 'Claim your daily bonus reward to trigger celebratory effects.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleClaim}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#6366f1',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              }}
            >
              {claimed ? 'Fire Again! 🎉' : 'Claim Reward 🎁'}
            </button>
            {claimed && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  color: '#c7d2fe',
                  backgroundColor: 'transparent',
                  border: '1px solid #4f46e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
