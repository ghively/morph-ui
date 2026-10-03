import { CodeDiffViewer, type DiffHunk } from './CodeDiffViewer';

const unifiedDiff = `diff --git a/src/gateway/retry.ts b/src/gateway/retry.ts
--- a/src/gateway/retry.ts
+++ b/src/gateway/retry.ts
@@ -12,8 +12,10 @@ export async function withRetry<T>(
   let attempt = 0;
   while (attempt < maxAttempts) {
     try {
       return await fn();
     } catch (error) {
-      await sleep(500);
+      const backoff = Math.min(500 * 2 ** attempt, 8_000);
+      await sleep(backoff + Math.random() * 250);
       attempt += 1;
     }
   }
@@ -41,4 +43,4 @@ export function isRetryable(err: unknown) {
   if (!(err instanceof HttpError)) return false;
-  return err.status >= 500;
+  return err.status >= 500 || err.status === 429;
 }
`;

const hunks: DiffHunk[] = [
  {
    oldStart: 4, oldLines: 3, newStart: 4, newLines: 4, header: 'export const config',
    lines: [
      { type: 'ctx', text: 'export const config = {' },
      { type: 'del', text: '  timeoutMs: 30_000,' },
      { type: 'add', text: '  timeoutMs: 120_000,' },
      { type: 'add', text: '  keepAlive: true,' },
      { type: 'ctx', text: '};' },
    ],
  },
];

export const Default = () => (
  <div style={{ maxWidth: 820 }}>
    <CodeDiffViewer diff={unifiedDiff} fileName="src/gateway/retry.ts" />
  </div>
);

export const Unified = () => (
  <div style={{ maxWidth: 820 }}>
    <CodeDiffViewer diff={unifiedDiff} fileName="src/gateway/retry.ts" view="unified" />
  </div>
);

export const FromHunks = () => (
  <div style={{ maxWidth: 820 }}>
    <CodeDiffViewer hunks={hunks} fileName="src/config.ts" wrap maxHeight={220} />
  </div>
);

export const ParseError = () => (
  <div style={{ maxWidth: 820 }}>
    <CodeDiffViewer diff="not a diff" fileName="src/broken.ts" />
  </div>
);
