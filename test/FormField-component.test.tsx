import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from '../src/components/FormField';

describe('FormField', () => {
  it('label htmlFor equals id', () => {
    const { container } = render(
      <FormField id="my-field" label="My Label">
        <input id="my-field" data-field="" />
      </FormField>
    );
    const label = container.querySelector('label');
    expect(label).toBeTruthy();
    expect(label!.getAttribute('for')).toBe('my-field');
    expect(label!.textContent).toBe('My Label');
  });

  it('no hint/probe -> [data-hint] is null', () => {
    const { container } = render(
      <FormField id="my-field" label="My Label">
        <input id="my-field" />
      </FormField>
    );
    const hint = container.querySelector('[data-hint]');
    expect(hint).toBeNull();
  });

  it('probe="fail" -> [data-hint] has data-probe="fail" and aria-live="polite"', () => {
    const { container } = render(
      <FormField id="my-field" label="My Label" probe="fail">
        <input id="my-field" />
      </FormField>
    );
    const hint = container.querySelector('[data-hint]');
    expect(hint).toBeTruthy();
    expect(hint!.getAttribute('data-probe')).toBe('fail');
    expect(hint!.getAttribute('aria-live')).toBe('polite');
    expect(hint!.getAttribute('data-meta')).toBe('');
  });

  it('hint as a node renders its children', () => {
    const { container } = render(
      <FormField id="my-field" label="My Label" hint={<span data-num="">42</span>}>
        <input id="my-field" />
      </FormField>
    );
    const hint = container.querySelector('[data-hint]');
    expect(hint).toBeTruthy();
    const span = hint!.querySelector('[data-num]');
    expect(span).toBeTruthy();
    expect(span!.textContent).toBe('42');
  });

  it('invalid -> [data-formfield] has data-invalid=""', () => {
    const { container } = render(
      <FormField id="my-field" label="My Label" invalid>
        <input id="my-field" />
      </FormField>
    );
    const field = container.querySelector('[data-formfield]');
    expect(field!.getAttribute('data-invalid')).toBe('');
  });

  it('children pass through untouched', () => {
    const { container } = render(
      <FormField id="x" label="X">
        <input id="x" data-field="" />
      </FormField>
    );
    const input = container.querySelector('input[data-field]');
    expect(input).toBeTruthy();
    expect(input!.id).toBe('x');
  });
});
