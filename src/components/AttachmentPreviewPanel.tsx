import { useState } from 'react';
import type { ReactNode } from 'react';
import { formatBytes } from './messageFormat';
export { formatBytes } from './messageFormat';
import { EmptyState } from './EmptyState';
import { CodeBlockCard } from './CodeBlockCard';
import { GlyphIcon } from './GlyphIcon';
import './AttachmentPreviewPanel.css';

export interface PreviewCodeBlock { language: string; code: string; }

export interface MediaPreview {
  kind: 'image' | 'video' | 'audio' | 'file';
  url: string | null;
  error?: string | null;
  name: string;
  mimeType?: string;
  size?: number;
  downloadable?: boolean;
}

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml', bmp: 'image/bmp', heic: 'image/heic',
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', mkv: 'video/x-matroska',
  mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4', flac: 'audio/flac', opus: 'audio/opus',
  pdf: 'application/pdf', zip: 'application/zip', json: 'application/json', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', html: 'text/html',
};

/** Best-effort MIME type from a file name's extension; null when unknown. */
export function inferMimeType(name: string | null | undefined): string | null {
  const m = /\.([a-z0-9]+)$/i.exec(name ?? '');
  return m ? MIME_BY_EXT[m[1].toLowerCase()] ?? null : null;
}

/** Image that swaps to a quiet placeholder when it fails, instead of the UA broken-image icon + alt text. */
function PreviewImage({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div data-previewph="" role="img" aria-label={`${name} (preview unavailable)`}>
        <GlyphIcon name="file" size={20} />
        <span data-meta="">Preview unavailable</span>
      </div>
    );
  }
  return <img data-previewimg="" src={url} alt={name} onError={() => setFailed(true)} />;
}

export interface AttachmentPreviewPanelProps {
  title: string;
  byline?: string;
  icon?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  label?: string;
  attachment?: MediaPreview | null;
  codeBlocks?: PreviewCodeBlock[];
  text?: string;
  children?: ReactNode;
  onDownload?: () => void;
  emptyTitle?: string;
  emptyHint?: ReactNode;
  className?: string;
}

export function AttachmentPreviewPanel(props: AttachmentPreviewPanelProps) {
  const {
    title,
    byline,
    icon,
    onClose,
    closeLabel = 'Close preview',
    label = 'Preview',
    attachment,
    codeBlocks = [],
    text,
    children,
    onDownload,
    emptyTitle = 'Not loaded',
    emptyHint,
    className
  } = props;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      role="region"
      aria-label={label}
      className={['attachment-preview', className].filter(Boolean).join(' ')}
    >
      <div data-panehead="">
        <div data-tile="" style={{ width: 26, height: 26 }}>
          {icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div data-strong="" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </div>
          {byline ? <div data-meta="">{byline}</div> : null}
        </div>
        <button data-iconbtn="" onClick={onClose} aria-label={closeLabel}>
          <GlyphIcon name="close" size={14} />
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "var(--s4) var(--s5)", display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
        {children ? (
          children
        ) : !attachment && codeBlocks.length === 0 ? (
          <EmptyState title={emptyTitle}>{emptyHint || "This message isn't in the loaded history."}</EmptyState>
        ) : (
          <>
            {attachment?.kind === 'image' ? (
              attachment.url ? (
                <PreviewImage key={attachment.url} url={attachment.url} name={attachment.name} />
              ) : (
                <span data-meta="">{attachment.error ?? "Loading…"}</span>
              )
            ) : null}

            {attachment?.kind === 'video' && attachment.url ? (
              <video src={attachment.url} controls style={{ maxWidth: "100%", borderRadius: "var(--r-card)" }} />
            ) : null}

            {attachment ? (
              <div data-card="">
                <div data-strong="">{attachment.name}</div>
                <div data-meta="">
                  {[attachment.mimeType ?? inferMimeType(attachment.name) ?? "unknown type", formatBytes(attachment.size)].filter(Boolean).join(" · ")}
                </div>
                {attachment.downloadable ? (
                  <button data-btn="fill" data-state="" style={{ marginTop: "var(--s3)" }} onClick={onDownload}>
                    Download
                  </button>
                ) : null}
              </div>
            ) : null}

            {codeBlocks.map((b, i) => (
              <CodeBlockCard key={i} language={b.language} code={b.code} />
            ))}

            {!codeBlocks.length && (attachment?.kind === 'file' || attachment?.kind === 'audio' || !attachment) && text ? (
              <div data-prose="">{text}</div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
