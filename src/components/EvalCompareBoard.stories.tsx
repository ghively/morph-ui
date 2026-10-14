import { EvalCompareBoard } from './EvalCompareBoard';
export default { title:'Agent ops/EvalCompareBoard', component:EvalCompareBoard };
const dims = [{name:'Accuracy',score:94},{name:'Grounding',score:88},{name:'Style',score:91}];
export const Default = () => <EvalCompareBoard cards={[{id:'a',label:'Candidate A',model:'mistral-large',prompt:'v12',score:91,dimensions:dims},{id:'b',label:'Candidate B',model:'gpt-5',prompt:'v13',score:87,dimensions:[...dims.map(d=>({...d,score:d.score-4}))]}]}/>;
export const Tie = () => <EvalCompareBoard cards={[{id:'a',label:'Baseline',model:'model-a',score:80,dimensions:dims},{id:'b',label:'Challenger',model:'model-b',score:82,dimensions:dims}]}/>;
