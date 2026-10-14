import { CanvasStatusBar } from './CanvasStatusBar';

export default { title: 'CanvasStatusBar', component: CanvasStatusBar };

export const Live = () => <CanvasStatusBar zoom={1.25} cursor={{ x: 380, y: 130 }} tool="Select" connection="live" />;

export const Syncing = () => <CanvasStatusBar zoom={0.75} cursor={{ x: 92, y: 47 }} tool="Pen" connection="syncing" />;

export const Offline = () => <CanvasStatusBar zoom={1} tool="Comment" connection="offline" />;
