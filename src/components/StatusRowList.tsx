import type { ReactElement, ReactNode, KeyboardEvent } from 'react';
import './StatusRowList.css';

export type StatusTone = 'ok' | 'warn' | 'danger';

export interface StatusRowBadge {
  id: string;
  label: string;
  /** `[data-tag][data-solid]` vs `[data-tag]`. */
  solid?: boolean;
  tone?: StatusTone;
  title?: string;
}

export interface StatusRowAction {
  id: string;
  label: string;
  /** `[data-btn]` value: '' (default) | 'fill' | 'accent' | 'text'. */
  variant?: '' | 'fill' | 'accent' | 'text';
  tone?: 'danger';
  disabled?: boolean;
  busy?: boolean;
  ariaLabel?: string;
  onSelect: () => void;
}

export interface StatusRow {
  id: string;
  /** Leading status dot. Omit `tone` for a neutral dot; omit `dot` for no dot. */
  dot?: boolean;
  tone?: StatusTone;
  /** Pulsing dot. */
  live?: boolean;
  /** Leading node (avatar, tile glyph). Rendered before the fill column. */
  leading?: ReactNode;
  title: ReactNode;
  /** Renders the title as a button that calls `onTitleSelect` (`[data-linkish]`). */
  onTitleSelect?: () => void;
  /** Bigger title line (`[data-lead="true"]`). */
  lead?: boolean;
  /** Inline badges on the title line. */
  badges?: StatusRowBadge[];
  /** Inline status text with its own dot, after the badges (AgentsScreen `statusText`). */
  inlineStatus?: { text: string; tone?: StatusTone; live?: boolean };
  /** Monospace secondary line (`[data-num]`). */
  identifier?: ReactNode;
  /** Muted secondary line (`[data-meta]`). */
  meta?: ReactNode;
  /** Capability chips under the meta. */
  chips?: string[];
  /** Inline error under the row (BrowseRooms/DirectoryBrowser reuse). */
  error?: string | null;
  /** Right-hand metric column, hidden on narrow (`[data-hidenarrow]`). */
  metric?: { label: string; value: ReactNode };
  /** Trailing tag after the fill column. */
  trailingTag?: StatusRowBadge;
  /** Trailing buttons. */
  actions?: StatusRowAction[];
  /** Whole-row activation. Adds `cursor:pointer` and keyboard support. */
  onSelect?: () => void;
  /** `[data-on]` selected state (NotesScreen list, ConversationList reuse). */
  selected?: boolean;
  /** `[data-size]`: undefined | 'lg'. */
  size?: 'lg';
  /** Vertically top-align the row (DirectoryBrowser entries). */
  alignStart?: boolean;
  /** Renders meta before title (WorkspaceScreen KV row support) */
  metaFirst?: boolean;
}

export interface StatusRowListProps {
  rows: StatusRow[];
  /** Accessible name; when set the container gets role="list" and rows role="listitem". */
  label?: string;
  /** 'list' (default) | 'listbox' — listbox makes rows role="option" with aria-selected. */
  semantics?: 'list' | 'listbox' | 'none';
  /** `[data-gap="flush"]` — the card-embedded variant every screen uses. */
  flush?: boolean;
  /** Stagger entry animation (`[data-stagger]`). */
  stagger?: boolean;
  /** Rendered after the rows; every source list ends with an EmptyState here. */
  footer?: ReactNode;
  className?: string;
}

export interface CollapsibleSectionProps {
  title: ReactNode;
  meta?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  meta,
  defaultOpen,
  children,
  className = ''
}: CollapsibleSectionProps): ReactElement {
  return (
    <details data-card="" open={defaultOpen} className={className}>
      <summary data-strong="" style={{ cursor: "pointer" }}>
        {title}
        {meta && <span data-meta="">{meta}</span>}
      </summary>
      <div style={{ marginTop: "var(--s3)" }}>
        {children}
      </div>
    </details>
  );
}

export function StatusRowList({
  rows,
  label,
  semantics = 'list',
  flush,
  stagger,
  footer,
  className = ''
}: StatusRowListProps): ReactElement {
  let containerRole: string | undefined;
  if (semantics === 'listbox') containerRole = 'listbox';
  else if (semantics === 'list' && label) containerRole = 'list';

  return (
    <div
      data-rows=""
      data-gap={flush ? "flush" : undefined}
      data-stagger={stagger ? "" : undefined}
      role={containerRole}
      aria-label={label}
      className={className}
    >
      {rows.map(row => (
        <RowItem key={row.id} row={row} semantics={semantics} />
      ))}
      {footer}
    </div>
  );
}

