import { useState } from 'react';
import { OtpInput } from './OtpInput';

export default {
  title: 'OtpInput',
  component: OtpInput,
};

export const Default = () => {
  const [code, setCode] = useState('');
  return <OtpInput label="Verification code" hint="Enter the 6-digit code we sent to your phone." value={code} onChange={setCode} />;
};

export const Masked = () => {
  const [pin, setPin] = useState('12');
  return <OtpInput label="PIN" length={4} mask hint="Four digits." value={pin} onChange={setPin} />;
};

export const WithError = () => {
  const [code, setCode] = useState('482913');
  return <OtpInput label="Verification code" error="That code has expired. Request a new one." value={code} onChange={setCode} />;
};

export const Alphanumeric = () => {
  const [code, setCode] = useState('K7Q');
  return <OtpInput label="Recovery code" length={8} alphanumeric hint="Letters and digits, as printed on your recovery sheet." value={code} onChange={setCode} />;
};
