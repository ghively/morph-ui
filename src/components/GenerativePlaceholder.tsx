
import './GenerativePlaceholder.css';

export type GenerativePlaceholderVariant = 
  | 'text' 
  | 'conversation' 
  | 'card' 
  | 'artifact' 
  | 'table' 
  | 'graph' 
  | 'agent';

export interface GenerativePlaceholderProps {
  variant: GenerativePlaceholderVariant;
  className?: string;
}

export function GenerativePlaceholder({ variant, className = '' }: GenerativePlaceholderProps) {
  return (
    <div className={`gen-placeholder gen-placeholder-${variant} ${className}`} aria-busy="true" role="progressbar">
      <div className="gen-shimmer-wrapper">
        {renderVariant(variant)}
      </div>
    </div>
  );
}

function renderVariant(variant: GenerativePlaceholderVariant) {
  switch (variant) {
    case 'text':
      return (
        <div className="gen-lines">
          <div className="gen-line" style={{ width: '100%' }} />
          <div className="gen-line" style={{ width: '90%' }} />
          <div className="gen-line" style={{ width: '70%' }} />
        </div>
      );
    case 'card':
      return (
        <div className="gen-card">
          <div className="gen-avatar" />
          <div className="gen-lines">
            <div className="gen-line" style={{ width: '60%' }} />
            <div className="gen-line" style={{ width: '40%' }} />
          </div>
        </div>
      );
    // Add other variants as needed
    default:
      return <div className="gen-line" style={{ width: '100%' }} />;
  }
}
