import type { FormEvent, ReactNode } from 'react';
import './CreateGroupDialog.css';

export interface CreateGroupValues {
  name: string;
  description: string;
  isCollection: boolean;
  isPublic: boolean;
  encrypted: boolean;
  collectionId: string;
  invites: string;
}

export interface CreateGroupCollection { id: string; name: string; }

/**
 * Host must handle invitee split + /^@[^:]+:.+$/ validation and surfacing of errors via the error prop.
 */
export interface CreateGroupDialogProps {
  values: CreateGroupValues;
  onChange: (next: CreateGroupValues) => void;
  onSubmit: (values: CreateGroupValues) => void;
  onClose: () => void;
  collections?: CreateGroupCollection[];
  busy?: boolean;
  copy?: Partial<{
    conversationTitle: string;
    collectionTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    descriptionLabel: string;
    collectionToggleHeading: string;
    collectionToggleHelp: string;
    collectionSelectLabel: string;
    collectionNoneLabel: string;
    publicHeading: string;
    publicHelp: string;
    encryptionHeading: string;
    encryptionOnHelp: string;
    encryptionOffHelp: string;
    inviteLabel: string;
    invitePlaceholder: string;
    submitLabel: string;
  }>;
  error?: string | null;
  className?: string;
}

export function CreateGroupDialog(props: CreateGroupDialogProps) {
  const {
    values,
    onChange,
    onSubmit,
    onClose,
    collections = [],
    busy = false,
    copy = {},
    error,
    className
  } = props;

  const {
    name,
    description,
    isCollection,
    isPublic,
    encrypted,
    collectionId,
    invites
  } = values;

  const c = {
    conversationTitle: 'New conversation',
    collectionTitle: 'New collection',
    nameLabel: 'Name',
    namePlaceholder: 'agents',
    descriptionLabel: 'Description',
    collectionToggleHeading: 'Collection',
    collectionToggleHelp: 'A collection groups conversations',
    collectionSelectLabel: 'Add to collection',
    collectionNoneLabel: 'No collection',
    publicHeading: 'Public',
    publicHelp: 'Anyone on the server can find and join',
    encryptionHeading: 'End-to-end encryption',
    encryptionOnHelp: 'Gateway agents will not be able to read this room.',
    encryptionOffHelp: 'Off, so Agent Gateway agents can take part.',
    inviteLabel: 'Invite',
    invitePlaceholder: '@agent_music:example.org, @gregory:example.org',
    submitLabel: 'Create',
    ...copy
  };

  const handleChange = (partial: Partial<CreateGroupValues>) => {
    onChange({ ...values, ...partial });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const title = isCollection ? c.collectionTitle : c.conversationTitle;

  return (
    <ModalSurface label={title} title={title} width={520} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        style={{ padding: "0 var(--s6) var(--s6)", display: "flex", flexDirection: "column", gap: "var(--s4)", overflow: "auto" }}
        className={className}
      >
        <div data-formfield="">
          <label htmlFor="cg-name">{c.nameLabel}</label>
          <input
            id="cg-name"
            data-field=""
            value={name}
            onChange={(e) => handleChange({ name: e.target.value })}
            required
            maxLength={120}
            placeholder={isCollection ? c.collectionTitle : c.namePlaceholder}
          />
        </div>
        <div data-formfield="">
          <label htmlFor="cg-desc">{c.descriptionLabel}</label>
          <input
            id="cg-desc"
            data-field=""
            value={description}
            onChange={(e) => handleChange({ description: e.target.value })}
            maxLength={300}
          />
        </div>
        <div data-setrow="">
          <div>
            <h4>{c.collectionToggleHeading}</h4>
            <p>{c.collectionToggleHelp}</p>
          </div>
          <ToggleSwitch
            on={isCollection}
            onChange={(v: boolean) => handleChange({ isCollection: v })}
            label={c.collectionToggleHeading}
          />
        </div>
        {!isCollection && collections.length > 0 ? (
          <div data-formfield="">
            <label htmlFor="cg-collection">{c.collectionSelectLabel}</label>
            <select
              id="cg-collection"
              data-field=""
              value={collectionId}
              onChange={(e) => handleChange({ collectionId: e.target.value })}
            >
              <option value="">{c.collectionNoneLabel}</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div data-setrow="">
          <div>
            <h4>{c.publicHeading}</h4>
            <p>{c.publicHelp}</p>
          </div>
          <ToggleSwitch
            on={isPublic}
            onChange={(v: boolean) => handleChange({ isPublic: v })}
            label={c.publicHeading}
          />
        </div>
        {!isCollection ? (
          <div data-setrow="">
            <div>
              <h4>{c.encryptionHeading}</h4>
              <p>{encrypted ? c.encryptionOnHelp : c.encryptionOffHelp}</p>
            </div>
            <ToggleSwitch
              on={encrypted}
              onChange={(v: boolean) => handleChange({ encrypted: v })}
              label={c.encryptionHeading}
            />
          </div>
        ) : null}
        <div data-formfield="">
          <label htmlFor="cg-invite">{c.inviteLabel}</label>
          <input
            id="cg-invite"
            data-field=""
            value={invites}
            onChange={(e) => handleChange({ invites: e.target.value })}
            placeholder={c.invitePlaceholder}
          />
        </div>
        {error ? (
          <div data-alert="" role="alert">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          data-btn="fill"
          data-state=""
          data-busy={String(busy)}
          disabled={busy || !name.trim()}
          style={{ position: "relative" }}
        >
          {c.submitLabel}
          <i data-spin="" aria-hidden="true" />
        </button>
      </form>
    </ModalSurface>
  );
}

function ModalSurface({ children, label, title, width, onClose }: { children: ReactNode; label: string; title: string; width: number; onClose: () => void }) {
  return (
    <div role="dialog" aria-label={label} title={title} style={{ width }}>
      <button onClick={onClose} aria-label="Close" style={{display: 'none'}}></button>
      {children}
    </div>
  );
}

function ToggleSwitch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <input
      type="checkbox"
      checked={on}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={label}
    />
  );
}
