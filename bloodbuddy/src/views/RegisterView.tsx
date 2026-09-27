import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Droplet, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ActiveView, BloodType, UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface RegisterViewProps {
  onRegisterSubmit: (newUser: UserProfile) => void;
  onNavigate: (view: ActiveView) => void;
}

const BLOOD_TYPES: BloodType[] = [
  'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−', 'Not provided'
];

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSubmit,
  onNavigate,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bloodType, setBloodType] = useState<BloodType>('A+');
  const [plan, setPlan] = useState<'I want to donate' | 'I need to find blood'>('I want to donate');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!agreedTerms) {
      setError('Please acknowledge the clinical matching guidelines.');
      return;
    }

    const newUser: UserProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      emailVerified: false,
      identityVerified: false,
      identityVerificationStatus: 'not_verified',
      bloodType,
      availableToDonate: plan === 'I want to donate',
      plan,
    };

    onRegisterSubmit(newUser);
  };

  return (
    <div className="max-w-xl mx-auto py-10 sm:py-14">
      <Card padding="lg" className="bg-white border-[#E6DDD7] rounded-[18px] shadow-[0_8px_30px_rgba(41,37,37,0.06)] space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F7EAE7] text-[#A92F35] mx-auto shadow-xs">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#292525]">
            Create a BloodBuddy Account
          </h1>
          <p className="text-xs text-[#746C68] max-w-sm mx-auto">
            One account connects you to request blood when needed or volunteer to donate when able.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#8F272D] font-medium">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="reg-first-name" className="text-xs font-semibold text-[#292525] block">
                First Name <span className="text-[#A92F35]">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#958B86] absolute left-3.5 pointer-events-none" />
                <input
                  id="reg-first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Maria"
                  className="w-full h-11 bg-[#FAF7F2] focus:bg-white text-sm text-[#292525] pl-10 pr-3 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-last-name" className="text-xs font-semibold text-[#292525] block">
                Last Name <span className="text-[#A92F35]">*</span>
              </label>
              <input
                id="reg-last-name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Santos"
                className="w-full h-11 bg-[#FAF7F2] focus:bg-white text-sm text-[#292525] px-3.5 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-xs font-semibold text-[#292525] block">
              Email Address <span className="text-[#A92F35]">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#958B86] absolute left-3.5 pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria.santos@example.com"
                className="w-full h-11 bg-[#FAF7F2] focus:bg-white text-sm text-[#292525] pl-10 pr-3 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-xs font-semibold text-[#292525] block">
              Password <span className="text-[#A92F35]">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#958B86] absolute left-3.5 pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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

          {/* Blood Type Selection */}
          <div className="space-y-1.5 pt-1">
            <label htmlFor="reg-blood-type" className="text-xs font-semibold text-[#292525] block">
              Self-Reported Blood Type
            </label>
            <select
              id="reg-blood-type"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value as BloodType)}
              className="w-full h-11 bg-[#FAF7F2] focus:bg-white text-sm font-semibold text-[#292525] px-3.5 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none cursor-pointer transition-colors"
            >
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'Not provided' ? "I don't know my blood type yet" : `Blood Type ${type}`}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#958B86]">
              Self-reported for community matching. Hospital conducts clinical crossmatching.
            </p>
          </div>

          {/* Primary Intent / Role */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-[#292525] block">
              Primary Community Participation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  plan === 'I want to donate'
                    ? 'border-[#A92F35] bg-[#F7EAE7]/40'
                    : 'border-[#E6DDD7] hover:bg-[#FAF7F2]'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  checked={plan === 'I want to donate'}
                  onChange={() => setPlan('I want to donate')}
                  className="mt-0.5 text-[#A92F35] focus:ring-[#A92F35]"
                />
                <div>
                  <span className="text-xs font-bold text-[#292525] block">
                    Volunteer Donor
                  </span>
                  <span className="text-[11px] text-[#746C68]">
                    I want to receive blood request notifications to help others.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  plan === 'I need to find blood'
                    ? 'border-[#A92F35] bg-[#F7EAE7]/40'
                    : 'border-[#E6DDD7] hover:bg-[#FAF7F2]'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  checked={plan === 'I need to find blood'}
                  onChange={() => setPlan('I need to find blood')}
                  className="mt-0.5 text-[#A92F35] focus:ring-[#A92F35]"
                />
                <div>
                  <span className="text-xs font-bold text-[#292525] block">
                    Patient / Requester
                  </span>
                  <span className="text-[11px] text-[#746C68]">
                    I need to search and coordinate blood for upcoming care.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Clinical understanding checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#E6DDD7] text-[#A92F35] focus:ring-[#A92F35]"
              />
              <span className="text-xs text-[#746C68] leading-relaxed">
                I understand BloodBuddy is a community coordination platform and does not certify blood types or clinical safety. All testing happens at the healthcare facility.
              </span>
            </label>
          </div>

          <Button
            id="register-submit-btn"
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-sm font-semibold"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account & Verify Email
          </Button>
        </form>

        {/* Bottom Switch to Login */}
        <div className="text-center pt-2 border-t border-[#F0EAE5] text-xs text-[#746C68]">
          Already registered on BloodBuddy?{' '}
          <button
            type="button"
            id="goto-login-btn"
            onClick={() => onNavigate('login')}
            className="font-semibold text-[#A92F35] hover:underline"
          >
            Sign in
          </button>
        </div>
      </Card>
    </div>
  );
};
