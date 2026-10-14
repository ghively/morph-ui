import './CommandBar.css';
import type { ReactNode } from 'react';
export interface CommandBarAction { id:string; label:ReactNode; shortcut?:string; onSelect:()=>void; disabled?:boolean; }
export interface CommandBarProps { value?:string; onChange?:(value:string)=>void; onSubmit?:(value:string)=>void; placeholder?:string; actions?:CommandBarAction[]; className?:string; }
export function CommandBar({value,onChange,onSubmit,placeholder='Type a command…',actions=[],className=''}:CommandBarProps){return <div className={className} data-command-bar=""><span data-command-prompt="" aria-hidden="true">›</span><input aria-label="Command prompt" value={value} placeholder={placeholder} onChange={e=>onChange?.(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')onSubmit?.(e.currentTarget.value)}}/>{actions.map(a=><button key={a.id} type="button" onClick={a.onSelect} disabled={a.disabled}>{a.label}{a.shortcut&&<kbd>{a.shortcut}</kbd>}</button>)}</div>}
