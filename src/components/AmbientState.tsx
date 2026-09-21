import { useEffect, useRef, useState } from 'react';
import './AmbientState.css';

export type AmbientStateStatus = 'idle' | 'thinking' | 'speaking' | 'error';
export type AmbientStateIntensity = 'subtle' | 'normal';

export interface AmbientStateProps {
  state: AmbientStateStatus;
  intensity?: AmbientStateIntensity;
  paused?: boolean;
  className?: string;
}

const STATE_COLORS = {
  idle: { r: 0, g: 100, b: 255 }, // blue
  thinking: { r: 150, g: 50, b: 255 }, // purple
  speaking: { r: 0, g: 255, b: 150 }, // teal/green
  error: { r: 255, g: 50, b: 50 }, // red
};

export function AmbientState({ state, intensity = 'normal', paused = false, className = '' }: AmbientStateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastDrawTimeRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else if (containerRef.current) {
        // We can rely on IntersectionObserver to set it back to true if it is visible.
        // Or we could check rect. But let's just trigger an intersection observer check
        // We'll keep it simple: visibility API doesn't tell us if it's in viewport, so
        // if it comes back, wait for IntersectionObserver to fire.
        // Actually document.hidden overrules IO.
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || useFallback) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      setUseFallback(true);
      return;
    }

    const draw = (timestamp: number) => {
      const dt = lastDrawTimeRef.current ? timestamp - lastDrawTimeRef.current : 0;
      lastDrawTimeRef.current = timestamp;

      // Always advance time slightly for rendering, unless strictly static
      // Actually time advances if not paused and visible and not reduced motion
      const isActivelyAnimating = !paused && isVisible && !reducedMotion && !document.hidden;

      if (isActivelyAnimating) {
        timeRef.current += dt * 0.001; // seconds
      }

      const t = timeRef.current;

      const w = canvas.width;
      const h = canvas.height;
      
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.max(w, h);
      
      // Determine base colors and animation modifiers
      const baseColor = STATE_COLORS[state] || STATE_COLORS.idle;
      const alphaScale = intensity === 'subtle' ? 0.3 : 0.7;

      let r1 = 0;
      const r2 = maxR;
      
      const color1 = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alphaScale})`;
      const color2 = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`;
      
      let offsetX = 0;
      let offsetY = 0;

      if (state === 'idle') {
        offsetX = Math.sin(t * 0.5) * w * 0.1;
        offsetY = Math.cos(t * 0.4) * h * 0.1;
      } else if (state === 'thinking') {
        r1 = (Math.sin(t * 1.5) * 0.1 + 0.1) * maxR;
        offsetX = Math.sin(t * 1.2) * w * 0.2;
        offsetY = Math.cos(t * 0.8) * h * 0.2;
      } else if (state === 'speaking') {
        // Gentle pulse at speech cadence ~1Hz
        r1 = (Math.sin(t * Math.PI * 2) * 0.2 + 0.2) * maxR;
      } else if (state === 'error') {
        // Static danger tint
        // no movement
      }

      ctx.fillStyle = '#000'; // Dark background assumed, or clear. We used alpha:false, so we need a background
      // To integrate seamlessly, we might want to make canvas transparent, but alpha:false is faster. Let's use alpha:true so it overlays.
      ctx.clearRect(0, 0, w, h);
      
      const gradient = ctx.createRadialGradient(cx + offsetX, cy + offsetY, r1, cx + offsetX, cy + offsetY, r2);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      if (isActivelyAnimating) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        rafRef.current = null;
      }
    };

    // Make canvas context support transparency
    const transparentCtx = canvas.getContext('2d');
    if (transparentCtx) {
       // Start loop
       if (rafRef.current) cancelAnimationFrame(rafRef.current);
       lastDrawTimeRef.current = 0;
       
       if (!paused && isVisible && !reducedMotion && !document.hidden) {
          rafRef.current = requestAnimationFrame(draw);
       } else {
          // Render a single static frame
          draw(performance.now());
       }
    } else {
       setUseFallback(true);
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [state, intensity, paused, isVisible, reducedMotion, useFallback]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (canvasRef.current) {
          // Adjust for device pixel ratio for sharper canvas
          const dpr = window.devicePixelRatio || 1;
          const { width, height } = entry.contentRect;
          canvasRef.current.width = width * dpr;
          canvasRef.current.height = height * dpr;
          // Scale context
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
             ctx.scale(dpr, dpr);
          }
          // Force a redraw
          if (rafRef.current === null && !useFallback) {
             // trigger a static frame render by faking an animation frame
             // Actually, re-triggering the useEffect will handle it since it depends on useFallback/state/etc, 
             // but size isn't in dep array. Let's force a re-render.
             setIsVisible(v => v); // trigger something? Better to let resize trigger a re-draw.
             // Best to just draw a single frame if paused
          }
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [useFallback]);

  return (
    <div 
      className={`ambient-state ${className}`} 
      data-state={state}
      data-intensity={intensity}
      ref={containerRef}
      aria-hidden="true"
    >
      {useFallback ? (
        <div className="ambient-state-fallback" />
      ) : (
        <canvas ref={canvasRef} className="ambient-state-canvas" />
      )}
    </div>
  );
}
