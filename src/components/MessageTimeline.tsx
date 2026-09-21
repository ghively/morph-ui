import './MessageTimeline.css';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type MessageKind =
  | 'text' | 'notice' | 'emote' | 'image' | 'video' | 'audio' | 'file'
  | 'sticker' | 'artifact' | 'state' | 'deleted' | 'undecryptable' | 'decrypting';

export type SendState = 'sent' | 'sending' | 'failed';

export interface MessageReaction {
  key: string;
  count: number;
  mine: boolean;
  senders: string[];
}

export interface MessageAttachment {
  url: string | null;
  error?: string | null;
  name: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  downloadable?: boolean;
}

export interface TimelineMessage {
  id: string;
  localId?: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string | null;
  isAgent?: boolean;
  agentLabel?: string;
  agentRole?: string;
  depth?: number;
  mine: boolean;
  ts: number;
  kind: MessageKind;
  html?: string;
  text?: string;
  attachment?: MessageAttachment;
  stateText?: string;
  artifact?: { label: string; degraded?: boolean };
  edited?: boolean;
  deleted?: boolean;
  sendState?: SendState;
  undecryptableReason?: string;
  reactions?: MessageReaction[];
  replyTo?: { id: string; senderName: string; preview: string | null };
  thread?: { count: number; lastSenderName?: string; lastTs?: number; unread?: boolean };
  readers?: { id: string; name: string; avatarUrl?: string | null; isAgent?: boolean }[];
  canEdit?: boolean;
  canDelete?: boolean;
  canOpenAttachmentPanel?: boolean;
  preview?: string;
  systemAlert?: { tone: 'ok' | 'danger' | 'info' | 'warning'; lead: string; live?: boolean };
}

export type AccentSlot = 'blue' | 'cyan' | 'green' | 'gold';

export interface MessageTileActions {
  onReply?: (id: string) => void;
  onEdit?: (id: string) => void;
  onOpenThread?: (id: string) => void;
  onOpenAttachmentPanel?: (id: string) => void;
  onShowSender?: (senderId: string) => void;
  onJumpTo?: (id: string) => void;
  onSave?: (id: string) => void;
  onCopyText?: (id: string) => void;
  onCopyLink?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleReaction?: (id: string, key: string, on: boolean) => void;
  onRetrySend?: (id: string) => void;
  onDiscardSend?: (id: string) => void;
  onConfirm?: (kind: 'delete', message: TimelineMessage) => boolean | Promise<boolean>;
}

export interface MessageTimelineProps {
  messages: TimelineMessage[];
  label: string;
  highlightId?: string | null;
  inThread?: boolean;
  onLoadOlder?: () => Promise<boolean>;
  exhausted?: boolean;
  version?: number;
  actions?: MessageTileActions;
  groupWindowMs?: number;
  foldStateRunsAt?: number;
  className?: string;
}

const PALETTE: AccentSlot[] = ['blue', 'cyan', 'green', 'gold'];

export function assignAccents(senderIds: Iterable<string>): Map<string, AccentSlot> {
  const sorted = Array.from(new Set(senderIds)).sort();
  const map = new Map<string, AccentSlot>();
  const taken = new Set<AccentSlot>();

  for (const sender of sorted) {
    const raw = accentForSender(sender);
    if (!taken.has(raw)) {
      map.set(sender, raw);
      taken.add(raw);
    } else {
      let found = false;
      for (const slot of PALETTE) {
        if (!taken.has(slot)) {
          map.set(sender, slot);
          taken.add(slot);
          found = true;
          break;
        }
      }
      if (!found) {
        map.set(sender, raw);
      }
    }
  }
  return map;
}

export function accentForSender(senderId: string): AccentSlot {
  let h = 0x811c9dc5;
  for (let i = 0; i < senderId.length; i++) {
    h ^= senderId.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return PALETTE[h % 4] as AccentSlot;
}

export function sameDay(a: number, b: number): boolean {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function formatDayLabel(ts: number, now = Date.now()): string {
  if (sameDay(ts, now)) return 'Today';
  if (sameDay(ts, now - 864e5)) return 'Yesterday';
  const sameYear = new Date(ts).getFullYear() === new Date(now).getFullYear();
  return new Date(ts).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric'
  });
}

