export type BloodType =
  | 'A+'
  | 'A−'
  | 'B+'
  | 'B−'
  | 'AB+'
  | 'AB−'
  | 'O+'
  | 'O−'
  | 'Not provided';

export interface Donor {
  id: string;
  bloodType: BloodType;
  available: boolean;
  generalLocation: string;
  proximity: string;
  city: string;
}

export type RequesterStatus =
  | 'Awaiting donor response'
  | 'Donor accepted'
  | 'Donor declined'
  | 'Cancelled'
  | 'Request Fulfilled'
  | 'Completed';

export type DonorDonationStatus =
  | 'not_applicable'
  | 'awaiting_confirmation'
  | 'completed'
  | 'did_not_donate';

export interface BloodRequest {
  id: string; // e.g. '#BR-8821'
  bloodFor: 'Myself' | 'Someone else';
  recipientName?: string;
  bloodType: BloodType;
  location: string;
  healthcareFacility: string;
  dateNeeded: string;
  additionalNote?: string;
  donorId: string;
  donorSnapshot: {
    bloodType: BloodType;
    generalLocation: string;
    proximity: string;
  };
  status: RequesterStatus;
  createdAt: string;
  declineReason?: string;
  requestFulfilledAt?: string;
  donorDonationStatus?: DonorDonationStatus;
  donationConfirmedAt?: string;
}

export type DonorRequestStatus =
  | 'Needs your response'
  | 'Accepted'
  | 'Declined'
  | 'Cancelled'
  | 'Donation Completed'
  | 'Request Fulfilled — No donation recorded'
  | 'Request Fulfilled';

export interface IncomingDonationRequest {
  id: string;
  requestId: string; // e.g. '#BR-8821'
  bloodType: BloodType;
  bloodFor: 'Myself' | 'Someone else';
  location: string;
  proximity: string;
  healthcareFacility: string;
  dateNeeded: string;
  additionalNote?: string;
  receivedTime: string;
  status: DonorRequestStatus;
  declineReason?: string;
  requestFulfilled?: boolean;
  requestFulfilledAt?: string;
  donorDonationStatus?: DonorDonationStatus;
  donationConfirmedAt?: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  sender: 'requester' | 'donor';
  senderLabel: string;
  text: string;
  timestamp: string;
}

export type IdentityVerificationStatus =
  | 'not_verified'
  | 'verification_started'
  | 'pending'
  | 'verified'
  | 'needs_attention';

export interface IdentityVerificationState {
  status: IdentityVerificationStatus;
  inquiryId?: string | null;
  updatedAt?: string | null;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  identityVerified: boolean;
  identityVerificationStatus?: IdentityVerificationStatus;
  bloodType: BloodType;
  availableToDonate: boolean;
  plan?: 'I want to donate' | 'I need to find blood';
}

export type ActiveView =
  | 'home'
  | 'confirm-request'
  | 'review-request'
  | 'request-details'
  | 'my-requests'
  | 'donation-requests'
  | 'review-donation-request'
  | 'conversation'
  | 'account-settings'
  | 'about-us'
  | 'donate-blood'
  | 'login'
  | 'register'
  | 'verify-email';

export type ReportType =
  | 'no_show'
  | 'inappropriate_behavior'
  | 'suspicious'
  | 'spam'
  | 'privacy'
  | 'other';

export type ReportReason =
  | 'donor_no_show'
  | 'requester_no_show'
  | 'inappropriate_behavior'
  | 'suspicious_activity'
  | 'suspicious_request'
  | 'spam_misleading'
  | 'privacy_concern'
  | 'other';

export type ReportStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';

export interface Report {
  id: string; // e.g. 'RP-1001'
  reporterUserId: string;
  reportedUserId?: string;
  requestId?: string;
  conversationId?: string;
  type: ReportType;
  reason: ReportReason;
  reasonLabel: string;
  details?: string;
  createdAt: string;
  status: ReportStatus;
}

