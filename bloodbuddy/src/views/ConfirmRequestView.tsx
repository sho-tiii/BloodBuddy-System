import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, MapPin, Building2, Calendar, AlertCircle } from 'lucide-react';
import { BloodType, Donor, BloodRequest } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { FormField } from '../components/common/FormField';
import { StatusBadge } from '../components/common/StatusBadge';
import { Notice } from '../components/common/Notice';
import { Modal } from '../components/common/Modal';
import { DonorCard } from '../components/cards/DonorCard';

interface ConfirmRequestViewProps {
  initialDonor: Donor;
  allDonors: Donor[];
  prefilledBloodType?: BloodType;
  prefilledLocation?: string;
  onCancel: () => void;
  onProceedToReview: (requestData: Partial<BloodRequest>, donor: Donor) => void;
}

const BLOOD_TYPES: BloodType[] = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export const ConfirmRequestView: React.FC<ConfirmRequestViewProps> = ({
  initialDonor,
  allDonors,
  prefilledBloodType,
  prefilledLocation,
  onCancel,
  onProceedToReview,
}) => {
  // Form fields
  const [bloodFor, setBloodFor] = useState<'Myself' | 'Someone else'>('Myself');
  const [recipientName, setRecipientName] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>(
    prefilledBloodType || initialDonor.bloodType
  );
  const [location, setLocation] = useState(
    prefilledLocation || initialDonor.city || 'Caloocan City'
  );
  const [healthcareFacility, setHealthcareFacility] = useState(
    'Caloocan City Medical Center'
  );
  const [dateNeeded, setDateNeeded] = useState('Tomorrow morning (9:00 AM)');
  const [additionalNote, setAdditionalNote] = useState(
    'Pre-surgery replacement units needed for scheduled operation.'
  );

  // Selected donor tracking and invalidation
  const [currentDonor, setCurrentDonor] = useState<Donor | null>(initialDonor);
  const [isDonorInvalidated, setIsDonorInvalidated] = useState(false);
  const [isReSelectModalOpen, setIsReSelectModalOpen] = useState(false);

  // Handle blood type or location change: Invalidate donor!
  const handleBloodTypeChange = (newType: BloodType) => {
    setBloodType(newType);
    if (currentDonor && currentDonor.bloodType !== newType) {
      setIsDonorInvalidated(true);
    }
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    // If location changes from original donor's city, prompt update
    if (
      currentDonor &&
      newLocation.trim() &&
      !currentDonor.generalLocation.toLowerCase().includes(newLocation.toLowerCase()) &&
      !currentDonor.city.toLowerCase().includes(newLocation.toLowerCase())
    ) {
      setIsDonorInvalidated(true);
    }
  };

  // Find 3 matching donors for re-selection modal
  const matchingDonors = allDonors
    .filter((d) => d.bloodType === bloodType && d.available)
    .slice(0, 3);

  const handleSelectNewDonor = (donor: Donor) => {
    setCurrentDonor(donor);
    setIsDonorInvalidated(false);
    setIsReSelectModalOpen(false);
  };

  const handleReviewClick = () => {
    if (isDonorInvalidated || !currentDonor) return;
    onProceedToReview(
      {
        bloodFor,
        recipientName: bloodFor === 'Someone else' ? recipientName : undefined,
        bloodType,
        location,
        healthcareFacility,
        dateNeeded,
        additionalNote,
      },
      currentDonor
    );
  };

  return (
    <div className="max-w-[1320px] mx-auto py-8">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#746C68] mb-6">
        <button
          onClick={onCancel}
          className="hover:text-[#292525] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search</span>
        </button>
        <span>/</span>
        <span className="text-[#A92F35] font-semibold">Confirm Blood Request</span>
      </div>

      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292525]">
          Confirm Blood Request
        </h1>
        <p className="text-xs sm:text-sm text-[#746C68] mt-1">
          Provide your healthcare facility details. Your selected volunteer donor
          will review this information.
        </p>
      </div>

      {/* Two-Column 65 / 35 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT FORM: 65% (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="lg" className="space-y-6">
            {/* Blood for toggle */}
            <div>
              <label className="text-xs font-semibold text-[#292525] block mb-2">
                Blood for <span className="text-[#A92F35]">*</span>
              </label>
              <div className="inline-flex p-1 bg-[#FAF7F2] rounded-xl border border-[#E6DDD7]">
                <button
                  type="button"
                  id="blood-for-myself-btn"
                  onClick={() => setBloodFor('Myself')}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    bloodFor === 'Myself'
                      ? 'bg-[#A92F35] text-white shadow-xs'
                      : 'text-[#746C68] hover:text-[#292525]'
                  }`}
                >
                  Myself
                </button>
                <button
                  type="button"
                  id="blood-for-someone-btn"
                  onClick={() => setBloodFor('Someone else')}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    bloodFor === 'Someone else'
                      ? 'bg-[#A92F35] text-white shadow-xs'
                      : 'text-[#746C68] hover:text-[#292525]'
                  }`}
                >
                  Someone else
                </button>
              </div>

              {bloodFor === 'Someone else' && (
                <div className="mt-3">
                  <FormField
                    label="Patient / Recipient Relationship or Name"
                    htmlFor="recipient-name"
                    hint="Optional"
                  >
                    <input
                      id="recipient-name"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. My father / Maria Santos"
                      className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
                    />
                  </FormField>
                </div>
              )}
            </div>

            {/* Blood Type & General Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Blood Type Needed" htmlFor="req-blood-type" required>
                <select
                  id="req-blood-type"
                  value={bloodType}
                  onChange={(e) => handleBloodTypeChange(e.target.value as BloodType)}
                  className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] font-semibold text-[#292525]"
                >
                  {BLOOD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      Blood Type {t}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Location / City" htmlFor="req-location" required>
                <input
                  id="req-location"
                  type="text"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder="e.g. Caloocan City"
                  className="w-full h-12 px-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
                  required
                />
              </FormField>
            </div>

            {/* Healthcare Facility */}
            <FormField
              label="Healthcare Facility"
              htmlFor="req-facility"
              hint="Hospital or blood station where donation will take place"
              required
            >
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-[#A92F35] absolute left-3.5 pointer-events-none" />
                <input
                  id="req-facility"
                  type="text"
                  value={healthcareFacility}
                  onChange={(e) => setHealthcareFacility(e.target.value)}
                  placeholder="e.g. Caloocan City Medical Center"
                  className="w-full h-12 pl-10 pr-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
                  required
                />
              </div>
            </FormField>

            {/* Date Needed */}
            <FormField
              label="Date Needed"
              htmlFor="req-date-needed"
              hint="When donor should arrive at facility"
              required
            >
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-[#A92F35] absolute left-3.5 pointer-events-none" />
                <input
                  id="req-date-needed"
                  type="text"
                  value={dateNeeded}
                  onChange={(e) => setDateNeeded(e.target.value)}
                  placeholder="e.g. Tomorrow morning or Oct 28"
                  className="w-full h-12 pl-10 pr-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35]"
                  required
                />
              </div>
            </FormField>

            {/* Additional Note */}
            <FormField
              label="Additional Note"
              htmlFor="req-note"
              hint="Optional — hospital room, ward, or procedure context"
            >
              <textarea
                id="req-note"
                rows={3}
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                placeholder="Include room number, attending physician name, or specific timing details..."
                className="w-full p-3.5 bg-white border border-[#E6DDD7] rounded-xl text-sm focus:outline-none focus:border-[#A92F35] resize-none leading-relaxed"
              />
            </FormField>

            {/* Action buttons */}
            <div className="pt-4 border-t border-[#F0EAE5] flex items-center justify-between">
              <Button
                id="cancel-confirm-request-btn"
                variant="ghost"
                size="md"
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button
                id="proceed-to-review-btn"
                variant="primary"
                size="md"
                disabled={isDonorInvalidated || !currentDonor}
                onClick={handleReviewClick}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Review Request →
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT SELECTED DONOR: 35% (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
              <span className="text-xs font-semibold text-[#746C68] uppercase tracking-wider">
                Selected Potential Donor
              </span>
              {currentDonor && !isDonorInvalidated && (
                <button
                  id="change-donor-link"
                  onClick={() => setIsReSelectModalOpen(true)}
                  className="text-xs font-semibold text-[#A92F35] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Change donor →</span>
                </button>
              )}
            </div>

            {/* If donor is invalidated due to blood type or location change */}
            {isDonorInvalidated || !currentDonor ? (
              <div className="p-4 bg-[#FFF9EE] border border-[#F3E2B8] rounded-xl text-center space-y-3">
                <AlertCircle className="w-6 h-6 text-[#8C6418] mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold text-[#8C6418]">
                    Donor selection needs updating
                  </h4>
                  <p className="text-xs text-[#6B5325] mt-1">
                    Your request criteria (Blood Type: {bloodType}) no longer
                    matches the previously selected donor. Please choose an
                    active matching donor to proceed.
                  </p>
                </div>
                <Button
                  id="find-matching-donors-modal-btn"
                  variant="primary"
                  size="sm"
                  onClick={() => setIsReSelectModalOpen(true)}
                  className="w-full"
                >
                  Find Matching Donors →
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-11 h-11 rounded-xl bg-[#F7EAE7] text-[#A92F35] font-heading font-bold text-xl flex items-center justify-center border border-[#F0D5D1]">
                      {currentDonor.bloodType}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-[#292525] block">
                        Volunteer Donor
                      </span>
                      <span className="text-[11px] text-[#746C68]">
                        Self-reported {currentDonor.bloodType}
                      </span>
                    </div>
                  </div>

                  <StatusBadge status="Available to Donate" variant="available" size="sm" />
                </div>

                <div className="space-y-1.5 pt-2 text-xs text-[#746C68]">
                  <div className="flex items-center gap-1.5 text-[#292525] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#A92F35] flex-shrink-0" />
                    <span>{currentDonor.generalLocation}</span>
                  </div>
                  <p className="pl-5 text-[#746C68]">{currentDonor.proximity}</p>
                </div>
              </div>
            )}

            {/* Clinical Responsibility notice */}
            <div className="pt-2">
              <Notice type="clinical">
                BloodBuddy facilitates matching only. Crossmatching and final
                eligibility will be determined directly by healthcare staff at the
                hospital.
              </Notice>
            </div>
          </Card>
        </div>
      </div>

      {/* RE-SELECTION MODAL: "Choose a matching donor" */}
      <Modal
        id="choose-matching-donor-modal"
        isOpen={isReSelectModalOpen}
        onClose={() => setIsReSelectModalOpen(false)}
        title="Choose a matching donor"
        description={`Showing active volunteer donors matching blood type ${bloodType}. Selecting one will update your request.`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {matchingDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {matchingDonors.map((donor) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  isSelectable
                  isSelected={currentDonor?.id === donor.id}
                  onSelect={handleSelectNewDonor}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-[#746C68]">
                No available donors matching {bloodType} found in this area right now.
              </p>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReSelectModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
