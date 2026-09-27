import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { ActiveView, UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface VerifyEmailViewProps {
  user: UserProfile;
  onVerifySuccess: () => void;
  onNavigate: (view: ActiveView) => void;
}

export const VerifyEmailView: React.FC<VerifyEmailViewProps> = ({
  user,
  onVerifySuccess,
  onNavigate,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleCodeChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`verify-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess();
    }, 500);
  };

  const handleResend = () => {
    setResendStatus('A fresh verification code was sent to ' + user.email);
    setTimeout(() => setResendStatus(null), 4000);
  };

  return (
    <div className="max-w-md mx-auto py-12 sm:py-16">
      <Card padding="lg" className="bg-white border-[#E6DDD7] rounded-[18px] shadow-[0_8px_30px_rgba(41,37,37,0.06)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F7EAE7] text-[#A92F35] mx-auto">
          <Mail className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-heading text-3xl font-bold text-[#292525]">
            Verify Your Email Address
          </h1>
          <p className="text-xs sm:text-sm text-[#746C68] max-w-xs mx-auto">
            We sent a 6-digit confirmation code to{' '}
            <strong className="text-[#292525] font-semibold">{user.email || 'your email'}</strong>.
          </p>
        </div>

        {resendStatus && (
          <div className="p-3 rounded-xl bg-[#EDF4EE] border border-[#D5E5D8] text-xs text-[#2A5237]">
            {resendStatus}
          </div>
        )}

        {/* 6-digit verification code entry */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#746C68] uppercase tracking-wider block">
            Enter 6-Digit Verification Code
          </label>
          <div className="flex justify-center gap-2 sm:gap-2.5">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`verify-digit-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                placeholder="•"
                className="w-11 h-12 text-center text-lg font-bold bg-[#FAF7F2] focus:bg-white text-[#292525] rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none transition-colors"
              />
            ))}
          </div>
        </div>

        <Button
          id="complete-verify-btn"
          variant="primary"
          size="lg"
          disabled={isVerifying}
          onClick={handleVerify}
          className="w-full text-sm font-semibold"
          rightIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          {isVerifying ? 'Verifying Account...' : 'Confirm & Complete Registration'}
        </Button>

        <div className="pt-2 border-t border-[#F0EAE5] space-y-2">
          <div className="text-xs text-[#746C68]">
            Didn't receive the email?{' '}
            <button
              type="button"
              id="resend-verification-btn"
              onClick={handleResend}
              className="font-semibold text-[#A92F35] hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resend code</span>
            </button>
          </div>

          <p className="text-[11px] text-[#958B86]">
            Email verification confirms your contact email for critical donation alerts.
          </p>
        </div>
      </Card>
    </div>
  );
};
