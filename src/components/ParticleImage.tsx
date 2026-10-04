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
  const [staticDrawn, setStaticDrawn] = useState(false);
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

    // Contain-fit the source inside the component box so the artwork keeps
    // its aspect ratio instead of stretching to the container.
    const iw = img.naturalWidth || img.width || width;
    const ih = img.naturalHeight || img.height || height;
    const fit = Math.min(width / iw, height / ih);
    const drawW = Math.max(1, iw * fit);
    const drawH = Math.max(1, ih * fit);
    const offsetX = (width - drawW) / 2;
    const offsetY = (height - drawH) / 2;

    // Sample the image on a coarse grid: one particle every `step` px.
    const step = 4 / density;
    const processWidth = Math.max(1, Math.floor(drawW / step));
    const processHeight = Math.max(1, Math.floor(drawH / step));

    canvas.width = processWidth;
    canvas.height = processHeight;
    ctx.drawImage(img, 0, 0, processWidth, processHeight);

    let pixels: Uint8ClampedArray;
    try {
      pixels = ctx.getImageData(0, 0, processWidth, processHeight).data;
    } catch {
      // Tainted (cross-origin) source: leave the static <img> fallback in place.
      return;
    }

    const particles: Particle[] = [];
    const scaleX = drawW / processWidth;
    const scaleY = drawH / processHeight;
    // Particles stay smaller than their grid cell so density reads visually.
    const size = Math.max(1, Math.min(scaleX, scaleY) * 0.6);

    for (let y = 0; y < processHeight; y++) {
      for (let x = 0; x < processWidth; x++) {
        const index = (y * processWidth + x) * 4;
        const alpha = pixels[index + 3];

        if (alpha && alpha > 128) { // Only solid pixels
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const originX = offsetX + x * scaleX;
          const originY = offsetY + y * scaleY;

          particles.push({
            x: originX + (Math.random() - 0.5) * scaleX,
            y: originY + (Math.random() - 0.5) * scaleY,
            originX,
            originY,
            color: `rgb(${r},${g},${b})`,
            vx: 0,
            vy: 0,
            size,
          });
        }
      }
    }
    particlesRef.current = particles;
  }, [density]);

  /** Paint every particle at its rest position once — the reduced-motion frame. */
  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || particlesRef.current.length === 0) return false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particlesRef.current) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.originX, p.originY, p.size, p.size);
    }
    return true;
  }, []);

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
    let cancelled = false;
    setStaticDrawn(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      imageRef.current = img;
      if (canvasRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Fallback for jsdom
        const cw = Math.round(width) || 300;
        const ch = Math.round(height) || 200;

        canvasRef.current.width = cw;
        canvasRef.current.height = ch;

        particlesRef.current = [];
        initParticles(img, cw, ch);
        // Reduced motion: one static particle frame, no animation loop.
        if (reducedMotion) setStaticDrawn(drawStatic());
      }
      setIsLoaded(true);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, reducedMotion, initParticles, drawStatic]);

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
      <canvas
        ref={canvasRef}
        className="particle-image-canvas"
        aria-label={alt}
        role="img"
        aria-hidden={reducedMotion && !staticDrawn ? true : undefined}
        data-static={reducedMotion ? '' : undefined}
      />
      {reducedMotion && (
        <img
          src={src}
          alt={staticDrawn ? '' : alt}
          className="particle-image-static"
          data-testid="static-image"
          data-hidden={staticDrawn ? '' : undefined}
        />
      )}
    </div>
  );
}
