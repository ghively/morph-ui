import { describe, it, expect } from 'vitest';
import { formatBytes, formatTimeLabel } from '../src/components/messageFormat';
import * as Timeline from '../src/components/MessageTimeline';
import * as Panel from '../src/components/AttachmentPreviewPanel';

describe('messageFormat', () => {
  it('formatBytes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(null)).toBe('');
  });
  it('formatTimeLabel returns a non-empty label', () => {
    expect(formatTimeLabel(Date.UTC(2026, 0, 1, 14, 2)).length).toBeGreaterThan(0);
  });
  it('legacy re-exports point at the same binding', () => {
    expect(Timeline.formatBytes).toBe(formatBytes);
    expect(Timeline.formatTimeLabel).toBe(formatTimeLabel);
    expect(Panel.formatBytes).toBe(formatBytes);
  });
});
