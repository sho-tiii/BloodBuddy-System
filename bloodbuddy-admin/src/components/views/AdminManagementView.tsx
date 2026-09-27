import React, { useState } from 'react';
import {
  Users as UsersIcon,
  UserPlus,
  ShieldCheck,
  Search,
  ArrowRight,
  UserX,
  RotateCcw,
  Clock,
  Mail,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AdminAccount, NavigationTarget } from '../../types';
import { AdminRoleBadge, AdminAccountStatusBadge } from '../common/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/ToastContext';

interface AdminManagementViewProps {
  onNavigate: (target: NavigationTarget) => void;
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [, setTick] = useState(0);

  const adminAccounts = dataService.getAdminAccounts();
  const currentSession = dataService.getSession();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'super_admin'>('all');

  // Create Admin Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [createError, setCreateError] = useState('');

  // Deactivate Modal State
  const [deactivatingAccount, setDeactivatingAccount] = useState<AdminAccount | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deactivateNote, setDeactivateNote] = useState('');
  const [deactivateError, setDeactivateError] = useState('');

  // Reactivate Modal State
  const [reactivatingAccount, setReactivatingAccount] = useState<AdminAccount | null>(null);

  const filteredAccounts = adminAccounts.filter((account) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        account.name.toLowerCase().includes(q) ||
        account.email.toLowerCase().includes(q) ||
        account.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && account.status !== statusFilter) return false;
    if (roleFilter !== 'all' && account.role !== roleFilter) return false;
    return true;
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newName.trim()) {
      setCreateError('Please provide the administrator’s full name.');
      return;
    }
    if (!newEmail.trim()) {
      setCreateError('Please provide a valid administrative email.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setCreateError('Temporary password must be at least 8 characters long.');
      return;
    }

    const res = dataService.createAdministrator(newName, newEmail, newPassword);
    if (res.success) {
      addToast('Administrator Created', `Account for ${newName} has been provisioned.`, 'success');
      setIsCreateModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setTick((t) => t + 1);
    } else {
      setCreateError(res.error || 'Failed to create administrator.');
    }
  };

  const handleDeactivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deactivatingAccount) return;

    if (!deactivateReason) {
      setDeactivateError('Please select a reason for deactivation.');
      return;
    }

    const res = dataService.deactivateAdministrator(
      deactivatingAccount.id,
      deactivateReason,
      deactivateNote.trim() || undefined,
    );

    if (res.success) {
      addToast('Administrator Deactivated', `${deactivatingAccount.name} has been disabled.`, 'danger');
      setDeactivatingAccount(null);
      setDeactivateReason('');
      setDeactivateNote('');
      setDeactivateError('');
      setTick((t) => t + 1);
    } else {
      setDeactivateError(res.error || 'Failed to deactivate administrator.');
    }
  };

  const handleReactivate = () => {
    if (!reactivatingAccount) return;

    const res = dataService.reactivateAdministrator(reactivatingAccount.id);
    if (res.success) {
      addToast('Administrator Reactivated', `Active status restored for ${reactivatingAccount.name}.`, 'success');
      setReactivatingAccount(null);
      setTick((t) => t + 1);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Never';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
            GOVERNANCE &bull; SUPER ADMIN
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
            Administrator Management
          </h1>
          <p className="text-[14.5px] text-[#746C68] mt-0.5">
            Provision, review, and manage operational platform administrators and credentials.
          </p>
        </div>

        <button
          type="button"
          id="create-admin-btn"
          onClick={() => {
            setCreateError('');
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#A92F35] hover:bg-[#8F272D] text-white text-[14px] font-semibold rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Admin</span>
        </button>
      </div>

      {/* Role Summary Callout */}
      <div className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-[16px] p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold text-[#292525]">
            <span className="w-2 h-2 rounded-full bg-[#746C68]" />
            <span>Administrator Role (Operational)</span>
          </div>
          <p className="text-[#746C68] leading-relaxed">
            Performs community moderation: reviewing reports, resolving listings, and moderating user accounts.
            Cannot manage administrators, view full system audit logs, or access archives.
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold text-[#8F272D]">
            <span className="w-2 h-2 rounded-full bg-[#A92F35]" />
            <span>Super Administrator Role (Governance)</span>
          </div>
          <p className="text-[#746C68] leading-relaxed">
            Full platform authority: provisions and disables administrators, accesses centralized immutable audit logs,
            and inspects system archives.
          </p>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-4 shadow-[0_2px_8px_rgba(41,37,37,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#958B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="admin-search-input"
            placeholder="Search by name, email, or ADM ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[13px] text-[#746C68]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-md px-2.5 py-1.5 text-[13px] text-[#292525] focus:outline-none"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[13px] text-[#746C68]">
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-md px-2.5 py-1.5 text-[13px] text-[#292525] focus:outline-none"
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Accounts Table */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] shadow-[0_2px_8px_rgba(41,37,37,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="admin-accounts-table">
            <thead>
              <tr className="border-b border-[#E6DDD7] bg-[#FAF7F2] text-[12px] font-semibold text-[#746C68] uppercase tracking-wider">
                <th className="py-3 px-5">Administrator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DDD7] text-[14px]">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#746C68]">
                    No administrative accounts matched your filters.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const isCurrent = currentSession?.id === account.id;

                  return (
                    <tr
                      key={account.id}
                      id={`admin-row-${account.id}`}
                      className="hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F7EAE7] border border-[#A92F35]/20 flex items-center justify-center text-[#A92F35] text-[13px] font-bold shrink-0">
                            {account.role === 'super_admin' ? 'SA' : 'PA'}
                          </div>
                          <div>
                            <div className="font-semibold text-[#292525] flex items-center gap-2">
                              <span>{account.name}</span>
                              {isCurrent && (
                                <span className="text-[11px] font-medium text-[#557A61] bg-[#EDF4EE] px-1.5 py-0.2 rounded border border-[#557A61]/20">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[12.5px] text-[#746C68] flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[#958B86]">{account.id}</span>
                              <span>&bull;</span>
                              <span>{account.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <AdminRoleBadge role={account.role} />
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <AdminAccountStatusBadge status={account.status} />
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-[13px] text-[#746C68]">
                        {formatDate(account.createdAt)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-[13px] text-[#746C68]">
                        {formatDate(account.lastLoginAt)}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            id={`view-admin-details-btn-${account.id}`}
                            onClick={() => onNavigate({ view: 'admin_details', targetAdminId: account.id })}
                            className="px-2.5 py-1.5 text-[13px] font-medium text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2] rounded-md transition-colors"
                          >
                            Details
                          </button>

                          {account.status === 'active' ? (
                            <button
                              type="button"
                              id={`deactivate-admin-btn-${account.id}`}
                              disabled={isCurrent}
                              onClick={() => {
                                setDeactivatingAccount(account);
                                setDeactivateError('');
                              }}
                              className="px-2.5 py-1.5 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7] rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title={isCurrent ? 'You cannot deactivate your own account' : 'Deactivate administrator'}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              type="button"
                              id={`reactivate-admin-btn-${account.id}`}
                              onClick={() => setReactivatingAccount(account)}
                              className="px-2.5 py-1.5 text-[13px] font-medium text-[#557A61] hover:bg-[#EDF4EE] rounded-md transition-colors cursor-pointer"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADMINISTRATOR MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision Platform Administrator"
        id="create-admin-modal"
      >
        <form onSubmit={handleCreateAdmin} noValidate className="space-y-4">
          <p className="text-[14px] text-[#746C68] leading-relaxed">
            Create an operational administrator account for platform moderation. The administrator will have
            access to Users, Blood Requests, and Reports moderation workflows.
          </p>

          {createError && (
            <div
              role="alert"
              className="p-3 bg-[#F7EAE7] text-[#A92F35] text-[13px] rounded-lg border border-[#A92F35]/20 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          <div>
            <label htmlFor="new-admin-name" className="block text-[13px] font-semibold text-[#292525] mb-1">
              Full Name <span className="text-[#A92F35]">*</span>
            </label>
            <input
              id="new-admin-name"
              type="text"
              placeholder="e.g. Maria Santos"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
          </div>

          <div>
            <label htmlFor="new-admin-email" className="block text-[13px] font-semibold text-[#292525] mb-1">
              Administrative Email <span className="text-[#A92F35]">*</span>
            </label>
            <input
              id="new-admin-email"
              type="email"
              placeholder="e.g. maria.santos@bloodbuddy.test"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
          </div>

          <div>
            <label htmlFor="new-admin-password" className="block text-[13px] font-semibold text-[#292525] mb-1">
              Initial Password <span className="text-[#A92F35]">*</span>
            </label>
            <input
              id="new-admin-password"
              type="password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
            <p className="text-[12px] text-[#746C68] mt-1">
              The administrator can reset their password via self-service Forgot Password.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DDD7]">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-admin-btn"
              className="px-4 py-2 text-[14px] font-semibold text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg transition-colors cursor-pointer"
            >
              Provision Account
            </button>
          </div>
        </form>
      </Modal>

      {/* DEACTIVATE ADMINISTRATOR MODAL */}
      <Modal
        isOpen={!!deactivatingAccount}
        onClose={() => setDeactivatingAccount(null)}
        title="Deactivate Administrator?"
        id="deactivate-admin-modal"
      >
        <form onSubmit={handleDeactivate} noValidate className="space-y-4">
          <p className="text-[14px] text-[#746C68] leading-relaxed">
            Deactivating <strong className="text-[#292525]">{deactivatingAccount?.name}</strong> will
            revoke their platform login credentials immediately. No historical moderation actions will be deleted.
          </p>

          {deactivateError && (
            <div
              role="alert"
              className="p-3 bg-[#F7EAE7] text-[#A92F35] text-[13px] rounded-lg border border-[#A92F35]/20 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{deactivateError}</span>
            </div>
          )}

          <div>
            <label htmlFor="deactivate-admin-reason" className="block text-[13px] font-semibold text-[#292525] mb-1">
              Reason for Deactivation <span className="text-[#A92F35]">*</span>
            </label>
            <select
              id="deactivate-admin-reason"
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            >
              <option value="">Select reason...</option>
              <option value="Staff departure or rotation">Staff departure or rotation</option>
              <option value="Temporary leave of absence">Temporary leave of absence</option>
              <option value="Administrative privilege review">Administrative privilege review</option>
              <option value="Security precaution">Security precaution</option>
            </select>
          </div>

          <div>
            <label htmlFor="deactivate-admin-note" className="block text-[13px] font-semibold text-[#292525] mb-1">
              Internal Governance Note (optional)
            </label>
            <textarea
              id="deactivate-admin-note"
              rows={3}
              placeholder="Add specific context for the audit record..."
              value={deactivateNote}
              onChange={(e) => setDeactivateNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DDD7]">
            <button
              type="button"
              onClick={() => setDeactivatingAccount(null)}
              className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-deactivate-admin-btn"
              className="px-4 py-2 text-[14px] font-semibold text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg transition-colors cursor-pointer"
            >
              Confirm Deactivation
            </button>
          </div>
        </form>
      </Modal>

      {/* REACTIVATE ADMINISTRATOR MODAL */}
      <Modal
        isOpen={!!reactivatingAccount}
        onClose={() => setReactivatingAccount(null)}
        title="Reactivate Administrator Access?"
        id="reactivate-admin-modal"
      >
        <div className="space-y-4">
          <p className="text-[14px] text-[#746C68] leading-relaxed">
            Restoring access for <strong className="text-[#292525]">{reactivatingAccount?.name}</strong> will
            allow them to sign in again with their configured credentials.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DDD7]">
            <button
              type="button"
              onClick={() => setReactivatingAccount(null)}
              className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              id="confirm-reactivate-admin-btn"
              onClick={handleReactivate}
              className="px-4 py-2 text-[14px] font-semibold text-white bg-[#557A61] hover:bg-[#43624D] rounded-lg transition-colors cursor-pointer"
            >
              Reactivate Administrator
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
