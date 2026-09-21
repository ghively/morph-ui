import { useEffect, useRef } from 'react';
import './MorphingBlobBackground.css';

export interface MorphingBlobBackgroundProps {
  className?: string;
  colors?: string[];
  blobCount?: number;
}

export function MorphingBlobBackground({ 
  className = '',
  colors = ['var(--app-blue)', 'var(--color-info-border)', 'var(--app-blue-soft)'],
  blobCount = 4
}: MorphingBlobBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // If reduced motion is preferred, don't run animation
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      // Get parent or window size, for now use window for background
      const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      width = rect.width;
      height = rect.height;
      // Handle JSDOM 0 dimensions
      if (width === 0) width = 800;
      if (height === 0) height = 600;
      
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize blobs
    const blobs = Array.from({ length: blobCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 150 + 100,
      color: colors[i % colors.length] || colors[0]!
    }));

    // Convert CSS vars to actual colors for canvas rendering if possible
    // Since we can't easily resolve CSS vars in canvas performantly every frame, 
    // a common trick is to use an offscreen element or just draw gradients.
    // For extreme cheapness, we will draw radial gradients.
    
    // To resolve the CSS variable colors to actual hex/rgb for Canvas:
    const getComputedColor = (colorStr: string) => {
      if (colorStr.startsWith('var(')) {
        // Strip var() syntax to get custom property name
        const varName = colorStr.slice(4, -1);
        if (typeof window !== 'undefined') {
          const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
          return val || '#6c9cf0'; // fallback
        }
      }
      return colorStr;
    };

    // Cache colors
    const cachedColors = blobs.map(b => getComputedColor(b.color));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // We use a global composite operation to blend blobs together like metaballs
      // lighter or screen works well for a glowy look
      ctx.globalCompositeOperation = 'screen';

      blobs.forEach((blob, i) => {
        // Update position
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off walls
        if (blob.x < -blob.radius || blob.x > width + blob.radius) blob.vx *= -1;
        if (blob.y < -blob.radius || blob.y > height + blob.radius) blob.vy *= -1;

        // Draw blob
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        // We need an rgba version of the color for the outer edge, 
        // a simple approximation is to use the raw color but let globalCompositeOperation handle blending,
        // or just hardcode transparent black/white.
        gradient.addColorStop(0, cachedColors[i] || '#6c9cf0');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, blobCount]);

  return (
    <div className={`morphing-blob-container ${className}`} data-morphing-blob-background>
      <canvas ref={canvasRef} className="morphing-blob-canvas" aria-hidden="true" />
      <div className="morphing-blob-fallback" aria-hidden="true" />
    </div>
  );
}
