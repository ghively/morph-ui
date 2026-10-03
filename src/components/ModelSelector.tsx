import './ModelSelector.css';
import { useModelSelector, fmtK, type ModelSelectorProps } from './agentOps.shared';

export function ModelSelector(props: ModelSelectorProps) {
  const { placeholder = 'Select model', className = '' } = props;
  const m = useModelSelector(props);
  return (
    <div className={'model-selector ' + className} data-model-selector="" ref={m.rootRef} onKeyDown={m.onKeyDown} data-open={m.open ? '' : undefined}>
      <button type="button" className="model-selector-trig" data-model-selector-trigger="" onClick={m.toggle} aria-haspopup="listbox" aria-expanded={m.open} aria-controls={m.listId}>
        <span className="model-selector-tt" data-model-selector-trigger-text="">{m.selected ? m.selected.label : placeholder}</span>
        {m.selected && <span className="model-selector-spec">{fmtK(m.selected.contextWindow) + ' ctx'}</span>}
        <span className="model-selector-chev" data-model-selector-trigger-chevron="" aria-hidden="true">▾</span>
      </button>
      {m.open && (
        <div className="model-selector-pop" data-model-selector-popover="">
          {m.showSearch && <div className="model-selector-search" data-model-selector-search=""><input ref={m.searchRef} value={m.query} onChange={e => m.setQuery(e.target.value)} placeholder="Filter by name, vendor or tag" role="combobox" aria-expanded="true" aria-controls={m.listId} /></div>}
          <div className="model-selector-cols" aria-hidden="true"><span>Model</span><span>Context</span></div>
          <div className="model-selector-list" data-model-selector-listbox="" ref={m.listRef} role="listbox" id={m.listId} tabIndex={m.showSearch ? -1 : 0}
            aria-activedescendant={m.active >= 0 && m.filtered[m.active] ? m.listId + '-' + m.filtered[m.active].id : undefined}>
            {m.filtered.map((x, i) => (
              <div key={x.id} id={m.listId + '-' + x.id} data-index={i} role="option" aria-selected={x.id === props.selectedId} aria-disabled={!x.enabled}
                className="model-selector-item" data-model-selector-item="" data-active={i === m.active ? 'true' : undefined} data-disabled={!x.enabled ? 'true' : undefined} data-sel={x.id === props.selectedId ? '' : undefined}
                onClick={() => m.pick(x)} onMouseMove={() => x.enabled && i !== m.active && m.setActive(i)}>
                <span className="model-selector-name">
                  <b data-model-selector-label="">{x.label}</b>
                  <span><span data-model-selector-vendor="">{x.vendor}</span>{(x.tags || []).map(t => <span key={t} data-model-selector-tag="">{'· ' + t}</span>)}{!x.enabled && <span>· unavailable</span>}</span>
                </span>
                <span className="model-selector-cap">
                  <span className="model-selector-bar"><i style={{ width: Math.max(4, (x.contextWindow / m.maxCtx) * 100) + '%' }} /></span>
                  <span className="model-selector-num" data-model-selector-context="">{fmtK(x.contextWindow)}</span>
                </span>
              </div>
            ))}
            {m.filtered.length === 0 && <div className="model-selector-empty" data-model-selector-empty="">No models found</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export type { ModelInfo, ModelSelectorProps } from './agentOps.shared';
