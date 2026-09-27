import React, { useState } from 'react';
import { HeartHandshake, Check, AlertCircle, Edit2, Clock, Filter } from 'lucide-react';
import { BloodType, IncomingDonationRequest, ActiveView, UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Notice } from '../components/common/Notice';
import { Modal } from '../components/common/Modal';
import { RequestCard } from '../components/cards/RequestCard';

interface DonationRequestsViewProps {
  currentUser: UserProfile;
  incomingRequests: IncomingDonationRequest[];
  onReviewRequest: (requestId: string) => void;
  onNavigate: (view: ActiveView) => void;
  onUpdateBloodType: (newType: BloodType) => void;
  onToggleAvailability: (isAvailable: boolean) => void;
}

const BLOOD_TYPE_OPTIONS: { label: string; value: BloodType; note?: string }[] = [
  { label: 'A+ (A Positive)', value: 'A+' },
  { label: 'A− (A Negative)', value: 'A−' },
  { label: 'B+ (B Positive)', value: 'B+' },
  { label: 'B− (B Negative)', value: 'B−' },
  { label: 'AB+ (AB Positive)', value: 'AB+' },
  { label: 'AB− (AB Negative)', value: 'AB−' },
  { label: 'O+ (O Positive)', value: 'O+' },
  { label: 'O− (O Negative)', value: 'O−' },
  { label: "I don't know my blood type → Not provided", value: 'Not provided' },
];

