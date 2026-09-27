import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  FileText,
  User,
  Heart,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  History,
  CheckCircle2,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget } from '../../types';
import {
  RequestStatusBadge,
  DonorDonationBadge,
  ModerationBadge,
  IdentityBadge,
  AccountStatusBadge,
  ReportStatusBadge,
} from '../common/Badge';
import { RemoveRequestModal, RestoreRequestModal } from '../modals/ModerationModals';
import { useToast } from '../ui/ToastContext';

interface BloodRequestDetailsViewProps {
  requestId: string;
  onNavigate: (target: NavigationTarget) => void;
}

export const BloodRequestDetailsView: React.FC<BloodRequestDetailsViewProps> = ({
  requestId,
  onNavigate,
}) => {
  const { addToast } = useToast();
  const [, setTick] = useState(0);

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const request = dataService.getRequest(requestId);

  if (!request) {
    return (
      <div className="max-w-[800px] mx-auto p-8 text-center space-y-4">
        <h2 className="text-[24px] font-bold text-[#292525] font-serif">
          This blood request could not be found.
        </h2>
        <p className="text-[14px] text-[#746C68]">
          The request with identifier <code className="font-mono text-[#A92F35]">#{requestId}</code> does
          not exist or may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'requests' })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#A92F35] text-white text-[14px] font-medium rounded-lg hover:bg-[#8F272D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blood Requests</span>
        </button>
      </div>
    );
  }

  const requester = dataService.getUser(request.requesterUserId);
  const donor = request.selectedDonorUserId ? dataService.getUser(request.selectedDonorUserId) : undefined;
  const relatedReports = dataService.getReportsForRequest(request.id);
  const moderationEvents = dataService.getModerationEvents('request', request.id);

  const handleRemove = (reason: string, note?: string) => {
    const success = dataService.removeRequest(request.id, reason, note);
    if (success) {
      setTick((t) => t + 1);
      addToast('Request removed', 'The request has been removed from normal platform activity.', 'danger');
    }
  };

  const handleRestore = () => {
    const success = dataService.restoreRequest(request.id);
    if (success) {
      setTick((t) => t + 1);
      addToast('Request restored', 'The request has been restored to normal platform activity.', 'success');
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 lg:p-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'requests' })}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#746C68] hover:text-[#A92F35] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Blood Requests</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
              BLOOD REQUEST
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
                #{request.id}
              </h1>
              <span className="px-3 py-1 text-[13px] font-bold text-[#A92F35] bg-[#F7EAE7] rounded-md border border-[#A92F35]/20">
                {request.bloodTypeNeeded}
              </span>
              <RequestStatusBadge status={request.requestStatus} />
              {request.moderationStatus === 'removed' && (
                <ModerationBadge status={request.moderationStatus} />
              )}
            </div>
          </div>

          {/* Request Moderation Actions */}
          <div>
            {request.moderationStatus === 'active' ? (
              <button
                type="button"
                id="remove-request-action-btn"
                onClick={() => setIsRemoveModalOpen(true)}
                className="px-4 py-2 text-[14px] font-medium text-[#A92F35] bg-[#F7EAE7] hover:bg-[#A92F35] hover:text-white border border-[#A92F35]/30 rounded-lg transition-colors shadow-sm"
              >
                Remove Request
              </button>
            ) : (
              <button
                type="button"
                id="restore-request-action-btn"
                onClick={() => setIsRestoreModalOpen(true)}
                className="px-4 py-2 text-[14px] font-medium text-[#557A61] bg-[#EDF4EE] hover:bg-[#557A61] hover:text-white border border-[#557A61]/30 rounded-lg transition-colors shadow-sm"
              >
                Restore Request
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Request Information + Lifecycle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Request info & Users */}
        <div className="lg:col-span-2 space-y-6">
          {/* REQUEST INFORMATION */}
          <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-5">
            <h2 className="text-[17px] font-bold text-[#292525] border-b border-[#E6DDD7] pb-3">
              Request Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
                  Blood Type Needed
                </span>
                <span className="text-[16px] font-bold text-[#292525]">{request.bloodTypeNeeded}</span>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
                  Needed Date
                </span>
                <div className="flex items-center gap-1.5 text-[14px] text-[#292525] mt-0.5">
                  <Calendar className="w-4 h-4 text-[#746C68]" />
                  <span>{request.neededDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
                  Healthcare Facility
                </span>
                <div className="flex items-start gap-1.5 text-[14px] font-medium text-[#292525] mt-0.5">
                  <Building2 className="w-4 h-4 text-[#746C68] shrink-0 mt-0.5" />
                  <span>{request.healthcareFacility}</span>
                </div>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
                  General Location
                </span>
                <div className="flex items-center gap-1.5 text-[14px] text-[#292525] mt-0.5">
                  <MapPin className="w-4 h-4 text-[#746C68]" />
                  <span>{request.generalLocation}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block mb-1">
                Blood For
              </span>
              <p className="text-[14px] text-[#292525] bg-[#FAF7F2] p-3 rounded-lg border border-[#E6DDD7]">
                {request.bloodFor}
              </p>
            </div>

            {request.additionalNote && (
              <div>
                <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block mb-1">
                  Additional Note
                </span>
                <p className="text-[14px] text-[#746C68] bg-[#FAF7F2] p-3 rounded-lg border border-[#E6DDD7]">
                  {request.additionalNote}
                </p>
              </div>
            )}

            <div className="pt-2 text-[12.5px] text-[#958B86] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Created on {formatDateTime(request.createdAt)}</span>
            </div>
          </div>

          {/* REQUESTER & SELECTED DONOR CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Requester */}
            <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-5 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6DDD7] pb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#746C68]" />
                  <span className="text-[14px] font-bold text-[#292525]">Requester</span>
                </div>
                {requester && (
                  <button
                    type="button"
                    onClick={() => onNavigate({ view: 'user_details', userId: requester.id })}
                    className="text-[12.5px] font-semibold text-[#A92F35] hover:underline flex items-center gap-0.5"
                  >
                    <span>View Account</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {requester ? (
                <div className="space-y-2 text-[13.5px]">
                  <div>
                    <div className="font-semibold text-[#292525]">
                      {requester.firstName} {requester.lastName}
                    </div>
                    <div className="text-[12px] font-mono text-[#958B86]">{requester.id}</div>
                  </div>
                  <div>
                    <IdentityBadge status={requester.identityStatus} />
                  </div>
                  <div>
                    <AccountStatusBadge status={requester.accountStatus} />
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-[#958B86]">Requester record not found.</p>
              )}
            </div>

            {/* Selected Donor */}
            <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-5 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6DDD7] pb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#A92F35]" />
                  <span className="text-[14px] font-bold text-[#292525]">Selected Donor</span>
                </div>
                {donor && (
                  <button
                    type="button"
                    onClick={() => onNavigate({ view: 'user_details', userId: donor.id })}
                    className="text-[12.5px] font-semibold text-[#A92F35] hover:underline flex items-center gap-0.5"
                  >
                    <span>View Account</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {donor ? (
                <div className="space-y-2 text-[13.5px]">
                  <div>
                    <div className="font-semibold text-[#292525]">
                      {donor.firstName} {donor.lastName}
                    </div>
                    <div className="text-[12px] font-mono text-[#958B86]">{donor.id}</div>
                  </div>
                  <div className="text-[13px] text-[#746C68]">
                    Listed Blood Type: <strong>{donor.bloodType}</strong> (Self-reported)
                  </div>
                  <div>
                    <IdentityBadge status={donor.identityStatus} />
                  </div>
                  <div>
                    <AccountStatusBadge status={donor.accountStatus} />
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-[13px] text-[#958B86] italic">
                    No donor has been selected for this request yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Lifecycle Timeline & Moderation History */}
        <div className="space-y-6">
          {/* REQUEST LIFECYCLE */}
          <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
            <h2 className="text-[17px] font-bold text-[#292525] border-b border-[#E6DDD7] pb-3">
              Request Lifecycle
            </h2>

            <div className="space-y-4 relative pl-5 border-l-2 border-[#E6DDD7] ml-2">
              {/* Event 1: Request Created */}
              <div className="relative">
                <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#A92F35]" />
                <div className="text-[13.5px] font-semibold text-[#292525]">Request created</div>
                <div className="text-[12px] text-[#958B86]">{formatDateTime(request.createdAt)}</div>
              </div>

              {/* Event 2: Donor Accepted */}
              {request.acceptedAt && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#2E5E8A]" />
                  <div className="text-[13.5px] font-semibold text-[#292525]">Donor accepted</div>
                  <div className="text-[12px] text-[#958B86]">{formatDateTime(request.acceptedAt)}</div>
                </div>
              )}

              {/* Event 3: Coordination Started */}
              {request.coordinationStartedAt && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#8F5206]" />
                  <div className="text-[13.5px] font-semibold text-[#292525]">Coordination started</div>
                  <div className="text-[12px] text-[#958B86]">
                    {formatDateTime(request.coordinationStartedAt)}
                  </div>
                </div>
              )}

              {/* Event 4: Declined */}
              {request.declinedAt && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#746C68]" />
                  <div className="text-[13.5px] font-semibold text-[#292525]">Request declined</div>
                  <div className="text-[12px] text-[#958B86]">{formatDateTime(request.declinedAt)}</div>
                </div>
              )}

              {/* Event 5: Cancelled */}
              {request.cancelledAt && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#958B86]" />
                  <div className="text-[13.5px] font-semibold text-[#292525]">Request cancelled</div>
                  <div className="text-[12px] text-[#958B86]">{formatDateTime(request.cancelledAt)}</div>
                </div>
              )}

              {/* Event 6: Request Fulfilled */}
              {request.fulfilledAt && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#557A61]" />
                  <div className="text-[13.5px] font-semibold text-[#292525]">Request fulfilled</div>
                  <div className="text-[12px] text-[#958B86]">{formatDateTime(request.fulfilledAt)}</div>
                  <p className="text-[11.5px] text-[#746C68] mt-0.5">
                    Reported by requester as fulfilled.
                  </p>
                </div>
              )}

              {/* Event 7: Donor confirmed donation */}
              {request.donationConfirmedAt && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#557A61]" />
                  <div className="text-[13.5px] font-semibold text-[#292525]">
                    Donor confirmed donation
                  </div>
                  <div className="text-[12px] text-[#958B86]">
                    {formatDateTime(request.donationConfirmedAt)}
                  </div>
                  <p className="text-[11.5px] text-[#746C68] mt-0.5">
                    Donor self-confirmed personal completion.
                  </p>
                </div>
              )}
            </div>

            {/* Factual Disclaimer note */}
            <div className="mt-4 p-3 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#746C68] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#746C68] leading-relaxed">
                Administrators observe the self-reported coordination lifecycle. Transfusions and laboratory
                testing are performed solely by accredited healthcare centers.
              </p>
            </div>
          </div>

          {/* RELATED REPORTS */}
          <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-3">
            <h2 className="text-[16px] font-bold text-[#292525] flex items-center gap-2 border-b border-[#E6DDD7] pb-2">
              <AlertTriangle className="w-4 h-4 text-[#A92F35]" />
              <span>Related Reports ({relatedReports.length})</span>
            </h2>

            {relatedReports.length === 0 ? (
              <p className="text-[12.5px] text-[#958B86] italic">No reports are associated with this request.</p>
            ) : (
              <div className="space-y-2">
                {relatedReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E6DDD7] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#292525]">{rep.reason}</span>
                      <ReportStatusBadge status={rep.status} />
                    </div>
                    <div className="text-[11.5px] font-mono text-[#958B86]">#{rep.id}</div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate({ view: 'report_details', reportId: rep.id })}
                        className="text-[12px] font-semibold text-[#A92F35] hover:underline"
                      >
                        Review Report →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MODERATION HISTORY */}
          <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-3">
            <h2 className="text-[16px] font-bold text-[#292525] flex items-center gap-2 border-b border-[#E6DDD7] pb-2">
              <History className="w-4 h-4 text-[#746C68]" />
              <span>Moderation History</span>
            </h2>

            {moderationEvents.length === 0 ? (
              <p className="text-[12.5px] text-[#958B86] italic">
                No moderation actions recorded for this request.
              </p>
            ) : (
              <div className="space-y-2.5">
                {moderationEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-lg border border-[#E6DDD7] bg-[#FAF7F2]/50 text-[12.5px]"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#292525]">
                      <span className="capitalize text-[#A92F35]">{evt.action.replace('_', ' ')}</span>
                      <span className="text-[11.5px] font-normal text-[#958B86]">
                        {formatDateTime(evt.createdAt)}
                      </span>
                    </div>
                    {evt.reason && <p className="text-[#746C68] mt-1">Reason: {evt.reason}</p>}
                    {evt.note && <p className="text-[#746C68] mt-0.5">Note: {evt.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RemoveRequestModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        requestId={request.id}
        onConfirm={handleRemove}
      />

      <RestoreRequestModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        requestId={request.id}
        onConfirm={handleRestore}
      />
    </div>
  );
};
