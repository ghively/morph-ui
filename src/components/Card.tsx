import type { ReactNode } from 'react';
import './Card.css';

export interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Generic dashboard tile. Prefer this over bespoke panels for agent-rendered grids. */
export function Card({ children, title, subtitle, actions, className = '' }: CardProps) {
  return (
    <section className={className} data-card="">
      {(title || subtitle || actions) && (
        <header data-cardhead="">
          <div data-cardtitles="">
            {title && <h3 data-cardtitle="">{title}</h3>}
            {subtitle && <p data-cardsubtitle="">{subtitle}</p>}
          </div>
          {actions && <div data-cardactions="">{actions}</div>}
        </header>
      )}
      <div data-cardbody="">{children}</div>
    </section>
  );
}
