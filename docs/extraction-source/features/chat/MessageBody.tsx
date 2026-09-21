import { useEffect, useRef } from "react";
import { EventType, MsgType, type MatrixClient, type MatrixEvent } from "matrix-js-sdk";
import { sanitizeHtml, stripReplyFallback, escapeHtml } from "../../matrix/html";
import { formatBytes, isMxc, mediaBlobUrl, useMedia, downloadMedia } from "../../matrix/media";
import { msgtype } from "../../matrix/timeline";
import { I } from "../../components/icons";

const URL_RE = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g;

function plainToHtml(body: string): string {
  return escapeHtml(body)
    .replace(URL_RE, (u) => `<a href="${u}" target="_blank" rel="noopener noreferrer nofollow">${u}</a>`)
    .replace(/\n/g, "<br>");
}

/** Wrap sanitized <pre> blocks in the design's code card and resolve mxc images. */
function enhance(root: HTMLElement, client: MatrixClient, onPill: (userId: string) => void): () => void {
  for (const pre of Array.from(root.querySelectorAll("pre"))) {
    if (pre.parentElement?.hasAttribute("data-code")) continue;
    const lang = pre.querySelector("code")?.getAttribute("data-lang") ?? "text";
    const wrap = document.createElement("div");
    wrap.setAttribute("data-code", "");
    const head = document.createElement("div");
    head.setAttribute("data-codehead", "");
    const label = document.createElement("span");
    label.setAttribute("data-num", "");
    label.textContent = lang;
    const copy = document.createElement("button");
    copy.setAttribute("data-btn", "text");
    copy.setAttribute("data-state", "");
    copy.setAttribute("aria-label", "Copy code");
    copy.style.cssText = "margin-left:auto;padding:3px var(--s3);font-size:var(--t-meta)";
    copy.textContent = "Copy";
    copy.addEventListener("click", () => {
      void navigator.clipboard?.writeText(pre.textContent ?? "");
      copy.textContent = "Copied";
      window.setTimeout(() => (copy.textContent = "Copy"), 1400);
    });
    head.append(label, copy);
    pre.replaceWith(wrap);
    wrap.append(head, pre);
  }
  for (const img of Array.from(root.querySelectorAll<HTMLImageElement>("img[data-mxc]"))) {
    const mxc = `mxc://${img.getAttribute("data-mxc")!}`;
    img.style.maxWidth = "100%";
    void mediaBlobUrl(client, mxc).then((u) => (img.src = u)).catch(() => (img.alt = img.alt || "image unavailable"));
  }
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a[data-pill]");
    if (!a) return;
    const m = /matrix\.to\/#\/(@[^/?]+)/.exec(a.getAttribute("href") ?? "");
    if (m?.[1]) {
      e.preventDefault();
      onPill(decodeURIComponent(m[1]));
    }
  };
  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}

export function MessageBody({ client, ev, onPill, onOpenArtifact }: { client: MatrixClient; ev: MatrixEvent; onPill: (userId: string) => void; onOpenArtifact?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const content = ev.getContent();
  const mt = msgtype(ev);
  const isHtml = content.format === "org.matrix.custom.html" && typeof content.formatted_body === "string";
  const html = isHtml ? sanitizeHtml(content.formatted_body as string) : typeof content.body === "string" ? plainToHtml(stripReplyFallback(content.body)) : "";

  useEffect(() => {
    if (!ref.current) return;
    return enhance(ref.current, client, onPill);
  }, [html, client, onPill]);

  if (ev.isRedacted()) {
    return (
      <div data-meta="" data-redacted="">
        Message deleted
      </div>
    );
  }
  if (ev.isDecryptionFailure() || (ev.getType() === EventType.RoomMessageEncrypted && !ev.isBeingDecrypted())) {
    return (
      <div data-meta="" data-undecryptable="" role="note">
        {I.lock(11)} Unable to decrypt this message{ev.decryptionFailureReason ? ` (${String(ev.decryptionFailureReason).toLowerCase().replace(/_/g, " ")})` : ""}. Verify this session or restore key backup in Workspace → Security.
      </div>
    );
  }
  if (ev.isBeingDecrypted()) return <div data-meta="">Decrypting…</div>;

  if (mt === MsgType.Image || mt === "m.sticker") return <ImageBody client={client} ev={ev} onOpen={onOpenArtifact} />;
  if (mt === MsgType.File || mt === MsgType.Video || mt === MsgType.Audio) return <FileBody client={client} ev={ev} onOpen={onOpenArtifact} />;

  return (
    <div
      ref={ref}
      data-prose=""
      data-msgbody=""
      data-notice={mt === MsgType.Notice ? "" : undefined}
      data-emote={mt === MsgType.Emote ? "" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ImageBody({ client, ev, onOpen }: { client: MatrixClient; ev: MatrixEvent; onOpen?: () => void }) {
  const c = ev.getContent();
  const info = (c.info ?? {}) as { w?: number; h?: number; size?: number; thumbnail_url?: string };
  const mxc = (info.thumbnail_url as string | undefined) ?? (c.url as string | undefined);
  const media = useMedia(client, mxc, { w: 800, h: 600 }, "image/");
  const ratio = info.w && info.h ? `${info.w} / ${info.h}` : undefined;
  return (
    <button type="button" data-media="image" onClick={onOpen} aria-label={`Open image ${c.body ?? ""}`} style={{ aspectRatio: ratio }}>
      {media.url ? <img src={media.url} alt={String(c.body ?? "image")} /> : <span data-meta="">{media.error ?? "Loading image…"}</span>}
    </button>
  );
}

function FileBody({ client, ev, onOpen }: { client: MatrixClient; ev: MatrixEvent; onOpen?: () => void }) {
  const c = ev.getContent();
  const mt = msgtype(ev);
  const name = String(c.filename ?? c.body ?? "file");
  const size = (c.info as { size?: number } | undefined)?.size;
  const url = c.url as string | undefined;
  const audio = useMedia(client, mt === MsgType.Audio ? url : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)", alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" data-chip="" data-state="" onClick={onOpen} data-filechip="">
          {I.file(13)}
          {name}
          {size ? (
            <span data-num="" style={{ color: "var(--app-faint)" }}>
              {formatBytes(size)}
            </span>
          ) : null}
        </button>
        {isMxc(url) ? (
          <button type="button" data-btn="text" data-state="" onClick={() => void downloadMedia(client, url, name)} aria-label={`Download ${name}`}>
            Download
          </button>
        ) : null}
      </div>
      {mt === MsgType.Audio && audio.url ? <audio controls src={audio.url} preload="metadata" aria-label={name} /> : null}
    </div>
  );
}
