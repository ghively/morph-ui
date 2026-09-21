import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import './ConfettiCannon.css';

export interface ConfettiCannonRef {
  fire: () => void;
}

export interface ConfettiCannonProps {
  particleCount?: number;
  className?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export const ConfettiCannon = forwardRef<ConfettiCannonRef, ConfettiCannonProps>(
  ({ particleCount = 100, className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useImperativeHandle(ref, () => ({
      fire: () => {
        if (reducedMotion || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const colors = ['#fce18a', '#ff726d', '#b43f3f', '#f4306d', '#3f80c6'];
        
        for (let i = 0; i < particleCount; i++) {
          particlesRef.current.push({
            x: canvas.width / 2,
            y: canvas.height, // fire from bottom
            vx: (Math.random() - 0.5) * 20, // horizontal spread
            vy: (Math.random() * -15) - 10, // upward velocity
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
          });
        }
        
        if (!animationFrameRef.current) {
          render();
        }
      }
    }));

    useEffect(() => {
      if (reducedMotion) return;
      const resize = () => {
        if (!canvasRef.current || !containerRef.current) return;
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      };
      
      window.addEventListener('resize', resize);
      resize();
      
      return () => {
        window.removeEventListener('resize', resize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [reducedMotion]);

    const render = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gravity = 0.5;
      const drag = 0.98;
      
      let activeParticles = false;

      particlesRef.current.forEach(p => {
        if (p.y < canvas.height + 50) { // Keep rendering until off screen bottom
          activeParticles = true;
          
          p.vy += gravity;
          p.vx *= drag;
          p.vy *= drag;
          
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      
      // Clean up dead particles
      particlesRef.current = particlesRef.current.filter(p => p.y < canvas.height + 50);

      if (activeParticles) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        animationFrameRef.current = null;
      }
    };

    return (
      <div 
        className={`confetti-cannon-container ${className}`} 
        ref={containerRef}
        data-confetti-cannon=""
      >
        {!reducedMotion && (
           <canvas ref={canvasRef} className="confetti-cannon-canvas" aria-hidden="true" />
        )}
      </div>
    );
  }
);
