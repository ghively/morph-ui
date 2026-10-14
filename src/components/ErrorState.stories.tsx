import { ErrorState } from './ErrorState';

export default {
  title: 'ErrorState',
  component: ErrorState,
};

export const LoadFailed = () => (
  <ErrorState
    title="Couldn't load the dashboard"
    code="503"
    action={<button type="button">Try again</button>}
    secondaryAction={<a href="#status">View status page</a>}
    details={'GET /api/dashboard\n→ 503 Service Unavailable (1142ms)\n\nupstream "metrics-api" connection refused\nrequest id: 7f3a91c2'}
  >
    The metrics service didn't respond in time. Your data is safe — retrying usually fixes it.
  </ErrorState>
);

export const Minimal = () => (
  <ErrorState title="Sync failed" action={<button type="button">Retry</button>}>
    We couldn't reach the server. Check your connection and try again.
  </ErrorState>
);

export const WithExceptionDetails = () => (
  <ErrorState
    title="Indexing stopped"
    code="ERR_PARSE"
    detailsLabel="Stack trace"
    details={'TypeError: Cannot read properties of undefined (reading "chunk")\n    at embedBatch (indexer.ts:214)\n    at async Pipeline.run (pipeline.ts:88)'}
    action={<button type="button">Restart indexer</button>}
  >
    A malformed document broke the parser. The run paused before anything was written.
  </ErrorState>
);
