import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, MapPin, Building2, Calendar, User, FileText, X } from 'lucide-react';
import { BloodRequest, Donor } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Notice } from '../components/common/Notice';

interface ReviewRequestViewProps {
  requestData: Partial<BloodRequest>;
  selectedDonor: Donor;
  onBack: () => void;
  onSendSuccess: (createdRequest: BloodRequest) => void;
  onViewRequestDetails: (requestId: string) => void;
}

export const ReviewRequestView: React.FC<ReviewRequestViewProps> = ({
  requestData,
  selectedDonor,
  onBack,
  onSendSuccess,
  onViewRequestDetails,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createdId, setCreatedId] = useState<string>('#BR-8821');

  const handleSend = () => {
    setIsSending(true);
    // Simulate sending request
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setShowToast(true);

      const newId = '#BR-' + Math.floor(1000 + Math.random() * 9000);
      setCreatedId(newId);

      const created: BloodRequest = {
        id: newId,
        bloodFor: requestData.bloodFor || 'Myself',
        recipientName: requestData.recipientName,
        bloodType: requestData.bloodType || selectedDonor.bloodType,
        location: requestData.location || 'Caloocan City',
        healthcareFacility: requestData.healthcareFacility || 'Caloocan City Medical Center',
        dateNeeded: requestData.dateNeeded || 'Tomorrow morning (9:00 AM)',
        additionalNote: requestData.additionalNote,
        donorId: selectedDonor.id,
        donorSnapshot: {
          bloodType: selectedDonor.bloodType,
          generalLocation: selectedDonor.generalLocation,
          proximity: selectedDonor.proximity,
        },
        status: 'Awaiting donor response',
        createdAt: 'Just now',
      };

      onSendSuccess(created);
    }, 1200);
  };

  return (
    <div className="relative max-w-[1320px] mx-auto py-8">
      {/* UPPER-RIGHT TOAST */}
      {showToast && (
        <div
          id="request-sent-toast"
          className="fixed top-20 right-6 z-50 max-w-sm w-full bg-white border border-[#557A61] rounded-2xl shadow-[0_12px_32px_rgba(41,37,37,0.15)] p-4 animate-in fade-in slide-in-from-top-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EDF4EE] text-[#557A61] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#292525]">
                  Blood request sent successfully!
                </h4>
                <p className="text-xs text-[#746C68] leading-relaxed">
                  Your request is now awaiting the donor’s response.
                </p>
                <div className="pt-2">
                  <button
                    id="toast-view-request-btn"
                    onClick={() => onViewRequestDetails(createdId)}
                    className="text-xs font-bold text-[#A92F35] hover:underline"
                  >
                    View Request →
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-[#958B86] hover:text-[#292525] p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#746C68] mb-6">
        <button
          onClick={onBack}
          disabled={isSending}
          className="hover:text-[#292525] flex items-center gap-1 font-medium disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Edit Request</span>
        </button>
        <span>/</span>
        <span className="text-[#A92F35] font-semibold">Review Request</span>
      </div>

      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292525]">
          Review Blood Request
        </h1>
        <p className="text-xs sm:text-sm text-[#746C68] mt-1">
          Carefully verify the healthcare facility and timing details before
          notifying your prospective donor.
        </p>
      </div>

      {/* Two-Column 65/35 Read-Only Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SUMMARY: 65% (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
                Request Summary
              </span>
              <StatusBadge
                status={isSent ? 'Awaiting donor response' : 'Pending dispatch'}
                variant={isSent ? 'awaiting' : 'neutral'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#A92F35]" />
                  Blood For
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {requestData.bloodFor || 'Myself'}
                  {requestData.recipientName ? ` (${requestData.recipientName})` : ''}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68]">
                  Blood Type Needed
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#F7EAE7] text-[#A92F35] font-bold text-xs flex items-center justify-center border border-[#F0D5D1]">
                    {requestData.bloodType || selectedDonor.bloodType}
                  </span>
                  <span className="text-sm font-semibold text-[#292525]">
                    {requestData.bloodType || selectedDonor.bloodType}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#A92F35]" />
                  Healthcare Facility
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {requestData.healthcareFacility || 'Caloocan City Medical Center'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A92F35]" />
                  City / Location
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {requestData.location || 'Caloocan City'}
                </p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A92F35]" />
                  Date & Time Needed
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {requestData.dateNeeded || 'Tomorrow, Oct 24, 2024'}
                </p>
              </div>

              {requestData.additionalNote && (
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#F0EAE5]">
                  <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#746C68]" />
                    Additional Note
                  </span>
                  <p className="text-xs sm:text-sm text-[#292525] bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DDD7] leading-relaxed">
                    {requestData.additionalNote}
                  </p>
                </div>
              )}
            </div>

            {/* Actions: Back / Send Blood Request */}
            <div className="pt-6 border-t border-[#F0EAE5] flex items-center justify-between">
              <Button
                id="review-back-btn"
                variant="outline"
                size="md"
                onClick={onBack}
                disabled={isSending || isSent}
              >
                Back
              </Button>

              <div className="flex items-center gap-3">
                {isSent ? (
                  <div className="flex items-center gap-3">
                    <Button
                      id="request-sent-confirmed-btn"
                      variant="secondary"
                      size="md"
                      disabled
                      className="bg-[#EDF4EE] text-[#557A61] border border-[#D5E5D8]"
                    >
                      Request Sent ✓
                    </Button>
                    <Button
                      id="review-view-details-btn"
                      variant="primary"
                      size="md"
                      onClick={() => onViewRequestDetails(createdId)}
                    >
                      View Request Details →
                    </Button>
                  </div>
                ) : (
                  <Button
                    id="send-blood-request-btn"
                    variant="primary"
                    size="md"
                    isLoading={isSending}
                    onClick={handleSend}
                  >
                    {isSending ? 'Sending request…' : 'Send Blood Request →'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT SELECTED DONOR: 35% (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          <Card padding="md" className="space-y-4">
            <div className="pb-3 border-b border-[#F0EAE5]">
              <span className="text-xs font-semibold text-[#746C68] uppercase tracking-wider">
                Recipient Potential Donor
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-11 h-11 rounded-xl bg-[#F7EAE7] text-[#A92F35] font-heading font-bold text-xl flex items-center justify-center border border-[#F0D5D1]">
                    {selectedDonor.bloodType}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-[#292525] block">
                      Volunteer Donor
                    </span>
                    <span className="text-[11px] text-[#746C68]">
                      Self-reported {selectedDonor.bloodType}
                    </span>
                  </div>
                </div>

                <StatusBadge status="Available to Donate" variant="available" size="sm" />
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-[#746C68]">
                <div className="flex items-center gap-1.5 text-[#292525] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#A92F35] flex-shrink-0" />
                  <span>{selectedDonor.generalLocation}</span>
                </div>
                <p className="pl-5 text-[#746C68]">{selectedDonor.proximity}</p>
              </div>
            </div>

            <div className="pt-2">
              <Notice type="clinical">
                Acceptance indicates a volunteer's readiness to coordinate. Final
                compatibility and eligibility will be evaluated at the hospital.
              </Notice>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
