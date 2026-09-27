import React, { useState } from 'react';
import { ArrowLeft, MapPin, Building2, Calendar, User, FileText, CheckCircle, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { IncomingDonationRequest, UserProfile, Report } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Notice } from '../components/common/Notice';
import { Modal } from '../components/common/Modal';
import { Toast, ToastMessage } from '../components/common/Toast';
import { ReportMenuButton } from '../components/common/ReportMenuButton';
import { ReportModal } from '../components/common/ReportModal';

interface ReviewDonationRequestViewProps {
  request: IncomingDonationRequest;
  currentUser: UserProfile;
  onBack: () => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string, reason: string) => void;
  onOpenConversation: (requestId: string, role?: 'requester' | 'donor') => void;
  onConfirmDonation: (requestId: string) => void;
  onConfirmDidNotDonate: (requestId: string) => void;
  onCreateReport?: (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
}

const DECLINE_REASONS = [
  'Not available',
  "Timing doesn't work",
  'Too far away',
  'Other',
  'Prefer not to say',
];

export const ReviewDonationRequestView: React.FC<ReviewDonationRequestViewProps> = ({
  request,
  currentUser,
  onBack,
  onAcceptRequest,
  onDeclineRequest,
  onOpenConversation,
  onConfirmDonation,
  onConfirmDidNotDonate,
  onCreateReport,
}) => {
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState<string>('Not available');

  // Donor donation confirmation modals and loading states
  const [isYesDonatedModalOpen, setIsYesDonatedModalOpen] = useState(false);
  const [isDidNotDonateModalOpen, setIsDidNotDonateModalOpen] = useState(false);
  const [isConfirmingDonation, setIsConfirmingDonation] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const isAccepted = request.status === 'Accepted';
  const isFulfilledByRequester =
    request.requestFulfilled === true ||
    request.status === 'Donation Completed' ||
    request.status === 'Request Fulfilled — No donation recorded' ||
    request.status === 'Request Fulfilled';

  const isDonationCompleted =
    request.status === 'Donation Completed' || request.donorDonationStatus === 'completed';

  const isDidNotDonate =
    request.status === 'Request Fulfilled — No donation recorded' ||
    request.donorDonationStatus === 'did_not_donate';

  const isAwaitingDonorConfirmation =
    isFulfilledByRequester && !isDonationCompleted && !isDidNotDonate;

  const handleConfirmAccept = () => {
    onAcceptRequest(request.requestId);
    setIsAcceptModalOpen(false);
  };

  const handleConfirmDecline = () => {
    onDeclineRequest(request.requestId, selectedDeclineReason);
    setIsDeclineModalOpen(false);
    onBack();
  };

  const handleConfirmYesDonated = () => {
    setIsConfirmingDonation(true);
    setTimeout(() => {
      onConfirmDonation(request.requestId);
      setIsConfirmingDonation(false);
      setIsYesDonatedModalOpen(false);
      setToast({
        id: 'donated-toast',
        type: 'success',
        title: 'Donation marked as completed',
        description: 'Thank you for confirming your donation.',
      });
    }, 350);
  };

  const handleConfirmNoDidNotDonate = () => {
    setIsConfirmingDonation(true);
    setTimeout(() => {
      onConfirmDidNotDonate(request.requestId);
      setIsConfirmingDonation(false);
      setIsDidNotDonateModalOpen(false);
      setToast({
        id: 'not-donated-toast',
        type: 'info',
        title: 'Response recorded',
        description: 'Request marked as fulfilled without a recorded donation.',
      });
    }, 350);
  };

  return (
    <div className="max-w-[1320px] mx-auto py-8">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#746C68] mb-6">
        <button
          onClick={onBack}
          className="hover:text-[#292525] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Donation Requests</span>
        </button>
        <span>/</span>
        <span className="text-[#A92F35] font-semibold">
          {isAccepted || isFulfilledByRequester
            ? 'Donation request details'
            : 'Review Donation Request'}
        </span>
      </div>

      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292525]">
              {isAccepted || isFulfilledByRequester
                ? 'Donation request details'
                : 'Review Donation Request'}
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-xs sm:text-sm text-[#746C68] mt-1">
            Request {request.requestId} · Received {request.receivedTime}
          </p>
        </div>

        {/* Action button if accepted or fulfilled and report menu */}
        <div className="flex items-center gap-3">
          {(isAccepted || isFulfilledByRequester) && (
            <Button
              id="top-open-conversation-btn"
              variant={isFulfilledByRequester ? 'outline' : 'primary'}
              size="md"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => onOpenConversation(request.requestId, 'donor')}
            >
              {isFulfilledByRequester ? 'View Conversation History' : 'Open Conversation →'}
            </Button>
          )}

          <ReportMenuButton
            id="donation-request-report-btn"
            label={isAccepted || isFulfilledByRequester ? 'Report an Issue' : 'Report Request'}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        </div>
      </div>

      {/* Two-Column 65/35 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Request Details (65%) */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
                Request Details
              </span>
              <span className="text-xs text-[#746C68] font-medium">
                {request.requestId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68]">
                  Blood Type Requested
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-[#F7EAE7] text-[#A92F35] font-heading font-bold text-lg flex items-center justify-center border border-[#F0D5D1]">
                    {request.bloodType}
                  </span>
                  <div>
                    <span className="text-base font-bold text-[#292525]">
                      {request.bloodType}
                    </span>
                    <span className="text-xs text-[#746C68] block">
                      Matches your listed type
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#A92F35]" />
                  Blood For
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {request.bloodFor}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#A92F35]" />
                  Healthcare Facility
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {request.healthcareFacility}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A92F35]" />
                  Location & Proximity
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {request.location}
                </p>
                <p className="text-xs text-[#746C68]">{request.proximity}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A92F35]" />
                  Needed Date
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {request.dateNeeded}
                </p>
              </div>

              {request.additionalNote && (
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#F0EAE5]">
                  <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#746C68]" />
                    Additional Note from Requester
                  </span>
                  <p className="text-xs sm:text-sm text-[#292525] bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DDD7] leading-relaxed">
                    {request.additionalNote}
                  </p>
                </div>
              )}

              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#F0EAE5]">
                <span className="text-xs font-medium text-[#958B86] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Received: {request.receivedTime}
                </span>
              </div>
            </div>

            {/* Bottom Actions (Only if NOT accepted yet and not declined/cancelled) */}
            {!isAccepted && !isFulfilledByRequester && request.status !== 'Declined' && (
              <div className="pt-6 border-t border-[#F0EAE5] flex items-center justify-between">
                <Button
                  id="decline-request-trigger-btn"
                  variant="outline"
                  size="md"
                  onClick={() => setIsDeclineModalOpen(true)}
                  className="text-red-700 border-red-200 hover:bg-red-50"
                >
                  Decline
                </Button>

                <Button
                  id="accept-request-trigger-btn"
                  variant="primary"
                  size="md"
                  onClick={() => setIsAcceptModalOpen(true)}
                >
                  Accept Request →
                </Button>
              </div>
            )}
          </Card>

          {/* C8. DONOR NOTIFICATION / STATUS UPDATE (Requester marked fulfilled, donor awaiting confirmation) */}
          {isAwaitingDonorConfirmation && (
            <Card
              id="donor-donation-confirmation-card"
              padding="lg"
              className="border-[#E6DDD7] bg-white space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A92F35]">
                  Request Update
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-[#292525]">
                  The requester marked this blood request as fulfilled.
                </h4>
                <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
                  Did you complete a blood donation for this request?
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  id="donor-did-not-donate-btn"
                  variant="outline"
                  size="md"
                  onClick={() => setIsDidNotDonateModalOpen(true)}
                >
                  No, I Didn’t Donate
                </Button>
                <Button
                  id="donor-yes-donated-btn"
                  variant="primary"
                  size="md"
                  onClick={() => setIsYesDonatedModalOpen(true)}
                >
                  Yes, I Donated
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT: Your Response (35%) */}
        <div className="lg:col-span-4 space-y-5">
          <Card padding="md" className="space-y-4">
            <div className="pb-3 border-b border-[#F0EAE5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
                Your Response
              </span>
            </div>

            {isDonationCompleted ? (
              <div className="p-4 bg-[#EDF4EE] border border-[#D5E5D8] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#557A61]">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <h4 className="text-sm font-bold">Donation Completed</h4>
                </div>
                <p className="text-xs text-[#405D4A] leading-relaxed">
                  Thank you! You confirmed completing a blood donation for this request.
                  {request.donationConfirmedAt ? ` (${request.donationConfirmedAt})` : ''}
                </p>
                <Button
                  id="card-view-conversation-btn"
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 border-[#D5E5D8] text-[#557A61] hover:bg-white"
                  onClick={() => onOpenConversation(request.requestId, 'donor')}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  View Conversation History
                </Button>
              </div>
            ) : isDidNotDonate ? (
              <div className="p-4 bg-[#FAF7F2] border border-[#E6DDD7] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#746C68]">
                  <AlertCircle className="w-5 h-5 text-[#958B86] flex-shrink-0" />
                  <h4 className="text-sm font-bold text-[#292525]">
                    Request Fulfilled — No donation recorded
                  </h4>
                </div>
                <p className="text-xs text-[#746C68] leading-relaxed">
                  The requester marked this request as fulfilled, and no completed
                  donation was recorded for your account.
                </p>
                <Button
                  id="card-view-conversation-btn"
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 border-[#E6DDD7] text-[#746C68] hover:bg-white"
                  onClick={() => onOpenConversation(request.requestId, 'donor')}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  View Conversation History
                </Button>
              </div>
            ) : isAccepted ? (
              <div className="p-4 bg-[#EDF4EE] border border-[#D5E5D8] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#557A61]">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <h4 className="text-sm font-bold">Request accepted</h4>
                </div>
                <p className="text-xs text-[#405D4A] leading-relaxed">
                  Next step: coordinate securely through BloodBuddy. Use the direct
                  chat to finalize arrival time at the healthcare facility.
                </p>
                <Button
                  id="card-open-conversation-btn"
                  variant="primary"
                  size="sm"
                  className="w-full mt-1 bg-[#557A61] hover:bg-[#45634F]"
                  onClick={() => onOpenConversation(request.requestId, 'donor')}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Open Conversation →
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#746C68]">Listed Blood Type:</span>
                  <span className="font-semibold text-[#292525]">
                    {currentUser.bloodType} — Self-reported
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#746C68]">Current Status:</span>
                  <StatusBadge
                    status={currentUser.availableToDonate ? 'Available to donate' : 'Unavailable'}
                    variant={currentUser.availableToDonate ? 'available' : 'declined'}
                    size="sm"
                  />
                </div>

                <p className="text-xs text-[#746C68] leading-relaxed pt-2 border-t border-[#F0EAE5]">
                  You received this request based on your listed blood type and
                  current donor availability.
                </p>
              </div>
            )}

            <div className="pt-2">
              <Notice type="clinical">
                Acceptance notifies the requester of your willingness to coordinate.
                Clinical suitability and blood compatibility will be verified directly
                by the healthcare facility staff.
              </Notice>
            </div>
          </Card>
        </div>
      </div>

      {/* ACCEPT CONFIRMATION MODAL */}
      <Modal
        id="accept-request-modal"
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        title="Accept this request?"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            You’re letting the requester know that you’re willing to coordinate
            about this blood request.
          </p>

          <Notice type="clinical" title="Important Confirmation Clarification">
            Acceptance indicates willingness to coordinate only. It does NOT confirm
            medical eligibility or final blood compatibility, which remain the
            sole responsibility of accredited hospital staff.
          </Notice>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsAcceptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="confirm-accept-request-btn"
              variant="primary"
              size="md"
              onClick={handleConfirmAccept}
            >
              Accept Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* DECLINE CONFIRMATION MODAL */}
      <Modal
        id="decline-request-modal"
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        title="Decline this request?"
        description="Please select an optional reason. Medical explanations are never requested."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {DECLINE_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedDeclineReason === reason
                    ? 'border-[#A92F35] bg-[#F7EAE7]/50'
                    : 'border-[#E6DDD7] hover:bg-[#FAF7F2]'
                }`}
              >
                <input
                  type="radio"
                  name="decline-reason"
                  checked={selectedDeclineReason === reason}
                  onChange={() => setSelectedDeclineReason(reason)}
                  className="text-[#A92F35] focus:ring-[#A92F35]"
                />
                <span className="text-xs sm:text-sm font-medium text-[#292525]">
                  {reason}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsDeclineModalOpen(false)}
            >
              Keep Request
            </Button>
            <Button
              id="confirm-decline-request-btn"
              variant="danger"
              size="md"
              onClick={handleConfirmDecline}
            >
              Decline Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* C9. DONOR CONFIRMATION FLOW (“YES, I DONATED”) */}
      <Modal
        id="donor-yes-donated-modal"
        isOpen={isYesDonatedModalOpen}
        onClose={() => !isConfirmingDonation && setIsYesDonatedModalOpen(false)}
        title="Confirm completed donation?"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            Confirm this only if you personally completed a blood donation related to this request.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] text-xs text-[#746C68] leading-relaxed">
            BloodBuddy records this as your confirmation. It does not independently verify the medical procedure or clinical outcome.
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              disabled={isConfirmingDonation}
              onClick={() => setIsYesDonatedModalOpen(false)}
            >
              Go Back
            </Button>
            <Button
              id="confirm-donor-donation-btn"
              variant="primary"
              size="md"
              disabled={isConfirmingDonation}
              isLoading={isConfirmingDonation}
              onClick={handleConfirmYesDonated}
            >
              {isConfirmingDonation ? 'Confirming…' : 'Confirm Donation'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* C11. DONOR DECLINE FLOW (“NO, I DIDN’T DONATE”) */}
      <Modal
        id="donor-did-not-donate-modal"
        isOpen={isDidNotDonateModalOpen}
        onClose={() => !isConfirmingDonation && setIsDidNotDonateModalOpen(false)}
        title="Confirm you didn’t donate?"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            The blood request will remain fulfilled, but this request will not be
            recorded as a completed donation for your account.
          </p>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              disabled={isConfirmingDonation}
              onClick={() => setIsDidNotDonateModalOpen(false)}
            >
              Go Back
            </Button>
            <Button
              id="confirm-did-not-donate-btn"
              variant="primary"
              size="md"
              disabled={isConfirmingDonation}
              isLoading={isConfirmingDonation}
              onClick={handleConfirmNoDidNotDonate}
            >
              {isConfirmingDonation ? 'Confirming…' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* REPORT ISSUE / REQUEST MODAL */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contextType={isAccepted || isFulfilledByRequester ? 'accepted_requester' : 'general_request'}
        requestId={request.requestId}
        reporterUserId={currentUser.email}
        reportedUserId={request.bloodFor === 'Myself' ? 'patient-requester' : 'family-requester'}
        onSubmitReport={(reportData) => {
          if (onCreateReport) {
            onCreateReport(reportData);
          }
        }}
        onSuccessToast={() => {
          setToast({
            id: 'report-submitted-toast',
            type: 'success',
            title: 'Report submitted',
            description: 'Thank you. BloodBuddy will review your report.',
          });
        }}
      />
    </div>
  );
};

