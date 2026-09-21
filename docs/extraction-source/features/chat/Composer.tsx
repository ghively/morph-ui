import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as RKE } from "react";
import type { MatrixClient, MatrixEvent, Room } from "matrix-js-sdk";
import type { MentionRef } from "../../matrix/html";
import { editMessage, sendFile, sendText } from "../../matrix/messages";
import { uploadFile } from "../../matrix/media";
import { displayNameFor } from "../../matrix/rooms";
import { previewText } from "../../matrix/timeline";
import { agentProfileInRoom, runtimeLabel } from "../../agent/profile";
import { I } from "../../components/icons";
import { MultimodalComposer } from "../../components/MultimodalComposer";
import { Avatar, useToast } from "../../components/primitives";
import { usePrefs } from "../../app/prefs";
import { MENTION_EVENT, type MentionDetail } from "../../app/shell/ShellContext";
import { FOLD_QUERY } from "../../app/shell/columns";

interface Draft {
  text: string;
  mentions: MentionRef[];
}

const draftKey = (roomId: string, threadId: string | null) => `chatuimorph.draft:${roomId}:${threadId ?? "main"}`;

function loadDraft(key: string): Draft {
  try {
    const d = JSON.parse(localStorage.getItem(key) ?? "null") as Draft | null;
    if (d && typeof d.text === "string" && Array.isArray(d.mentions)) return d;
  } catch {
    /* ignore */
  }
  return { text: "", mentions: [] };
}

interface Candidate {
  userId: string;
  name: string;
  agent: string | null;
  mxc: string | null;
}

