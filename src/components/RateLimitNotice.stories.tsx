import { RateLimitNotice } from './RateLimitNotice';

export default {
  title: 'RateLimitNotice',
  component: RateLimitNotice,
};

export const CountingDown = () => (
  <RateLimitNotice
    retryAfter={92}
    subject="Search"
    resetAt="14:32 UTC"
    onRetry={() => {}}
  />
);

export const Ready = () => (
  <RateLimitNotice retryAfter={0} subject="Search" onRetry={() => {}} />
);

export const ControlledRemaining = () => (
  <RateLimitNotice retryAfter={0} remaining={5} subject="Export" onRetry={() => {}} />
);

export const BareNoAction = () => (
  <RateLimitNotice retryAfter={44} subject="Invites" />
);
