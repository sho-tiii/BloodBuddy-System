import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { BloodRequest, RequesterStatus, ActiveView } from '../types';
import { RequestCard } from '../components/cards/RequestCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

interface MyRequestsViewProps {
  requests: BloodRequest[];
  onSelectRequest: (requestId: string) => void;
  onNavigate: (view: ActiveView) => void;
  pendingDonationsCount: number;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  requests,
  onSelectRequest,
  onNavigate,
  pendingDonationsCount,
}) => {
  const [filterGroup, setFilterGroup] = useState<'All' | 'Active' | 'Past'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredRequests = requests.filter((req) => {
    // Top-level group filter
    if (filterGroup === 'Active') {
      const isActive =
        req.status === 'Awaiting donor response' || req.status === 'Donor accepted';
      if (!isActive) return false;
    } else if (filterGroup === 'Past') {
      const isPast =
        req.status === 'Request Fulfilled' ||
        req.status === 'Completed' ||
        req.status === 'Cancelled' ||
        req.status === 'Donor declined';
      if (!isPast) return false;
    }

    // Specific status sub-filter
    if (filterStatus !== 'All') {
      return req.status === filterStatus;
    }

    return true;
  });

  const activeCount = requests.filter(
    (r) => r.status === 'Awaiting donor response' || r.status === 'Donor accepted'
  ).length;

  const pastCount = requests.filter(
    (r) =>
      r.status === 'Request Fulfilled' ||
      r.status === 'Completed' ||
      r.status === 'Cancelled' ||
      r.status === 'Donor declined'
  ).length;

  return (
    <div className="max-w-[1320px] mx-auto py-8 space-y-8">
      {/* Account Navigation Tabs */}
      <div className="flex border-b border-[#E6DDD7] gap-8">
        <button
          id="tab-my-blood-requests"
          className="pb-3 text-sm font-semibold text-[#A92F35] border-b-2 border-[#A92F35] flex items-center gap-2"
        >
          <span>My Blood Requests</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-[#F7EAE7] text-[#A92F35]">
            {requests.length}
          </span>
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
          onClick={() => onNavigate('account-settings')}
          className="pb-3 text-sm font-medium text-[#746C68] hover:text-[#292525] transition-colors"
        >
          Account Settings
        </button>
      </div>

      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292525]">
            My Blood Requests
          </h1>
          <p className="text-xs sm:text-sm text-[#746C68] mt-1">
            Track requests sent to volunteer donors for upcoming procedures.
          </p>
        </div>

        <Button
          id="new-blood-request-btn"
          variant="primary"
          size="md"
          onClick={() => onNavigate('home')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Find Donors
        </Button>
      </div>

      {/* Filter Tabs & Status Chips */}
      <div className="space-y-3">
        {/* Category Group Tabs */}
        <div className="flex items-center gap-2">
          {(
            [
              { id: 'All', label: 'All Requests', count: requests.length },
              { id: 'Active', label: 'Active', count: activeCount },
              { id: 'Past', label: 'Past', count: pastCount },
            ] as const
          ).map((grp) => (
            <button
              key={grp.id}
              id={`tab-filter-${grp.id.toLowerCase()}`}
              onClick={() => {
                setFilterGroup(grp.id);
                setFilterStatus('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterGroup === grp.id
                  ? 'bg-[#292525] text-white shadow-sm'
                  : 'bg-white border border-[#E6DDD7] text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{grp.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterGroup === grp.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F5F2EF] text-[#746C68]'
                }`}
              >
                {grp.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              requestId={req.id}
              bloodType={req.bloodType}
              healthcareFacility={req.healthcareFacility}
              location={req.location}
              dateNeeded={req.dateNeeded}
              status={req.status}
              receivedTime={req.createdAt}
              actionLabel="View Request →"
              onAction={() => onSelectRequest(req.id)}
            />
          ))
        ) : (
          <Card padding="lg" className="text-center py-12 max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#292525]">
              No blood requests found for this filter
            </p>
            <p className="text-xs text-[#746C68] mt-1 mb-4">
              Need replacement blood? Search for nearby volunteer donors to begin.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterStatus('All')}
            >
              Reset Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
