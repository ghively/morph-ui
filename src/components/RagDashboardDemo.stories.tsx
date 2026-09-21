import { RagDashboardDemo } from './RagDashboardDemo';

export default {
  title: 'RagDashboardDemo',
  component: RagDashboardDemo,
};

/**
 * Full working demo: corporate RAG command center. Ask a question in the
 * Answer lab tab, watch the staged pipeline, inspect citations, and drill
 * into retrieval from the drawer.
 */
export const CommandCenter = () => <RagDashboardDemo />;
