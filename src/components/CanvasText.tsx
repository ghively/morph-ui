import { useEffect, useRef, useState } from 'react';
import './CanvasText.css';

export interface CanvasTextProps {
  text: string;
  className?: string;
}

export function CanvasText({ text, className = '' }: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; originX: number; originY: number; vx: number; vy: number; color: string }[] = [];

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      if (!ctx || !canvas) return;
      
      // Draw text to offscreen canvas to get pixel data
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      offCtx.fillStyle = 'white';
      offCtx.font = 'bold 80px sans-serif';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, offscreen.width / 2, offscreen.height / 2);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imageData.data;
      particles = [];

      for (let y = 0; y < offscreen.height; y += 4) {
        for (let x = 0; x < offscreen.width; x += 4) {
          const alpha = data[(y * offscreen.width + x) * 4 + 3];
          if (alpha > 128) {
             // add some randomness to starting positions for effect
             const startX = x + (Math.random() - 0.5) * 50;
             const startY = y + (Math.random() - 0.5) * 50;
             particles.push({
               x: startX,
               y: startY,
               originX: x,
               originY: y,
               vx: 0,
               vy: 0,
               color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`
             });
          }
        }
      }
    };

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Simple spring logic back to origin
        const dx = p.originX - p.x;
        const dy = p.originY - p.y;
        
        p.vx += dx * 0.05; // spring
        p.vy += dy * 0.05;
        p.vx *= 0.8; // friction
        p.vy *= 0.8;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, reducedMotion]);

  return (
    <div className={`canvas-text-container ${className}`} ref={containerRef} data-canvas-text="">
      {reducedMotion ? (
        <div className="canvas-text-fallback">{text}</div>
      ) : (
        <canvas ref={canvasRef} className="canvas-text-canvas" aria-label={text} role="img" />
      )}
    </div>
  );
}
