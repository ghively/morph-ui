import { useEffect, useRef, useState } from "react";
import './InteractiveGlobe.css';

export interface GlobeMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

export interface InteractiveGlobeProps {
  markers?: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  className?: string;
}

export function InteractiveGlobe({ markers = [], onMarkerClick, className = '' }: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const rotationRef = useRef({ x: 0, y: 0 }); // y is lng rotation, x is lat rotation
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  const [hoveredMarker, setHoveredMarker] = useState<{ marker: GlobeMarker, x: number, y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate dots
    const dots: Array<{ lat: number; lng: number }> = [];
    const rows = 36;
    for (let lat = -90; lat <= 90; lat += 180 / rows) {
      const radius = Math.cos((lat * Math.PI) / 180);
      const cols = Math.floor(rows * 2 * radius);
      for (let i = 0; i < cols; i++) {
        const lng = (i * 360) / cols;
        dots.push({ lat, lng });
      }
    }

    let lastTime = performance.now();
    const autoRotateSpeed = 0.0002;

    const project = (lat: number, lng: number, radius: number) => {
      // Apply rotations
      const phi = (90 - lat + rotationRef.current.x) * (Math.PI / 180);
      const theta = (lng + rotationRef.current.y) * (Math.PI / 180);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      return { x, y, z };
    };

    const draw = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (!isDraggingRef.current && !prefersReducedMotion) {
        rotationRef.current.y += dt * (autoRotateSpeed * (180 / Math.PI)); // Convert to degrees
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) / 2 * 0.85;

      ctx.clearRect(0, 0, width, height);

      const computedStyle = getComputedStyle(canvas);
      const dotColor = computedStyle.getPropertyValue('--app-faint').trim() || '#979ecd';
      const markerColor = computedStyle.getPropertyValue('--color-warning').trim() || '#e08c20';
      const atmosphereColor = computedStyle.getPropertyValue('--app-blue-soft').trim() || 'rgba(108, 156, 240, 0.18)';

      // Draw atmosphere glow
      const gradient = ctx.createRadialGradient(cx, cy, globeRadius * 0.9, cx, cy, globeRadius * 1.2);
      gradient.addColorStop(0, atmosphereColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Draw dots
      ctx.fillStyle = dotColor;
      for (const dot of dots) {
        const { x, y, z } = project(dot.lat, dot.lng, globeRadius);
        if (z > 0) {
          ctx.globalAlpha = 0.4 + (z / globeRadius) * 0.6;
          ctx.beginPath();
          ctx.arc(cx + x, cy + y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw markers
      for (const marker of markers) {
        const { x, y, z } = project(marker.lat, marker.lng, globeRadius);
        if (z > 0) {
          ctx.globalAlpha = 1;
          
          // If hovered, make it larger
          const isHovered = hoveredMarker?.marker.id === marker.id;
          
          ctx.fillStyle = markerColor;
          ctx.beginPath();
          ctx.arc(cx + x, cy + y, isHovered ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = markerColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx + x, cy + y, isHovered ? 12 : 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [markers, hoveredMarker]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale coordinates to canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const globeRadius = Math.min(canvas.width, canvas.height) / 2 * 0.85;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      // Sensitivity
      rotationRef.current.y += dx * 0.5;
      rotationRef.current.x -= dy * 0.5;
      
      // Clamp latitude rotation
      rotationRef.current.x = Math.max(-80, Math.min(80, rotationRef.current.x));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      
      // Force redraw if reduced motion is on and we are dragging
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
         // This relies on React state change or effect trigger in real app, but for pure canvas we just update it
         // In standard implementation, draw loop is running. 
      }
    } else {
      // Check hover
      let found = null;
      for (const marker of markers) {
        const phi = (90 - marker.lat + rotationRef.current.x) * (Math.PI / 180);
        const theta = (marker.lng + rotationRef.current.y) * (Math.PI / 180);

        const mx = globeRadius * Math.sin(phi) * Math.cos(theta);
        const my = globeRadius * Math.cos(phi);
        const mz = globeRadius * Math.sin(phi) * Math.sin(theta);

        if (mz > 0) {
          const screenX = cx + mx;
          const screenY = cy + my;
          
          const dx = x * scaleX - screenX;
          const dy = y * scaleY - screenY;
          if (dx * dx + dy * dy < 100) { // 10px radius hit area
            found = { marker, x: e.clientX - rect.left, y: e.clientY - rect.top };
            break;
          }
        }
      }
      setHoveredMarker(found);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const handleClick = () => {
    if (hoveredMarker && onMarkerClick) {
      onMarkerClick(hoveredMarker.marker);
    }
  };

  return (
    <div 
      className={`interactive-globe-container ${className}`} 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      data-interactive-globe
    >
      <canvas
        ref={canvasRef}
        className="interactive-globe-canvas"
        width={800}
        height={800}
        aria-label="Interactive Globe"
        role="application"
      />
      
      <div 
        className="interactive-globe-tooltip" 
        data-visible={hoveredMarker !== null}
        style={{
          left: hoveredMarker ? `${hoveredMarker.x}px` : 0,
          top: hoveredMarker ? `${hoveredMarker.y}px` : 0
        }}
        aria-hidden={!hoveredMarker}
      >
        {hoveredMarker?.marker.label}
      </div>
    </div>
  );
}
