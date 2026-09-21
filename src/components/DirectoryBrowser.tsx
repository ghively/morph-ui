import type { FormEvent, ReactNode } from 'react';
import './DirectoryBrowser.css';

export type DirectoryTab = 'collections' | 'directory' | 'address';
export type JoinState = 'joined' | 'invited' | 'requested' | 'none';

export interface DirectoryEntryAction {
  label: string;
  kind: 'open' | 'join' | 'accept' | 'request' | 'waiting';
  disabled: boolean;
}

export interface DirectoryEntry {
  id: string;
  name: string;
  description?: string | null;
  alias?: string | null;
  avatarUrl?: string | null;
  memberLabel?: string | null;
  isCollection?: boolean;
  suggested?: boolean;
  state: JoinState;
  action: DirectoryEntryAction;
}

export interface DirectoryListState {
  status: 'idle' | 'loading' | 'done';
  entries: DirectoryEntry[];
  hasMore: boolean;
  error: string | null;
  degraded: boolean;
}

export interface DirectoryCrumb { id: string; name: string; }

export interface DirectoryAddressFormProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    busy?: boolean;
    error?: string | null;
    label?: string;
    placeholder?: string;
    hint?: ReactNode;
    submitLabel?: string;
}

/**
 * Host must handle pagination limit (PAGE=40), query debounce (300ms, 0ms on empty),
 * and resolving joinState mappings to DirectoryEntryAction (joinAction).
 */
export interface DirectoryBrowserProps {
  tab: DirectoryTab;
  onTabChange: (t: DirectoryTab) => void;
  list: DirectoryListState;
  collections?: DirectoryCrumb[];
  path?: string[];
  onPathChange?: (next: string[]) => void;
  collectionName?: (id: string) => string;
  suggestedOnly?: boolean;
  onSuggestedOnlyChange?: (v: boolean) => void;
  query?: string;
  onQueryChange?: (v: string) => void;
  queryPlaceholder?: string;
  onLoadMore?: () => void;
  onAct: (entry: DirectoryEntry, kind: DirectoryEntryAction['kind'] | 'open') => void;
  rowErrors?: Record<string, string>;
  busyEntryId?: string | null;
  address?: DirectoryAddressFormProps;
  onClose: () => void;
  className?: string;
}

