import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CollaborativeCanvas } from '../src/components/CollaborativeCanvas';
import { CanvasToolbar } from '../src/components/CanvasToolbar';
import { CanvasVersionRail } from '../src/components/CanvasVersionRail';
import { InlineCommentThread } from '../src/components/InlineCommentThread';
import { ArtifactCardGrid } from '../src/components/ArtifactCardGrid';
import { CanvasMiniMap } from '../src/components/CanvasMiniMap';
import { PresenceAvatarCluster } from '../src/components/PresenceAvatarCluster';
import { CanvasStatusBar } from '../src/components/CanvasStatusBar';
import { SectionOutline } from '../src/components/SectionOutline';
import { LiveCursors } from '../src/components/LiveCursors';

const NOW = '2026-03-12T10:30:00Z';

describe('CollaborativeCanvas', () => {
  it('renders children, cursors and the roster with identity hues', () => {
    const { container } = render(
      <CollaborativeCanvas
        collaborators={[
          { id: 'gene', name: 'Gene', x: 400, y: 100, hue: 2 },
          { id: 'maya', name: 'Maya', x: 100, y: 300 },
        ]}
        contentWidth={800}
        contentHeight={400}
      >
        <p>Canvas body</p>
      </CollaborativeCanvas>,
    );
    expect(container.querySelector('[data-canvas-content]')?.textContent).toContain('Canvas body');
    expect(container.querySelectorAll('[data-cursor-id]').length).toBe(2);
    const roster = container.querySelector('[data-canvas-roster]');
    expect(roster?.textContent).toContain('Gene');
    expect(roster?.querySelector('[data-collaborator-id="gene"]')?.getAttribute('style')).toContain('--series-2');
  });

  it('zoom controls step zoom and report onZoomChange', () => {
    const onZoomChange = vi.fn();
    const { container } = render(
      <CollaborativeCanvas contentWidth={400} contentHeight={300} defaultZoom={1} onZoomChange={onZoomChange} />,
    );
    fireEvent.click(container.querySelector('[data-zoom-action="in"]')!);
    expect(onZoomChange).toHaveBeenLastCalledWith(1.25);
    fireEvent.click(container.querySelector('[data-zoom-action="in"]')!);
    expect(onZoomChange).toHaveBeenLastCalledWith(1.5);
    fireEvent.click(container.querySelector('[data-zoom-action="out"]')!);
    expect(onZoomChange).toHaveBeenLastCalledWith(1.25);
    fireEvent.click(container.querySelector('[data-zoom-action="reset"]')!);
    expect(onZoomChange).toHaveBeenLastCalledWith(1);
    expect(container.querySelector('.cv-zoom-pct-text')?.textContent).toBe('100%');
  });

  it('honours controlled zoom and hides controls on demand', () => {
    const { container, rerender } = render(<CollaborativeCanvas zoom={2} contentWidth={400} contentHeight={300} />);
    expect(container.querySelector('.cv-zoom-pct-text')?.textContent).toBe('200%');
    rerender(<CollaborativeCanvas zoom={2} hideZoomControls contentWidth={400} contentHeight={300} />);
    expect(container.querySelector('[data-canvas-zoom-controls]')).toBeNull();
  });

  it('draws the selection outline with its label', () => {
    const { container } = render(
      <CollaborativeCanvas
        contentWidth={800}
        contentHeight={400}
        selection={{ x: 80, y: 60, width: 240, height: 120, label: 'Intro' }}
      />,
    );
    const sel = container.querySelector('[data-canvas-selection]');
    expect(sel).not.toBeNull();
    expect(sel?.textContent).toContain('Intro');
  });
});

