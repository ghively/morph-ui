import { SectionNav } from './SectionNav'; export default {title:'SectionNav'};
const items=[{id:'intro',label:'Introduction'},{id:'details',label:'Details'},{id:'notes',label:'Notes'}]; export const Default=()=> <><SectionNav items={items} activeId="details"/><div style={{height:240}}/></>;
