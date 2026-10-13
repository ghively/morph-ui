import './PageHeader.css';
import type { ReactNode } from 'react';
export interface PageHeaderProps { title:ReactNode; breadcrumbs?:ReactNode; actions?:ReactNode; tabs?:ReactNode; className?:string; }
export function PageHeader({title,breadcrumbs,actions,tabs,className=''}:PageHeaderProps){return <header className={className} data-page-header=""><div data-page-header-toolbar=""><div data-page-header-copy="">{breadcrumbs&&<div data-page-header-breadcrumbs="">{breadcrumbs}</div>}<h1>{title}</h1></div>{actions&&<div data-page-header-actions="">{actions}</div>}</div>{tabs&&<div data-page-header-tabs="">{tabs}</div>}</header>}
