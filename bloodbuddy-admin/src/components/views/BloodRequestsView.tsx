import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, X, Droplets } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget, RequestStatus, ModerationStatus } from '../../types';
import { RequestStatusBadge, DonorDonationBadge, ModerationBadge } from '../common/Badge';

interface BloodRequestsViewProps {
  onNavigate: (target: NavigationTarget) => void;
}

export const BloodRequestsView: React.FC<BloodRequestsViewProps> = ({ onNavigate }) => {
  const requests = dataService.getRequests();
  const users = dataService.getUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'all' | RequestStatus>('all');
  const [moderationFilter, setModerationFilter] = useState<'all' | ModerationStatus>('all');

  const getUserName = (userId?: string) => {
    if (!userId) return '—';
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : userId;
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Search: request ID, facility, location
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const id = req.id.toLowerCase();
        const fac = req.healthcareFacility.toLowerCase();
        const loc = req.generalLocation.toLowerCase();
        const requesterName = getUserName(req.requesterUserId).toLowerCase();
        const donorName = req.selectedDonorUserId ? getUserName(req.selectedDonorUserId).toLowerCase() : '';
        if (
          !id.includes(q) &&
          !fac.includes(q) &&
          !loc.includes(q) &&
          !requesterName.includes(q) &&
          !donorName.includes(q)
        ) {
          return false;
        }
      }

      // Request status filter
      if (requestStatusFilter !== 'all' && req.requestStatus !== requestStatusFilter) {
        return false;
      }

      // Moderation filter
      if (moderationFilter !== 'all' && req.moderationStatus !== moderationFilter) {
        return false;
      }

      return true;
    });
  }, [requests, searchQuery, requestStatusFilter, moderationFilter, users]);

  const hasActiveFilters = searchQuery !== '' || requestStatusFilter !== 'all' || moderationFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setRequestStatusFilter('all');
    setModerationFilter('all');
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
          BLOOD REQUESTS
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
          Blood requests
        </h1>
        <p className="text-[15px] text-[#746C68] mt-1">
          Review BloodBuddy request activity and moderate inappropriate listings when necessary.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-[0_2px_8px_rgba(41,37,37,0.02)]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#958B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="requests-search-input"
            type="text"
            placeholder="Search by request ID, facility, or location..."
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
            <label htmlFor="filter-request-status" className="text-[13px] font-medium text-[#746C68]">
              Request Status:
            </label>
            <select
              id="filter-request-status"
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value as 'all' | RequestStatus)}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            >
              <option value="all">All</option>
              <option value="awaiting_response">Awaiting Response</option>
              <option value="accepted">Accepted</option>
              <option value="in_coordination">In Coordination</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-moderation-status" className="text-[13px] font-medium text-[#746C68]">
              Moderation:
            </label>
            <select
              id="filter-moderation-status"
              value={moderationFilter}
              onChange={(e) => setModerationFilter(e.target.value as 'all' | ModerationStatus)}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="removed">Removed</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              id="clear-requests-filters-btn"
              onClick={clearFilters}
              className="px-3 py-2 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7] rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Requests Desktop Table */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] shadow-[0_2px_8px_rgba(41,37,37,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table id="blood-requests-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E6DDD7] text-[12.5px] font-bold text-[#746C68] uppercase tracking-wider">
                <th className="py-3.5 px-5">Request</th>
                <th className="py-3.5 px-3">Blood Type</th>
                <th className="py-3.5 px-4">Facility / Location</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Selected Donor</th>
                <th className="py-3.5 px-4">Request Status</th>
                <th className="py-3.5 px-4">Donation Status</th>
                <th className="py-3.5 px-3">Created</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DDD7] text-[14px]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Droplets className="w-8 h-8 text-[#958B86] mx-auto opacity-60" />
                      <p className="text-[15px] font-medium text-[#292525]">No blood requests match these filters.</p>
                      <p className="text-[13px] text-[#746C68]">Try searching by different criteria or reset filters.</p>
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
                filteredRequests.map((req) => {
                  const requesterName = getUserName(req.requesterUserId);
                  const donorName = getUserName(req.selectedDonorUserId);

                  return (
                    <tr
                      key={req.id}
                      id={`request-row-${req.id}`}
                      className="hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      {/* Request ID + Moderation Tag if removed */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-[#292525]">#{req.id}</span>
                          {req.moderationStatus === 'removed' && (
                            <ModerationBadge status={req.moderationStatus} />
                          )}
                        </div>
                      </td>

                      {/* Blood Type */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 text-[12px] font-bold text-[#A92F35] bg-[#F7EAE7] rounded">
                          {req.bloodTypeNeeded}
                        </span>
                      </td>

                      {/* Facility / Location */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="font-medium text-[#292525] truncate">{req.healthcareFacility}</div>
                        <div className="text-[12px] text-[#746C68] truncate">{req.generalLocation}</div>
                      </td>

                      {/* Requester */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => onNavigate({ view: 'user_details', userId: req.requesterUserId })}
                          className="text-[#292525] hover:text-[#A92F35] font-medium text-left hover:underline truncate block max-w-[140px]"
                        >
                          {requesterName}
                        </button>
                      </td>

                      {/* Selected Donor */}
                      <td className="py-3.5 px-4">
                        {req.selectedDonorUserId ? (
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate({ view: 'user_details', userId: req.selectedDonorUserId! })
                            }
                            className="text-[#292525] hover:text-[#A92F35] font-medium text-left hover:underline truncate block max-w-[140px]"
                          >
                            {donorName}
                          </button>
                        ) : (
                          <span className="text-[#958B86]">—</span>
                        )}
                      </td>

                      {/* Request Status */}
                      <td className="py-3.5 px-4">
                        <RequestStatusBadge status={req.requestStatus} />
                      </td>

                      {/* Donation Status */}
                      <td className="py-3.5 px-4">
                        <DonorDonationBadge status={req.donorDonationStatus} />
                      </td>

                      {/* Created */}
                      <td className="py-3.5 px-3 text-[#746C68] text-[13px]">
                        {formatShortDate(req.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          id={`view-blood-request-btn-${req.id}`}
                          onClick={() => onNavigate({ view: 'request_details', requestId: req.id })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7] rounded-md transition-colors"
                        >
                          <span>View</span>
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
            Showing {filteredRequests.length} of {requests.length} blood requests
          </span>
          <span className="text-[#958B86]">
            Fulfillment is self-reported by requesters and donors. Not hospital verified.
          </span>
        </div>
      </div>
    </div>
  );
};
