import './KeyKbd.css';
import type { ReactNode } from 'react';
export interface KeyKbdProps { keys:string|string[]; separator?:ReactNode; className?:string; }
export function KeyKbd({keys,separator='+',className=''}:KeyKbdProps){const list=Array.isArray(keys)?keys:[keys];return <span className={className} data-key-kbd="" aria-label={list.join(' ')}>{list.map((key,i)=><span key={`${key}-${i}`}><kbd>{key}</kbd>{i<list.length-1&&<span data-key-kbd-separator="" aria-hidden="true">{separator}</span>}</span>)}</span>}
