import { FeatureFlagPanel } from './FeatureFlagPanel';
export default { title:'Agent ops/FeatureFlagPanel', component:FeatureFlagPanel };
export const Default = () => <FeatureFlagPanel flags={[{id:'streaming-v2',label:'Streaming v2',state:'on',audience:100,modified:'4m ago'},{id:'trace-waterfall',label:'Trace waterfall',state:'partial',audience:25,modified:'Yesterday'},{id:'new-eval-rubric',label:'New eval rubric',state:'off',audience:0,modified:'Oct 10'}]}/>;
export const Empty = () => <FeatureFlagPanel flags={[]}/>;
