import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget, AuditAction, AuditTargetType } from '../../types';

interface AuditLogsViewProps {
  onNavigate: (target: NavigationTarget) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ onNavigate }) => {
  const allLogs = dataService.getAuditLogs();
  const adminAccounts = dataService.getAdminAccounts();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [adminFilter, setAdminFilter] = useState<string>('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('all');

  const filteredLogs = allLogs.filter((log) => {
    const targetName = log.targetName || log.targetId || '';
    const targetId = log.targetId || '';
    const adminName = log.adminName || log.adminId || '';
    const details = log.details || log.note || log.reason || '';
    const action = log.action || '';

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        targetName.toLowerCase().includes(q) ||
        targetId.toLowerCase().includes(q) ||
        adminName.toLowerCase().includes(q) ||
        details.toLowerCase().includes(q) ||
        action.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (adminFilter !== 'all' && log.adminId !== adminFilter) return false;
    if (targetTypeFilter !== 'all' && log.targetType !== targetTypeFilter) return false;
    return true;
  });

  const getActionBadgeColor = (action: AuditAction) => {
    switch (action) {
      case 'administrator_created':
      case 'administrator_reactivated':
      case 'community_account_reactivated':
      case 'blood_request_restored':
      case 'report_resolved':
      case 'record_restored':
        return 'text-[#557A61] bg-[#EDF4EE] border-[#557A61]/25';
      case 'administrator_deactivated':
      case 'community_account_restricted':
      case 'blood_request_removed':
        return 'text-[#A92F35] bg-[#F7EAE7] border-[#A92F35]/25';
      case 'report_dismissed':
        return 'text-[#746C68] bg-[#F0ECE7] border-[#E6DDD7]';
      case 'record_archived':
        return 'text-[#9A6014] bg-[#FCF5E8] border-[#9A6014]/25';
      default:
        return 'text-[#746C68] bg-[#FAF7F2] border-[#E6DDD7]';
    }
  };

  const formatActionName = (action: string) => {
    return action.replace(/_/g, ' ').toUpperCase();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
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

  const handleInspectTarget = (targetType: AuditTargetType, targetId?: string) => {
    if (!targetId) return;
    switch (targetType) {
      case 'user':
        onNavigate({ view: 'user_details', userId: targetId });
        break;
      case 'request':
        onNavigate({ view: 'request_details', requestId: targetId });
        break;
      case 'report':
        onNavigate({ view: 'report_details', reportId: targetId });
        break;
      case 'administrator':
        onNavigate({ view: 'admin_details', targetAdminId: targetId });
        break;
      case 'archive':
        onNavigate({ view: 'archives' });
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
          GOVERNANCE &bull; SUPER ADMIN
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
          System Audit Logs
        </h1>
        <p className="text-[14.5px] text-[#746C68] mt-0.5">
          Immutable, chronological record of all administrative moderations, user restrictions, and security actions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-4 shadow-[0_2px_8px_rgba(41,37,37,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#958B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="audit-search-input"
            placeholder="Search action, administrator, target ID, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35] transition-colors"
          />
        </div>

        {/* Filter Pickers */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[13px] text-[#746C68]">
            <span>Admin:</span>
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-md px-2.5 py-1.5 text-[13px] text-[#292525] focus:outline-none"
            >
              <option value="all">All administrators</option>
              {adminAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role === 'super_admin' ? 'Super' : 'Admin'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[13px] text-[#746C68]">
            <span>Target:</span>
            <select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-md px-2.5 py-1.5 text-[13px] text-[#292525] focus:outline-none"
            >
              <option value="all">All target types</option>
              <option value="user">User</option>
              <option value="request">Blood Request</option>
              <option value="report">Report</option>
              <option value="administrator">Administrator</option>
              <option value="archive">Archive</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[13px] text-[#746C68]">
            <span>Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-md px-2.5 py-1.5 text-[13px] text-[#292525] focus:outline-none"
            >
              <option value="all">All actions</option>
              <option value="administrator_login">Admin Login</option>
              <option value="administrator_logout">Admin Logout</option>
              <option value="password_changed">Password Changed</option>
              <option value="administrator_created">Create Admin</option>
              <option value="administrator_deactivated">Deactivate Admin</option>
              <option value="administrator_reactivated">Reactivate Admin</option>
              <option value="community_account_restricted">Restrict Community User</option>
              <option value="community_account_reactivated">Reactivate Community User</option>
              <option value="blood_request_removed">Remove Request</option>
              <option value="blood_request_restored">Restore Request</option>
              <option value="report_review_started">Report Review Started</option>
              <option value="report_resolved">Resolve Report</option>
              <option value="report_dismissed">Dismiss Report</option>
              <option value="record_archived">Archive Record</option>
              <option value="record_restored">Restore Record</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] shadow-[0_2px_8px_rgba(41,37,37,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="audit-logs-table">
            <thead>
              <tr className="border-b border-[#E6DDD7] bg-[#FAF7F2] text-[12px] font-semibold text-[#746C68] uppercase tracking-wider">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-5">Context &amp; Details</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DDD7] text-[13.5px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#746C68]">
                    No audit records match your selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const targetName = log.targetName || log.targetId || 'Platform';
                  const details = log.details || log.note || log.reason || '—';
                  const logTimestamp = log.timestamp || log.createdAt;

                  return (
                    <tr key={log.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3.5 px-5 whitespace-nowrap text-[13px] text-[#746C68]">
                        {formatDate(logTimestamp)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#292525]">{log.adminName}</div>
                        <div className="text-[12px] font-mono text-[#958B86]">{log.adminId}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-semibold border ${getActionBadgeColor(
                            log.action,
                          )}`}
                        >
                          {formatActionName(log.action)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#292525]">{targetName}</div>
                        <div className="text-[12px] text-[#746C68] flex items-center gap-1.5 mt-0.5">
                          <span className="uppercase text-[10.5px] font-bold text-[#958B86]">{log.targetType}</span>
                          {log.targetId && (
                            <>
                              <span>&bull;</span>
                              <span className="font-mono text-[11.5px] text-[#746C68]">{log.targetId}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-[#746C68] max-w-xs sm:max-w-md break-words text-[13px]">
                        {details}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {log.targetId && log.targetType !== 'system' && (
                          <button
                            type="button"
                            onClick={() => handleInspectTarget(log.targetType, log.targetId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[12.5px] font-medium text-[#746C68] hover:text-[#A92F35] hover:bg-[#FAF7F2] rounded transition-colors cursor-pointer"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