describe('CanvasToolbar', () => {
  it('renders five tools with one active and switches on click', () => {
    const onToolChange = vi.fn();
    const { container } = render(<CanvasToolbar onToolChange={onToolChange} defaultTool="select" />);
    const toolbar = container.querySelector('[data-canvas-toolbar]');
    expect(toolbar?.getAttribute('role')).toBe('toolbar');
    expect(container.querySelectorAll('.cv-tool-btn').length).toBe(5);
    expect(container.querySelector('[data-tool="select"]')?.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(container.querySelector('[data-tool="pen"]')!);
    expect(onToolChange).toHaveBeenCalledWith('pen');
    expect(container.querySelector('[data-tool="pen"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-tool="select"]')?.getAttribute('aria-pressed')).toBe('false');
  });

  it('respects a restricted tool list and controlled state', () => {
    const { container } = render(<CanvasToolbar tools={['select', 'pen']} tool="pen" />);
    expect(container.querySelectorAll('.cv-tool-btn').length).toBe(2);
    expect(container.querySelector('[data-tool="pen"]')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('roves with arrow keys (center dock → ArrowRight)', () => {
    const onToolChange = vi.fn();
    const { container } = render(<CanvasToolbar defaultTool="select" onToolChange={onToolChange} />);
    const toolbar = container.querySelector('[data-canvas-toolbar]')!;
    fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
    expect(onToolChange).toHaveBeenCalledWith('pan');
  });
});

describe('CanvasVersionRail', () => {
  const versions = [
    { id: 'v1', at: '2026-03-12T08:00:00Z', by: 'Maya', label: 'Initial draft' },
    { id: 'v2', at: '2026-03-12T10:00:00Z', by: 'Gene', label: 'Tightened intro' },
  ];

  it('marks the latest as current and shows Restore on the others', () => {
    const { container } = render(<CanvasVersionRail versions={versions} now={NOW} />);
    expect(container.querySelector('[data-version-id="v2"]')?.getAttribute('data-current')).toBe('true');
    expect(container.querySelector('[data-version-id="v2"] [data-version-state="current"]')?.textContent).toBe('Current');
    expect(container.querySelector('[data-version-restore="v1"]')).not.toBeNull();
  });

  it('fires restore and select', () => {
    const onRestore = vi.fn();
    const onSelect = vi.fn();
    const { container } = render(
      <CanvasVersionRail versions={versions} currentId="v2" now={NOW} onRestore={onRestore} onSelect={onSelect} />,
    );
    fireEvent.click(container.querySelector('[data-version-restore="v1"]')!);
    expect(onRestore).toHaveBeenCalledWith('v1');
    fireEvent.click(container.querySelector('[data-version-id="v1"]')!);
    expect(onSelect).toHaveBeenCalledWith('v1');
  });

  it('renders timestamps as relative labels', () => {
    const versions2 = [
      { id: 'v1', at: '2026-03-12T08:20:00Z', by: 'Maya', label: 'Initial draft' },
      { id: 'v2', at: '2026-03-12T10:00:00Z', by: 'Gene', label: 'Tightened intro' },
    ];
    const { container } = render(<CanvasVersionRail versions={versions2} now={NOW} />);
    expect(container.querySelector('[data-version-id="v1"] time')?.textContent).toBe('2h ago');
  });
});

describe('InlineCommentThread', () => {
  const replies = [
    { id: 'r1', author: 'Gene', at: '2026-03-12T10:00:00Z', body: 'First reply' },
    { id: 'r2', author: 'Riya', at: '2026-03-12T10:05:00Z', body: 'Second reply' },
  ];

  it('lists replies and counts comments', () => {
    const { container } = render(
      <InlineCommentThread author="Maya" at="2026-03-12T09:00:00Z" body="Root" replies={replies} now={NOW} />,
    );
    expect(container.querySelectorAll('[data-comment-replies] li').length).toBe(2);
    expect(container.querySelector('[data-comment-count]')?.textContent).toContain('3 comments');
  });

  it('sends a reply through the composer (button + Enter)', () => {
    const onReply = vi.fn();
    const { container } = render(
      <InlineCommentThread author="Maya" at="2026-03-12T09:00:00Z" body="Root" onReply={onReply} />,
    );
    const input = container.querySelector('[data-reply-input]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Looks good' } });
    fireEvent.click(container.querySelector('[data-reply-send]')!);
    expect(onReply).toHaveBeenCalledWith('Looks good');
    expect(input.value).toBe('');
    fireEvent.change(input, { target: { value: 'Again' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onReply).toHaveBeenCalledWith('Again');
  });

  it('toggles resolved state and disables the composer while resolved', () => {
    const onResolveChange = vi.fn();
    const { container } = render(
      <InlineCommentThread author="Maya" at="2026-03-12T09:00:00Z" body="Root" onResolveChange={onResolveChange} />,
    );
    expect(container.querySelector('[data-comment-thread]')?.getAttribute('data-resolved')).toBe('false');
    fireEvent.click(container.querySelector('[data-resolve-toggle]')!);
    expect(onResolveChange).toHaveBeenCalledWith(true);
    expect(container.querySelector('[data-comment-thread]')?.getAttribute('data-resolved')).toBe('true');
    expect((container.querySelector('[data-reply-input]') as HTMLInputElement).disabled).toBe(true);
    fireEvent.click(container.querySelector('[data-resolve-toggle]')!);
    expect(onResolveChange).toHaveBeenCalledWith(false);
  });

  it('honours controlled resolved state', () => {
    const { container } = render(
      <InlineCommentThread author="Maya" at="2026-03-12T09:00:00Z" body="Root" resolved onResolveChange={() => {}} />,
    );
    expect(container.querySelector('[data-comment-thread]')?.getAttribute('data-resolved')).toBe('true');
    expect(container.querySelector('[data-resolve-toggle]')?.textContent).toBe('Reopen thread');
  });
});

describe('ArtifactCardGrid', () => {
  const artifacts = [
    { id: 'a1', title: 'Q4 Launch Brief', kind: 'doc' as const, updatedAt: '2026-03-12T10:22:00Z' },
    { id: 'a2', title: 'Pricing Model', kind: 'sheet' as const, updatedAt: '2026-03-11T16:45:00Z' },
    { id: 'a3', title: 'deploy.sh', kind: 'code' as const, updatedAt: '2026-03-10T09:12:00Z' },
  ];

  it('renders cards with kind, title and relative updated-at', () => {
    const { container } = render(<ArtifactCardGrid artifacts={artifacts} now={NOW} />);
    expect(container.querySelectorAll('.cv-artifact-card').length).toBe(3);
    expect(container.querySelector('[data-artifact-id="a1"]')?.getAttribute('data-kind')).toBe('doc');
    expect(container.querySelector('[data-artifact-id="a1"] time')?.textContent).toBe('8m ago');
    expect(container.querySelector('[data-artifact-id="a3"] .cv-artifact-title')?.textContent).toBe('deploy.sh');
  });

  it('selects on click and opens via the Open action without re-selecting', () => {
    const onSelect = vi.fn();
    const onOpen = vi.fn();
    const { container } = render(
      <ArtifactCardGrid artifacts={artifacts} now={NOW} onSelect={onSelect} onOpen={onOpen} />,
    );
    fireEvent.click(container.querySelector('[data-artifact-id="a2"]')!);
    expect(onSelect).toHaveBeenCalledWith('a2');
    onSelect.mockClear();
    fireEvent.click(container.querySelector('[data-artifact-open="a2"]')!);
    expect(onOpen).toHaveBeenCalledWith('a2');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reflects the controlled selection in aria-selected', () => {
    const { container } = render(<ArtifactCardGrid artifacts={artifacts} now={NOW} selectedId="a1" />);
    expect(container.querySelector('[data-artifact-id="a1"]')?.getAttribute('aria-selected')).toBe('true');
    expect(container.querySelector('[data-artifact-id="a2"]')?.getAttribute('aria-selected')).toBe('false');
  });
});

describe('CanvasMiniMap', () => {
  it('draws the viewport rect scaled to content size', () => {
    const { container } = render(
      <CanvasMiniMap contentWidth={800} contentHeight={400} viewport={{ x: 200, y: 100, width: 400, height: 200 }} width={160} />,
    );
    const vp = container.querySelector('[data-minimap-viewport]') as HTMLElement;
    expect(vp.style.left).toBe('25%');
    expect(vp.style.top).toBe('25%');
    expect(vp.style.width).toBe('50%');
    expect(vp.style.height).toBe('50%');
  });

  it('reports the clicked point in content coordinates', () => {
    const onViewportChange = vi.fn();
    const { container } = render(
      <CanvasMiniMap contentWidth={800} contentHeight={400} viewport={{ x: 0, y: 0, width: 400, height: 200 }} onViewportChange={onViewportChange} />,
    );
    const map = container.querySelector('[data-minimap]') as HTMLElement;
    map.getBoundingClientRect = () => ({ left: 0, top: 0, width: 160, height: 80, right: 160, bottom: 80, x: 0, y: 0, toJSON: () => '' }) as DOMRect;
    fireEvent.pointerDown(map, { clientX: 80, clientY: 40, pointerId: 1 });
    expect(onViewportChange).toHaveBeenCalledWith({ x: 400, y: 200 });
  });

  it('steps the viewport with arrow keys', () => {
    const onViewportChange = vi.fn();
    const { container } = render(
      <CanvasMiniMap
        contentWidth={800}
        contentHeight={400}
        viewport={{ x: 0, y: 0, width: 400, height: 200 }}
        onViewportChange={onViewportChange}
      />,
    );
    fireEvent.keyDown(container.querySelector('[data-minimap]')!, { key: 'ArrowRight' });
    expect(onViewportChange).toHaveBeenCalledWith({ x: 300, y: 100 });
  });
});

describe('PresenceAvatarCluster', () => {
  const team = [
    { id: 'gene', name: 'Gene', hue: 1 },
    { id: 'maya', name: 'Maya Patel', hue: 2 },
    { id: 'riya', name: 'Riya Chen', hue: 3 },
    { id: 'sam', name: 'Sam Osei', hue: 4 },
    { id: 'tess', name: 'Tess Whitfield', hue: 5 },
  ];

  it('overlaps avatars, folds overflow into +N, and expands the roster', () => {
    const { container } = render(<PresenceAvatarCluster collaborators={team} max={3} />);
    const trigger = container.querySelector('[data-presence-cluster] button')!;
    expect(trigger.querySelectorAll('.cv-presence-avatar').length).toBe(3);
    expect(trigger.querySelector('[data-presence-more]')?.textContent).toBe('+2');
    expect(trigger.getAttribute('aria-label')).toBe('5 collaborators online');
    fireEvent.click(trigger);
    const roster = container.querySelector('[data-presence-roster]');
    expect(roster?.querySelectorAll('li').length).toBe(5);
    expect(roster?.textContent).toContain('Tess Whitfield');
  });

  it('gives every collaborator a stable series hue', () => {
    const { container } = render(<PresenceAvatarCluster collaborators={team} max={5} />);
    const style = container.querySelector('[data-collaborator-id="riya"]')?.getAttribute('style');
    expect(style).toContain('--series-3');
  });
});

describe('CanvasStatusBar', () => {
  it('shows zoom, coords, tool and live connection', () => {
    const { container } = render(<CanvasStatusBar zoom={1.25} cursor={{ x: 380.4, y: 129.6 }} tool="Select" connection="live" />);
    expect(container.querySelector('[data-status-zoom]')?.textContent).toContain('125%');
    expect(container.querySelector('[data-status-coords]')?.textContent).toContain('380, 130');
    expect(container.querySelector('[data-status-tool]')?.textContent).toContain('Select');
    expect(container.querySelector('[data-status-connection]')?.textContent).toContain('Live');
    expect(container.querySelector('[data-canvas-statusbar]')?.getAttribute('data-connection')).toBe('live');
  });

  it('hides the coords item when no cursor is supplied', () => {
    const { container } = render(<CanvasStatusBar tool="Pen" connection="syncing" />);
    expect(container.querySelector('[data-status-coords]')).toBeNull();
    expect(container.querySelector('[data-status-connection]')?.textContent).toContain('Syncing');
  });
});

describe('SectionOutline', () => {
  const sections = [
    { id: 's1', title: 'Overview', level: 0 },
    { id: 's2', title: 'Audience', level: 1 },
    { id: 's3', title: 'Risks', level: 0 },
  ];

  it('renders entries with levels and highlights the active section', () => {
    const { container } = render(<SectionOutline sections={sections} activeId="s2" />);
    const items = container.querySelectorAll('[data-outline-item]');
    expect(items.length).toBe(3);
    expect(container.querySelector('li[data-active="true"] [data-outline-item="s2"]')).not.toBeNull();
    expect(container.querySelector('li[data-level="1"]')).not.toBeNull();
    expect(container.querySelector('[data-outline-item="s2"]')?.getAttribute('aria-current')).toBe('true');
  });

  it('collapses and expands with the toggle, reporting the change', () => {
    const onCollapsedChange = vi.fn();
    const { container } = render(<SectionOutline sections={sections} onCollapsedChange={onCollapsedChange} />);
    const toggle = container.querySelector('[data-outline-toggle]') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('.cv-outline-wrap')?.classList.contains('is-collapsed')).toBe(true);
  });

  it('selects a section on click', () => {
    const onSelect = vi.fn();
    const { container } = render(<SectionOutline sections={sections} onSelect={onSelect} />);
    fireEvent.click(container.querySelector('[data-outline-item="s3"]')!);
    expect(onSelect).toHaveBeenCalledWith('s3');
  });
});

describe('LiveCursors', () => {
  it('renders one labeled cursor per positioned collaborator, coloured by series hue', () => {
    const { container } = render(
      <LiveCursors
        collaborators={[
          { id: 'gene', name: 'Gene', x: 200, y: 100, hue: 3 },
          { id: 'maya', name: 'Maya', x: 50, y: 30 },
          { id: 'idle', name: 'Idle Person' },
        ]}
        contentWidth={400}
        contentHeight={200}
      />,
    );
    const cursors = container.querySelectorAll('[data-cursor-id]');
    expect(cursors.length).toBe(2);
    expect(cursors[0].textContent).toContain('Gene');
    expect(cursors[0].getAttribute('style')).toContain('--series-3');
    expect(container.querySelector('[data-live-cursors]')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('positions cursors by percentage of content size', () => {
    const { container } = render(
      <LiveCursors collaborators={[{ id: 'a', name: 'A', x: 100, y: 50 }]} contentWidth={200} contentHeight={100} />,
    );
    const cursor = container.querySelector('[data-cursor-id="a"]') as HTMLElement;
    expect(cursor.style.left).toBe('50%');
    expect(cursor.style.top).toBe('50%');
  });
});
