import './RequestCard.css';
import type { CSSProperties } from 'react';
import { Art, useAccent, initials, yearSpan, type MediaItem } from './mediaLibrary.shared';
import type { User } from './ActiveSessions';

export type ReqStatus = 'Pending' | 'Approved' | 'Processing' | 'Available' | 'Declined' | 'Failed';

export interface MediaRequest {
  id: string;
  item: MediaItem;
  by: User;
  when: string;
  status: ReqStatus;
  seasons?: number[];
  progress?: number;
  is4k?: boolean;
  note?: string;
}

export interface RequestCardProps {
  request: MediaRequest;
  /** Show approve / decline (admin view). */
  canManage?: boolean;
  onApprove?: (r: MediaRequest) => void;
  onDecline?: (r: MediaRequest) => void;
  onOpen?: (r: MediaRequest) => void;
  className?: string;
}

const ST: Record<ReqStatus, { l: string; k: string }> = {
  Pending: { l: 'Pending approval', k: 'var(--state-wait)' },
  Approved: { l: 'Approved', k: 'var(--state-ready)' },
  Processing: { l: 'Downloading', k: 'var(--state-live)' },
  Available: { l: 'Available', k: 'var(--state-ok)' },
  Declined: { l: 'Declined', k: 'var(--state-error)' },
  Failed: { l: 'Failed', k: 'var(--state-error)' },
};

export function RequestCard(p: RequestCardProps) {
  const r = p.request;
  const acc = useAccent(r.item);
  const s = ST[r.status];

  return (
    <article className={'ml rqA ' + (p.className || '')} style={acc.style} data-req={r.status}>
      <Art item={r.item} type="Backdrop" fallback={['Thumb']} shape="fill" alt="" className="rqA-bg" empty={null} />
      <div className="rqA-in">
        <button type="button" className="rqA-poster" onClick={() => p.onOpen?.(r)} aria-label={'Open ' + r.item.title}>
          <Art item={r.item} type="Primary" shape="portrait" alt="" />
        </button>
        <div className="rqA-main">
          <div className="rqA-top">
            <span
              className="ml-chip"
              data-mldot=""
              data-mllive={r.status === 'Processing' ? '' : undefined}
              style={{ ['--k' as string]: s.k }}
            >
              {s.l}
            </span>
            {r.is4k && <span className="ml-chip">4K</span>}
            <span className="ml-faint ml-sm">{r.item.type === 'Series' ? 'Series' : 'Movie'}</span>
          </div>
          <h4 className="rqA-title ml-ell">
            {r.item.title} <span className="ml-dim ml-num">{yearSpan(r.item)}</span>
          </h4>
          {r.seasons && <span className="ml-sm ml-dim">Seasons {r.seasons.join(', ')}</span>}
          <div className="rqA-by ml-row">
            <span className="rqA-av" style={{ ['--k' as string]: r.by.accent }} aria-hidden="true">
              {initials(r.by.name)}
            </span>
            <span className="ml-sm">
              <b>{r.by.name}</b> <span className="ml-faint">· {r.when}</span>
            </span>
          </div>
          {r.note && <p className="rqA-note">“{r.note}”</p>}
          {r.status === 'Processing' && r.progress != null && (
            <div className="rqA-dl">
              <span className="ml-bar" style={{ ['--k' as string]: s.k } as CSSProperties}>
                <i style={{ width: r.progress * 100 + '%' }} />
              </span>
              <span className="ml-num ml-sm">{Math.round(r.progress * 100)}%</span>
            </div>
          )}
          {p.canManage && r.status === 'Pending' && (
            <div className="rqA-acts">
              <button type="button" className="ml-pill" data-tone="accent" onClick={() => p.onApprove?.(r)}>
                Approve
              </button>
              <button type="button" className="ml-pill" data-tone="danger" onClick={() => p.onDecline?.(r)}>
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
