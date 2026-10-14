import { CanvasToolbar } from './CanvasToolbar';

export default { title: 'CanvasToolbar', component: CanvasToolbar };

export const CenterDock = () => <CanvasToolbar dock="center" defaultTool="pen" />;

export const LeftDock = () => <CanvasToolbar dock="left" defaultTool="select" />;

export const RightDock = () => <CanvasToolbar dock="right" defaultTool="comment" />;

export const SubsetOfTools = () => <CanvasToolbar tools={['select', 'pen']} defaultTool="pen" />;