function RowItem({ row, semantics }: { row: StatusRow; semantics: StatusRowListProps['semantics'] }) {
  const isListbox = semantics === 'listbox';
  const isList = semantics === 'list';
  const role = isListbox ? 'option' : isList ? 'listitem' : undefined;

  const hasRowSelect = !!row.onSelect;
  const hasActions = !!row.actions && row.actions.length > 0;
  
  // Rule: activation region is the fill area if we have both onSelect and actions.
  // If only onSelect, whole row is the button/activation region.
  const rowIsClickable = hasRowSelect && !hasActions;
  const fillIsClickable = hasRowSelect && hasActions;

  const handleRowClick = () => {
    if (rowIsClickable) row.onSelect!();
  };

  const handleFillClick = () => {
    if (fillIsClickable) row.onSelect!();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (rowIsClickable || fillIsClickable) row.onSelect!();
    }
  };

  const interactiveProps = (rowIsClickable || isListbox) ? {
    tabIndex: 0,
    onClick: handleRowClick,
    onKeyDown: handleKeyDown
  } : {};

  // For NotesScreen, row is a button natively if semantics=listbox? The spec says:
  // "NotesScreen list: rows are `<button type="button" data-row="" data-state="" role="option" aria-selected data-on>`"
  // Let's use `div` but apply the attributes to match accessbility/styling. The spec says if it's a div, add tabIndex=0.
  const Component = isListbox ? 'button' : 'div';
  const additionalProps = isListbox ? { type: "button" as const } : {};

  const TitleNode = () => {
    const TNode = row.onTitleSelect ? 'button' : 'div';
    const tProps = row.onTitleSelect ? { 
      'data-linkish': "", 
      onClick: (e: React.MouseEvent) => { e.stopPropagation(); row.onTitleSelect!(); } 
    } : {};
    return (
      <TNode 
        data-strong="" 
        data-lead={row.lead ? "true" : undefined}
        style={{ display: "flex", alignItems: "center", gap: "var(--s2)", flexWrap: "wrap" }}
        {...tProps}
      >
        {row.title}
        {row.badges && row.badges.map(b => (
          <span 
            key={b.id} 
            data-tag="" 
            data-solid={b.solid ? "" : undefined} 
            data-tone={b.tone}
            title={b.title}
          >
            {b.label}
          </span>
        ))}
        {row.inlineStatus && (
          <span style={{ display: "flex", alignItems: "center", gap: "var(--s1)", color: "var(--app-dim)", fontSize: "var(--t-meta)", fontWeight: "normal" }}>
            <span data-dot="" data-tone={row.inlineStatus.tone} data-live={row.inlineStatus.live ? "" : undefined} style={{ width: 6, height: 6 }} />
            {row.inlineStatus.text}
          </span>
        )}
      </TNode>
    );
  };

  const MetaNode = () => {
    if (!row.meta && !row.identifier) return null;
    return (
      <div data-meta="" style={{ overflowWrap: "anywhere" }}>
        {row.identifier && <span data-num="">{row.identifier}</span>}
        {row.identifier && row.meta && " "}
        {row.meta}
      </div>
    );
  };

  return (
    <Component
      data-row=""
      data-state={rowIsClickable || isListbox ? "" : undefined}
      data-size={row.size}
      data-align-start={row.alignStart ? "" : undefined}
      data-on={row.selected ? "" : undefined}
      role={role}
      aria-selected={isListbox ? row.selected : undefined}
      style={{ 
        textAlign: isListbox ? "left" : undefined, 
        border: isListbox ? 0 : undefined, 
        width: isListbox ? "100%" : undefined,
        background: isListbox ? (row.selected ? "var(--sec-soft)" : "transparent") : undefined,
        color: isListbox ? "inherit" : undefined
      }}
      {...interactiveProps}
      {...additionalProps}
    >
      {row.dot !== false && row.dot !== undefined && (
        <span data-dot="" data-tone={row.tone} data-live={row.live ? "" : undefined} />
      )}
      
      {row.leading}

      <div 
        data-fill="" 
        data-linkish={fillIsClickable ? "" : undefined}
        onClick={handleFillClick}
        style={{ cursor: fillIsClickable ? 'pointer' : undefined }}
      >
        {row.metaFirst ? (
          <>
            <MetaNode />
            <TitleNode />
          </>
        ) : (
          <>
            <TitleNode />
            <MetaNode />
          </>
        )}

        {row.chips && row.chips.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s1)", marginTop: "var(--s2)" }}>
            {row.chips.map((chip, i) => (
              <span key={i} data-chip="">{chip}</span>
            ))}
          </div>
        )}

        {row.error && (
          <div data-meta="" role="alert" style={{ marginTop: "var(--s2)", color: "var(--danger-ink)" }}>
            {row.error}
          </div>
        )}
      </div>

      {row.metric && (
        <div data-hidenarrow="" style={{ fontSize: "var(--t-small)", textAlign: "right" }}>
          <div data-meta="">{row.metric.label}</div>
          <div data-num="">{row.metric.value}</div>
        </div>
      )}

      {row.trailingTag && (
        <span 
          data-tag="" 
          data-solid={row.trailingTag.solid ? "" : undefined} 
          data-tone={row.trailingTag.tone}
          title={row.trailingTag.title}
        >
          {row.trailingTag.label}
        </span>
      )}

      {hasActions && (
        <div style={{ display: "flex", gap: "var(--s2)" }}>
          {row.actions!.map(act => (
            <button
              key={act.id}
              type="button"
              data-btn={act.variant || ""}
              data-tone={act.tone}
              data-busy={act.busy ? "true" : undefined}
              disabled={act.disabled || act.busy}
              aria-label={act.ariaLabel}
              onClick={(e) => { e.stopPropagation(); act.onSelect(); }}
              style={{ position: act.busy ? "relative" : undefined, height: row.size === 'lg' ? 30 : undefined, fontSize: row.size === 'lg' ? "var(--t-small)" : undefined }}
            >
              {act.label}
              {act.busy && <i data-spin="" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </Component>
  );
}
