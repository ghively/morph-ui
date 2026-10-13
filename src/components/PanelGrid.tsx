import './PanelGrid.css';
import type { ReactNode, CSSProperties } from 'react';
export interface PanelGridItem { id:string; content:ReactNode; span?:1|2|3; }
export interface PanelGridProps { items:PanelGridItem[]; columns?:number; className?:string; persistKey?:string; }
export function PanelGrid({items,columns=3,className='',persistKey}:PanelGridProps){return <div className={className} data-panel-grid="" style={{'--panel-columns':columns} as CSSProperties} data-persist-key={persistKey}>{items.map(i=><div key={i.id} data-panel="" data-span={i.span??1}>{i.content}</div>)}</div>}
