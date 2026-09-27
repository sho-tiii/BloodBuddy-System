import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, X, Users as UsersIcon } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget, CommunityUser, IdentityStatus, AccountStatus } from '../../types';
import { IdentityBadge, AccountStatusBadge } from '../common/Badge';

interface UsersViewProps {
  onNavigate: (target: NavigationTarget) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ onNavigate }) => {
  const users = dataService.getUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [accountStatusFilter, setAccountStatusFilter] = useState<'all' | AccountStatus>('all');
  const [identityFilter, setIdentityFilter] = useState<'all' | IdentityStatus>('all');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        const id = user.id.toLowerCase();
        if (!fullName.includes(q) && !email.includes(q) && !id.includes(q)) {
          return false;
        }
      }

      // Account status
      if (accountStatusFilter !== 'all' && user.accountStatus !== accountStatusFilter) {
        return false;
      }

      // Identity
      if (identityFilter !== 'all' && user.identityStatus !== identityFilter) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, accountStatusFilter, identityFilter]);

  const hasActiveFilters = searchQuery !== '' || accountStatusFilter !== 'all' || identityFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setAccountStatusFilter('all');
    setIdentityFilter('all');
  };

  const formatJoinedDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
          USERS
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
          Community accounts
        </h1>
        <p className="text-[15px] text-[#746C68] mt-1">
          Review BloodBuddy accounts, identity status, donor availability, and platform activity.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-[0_2px_8px_rgba(41,37,37,0.02)]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#958B86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="users-search-input"
            type="text"
            placeholder="Search by name, email, or user ID..."
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
            <label htmlFor="filter-account-status" className="text-[13px] font-medium text-[#746C68]">
              Status:
            </label>
            <select
              id="filter-account-status"
              value={accountStatusFilter}
              onChange={(e) => setAccountStatusFilter(e.target.value as 'all' | AccountStatus)}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-identity-status" className="text-[13px] font-medium text-[#746C68]">
              Identity:
            </label>
            <select
              id="filter-identity-status"
              value={identityFilter}
              onChange={(e) => setIdentityFilter(e.target.value as 'all' | IdentityStatus)}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg text-[13.5px] text-[#292525] focus:outline-none focus:border-[#A92F35]"
            >
              <option value="all">All Identity Statuses</option>
              <option value="verified">Verified</option>
              <option value="not_verified">Not Verified</option>
              <option value="pending">Pending</option>
              <option value="needs_attention">Needs Attention</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              id="clear-users-filters-btn"
              onClick={clearFilters}
              className="px-3 py-2 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7] rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Desktop Table */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] shadow-[0_2px_8px_rgba(41,37,37,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table id="community-users-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E6DDD7] text-[12.5px] font-bold text-[#746C68] uppercase tracking-wider">
                <th className="py-3.5 px-5">Account</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Identity</th>
                <th className="py-3.5 px-4">Blood Type</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DDD7] text-[14px]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <UsersIcon className="w-8 h-8 text-[#958B86] mx-auto opacity-60" />
                      <p className="text-[15px] font-medium text-[#292525]">No accounts match your search.</p>
                      <p className="text-[13px] text-[#746C68]">Try searching by a different name, email, or clear your filters.</p>
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
                filteredUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      id={`user-row-${user.id}`}
                      className="hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      {/* Account */}
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-[#292525]">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-[12px] font-mono text-[#958B86]">{user.id}</div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-[#746C68]">{user.email}</td>

                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <IdentityBadge status={user.identityStatus} />
                      </td>

                      {/* Blood Type */}
                      <td className="py-3.5 px-4">
                        {user.bloodType === 'not_provided' ? (
                          <span className="text-[#958B86] text-[13px]">Not provided</span>
                        ) : (
                          <span className="text-[#292525] font-medium">
                            {user.bloodType} <span className="text-[12px] font-normal text-[#958B86]">· Self-reported</span>
                          </span>
                        )}
                      </td>

                      {/* Availability */}
                      <td className="py-3.5 px-4">
                        {user.donorAvailability === 'available' ? (
                          <span className="inline-flex items-center gap-1.5 text-[#557A61] font-medium text-[13.5px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#557A61]" />
                            Available
                          </span>
                        ) : (
                          <span className="text-[#958B86] text-[13.5px]">Not Available</span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4">
                        <AccountStatusBadge status={user.accountStatus} />
                      </td>

                      {/* Joined */}
                      <td className="py-3.5 px-4 text-[#746C68] text-[13px]">
                        {formatJoinedDate(user.joinedAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          id={`view-user-btn-${user.id}`}
                          onClick={() => onNavigate({ view: 'user_details', userId: user.id })}
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
            Showing {filteredUsers.length} of {users.length} community accounts
          </span>
          <span className="text-[#958B86]">
            Identity status applies to account identity only. Blood types are self-reported.
          </span>
        </div>
      </div>
    </div>
  );
};
