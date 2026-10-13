import './StickySubnav.css';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
export interface StickySubnavProps { title:ReactNode; tabs:ReactNode; threshold?:number; className?:string; }
export function StickySubnav({title,tabs,threshold=96,className=''}:StickySubnavProps){const [stuck,setStuck]=useState(false);useEffect(()=>{const on=()=>setStuck(window.scrollY>threshold);on();window.addEventListener('scroll',on,{passive:true});return()=>window.removeEventListener('scroll',on)},[threshold]);return <div className={className} data-sticky-subnav="" data-stuck={stuck||undefined} aria-hidden={!stuck}>{<strong>{title}</strong>}<div data-sticky-subnav-tabs="">{tabs}</div></div>}
