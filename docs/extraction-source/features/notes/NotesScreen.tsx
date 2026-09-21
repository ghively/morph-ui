import { useEffect, useMemo, useState } from "react";
import { ClientEvent } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useEventVersion } from "../../matrix/hooks";
import { sanitizeHtml } from "../../matrix/html";
import { marked } from "marked";
import { deleteNote, getNote, listNoteIds, newNoteId, saveNote, type Note } from "./notes";
import { Empty, useToast } from "../../components/primitives";
import { I } from "../../components/icons";
import { relativeTime } from "../../matrix/timeline";

export function NotesScreen() {
  const client = useClient();
  const toast = useToast();
  const v = useEventVersion(client, [ClientEvent.AccountData]);
  const notes = useMemo(() => listNoteIds(client).map((id) => getNote(client, id)).filter((n): n is Note => !!n), [client, v]); // eslint-disable-line react-hooks/exhaustive-deps
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Note | null>(null);
  const [preview, setPreview] = useState(false);
  const [q, setQ] = useState("");
  const active = notes.find((n) => n.id === activeId) ?? null;

  useEffect(() => {
    if (active && (!draft || draft.id !== active.id)) setDraft(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  const dirty = !!draft && (!active || draft.title !== active.title || draft.body !== active.body);
  const save = () =>
    draft &&
    void saveNote(client, draft).then(
      () => toast("Note saved", draft.title || "Untitled"),
      (e: Error) => toast("Couldn't save", e.message, "danger"),
    );
  const f = q.trim().toLowerCase();
  const shown = notes.filter((n) => !f || n.title.toLowerCase().includes(f) || n.body.toLowerCase().includes(f)).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div data-sec="gold" data-screen="" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      <div data-toolrail="">
        <div data-focusring="" data-search="" data-searchcap="">
          {I.search(14)}
          <input placeholder="Search notes" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--app-text)", fontSize: "var(--t-ctl)" }} aria-label="Search notes" />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "var(--s2)" }}>
          <button
            data-btn="fill"
            data-state=""
            onClick={() => {
              const n: Note = { id: newNoteId(), title: "", body: "", updatedAt: Date.now() };
              setDraft(n);
              setActiveId(n.id);
              setPreview(false);
            }}
          >
            {I.plus(14)}New note
          </button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(200px, 280px) minmax(0,1fr)", gap: "var(--s4)", padding: "8px var(--gut) 20px" }} data-notesgrid="">
        <div data-card="" data-pad="none" style={{ overflow: "auto" }}>
          <div data-rows="" data-gap="flush" role="listbox" aria-label="Notes">
            {shown.map((n) => (
              <button key={n.id} type="button" data-row="" data-state="" role="option" aria-selected={n.id === activeId} data-on={String(n.id === activeId)} onClick={() => setActiveId(n.id)} style={{ textAlign: "left", border: 0, background: n.id === activeId ? "var(--sec-soft)" : "transparent", color: "inherit", width: "100%" }}>
                <div data-fill="">
                  <div data-strong="">{n.title || "Untitled"}</div>
                  <div data-meta="">{relativeTime(n.updatedAt)}</div>
                </div>
              </button>
            ))}
            <Empty title={f ? "No notes match" : "No notes yet"}>{f ? "Try another word." : "Notes are private to your account and sync across your sessions."}</Empty>
          </div>
        </div>
        <div data-card="" data-pad="roomy" style={{ display: "flex", flexDirection: "column", gap: "var(--s3)", minHeight: 0 }}>
          {draft ? (
            <>
              <div style={{ display: "flex", gap: "var(--s2)", alignItems: "center" }}>
                <input data-field="" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" aria-label="Note title" style={{ fontWeight: 700 }} />
                <div data-seg="" role="radiogroup" aria-label="Mode">
                  <button data-segbtn="" data-on={String(!preview)} role="radio" aria-checked={!preview} onClick={() => setPreview(false)}>Write</button>
                  <button data-segbtn="" data-on={String(preview)} role="radio" aria-checked={preview} onClick={() => setPreview(true)}>Preview</button>
                </div>
              </div>
              {preview ? (
                <div data-prose="" style={{ flex: 1, overflow: "auto" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked.parse(draft.body, { async: false }) as string) }} />
              ) : (
                <textarea data-field="" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} aria-label="Note body (Markdown)" style={{ flex: 1, minHeight: 240, resize: "none", fontFamily: "var(--app-mono)", fontSize: "var(--t-ctl)" }} />
              )}
              <div style={{ display: "flex", gap: "var(--s2)" }}>
                <button data-btn="fill" data-state="" disabled={!dirty} onClick={save}>Save</button>
                {active ? (
                  <button data-btn="text" data-state="" data-tone="danger" onClick={() => window.confirm("Delete this note?") && void deleteNote(client, active.id).then(() => { setDraft(null); setActiveId(null); })}>
                    Delete
                  </button>
                ) : null}
                <span data-meta="" style={{ marginLeft: "auto", alignSelf: "center" }}>{dirty ? "Unsaved changes" : "Saved to your Matrix account"}</span>
              </div>
            </>
          ) : (
            <Empty title="Pick a note">Or start a new one.</Empty>
          )}
        </div>
      </div>
    </div>
  );
}
