import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  KeyRound,
  UserX,
  RotateCcw,
  Clock,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget } from '../../types';
import { AdminRoleBadge, AdminAccountStatusBadge } from '../common/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/ToastContext';

interface AdminDetailsViewProps {
  adminId: string;
  onNavigate: (target: NavigationTarget) => void;
}

export const AdminDetailsView: React.FC<AdminDetailsViewProps> = ({ adminId, onNavigate }) => {
  const { addToast } = useToast();
  const [, setTick] = useState(0);

  const account = dataService.getAdminAccountById(adminId);
  const currentSession = dataService.getSession();
  const isCurrent = currentSession?.id === adminId;

  // Actions
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newTempPassword, setNewTempPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deactivateNote, setDeactivateNote] = useState('');
  const [deactivateError, setDeactivateError] = useState('');

  if (!account) {
    return (
      <div className="max-w-[800px] mx-auto p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#292525]">Administrator Not Found</h2>
        <p className="text-[#746C68]">The requested administrator profile does not exist.</p>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'admin_management' })}
          className="px-4 py-2 bg-[#A92F35] text-white rounded-lg text-sm font-medium"
        >
          Return to Admin Management
        </button>
      </div>
    );
  }

  // Related audit logs by this admin
  const allLogs = dataService.getAuditLogs();
  const adminLogs = allLogs.filter((log) => log.adminId === account.id);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (!newTempPassword || newTempPassword.length < 8) {
      setResetError('Password must be at least 8 characters long.');
      return;
    }

    const ok = dataService.resetAdminPassword(account.id, newTempPassword);
    if (ok) {
      addToast('Password Reset', `Password has been updated for ${account.name}.`, 'success');
      setIsResetModalOpen(false);
      setNewTempPassword('');
      setTick((t) => t + 1);
    } else {
      setResetError('Failed to reset password.');
    }
  };

  const handleDeactivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deactivateReason) {
      setDeactivateError('Please select a reason.');
      return;
    }
    const res = dataService.deactivateAdministrator(account.id, deactivateReason, deactivateNote.trim() || undefined);
    if (res.success) {
      addToast('Administrator Deactivated', `${account.name} disabled.`, 'danger');
      setIsDeactivateModalOpen(false);
      setDeactivateReason('');
      setDeactivateNote('');
      setTick((t) => t + 1);
    } else {
      setDeactivateError(res.error || 'Failed to deactivate.');
    }
  };

  const handleReactivate = () => {
    const res = dataService.reactivateAdministrator(account.id);
    if (res.success) {
      addToast('Administrator Reactivated', `Active status restored for ${account.name}.`, 'success');
      setTick((t) => t + 1);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Never';
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-8 space-y-6">
      {/* Top breadcrumb navigation */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'admin_management' })}
          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#746C68] hover:text-[#A92F35] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Administrator Management</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7EAE7] border border-[#A92F35]/20 flex items-center justify-center text-[#A92F35] text-[20px] font-bold shrink-0">
              {account.role === 'super_admin' ? 'SA' : 'PA'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[26px] font-bold text-[#292525] font-serif tracking-tight">{account.name}</h1>
                <AdminRoleBadge role={account.role} />
                <AdminAccountStatusBadge status={account.status} />
              </div>
              <div className="text-[13px] text-[#746C68] flex items-center gap-2 mt-1">
                <span className="font-mono text-[#958B86]">{account.id}</span>
                <span>&bull;</span>
                <span>{account.email}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="admin-reset-pw-btn"
              onClick={() => {
                setResetError('');
                setIsResetModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E6DDD7] hover:border-[#A92F35] text-[13px] font-medium text-[#292525] rounded-lg transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#746C68]" />
              <span>Reset Password</span>
            </button>

            {account.status === 'active' ? (
              <button
                type="button"
                id="admin-deactivate-btn"
                disabled={isCurrent}
                onClick={() => {
                  setDeactivateError('');
                  setIsDeactivateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F7EAE7] border border-[#A92F35]/20 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7]/80 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
              >
                <UserX className="w-4 h-4" />
                <span>Deactivate</span>
              </button>
            ) : (
              <button
                type="button"
                id="admin-reactivate-btn"
                onClick={handleReactivate}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EDF4EE] border border-[#557A61]/25 text-[13px] font-medium text-[#557A61] hover:bg-[#EDF4EE]/80 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reactivate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-5">
          <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>Administrative Email</span>
          </div>
          <div className="text-[15px] font-medium text-[#292525]">{account.email}</div>
          <div className="text-[12px] text-[#746C68] mt-1">Authenticated administrative address</div>
        </div>

        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-5">
          <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Account Provisioned</span>
          </div>
          <div className="text-[15px] font-medium text-[#292525]">{formatDate(account.createdAt)}</div>
          <div className="text-[12px] text-[#746C68] mt-1">By Super Administrator</div>
        </div>

        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-5">
          <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Signed In</span>
          </div>
          <div className="text-[15px] font-medium text-[#292525]">{formatDate(account.lastLoginAt)}</div>
          <div className="text-[12px] text-[#746C68] mt-1">Active platform session</div>
        </div>
      </div>

      {/* Moderation History & Audit Actions by this Admin */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#A92F35]" />
            <h2 className="text-[18px] font-bold text-[#292525] font-serif">Logged Moderation Actions</h2>
          </div>
          <span className="text-[12.5px] font-semibold text-[#746C68] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E6DDD7]">
            {adminLogs.length} action{adminLogs.length === 1 ? '' : 's'} recorded
          </span>
        </div>

        {adminLogs.length === 0 ? (
          <div className="py-8 text-center text-[#746C68] text-[13.5px]">
            No moderation or administrative actions have been logged by this account yet.
          </div>
        ) : (
          <div className="divide-y divide-[#E6DDD7] border border-[#E6DDD7] rounded-xl overflow-hidden">
            {adminLogs.slice(0, 10).map((log) => {
              const targetName = log.targetName || log.targetId || 'Platform Target';
              const details = log.details || log.note || log.reason || 'Administrative action logged.';
              const logTimestamp = log.timestamp || log.createdAt;
              return (
                <div key={log.id} className="p-4 hover:bg-[#FAF7F2]/50 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-mono font-semibold text-[#A92F35] bg-[#F7EAE7] px-2 py-0.5 rounded">
                        {log.action.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-[13px] font-semibold text-[#292525]">{targetName}</span>
                      {log.targetId && <span className="text-[12px] font-mono text-[#958B86]">({log.targetId})</span>}
                    </div>
                    <div className="text-[13px] text-[#746C68]">{details}</div>
                  </div>
                  <div className="text-[12px] text-[#958B86] whitespace-nowrap">{formatDate(logTimestamp)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={`Reset Password for ${account.name}`}
        id="admin-reset-pw-modal"
      >
        <form onSubmit={handleResetPassword} noValidate className="space-y-4">
          <p className="text-[14px] text-[#746C68]">
            Set a new temporary password for this administrator account.
          </p>

          {resetError && (
            <div className="p-3 bg-[#F7EAE7] text-[#A92F35] text-[13px] rounded-lg border border-[#A92F35]/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-[#292525] mb-1">
              New Password (min 8 characters)
            </label>
            <input
              type="password"
              value={newTempPassword}
              onChange={(e) => setNewTempPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DDD7]">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[14px] font-semibold text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg"
            >
              Save New Password
            </button>
          </div>
        </form>
      </Modal>

      {/* DEACTIVATE MODAL */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title={`Deactivate ${account.name}?`}
        id="details-deactivate-modal"
      >
        <form onSubmit={handleDeactivate} noValidate className="space-y-4">
          <p className="text-[14px] text-[#746C68]">
            This will immediately prevent the administrator from signing in. All past moderation history is preserved.
          </p>

          {deactivateError && (
            <div className="p-3 bg-[#F7EAE7] text-[#A92F35] text-[13px] rounded-lg border border-[#A92F35]/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{deactivateError}</span>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-[#292525] mb-1">Reason for Deactivation</label>
            <select
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525]"
            >
              <option value="">Select reason...</option>
              <option value="Staff departure or rotation">Staff departure or rotation</option>
              <option value="Temporary leave of absence">Temporary leave of absence</option>
              <option value="Administrative privilege review">Administrative privilege review</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#292525] mb-1">Internal Note (optional)</label>
            <textarea
              rows={3}
              value={deactivateNote}
              onChange={(e) => setDeactivateNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DDD7]">
            <button
              type="button"
              onClick={() => setIsDeactivateModalOpen(false)}
              className="px-4 py-2 text-[14px] font-medium text-[#746C68]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[14px] font-semibold text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg"
            >
              Confirm Deactivation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
