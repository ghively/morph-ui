import { TokenUsageChart } from './TokenUsageChart';
export default { title:'Agent ops/TokenUsageChart', component:TokenUsageChart };
export const Default = () => <TokenUsageChart points={[{label:'10:00',prompt:1200,completion:500},{label:'10:15',prompt:1600,completion:700},{label:'10:30',prompt:1100,completion:900},{label:'10:45',prompt:2100,completion:800},{label:'11:00',prompt:1800,completion:1100}]}/>;
export const Empty = () => <TokenUsageChart points={[]}/>;
