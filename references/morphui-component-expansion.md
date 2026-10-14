# Component Expansion Workflow: MorphUI Library
This document captures the proven workflow for large-scale UI component expansion and polishing within the `ghively/morph-ui` library, as established in the recent component generation session.

## Goals
*   Expand the component catalog by generating high-quality, production-ready components (new features).
*   Improve existing components (polish) to meet high-fidelity design and UX standards (e.g., spacing, rhythm, visual audit).
*   Ensure all new components pass a rigorous multi-stage validation process.

## The Workflow (Multi-Agent Dispatch)
1.  **Brief Generation**: A shared context document is created containing the design intent and functional requirements.
2.  **Dispatch**: A pool of specialized agents (builders, polish, QA) is spawned concurrently (max 10) to work on isolated git branches/worktrees.
3.  **Parallel Execution**: Agents build components and fix bugs in parallel.
4.  **Merge & Conflict Resolution**: Changes are merged sequentially into the main branch. Conflicts are resolved programmatically (e.g., using specific component groups to avoid overlap, or by applying a merge strategy).
5.  **Gate Execution (The 4 Gates)**:
    *   **Build**: Full project build must succeed.
    *   **Testing**: 100% of existing and new unit/integration tests must pass.
    *   **Lint**: Style compliance (CSS/TypeScript) must be met.
    *   **Typecheck**: Strict TypeScript validation must pass.
6.  **Visual Verification**: A post-merge check is performed:
    *   Check for CSS bundle presence.
    *   Validate responsive design across breakpoints (Mobile and Desktop viewports). The main container must use a responsive pattern (e.g., `width: 100% + max-width` + `stack-gap` in flex/grid) to prevent mobile-only layout appearance on desktop.
7.  **Deployment**: Commit changes, push to main, and trigger the CI workflow to regenerate visual baselines/snapshots.

## Key Pitfalls & Fixes
*   **Git Dependency Build**: If the library relies on a build step, ensure the `prepare` script is correctly defined and executed by the dependency manager (pnpm).
*   **CSS Loading**: Always verify the presence and correct loading of the CSS bundle (e.g., checking `document.styleSheets.length` in the browser console) to prevent blank/unstyled components.
*   **Layout Integrity**: Never use "shrink-to-fit" (e.g., `444px`) for main layout containers. Always force full width and use stack/gap mechanics for vertical rhythm.
*   **Agent Cleanup**: After expansion, ensure all temporary worktrees/branches are deleted to maintain a clean repository state.