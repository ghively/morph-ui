import { useEffect, useRef } from 'react';
import './PrismOrb.css';

export interface PrismOrbProps {
  state?: 'idle' | 'listening' | 'speaking';
  size?: number;
  className?: string;
}

export function PrismOrb({ 
  state = 'idle', 
  size = 120,
  className = '' 
}: PrismOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 4;

      // Base orb background (glassy)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();

      // State reactive properties
      const speed = state === 'speaking' ? 0.05 : state === 'listening' ? 0.02 : 0.01;
      if (!isReducedMotion) {
        time += speed;
      }

      // Prism ribbon sweep
      const offset = (time * 50) % (size * 2);
      
      const gradient = ctx.createLinearGradient(
        -size + offset, 0, 
        offset, size
      );
      
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.0)');
      gradient.addColorStop(0.2, 'rgba(255, 165, 0, 0.4)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 0, 0.4)');
      gradient.addColorStop(0.6, 'rgba(0, 255, 0, 0.4)');
      gradient.addColorStop(0.8, 'rgba(0, 0, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(238, 130, 238, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = gradient;
      
      // Draw wavy ribbon
      ctx.beginPath();
      for (let x = 0; x <= size; x += 5) {
        const yOffset = Math.sin((x / size) * Math.PI * 2 + time * 2) * (state === 'speaking' ? 20 : 10);
        const y = cy + yOffset;
        if (x === 0) ctx.moveTo(x, y - 10);
        else ctx.lineTo(x, y - 10);
      }
      for (let x = size; x >= 0; x -= 5) {
        const yOffset = Math.sin((x / size) * Math.PI * 2 + time * 2) * (state === 'speaking' ? 20 : 10);
        const y = cy + yOffset;
        ctx.lineTo(x, y + 10);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Glassy highlight
      const highlight = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0,
        cx - radius * 0.3, cy - radius * 0.3, radius * 0.8
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [state, size]);

  return (
    <div data-prism-orb className={className} style={{ width: size, height: size }}>
      <canvas 
        ref={canvasRef}
        width={size}
        height={size}
        aria-label={`Prism orb, currently ${state}`}
        role="img"
      />
    </div>
  );
}
