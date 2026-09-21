import { useEffect, useRef, useState, useCallback } from 'react';
import './ParticleImage.css';

export interface ParticleImageProps {
  src: string;
  alt: string;
  density?: number; // Adjust density scale (default: 1)
  className?: string;
  'data-testid'?: string;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  vx: number;
  vy: number;
  size: number;
}

export function ParticleImage({
  src,
  alt,
  density = 1,
  className = '',
  'data-testid': testId,
}: ParticleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 100 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const initParticles = useCallback((img: HTMLImageElement, width: number, height: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // We scale down the image to process fewer pixels for particle generation
    const processWidth = Math.floor(width / (4 / density));
    const processHeight = Math.floor(height / (4 / density));
    
    canvas.width = processWidth;
    canvas.height = processHeight;
    ctx.drawImage(img, 0, 0, processWidth, processHeight);
    
    const imageData = ctx.getImageData(0, 0, processWidth, processHeight);
    const pixels = imageData.data;
    
    const particles: Particle[] = [];
    const scaleX = width / processWidth;
    const scaleY = height / processHeight;

    for (let y = 0; y < processHeight; y++) {
      for (let x = 0; x < processWidth; x++) {
        const index = (y * processWidth + x) * 4;
        const alpha = pixels[index + 3];
        
        if (alpha && alpha > 128) { // Only solid pixels
           const r = pixels[index];
           const g = pixels[index + 1];
           const b = pixels[index + 2];
           
           particles.push({
             x: (x * scaleX) + (Math.random() - 0.5) * scaleX,
             y: (y * scaleY) + (Math.random() - 0.5) * scaleY,
             originX: x * scaleX,
             originY: y * scaleY,
             color: `rgb(${r},${g},${b})`,
             vx: 0,
             vy: 0,
             size: Math.max(1, 2 * density),
           });
        }
      }
    }
    particlesRef.current = particles;
  }, [density]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particles = particlesRef.current;
    const { x: mx, y: my, radius } = mouseRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p) continue;
      
      const dx = mx - p.x;
      const dy = my - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const maxDistance = radius;
      const force = (maxDistance - distance) / maxDistance;
      const directionX = forceDirectionX * force * 5;
      const directionY = forceDirectionY * force * 5;

      if (distance < maxDistance) {
        p.vx -= directionX;
        p.vy -= directionY;
      } else {
        p.vx -= (p.x - p.originX) * 0.05;
        p.vy -= (p.y - p.originY) * 0.05;
      }

      p.vx *= 0.9;
      p.vy *= 0.9;
      
      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    requestRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (reducedMotion || !isLoaded) return;
    requestRef.current = requestAnimationFrame(draw);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [draw, isLoaded, reducedMotion]);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      if (canvasRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Setup initial canvas dimensions
        // Fallback for jsdom
        const cw = width || 300;
        const ch = height || 200;
        
        canvasRef.current.width = cw;
        canvasRef.current.height = ch;
        
        if (!reducedMotion) {
           initParticles(img, cw, ch);
        }
      }
      setIsLoaded(true);
    };
  }, [src, reducedMotion, initParticles]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 100,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000, radius: 100 };
  };

  return (
    <div
      ref={containerRef}
      className={`particle-image-container ${className}`}
      data-testid={testId}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {reducedMotion ? (
        <img src={src} alt={alt} className="particle-image-static" data-testid="static-image" />
      ) : (
        <canvas
          ref={canvasRef}
          className="particle-image-canvas"
          aria-label={alt}
          role="img"
        />
      )}
    </div>
  );
}
