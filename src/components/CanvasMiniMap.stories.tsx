import { CanvasMiniMap } from './CanvasMiniMap';

export default { title: 'CanvasMiniMap', component: CanvasMiniMap };

export const Default = () => (
  <CanvasMiniMap contentWidth={800} contentHeight={520} viewport={{ x: 120, y: 80, width: 380, height: 260 }} width={180} />
);

export const Panoramic = () => (
  <CanvasMiniMap contentWidth={1600} contentHeight={480} viewport={{ x: 600, y: 120, width: 500, height: 300 }} width={220} />
);
