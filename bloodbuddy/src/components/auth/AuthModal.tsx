import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { Notice } from '../common/Notice';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
  hasPreservedFlow?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  hasPreservedFlow = false,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verification'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('maria@email.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [usagePlan, setUsagePlan] = useState<'I want to donate' | 'I need to find blood'>('I need to find blood');

  // Verification state
  const [verificationCode, setVerificationCode] = useState(['8', '4', '2', '0', '1', '9']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authInfo, setAuthInfo] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please fill in both email and password.');
      return;
    }
    setAuthError('');
    onAuthSuccess({
      firstName: 'Maria',
      lastName: 'Santos',
      email: loginEmail,
      emailVerified: true,
      identityVerified: false,
      identityVerificationStatus: 'not_verified',
      bloodType: 'A+',
      availableToDonate: true,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regPassword) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthError('');
    // Advance to 6-digit email verification
    setMode('verification');
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onAuthSuccess({
        firstName: regFirstName || 'Maria',
        lastName: regLastName || 'Santos',
        email: regEmail || loginEmail,
        emailVerified: true,
        identityVerified: false,
        identityVerificationStatus: 'not_verified',
        bloodType: 'A+',
        availableToDonate: true,
        plan: usagePlan,
      });
    }, 600);
  };

  const handleCodeChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newCode = [...verificationCode];
    newCode[index] = val;
    setVerificationCode(newCode);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`verify-code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const modalTitle =
    mode === 'login'
      ? 'Sign in to BloodBuddy'
      : mode === 'register'
      ? 'Create Your Account'
      : 'Verify Your Email';

  const modalDesc =
    mode === 'login'
      ? hasPreservedFlow
        ? 'Sign in to continue connecting with your selected donor.'
        : 'Access your blood requests and donor availability.'
      : mode === 'register'
      ? 'Join the community network to coordinate or donate blood.'
      : `Enter the 6-digit confirmation code sent to ${regEmail || loginEmail}.`;

  return (
    <Modal
      id="auth-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      description={modalDesc}
      maxWidth="md"
    >
      {hasPreservedFlow && mode !== 'verification' && (
        <div className="mb-4">
          <Notice type="info">
            Your selected donor and search criteria have been preserved and will
            continue automatically once authenticated.
          </Notice>
        </div>
      )}

      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {authError}
        </div>
      )}

      {authInfo && (
        <div className="mb-4 p-3 bg-[#EDF4EE] border border-[#CDE1D1] text-[#557A61] text-xs rounded-xl font-medium">
          {authInfo}
        </div>
      )}

      {/* LOGIN MODE */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <FormField label="Email Address" htmlFor="login-email" required>
            <input
              id="login-email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] text-[#292525]"
              placeholder="name@email.com"
              required
            />
          </FormField>

          <FormField label="Password" htmlFor="login-password" required>
            <input
              id="login-password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] text-[#292525]"
              placeholder="••••••••"
              required
            />
          </FormField>

          <div className="flex items-center justify-between text-xs text-[#746C68]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="login-remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E6DDD7] text-[#A92F35] focus:ring-[#A92F35]"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              id="login-forgot-password-btn"
              onClick={() => {
                setAuthInfo('Password reset instructions sent to your email.');
                setAuthError('');
              }}
              className="hover:text-[#A92F35] underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            id="submit-login-btn"
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
          >
            Log In
          </Button>

          <div className="pt-4 border-t border-[#F0EAE5] text-center text-xs text-[#746C68]">
            Don't have an account?{' '}
            <button
              type="button"
              id="switch-to-register-btn"
              onClick={() => {
                setAuthError('');
                setAuthInfo('');
                setMode('register');
              }}
              className="text-[#A92F35] font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      {/* REGISTER MODE */}
      {mode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" htmlFor="reg-first-name" required>
              <input
                id="reg-first-name"
                type="text"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] text-[#292525]"
                placeholder="Maria"
                required
              />
            </FormField>
            <FormField label="Last Name" htmlFor="reg-last-name" required>
              <input
                id="reg-last-name"
                type="text"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] text-[#292525]"
                placeholder="Santos"
                required
              />
            </FormField>
          </div>

          <FormField label="Email Address" htmlFor="reg-email" required>
            <input
              id="reg-email"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] text-[#292525]"
              placeholder="maria@email.com"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Password" htmlFor="reg-password" required>
              <input
                id="reg-password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] text-[#292525]"
                placeholder="••••••••"
                required
              />
            </FormField>
            <FormField label="Confirm Password" htmlFor="reg-confirm-password" required>
              <input
                id="reg-confirm-password"
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] text-[#292525]"
                placeholder="••••••••"
                required
              />
            </FormField>
          </div>

          {/* How do you plan to use BloodBuddy? */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-[#292525] block mb-2">
              How do you plan to use BloodBuddy?
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  usagePlan === 'I want to donate'
                    ? 'border-[#A92F35] bg-[#F7EAE7]/40'
                    : 'border-[#E6DDD7] hover:bg-[#FAF7F2]'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value="I want to donate"
                  checked={usagePlan === 'I want to donate'}
                  onChange={() => setUsagePlan('I want to donate')}
                  className="mt-0.5 text-[#A92F35] focus:ring-[#A92F35]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#292525]">
                    I want to donate
                  </p>
                  <p className="text-[11px] text-[#746C68]">
                    List your availability as a potential voluntary donor.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  usagePlan === 'I need to find blood'
                    ? 'border-[#A92F35] bg-[#F7EAE7]/40'
                    : 'border-[#E6DDD7] hover:bg-[#FAF7F2]'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value="I need to find blood"
                  checked={usagePlan === 'I need to find blood'}
                  onChange={() => setUsagePlan('I need to find blood')}
                  className="mt-0.5 text-[#A92F35] focus:ring-[#A92F35]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#292525]">
                    I need to find blood
                  </p>
                  <p className="text-[11px] text-[#746C68]">
                    Search nearby matching donors during urgent hospital shortages.
                  </p>
                </div>
              </label>
            </div>
            <p className="text-[11px] text-[#958B86] mt-2 italic">
              Note: This does not create permanent roles. One account can both request blood and act as a donor.
            </p>
          </div>

          <Button
            id="submit-register-btn"
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
          >
            Continue to Verification →
          </Button>

          <div className="pt-3 border-t border-[#F0EAE5] text-center text-xs text-[#746C68]">
            Already have an account?{' '}
            <button
              type="button"
              id="switch-to-login-btn"
              onClick={() => {
                setAuthError('');
                setAuthInfo('');
                setMode('login');
              }}
              className="text-[#A92F35] font-semibold hover:underline"
            >
              Log In
            </button>
          </div>
        </form>
      )}

      {/* EMAIL VERIFICATION MODE */}
      {mode === 'verification' && (
        <form onSubmit={handleVerifyCode} className="space-y-5 text-center">
          <div className="py-2">
            <p className="text-xs text-[#746C68] mb-4">
              Please enter the 6-digit verification code sent to your email to verify ownership.
            </p>
            <div className="flex justify-center items-center gap-2">
              {verificationCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`verify-code-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  className="w-11 h-12 text-center font-bold text-lg border border-[#E6DDD7] rounded-xl focus:outline-none focus:border-[#A92F35] focus:ring-2 focus:ring-[#A92F35]/15 text-[#292525] bg-white"
                />
              ))}
            </div>
            <p className="text-[11px] text-[#958B86] mt-3">
              Did not receive the code?{' '}
              <button
                type="button"
                onClick={() => setAuthInfo('A new 6-digit code has been sent to your email.')}
                className="text-[#A92F35] underline font-medium"
              >
                Resend Code
              </button>
            </p>
          </div>

          <Notice type="privacy">
            Email verification confirms your email address ownership. It does not certify medical clearance or blood type accuracy.
          </Notice>

          <Button
            id="verify-code-submit-btn"
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isVerifying}
          >
            Verify & Continue →
          </Button>
        </form>
      )}
    </Modal>
  );
};