export const DonationRequestsView: React.FC<DonationRequestsViewProps> = ({
  currentUser,
  incomingRequests,
  onReviewRequest,
  onNavigate,
  onUpdateBloodType,
  onToggleAvailability,
}) => {
  const [filter, setFilter] = useState<'All' | 'Needs response' | 'Accepted' | 'Past'>('All');
  const [isBloodTypeModalOpen, setIsBloodTypeModalOpen] = useState(false);
  const [selectedTypeInModal, setSelectedTypeInModal] = useState<BloodType>(currentUser.bloodType);

  // Filter requests
  const isPastItem = (req: IncomingDonationRequest) =>
    req.status === 'Declined' ||
    req.status === 'Donation Completed' ||
    req.status === 'Request Fulfilled — No donation recorded' ||
    req.status === 'Request Fulfilled' ||
    req.donorDonationStatus === 'completed' ||
    req.donorDonationStatus === 'did_not_donate';

  const filteredRequests = incomingRequests.filter((req) => {
    if (filter === 'All') return true;
    if (filter === 'Needs response') return req.status === 'Needs your response';
    if (filter === 'Accepted') return req.status === 'Accepted' && !isPastItem(req);
    if (filter === 'Past') return isPastItem(req);
    return true;
  });

  const needsResponseCount = incomingRequests.filter((r) => r.status === 'Needs your response').length;
  const acceptedCount = incomingRequests.filter((r) => r.status === 'Accepted' && !isPastItem(r)).length;
  const pastCount = incomingRequests.filter((r) => isPastItem(r)).length;

  const handleSaveBloodType = () => {
    onUpdateBloodType(selectedTypeInModal);
    setIsBloodTypeModalOpen(false);
  };

  return (
    <div className="max-w-[1320px] mx-auto py-8 space-y-8">
      {/* Account Navigation Tabs */}
      <div className="flex border-b border-[#E6DDD7] gap-8">
        <button
          id="tab-my-requests"
          onClick={() => onNavigate('my-requests')}
          className="pb-3 text-sm font-medium text-[#746C68] hover:text-[#292525] transition-colors"
        >
          My Blood Requests
        </button>

        <button
          id="tab-donation-requests"
          className="pb-3 text-sm font-semibold text-[#A92F35] border-b-2 border-[#A92F35] flex items-center gap-2"
        >
          <span>Donation Requests</span>
          {needsResponseCount > 0 && (
            <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-[#A92F35] text-white">
              {needsResponseCount}
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

      {/* Intro Header */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292525]">
          Donation Requests
        </h1>
        <p className="text-xs sm:text-sm text-[#746C68] mt-1">
          Manage your donor availability and review blood requests sent to you.
        </p>
      </div>

      {/* BLOOD & DONATION SETTINGS CARD */}
      <Card padding="lg" className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
            Blood Type & Donor Availability
          </span>
          <span className="text-xs text-[#746C68]">
            {currentUser.availableToDonate ? (
              <span className="text-[#557A61] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#557A61]"></span>
                Available in Donor Searches
              </span>
            ) : (
              <span className="text-[#958B86] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#958B86]"></span>
                Hidden from Donor Searches
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Blood Type Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-[#746C68] font-medium block">
                  Listed Blood Type
                </span>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="w-10 h-10 rounded-xl bg-[#F7EAE7] text-[#A92F35] font-heading font-bold text-lg flex items-center justify-center border border-[#F0D5D1]">
                    {currentUser.bloodType}
                  </span>
                  <div>
                    <span className="text-base font-bold text-[#292525]">
                      {currentUser.bloodType === 'Not provided'
                        ? 'Not provided'
                        : `${currentUser.bloodType} Blood Type`}
                    </span>
                    <span className="text-xs text-[#958B86] block">
                      Self-reported
                    </span>
                  </div>
                </div>
              </div>

              <Button
                id="update-blood-type-btn"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTypeInModal(currentUser.bloodType);
                  setIsBloodTypeModalOpen(true);
                }}
                leftIcon={<Edit2 className="w-3 h-3" />}
              >
                Update blood type →
              </Button>
            </div>

            <p className="text-xs text-[#746C68] leading-relaxed pt-1">
              BloodBuddy has not independently verified this self-reported blood
              type. Final crossmatching and clinical confirmation are conducted at
              the hospital blood bank.
            </p>
          </div>

          {/* Availability Toggle Section */}
          <div className="space-y-3 md:pl-6 md:border-l border-[#F0EAE5]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#746C68] font-medium block">
                  Donor Visibility
                </span>
                <span className="text-sm font-bold text-[#292525] block mt-0.5">
                  Available to donate
                </span>
              </div>

              {/* Accessible toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="availability-toggle-input"
                  checked={currentUser.availableToDonate}
                  onChange={(e) => onToggleAvailability(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E6DDD7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#557A61]"></div>
              </label>
            </div>

            <p className="text-xs text-[#746C68] leading-relaxed">
              When turned <strong className="text-[#292525]">ON</strong>, you
              may appear as an available potential donor in searches for your
              self-reported blood type. You can switch this off at any time.
            </p>
          </div>
        </div>
      </Card>

      {/* REQUESTS SENT TO YOU */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#292525]">
              Requests Sent to You
            </h2>
            <p className="text-xs sm:text-sm text-[#746C68] mt-0.5">
              Review urgent requests matching your blood type and proximity.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              id="filter-all-btn"
              onClick={() => setFilter('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === 'All'
                  ? 'bg-[#A92F35] text-white shadow-sm'
                  : 'bg-white border border-[#E6DDD7] text-[#746C68] hover:text-[#292525]'
              }`}
            >
              All ({incomingRequests.length})
            </button>

            <button
              id="filter-needs-response-btn"
              onClick={() => setFilter('Needs response')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === 'Needs response'
                  ? 'bg-[#A92F35] text-white shadow-sm'
                  : 'bg-white border border-[#E6DDD7] text-[#746C68] hover:text-[#292525]'
              }`}
            >
              Needs response ({needsResponseCount})
            </button>

            <button
              id="filter-accepted-btn"
              onClick={() => setFilter('Accepted')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === 'Accepted'
                  ? 'bg-[#A92F35] text-white shadow-sm'
                  : 'bg-white border border-[#E6DDD7] text-[#746C68] hover:text-[#292525]'
              }`}
            >
              Accepted ({acceptedCount})
            </button>

            <button
              id="filter-past-btn"
              onClick={() => setFilter('Past')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === 'Past'
                  ? 'bg-[#A92F35] text-white shadow-sm'
                  : 'bg-white border border-[#E6DDD7] text-[#746C68] hover:text-[#292525]'
              }`}
            >
              Past ({pastCount})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                requestId={req.requestId}
                bloodType={req.bloodType}
                healthcareFacility={req.healthcareFacility}
                location={req.location}
                dateNeeded={req.dateNeeded}
                status={req.status}
                proximity={req.proximity}
                receivedTime={req.receivedTime}
                actionLabel="Review Request →"
                type="donor"
                onAction={() => onReviewRequest(req.requestId)}
              />
            ))
          ) : (
            <Card padding="lg" className="text-center py-10 max-w-md mx-auto">
              <p className="text-sm font-semibold text-[#292525]">
                No incoming requests found for this filter
              </p>
              <p className="text-xs text-[#746C68] mt-1">
                When nearby patients request your blood type, they will appear here.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* UPDATE BLOOD TYPE MODAL */}
      <Modal
        id="update-blood-type-modal"
        isOpen={isBloodTypeModalOpen}
        onClose={() => setIsBloodTypeModalOpen(false)}
        title="Update Self-Reported Blood Type"
        description="Select your blood type. This is self-reported and will not be displayed with clinical certification guarantees."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {BLOOD_TYPE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedTypeInModal === opt.value
                    ? 'border-[#A92F35] bg-[#F7EAE7]/50'
                    : 'border-[#E6DDD7] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="blood-type-option"
                    checked={selectedTypeInModal === opt.value}
                    onChange={() => setSelectedTypeInModal(opt.value)}
                    className="text-[#A92F35] focus:ring-[#A92F35]"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#292525]">
                    {opt.label}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <Notice type="info">
            If you do not know your blood type, selecting "Not provided" will pause
            blood-type matching notifications until verified at a clinic.
          </Notice>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsBloodTypeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="confirm-update-blood-type-btn"
              variant="primary"
              size="md"
              onClick={handleSaveBloodType}
            >
              Save Blood Type
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
