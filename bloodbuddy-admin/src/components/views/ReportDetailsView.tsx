import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  User,
  Droplets,
  Clock,
  ArrowRight,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  History,
  ShieldAlert,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget } from '../../types';
import {
  ReportStatusBadge,
  IdentityBadge,
  AccountStatusBadge,
  RequestStatusBadge,
  ModerationBadge,
} from '../common/Badge';
import {
  ResolveReportModal,
  DismissReportModal,
  RestrictAccountModal,
  RemoveRequestModal,
} from '../modals/ModerationModals';
import { useToast } from '../ui/ToastContext';

interface ReportDetailsViewProps {
  reportId: string;
  onNavigate: (target: NavigationTarget) => void;
}

export const ReportDetailsView: React.FC<ReportDetailsViewProps> = ({ reportId, onNavigate }) => {
  const { addToast } = useToast();
  const [, setTick] = useState(0);

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
  const [isRemoveRequestModalOpen, setIsRemoveRequestModalOpen] = useState(false);

  const report = dataService.getReport(reportId);

  if (!report) {
    return (
      <div className="max-w-[800px] mx-auto p-8 text-center space-y-4">
        <h2 className="text-[24px] font-bold text-[#292525] font-serif">
          This report could not be found.
        </h2>
        <p className="text-[14px] text-[#746C68]">
          The report with identifier <code className="font-mono text-[#A92F35]">#{reportId}</code> does
          not exist or may have been removed.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'reports' })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#A92F35] text-white text-[14px] font-medium rounded-lg hover:bg-[#8F272D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>
      </div>
    );
  }

  const reporter = dataService.getUser(report.reporterUserId);
  const reportedUser = report.reportedUserId ? dataService.getUser(report.reportedUserId) : undefined;
  const relatedRequest = report.requestId ? dataService.getRequest(report.requestId) : undefined;
  const moderationEvents = dataService.getModerationEvents('report', report.id);

  const handleStartReview = () => {
    const success = dataService.startReportReview(report.id);
    if (success) {
      setTick((t) => t + 1);
      addToast('Report under review', 'This report is now being reviewed.', 'info');
    }
  };

  const handleResolve = (adminNote?: string) => {
    const success = dataService.resolveReport(report.id, adminNote);
    if (success) {
      setTick((t) => t + 1);
      addToast('Report resolved', 'The report has been marked as resolved.', 'success');
    }
  };

  const handleDismiss = (adminNote?: string) => {
    const success = dataService.dismissReport(report.id, adminNote);
    if (success) {
      setTick((t) => t + 1);
      addToast('Report dismissed', 'The report has been dismissed.', 'info');
    }
  };

  const handleRestrictReportedUser = (reason: string, note?: string) => {
    if (!reportedUser) return;
    const success = dataService.restrictUser(reportedUser.id, reason, note);
    if (success) {
      setTick((t) => t + 1);
      addToast('Account restricted', 'The account has been restricted.', 'danger');
    }
  };

  const handleRemoveRelatedRequest = (reason: string, note?: string) => {
    if (!relatedRequest) return;
    const success = dataService.removeRequest(relatedRequest.id, reason, note);
    if (success) {
      setTick((t) => t + 1);
      addToast('Request removed', 'The request has been removed from normal platform activity.', 'danger');
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
          onClick={() => onNavigate({ view: 'reports' })}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#746C68] hover:text-[#A92F35] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Reports</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
              MODERATION REPORT
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
                #{report.id}
              </h1>
              <ReportStatusBadge status={report.status} />
            </div>
          </div>

          {/* Workflow Action Buttons */}
          <div className="flex items-center gap-3">
            {report.status === 'open' && (
              <>
                <button
                  type="button"
                  id="start-review-report-btn"
                  onClick={handleStartReview}
                  className="px-4 py-2 text-[14px] font-medium text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg transition-colors shadow-sm"
                >
                  Start Review
                </button>
                <button
                  type="button"
                  id="dismiss-open-report-btn"
                  onClick={() => setIsDismissModalOpen(true)}
                  className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-white border border-[#E6DDD7] rounded-lg hover:bg-[#FAF7F2] transition-colors"
                >
                  Dismiss Report
                </button>
              </>
            )}

            {report.status === 'under_review' && (
              <>
                <button
                  type="button"
                  id="resolve-report-btn"
                  onClick={() => setIsResolveModalOpen(true)}
                  className="px-4 py-2 text-[14px] font-medium text-white bg-[#557A61] hover:bg-[#466550] rounded-lg transition-colors shadow-sm"
                >
                  Resolve Report
                </button>
                <button
                  type="button"
                  id="dismiss-under-review-report-btn"
                  onClick={() => setIsDismissModalOpen(true)}
                  className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-white border border-[#E6DDD7] rounded-lg hover:bg-[#FAF7F2] transition-colors"
                >
                  Dismiss Report
                </button>
              </>
            )}

            {(report.status === 'resolved' || report.status === 'dismissed') && (
              <span className="text-[13px] text-[#746C68] bg-[#FAF7F2] border border-[#E6DDD7] px-3 py-1.5 rounded-lg">
                Report closed on {formatDateTime(report.resolvedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Report Details, Subject, and Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* REPORT INFORMATION */}
          <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
            <h2 className="text-[17px] font-bold text-[#292525] border-b border-[#E6DDD7] pb-3">
              Report Details
            </h2>

            <div>
              <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block">
                Reported Reason
              </span>
              <span className="text-[18px] font-bold text-[#292525] mt-0.5 block">{report.reason}</span>
            </div>

            <div>
              <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block mb-1">
                Description / Context Provided by Reporter
              </span>
              <p className="text-[14px] text-[#292525] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DDD7] leading-relaxed whitespace-pre-line">
                {report.details}
              </p>
            </div>

            {report.adminNote && (
              <div>
                <span className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider block mb-1">
                  Administrative Resolution Note
                </span>
                <p className="text-[14px] text-[#746C68] bg-[#FAF7F2] p-3 rounded-lg border border-[#E6DDD7]">
                  {report.adminNote}
                </p>
              </div>
            )}

            <div className="text-[12.5px] text-[#958B86] flex items-center gap-1.5 pt-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Filed on {formatDateTime(report.createdAt)}</span>
            </div>
          </div>

          {/* REPORTED SUBJECT & RELATED ENTITY */}
          {relatedRequest && (
            <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6DDD7] pb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#A92F35]" />
                  <h2 className="text-[16px] font-bold text-[#292525]">Related Blood Request</h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'request_details', requestId: relatedRequest.id })}
                  className="text-[13px] font-semibold text-[#A92F35] hover:underline flex items-center gap-1"
                >
                  <span>View Request Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13.5px]">
                <div>
                  <span className="text-[11.5px] font-semibold text-[#958B86] uppercase block">
                    Request ID
                  </span>
                  <span className="font-mono font-bold text-[#292525]">#{relatedRequest.id}</span>
                </div>
                <div>
                  <span className="text-[11.5px] font-semibold text-[#958B86] uppercase block">
                    Blood Type Needed
                  </span>
                  <span className="font-semibold text-[#A92F35]">{relatedRequest.bloodTypeNeeded}</span>
                </div>
                <div>
                  <span className="text-[11.5px] font-semibold text-[#958B86] uppercase block">
                    Request Status
                  </span>
                  <div className="mt-0.5">
                    <RequestStatusBadge status={relatedRequest.requestStatus} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[11.5px] font-semibold text-[#958B86] uppercase block">
                    Healthcare Facility
                  </span>
                  <span className="text-[#292525]">{relatedRequest.healthcareFacility}</span>
                </div>
                <div>
                  <span className="text-[11.5px] font-semibold text-[#958B86] uppercase block">
                    Listing Status
                  </span>
                  <div className="mt-0.5">
                    <ModerationBadge status={relatedRequest.moderationStatus} />
                  </div>
                </div>
              </div>

              {/* Quick Action on Related Request */}
              {relatedRequest.moderationStatus === 'active' && (
                <div className="pt-3 border-t border-[#E6DDD7] flex items-center justify-between">
                  <span className="text-[12.5px] text-[#746C68]">
                    Inappropriate or misleading listing?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRemoveRequestModalOpen(true)}
                    className="px-3 py-1.5 text-[12.5px] font-medium text-[#A92F35] bg-[#F7EAE7] hover:bg-[#A92F35] hover:text-white rounded-md border border-[#A92F35]/20 transition-colors"
                  >
                    Remove Request
                  </button>
                </div>
              )}
            </div>
          )}

          {reportedUser && (
            <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6DDD7] pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#746C68]" />
                  <h2 className="text-[16px] font-bold text-[#292525]">Reported Account</h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'user_details', userId: reportedUser.id })}
                  className="text-[13px] font-semibold text-[#A92F35] hover:underline flex items-center gap-1"
                >
                  <span>View User Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-[#292525] text-[15px]">
                    {reportedUser.firstName} {reportedUser.lastName}
                  </div>
                  <div className="text-[12.5px] font-mono text-[#958B86]">{reportedUser.id}</div>
                  <div className="text-[13px] text-[#746C68] mt-0.5">{reportedUser.email}</div>
                </div>

                <div className="space-y-2 text-right sm:text-left">
                  <IdentityBadge status={reportedUser.identityStatus} />
                  <div>
                    <AccountStatusBadge status={reportedUser.accountStatus} />
                  </div>
                </div>
              </div>

              {/* Quick Action to Restrict */}
              {reportedUser.accountStatus === 'active' && (
                <div className="pt-3 border-t border-[#E6DDD7] flex items-center justify-between">
                  <span className="text-[12.5px] text-[#746C68]">
                    Repeated misconduct or safety violation?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRestrictModalOpen(true)}
                    className="px-3 py-1.5 text-[12.5px] font-medium text-[#A92F35] bg-[#F7EAE7] hover:bg-[#A92F35] hover:text-white rounded-md border border-[#A92F35]/20 transition-colors"
                  >
                    Restrict Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Reporter and Moderation History */}
        <div className="space-y-6">
          {/* REPORTER INFORMATION */}
          <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6DDD7] pb-2">
              <span className="text-[15px] font-bold text-[#292525]">Reporter</span>
              {reporter && (
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'user_details', userId: reporter.id })}
                  className="text-[12.5px] font-semibold text-[#A92F35] hover:underline flex items-center gap-0.5"
                >
                  <span>View Account</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {reporter ? (
              <div className="space-y-2 text-[13.5px]">
                <div>
                  <div className="font-semibold text-[#292525]">
                    {reporter.firstName} {reporter.lastName}
                  </div>
                  <div className="text-[12px] font-mono text-[#958B86]">{reporter.id}</div>
                  <div className="text-[12.5px] text-[#746C68]">{reporter.email}</div>
                </div>
                <div>
                  <IdentityBadge status={reporter.identityStatus} />
                </div>
                <div>
                  <AccountStatusBadge status={reporter.accountStatus} />
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#958B86]">Reporter information not found.</p>
            )}
          </div>

          {/* MODERATION HISTORY FOR REPORT */}
          <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-3">
            <h2 className="text-[15px] font-bold text-[#292525] flex items-center gap-2 border-b border-[#E6DDD7] pb-2">
              <History className="w-4 h-4 text-[#746C68]" />
              <span>Moderation Activity</span>
            </h2>

            {moderationEvents.length === 0 ? (
              <p className="text-[12.5px] text-[#958B86] italic">No prior actions logged on this report.</p>
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
      <ResolveReportModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        reportId={report.id}
        onConfirm={handleResolve}
      />

      <DismissReportModal
        isOpen={isDismissModalOpen}
        onClose={() => setIsDismissModalOpen(false)}
        reportId={report.id}
        onConfirm={handleDismiss}
      />

      {reportedUser && (
        <RestrictAccountModal
          isOpen={isRestrictModalOpen}
          onClose={() => setIsRestrictModalOpen(false)}
          userName={`${reportedUser.firstName} ${reportedUser.lastName}`}
          onConfirm={handleRestrictReportedUser}
        />
      )}

      {relatedRequest && (
        <RemoveRequestModal
          isOpen={isRemoveRequestModalOpen}
          onClose={() => setIsRemoveRequestModalOpen(false)}
          requestId={relatedRequest.id}
          onConfirm={handleRemoveRelatedRequest}
        />
      )}
    </div>
  );
};
