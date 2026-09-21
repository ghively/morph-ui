import type { StoryDefault, Story } from '@ladle/react';
import { CodeDiffViewer } from "./CodeDiffViewer";
import type { DiffHunk } from "./CodeDiffViewer";

const unifiedDiff = `diff --git a/src/gateway/retry.ts b/src/gateway/retry.ts
index 3f1a2b4..9c7e021 100644
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
`;

const hunks: DiffHunk[] = [
  {
    oldStart: 4,
    oldLines: 4,
    newStart: 4,
    newLines: 5,
    lines: [
      { type: "meta", text: "@@ -4,4 +4,5 @@ export const config" },
      { type: "ctx", text: "export const config = {" },
      { type: "del", text: "  timeoutMs: 30_000," },
      { type: "add", text: "  timeoutMs: 120_000," },
      { type: "add", text: "  keepAlive: true," },
      { type: "ctx", text: "};" },
    ],
  },
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 760 }}>
    <CodeDiffViewer diff={unifiedDiff} fileName="src/gateway/retry.ts" />
  </div>
);

export const FromHunks = () => (
  <div style={{ padding: "2rem", maxWidth: 760 }}>
    <CodeDiffViewer hunks={hunks} fileName="src/config.ts" wrap maxHeight={220} />
  </div>
);
