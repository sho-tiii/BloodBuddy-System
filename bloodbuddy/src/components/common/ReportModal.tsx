import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FormField } from './FormField';
import { ReportType, ReportReason, Report } from '../../types';

export type ReportContextType = 'accepted_donor' | 'accepted_requester' | 'general_request';

export interface ReportReasonOption {
  label: string;
  type: ReportType;
  reason: ReportReason;
}

const ACCEPTED_DONOR_OPTIONS: ReportReasonOption[] = [
  { label: 'Donor did not show up', type: 'no_show', reason: 'donor_no_show' },
  { label: 'Inappropriate behavior', type: 'inappropriate_behavior', reason: 'inappropriate_behavior' },
  { label: 'Suspicious activity', type: 'suspicious', reason: 'suspicious_activity' },
  { label: 'Spam or misleading information', type: 'spam', reason: 'spam_misleading' },
  { label: 'Privacy concern', type: 'privacy', reason: 'privacy_concern' },
  { label: 'Other', type: 'other', reason: 'other' },
];

const ACCEPTED_REQUESTER_OPTIONS: ReportReasonOption[] = [
  { label: 'Requester did not show up', type: 'no_show', reason: 'requester_no_show' },
  { label: 'Inappropriate behavior', type: 'inappropriate_behavior', reason: 'inappropriate_behavior' },
  { label: 'Suspicious request', type: 'suspicious', reason: 'suspicious_request' },
  { label: 'Spam or misleading information', type: 'spam', reason: 'spam_misleading' },
  { label: 'Privacy concern', type: 'privacy', reason: 'privacy_concern' },
  { label: 'Other', type: 'other', reason: 'other' },
];

const GENERAL_REQUEST_OPTIONS: ReportReasonOption[] = [
  { label: 'Suspicious request', type: 'suspicious', reason: 'suspicious_request' },
  { label: 'Spam or misleading information', type: 'spam', reason: 'spam_misleading' },
  { label: 'Inappropriate content or behavior', type: 'inappropriate_behavior', reason: 'inappropriate_behavior' },
  { label: 'Privacy concern', type: 'privacy', reason: 'privacy_concern' },
  { label: 'Other', type: 'other', reason: 'other' },
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextType: ReportContextType;
  requestId?: string;
  conversationId?: string;
  reporterUserId: string;
  reportedUserId?: string;
  onSubmitReport: (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  onSuccessToast: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  contextType,
  requestId,
  conversationId,
  reporterUserId,
  reportedUserId,
  onSubmitReport,
  onSuccessToast,
}) => {
  const options =
    contextType === 'accepted_donor'
      ? ACCEPTED_DONOR_OPTIONS
      : contextType === 'accepted_requester'
      ? ACCEPTED_REQUESTER_OPTIONS
      : GENERAL_REQUEST_OPTIONS;

  const [selectedOption, setSelectedOption] = useState<ReportReasonOption>(options[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state whenever modal opens or context changes
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(options[0]);
      setDetails('');
      setIsSubmitting(false);
    }
  }, [isOpen, contextType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitReport({
        reporterUserId,
        reportedUserId,
        requestId,
        conversationId,
        type: selectedOption.type,
        reason: selectedOption.reason,
        reasonLabel: selectedOption.label,
        details: details.trim() || undefined,
      });

      setIsSubmitting(false);
      onClose();
      onSuccessToast();
    }, 350);
  };

  return (
    <Modal
      id="report-issue-modal"
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title="Report an issue"
      description="Tell us what happened. Reports help BloodBuddy review potential safety or community issues."
      maxWidth="md"
      preventClose={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Context metadata indication */}
        {requestId && (
          <div className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DDD7] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#746C68]">Related Request:</span>
            <span className="font-semibold text-[#292525]">{requestId}</span>
          </div>
        )}

        {/* Reason Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#292525] block">
            Reason
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {options.map((option) => {
              const isSelected = selectedOption.reason === option.reason;
              return (
                <label
                  key={option.reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-[#A92F35] bg-[#F7EAE7]/50'
                      : 'border-[#E6DDD7] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    checked={isSelected}
                    onChange={() => setSelectedOption(option)}
                    disabled={isSubmitting}
                    className="text-[#A92F35] focus:ring-[#A92F35]"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#292525]">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Additional Details (Optional) */}
        <FormField
          label="Additional details (optional)"
          htmlFor="report-details"
          hint={`${details.length}/500`}
        >
          <textarea
            id="report-details"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Share details to help BloodBuddy review this report..."
            className="w-full p-3 bg-white border border-[#E6DDD7] rounded-xl text-xs sm:text-sm text-[#292525] focus:outline-none focus:border-[#A92F35] resize-none leading-relaxed placeholder:text-[#958B86]"
          />
          <p className="text-[11px] text-[#746C68] leading-relaxed mt-1">
            Share only the information needed to help us understand the issue.
            Avoid including sensitive medical or financial information.
          </p>
        </FormField>

        {/* Action buttons */}
        <div className="pt-2 border-t border-[#F0EAE5] flex items-center justify-end gap-3">
          <Button
            id="cancel-report-btn"
            type="button"
            variant="outline"
            size="md"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            id="submit-report-btn"
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