export function DirectoryBrowser(props: DirectoryBrowserProps) {
  const {
    tab, onTabChange,
    list,
    collections = [],
    path = [], onPathChange,
    collectionName = (id) => id,
    suggestedOnly = false, onSuggestedOnlyChange,
    query = '', onQueryChange, queryPlaceholder = "Search public rooms",
    onLoadMore,
    onAct,
    rowErrors = {},
    busyEntryId,
    address,
    onClose,
    className
  } = props;

  return (
    <ModalSurface title="Browse rooms" width={640} height={620} onClose={onClose} className={className}>
      <div style={{ flex: "none", padding: "0 var(--s6) var(--s4)", display: "flex", alignItems: "center", gap: "var(--s4)", flexWrap: "wrap" }}>
        <SegmentedControl
          value={tab}
          onChange={(v: string) => onTabChange(v as DirectoryTab)}
          options={[
            { value: "collections", label: "Spaces" },
            { value: "directory", label: "Directory" },
            { value: "address", label: "By address" },
          ]}
        />
        {tab === "collections" && path.length > 0 ? (
          <label style={{ display: "flex", alignItems: "center", gap: "var(--s2)", marginLeft: "auto", fontSize: "var(--t-meta)", color: "var(--app-dim)" }}>
            Suggested only
            <ToggleSwitch
              on={suggestedOnly}
              onChange={(v: boolean) => onSuggestedOnlyChange?.(v)}
            />
          </label>
        ) : null}
      </div>

      {tab === "collections" && collections.length > 0 ? (
        <SpaceBar collections={collections} path={path} onPathChange={onPathChange} collectionName={collectionName} />
      ) : null}

      {tab === "directory" ? (
        <div style={{ flex: "none", padding: "0 var(--s6) var(--s4)" }}>
          <div data-searchcap="" style={{ maxWidth: "none" }}>
            <span aria-hidden="true" style={{width: 14, height: 14, display: 'inline-block'}}>&#128269;</span>
            <input
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              placeholder={queryPlaceholder}
              aria-label="Search public rooms"
              style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--app-text)", fontSize: "var(--t-ctl)" }}
            />
          </div>
        </div>
      ) : null}

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "0 var(--s6) var(--s6)" }}>
        {tab === "address" && address ? (
          <JoinByAddressForm address={address} />
        ) : (
          <>
            {list.error ? (
              <AlertBanner
                tone={list.degraded ? "warn" : "danger"}
                role="alert"
                style={{ marginBottom: "var(--s4)" }}
              >
                {list.error}
                {list.degraded ? " Showing the rooms this space lists locally instead — names and member counts may be missing." : null}
              </AlertBanner>
            ) : null}

            {tab === "collections" && collections.length === 0 ? (
              <EmptyState title="No collections yet">You're not in a space. Try the directory, or join one by address.</EmptyState>
            ) : list.status === "loading" ? (
              <div data-meta="" role="status" style={{ padding: "var(--s5)" }}>
                Loading…
              </div>
            ) : list.entries.length > 0 ? (
              <>
                <div data-card="" data-pad="none">
                  <div role="list" style={{display: 'flex', flexDirection: 'column', gap: 0}}>
                    {list.entries.map((e) => (
                      <EntryRow
                        key={e.id}
                        entry={e}
                        busy={busyEntryId === e.id}
                        error={rowErrors[e.id]}
                        onAct={onAct}
                      />
                    ))}
                  </div>
                </div>
                {list.hasMore ? (
                  <button data-btn="" data-state="" onClick={onLoadMore} style={{ marginTop: "var(--s4)" }}>
                    Show more
                  </button>
                ) : null}
              </>
            ) : (
              <EmptyState title={tab === "collections" ? (suggestedOnly ? "Nothing suggested here" : "This space has no rooms") : "No public rooms"}>
                {tab === "collections"
                  ? "Rooms added to this space will show up here."
                  : query.trim()
                    ? "Nothing on this homeserver matches that."
                    : "This homeserver publishes no rooms. Try a space, or join by address."}
              </EmptyState>
            )}
          </>
        )}
      </div>
    </ModalSurface>
  );
}

function SpaceBar({ collections, path, onPathChange, collectionName }: { collections: DirectoryCrumb[]; path: string[]; onPathChange?: (next: string[]) => void; collectionName: (id: string) => string }) {
  const root = path[0] ?? null;
  const trail = path.slice(1);
  return (
    <div style={{ flex: "none", padding: "0 var(--s6) var(--s4)", display: "flex", alignItems: "center", gap: "var(--s2)", flexWrap: "wrap" }}>
      {collections.map((s) => (
        <button
          key={s.id}
          data-chip=""
          data-state=""
          data-on={String(root === s.id)}
          aria-pressed={root === s.id}
          onClick={() => onPathChange?.([s.id])}
        >
          {s.name}
        </button>
      ))}
      {trail.map((id: string, i: number) => (
        <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: "var(--s2)" }}>
          <span data-meta="" aria-hidden="true">
            /
          </span>
          <button
            data-chip=""
            data-state=""
            data-on={String(i === trail.length - 1)}
            aria-pressed={i === trail.length - 1}
            onClick={() => onPathChange?.(path.slice(0, i + 2))}
          >
            {collectionName(id)}
          </button>
        </span>
      ))}
    </div>
  );
}

