import { ModelPerfPanel } from './ModelPerfPanel';
export default { title:'Agent ops/ModelPerfPanel', component:ModelPerfPanel };
export const Default = () => <ModelPerfPanel models={[{id:'gpt5',model:'GPT-5',latencyMs:820,tokensPerSec:122,cost:.012},{id:'mistral',model:'Mistral Large',latencyMs:540,tokensPerSec:158,cost:.006},{id:'sonnet',model:'Claude Sonnet',latencyMs:690,tokensPerSec:141,cost:.009}]}/>;
export const Single = () => <ModelPerfPanel models={[{id:'local',model:'Local model',latencyMs:42,tokensPerSec:380,cost:0}]}/>;
