import './ConversationList.css';
import { CountBadge, Ico, I, type ConversationListProps } from './chatmsg.shared';

export function ConversationList({
  groups, invites = [], activeId, filter, onFilterChange, onSelect, onAcceptInvite, onDeclineInvite, onBrowse, onCreate, fade,
  filterPlaceholder = 'Filter conversations', className = '',
}: ConversationListProps) {
  const f = fade ? { 'data-fade': '' } : {};
  const empty = !invites.length && groups.every(g => !g.conversations.length);
  return (
    <nav className={'convs ' + className} data-rows="" aria-label="Conversations">
      <div className="convs-search" data-searchcap="" {...f}>
        <Ico d={I.search} size={14} />
        <input className="convs-filter" aria-label={filterPlaceholder} placeholder={filterPlaceholder} value={filter} onChange={e => onFilterChange(e.target.value)} />
        <button type="button" className="cm-iconbtn" data-iconbtn="" data-push="" aria-label="Browse" onClick={() => onBrowse?.()}><Ico d={I.people} size={15} /></button>
      </div>

      {invites.length > 0 && (
        <div className="convs-group" role="group" aria-label="Invites">
          <div className="convs-eyebrow" data-conveyebrow="" {...f}>Invites</div>
          {invites.map(inv => (
            <div key={inv.id} className="convs-row" data-threadrow="" data-invite="" role="presentation" {...f}>
              <button type="button" className="convs-btn" data-state="" title={'Join ' + inv.name} onClick={() => onAcceptInvite?.(inv.id)}>
                <span className="convs-name">{inv.name}</span>
                <span className="convs-join" data-tag="" data-solid="">Join</span>
              </button>
              <button type="button" className="cm-iconbtn" data-iconbtn="" data-tone="danger" aria-label={'Decline ' + inv.name} title="Decline" onClick={() => onDeclineInvite?.(inv.id)}><Ico d={I.x} size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {groups.map(g => (
        <div key={g.id} className="convs-group" role="group" aria-label={g.label}>
          <div className="convs-eyebrow" data-conveyebrow="" {...f}>{g.label}</div>
          {g.conversations.map(c => {
            const active = c.id === activeId;
            return (
              <div key={c.id} className="convs-item" {...f}>
                <div className="convs-row" data-threadrow="" data-on={String(active)} role="presentation">
                  <button type="button" className="convs-btn" data-state="" data-direct={c.direct ? '' : undefined} aria-current={active ? 'page' : undefined} title={c.alias ?? c.name} onClick={() => onSelect(c.id)}>
                    <span className="convs-name">
                      {c.prefix}{c.name.replace(/^#/, '')}
                      {c.encrypted && <span className="convs-lock" aria-label="encrypted"><Ico d={I.lock} size={10} /></span>}
                    </span>
                    <CountBadge highlight={c.highlight} unread={c.unread} />
                  </button>
                </div>
              </div>
            );
          })}
          {g.collectionId && (
            <div className="convs-browse" {...f}>
              {!g.conversations.length && <div className="convs-meta" data-convmeta="">No conversations in this collection</div>}
              <button type="button" className="convs-chip" data-convchip="" data-state="" title={'Browse ' + g.label} onClick={() => onBrowse?.(g.collectionId)}>Browse {g.label}</button>
            </div>
          )}
        </div>
      ))}

      {empty && (
        <div className="convs-empty" data-empty="" {...f}>
          <div className="convs-empty-ico" data-tile=""><Ico d={I.chat} size={22} /></div>
          <div className="convs-eyebrow" data-conveyebrow="">{filter ? 'No conversations match' : 'No conversations yet'}</div>
          <div className="convs-meta" data-convmeta="">{filter ? 'Try another name.' : 'Browse what already exists, or start something new.'}</div>
          <div className="convs-cta">
            <button type="button" className="convs-cta-btn" data-convbtn="accent" onClick={() => onBrowse?.()}>Browse</button>
            <button type="button" className="convs-cta-btn" data-convbtn="" onClick={() => onCreate?.()}>New</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export type { ConversationSummary, ConversationGroup, ConversationInvite, ConversationListProps } from './chatmsg.shared';
