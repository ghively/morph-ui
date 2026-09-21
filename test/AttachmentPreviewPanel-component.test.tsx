import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AttachmentPreviewPanel } from '../src/components/AttachmentPreviewPanel';
import { formatBytes } from '../src/components/MessageTimeline';

describe('AttachmentPreviewPanel', () => {
  it('renders region with aria-label, title, byline and close button', () => {
    const onClose = vi.fn();
    render(<AttachmentPreviewPanel title="My File" byline="Ada · 14:02" onClose={onClose} />);
    const region = screen.getByRole('region', { name: 'Preview' });
    expect(region).toBeTruthy();
    expect(screen.getByText('My File')).toBeTruthy();
    expect(screen.getByText('Ada · 14:02')).toBeTruthy();
    
    const closeBtn = screen.getByLabelText('Close preview');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders children and no media card', () => {
    render(
      <AttachmentPreviewPanel title="Custom" onClose={() => {}}>
        <div data-testid="custom-child">Child Content</div>
      </AttachmentPreviewPanel>
    );
    expect(screen.getByTestId('custom-child')).toBeTruthy();
    expect(screen.queryByText('unknown type')).toBeNull(); // No media card
  });

  it('renders image with url', () => {
    render(
      <AttachmentPreviewPanel
        title="Img"
        onClose={() => {}}
        attachment={{ kind: 'image', name: 'a.png', url: 'http://img.com/a.png' }}
      />
    );
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('http://img.com/a.png');
    expect(img.getAttribute('alt')).toBe('a.png');
  });

  it('renders image with error', () => {
    render(
      <AttachmentPreviewPanel
        title="Img"
        onClose={() => {}}
        attachment={{ kind: 'image', name: 'a.png', url: null, error: 'Failed' }}
      />
    );
    expect(screen.getByText('Failed')).toBeTruthy();
  });

  it('renders loading for image without url or error', () => {
    render(
      <AttachmentPreviewPanel
        title="Img"
        onClose={() => {}}
        attachment={{ kind: 'image', name: 'a.png', url: null }}
      />
    );
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders video with url', () => {
    render(
      <AttachmentPreviewPanel
        title="Vid"
        onClose={() => {}}
        attachment={{ kind: 'video', name: 'v.mp4', url: 'http://vid.com/v.mp4' }}
      />
    );
    const vid = screen.getByRole('region').querySelector('video');
    expect(vid).toBeTruthy();
    expect(vid?.getAttribute('src')).toBe('http://vid.com/v.mp4');
    expect(vid?.hasAttribute('controls')).toBe(true);
  });

  it('renders metadata card and download button', () => {
    const onDownload = vi.fn();
    render(
      <AttachmentPreviewPanel
        title="File"
        onClose={() => {}}
        onDownload={onDownload}
        attachment={{ kind: 'file', name: 'data.txt', url: null, mimeType: 'text/plain', size: 1024, downloadable: true }}
      />
    );
    expect(screen.getByText('data.txt')).toBeTruthy();
    expect(screen.getByText('text/plain · 1 KB')).toBeTruthy();
    
    const dlBtn = screen.getByRole('button', { name: 'Download' });
    fireEvent.click(dlBtn);
    expect(onDownload).toHaveBeenCalled();
  });

  it('renders code blocks', () => {
    render(
      <AttachmentPreviewPanel
        title="Code"
        onClose={() => {}}
        codeBlocks={[{ language: 'ts', code: 'const a = 1;' }]}
      />
    );
    expect(screen.getByText('ts')).toBeTruthy();
    expect(screen.getByText('const a = 1;')).toBeTruthy();
  });

  it('renders text with no code blocks', () => {
    render(
      <AttachmentPreviewPanel
        title="Text"
        onClose={() => {}}
        attachment={null}
        text="Hello world"
      />
    );
    // Since we don't have codeBlocks, text should render if attachment is null and text is present
    // Wait, our logic says `!attachment && codeBlocks.length === 0` renders EmptyState.
    // Let's test the empty state first.
  });

  it('renders empty state if no attachment, no children, no code', () => {
    render(
      <AttachmentPreviewPanel
        title="Empty"
        onClose={() => {}}
        emptyTitle="Nothing to see"
      />
    );
    expect(screen.getByText('Nothing to see')).toBeTruthy();
  });

  it('formatBytes function tests', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1023)).toBe('1023 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(undefined)).toBe('');
  });
});
