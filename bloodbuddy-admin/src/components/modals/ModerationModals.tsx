import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { AlertCircle } from 'lucide-react';

interface RestrictAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onConfirm: (reason: string, note?: string) => void;
}

export const RestrictAccountModal: React.FC<RestrictAccountModalProps> = ({
  isOpen,
  onClose,
  userName,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Select a reason before continuing.');
      return;
    }
    onConfirm(reason, note.trim() || undefined);
    setReason('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restrict this account?" id="restrict-account-modal">
      <form onSubmit={handleSubmit} noValidate>
        <p className="text-[14px] text-[#746C68] leading-relaxed mb-5">
          This will restrict <strong className="text-[#292525] font-semibold">{userName}</strong> from
          normal BloodBuddy activity. Existing request and moderation history will remain available to
          administrators.
        </p>

        <div className="mb-4">
          <label htmlFor="restrict-reason" className="block text-[13px] font-semibold text-[#292525] mb-1.5">
            Reason for restriction <span className="text-[#A92F35]">*</span>
          </label>
          <select
            id="restrict-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'restrict-reason-error' : undefined}
            className={`w-full px-3 py-2.5 bg-white border ${
              error ? 'border-[#A92F35] ring-1 ring-[#A92F35]' : 'border-[#E6DDD7]'
            } rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]`}
          >
            <option value="">Select a reason...</option>
            <option value="Repeated inappropriate behavior">Repeated inappropriate behavior</option>
            <option value="Spam or misleading activity">Spam or misleading activity</option>
            <option value="Privacy or safety concern">Privacy or safety concern</option>
            <option value="Repeated no-show reports requiring moderation action">
              Repeated no-show reports requiring moderation action
            </option>
            <option value="Other">Other</option>
          </select>
          {error && (
            <p id="restrict-reason-error" className="flex items-center gap-1.5 text-[13px] text-[#A92F35] mt-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="restrict-note" className="block text-[13px] font-semibold text-[#292525] mb-1.5">
            Admin note <span className="text-[12px] font-normal text-[#958B86]">(Optional)</span>
          </label>
          <textarea
            id="restrict-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add relevant administrative context or reference numbers..."
            className="w-full px-3 py-2 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35] placeholder:text-[#958B86]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DDD7]">
          <button
            type="button"
            id="cancel-restrict-btn"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-transparent hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="confirm-restrict-btn"
            className="px-4 py-2 text-[14px] font-medium text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg transition-colors shadow-sm"
          >
            Restrict Account
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface ReactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onConfirm: () => void;
}

export const ReactivateAccountModal: React.FC<ReactivateAccountModalProps> = ({
  isOpen,
  onClose,
  userName,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reactivate this account?" id="reactivate-account-modal">
      <div>
        <p className="text-[14px] text-[#746C68] leading-relaxed mb-6">
          This restores normal BloodBuddy platform access for{' '}
          <strong className="text-[#292525] font-semibold">{userName}</strong>. Existing moderation history
          will remain recorded.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DDD7]">
          <button
            type="button"
            id="cancel-reactivate-btn"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-transparent hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-reactivate-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-[14px] font-medium text-white bg-[#557A61] hover:bg-[#466550] rounded-lg transition-colors shadow-sm"
          >
            Reactivate Account
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface RemoveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onConfirm: (reason: string, note?: string) => void;
}

export const RemoveRequestModal: React.FC<RemoveRequestModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Select a reason before continuing.');
      return;
    }
    onConfirm(reason, note.trim() || undefined);
    setReason('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove this request?" id="remove-request-modal">
      <form onSubmit={handleSubmit} noValidate>
        <p className="text-[14px] text-[#746C68] leading-relaxed mb-5">
          This will remove request <strong className="text-[#292525] font-semibold">#{requestId}</strong> from
          normal BloodBuddy activity while preserving its request and moderation history.
        </p>

        <div className="mb-4">
          <label htmlFor="remove-reason" className="block text-[13px] font-semibold text-[#292525] mb-1.5">
            Required reason <span className="text-[#A92F35]">*</span>
          </label>
          <select
            id="remove-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'remove-reason-error' : undefined}
            className={`w-full px-3 py-2.5 bg-white border ${
              error ? 'border-[#A92F35] ring-1 ring-[#A92F35]' : 'border-[#E6DDD7]'
            } rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35]`}
          >
            <option value="">Select a reason...</option>
            <option value="Spam or misleading request">Spam or misleading request</option>
            <option value="Inappropriate content">Inappropriate content</option>
            <option value="Privacy concern">Privacy concern</option>
            <option value="Safety concern">Safety concern</option>
            <option value="Other">Other</option>
          </select>
          {error && (
            <p id="remove-reason-error" className="flex items-center gap-1.5 text-[13px] text-[#A92F35] mt-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="remove-note" className="block text-[13px] font-semibold text-[#292525] mb-1.5">
            Admin note <span className="text-[12px] font-normal text-[#958B86]">(Optional)</span>
          </label>
          <textarea
            id="remove-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Document details for administrative review..."
            className="w-full px-3 py-2 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#A92F35] placeholder:text-[#958B86]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DDD7]">
          <button
            type="button"
            id="cancel-remove-btn"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-transparent hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="confirm-remove-btn"
            className="px-4 py-2 text-[14px] font-medium text-white bg-[#A92F35] hover:bg-[#8F272D] rounded-lg transition-colors shadow-sm"
          >
            Remove Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface RestoreRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onConfirm: () => void;
}

export const RestoreRequestModal: React.FC<RestoreRequestModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore this request?" id="restore-request-modal">
      <div>
        <p className="text-[14px] text-[#746C68] leading-relaxed mb-6">
          This restores request <strong className="text-[#292525] font-semibold">#{requestId}</strong>’s normal
          platform visibility without rewriting its original request history.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DDD7]">
          <button
            type="button"
            id="cancel-restore-btn"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-transparent hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-restore-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-[14px] font-medium text-white bg-[#557A61] hover:bg-[#466550] rounded-lg transition-colors shadow-sm"
          >
            Restore Request
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onConfirm: (adminNote?: string) => void;
}

export const ResolveReportModal: React.FC<ResolveReportModalProps> = ({
  isOpen,
  onClose,
  reportId,
  onConfirm,
}) => {
  const [adminNote, setAdminNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(adminNote.trim() || undefined);
    setAdminNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolve this report?" id="resolve-report-modal">
      <form onSubmit={handleSubmit}>
        <p className="text-[14px] text-[#746C68] leading-relaxed mb-5">
          Mark report <strong className="text-[#292525] font-semibold">#{reportId}</strong> as resolved after
          reviewing the available platform context and completing any necessary moderation action.
        </p>

        <div className="mb-6">
          <label htmlFor="resolve-note" className="block text-[13px] font-semibold text-[#292525] mb-1.5">
            Admin note <span className="text-[12px] font-normal text-[#958B86]">(Optional)</span>
          </label>
          <textarea
            id="resolve-note"
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Summarize resolution findings or actions taken..."
            className="w-full px-3 py-2 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#557A61] placeholder:text-[#958B86]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DDD7]">
          <button
            type="button"
            id="cancel-resolve-btn"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-transparent hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="confirm-resolve-btn"
            className="px-4 py-2 text-[14px] font-medium text-white bg-[#557A61] hover:bg-[#466550] rounded-lg transition-colors shadow-sm"
          >
            Resolve Report
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface DismissReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onConfirm: (adminNote?: string) => void;
}

export const DismissReportModal: React.FC<DismissReportModalProps> = ({
  isOpen,
  onClose,
  reportId,
  onConfirm,
}) => {
  const [adminNote, setAdminNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(adminNote.trim() || undefined);
    setAdminNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dismiss this report?" id="dismiss-report-modal">
      <form onSubmit={handleSubmit}>
        <p className="text-[14px] text-[#746C68] leading-relaxed mb-5">
          Dismiss report <strong className="text-[#292525] font-semibold">#{reportId}</strong> if it has been
          reviewed and no moderation action is required based on the available platform information.
        </p>

        <div className="mb-6">
          <label htmlFor="dismiss-note" className="block text-[13px] font-semibold text-[#292525] mb-1.5">
            Admin note <span className="text-[12px] font-normal text-[#958B86]">(Optional)</span>
          </label>
          <textarea
            id="dismiss-note"
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Explain why this report was dismissed..."
            className="w-full px-3 py-2 bg-white border border-[#E6DDD7] rounded-lg text-[14px] text-[#292525] focus:outline-none focus:border-[#746C68] placeholder:text-[#958B86]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DDD7]">
          <button
            type="button"
            id="cancel-dismiss-btn"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-[#746C68] hover:text-[#292525] bg-transparent hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="confirm-dismiss-btn"
            className="px-4 py-2 text-[14px] font-medium text-white bg-[#746C68] hover:bg-[#5C5551] rounded-lg transition-colors shadow-sm"
          >
            Dismiss Report
          </button>
        </div>
      </form>
    </Modal>
  );
};
