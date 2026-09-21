import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateGroupDialog } from '../src/components/CreateGroupDialog';

describe('CreateGroupDialog', () => {
  const defaultValues = {
    name: '',
    description: '',
    isCollection: false,
    isPublic: false,
    encrypted: false,
    collectionId: '',
    invites: ''
  };

  it('renders correctly for conversation', () => {
    render(
      <CreateGroupDialog
        values={defaultValues}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('New conversation');
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    expect(nameInput.required).toBe(true);
    expect(nameInput.maxLength).toBe(120);
    const descInput = screen.getByLabelText('Description') as HTMLInputElement;
    expect(descInput.maxLength).toBe(300);
  });

  it('renders correctly for collection', () => {
    render(
      <CreateGroupDialog
        values={{ ...defaultValues, isCollection: true }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('New collection');
    expect(screen.queryByText('End-to-end encryption')).toBeNull();
  });

  it('handles collections rendering logic', () => {
    const collections = [{ id: '1', name: 'Col 1' }];
    const { rerender } = render(
      <CreateGroupDialog
        values={defaultValues}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
        collections={[]}
      />
    );
    expect(screen.queryByLabelText('Add to collection')).toBeNull();

    rerender(
      <CreateGroupDialog
        values={defaultValues}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
        collections={collections}
      />
    );
    expect(screen.getByLabelText('Add to collection')).toBeTruthy();

    rerender(
      <CreateGroupDialog
        values={{ ...defaultValues, isCollection: true }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
        collections={collections}
      />
    );
    expect(screen.queryByLabelText('Add to collection')).toBeNull();
  });

  it('handles encryption text changes', () => {
    const { rerender } = render(
      <CreateGroupDialog
        values={defaultValues}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Off, so Agent Gateway agents can take part.')).toBeTruthy();

    rerender(
      <CreateGroupDialog
        values={{ ...defaultValues, encrypted: true }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Gateway agents will not be able to read this room.')).toBeTruthy();
  });

  it('validates submission conditions', () => {
    const onSubmit = vi.fn();
    const { rerender } = render(
      <CreateGroupDialog
        values={{ ...defaultValues, name: '   ' }}
        onChange={() => {}}
        onSubmit={onSubmit}
        onClose={() => {}}
      />
    );
    const submitBtn = screen.getByRole('button', { name: /Create/ }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);

    rerender(
      <CreateGroupDialog
        values={{ ...defaultValues, name: 'Valid' }}
        onChange={() => {}}
        onSubmit={onSubmit}
        onClose={() => {}}
      />
    );
    expect(submitBtn.disabled).toBe(false);

    rerender(
      <CreateGroupDialog
        values={{ ...defaultValues, name: 'Valid' }}
        onChange={() => {}}
        onSubmit={onSubmit}
        onClose={() => {}}
        busy={true}
      />
    );
    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.getAttribute('data-busy')).toBe('true');
    expect(submitBtn.querySelector('[data-spin]')).toBeTruthy();
  });

  it('fires onSubmit with prevented default', () => {
    const onSubmit = vi.fn();
    render(
      <CreateGroupDialog
        values={{ ...defaultValues, name: 'Valid' }}
        onChange={() => {}}
        onSubmit={onSubmit}
        onClose={() => {}}
      />
    );
    const form = screen.getByRole('button', { name: /Create/ }).closest('form');
    fireEvent.submit(form!);
    expect(onSubmit).toHaveBeenCalledWith({ ...defaultValues, name: 'Valid' });
  });

  it('displays error in alert role', () => {
    render(
      <CreateGroupDialog
        values={defaultValues}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
        error="Invalid invitee"
      />
    );
    const alert = screen.getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toBe('Invalid invitee');
  });

  it('calls onChange with merged values', () => {
    const onChange = vi.fn();
    render(
      <CreateGroupDialog
        values={defaultValues}
        onChange={onChange}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    );
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New' } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultValues, name: 'New' });
  });
});
