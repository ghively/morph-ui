import { ABTestCard } from './ABTestCard';
export default { title:'Agent ops/ABTestCard', component:ABTestCard };
export const Default = () => <ABTestCard name="Answer format experiment" variants={[{id:'a',label:'A · baseline',conversions:482,visitors:10000},{id:'b',label:'B · citations',conversions:531,visitors:10000}]} significance="95% significant"/>;
export const Inconclusive = () => <ABTestCard name="Shorter system prompt" variants={[{id:'a',label:'A',conversions:49,visitors:1000},{id:'b',label:'B',conversions:50,visitors:1000}]}/>;
