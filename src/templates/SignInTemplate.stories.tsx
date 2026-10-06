import type { StoryDefault, Story } from '@ladle/react';
import { SignInTemplate } from './SignInTemplate';

export default {
  title: 'Templates/SignIn',
} satisfies StoryDefault;

/** The catalog frame pads 24px on each side; fill the rest of the viewport. */
const fill = { height: 'calc(100vh - 48px)' };

export const Default: Story = () => (
  <div style={fill}>
    <SignInTemplate />
  </div>
);

/** Verify step with a wrong code already entered (the demo accepts 123456). */
export const Verify: Story = () => (
  <div style={fill}>
    <SignInTemplate step="verify" code="482913" />
  </div>
);

export const Narrow: Story = () => (
  <div style={{ ...fill, maxWidth: 380, margin: '0 auto' }}>
    <SignInTemplate password="correct-horse" />
  </div>
);
