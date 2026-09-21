import React, { useRef, useEffect, useState } from 'react';
import './AgentTopologyView.css';

export interface TopologyNode {
  id: string;
  label: string;
  kind: 'agent' | 'tool' | 'data' | 'user';
  status?: 'active' | 'error' | 'idle';
}

export interface TopologyEdge {
  from: string;
  to: string;
  label?: string;
}

export interface AgentTopologyViewProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  onNodeClick?: (id: string) => void;
  selectedId?: string;
  maxHeight?: number | string;
  className?: string;
  paused?: boolean;
}

// Token color mappings
const KIND_COLORS = {
  agent: 'var(--app-blue)',
  tool: 'var(--app-faint)',
  data: 'var(--color-success)',
  user: 'var(--app-dim)',
};

const STATUS_COLORS = {
  active: 'var(--color-success)',
  error: 'var(--color-error)',
  idle: 'var(--app-faint)',
};

interface Position {
  x: number;
  y: number;
}

export function AgentTopologyView({
  nodes,
  edges,
  onNodeClick,
  selectedId,
  maxHeight = 400,
  className = '',
  paused = false,
}: AgentTopologyViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastDrawTimeRef = useRef<number>(0);
  
  const [layout, setLayout] = useState<Map<string, Position>>(new Map());

  // Determine reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Visibility observation
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
    const handleVisibilityChange = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Layout calculation
  useEffect(() => {
    // Deterministic circle packing by kind
    const newLayout = new Map<string, Position>();
    const agents = nodes.filter(n => n.kind === 'agent');
    const tools = nodes.filter(n => n.kind === 'tool');
    const others = nodes.filter(n => n.kind !== 'agent' && n.kind !== 'tool');

    // Base radius scales with node count roughly
    const agentRadius = 80;
    const toolRadius = 160;

    const arrangeCircle = (group: TopologyNode[], radius: number, offsetAngle: number = 0) => {
      const count = group.length;
      group.forEach((node, i) => {
        const angle = offsetAngle + (i / count) * Math.PI * 2;
        newLayout.set(node.id, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        });
      });
    };

    if (agents.length === 1) {
      newLayout.set(agents[0].id, { x: 0, y: 0 });
    } else {
      arrangeCircle(agents, agentRadius);
    }

    arrangeCircle(tools, toolRadius, Math.PI / 4);
    arrangeCircle(others, toolRadius + 80, Math.PI / 8);

    setLayout(newLayout);
  }, [nodes]);

  // Read CSS variables for rendering
  const getCssVar = (name: string, fallback: string) => {
    if (typeof window === 'undefined') return fallback;
    // We try to read from computed style if possible, but reading directly on render is hard.
    // For canvas we will just use the string 'var(--color)' but canvas 2d doesn't support CSS vars directly in all methods.
    // Actually, setting ctx.fillStyle = 'var(--app-blue)' works in modern browsers if the canvas element inherits it!
    // But JSDOM might not support it. We'll use getComputedStyle.
    if (!containerRef.current) return fallback;
    const val = getComputedStyle(containerRef.current).getPropertyValue(name.replace('var(', '').replace(')', ''));
    return val || fallback;
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || useFallback || layout.size === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setUseFallback(true);
      return;
    }

    // Colors
    const colorAppBlue = getCssVar('--app-blue', '#3b82f6');
    const colorAppFaint = getCssVar('--app-faint', '#374151');
    const colorSuccess = getCssVar('--color-success', '#10b981');
    const colorDim = getCssVar('--app-dim', '#9ca3af');
    const colorError = getCssVar('--color-error', '#ef4444');
    const colorText = getCssVar('--app-text', '#f3f4f6');
    const colorLine = getCssVar('--app-line', '#4b5563');

    const draw = (timestamp: number) => {
      const dt = lastDrawTimeRef.current ? timestamp - lastDrawTimeRef.current : 0;
      lastDrawTimeRef.current = timestamp;

      const isActivelyAnimating = !paused && isVisible && !reducedMotion && !document.hidden;
      if (isActivelyAnimating) {
        timeRef.current += dt * 0.02; // dash offset drift
      }

      const w = canvas.width;
      const h = canvas.height;
      
      const dpr = window.devicePixelRatio || 1;
      
      ctx.clearRect(0, 0, w / dpr, h / dpr);
      ctx.save();
      ctx.translate((w / dpr) / 2, (h / dpr) / 2); // Center

      // Draw edges
      ctx.lineWidth = 2;
      edges.forEach(edge => {
        const fromPos = layout.get(edge.from);
        const toPos = layout.get(edge.to);
        if (fromPos && toPos) {
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.strokeStyle = colorLine;
          
          if (!reducedMotion) {
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -timeRef.current;
          } else {
            ctx.setLineDash([]);
          }
          
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const pos = layout.get(node.id);
        if (!pos) return;

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
        
        if (node.kind === 'agent') ctx.fillStyle = colorAppBlue;
        else if (node.kind === 'tool') ctx.fillStyle = colorAppFaint;
        else if (node.kind === 'data') ctx.fillStyle = colorSuccess;
        else ctx.fillStyle = colorDim;
        
        ctx.fill();

        // Status dot
        if (node.status) {
          ctx.beginPath();
          ctx.arc(pos.x + 12, pos.y - 12, 6, 0, Math.PI * 2);
          if (node.status === 'active') ctx.fillStyle = colorSuccess;
          else if (node.status === 'error') ctx.fillStyle = colorError;
          else ctx.fillStyle = colorDim;
          ctx.fill();
        }

        // Selection ring
        if (selectedId === node.id) {
           ctx.beginPath();
           ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
           ctx.strokeStyle = colorText;
           ctx.lineWidth = 2;
           ctx.setLineDash([]);
           ctx.stroke();
        }

        // Label
        ctx.fillStyle = colorText;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + 32);
      });

      ctx.restore();

      if (isActivelyAnimating) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        rafRef.current = null;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastDrawTimeRef.current = 0;
    
    if (!paused && isVisible && !reducedMotion && !document.hidden) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      draw(performance.now());
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [nodes, edges, layout, paused, isVisible, reducedMotion, useFallback, selectedId]);

  // Resize handling
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (canvasRef.current) {
          const dpr = window.devicePixelRatio || 1;
          const { width, height } = entry.contentRect;
          canvasRef.current.width = width * dpr;
          canvasRef.current.height = height * dpr;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.scale(dpr, dpr);
          }
          if (rafRef.current === null && !useFallback) {
             // force a redraw on resize when static
             // setting layout to itself won't trigger re-draw, so we can just let React handle it if we want, or we call draw directly.
             // Best is to trigger a state update
             setLayout(new Map(layout));
          }
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [useFallback, layout]);

  // Click handling
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onNodeClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    for (const node of nodes) {
      const pos = layout.get(node.id);
      if (pos) {
        const dx = pos.x - x;
        const dy = pos.y - y;
        if (Math.sqrt(dx*dx + dy*dy) < 20) {
          onNodeClick(node.id);
          break;
        }
      }
    }
  };

  // SVG Fallback renderer
  const renderFallback = () => {
    return (
      <svg className="agent-topology-svg" width="100%" height="100%">
        <g transform={`translate(50%, 50%)`}>
          {/* We approximate a center coordinate by using 50% 50% and assuming container is relative */}
          {edges.map(edge => {
            const fromPos = layout.get(edge.from);
            const toPos = layout.get(edge.to);
            if (!fromPos || !toPos) return null;
            return (
              <line 
                key={`${edge.from}-${edge.to}`}
                x1={fromPos.x} y1={fromPos.y}
                x2={toPos.x} y2={toPos.y}
                stroke="var(--app-line)"
                strokeWidth={2}
                strokeDasharray={reducedMotion ? "none" : "5,5"}
              />
            );
          })}
          {nodes.map(node => {
            const pos = layout.get(node.id);
            if (!pos) return null;
            return (
              <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle r={16} fill={KIND_COLORS[node.kind] || 'var(--app-dim)'} />
                {node.status && (
                  <circle cx={12} cy={-12} r={6} fill={STATUS_COLORS[node.status]} />
                )}
                {selectedId === node.id && (
                  <circle r={20} fill="none" stroke="var(--app-text)" strokeWidth={2} />
                )}
                <text y={32} fill="var(--app-text)" fontSize={12} textAnchor="middle">
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div 
      className={`agent-topology ${className}`} 
      ref={containerRef}
      style={{ maxHeight, height: maxHeight }}
      data-topology="true"
    >
      {useFallback ? (
        renderFallback()
      ) : (
        <canvas 
          ref={canvasRef} 
          className="agent-topology-canvas"
          onClick={handleCanvasClick}
        />
      )}
    </div>
  );
}
