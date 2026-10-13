import './TabBar.css';
import { useRef } from 'react';
import type { ReactNode } from 'react';
export interface TabBarItem { id: string; label: ReactNode; badge?: ReactNode; disabled?: boolean; }
export interface TabBarProps { tabs: TabBarItem[]; activeId: string; onTabChange: (id: string) => void; label?: string; className?: string; }
export function TabBar({ tabs, activeId, onTabChange, label = 'Sections', className = '' }: TabBarProps) {
 const ref=useRef<HTMLDivElement>(null); const move=(id:string)=>{onTabChange(id); ref.current?.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(id)}"]`)?.focus();};
 const key=(e:React.KeyboardEvent<HTMLButtonElement>, id:string)=>{const enabled=tabs.filter(t=>!t.disabled), i=enabled.findIndex(t=>t.id===id); let n=-1; if(e.key==='ArrowRight')n=i+1; if(e.key==='ArrowLeft')n=i-1; if(e.key==='Home')n=0;if(e.key==='End')n=enabled.length-1;if(n>=0){e.preventDefault();move(enabled[(n+enabled.length)%enabled.length]!.id);}};
 return <nav className={className} data-tab-bar="" aria-label={label}><div ref={ref} role="tablist" data-tab-bar-list="">{tabs.map(t=><button key={t.id} type="button" role="tab" data-tab-id={t.id} aria-selected={t.id===activeId} data-active={t.id===activeId||undefined} tabIndex={t.id===activeId?0:-1} disabled={t.disabled} onClick={()=>move(t.id)} onKeyDown={e=>key(e,t.id)}><span>{t.label}</span>{t.badge!==undefined&&<span data-tab-bar-badge="">{t.badge}</span>}</button>)}</div></nav>;
}
