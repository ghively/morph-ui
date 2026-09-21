import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CredentialSignInForm } from '../src/components/CredentialSignInForm';

describe('CredentialSignInForm', () => {
  const defaults = {
    server: '', onServerChange: () => {},
    username: '', onUsernameChange: () => {},
    password: '', onPasswordChange: () => {},
    onSubmit: () => {},
    title: 'Sign In'
  };

  it('renders form with title and default fields', () => {
    render(<CredentialSignInForm {...defaults} />);
    expect(screen.getByRole('form', { name: 'Sign in' })).toBeTruthy();
    expect(screen.getByText('Sign In')).toBeTruthy();
    expect(screen.getByLabelText('Server')).toBeTruthy();
    expect(screen.getByLabelText('Username')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });

  it('displays probe states', () => {
    const { rerender } = render(<CredentialSignInForm {...defaults} probe="idle" />);
    expect(screen.getByText('A server name or URL')).toBeTruthy();

    rerender(<CredentialSignInForm {...defaults} probe="checking" />);
    expect(screen.getByText('Finding your server…')).toBeTruthy();

    rerender(<CredentialSignInForm {...defaults} probe="ok" resolvedServer="http://test.com" />);
    expect(screen.getByText('http://test.com')).toBeTruthy();

    rerender(<CredentialSignInForm {...defaults} probe="fail" server=" fail.com " />);
    const serverInput = screen.getByLabelText('Server') as HTMLInputElement;
    expect(serverInput.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText("fail.com")).toBeTruthy();
  });

  it('handles passwordEnabled=false', () => {
    render(<CredentialSignInForm {...defaults} passwordEnabled={false} />);
    expect(screen.queryByLabelText('Username')).toBeNull();
    expect(screen.queryByLabelText('Password')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Sign in' })).toBeNull();
    expect(screen.getByRole('alert')).toBeTruthy(); // noFlowsMessage
  });

  it('renders SSO providers if resolvedServer is present', () => {
    const onSso = vi.fn();
    const ssoProviders = [{ id: 'google', name: 'Google' }];
    const { rerender } = render(<CredentialSignInForm {...defaults} ssoProviders={ssoProviders} resolvedServer={null} onSso={onSso} />);
    expect(screen.queryByRole('button', { name: 'Google' })).toBeNull();

    rerender(<CredentialSignInForm {...defaults} ssoProviders={ssoProviders} resolvedServer="https://x" onSso={onSso} />);
    const btn = screen.getByRole('button', { name: 'Google' });
    expect(btn).toBeTruthy();
    
    fireEvent.click(btn);
    expect(onSso).toHaveBeenCalledWith('google');
  });

  it('displays error banner', () => {
    render(<CredentialSignInForm {...defaults} error="Wrong password." />);
    expect(screen.getByRole('alert').textContent).toContain('Wrong password.');
  });

  it('submits form correctly', () => {
    const onSubmit = vi.fn();
    render(<CredentialSignInForm {...defaults} onSubmit={onSubmit} username="u" password="p" />);
    
    const form = screen.getByRole('form', { name: 'Sign in' });
    fireEvent.submit(form);
    
    expect(onSubmit).toHaveBeenCalled();
  });

  it('reflects busy state on submit button', () => {
    render(<CredentialSignInForm {...defaults} busy={true} />);
    const btn = screen.getByRole('button', { name: 'Sign in' }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('data-busy')).toBe('true');
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });
});
