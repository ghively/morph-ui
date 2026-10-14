import { BatchRunTable } from './BatchRunTable';
export default { title:'Agent ops/BatchRunTable', component:BatchRunTable };
export const Default = () => <BatchRunTable jobs={[{id:'run-2048',label:'Support eval',status:'running',progress:64,duration:8200},{id:'run-2047',label:'Safety sweep',status:'succeeded',progress:100,duration:14200,resultHref:'#result'},{id:'run-2046',label:'Long context',status:'queued',progress:0}]}/>;
export const Empty = () => <BatchRunTable jobs={[]}/>;
