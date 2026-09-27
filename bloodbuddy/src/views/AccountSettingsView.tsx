import React, { useState } from 'react';
import { User, Mail, Lock, Edit3, ArrowRight } from 'lucide-react';
import { UserProfile, ActiveView } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { FormField } from '../components/common/FormField';
import { IdentityVerificationCard } from '../components/account/IdentityVerificationCard';

interface AccountSettingsViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (view: ActiveView) => void;
  pendingDonationsCount: number;
}

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({
  currentUser,
  onUpdateUser,
  onNavigate,
  pendingDonationsCount,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Edit info fields
  const [editFirstName, setEditFirstName] = useState(currentUser.firstName);
  const [editLastName, setEditLastName] = useState(currentUser.lastName);
  const [editEmail, setEditEmail] = useState(currentUser.email);

  // Change password fields
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      firstName: editFirstName,
      lastName: editLastName,
      email: editEmail,
    });
    setIsEditModalOpen(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      setIsPasswordModalOpen(false);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    }, 1200);
  };

  return (
    <div className="max-w-[1320px] mx-auto py-8 space-y-8">
      {/* Account Navigation Tabs */}
      <div className="flex border-b border-[#E6DDD7] gap-8">
        <button
          id="tab-my-blood-requests"
          onClick={() => onNavigate('my-requests')}
          className="pb-3 text-sm font-medium text-[#746C68] hover:text-[#292525] transition-colors"
        >
          My Blood Requests
        </button>

        <button
          id="tab-donation-requests"
          onClick={() => onNavigate('donation-requests')}
          className="pb-3 text-sm font-medium text-[#746C68] hover:text-[#292525] flex items-center gap-2 transition-colors"
        >
          <span>Donation Requests</span>
          {pendingDonationsCount > 0 && (
            <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-[#A92F35] text-white">
              {pendingDonationsCount}
            </span>
          )}
        </button>

        <button
          id="tab-account-settings"
          className="pb-3 text-sm font-semibold text-[#A92F35] border-b-2 border-[#A92F35]"
        >
          Account Settings
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292525]">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#746C68] mt-1">
          Manage your personal identity, login credentials, and account trust verifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card padding="lg" className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
              Personal Information
            </span>
            <button
              id="edit-personal-info-btn"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-[#A92F35] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit information</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-bold text-base">
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#292525]">
                  {currentUser.firstName} {currentUser.lastName}
                </h3>
                <p className="text-xs text-[#746C68]">{currentUser.email}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs py-2 px-3 bg-[#FAF7F2] rounded-xl border border-[#E6DDD7]">
              <span className="text-[#746C68] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A92F35]" />
                Email Verification
              </span>
              <StatusBadge status="Email: Verified" variant="verified" size="sm" />
            </div>
          </div>
        </Card>

        {/* Identity Verification */}
        <IdentityVerificationCard
          currentUser={currentUser}
          onUpdateUser={onUpdateUser}
        />

        {/* Security & Credentials */}
        <Card padding="lg" className="space-y-5">
          <div className="pb-3 border-b border-[#F0EAE5]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
              Security & Credentials
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-semibold text-[#292525] block">
                Password
              </span>
              <span className="text-xs text-[#746C68] block">
                Last updated 3 months ago
              </span>
            </div>

            <Button
              id="change-password-btn"
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordModalOpen(true)}
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Change Password →
            </Button>
          </div>
        </Card>

        {/* Note on Blood Type & Availability */}
        <Card padding="lg" className="space-y-4 bg-[#FDFBF9] border-[#E6DDD7]">
          <div className="pb-3 border-b border-[#F0EAE5]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
              Donor & Blood Configuration
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            Blood type settings and volunteer availability belong under{' '}
            <strong className="text-[#292525]">Donation Requests → Blood & Donation</strong>.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('donation-requests')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Manage Blood & Donation Settings
          </Button>
        </Card>
      </div>

      {/* EDIT INFORMATION MODAL */}
      <Modal
        id="edit-info-modal"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Information"
        maxWidth="md"
      >
        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" htmlFor="edit-fname" required>
              <input
                id="edit-fname"
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
                required
              />
            </FormField>
            <FormField label="Last Name" htmlFor="edit-lname" required>
              <input
                id="edit-lname"
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
                required
              />
            </FormField>
          </div>

          <FormField label="Email Address" htmlFor="edit-email" required>
            <input
              id="edit-email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
              required
            />
          </FormField>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="save-personal-info-btn"
              variant="primary"
              size="md"
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        id="change-password-modal"
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        maxWidth="sm"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {pwSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl">
              Password updated successfully!
            </div>
          )}

          <FormField label="Current Password" htmlFor="current-pw" required>
            <input
              id="current-pw"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
              placeholder="••••••••"
              required
            />
          </FormField>

          <FormField label="New Password" htmlFor="new-pw" required>
            <input
              id="new-pw"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
              placeholder="••••••••"
              required
            />
          </FormField>

          <FormField label="Confirm New Password" htmlFor="confirm-pw" required>
            <input
              id="confirm-pw"
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
              placeholder="••••••••"
              required
            />
          </FormField>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="submit-new-password-btn"
              variant="primary"
              size="md"
              type="submit"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
