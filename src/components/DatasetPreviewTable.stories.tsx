import { DatasetPreviewTable } from './DatasetPreviewTable';
export default { title:'Agent ops/DatasetPreviewTable', component:DatasetPreviewTable };
const schema=['input','label','score']; const rows=Array.from({length:8},(_,i)=>({id:String(i),values:{input:'Example '+(i+1),label:i%2?'pass':'fail',score:(.72+i/100).toFixed(2)}}));
export const Default = () => <DatasetPreviewTable rows={rows} schema={schema} pageSize={4}/>;
export const Sample = () => <DatasetPreviewTable rows={rows} schema={schema} pageSize={4}/>;