export function formatTimeLabel(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatRelative(ts: number | null | undefined, now = Date.now()): string {
  if (!ts) return '—';
  const diff = now - ts;
  if (diff < 45000) return 'just now';
  if (diff < 3600000) return `${Math.round(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)} h ago`;
  return formatDayLabel(ts, now);
}

import { MessageTile } from './MessageTile';

export function MessageTimeline({
  messages,
  label,
  highlightId,
  inThread,
  onLoadOlder,
  exhausted = false,
  version,
  actions,
  groupWindowMs = 300000,
  foldStateRunsAt = 3,
  className = ''
}: MessageTimelineProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const [loading, setLoading] = useState(false);
  const [localExhausted, setLocalExhausted] = useState(exhausted);
  const prevHeight = useRef<number | null>(null);

  useEffect(() => {
    setLocalExhausted(exhausted);
  }, [exhausted]);

  const loadOlder = useCallback(async () => {
    if (!onLoadOlder || loading || localExhausted) return;
    setLoading(true);
    prevHeight.current = scroller.current?.scrollHeight ?? null;
    try {
      const more = await onLoadOlder();
      if (!more) setLocalExhausted(true);
    } catch {
      // offline - button stays
    } finally {
      setLoading(false);
    }
  }, [onLoadOlder, loading, localExhausted]);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (prevHeight.current !== null) {
      el.scrollTop += el.scrollHeight - prevHeight.current;
      prevHeight.current = null;
    } else if (atBottom.current && !highlightId) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, version, highlightId]);

  const jumpTries = useRef(0);
  useEffect(() => {
    jumpTries.current = 0;
  }, [highlightId]);

  useEffect(() => {
    if (!highlightId) return;
    const el = scroller.current?.querySelector<HTMLElement>(`[data-eventid="${CSS.escape(highlightId)}"]`);
    if (el) {
      el.scrollIntoView({ block: 'center' });
      el.focus({ preventScroll: true });
      return;
    }
    if (jumpTries.current < 8 && !localExhausted && onLoadOlder) {
      jumpTries.current++;
      void loadOlder();
    }
  }, [highlightId, messages.length, localExhausted, loadOlder, onLoadOlder]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (el.scrollTop < 120) void loadOlder();
  };

  const accents = useMemo(() => assignAccents(messages.map(m => m.senderId)), [messages]);
  const slotFor = (sender: string) => accents.get(sender) ?? accentForSender(sender);

  let prev: TimelineMessage | null = null;
  const rows: ReactNode[] = [];
  const runs = new Map<string, TimelineMessage[]>();

  for (let i = 0; i < messages.length; ) {
    let j = i;
    while (j < messages.length && messages[j]!.kind !== 'text' && messages[j]!.kind !== 'notice' && messages[j]!.kind !== 'emote' && messages[j]!.kind !== 'image' && messages[j]!.kind !== 'video' && messages[j]!.kind !== 'audio' && messages[j]!.kind !== 'file' && messages[j]!.kind !== 'sticker' && messages[j]!.kind !== 'artifact' && messages[j]!.kind !== 'deleted' && messages[j]!.kind !== 'undecryptable' && messages[j]!.kind !== 'decrypting') {
      j++;
    }
    if (j - i >= foldStateRunsAt) {
      runs.set(messages[i]!.id ?? String(i), messages.slice(i, j));
    }
    i = j === i ? i + 1 : j;
  }

  const folded = new Set<string>();
  for (const run of runs.values()) {
    for (const m of run.slice(1)) {
      folded.add(m.id ?? '');
    }
  }

  for (const ev of messages) {
    if (folded.has(ev.id ?? '-')) continue;
    const run = runs.get(ev.id ?? '-');
    if (run) {
      if (!prev || !sameDay(prev.ts, ev.ts)) {
        rows.push(
          <div key={`day-${ev.ts}`} data-daysep="" role="separator">
            <span data-eyebrow="">{formatDayLabel(ev.ts)}</span>
          </div>
        );
      }
      rows.push(
        <details key={`run-${ev.id}`} data-stategroup="">
          <summary data-meta="">{run.length} group changes</summary>
          {run.map(e => (
            <MessageTile
              key={e.id ?? e.localId}
              message={e}
              continuation={false}
              inThread={false}
              highlighted={false}
              actions={actions}
              accent={slotFor(e.senderId)}
            />
          ))}
        </details>
      );
      prev = run[run.length - 1]!;
      continue;
    }

    const ts = ev.ts;
    if (!prev || !sameDay(prev.ts, ts)) {
      rows.push(
        <div key={`day-${ts}`} data-daysep="" role="separator">
          <span data-eyebrow="">{formatDayLabel(ts)}</span>
        </div>
      );
    }

    const isMsg = (m: TimelineMessage) => !['state'].includes(m.kind); // state is folded above if sequence long enough, but individually they aren't messages that can continue runs
    
    const continuation = !!prev && isMsg(prev) && isMsg(ev) &&
      prev.senderId === ev.senderId && ts - prev.ts < groupWindowMs &&
      !prev.deleted && sameDay(prev.ts, ts);

    rows.push(
      <MessageTile
        key={ev.id ?? ev.localId}
        message={ev}
        continuation={continuation}
        inThread={inThread ? true : (ev.thread === undefined ? false : undefined)}
        highlighted={highlightId === (ev.id ?? ev.localId)}
        actions={actions}
        accent={slotFor(ev.senderId)}
      />
    );
    prev = ev;
  }

  return (
    <div ref={scroller} onScroll={onScroll} style={{ flex: 1, overflow: 'auto', padding: '26px 24px var(--s6)' }} data-scroller="" className={className}>
      <div data-turnlist="" role="log" aria-label={label} aria-live="off" style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {localExhausted ? (
            <span data-meta="">Beginning of {inThread ? 'thread' : 'history'}</span>
          ) : (
            <button data-btn="text" data-state="" data-busy={String(loading)} onClick={() => void loadOlder()} style={{ position: 'relative' }}>
              Load earlier
              <i data-spin="" aria-hidden="true" />
            </button>
          )}
        </div>
        {rows}
      </div>
    </div>
  );
}
