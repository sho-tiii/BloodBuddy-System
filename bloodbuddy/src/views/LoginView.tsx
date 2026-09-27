/**
 * PRODUCTION UI RULE:
 * Internal mock data and development helpers may exist in code during
 * prototype development, but they must never automatically create
 * visible testing controls in the normal BloodBuddy interface.
 * Future feature additions must NOT reintroduce demo/test shortcuts into
 * production-facing pages.
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Droplet, ArrowRight, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ActiveView, BloodType, Donor, UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { INITIAL_USER } from '../data/mockData';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (view: ActiveView) => void;
  redirectReason?: string | null;
  preservedFlow?: {
    donor: Donor;
    criteria: { bloodType: BloodType; location: string };
  } | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
  redirectReason,
  preservedFlow,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    setTimeout(() => {
      setIsLoading(false);
      // Retrieve existing stored user or construct profile
      let userToLogin = INITIAL_USER;
      try {
        const saved = localStorage.getItem('bloodbuddy_user_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.email === email.trim()) {
            userToLogin = parsed;
          } else {
            userToLogin = {
              ...INITIAL_USER,
              email: email.trim(),
              firstName: email.split('@')[0] || 'Member',
            };
          }
        } else {
          userToLogin = {
            ...INITIAL_USER,
            email: email.trim(),
            firstName: email.split('@')[0] || 'Member',
          };
        }
      } catch {
        // use default
      }

      onLoginSuccess(userToLogin);
    }, 400);
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address above to receive reset instructions.');
      return;
    }
    setErrorMessage('');
    setInfoMessage(`Password reset instructions have been sent to ${email.trim()}.`);
  };

  return (
    <div className="max-w-md mx-auto py-10 sm:py-16">
      <Card padding="lg" className="bg-white border-[#E6DDD7] rounded-[18px] shadow-[0_8px_30px_rgba(41,37,37,0.06)] space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F7EAE7] text-[#A92F35] mx-auto shadow-xs">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#292525]">
            Sign in to BloodBuddy
          </h1>
          <p className="text-xs text-[#746C68]">
            Access your blood requests, donation coordination, and settings.
          </p>
        </div>

        {/* Informational Notification if redirected */}
        {redirectReason && (
          <div className="p-3.5 rounded-xl bg-[#F7EAE7]/70 border border-[#F0D5D1] text-xs text-[#A92F35] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#A92F35] flex-shrink-0 mt-0.5" />
            <span>{redirectReason}</span>
          </div>
        )}

        {/* Preserved Flow Notice */}
        {preservedFlow && (
          <div className="p-3.5 rounded-xl bg-[#EDF4EE] border border-[#D5E5D8] text-xs text-[#2A5237] space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#557A61]" />
              <span>Donor Selected</span>
            </div>
            <p className="text-[11px] text-[#3E654C]">
              Signing in will continue your blood request for{' '}
              <strong>Blood Type {preservedFlow.criteria.bloodType}</strong> in{' '}
              <strong>{preservedFlow.criteria.location}</strong>.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#8F272D] font-medium">
            {errorMessage}
          </div>
        )}

        {infoMessage && (
          <div className="p-3 rounded-xl bg-[#EDF4EE] border border-[#D5E5D8] text-xs text-[#2A5237] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#557A61] flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-[#292525] block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#958B86] absolute left-3.5 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 bg-[#FAF7F2] focus:bg-white text-sm text-[#292525] pl-10 pr-4 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold text-[#292525]">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-medium text-[#A92F35] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#958B86] absolute left-3.5 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-11 bg-[#FAF7F2] focus:bg-white text-sm text-[#292525] pl-10 pr-10 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#958B86] hover:text-[#292525]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#E6DDD7] text-[#A92F35] focus:ring-[#A92F35]"
              />
              <span className="text-xs text-[#746C68]">Remember me</span>
            </label>
          </div>

          <Button
            id="login-submit-btn"
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full text-sm font-semibold"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? 'Signing In...' : 'Log In'}
          </Button>
        </form>

        {/* Bottom Switch to Register */}
        <div className="text-center pt-2 text-xs text-[#746C68]">
          Don't have a BloodBuddy account yet?{' '}
          <button
            type="button"
            id="goto-register-btn"
            onClick={() => onNavigate('register')}
            className="font-semibold text-[#A92F35] hover:underline"
          >
            Create Account / Register
          </button>
        </div>
      </Card>
    </div>
  );
};
