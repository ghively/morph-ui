/**
 * SignInTemplate — a three-step sign-in screen composed from library parts:
 * credentials (email / password / remember me / SSO) → one-time-code
 * verification → signed-in confirmation.
 *
 * Composition: HeroPanel (brand mark + heading, maxWidth 440) carries each
 * step's body in its `actions` slot; TextField, Checkbox, Button and Divider
 * build the credentials form; OtpInput handles the verification code;
 * AlertBanner + EmptyState make up the confirmation. A small footer links to
 * terms and privacy.
 *
 * Presentational only: the step starts at `step` and then advances through
 * local state. The demo accepts `expectedCode` ("123456") and shows an error
 * for any other complete code. No network, no timers.
 *
 * Provenance: original morph-ui composition (2026-10).
 */
import { useState, type FormEvent, type ReactNode } from 'react';
import { HeroPanel } from '../components/HeroPanel';
import { TextField } from '../components/TextField';
import { Checkbox } from '../components/Checkbox';
import { Button } from '../components/Button';
import { Divider } from '../components/Divider';
import { OtpInput } from '../components/OtpInput';
import { AlertBanner } from '../components/AlertBanner';
import { EmptyState } from '../components/EmptyState';
import './SignInTemplate.css';

export type SignInStep = 'credentials' | 'verify' | 'done';

export interface SignInFooterLink {
  label: string;
  href: string;
}

export interface SignInTemplateProps {
  /** Step to start on. Later steps are reached through local state. Default 'credentials'. */
  step?: SignInStep;
  /** Called whenever the screen moves to another step. */
  onStepChange?: (step: SignInStep) => void;
  /** Product name used in the headings. */
  brand?: string;
  /** Prefilled email address. */
  email?: string;
  /** Prefilled password (demo/stories only). */
  password?: string;
  /** Initial state of "Remember me". */
  remember?: boolean;
  /** Code the verify step accepts. Default '123456'. */
  expectedCode?: string;
  /** Code already typed on the verify step; a complete wrong code shows the error immediately. */
  code?: string;
  /** Where the done step says the user is headed. */
  destination?: string;
  /** Footer links (terms, privacy, …). */
  footerLinks?: readonly SignInFooterLink[];
  /** Called when the user finishes on the done step. */
  onContinue?: () => void;
  /** Called by "Continue with SSO". */
  onSso?: () => void;
  className?: string;
}

export const demoSignIn = {
  brand: 'Morph',
  email: 'alex@example.com',
  expectedCode: '123456',
  destination: 'Acme workspace',
  footerLinks: [
    { label: 'Terms of service', href: '#terms' },
    { label: 'Privacy policy', href: '#privacy' },
    { label: 'Help', href: '#help' },
  ] satisfies SignInFooterLink[],
} as const;

const CODE_LENGTH = 6;
const WRONG_CODE = 'That code is incorrect. Check the email and try again.';

/** "alex@example.com" → "a•••@example.com". */
export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at < 1) return email;
  return email[0] + '•••' + email.slice(at);
}

export function SignInTemplate({
  step: initialStep = 'credentials',
  onStepChange,
  brand = demoSignIn.brand,
  email: initialEmail = demoSignIn.email,
  password: initialPassword = '',
  remember: initialRemember = true,
  expectedCode = demoSignIn.expectedCode,
  code: initialCode = '',
  destination = demoSignIn.destination,
  footerLinks = demoSignIn.footerLinks,
  onContinue,
  onSso,
  className = '',
}: SignInTemplateProps) {
  const [step, setStepState] = useState<SignInStep>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [remember, setRemember] = useState(initialRemember);
  const [touched, setTouched] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [codeError, setCodeError] = useState<string | null>(
    initialCode.length === CODE_LENGTH && initialCode !== expectedCode ? WRONG_CODE : null,
  );
  const [resent, setResent] = useState(false);

  const setStep = (next: SignInStep) => { setStepState(next); onStepChange?.(next); };

  const emailError = touched && !/^[^\s@]+@[^\s@]+$/.test(email.trim()) ? 'Enter a valid email address.' : undefined;
  const passwordError = touched && !password ? 'Enter your password.' : undefined;

  const submitCredentials = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!/^[^\s@]+@[^\s@]+$/.test(email.trim()) || !password) return;
    setCode('');
    setCodeError(null);
    setResent(false);
    setStep('verify');
  };

  const checkCode = (value: string) => {
    if (value === expectedCode) { setCodeError(null); setStep('done'); }
    else setCodeError(WRONG_CODE);
  };

  const onCodeChange = (value: string) => {
    setCode(value);
    if (value.length < CODE_LENGTH) setCodeError(null);
  };

  const masked = maskEmail(email.trim() || initialEmail);

  let title: string;
  let description: string;
  let body: ReactNode;

  if (step === 'credentials') {
    title = `Sign in to ${brand}`;
    description = 'Welcome back. Use your work email to continue.';
    body = (
      <form className="signin-form" aria-label="Sign in" noValidate onSubmit={submitCredentials}>
        <TextField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
          error={emailError}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
          error={passwordError}
        />
        <div className="signin-row">
          <Checkbox id="signin-remember" label="Remember me" checked={remember} onChange={setRemember} />
          <a className="signin-link" href="#forgot">Forgot password?</a>
        </div>
        <Button type="submit" variant="primary" size="lg">Sign in</Button>
        <Divider label="or" />
        <Button size="lg" onClick={onSso}>Continue with SSO</Button>
      </form>
    );
  } else if (step === 'verify') {
    title = 'Check your email';
    description = `Enter the 6-digit code we sent to ${masked}`;
    body = (
      <div className="signin-form">
        <OtpInput
          id="signin-code"
          className="signin-otp"
          label="Verification code"
          length={CODE_LENGTH}
          value={code}
          onChange={onCodeChange}
          onComplete={checkCode}
          error={codeError ?? undefined}
          hint={resent ? `A new code is on its way to ${masked}.` : 'The code expires in 10 minutes.'}
        />
        <Button
          variant="primary"
          size="lg"
          disabled={code.length < CODE_LENGTH}
          onClick={() => checkCode(code)}
        >
          Verify
        </Button>
        <div className="signin-row signin-row-center">
          <span className="signin-muted">Didn't get it?</span>
          <Button variant="ghost" size="sm" onClick={() => { setResent(true); setCode(''); setCodeError(null); }}>
            Resend code
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setStep('credentials')}>
          Use a different account
        </Button>
      </div>
    );
  } else {
    title = "You're signed in";
    description = `Signed in as ${email.trim() || initialEmail}.`;
    body = (
      <div className="signin-form">
        <AlertBanner tone="success" lead="Verified.">
          {remember ? 'This device will be remembered for 30 days.' : 'You will be asked for a code next time.'}
        </AlertBanner>
        <EmptyState
          className="signin-done"
          title="All set"
          action={<Button variant="primary" size="lg" onClick={onContinue}>Continue to {destination}</Button>}
        >
          Your session is ready. Pick up where you left off.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className={`signin-template ${className}`.trim()} data-signin-step={step}>
      <main className="signin-main">
        <HeroPanel ornament="mark" maxWidth={440} title={title} description={description} actions={body} />
      </main>
      {footerLinks.length > 0 && (
        <footer className="signin-footer">
          <nav aria-label="Legal">
            <ul>
              {footerLinks.map(l => (
                <li key={l.href}><a className="signin-link" href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <span className="signin-muted">© 2026 {brand}</span>
        </footer>
      )}
    </div>
  );
}
