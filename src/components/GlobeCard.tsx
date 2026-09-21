import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './GlobeCard.css';

export interface GlobeCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  markers?: Array<{ lat: number; lng: number }>;
  className?: string;
}

export function GlobeCard({ title, description, icon, markers = [], className = '' }: GlobeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotationRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate dots
    const dots: Array<{ lat: number; lng: number }> = [];
    const rows = 30;
    for (let lat = -90; lat <= 90; lat += 180 / rows) {
      const radius = Math.cos((lat * Math.PI) / 180);
      const cols = Math.floor(rows * 2 * radius);
      for (let i = 0; i < cols; i++) {
        const lng = (i * 360) / cols;
        dots.push({ lat, lng });
      }
    }

    let lastTime = performance.now();

    const draw = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (!isHovered && !prefersReducedMotion) {
        rotationRef.current += dt * 0.0005;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) / 2 * 0.8;

      ctx.clearRect(0, 0, width, height);
      
      const computedStyle = getComputedStyle(canvas);
      const dotColor = computedStyle.getPropertyValue('--globe-dot').trim() || '#979ecd';
      const markerColor = computedStyle.getPropertyValue('--globe-marker').trim() || '#6c9cf0';

      const project = (lat: number, lng: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + (rotationRef.current * 180) / Math.PI) * (Math.PI / 180);

        const x = globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = globeRadius * Math.cos(phi);
        const z = globeRadius * Math.sin(phi) * Math.sin(theta);
        return { x, y, z };
      };

      // Draw dots
      ctx.fillStyle = dotColor;
      for (const dot of dots) {
        const { x, y, z } = project(dot.lat, dot.lng);
        if (z > 0) {
          ctx.globalAlpha = 0.5 + (z / globeRadius) * 0.5;
          ctx.beginPath();
          ctx.arc(cx + x, cy + y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw markers
      ctx.fillStyle = markerColor;
      for (const marker of markers) {
        const { x, y, z } = project(marker.lat, marker.lng);
        if (z > 0) {
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(cx + x, cy + y, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Outer ping
          ctx.beginPath();
          ctx.arc(cx + x, cy + y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = markerColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      draw(performance.now());
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [markers, isHovered]);

  return (
    <div 
      className={`globe-card ${className}`} 
      data-globe-card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
    >
      <div className="globe-card-header">
        {icon && <div className="globe-card-icon">{icon}</div>}
        <h3 className="globe-card-title">{title}</h3>
      </div>
      {description && <p className="globe-card-description">{description}</p>}
      <div className="globe-card-canvas-container">
        <canvas
          ref={canvasRef}
          className="globe-card-canvas"
          width={400}
          height={400}
          aria-label="Interactive 3D Globe"
          role="img"
        />
      </div>
    </div>
  );
}
