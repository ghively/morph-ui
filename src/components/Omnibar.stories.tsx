import { Omnibar } from './Omnibar'; export default {title:'Omnibar'};
const suggestions=[{id:'docs',label:'Documentation',description:'morph-ui.dev/docs',icon:'⌘'},{id:'repo',label:'Repository',description:'github.com/ghively',icon:'↗'}]; export const Default=()=> <Omnibar suggestions={suggestions}/>; export const Empty=()=> <Omnibar placeholder="Paste a URL"/>;
