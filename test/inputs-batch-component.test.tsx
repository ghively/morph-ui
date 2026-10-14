import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RichTextEditor } from '../src/components/RichTextEditor';
import { TagInput } from '../src/components/TagInput';
import { ColorField } from '../src/components/ColorField';
import { RatingControl } from '../src/components/RatingControl';
import { Numpad } from '../src/components/Numpad';
import { SliderRange } from '../src/components/SliderRange';

describe('inputs batch', () => {
  it('wires rich text HTML and tag removal', () => {
    const onHtml = vi.fn();
    render(<RichTextEditor label="Body" value="<p>Hello</p>" onChange={onHtml} />);
    expect(screen.getByRole('textbox').textContent).toContain('Hello');
    fireEvent.input(screen.getByRole('textbox'), { target: { innerHTML: '<p>Updated</p>' } });
    expect(onHtml).toHaveBeenLastCalledWith('<p>Updated</p>');
    const onTags = vi.fn();
    render(<TagInput label="Tags" value={['one', 'two']} onChange={onTags} />);
    fireEvent.keyDown(screen.getByLabelText('Tags'), { key: 'Backspace' });
    expect(onTags).toHaveBeenCalledWith(['one']);
  });

  it('syncs the color picker and keyboard rating', () => {
    const onColor = vi.fn();
    render(<ColorField label="Color" value="#112233" onChange={onColor} />);
    fireEvent.change(screen.getByLabelText('Choose color'), { target: { value: '#aabbcc' } });
    expect(onColor).toHaveBeenCalledWith('#aabbcc');
    const onRating = vi.fn();
    render(<RatingControl label="Score" value={3} onChange={onRating} />);
    fireEvent.keyDown(screen.getByRole('radio', { name: '3 of 5' }), { key: 'ArrowRight' });
    expect(onRating).toHaveBeenCalledWith(4);
  });

  it('constrains numpad input and keeps range thumbs ordered', () => {
    const onNumber = vi.fn();
    render(<Numpad value="12" onChange={onNumber} maxLength={2} />);
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onNumber).not.toHaveBeenCalled();
    const onRange = vi.fn();
    render(<SliderRange id="range" min={0} max={100} value={[20, 80]} onChange={onRange} />);
    fireEvent.change(screen.getByLabelText('range minimum'), { target: { value: '90' } });
    expect(onRange).toHaveBeenCalledWith([80, 80]);
  });
});
