import './MessageComposer.css';
import { MultimodalComposer } from './MultimodalComposer';
import { MentionAutocomplete } from './MentionAutocomplete';
import { useComposer, Ico, I, type MessageComposerProps } from './chatmsg.shared';

export function MessageComposer(props: MessageComposerProps) {
  const c = useComposer(props);
  const { placeholder, disabled = false, offline = false, offlineMessage, context = null, onAttach, uploads = [], overlay, className = '' } = props;
  const edit = context?.mode === 'edit';
  return (
    <div className={'composer ' + className} {...c.drop}>
      {offline && (
        <div className="composer-alert" data-composeralert="" data-tone="danger" data-enter="" role="status">
          <span className="composer-alert-dot" data-dot="" data-live="" />
          <div>{offlineMessage || <><strong>Not connected.</strong> You can keep writing — messages wait and send when the connection is back.</>}</div>
        </div>
      )}
      <div className="composer-shell" data-focusring="" data-composer="" data-ready={String(c.ready)} data-over={String(c.over)} data-mode={context?.mode}>
        {context && (
          <div className="composer-mode" data-composermode="">
            <span className="composer-chip" data-chip="" data-solid="">
              <Ico d={edit ? I.pen : I.replyTo} size={12} />
              {edit ? 'Editing' : 'Replying to ' + (context.senderName || 'someone')}
            </span>
            <span className="composer-preview" data-meta="">{context.preview}</span>
            <button type="button" className="composer-x" data-iconbtn="" onClick={context.onCancel} aria-label={edit ? 'Cancel edit' : 'Cancel reply'}><Ico d={I.x} size={12} /></button>
          </div>
        )}
        <MultimodalComposer disabled={disabled} placeholder={placeholder} draftText={props.draft.text} replyOrEditMode={!!context}
          onDraftChange={c.change} onKeyDown={c.keyDown} onSend={c.send} onAttach={onAttach} textareaRef={c.ta} />
        {overlay || (c.trigger && c.ranked.length > 0 && (
          <MentionAutocomplete trigger={c.trigger} candidates={c.ranked} activeIndex={c.acIndex} onActiveIndexChange={c.setAcIndex} onPick={c.pick} />
        ))}
        {uploads.length > 0 && (
          <div className="composer-uploads" data-morph="" data-open="true">
            {uploads.map(u => (
              <span key={u.name} className="composer-upload" data-chip="" data-solid="" role="status" style={{ ['--p' as string]: Math.min(100, Math.max(0, u.pct)) + '%' }}>
                {u.name} <span data-num="">{u.pct}%</span>
              </span>
            ))}
          </div>
        )}
        {c.over && onAttach && <div className="composer-drop" aria-hidden="true">Drop to attach</div>}
      </div>
    </div>
  );
}

export type { ComposerMention, ComposerDraft, UploadProgress, ComposerReplyContext, MessageComposerProps } from './chatmsg.shared';
