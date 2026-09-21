import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AgentTopologyView } from '../src/components/AgentTopologyView';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

describe('AgentTopologyView', () => {
  let originalMatchMedia: typeof window.matchMedia;

  const sampleNodes = [
    { id: '1', label: 'Agent 1', kind: 'agent' as const },
    { id: '2', label: 'Tool 1', kind: 'tool' as const, status: 'active' as const },
  ];
  const sampleEdges = [
    { from: '1', to: '2' },
  ];

  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    
    originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('renders structure and data attributes', () => {
    const { container } = render(
      <AgentTopologyView nodes={sampleNodes} edges={sampleEdges} />
    );
    const root = container.querySelector('.agent-topology');
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-topology')).toBe('true');
  });

  it('renders SVG fallback when canvas getContext returns null', () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);
    
    const { container } = render(
      <AgentTopologyView nodes={sampleNodes} edges={sampleEdges} />
    );
    
    expect(container.querySelector('.agent-topology-svg')).toBeTruthy();
    expect(container.querySelector('canvas')).toBeFalsy();
    
    // Check that nodes are represented in SVG
    expect(container.textContent).toContain('Agent 1');
    expect(container.textContent).toContain('Tool 1');
    
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('renders canvas when context is available', () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      save: vi.fn(),
      translate: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      setLineDash: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
    });
    
    const { container } = render(
      <AgentTopologyView nodes={sampleNodes} edges={sampleEdges} />
    );
    
    expect(container.querySelector('canvas')).toBeTruthy();
    expect(container.querySelector('.agent-topology-svg')).toBeFalsy();
    
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});
