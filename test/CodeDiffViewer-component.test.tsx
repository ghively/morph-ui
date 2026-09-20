import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CodeDiffViewer } from '../src/components/CodeDiffViewer';

describe('CodeDiffViewer', () => {
  const sampleDiff = `@@ -1,3 +1,4 @@
 function add(a, b) {
-  return a + b;
+  // Add two numbers
+  return a + b + 0;
 }`;

  it('renders correctly in unified mode', () => {
    const { container } = render(<CodeDiffViewer diff={sampleDiff} defaultViewMode="unified" />);
    const el = container.querySelector('.code-diff-viewer');
    expect(el).toBeTruthy();
    
    // Check if added/deleted lines are rendered
    expect(container.querySelector('.code-diff-line-added')).toBeTruthy();
    expect(container.querySelector('.code-diff-line-deleted')).toBeTruthy();
  });

  it('renders correctly in split mode', () => {
    const { container } = render(<CodeDiffViewer diff={sampleDiff} defaultViewMode="split" />);
    
    // Check if the split table is used
    expect(container.querySelector('.code-diff-table-split')).toBeTruthy();
    
    // Split mode layout checks
    expect(container.querySelector('.code-diff-line-added')).toBeTruthy();
    expect(container.querySelector('.code-diff-line-deleted')).toBeTruthy();
  });

  it('handles empty diff', () => {
    const { getByText } = render(<CodeDiffViewer diff="" />);
    expect(getByText('No changes.')).toBeTruthy();
  });

  it('handles binary diff', () => {
    const { getByText } = render(<CodeDiffViewer diff="Binary files a/image.png and b/image.png differ" />);
    expect(getByText('Binary file changed.')).toBeTruthy();
  });

  it('truncates large diffs', () => {
    const largeDiff = "@@ -1,1 +1,2001 @@\n" + Array.from({ length: 2005 }, (_, i) => `+ Line ${i}`).join('\n');
    const { getByText } = render(<CodeDiffViewer diff={largeDiff} />);
    
    expect(getByText('Diff truncated: showing first 2000 lines.')).toBeTruthy();
  });

  it('can collapse and expand hunks', () => {
    const { container, getByText } = render(<CodeDiffViewer diff={sampleDiff} />);
    
    // Check initial state (expanded)
    expect(container.querySelector('.code-diff-line-added')).toBeTruthy();
    
    // Click to collapse
    const hunkHeader = getByText(/@@ -1,3 \+1,4 @@/);
    fireEvent.click(hunkHeader);
    
    // Should be collapsed
    expect(container.querySelector('.code-diff-line-added')).toBeFalsy();
    
    // Click to expand again
    fireEvent.click(hunkHeader);
    expect(container.querySelector('.code-diff-line-added')).toBeTruthy();
  });

  it('handles copy callback via clipboard API', async () => {
    // Mock navigator.clipboard
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const { getByLabelText } = render(<CodeDiffViewer diff={sampleDiff} />);
    
    const copyButton = getByLabelText('Copy full diff');
    fireEvent.click(copyButton);
    
    expect(mockWriteText).toHaveBeenCalledWith(sampleDiff);
  });

  it('supports keyboard hunk navigation', () => {
    const twoHunkDiff = `@@ -1,1 +1,2 @@\n+line1\n@@ -5,1 +6,2 @@\n+line2\n`;
    const { container } = render(<CodeDiffViewer diff={twoHunkDiff} />);
    
    const hunkGroups = container.querySelectorAll('.code-diff-hunk-group');
    expect(hunkGroups.length).toBe(2);
    
    const firstGroup = hunkGroups[0] as HTMLElement;
    const secondGroup = hunkGroups[1] as HTMLElement;
    
    // Focus first group
    firstGroup.focus();
    expect(document.activeElement).toBe(firstGroup);
    
    // Press 'j'
    fireEvent.keyDown(firstGroup, { key: 'j' });
    expect(document.activeElement).toBe(secondGroup);
    
    // Press 'k'
    fireEvent.keyDown(secondGroup, { key: 'k' });
    expect(document.activeElement).toBe(firstGroup);
    
    // Press 'Enter' to collapse
    fireEvent.keyDown(firstGroup, { key: 'Enter' });
    expect(container.querySelector('.code-diff-line-added')).toBeTruthy(); // Only one line added per hunk, should hide one
  });
});
