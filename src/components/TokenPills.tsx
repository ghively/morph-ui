import { useRef, type KeyboardEvent } from 'react';
import './TokenPills.css';

export interface TokenPillsProps {
  options: Array<{ id: string; label: string }>;
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function TokenPills({
  options,
  selectedIds,
  onChange,
  multiSelect = true,
  className = '',
  ariaLabel = 'Select options'
}: TokenPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (id: string) => {
    if (multiSelect) {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter(selectedId => selectedId !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    } else {
      onChange([id]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOption(id);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      const nextButton = containerRef.current?.querySelectorAll('button')[nextIndex];
      nextButton?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      const prevButton = containerRef.current?.querySelectorAll('button')[prevIndex];
      prevButton?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`token-pills ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option, index) => {
        const isSelected = selectedIds.includes(option.id);
        // Using existing ChatUIMorph pill semantics via data attributes
        return (
          <button
            key={option.id}
            type="button"
            className="token-pill"
            data-chip=""
            data-on={isSelected ? "true" : undefined}
            data-solid={isSelected ? "" : undefined}
            aria-pressed={isSelected}
            onClick={() => toggleOption(option.id)}
            onKeyDown={(e) => handleKeyDown(e, option.id, index)}
            tabIndex={index === 0 ? 0 : -1} // Roving tabindex logic setup
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
