import { useMemo } from "react";
import { MsgType, RoomEvent } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { useEventVersion } from "../../matrix/hooks";
import { downloadMedia, formatBytes, isMxc, useMedia } from "../../matrix/media";
import { displayNameFor } from "../../matrix/rooms";
import { formatTime, msgtype } from "../../matrix/timeline";
import { I } from "../../components/icons";
import { Empty } from "../../components/primitives";
import { uiArtifactLabel, uiArtifactOf } from "../../artifacts/uiArtifact";
import { UiArtifactView } from "./UiArtifactView";

/**
 * The artifact panel previews what a Matrix message already carries — images,
 * files, code blocks — without changing message semantics (spec §25), and
 * runs dev.chatuimorph.artifact.ui events as interactive UI in a sandboxed
 * frame (see artifacts/openui/frame.ts for the isolation rules).
 */
export function ArtifactPanel({ roomId, eventId }: { roomId: string; eventId: string }) {
  const client = useClient();
  const shell = useShell();
  const room = client.getRoom(roomId);
  useEventVersion(room, [RoomEvent.Timeline]);
  const ev = room?.findEventById(eventId) ?? null;
  const c = ev?.getContent() ?? {};
  const mt = ev ? msgtype(ev) : "";
  const url = c.url as string | undefined;
  const media = useMedia(client, mt === MsgType.Image || mt === MsgType.Video ? url : undefined);
  const code = useMemo(() => {
    const html = String(c.formatted_body ?? "");
    const blocks: { lang: string; text: string }[] = [];
    if (html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      doc.querySelectorAll("pre").forEach((p) => {
        const lang = /language-([\w+#.-]+)/.exec(p.querySelector("code")?.className ?? "")?.[1] ?? "text";
        blocks.push({ lang, text: p.textContent ?? "" });
      });
    } else {
      const re = /```(\w*)\n([\s\S]*?)```/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(String(c.body ?? "")))) blocks.push({ lang: m[1] || "text", text: m[2] ?? "" });
    }
    return blocks;
  }, [c.formatted_body, c.body]);

  const name = String(c.filename ?? c.body ?? "Artifact");
  const artifact = uiArtifactOf(ev);
  const who = ev ? `${displayNameFor(room, ev.getSender() ?? "", client)} · ${formatTime(ev.getTs())}` : "";

  if (artifact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }} role="region" aria-label="Artifact">
        <div data-panehead="">
          <div data-tile="" style={{ width: 26, height: 26 }}>
            {I.artifacts(14)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div data-strong="" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {uiArtifactLabel(artifact)}
            </div>
            <div data-meta="">{who}</div>
          </div>
          <button data-iconbtn="" onClick={() => shell.closeRight()} aria-label="Close artifact">
            {I.close()}
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "var(--s4) var(--s5)" }}>
          <UiArtifactView artifact={artifact} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} role="region" aria-label="Artifact">
      <div data-panehead="">
        <div data-tile="" style={{ width: 26, height: 26 }}>
          {I.artifacts(14)}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div data-strong="" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {mt === MsgType.Image || mt === MsgType.File || mt === MsgType.Video || mt === MsgType.Audio ? name : "Code"}
          </div>
          <div data-meta="">{who}</div>
        </div>
        <button data-iconbtn="" onClick={() => shell.closeRight()} aria-label="Close artifact">
          {I.close()}
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "var(--s4) var(--s5)", display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
        {!ev ? <Empty title="Not loaded">This message isn't in the loaded history.</Empty> : null}
        {ev && mt === MsgType.Image ? media.url ? <img src={media.url} alt={name} style={{ maxWidth: "100%", borderRadius: "var(--r-card)" }} /> : <span data-meta="">{media.error ?? "Loading…"}</span> : null}
        {ev && mt === MsgType.Video && media.url ? <video src={media.url} controls style={{ maxWidth: "100%", borderRadius: "var(--r-card)" }} /> : null}
        {ev && (mt === MsgType.File || mt === MsgType.Audio || mt === MsgType.Video || mt === MsgType.Image) ? (
          <div data-card="">
            <div data-strong="">{name}</div>
            <div data-meta="">
              {String((c.info as { mimetype?: string } | undefined)?.mimetype ?? "unknown type")} · {formatBytes((c.info as { size?: number } | undefined)?.size)}
            </div>
            {isMxc(url) ? (
              <button data-btn="fill" data-state="" style={{ marginTop: "var(--s3)" }} onClick={() => void downloadMedia(client, url, name)}>
                Download
              </button>
            ) : null}
          </div>
        ) : null}
        {code.map((b, i) => (
          <div key={i} data-code="">
            <div data-codehead="">
              <span data-num="">{b.lang}</span>
              <button data-btn="text" data-state="" style={{ marginLeft: "auto", padding: "3px var(--s3)", fontSize: "var(--t-meta)" }} onClick={() => void navigator.clipboard?.writeText(b.text)} aria-label="Copy code">
                Copy
              </button>
            </div>
            <pre>{b.text}</pre>
          </div>
        ))}
        {ev && !code.length && mt === MsgType.Text ? <div data-prose="">{String(c.body ?? "")}</div> : null}
      </div>
    </div>
  );
}
