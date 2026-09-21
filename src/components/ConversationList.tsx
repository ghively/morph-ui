import './ConversationList.css';

export interface ConversationSummary {
  id: string;
  name: string;
  /** Rendered before the name; the source uses '# ' for non-direct. */
  prefix?: string;
  alias?: string | null;
  direct?: boolean;
  encrypted?: boolean;
  unread?: number;
  /** Mention/highlight count — outranks `unread`. */
  highlight?: number;
}

export interface ConversationGroup {
  id: string;
  label: string;
  conversations: ConversationSummary[];
  /** Present ⇒ the group offers a "Browse <label>" affordance. */
  collectionId?: string | null;
}

export interface ConversationInvite {
  id: string;
  name: string;
}

export interface ConversationListProps {
  groups: ConversationGroup[];
  invites?: ConversationInvite[];
  activeId?: string | null;
  filter: string;
  onFilterChange: (v: string) => void;
  onSelect: (id: string) => void;
  onAcceptInvite?: (id: string) => void;
  onDeclineInvite?: (id: string) => void;
  onBrowse?: (collectionId?: string | null) => void;
  onCreate?: () => void;
  /** Applies `[data-fade]` to every fadeable element (the rail-embedded variant). */
  fade?: boolean;
  filterPlaceholder?: string;         // default 'Filter conversations'
  className?: string;
}

export function ConversationList({
  groups,
  invites = [],
  activeId,
  filter,
  onFilterChange,
  onSelect,
  onAcceptInvite,
  onDeclineInvite,
  onBrowse,
  onCreate,
  fade,
  filterPlaceholder = 'Filter conversations',
  className,
}: ConversationListProps) {
  const emptyCheck = !invites.length && groups.every(g => !g.conversations.length);

  return (
    <nav className={className} data-rows="" aria-label="Conversations" style={{ display: "flex", flexDirection: "column" }}>
      {/* Filter cap row */}
      <div 
        data-searchcap="" 
        {...(fade ? { "data-fade": "" } : {})}
        style={{ 
          maxWidth: "none", 
          height: 30, 
          flex: 1, 
          minWidth: 0, 
          display: "flex", 
          alignItems: "center", 
          padding: "var(--s5) var(--s3) var(--seam)",
          gap: "8px"
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--app-rail-dim)" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          aria-label={filterPlaceholder}
          placeholder={filterPlaceholder}
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          style={{ 
            flex: 1, 
            minWidth: 0, 
            border: 0, 
            outline: "none", 
            background: "transparent", 
            color: "var(--app-rail-text)", 
            fontSize: "var(--t-ctl)" 
          }}
        />
        <button 
          data-iconbtn="" 
          data-push="" 
          aria-label="Browse" 
          onClick={() => onBrowse?.()}
          style={{ 
            flex: "none", 
            width: 30, 
            height: 30, 
            color: "var(--app-rail-dim)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </button>
      </div>

      {/* Invites block */}
      {invites.length > 0 && (
        <div role="group" aria-label="Invites" style={{ display: "contents" }}>
          <div data-conveyebrow="" {...(fade ? { "data-fade": "" } : {})} style={{ margin: "var(--s5) var(--s5) var(--s2)" }}>
            Invites
          </div>
          {invites.map((inv) => (
            <div key={inv.id} data-threadrow="" role="presentation" {...(fade ? { "data-fade": "" } : {})} style={{ padding: "0 var(--s3)" }}>
              <button data-state="" title={`Join ${inv.name}`} onClick={() => onAcceptInvite?.(inv.id)}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>{inv.name}</span>
                <span data-tag="" data-solid="">Join</span>
              </button>
              <button 
                data-iconbtn="" 
                aria-label={`Decline ${inv.name}`} 
                title="Decline" 
                onClick={() => onDeclineInvite?.(inv.id)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Groups */}
      {groups.map((group) => (
        <div key={group.id} role="group" aria-label={group.label} style={{ display: "contents" }}>
          <div data-conveyebrow="" {...(fade ? { "data-fade": "" } : {})} style={{ margin: "var(--s5) var(--s5) var(--s2)" }}>
            {group.label}
          </div>
          
          {group.conversations.map((conv) => {
            const active = conv.id === activeId;
            return (
              <div key={conv.id} style={{ padding: "0 var(--s3)" }} {...(fade ? { "data-fade": "" } : {})}>
                <div data-threadrow="" data-on={String(active)} role="presentation">
                  <button 
                    data-state="" 
                    aria-current={active ? "page" : undefined} 
                    title={conv.alias ?? conv.name}
                    onClick={() => onSelect(conv.id)}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
                      {conv.prefix}{conv.name.replace(/^#/, "")}
                      {conv.encrypted && (
                        <span aria-label="encrypted" style={{ marginLeft: 6, color: "var(--app-rail-faint)" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </span>
                      )}
                    </span>
                    {(conv.highlight || 0) > 0 ? (
                      <span data-count="" data-tone="danger" data-mention="" aria-label={`${conv.highlight} mentions`}>@{conv.highlight}</span>
                    ) : (conv.unread || 0) > 0 ? (
                      <span data-count="" aria-label={`${conv.unread} unread`}>{conv.unread}</span>
                    ) : null}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Per-group browse block */}
          {group.collectionId && (
            <div style={{ padding: "var(--seam) var(--s5) 0" }} {...(fade ? { "data-fade": "" } : {})}>
              {group.conversations.length === 0 && (
                <div data-convmeta="">No conversations in this collection</div>
              )}
              <button 
                data-convchip="" 
                data-state="" 
                title={`Browse ${group.label}`}
                onClick={() => onBrowse?.(group.collectionId)}
              >
                Browse {group.label}
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Empty state */}
      {emptyCheck && (
        <div data-empty="" {...(fade ? { "data-fade": "" } : {})} style={{ padding: "var(--s5) var(--s4) var(--s3)", gap: "var(--s2)", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div data-tile="" style={{ color: "var(--app-rail-faint)", marginBottom: "var(--s2)" }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
             </svg>
          </div>
          <div data-conveyebrow="" style={{ margin: 0 }}>
            {filter ? "No conversations match" : "No conversations yet"}
          </div>
          <div data-convmeta="" style={{ marginBottom: "var(--s2)" }}>
            {filter ? "Try another name." : "Browse what already exists, or start something new."}
          </div>
          <div style={{ display: "flex", gap: "var(--s2)" }}>
            <button data-convbtn="accent" style={{ height: 30 }} onClick={() => onBrowse?.()}>Browse</button>
            <button data-convbtn="" style={{ height: 30 }} onClick={() => onCreate?.()}>New</button>
          </div>
        </div>
      )}
    </nav>
  );
}
