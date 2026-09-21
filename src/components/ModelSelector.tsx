import { useState, useRef, useMemo, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import './ModelSelector.css';

export interface ModelInfo {
  id: string;
  label: string;
  vendor: string;
  contextWindow: number;
  tags?: string[];
  enabled: boolean;
}

export interface ModelSelectorProps {
  models: ModelInfo[];
  selectedId?: string;
  onSelect: (id: string) => void;
  placeholder?: string;
}

export function ModelSelector({ models, selectedId, onSelect, placeholder = 'Select model' }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showSearch = models.length > 8;

  const filteredModels = useMemo(() => {
    if (!query) return models;
    const q = query.toLowerCase();
    return models.filter(m => 
      m.label.toLowerCase().includes(q) || 
      m.vendor.toLowerCase().includes(q) || 
      (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [models, query]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      const selectedIdx = filteredModels.findIndex(m => m.id === selectedId);
      setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
      
      if (showSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, showSearch, selectedId]); // Remove filteredModels to prevent resetting query on keystroke

  useEffect(() => {
    // Scroll active into view
    if (listboxRef.current && activeIndex >= 0) {
      const activeEl = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        const listRect = listboxRef.current.getBoundingClientRect();
        const itemRect = activeEl.getBoundingClientRect();
        
        if (itemRect.top < listRect.top) {
          listboxRef.current.scrollTop -= (listRect.top - itemRect.top);
        } else if (itemRect.bottom > listRect.bottom) {
          listboxRef.current.scrollTop += (itemRect.bottom - listRect.bottom);
        }
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredModels.length === 0) return;
      setActiveIndex(prev => {
        let next = prev === -1 ? 0 : prev;
        let attempts = 0;
        do {
            next = (next + 1) % filteredModels.length;
            attempts++;
        } while(!filteredModels[next].enabled && attempts < filteredModels.length);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredModels.length === 0) return;
      setActiveIndex(prev => {
        let next = prev === -1 ? 0 : prev;
        let attempts = 0;
        do {
            next = (next - 1 + filteredModels.length) % filteredModels.length;
            attempts++;
        } while(!filteredModels[next].enabled && attempts < filteredModels.length);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const model = filteredModels[activeIndex];
      if (model && model.enabled) {
        onSelect(model.id);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const selectedModel = models.find(m => m.id === selectedId);

  const formatContext = (cw: number) => {
      if (cw >= 1000) return `${(cw / 1000).toFixed(cw % 1000 === 0 ? 0 : 1)}k`;
      return String(cw);
  };

  return (
    <div data-model-selector="" ref={containerRef} onKeyDown={handleKeyDown}>
      <button 
        data-model-selector-trigger="" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span data-model-selector-trigger-text="">
          {selectedModel ? selectedModel.label : placeholder}
        </span>
        <span data-model-selector-trigger-chevron="" aria-hidden="true" data-open={isOpen ? "true" : undefined}>▼</span>
      </button>

      {isOpen && (
        <div data-model-selector-popover="">
          {showSearch && (
            <div data-model-selector-search="">
              <input
                ref={searchInputRef}
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                }}
                placeholder="Search models..."
                role="combobox"
                aria-expanded="true"
                aria-controls="model-selector-listbox"
                aria-autocomplete="list"
              />
            </div>
          )}
          
          <div 
            data-model-selector-listbox="" 
            ref={listboxRef}
            role="listbox" 
            id="model-selector-listbox"
            aria-activedescendant={activeIndex >= 0 ? `model-${filteredModels[activeIndex]?.id}` : undefined}
            tabIndex={showSearch ? -1 : 0} // focusable if no search input
          >
            {filteredModels.map((model, index) => {
              const isActive = index === activeIndex;
              const isSelected = model.id === selectedId;
              
              return (
                <div
                  key={model.id}
                  id={`model-${model.id}`}
                  data-model-selector-item=""
                  data-disabled={!model.enabled ? "true" : undefined}
                  data-active={isActive ? "true" : undefined}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={!model.enabled}
                  onClick={() => {
                    if (model.enabled) {
                      onSelect(model.id);
                      setIsOpen(false);
                    }
                  }}
                  onMouseEnter={() => {
                      if (model.enabled) {
                          setActiveIndex(index);
                      }
                  }}
                >
                  <div data-model-selector-item-content="">
                      <div data-model-selector-item-title="">
                          <span data-model-selector-vendor="">{model.vendor}</span>
                          <span data-model-selector-label="">{model.label}</span>
                      </div>
                      <div data-model-selector-item-meta="">
                          <span data-model-selector-context="">{formatContext(model.contextWindow)} ctx</span>
                          {model.tags?.map(t => (
                              <span key={t} data-model-selector-tag="">{t}</span>
                          ))}
                      </div>
                  </div>
                  {isSelected && <span data-model-selector-check="">✓</span>}
                </div>
              );
            })}
            
            {filteredModels.length === 0 && (
                <div data-model-selector-empty="">No models found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
