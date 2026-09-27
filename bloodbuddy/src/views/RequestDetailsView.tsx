import React, { useState } from 'react';
import { ArrowLeft, MapPin, Building2, Calendar, User, FileText, MessageSquare, Search, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import { BloodRequest, RequesterStatus, UserProfile, Report } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Notice } from '../components/common/Notice';
import { Modal } from '../components/common/Modal';
import { Toast, ToastMessage } from '../components/common/Toast';
import { ReportMenuButton } from '../components/common/ReportMenuButton';
import { ReportModal } from '../components/common/ReportModal';

interface RequestDetailsViewProps {
  request: BloodRequest;
  currentUser?: UserProfile;
  onBack: () => void;
  onOpenConversation: (requestId: string, role?: 'requester' | 'donor') => void;
  onFindAnotherDonor: (bloodType: string, location: string) => void;
  onStatusChange: (requestId: string, newStatus: RequesterStatus) => void;
  onMarkRequestFulfilled: (requestId: string) => void;
  onCreateReport?: (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
}

export const RequestDetailsView: React.FC<RequestDetailsViewProps> = ({
  request,
  currentUser,
  onBack,
  onOpenConversation,
  onFindAnotherDonor,
  onStatusChange,
  onMarkRequestFulfilled,
  onCreateReport,
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const isAccepted = request.status === 'Donor accepted';
  const isFulfilled = request.status === 'Request Fulfilled' || request.status === 'Completed';

  const handleCancelRequest = () => {
    onStatusChange(request.id, 'Cancelled');
    setIsCancelModalOpen(false);
  };

  const handleConfirmFulfill = () => {
    setIsFulfilling(true);
    setTimeout(() => {
      onMarkRequestFulfilled(request.id);
      setIsFulfilling(false);
      setIsFulfillModalOpen(false);
      setToast({
        id: 'fulfill-toast',
        type: 'success',
        title: 'Request marked as fulfilled',
        description: 'This blood request has been closed successfully.',
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
          id="back-to-my-requests-btn"
          onClick={onBack}
          className="hover:text-[#292525] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Blood Requests</span>
        </button>
        <span>/</span>
        <span className="text-[#A92F35] font-semibold">Request Details</span>
      </div>

      {/* Header title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292525]">
              Request {request.id}
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-xs sm:text-sm text-[#746C68] mt-1">
            Submitted {request.createdAt} for {request.healthcareFacility}
          </p>
        </div>

        {/* Primary contextual actions based on Status */}
        <div className="flex items-center gap-3">
          {isAccepted && (
            <Button
              id="open-conversation-btn"
              variant="primary"
              size="md"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => onOpenConversation(request.id, 'requester')}
            >
              Open Conversation →
            </Button>
          )}

          {isFulfilled && (
            <Button
              id="view-conversation-history-btn"
              variant="outline"
              size="md"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => onOpenConversation(request.id, 'requester')}
            >
              View Conversation History
            </Button>
          )}

          {request.status === 'Donor declined' && (
            <Button
              id="find-another-donor-btn"
              variant="primary"
              size="md"
              leftIcon={<Search className="w-4 h-4" />}
              onClick={() => onFindAnotherDonor(request.bloodType, request.location)}
            >
              Find Another Donor →
            </Button>
          )}

          {request.status === 'Awaiting donor response' && (
            <Button
              id="cancel-request-trigger-btn"
              variant="outline"
              size="md"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-[#8F272D] border-red-200 hover:bg-red-50"
            >
              Cancel Request
            </Button>
          )}

          {/* Secondary safety/moderation report menu */}
          <ReportMenuButton
            id="request-details-report-btn"
            label={isAccepted ? 'Report an Issue' : 'Report Request'}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        </div>
      </div>

      {/* Status banner notice */}
      {isAccepted && (
        <div className="mb-6">
          <Notice type="info" title="Donor Accepted Request">
            The volunteer donor has accepted to coordinate for this blood request!
            Click <strong>Open Conversation</strong> to discuss facility arrival
            times and coordinate safely inside BloodBuddy.
          </Notice>
        </div>
      )}

      {isFulfilled && (
        <div className="mb-6 space-y-3">
          <Notice type="info" title="Request Fulfilled">
            This blood request has been marked as fulfilled
            {request.requestFulfilledAt ? ` on ${request.requestFulfilledAt}` : ''}.
            The request is now closed.
          </Notice>

          {request.donorDonationStatus === 'completed' && (
            <div className="p-3.5 bg-[#EDF4EE] border border-[#D5E5D8] rounded-xl text-xs text-[#355740] flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-[#557A61] flex-shrink-0" />
              <span>Volunteer donor confirmed completing a blood donation for this request.</span>
            </div>
          )}

          {request.donorDonationStatus === 'did_not_donate' && (
            <div className="p-3.5 bg-[#FAF7F2] border border-[#E6DDD7] rounded-xl text-xs text-[#746C68] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#958B86] flex-shrink-0" />
              <span>Volunteer donor confirmed no donation was recorded for their account.</span>
            </div>
          )}
        </div>
      )}

      {request.status === 'Donor declined' && (
        <div className="mb-6">
          <div className="rounded-[14px] p-4 bg-[#FFF9EE] border border-[#F3E2B8] text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#8C6418] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-[#8C6418]">Donor Declined</h4>
              <p className="text-[#6B5325]">
                The potential donor was unable to fulfill this request. You can
                immediately find another matching donor in your area. BloodBuddy
                does not automatically reassign donors without your confirmation.
              </p>
              <div className="pt-2">
                <Button
                  id="banner-find-another-donor-btn"
                  variant="primary"
                  size="sm"
                  onClick={() => onFindAnotherDonor(request.bloodType, request.location)}
                >
                  Find Another Donor →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column 65/35 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Request Summary (65%) */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
                Request Summary
              </span>
              <span className="text-xs text-[#958B86]">
                Created: {request.createdAt}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#A92F35]" />
                  Blood For
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {request.bloodFor}
                  {request.recipientName ? ` (${request.recipientName})` : ''}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#746C68]">
                  Blood Type Needed
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#F7EAE7] text-[#A92F35] font-bold text-sm flex items-center justify-center border border-[#F0D5D1]">
                    {request.bloodType}
                  </span>
                  <span className="text-sm font-semibold text-[#292525]">
                    {request.bloodType}
                  </span>
                </div>
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
                  City / Location
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {request.location}
                </p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A92F35]" />
                  Date Needed
                </span>
                <p className="text-sm font-semibold text-[#292525]">
                  {request.dateNeeded}
                </p>
              </div>

              {request.additionalNote && (
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#F0EAE5]">
                  <span className="text-xs font-medium text-[#746C68] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#746C68]" />
                    Additional Note
                  </span>
                  <p className="text-xs sm:text-sm text-[#292525] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DDD7] leading-relaxed">
                    {request.additionalNote}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom button actions */}
            <div className="pt-6 border-t border-[#F0EAE5] flex items-center justify-between">
              <Button variant="outline" size="md" onClick={onBack}>
                Back to My Blood Requests
              </Button>

              {request.status === 'Awaiting donor response' && (
                <Button
                  id="details-cancel-request-btn"
                  variant="danger"
                  size="md"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel Request
                </Button>
              )}
            </div>
          </Card>

          {/* C3. REQUESTER COMPLETION UI: On accepted / in-coordination request */}
          {isAccepted && (
            <Card padding="lg" className="border-[#E6DDD7] bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
                  Request Status
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-[#292525]">
                  Was this blood request fulfilled?
                </h4>
                <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
                  If the needed blood has been received and this request no longer needs
                  to remain active, you can mark it as fulfilled.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  id="mark-request-fulfilled-btn"
                  variant="primary"
                  size="md"
                  onClick={() => setIsFulfillModalOpen(true)}
                >
                  Mark Request as Fulfilled
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT: Selected Donor (35%) */}
        <div className="lg:col-span-4 space-y-5">
          <Card padding="md" className="space-y-4">
            <div className="pb-3 border-b border-[#F0EAE5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
                Potential Donor
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-11 h-11 rounded-xl bg-[#F7EAE7] text-[#A92F35] font-heading font-bold text-xl flex items-center justify-center border border-[#F0D5D1]">
                    {request.donorSnapshot.bloodType}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-[#292525] block">
                      Volunteer Donor
                    </span>
                    <span className="text-[11px] text-[#746C68]">
                      Self-reported {request.donorSnapshot.bloodType}
                    </span>
                  </div>
                </div>

                <StatusBadge status="Available to Donate" variant="available" size="sm" />
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-[#746C68]">
                <div className="flex items-center gap-1.5 text-[#292525] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#A92F35] flex-shrink-0" />
                  <span>{request.donorSnapshot.generalLocation}</span>
                </div>
                <p className="pl-5 text-[#746C68]">{request.donorSnapshot.proximity}</p>
              </div>
            </div>

            <div className="pt-2">
              <Notice type="clinical">
                BloodBuddy does not certify donor medical fitness. The hospital will
                conduct clinical health screening and compatibility tests prior to
                transfusion.
              </Notice>
            </div>
          </Card>
        </div>
      </div>

      {/* C4. REQUESTER CONFIRMATION MODAL */}
      <Modal
        id="fulfill-request-modal"
        isOpen={isFulfillModalOpen}
        onClose={() => !isFulfilling && setIsFulfillModalOpen(false)}
        title="Was this request fulfilled?"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            Mark this request as fulfilled only if the needed blood was received
            and this request no longer needs to remain active.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] text-xs text-[#746C68] leading-relaxed">
            This closes the blood request. It does not by itself confirm that the
            selected donor personally completed a donation.
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              disabled={isFulfilling}
              onClick={() => setIsFulfillModalOpen(false)}
            >
              Keep Request Open
            </Button>
            <Button
              id="confirm-fulfill-request-btn"
              variant="primary"
              size="md"
              disabled={isFulfilling}
              isLoading={isFulfilling}
              onClick={handleConfirmFulfill}
            >
              {isFulfilling ? 'Marking as fulfilled…' : 'Mark as Fulfilled'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* CANCEL REQUEST CONFIRMATION MODAL */}
      <Modal
        id="cancel-request-modal"
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel this blood request?"
        description="Cancelling will withdraw this request and notify the prospective donor that blood is no longer required."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Request
            </Button>
            <Button
              id="confirm-cancel-request-btn"
              variant="danger"
              size="md"
              onClick={handleCancelRequest}
            >
              Yes, Cancel Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* REPORT ISSUE / REQUEST MODAL */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contextType={isAccepted ? 'accepted_donor' : 'general_request'}
        requestId={request.id}
        reporterUserId={currentUser?.email || 'requester-account'}
        reportedUserId={request.donorId || (isAccepted ? 'donor-account' : undefined)}
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

