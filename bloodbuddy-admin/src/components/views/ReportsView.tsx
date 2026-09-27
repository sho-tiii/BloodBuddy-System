import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget, ReportStatus } from '../../types';
import { ReportStatusBadge } from '../common/Badge';

interface ReportsViewProps {
  onNavigate: (target: NavigationTarget) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate }) => {
  const reports = dataService.getReports();
  const users = dataService.getUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : userId;
  };

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const id = rep.id.toLowerCase();
        const reason = rep.reason.toLowerCase();
        const details = rep.details ? rep.details.toLowerCase() : '';
        const reporter = getUserName(rep.reporterUserId).toLowerCase();
        const subject = rep.requestId
          ? `request ${rep.requestId.toLowerCase()}`
          : rep.reportedUserId
          ? `user ${rep.reportedUserId.toLowerCase()} ${getUserName(rep.reportedUserId).toLowerCase()}`
          : '';

        if (
          !id.includes(q) &&
          !reason.includes(q) &&
          !details.includes(q) &&
          !reporter.includes(q) &&
          !subject.includes(q)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && rep.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, statusFilter, users]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
          REPORTS
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
          Community reports
        </h1>
        <p className="text-[15px] text-[#746C68] mt-1">
          Review and resolve community-submitted concerns regarding requests, users, or platform conduct.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-[0_2px_8px_rgba(41,37,37,0.02)]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#958B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="reports-search-input"
            type="text"
            placeholder="Search by report ID, reason, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] placeholder:text-[#958B86] focus:bg-white focus:outline-none focus:border-[#A92F35] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#958B86] hover:text-[#292525]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-report-status" className="text-[13px] font-medium text-[#746C68]">
              Status:
            </label>
            <select
              id="filter-report-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | ReportStatus)}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              id="clear-reports-filters-btn"
              onClick={clearFilters}
              className="px-3 py-2 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7] rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Reports Desktop Table */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] shadow-[0_2px_8px_rgba(41,37,37,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table id="community-reports-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E6DDD7] text-[12.5px] font-bold text-[#746C68] uppercase tracking-wider">
                <th className="py-3.5 px-5">Report ID</th>
                <th className="py-3.5 px-4">Reported Reason</th>
                <th className="py-3.5 px-4">Reported Subject</th>
                <th className="py-3.5 px-4">Reporter</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DDD7] text-[14px]">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <AlertTriangle className="w-8 h-8 text-[#958B86] mx-auto opacity-60" />
                      <p className="text-[15px] font-medium text-[#292525]">No reports match these criteria.</p>
                      <p className="text-[13px] text-[#746C68]">Try adjusting your search terms or status filter.</p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-2 inline-flex items-center px-3 py-1.5 text-[13px] font-semibold text-[#A92F35] bg-[#F7EAE7] rounded-lg hover:bg-[#F7EAE7]/80 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => {
                  const reporterName = getUserName(rep.reporterUserId);
                  const reportedName = rep.reportedUserId ? getUserName(rep.reportedUserId) : undefined;

                  return (
                    <tr
                      key={rep.id}
                      id={`report-row-${rep.id}`}
                      className="hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      {/* Report ID */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold font-mono text-[#292525]">#{rep.id}</span>
                      </td>

                      {/* Reported Reason */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#292525]">{rep.reason}</div>
                        <div className="text-[12.5px] text-[#746C68] line-clamp-1 max-w-[280px]">
                          {rep.details}
                        </div>
                      </td>

                      {/* Reported Subject */}
                      <td className="py-3.5 px-4">
                        {rep.requestId ? (
                          <button
                            type="button"
                            onClick={() => onNavigate({ view: 'request_details', requestId: rep.requestId! })}
                            className="text-[#A92F35] hover:underline font-mono text-[13px] font-medium"
                          >
                            Request #{rep.requestId}
                          </button>
                        ) : rep.reportedUserId ? (
                          <button
                            type="button"
                            onClick={() => onNavigate({ view: 'user_details', userId: rep.reportedUserId! })}
                            className="text-[#292525] hover:text-[#A92F35] hover:underline text-[13.5px] font-medium"
                          >
                            User: {reportedName}
                          </button>
                        ) : (
                          <span className="text-[#958B86] text-[13px]">General platform report</span>
                        )}
                      </td>

                      {/* Reporter */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => onNavigate({ view: 'user_details', userId: rep.reporterUserId })}
                          className="text-[#746C68] hover:text-[#A92F35] hover:underline text-[13.5px]"
                        >
                          {reporterName}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <ReportStatusBadge status={rep.status} />
                      </td>

                      {/* Created */}
                      <td className="py-3.5 px-4 text-[#746C68] text-[13px]">
                        {formatShortDate(rep.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          id={`review-report-btn-${rep.id}`}
                          onClick={() => onNavigate({ view: 'report_details', reportId: rep.id })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7] rounded-md transition-colors"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-[#E6DDD7] bg-[#FAF7F2]/40 flex items-center justify-between text-[12.5px] text-[#746C68]">
          <span>
            Showing {filteredReports.length} of {reports.length} moderation reports
          </span>
          <span className="text-[#958B86]">
            Administrative review ensures platform safety and accountability.
          </span>
        </div>
      </div>
    </div>
  );
};