export function Composer({
  client,
  room,
  threadId,
  replyTo,
  onCancelReply,
  editing,
  onCancelEdit,
  onEditLast,
  offline,
  primary,
}: {
  client: MatrixClient;
  room: Room;
  threadId: string | null;
  replyTo: MatrixEvent | null;
  onCancelReply: () => void;
  editing: MatrixEvent | null;
  onCancelEdit: () => void;
  onEditLast: () => void;
  offline: boolean;
  primary: boolean;
}) {
  const toast = useToast();
  const { prefs } = usePrefs();
  const key = draftKey(room.roomId, threadId);
  const [draft, setDraftState] = useState<Draft>(() => loadDraft(key));
  const [ac, setAc] = useState<{ start: number; query: string; index: number } | null>(null);
  const [uploads, setUploads] = useState<{ name: string; pct: number }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  // const fileInput = useRef<HTMLInputElement>(null);
  const typingAt = useRef(0);
  const beforeEdit = useRef<Draft | null>(null);

  const setDraft = useCallback(
    (d: Draft) => {
      setDraftState(d);
      if (editing) return; // an edit is not a draft
      if (d.text) localStorage.setItem(key, JSON.stringify(d));
      else localStorage.removeItem(key);
    },
    [key, editing],
  );

  // Switching conversation swaps drafts without cross-contamination, and puts the
  // caret where the keyboard user expects it (not on narrow screens: no surprise keyboard).
  useEffect(() => {
    setDraftState(loadDraft(key));
    setAc(null);
    if (primary && typeof window.matchMedia === "function" && !window.matchMedia(FOLD_QUERY).matches) ta.current?.focus({ preventScroll: true });
  }, [key, primary]);

  // Edit mode prefills the composer; leaving it restores the draft.
  useEffect(() => {
    if (editing) {
      beforeEdit.current = draft;
      const body = String(editing.getContent().body ?? "");
      setDraftState({ text: body, mentions: [] });
      ta.current?.focus();
    } else if (beforeEdit.current) {
      setDraftState(beforeEdit.current);
      beforeEdit.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  useEffect(() => {
    if (replyTo) ta.current?.focus();
  }, [replyTo]);

  // Mentions inserted from elsewhere (Agents screen, member list).
  useEffect(() => {
    if (!primary) return;
    const on = (e: Event) => {
      const d = (e as CustomEvent<MentionDetail>).detail;
      const text = draft.text && !draft.text.endsWith(" ") ? `${draft.text} @${d.name} ` : `${draft.text}@${d.name} `;
      setDraft({ text, mentions: [...draft.mentions.filter((m) => m.userId !== d.userId), { userId: d.userId, name: d.name }] });
      ta.current?.focus();
    };
    window.addEventListener(MENTION_EVENT, on);
    return () => window.removeEventListener(MENTION_EVENT, on);
  }, [primary, draft, setDraft]);

  // autosize
  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [draft.text]);

  const candidates: Candidate[] = useMemo(() => {
    if (!ac) return [];
    const q = ac.query.toLowerCase();
    const me = client.getSafeUserId();
    const list = room
      .getMembers()
      .filter((m) => (m.membership === "join" || m.membership === "invite") && m.userId !== me)
      .map((m) => ({ userId: m.userId, name: m.name || m.userId, agent: agentProfileInRoom(room, m.userId)?.runtime ?? null, mxc: m.getMxcAvatarUrl() ?? null }))
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.userId.toLowerCase().includes(q));
    list.sort((a, b) => Number(!!b.agent) - Number(!!a.agent) || a.name.localeCompare(b.name));
    return list.slice(0, 8);
  }, [ac, room, client]);

  function updateAutocomplete(text: string, caret: number) {
    const m = /(^|\s)@([^\s@]{0,32})$/.exec(text.slice(0, caret));
    if (m) void room.loadMembersIfNeeded().catch(() => {});
    if (m) setAc({ start: caret - m[2]!.length - 1, query: m[2]!, index: 0 });
    else setAc(null);
  }

  function pick(c: Candidate) {
    if (!ac) return;
    const caret = ta.current?.selectionStart ?? draft.text.length;
    const text = `${draft.text.slice(0, ac.start)}@${c.name} ${draft.text.slice(caret)}`;
    setDraft({ text, mentions: [...draft.mentions.filter((m) => m.userId !== c.userId), { userId: c.userId, name: c.name }] });
    setAc(null);
    requestAnimationFrame(() => {
      const pos = ac.start + c.name.length + 2;
      ta.current?.setSelectionRange(pos, pos);
      ta.current?.focus();
    });
  }

  async function send() {
    const text = draft.text.trim();
    if (!text) return;
    const mentions = draft.mentions;
    void client.sendTyping(room.roomId, false, 0).catch(() => {});
    typingAt.current = 0;
    if (editing) {
      const target = editing;
      onCancelEdit();
      beforeEdit.current = null;
      setDraft(loadDraft(key));
      try {
        await editMessage(client, room.roomId, target, text, mentions);
      } catch (e) {
        toast("Edit not sent", (e as Error).message, "danger");
      }
      return;
    }
    const reply = replyTo;
    setDraft({ text: "", mentions: [] });
    onCancelReply();
    try {
      await sendText(client, { roomId: room.roomId, threadId }, text, mentions, reply);
    } catch {
      // The SDK keeps the local echo as NOT_SENT; the tile offers Retry / Discard.
    }
  }

  async function attach(files: FileList | File[]) {
    for (const f of Array.from(files)) {
      setUploads((u) => [...u, { name: f.name, pct: 0 }]);
      try {
        const up = await uploadFile(client, f, (pct) => setUploads((u) => u.map((x) => (x.name === f.name ? { ...x, pct } : x))));
        await sendFile(client, { roomId: room.roomId, threadId }, up);
      } catch (e) {
        toast("Upload failed", `${f.name}: ${(e as Error).message}`, "danger");
      } finally {
        setUploads((u) => u.filter((x) => x.name !== f.name));
      }
    }
  }

  function onKeyDown(e: RKE<HTMLTextAreaElement>) {
    if (ac && candidates.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setAc({ ...ac, index: (ac.index + 1) % candidates.length });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setAc({ ...ac, index: (ac.index - 1 + candidates.length) % candidates.length });
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        pick(candidates[ac.index]!);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setAc(null);
        return;
      }
    }
    if (e.key === "Escape") {
      if (editing) onCancelEdit();
      else if (replyTo) onCancelReply();
      return;
    }
    if (e.key === "ArrowUp" && !draft.text && !editing) {
      e.preventDefault();
      onEditLast();
      return;
    }
    const sendKey = prefs.sendEnter ? e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing : e.key === "Enter" && (e.metaKey || e.ctrlKey);
    if (sendKey) {
      e.preventDefault();
      void send();
    }
  }

  const canSend = room.maySendMessage();
  const placeholder = !canSend ? "You don't have permission to post here" : threadId ? "Reply in thread…" : `Message ${room.name}…`;
  const hasDraft = draft.text.trim().length > 0;

  return (
    <div style={{ flex: "none", padding: "var(--s2) 24px var(--s6)" }} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) void attach(e.dataTransfer.files); }}>
      {offline ? (
        <div data-alert="" data-tone="danger" data-enter="" style={{ maxWidth: 780, margin: "0 auto var(--s3)" }} role="status">
          <span data-dot="" data-live="" />
          <div>
            <strong>Not connected to your homeserver.</strong> You can keep writing — messages wait and send when the connection is back.
          </div>
        </div>
      ) : null}
      <div data-focusring="" data-composer="" data-ready={String(hasDraft || !!replyTo || !!editing)} data-over={String(dragOver)} style={{ background: "var(--app-elev)", borderRadius: "var(--r-pane)", padding: "var(--s4) var(--s5)", boxShadow: "var(--el2)", position: "relative" }}>
        {replyTo || editing ? (
          <div data-composermode="" style={{ display: "flex", alignItems: "center", gap: "var(--s2)", paddingBottom: "var(--s3)" }}>
            <span data-chip="" data-solid="">
              {editing ? I.edit(12) : I.reply(12)}
              {editing ? "Editing" : `Replying to ${displayNameFor(room, replyTo!.getSender() ?? "", client)}`}
            </span>
            <span data-meta="" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>
              {previewText(editing ?? replyTo, 90)}
            </span>
            <button data-iconbtn="" onClick={editing ? onCancelEdit : onCancelReply} aria-label={editing ? "Cancel edit" : "Cancel reply"}>
              {I.close(12)}
            </button>
          </div>
        ) : null}
        <MultimodalComposer 
          disabled={!canSend}
          placeholder={placeholder}
          draftText={draft.text}
          replyOrEditMode={!!replyTo || !!editing}
          onDraftChange={(val: string) => {
            setDraft({ ...draft, text: val });
            updateAutocomplete(val, ta.current?.selectionStart ?? val.length);
            const now = Date.now();
            if (val && now - typingAt.current > 3000) {
              typingAt.current = now;
              void client.sendTyping(room.roomId, true, 5000).catch(() => {});
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => onKeyDown(e)}
          onSend={() => send()}
          onAttach={(files: FileList | File[]) => attach(files)}
        />
        {ac && candidates.length ? (
          <div data-pop="" data-menu="" id="mention-list" role="listbox" aria-label="Mention someone" style={{ position: "absolute", left: "var(--s5)", bottom: "calc(100% + 6px)", width: 320, maxWidth: "calc(100% - 2 * var(--s5))", padding: "var(--s2)", zIndex: 5 }}>
            {candidates.some((c) => c.agent) ? <div data-eyebrow="" style={{ margin: "var(--s1) var(--s2)" }}>Agents &amp; people</div> : null}
            {candidates.map((c, i) => (
              <button
                key={c.userId}
                id={`mention-opt-${i}`}
                type="button"
                data-menuitem=""
                role="option"
                aria-selected={i === ac.index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(c);
                }}
              >
                <Avatar client={client} name={c.name} mxc={c.mxc} agent={!!c.agent} size="sm" />
                <span data-strong="">{c.name}</span>
                {c.agent ? (
                  <span data-tag="" data-solid="">
                    {runtimeLabel(c.agent)}
                  </span>
                ) : null}
                <span data-num="" style={{ marginLeft: "auto", color: "var(--app-faint)", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.userId}
                </span>
              </button>
            ))}
          </div>
        ) : null}
        {uploads.length > 0 && (
          <div data-morph="" data-open="true">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)", paddingTop: "var(--s3)", flexWrap: "wrap" }}>
                {uploads.map((u) => (
                  <span key={u.name} data-chip="" data-solid="" role="status">
                    {u.name} <span data-num="">{u.pct}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
