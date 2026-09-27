import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, ShieldAlert, Lock, User } from 'lucide-react';
import { ChatMessage, BloodRequest, IncomingDonationRequest, UserProfile, Report } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Notice } from '../components/common/Notice';
import { Toast, ToastMessage } from '../components/common/Toast';
import { ReportMenuButton } from '../components/common/ReportMenuButton';
import { ReportModal } from '../components/common/ReportModal';

interface ConversationViewProps {
  requestId: string;
  messages: ChatMessage[];
  requestDetails?: BloodRequest | IncomingDonationRequest;
  userRole?: 'requester' | 'donor';
  currentUser?: UserProfile;
  onSendMessage: (requestId: string, text: string, sender: 'requester' | 'donor') => void;
  onBack: () => void;
  onCreateReport?: (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  requestId,
  messages,
  requestDetails,
  userRole,
  currentUser,
  onSendMessage,
  onBack,
  onCreateReport,
}) => {
  const [inputText, setInputText] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSenderRole: 'requester' | 'donor' =
    userRole || (requestDetails && 'donorId' in requestDetails ? 'donor' : 'requester');

  const isFulfilled =
    requestDetails?.status === 'Request Fulfilled' ||
    requestDetails?.status === 'Completed' ||
    requestDetails?.status === 'Donation Completed' ||
    requestDetails?.status === 'Request Fulfilled — No donation recorded' ||
    Boolean(
      requestDetails &&
        'requestFulfilled' in requestDetails &&
        requestDetails.requestFulfilled
    );

  const isCancelled = requestDetails?.status === 'Cancelled';
  const isClosed = isFulfilled || isCancelled;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isClosed) return;

    onSendMessage(requestId, inputText.trim(), activeSenderRole);
    setInputText('');
  };

  const bloodType = requestDetails?.bloodType || 'A+';
  const facility = requestDetails?.healthcareFacility || 'Caloocan City Medical Center';

  const displayStatus = isFulfilled
    ? 'Request Fulfilled'
    : isCancelled
    ? 'Cancelled'
    : 'Accepted';

  return (
    <div className="max-w-[1000px] mx-auto py-8 space-y-6">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="back-from-chat-btn"
          onClick={onBack}
          className="text-xs text-[#746C68] hover:text-[#292525] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Request Details</span>
        </button>
      </div>

      {/* CONVERSATION HEADER */}
      <Card padding="md" className="border-b-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#746C68] uppercase tracking-wider block">
              Blood Request · {requestId}
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#292525] mt-0.5">
              {bloodType} · {facility}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={displayStatus} />
            <ReportMenuButton
              id="conversation-report-btn"
              label="Report an Issue"
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          </div>
        </div>
      </Card>

      {/* SUBTLE CLOSED STATE BANNER (C18) */}
      {isFulfilled && (
        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] text-xs text-[#746C68] flex items-center justify-between">
          <span>
            <strong className="text-[#292525]">Request Fulfilled</strong> — This request has been closed. Conversation history is preserved for reference.
          </span>
        </div>
      )}

      {isCancelled && (
        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] text-xs text-[#746C68] flex items-center justify-between">
          <span>
            <strong className="text-[#292525]">Request Cancelled</strong> — This request has been closed.
          </span>
        </div>
      )}

      {/* MANDATORY PRIVACY NOTICE */}
      {!isClosed && (
        <Notice type="privacy">
          Keep coordination in BloodBuddy and avoid sensitive medical, financial,
          or personal identification information. Final screening and clinical
          intake take place at the hospital blood donation center.
        </Notice>
      )}

      {/* MESSAGE THREAD CONTAINER */}
      <Card padding="none" className="overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#FCFAF8]">
          <div className="text-center py-2">
            <span className="text-[11px] text-[#958B86] bg-white px-3 py-1 rounded-full border border-[#E6DDD7]">
              {isClosed ? 'Coordination Channel (Preserved History)' : 'Coordination Channel Established'}
            </span>
          </div>

          {messages.map((msg) => {
            const isRequester = msg.sender === 'requester';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isRequester ? 'items-start' : 'items-end'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#746C68]">
                  <span className="font-semibold text-[#292525]">
                    {isRequester ? 'Requester' : 'Volunteer Donor'}
                  </span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isRequester
                      ? 'bg-white border border-[#E6DDD7] text-[#292525] rounded-tl-sm'
                      : 'bg-[#A92F35] text-white rounded-tr-sm shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* MESSAGE INPUT OR CLOSED NOTICE */}
        {isClosed ? (
          <div className="p-4 bg-white border-t border-[#E6DDD7] flex items-center justify-center gap-2 text-xs text-[#746C68]">
            <Lock className="w-3.5 h-3.5 text-[#958B86]" />
            <span>
              This coordination channel is closed because the blood request has been {isCancelled ? 'cancelled' : 'fulfilled'}. Messages are preserved for reference.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 bg-white border-t border-[#E6DDD7] flex items-center gap-3"
          >
            <div className="flex-1 relative">
              <input
                id="chat-message-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Write a coordination message as ${
                  activeSenderRole === 'requester' ? 'Requester' : 'Donor'
                }...`}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E6DDD7] rounded-full text-xs sm:text-sm text-[#292525] placeholder:text-[#958B86] focus:outline-none focus:border-[#A92F35]"
              />
            </div>

            <Button
              id="chat-send-btn"
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputText.trim()}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        )}
      </Card>

      {/* REPORT ISSUE / CONVERSATION MODAL */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contextType={activeSenderRole === 'donor' ? 'accepted_requester' : 'accepted_donor'}
        requestId={requestId}
        conversationId={requestId}
        reporterUserId={currentUser?.email || (activeSenderRole === 'requester' ? 'requester-account' : 'donor-account')}
        reportedUserId={
          activeSenderRole === 'requester'
            ? requestDetails && 'donorId' in requestDetails
              ? requestDetails.donorId
              : 'donor-account'
            : 'requester-account'
        }
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
