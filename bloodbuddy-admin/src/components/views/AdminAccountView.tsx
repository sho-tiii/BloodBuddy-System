import React, { useState } from 'react';
import { ShieldCheck, Info, Mail, KeyRound, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AdminUser, NavigationTarget } from '../../types';
import { AdminRoleBadge, AdminAccountStatusBadge } from '../common/Badge';
import { useToast } from '../ui/ToastContext';

interface AdminAccountViewProps {
  admin: AdminUser;
  onNavigate: (target: NavigationTarget) => void;
  onDataReset?: () => void;
}

export const AdminAccountView: React.FC<AdminAccountViewProps> = ({ admin, onNavigate }) => {
  const { addToast } = useToast();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    const res = dataService.changeAdminPassword(admin.id, currentPassword, newPassword);
    if (res.success) {
      setPasswordSuccess('Password successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Password Changed', 'Your administrative credentials have been updated.', 'success');
    } else {
      setPasswordError(res.error || 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
          ADMINISTRATIVE CREDENTIALS
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
          Account Details
        </h1>
        <p className="text-[15px] text-[#746C68] mt-1">
          Review your administrator role, active session credentials, and security controls.
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="bg-white border border-[#E6DDD7] rounded-[18px] p-7 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-6">
        <div className="flex items-center gap-4 border-b border-[#E6DDD7] pb-5">
          <div className="w-14 h-14 rounded-full bg-[#F7EAE7] border-2 border-[#A92F35]/20 flex items-center justify-center text-[#A92F35] text-[20px] font-bold">
            {admin.role === 'super_admin' ? 'SA' : 'PA'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[20px] font-bold text-[#292525]">{admin.name}</h2>
              <AdminRoleBadge role={admin.role} />
            </div>
            <p className="text-[13.5px] text-[#746C68] font-medium mt-0.5">
              {admin.role === 'super_admin'
                ? 'Super Administrator — Governance, Admin Management & Platform Audit'
                : 'Administrator — Platform Oversight & Community Moderation'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[14px]">
          <div>
            <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
              Administrative Email
            </span>
            <div className="flex items-center gap-2 mt-1 text-[#292525] font-medium">
              <Mail className="w-4 h-4 text-[#746C68]" />
              <span>{admin.email}</span>
            </div>
          </div>

          <div>
            <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
              Authority &amp; Role
            </span>
            <div className="flex items-center gap-2 mt-1 text-[#292525] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#557A61]" />
              <span>
                {admin.role === 'super_admin'
                  ? 'Super Administrator (Full System Authority)'
                  : 'Administrator (Moderation Access)'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
              Account Identifier
            </span>
            <div className="flex items-center gap-2 mt-1 text-[#292525] font-mono text-[13px]">
              <span>{admin.id}</span>
            </div>
          </div>

          <div>
            <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
              Session Status
            </span>
            <div className="flex items-center gap-2 mt-1 text-[#557A61] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#557A61]" />
              <span>Authenticated Session Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white border border-[#E6DDD7] rounded-[18px] p-7 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-5">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-5 h-5 text-[#A92F35]" />
          <h2 className="text-[18px] font-bold text-[#292525]">Update Password</h2>
        </div>
        <p className="text-[14px] text-[#746C68]">
          Maintain administrative account safety by updating your credentials periodically.
        </p>

        {passwordError && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-[#F7EAE7] border border-[#A92F35]/20 flex items-start gap-2.5 text-[#A92F35] text-[13px]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-[#EDF4EE] border border-[#557A61]/25 flex items-start gap-2.5 text-[#557A61] text-[13px]"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} noValidate className="max-w-md space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#292525] mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#292525] mb-1">
              New Password (min 8 characters)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#292525] mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="change-admin-pw-btn"
              className="px-4 py-2.5 text-[14px] font-semibold text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Platform Scope & Medical Boundary Card */}
      <div className="bg-white border border-[#E6DDD7] rounded-[18px] p-7 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
        <div className="flex items-center gap-2.5 text-[#A92F35]">
          <Info className="w-5 h-5" />
          <h2 className="text-[17px] font-bold text-[#292525]">Medical Verification Boundary</h2>
        </div>
        <p className="text-[14px] text-[#746C68] leading-relaxed">
          BloodBuddy Admin administers platform accounts and community moderation only. Blood types and donor
          availability are self-reported by community members. Final donor health screening, medical eligibility,
          blood testing, and compatibility testing remain the sole responsibility of accredited healthcare facilities.
        </p>
        <div className="text-[13px] text-[#746C68] bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DDD7] space-y-1.5">
          <div>
            &bull; <strong>No Clinical Verification:</strong> Administrators do not clinically verify blood products or transfusions.
          </div>
          <div>
            &bull; <strong>Identity Boundary:</strong> Identity verification status applies only to account identity, never to blood test results or donor safety.
          </div>
          <div>
            &bull; <strong>Neutral Moderation:</strong> Moderation actions (restricting accounts, removing listings) address communication safety, spam prevention, and conduct reporting.
          </div>
        </div>
      </div>
    </div>
  );
};
