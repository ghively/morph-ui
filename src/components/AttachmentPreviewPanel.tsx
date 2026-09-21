export { formatBytes } from "./MessageTimeline";
import type { ReactNode } from 'react';
import { formatBytes } from './MessageTimeline';
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
      className={className}
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
          <span aria-hidden="true" style={{width: 14, height: 14, display: 'inline-block'}}>&#10005;</span>
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
                <img src={attachment.url} alt={attachment.name} style={{ maxWidth: "100%", borderRadius: "var(--r-card)" }} />
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
                  {attachment.mimeType ?? "unknown type"} · {formatBytes(attachment.size)}
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

function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function CodeBlockCard({ language, code }: { language: string; code: string }) {
  return (
    <div data-code="">
      <div data-codehead="">
        <span data-num="">{language}</span>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
