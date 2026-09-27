import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ShieldCheck, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AdminUser } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (admin: AdminUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  // Modes: 'login' | 'forgot_password'
  const [authMode, setAuthMode] = useState<'login' | 'forgot_password'>('login');

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchedAdminId, setMatchedAdminId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;
    if (!email.trim()) {
      setEmailError('Please enter your administrator email.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Please enter your administrator password.');
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    const result = dataService.login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const session = dataService.getSession();
      if (session) {
        onLoginSuccess(session);
      }
    } else {
      setGeneralError(result.error || 'Email or password is incorrect.');
    }
  };

  const handleVerifyRecoveryEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!recoveryEmail.trim()) {
      setRecoveryError('Enter your administrative email address.');
      return;
    }

    const admin = dataService.findAdminByEmail(recoveryEmail);
    if (!admin) {
      setRecoveryError('No administrator account found with this email address.');
      return;
    }

    if (admin.status === 'inactive') {
      setRecoveryError('This administrator account is deactivated. Contact a Super Administrator.');
      return;
    }

    setMatchedAdminId(admin.id);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (!newPassword || newPassword.length < 8) {
      setRecoveryError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setRecoveryError('Passwords do not match.');
      return;
    }

    if (!matchedAdminId) return;

    const ok = dataService.resetAdminPassword(matchedAdminId, newPassword);
    if (ok) {
      setRecoverySuccess('Password reset successfully! You can now sign in with your new password.');
      setMatchedAdminId(null);
      setRecoveryEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setAuthMode('login');
        setRecoverySuccess('');
      }, 2000);
    } else {
      setRecoveryError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] flex flex-col justify-center items-center px-4 py-12">
      {/* Centered Auth Card */}
      <div className="w-full max-w-[440px] bg-white border border-[#E6DDD7] rounded-[18px] p-8 sm:p-10 shadow-[0_8px_30px_rgba(41,37,37,0.06)]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F7EAE7] text-[#A92F35] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-[26px] font-bold text-[#292525] font-serif tracking-tight leading-none">
            BloodBuddy
          </h1>
          <div className="text-[11px] font-bold tracking-[0.16em] text-[#A92F35] uppercase mt-1">
            ADMIN PORTAL
          </div>
        </div>

        {authMode === 'login' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-[20px] font-semibold text-[#292525] tracking-tight">
                Administrator Sign In
              </h2>
              <p className="text-[14px] text-[#746C68] mt-1 leading-relaxed">
                Sign in to manage BloodBuddy platform activity and moderation.
              </p>
            </div>

            {generalError && (
              <div
                role="alert"
                id="login-general-error"
                className="mb-5 p-3.5 rounded-lg bg-[#F7EAE7] border border-[#A92F35]/20 flex items-start gap-2.5 text-[#A92F35] text-[13px]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-[13px] font-semibold text-[#292525] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                    if (generalError) setGeneralError('');
                  }}
                  aria-invalid={!!emailError || !!generalError}
                  aria-describedby={emailError ? 'admin-email-error' : undefined}
                  className={`w-full px-3.5 py-2.5 bg-white border ${
                    emailError ? 'border-[#A92F35] ring-1 ring-[#A92F35]' : 'border-[#E6DDD7]'
                  } rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors`}
                />
                {emailError && (
                  <p id="admin-email-error" className="flex items-center gap-1.5 text-[12.5px] text-[#A92F35] mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-[13px] font-semibold text-[#292525]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    id="forgot-password-link-btn"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setGeneralError('');
                      setRecoveryError('');
                      setRecoverySuccess('');
                    }}
                    className="text-[12.5px] font-medium text-[#A92F35] hover:text-[#8F272D] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                    if (generalError) setGeneralError('');
                  }}
                  aria-invalid={!!passwordError || !!generalError}
                  aria-describedby={passwordError ? 'admin-password-error' : undefined}
                  className={`w-full px-3.5 py-2.5 bg-white border ${
                    passwordError ? 'border-[#A92F35] ring-1 ring-[#A92F35]' : 'border-[#E6DDD7]'
                  } rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors`}
                />
                {passwordError && (
                  <p id="admin-password-error" className="flex items-center gap-1.5 text-[12.5px] text-[#A92F35] mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  id="admin-sign-in-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#A92F35] hover:bg-[#8F272D] text-white text-[14px] font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E6DDD7] text-center">
              <p className="text-[12.5px] text-[#746C68]">
                Administrator and Super Administrator access only.
              </p>
            </div>
          </div>
        ) : (
          /* Forgot Password View */
          <div>
            <div className="mb-6">
              <button
                type="button"
                id="back-to-signin-btn"
                onClick={() => {
                  setAuthMode('login');
                  setMatchedAdminId(null);
                  setRecoveryError('');
                }}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#746C68] hover:text-[#A92F35] mb-3 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <h2 className="text-[20px] font-semibold text-[#292525] tracking-tight flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#A92F35]" />
                <span>Reset Administrator Password</span>
              </h2>
              <p className="text-[14px] text-[#746C68] mt-1 leading-relaxed">
                {!matchedAdminId
                  ? 'Verify your administrative email to set a new password.'
                  : 'Enter and confirm your new secure credentials.'}
              </p>
            </div>

            {recoveryError && (
              <div
                role="alert"
                id="recovery-error-alert"
                className="mb-5 p-3.5 rounded-lg bg-[#F7EAE7] border border-[#A92F35]/20 flex items-start gap-2.5 text-[#A92F35] text-[13px]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{recoveryError}</span>
              </div>
            )}

            {recoverySuccess && (
              <div
                role="alert"
                id="recovery-success-alert"
                className="mb-5 p-3.5 rounded-lg bg-[#EDF4EE] border border-[#557A61]/25 flex items-start gap-2.5 text-[#557A61] text-[13px]"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {!matchedAdminId ? (
              <form onSubmit={handleVerifyRecoveryEmail} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="recovery-admin-email"
                    className="block text-[13px] font-semibold text-[#292525] mb-1.5"
                  >
                    Administrative Email
                  </label>
                  <input
                    id="recovery-admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@bloodbuddy.test"
                    value={recoveryEmail}
                    onChange={(e) => {
                      setRecoveryEmail(e.target.value);
                      if (recoveryError) setRecoveryError('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="verify-recovery-email-btn"
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#A92F35] hover:bg-[#8F272D] text-white text-[14px] font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Verify Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} noValidate className="space-y-4">
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E6DDD7] text-[13px] text-[#746C68]">
                  Verified account: <strong className="text-[#292525]">{recoveryEmail}</strong>
                </div>

                <div>
                  <label
                    htmlFor="new-recovery-password"
                    className="block text-[13px] font-semibold text-[#292525] mb-1.5"
                  >
                    New Password (min 8 characters)
                  </label>
                  <input
                    id="new-recovery-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (recoveryError) setRecoveryError('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-recovery-password"
                    className="block text-[13px] font-semibold text-[#292525] mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-recovery-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (recoveryError) setRecoveryError('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="confirm-password-reset-btn"
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#A92F35] hover:bg-[#8F272D] text-white text-[14px] font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <footer className="mt-6 text-center">
        <p className="text-[12px] text-[#958B86]">
          BloodBuddy Administrative Portal &bull; Platform Governance &amp; Moderation
        </p>
      </footer>
    </div>
  );
};