function EntryRow({ entry, busy, error, onAct }: { entry: DirectoryEntry; busy: boolean; error?: string; onAct: (e: DirectoryEntry, kind: DirectoryEntryAction['kind'] | 'open') => void }) {
  const { action, name, isCollection, suggested, state, alias, memberLabel, description } = entry;
  const meta = [alias, memberLabel].filter(Boolean).join(" · ");
  
  return (
    <div data-row="" role="listitem" data-size="lg" style={{ alignItems: "flex-start" }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--app-line)', flex: 'none' }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)", minWidth: 0 }}>
          <span data-strong="" data-ell="" style={{ minWidth: 0 }}>
            {name}
          </span>
          {isCollection ? <span data-tag="">Collection</span> : null}
          {suggested ? <span data-tag="" data-solid="">Suggested</span> : null}
          {state === "invited" ? <span data-tag="" data-solid="">Invited</span> : null}
          {state === "joined" ? <span data-tag="">Joined</span> : null}
          {action.kind === "request" && state === "none" ? <span data-tag="">Ask to join</span> : null}
        </div>
        {meta ? (
          <div data-meta="" data-ell="">
            {meta}
          </div>
        ) : null}
        {description ? (
          <div data-meta="" style={{ marginTop: "var(--seam)", color: "var(--app-dim)" }}>
            {description}
          </div>
        ) : null}
        {error ? (
          <div data-meta="" role="alert" style={{ marginTop: "var(--s2)", color: "var(--danger-ink)" }}>
            {error}
          </div>
        ) : null}
      </div>
      {isCollection && action.kind !== "open" ? (
        <button data-btn="" data-state="" onClick={() => onAct(entry, "open")} style={{ flex: "none" }} aria-label={`Browse ${name}`}>
          Browse
        </button>
      ) : null}
      <button
        data-btn={action.kind === "open" ? undefined : "accent"}
        data-state=""
        data-busy={String(busy)}
        disabled={action.disabled || busy}
        onClick={() => onAct(entry, action.kind === "waiting" ? "open" : action.kind)}
        style={{ position: "relative", flex: "none" }}
        aria-label={`${action.label} ${name}`}
      >
        {action.label}
        <i data-spin="" aria-hidden="true" />
      </button>
    </div>
  );
}

function JoinByAddressForm({ address }: { address: DirectoryAddressFormProps }) {
  const { value, onChange, onSubmit, busy, error, label, placeholder, hint, submitLabel } = address;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
      <div data-formfield="">
        <label htmlFor="br-address">{label || 'Room address'}</label>
        <input
          id="br-address"
          data-field=""
          value={value}
          onChange={(ev) => onChange(ev.target.value)}
          placeholder={placeholder || "#general:example.org"}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div data-meta="">{hint || 'An alias (#room:server), a room ID (!id:server), or a matrix.to link. Private rooms still need an invite — you\'ll be told if this one does.'}</div>
      {error ? (
        <AlertBanner tone="danger" role="alert">
          <div>{error}</div>
        </AlertBanner>
      ) : null}
      <button type="submit" data-btn="fill" data-state="" data-busy={String(busy)} disabled={busy || !value.trim()} style={{ position: "relative", alignSelf: "flex-start" }}>
        {submitLabel || 'Join room'}
        <i data-spin="" aria-hidden="true" />
      </button>
    </form>
  );
}

// Stubs for testing / isolation
function ModalSurface({ children, title, width, height, onClose, className }: { children: ReactNode; title: string; width: number; height: number; onClose: () => void; className?: string }) {
  return (
    <div role="dialog" aria-label={title} style={{ width, height }} className={className}>
      <button onClick={onClose} aria-label="Close" style={{display: 'none'}}></button>
      {children}
    </div>
  );
}

function SegmentedControl({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div role="radiogroup">
      {options.map((o) => (
        <label key={o.value}>
          <input
            type="radio"
            role="radio"
            name="dir-tab"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function ToggleSwitch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <input
      type="checkbox"
      checked={on}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={label}
    />
  );
}

function AlertBanner({ children, tone, role, style }: { children: ReactNode; tone: string; role?: string; style?: React.CSSProperties }) {
  return (
    <div data-alert="" data-tone={tone} role={role} style={style}>
      {children}
    </div>
  );
}

function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
