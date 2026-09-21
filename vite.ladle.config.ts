import { defineConfig } from "vite";

/**
 * Ladle otherwise inherits the root vite.config.ts, whose library build
 * (build.lib + external react) overrides the catalog app build and emits
 * the bundled library with no index.html. The catalog needs a plain app
 * build, so it gets its own config.
 */
export default defineConfig({});
