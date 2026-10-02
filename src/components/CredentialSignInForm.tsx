import type { FormEvent, ReactNode } from 'react';
import { HeroPanel } from './HeroPanel';
import { FormField } from './FormField';
import { AlertBanner } from './AlertBanner';
import './CredentialSignInForm.css';

export type ServerProbe = 'idle' | 'checking' | 'ok' | 'fail';

export interface SsoProvider { id: string; name: string; }

/**
 * Host must debounce server probes (e.g., 350ms, resetting to idle on empty field)
 * and handle specific error codes like M_FORBIDDEN or M_LIMIT_EXCEEDED.
 */
export interface CredentialSignInFormProps {
  server: string;
  onServerChange: (v: string) => void;
  probe?: ServerProbe;
  resolvedServer?: string | null;
  username: string;
  onUsernameChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  passwordEnabled?: boolean;
  ssoProviders?: SsoProvider[] | null;
  onSso?: (providerId: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  error?: string | null;
  noFlowsMessage?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  copy?: Partial<{
    serverLabel: string;
    serverPlaceholder: string;
    serverIdle: string;
    serverChecking: string;
    usernameLabel: string;
    passwordLabel: string;
    submitLabel: string;
    ssoEyebrow: string;
  }>;
  className?: string;
}

export function CredentialSignInForm(props: CredentialSignInFormProps) {
  const {
    server, onServerChange,
    probe = 'idle',
    resolvedServer,
    username, onUsernameChange,
    password, onPasswordChange,
    passwordEnabled = true,
    ssoProviders, onSso,
    onSubmit,
    busy,
    error,
    noFlowsMessage = "This server doesn't offer password or single sign-on login.",
    title,
    description,
    copy = {},
    className
  } = props;

  const c = {
    serverLabel: 'Server',
    serverPlaceholder: '',
    serverIdle: 'A server name or URL',
    serverChecking: 'Finding your server…',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    submitLabel: 'Sign in',
    ssoEyebrow: 'Or continue with',
    ...copy
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={className} style={{ maxWidth: 440 }}>
      <HeroPanel title={title} description={description} maxWidth={440} />
      <form
        data-card=""
        data-pad="roomy"
        style={{ display: "flex", flexDirection: "column", gap: "var(--s5)" }}
        aria-label="Sign in"
        onSubmit={handleSubmit}
      >
        <FormField label={c.serverLabel} id="hs" probe={probe} invalid={probe === 'fail'} hint={
          <>
            {probe === 'ok' && resolvedServer ? (
              <>Connecting to <span data-num="">{resolvedServer}</span></>
            ) : probe === 'checking' ? (
              c.serverChecking
            ) : probe === 'fail' ? (
              <>Couldn't reach <span data-num="">{server.trim()}</span> — check the address, or paste the full URL (e.g. https://host).</>
            ) : (
              c.serverIdle
            )}
          </>
        }>
          <input
            id="hs"
            data-field=""
            value={server}
            onChange={(e) => onServerChange(e.target.value)}
            placeholder={c.serverPlaceholder}
            autoComplete="url"
            required
            aria-invalid={probe === 'fail'}
          />
        </FormField>

        {passwordEnabled ? (
          <>
            <FormField label={c.usernameLabel} id="user">
              <input
                id="user"
                data-field=""
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                autoComplete="username"
                required
              />
            </FormField>
            <FormField label={c.passwordLabel} id="pw">
              <input
                id="pw"
                data-field=""
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                autoComplete="current-password"
                required
              />
            </FormField>
            <button
              type="submit"
              data-btn="fill"
              data-state=""
              data-busy={String(busy)}
              aria-busy={busy}
              disabled={busy}
              style={{ position: "relative" }}
            >
              {c.submitLabel}
              <i data-spin="" aria-hidden="true" />
            </button>
          </>
        ) : null}

        {passwordEnabled === false && (!ssoProviders || ssoProviders.length === 0) ? (
          <AlertBanner tone="danger" role="alert">
            {noFlowsMessage}
          </AlertBanner>
        ) : null}

        {ssoProviders && ssoProviders.length > 0 && resolvedServer ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
            <div data-eyebrow="">{c.ssoEyebrow}</div>
            {ssoProviders.map(p => (
              <button
                key={p.id || 'sso'}
                type="button"
                data-btn=""
                data-state=""
                onClick={() => onSso?.(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
        ) : null}

        {error ? (
          <AlertBanner tone="danger" role="alert">
            {error}
          </AlertBanner>
        ) : null}
      </form>
    </div>
  );
}
