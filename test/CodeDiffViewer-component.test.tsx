
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeDiffViewer } from '../src/components/CodeDiffViewer';

describe('CodeDiffViewer', () => {
  it('parses a small unified diff into add/del/context rows with correct markers', () => {
    const diff = `@@ -1,3 +1,3 @@
 const a = 1;
-const b = 2;
+const b = 3;
 const c = 3;`;

    const { container } = render(<CodeDiffViewer diff={diff} />);

    // Check hunk header
    expect(screen.getByText('@@ -1,3 +1,3 @@')).toBeTruthy();

    // Check rows and markers
    const addRow = container.querySelector('.cdv-row-add');
    expect(addRow).toBeTruthy();
    expect(addRow?.textContent).toContain('+');
    expect(addRow?.textContent).toContain('const b = 3;');

    const delRow = container.querySelector('.cdv-row-del');
    expect(delRow).toBeTruthy();
    expect(delRow?.textContent).toContain('-');
    expect(delRow?.textContent).toContain('const b = 2;');

    const ctxRows = container.querySelectorAll('.cdv-row-ctx');
    expect(ctxRows.length).toBe(2);
    expect(ctxRows[0].textContent).toContain('const a = 1;');
    expect(ctxRows[1].textContent).toContain('const c = 3;');
  });

  it('renders hunk header', () => {
    const diff = `@@ -5,2 +5,2 @@\n context\n context`;
    render(<CodeDiffViewer diff={diff} />);
    expect(screen.getByText('@@ -5,2 +5,2 @@')).toBeTruthy();
  });

  it('renders error state without throwing for malformed input', () => {
    const malformedDiff = `this is not a diff`;
    
    // Should not throw
    const { container } = render(<CodeDiffViewer diff={malformedDiff} />);
    
    expect(container.querySelector('.cdv-error')).toBeTruthy();
    expect(screen.getByText(/Error parsing diff/)).toBeTruthy();
  });

  it('shows fileName header when provided', () => {
    const diff = `@@ -1 +1 @@\n-a\n+b`;
    render(<CodeDiffViewer diff={diff} fileName="test.ts" />);
    
    expect(screen.getByText('test.ts')).toBeTruthy();
  });

  it('renders line-number columns', () => {
    const diff = `@@ -10,3 +10,3 @@
 context1
-del1
+add1
 context2`;

    const { container } = render(<CodeDiffViewer diff={diff} />);
    const lineNums = container.querySelectorAll('.cdv-line-num');
    
    // 4 rows * 2 line number columns = 8 cells
    expect(lineNums.length).toBe(8);
    
    // context1
    expect(lineNums[0].textContent).toBe('10');
    expect(lineNums[1].textContent).toBe('10');
    
    // del1
    expect(lineNums[2].textContent).toBe('11');
    expect(lineNums[3].textContent).toBe('');
    
    // add1
    expect(lineNums[4].textContent).toBe('');
    expect(lineNums[5].textContent).toBe('11');
    
    // context2
    expect(lineNums[6].textContent).toBe('12');
    expect(lineNums[7].textContent).toBe('12');
  });
});
