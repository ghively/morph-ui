import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SignInTemplate, maskEmail } from '../src/templates/SignInTemplate';

const cells = (c: HTMLElement) => Array.from(c.querySelectorAll<HTMLInputElement>('[data-otpcell]'));

describe('SignInTemplate', () => {
  it('renders the credentials step with landmarks, one h1 and labelled controls', () => {
    const { container } = render(<SignInTemplate />);
    expect(container.querySelectorAll('main')).toHaveLength(1);
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]!.textContent).toBe('Sign in to Morph');
    expect(screen.getByRole('form', { name: 'Sign in' })).toBeTruthy();
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('alex@example.com');
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect((screen.getByLabelText('Remember me') as HTMLInputElement).checked).toBe(true);
    expect(screen.getByRole('button', { name: 'Continue with SSO' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Legal' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Privacy policy' }).getAttribute('href')).toBe('#privacy');
  });

  it('validates the password, then advances to verify and on to done with the right code', () => {
    const onStepChange = vi.fn();
    const { container } = render(<SignInTemplate onStepChange={onStepChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(container.textContent).toContain('Enter your password.');
    expect(onStepChange).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'hunter2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onStepChange).toHaveBeenLastCalledWith('verify');
    expect(container.textContent).toContain('a•••@example.com');
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeTruthy();

    fireEvent.change(cells(container)[0]!, { target: { value: '111111' } });
    expect(container.textContent).toContain('That code is incorrect');
    expect(onStepChange).toHaveBeenLastCalledWith('verify');

    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }));
    expect(container.textContent).not.toContain('That code is incorrect');
    fireEvent.change(cells(container)[0]!, { target: { value: '123456' } });
    expect(onStepChange).toHaveBeenLastCalledWith('done');
    expect(container.querySelector('h1')!.textContent).toBe("You're signed in");
    expect(container.textContent).toContain('Verified.');
  });

  it('shows the error immediately for a prefilled wrong code', () => {
    const { container } = render(<SignInTemplate step="verify" code="482913" />);
    expect(cells(container).every(c => c.getAttribute('aria-invalid') === 'true')).toBe(true);
    expect(container.textContent).toContain('That code is incorrect');
  });

  it('renders with empty data', () => {
    const { container } = render(<SignInTemplate email="" footerLinks={[]} />);
    expect(container.querySelector('main')).toBeTruthy();
    expect(container.querySelector('footer')).toBeNull();
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(container.textContent).toContain('Enter a valid email address.');
  });

  it('masks email addresses', () => {
    expect(maskEmail('alex@example.com')).toBe('a•••@example.com');
    expect(maskEmail('nope')).toBe('nope');
  });
});
