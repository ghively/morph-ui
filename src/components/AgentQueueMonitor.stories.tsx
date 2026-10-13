import { AgentQueueMonitor } from './AgentQueueMonitor';
export default { title:'Agent ops/AgentQueueMonitor', component:AgentQueueMonitor };
const agents = [{id:'a1',label:'Planner',lane:'running' as const,waitMs:120,meta:'tool planning'},{id:'a2',label:'Retriever',lane:'queued' as const,waitMs:480},{id:'a3',label:'Verifier',lane:'done' as const,meta:'completed 2m ago'}];
export const Default = () => <AgentQueueMonitor agents={agents}/>;
export const Empty = () => <AgentQueueMonitor agents={[]} title="No active agents"/>;
