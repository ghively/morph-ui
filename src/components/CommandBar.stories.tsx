import { CommandBar } from './CommandBar'; export default {title:'CommandBar'};
export const Default=()=> <CommandBar actions={[{id:'run',label:'Run',shortcut:'⌘↵',onSelect:()=>{}},{id:'save',label:'Save',onSelect:()=>{}}]}/>;
export const Minimal=()=> <CommandBar placeholder="Ask anything…"/>;
