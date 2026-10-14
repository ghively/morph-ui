import { PromptVersionDiff } from './PromptVersionDiff';
export default { title:'Agent ops/PromptVersionDiff', component:PromptVersionDiff };
export const Default = () => <PromptVersionDiff before={{id:'v11',label:'Version 11',lines:['You are a concise assistant.','Answer with evidence.','Do not speculate.']}} after={{id:'v12',label:'Version 12',lines:['You are a concise research assistant.','Answer with evidence.','Cite the source for every claim.']}}/>;
export const Unchanged = () => <PromptVersionDiff before={{id:'v1',label:'v1',lines:['Hello']}} after={{id:'v1',label:'v1',lines:['Hello']}}/>;
