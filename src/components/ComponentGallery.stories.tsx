import { ComponentGallery } from './ComponentGallery';

export default {
  title: 'ComponentGallery',
  component: ComponentGallery,
};

/** Library viewing page: every agent-renderable component, live in one place. */
export const All = () => <ComponentGallery />;
