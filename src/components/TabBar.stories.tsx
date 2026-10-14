import { useState } from 'react'; import { TabBar } from './TabBar';
export default {title:'TabBar'}; const tabs=[{id:'overview',label:'Overview'},{id:'activity',label:'Activity',badge:4},{id:'settings',label:'Settings'}];
export const Default=()=>{const [active,setActive]=useState('overview');return <TabBar tabs={tabs} activeId={active} onTabChange={setActive}/>};
export const Overflow=()=> <TabBar tabs={[...tabs,...tabs,...tabs]} activeId="activity" onTabChange={()=>{}}/>;
