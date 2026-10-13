import { TraceWaterfall } from './TraceWaterfall';
export default { title:'Agent ops/TraceWaterfall', component:TraceWaterfall };
export const Default = () => <TraceWaterfall spans={[{id:'1',name:'Request',startMs:0,durationMs:860,detail:'HTTP request'},{id:'2',name:'Retrieve context',startMs:60,durationMs:220,depth:1},{id:'3',name:'Model completion',startMs:310,durationMs:480,depth:1},{id:'4',name:'Persist trace',startMs:800,durationMs:60,depth:1}]}/>;
export const Nested = () => <TraceWaterfall spans={[{id:'1',name:'Agent run',startMs:0,durationMs:500},{id:'2',name:'Tool call',startMs:40,durationMs:280,depth:1},{id:'3',name:'HTTP',startMs:80,durationMs:160,depth:2}]}/>;
