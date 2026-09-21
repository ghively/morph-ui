import { useRef, useState } from 'react';
import './FileDropzone.css';

export interface DroppedFile {
  name: string;
  size: number;
  type: string;
}

export interface FileDropzoneProps {
  id: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  onFiles?: (files: File[]) => void;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

function describeSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Drag-and-drop corpus upload with file list, sizes, and validation errors. */
export function FileDropzone({
  id,
  label = 'Upload documents',
  accept,
  multiple = true,
  maxSizeBytes,
  onFiles,
  hint = 'PDF, DOCX, TXT, or Markdown. Parsed and chunked on upload.',
  disabled,
  className = '',
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const ingest = (list: FileList | File[]) => {
    const incoming = Array.from(list);
    const errs: string[] = [];
    const ok: DroppedFile[] = [];
    for (const f of incoming) {
      if (maxSizeBytes && f.size > maxSizeBytes) {
        errs.push(`${f.name} exceeds ${describeSize(maxSizeBytes)}.`);
        continue;
      }
      ok.push({ name: f.name, size: f.size, type: f.type });
    }
    setErrors(errs);
    if (ok.length > 0) {
      setFiles((prev) => [...prev, ...ok]);
      onFiles?.(incoming.filter((f) => !(maxSizeBytes && f.size > maxSizeBytes)));
    }
  };

  return (
    <div className={className} data-dropzone="">
      <div
        data-droparea=""
        data-dragging={dragging ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (disabled) return;
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (disabled) return;
          dragDepth.current = 0;
          setDragging(false);
          if (e.dataTransfer.files.length > 0) ingest(e.dataTransfer.files);
        }}
      >
        <svg data-dropicon="" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
          <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
        </svg>
        <span data-droptitle="">{dragging ? 'Drop to upload' : label}</span>
        <span data-drophint="">{hint}</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          data-dropinput=""
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) ingest(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {errors.length > 0 && (
        <ul data-droperrors="" role="alert">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <ul data-droplist="">
          {files.map((f) => (
            <li key={`${f.name}-${f.size}`} data-dropfile="">
              <span data-dropfilename="">{f.name}</span>
              <span data-dropfilesize="">{describeSize(f.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => setFiles((prev) => prev.filter((x) => !(x.name === f.name && x.size === f.size)))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
