import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeDiffViewer } from '../src/components/CodeDiffViewer';

describe('CodeDiffViewer', () => {
  it('parses a small unified diff into add/del/context rows with correct markers', () => {
    const diff = `@@ -1,3 +1,3 @@
 const a = 1;
-const b = 2;
+const b = 3;
 const c = 3;`;

    const { container } = render(<CodeDiffViewer diff={diff} view="unified" />);
    expect(screen.getByText('@@ -1,3 +1,3 @@')).toBeTruthy();

    const addRow = container.querySelector('.cdv-row-add');
    expect(addRow?.textContent).toContain('+');
    expect(addRow?.textContent).toContain('const b = 3;');

    const delRow = container.querySelector('.cdv-row-del');
    expect(delRow?.textContent).toContain('-');
    expect(delRow?.textContent).toContain('const b = 2;');

    const ctxRows = container.querySelectorAll('.cdv-row-ctx');
    expect(ctxRows.length).toBe(2);
    expect(ctxRows[0].textContent).toContain('const a = 1;');
    expect(ctxRows[1].textContent).toContain('const c = 3;');
  });

  it('renders hunk header and its context text', () => {
    render(<CodeDiffViewer diff={`@@ -5,2 +5,2 @@ function main()\n context\n context`} />);
    expect(screen.getByText('@@ -5,2 +5,2 @@')).toBeTruthy();
    expect(screen.getByText('function main()')).toBeTruthy();
  });

  it('renders error state without throwing for malformed input', () => {
    const { container } = render(<CodeDiffViewer diff="this is not a diff" />);
    expect(container.querySelector('.cdv-error')).toBeTruthy();
    expect(screen.getByText(/Error parsing diff/)).toBeTruthy();
  });

  it('shows fileName header and +/- stats', () => {
    render(<CodeDiffViewer diff={`@@ -1 +1 @@\n-a\n+b`} fileName="test.ts" />);
    expect(screen.getByText('test.ts')).toBeTruthy();
    expect(screen.getByText('+1')).toBeTruthy();
    expect(screen.getByText('−1')).toBeTruthy();
  });

  it('renders line-number columns in unified view', () => {
    const diff = `@@ -10,3 +10,3 @@
 context1
-del1
+add1
 context2`;
    const { container } = render(<CodeDiffViewer diff={diff} view="unified" />);
    const n = [...container.querySelectorAll('.cdv-line-num')].map(e => e.textContent);
    expect(n).toEqual(['10', '10', '11', '', '', '11', '12', '12']);
  });

  it('defaults to split view and pairs del/add on one row', () => {
    const { container } = render(<CodeDiffViewer diff={`@@ -1,2 +1,2 @@\n-old\n+new\n same`} />);
    const pairs = container.querySelectorAll('.cdv-pair');
    expect(pairs.length).toBe(2);
    expect(pairs[0].querySelector('.cdv-row-del')?.textContent).toContain('old');
    expect(pairs[0].querySelector('.cdv-row-add')?.textContent).toContain('new');
  });

  it('toggles between split and unified', () => {
    const { container } = render(<CodeDiffViewer diff={`@@ -1 +1 @@\n-a\n+b`} />);
    fireEvent.click(screen.getByRole('radio', { name: 'unified' }));
    expect(container.querySelector('.cdv-pair')).toBeFalsy();
    expect(container.querySelectorAll('.cdv-row').length).toBe(2);
  });
});
