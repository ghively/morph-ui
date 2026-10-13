import './ContentMaxWidth.css';
import type { ReactNode, CSSProperties } from 'react';
export interface ContentMaxWidthProps { children:ReactNode; measure?:'narrow'|'reading'|'wide'|number|string; gutters?:boolean; className?:string; }
export function ContentMaxWidth({children,measure='wide',gutters=true,className=''}:ContentMaxWidthProps){return <div className={className} data-content-max-width="" data-measure={typeof measure==='string'?measure:undefined} data-gutters={gutters||undefined} style={(typeof measure==='number'?{'--content-measure':`${measure}px`}:typeof measure==='string'&&!['narrow','reading','wide'].includes(measure)?{'--content-measure':measure}:undefined) as unknown as CSSProperties}>{children}</div>}
