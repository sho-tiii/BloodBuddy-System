export type AdminRole = 'admin' | 'super_admin';

export type AdminAccountStatus = 'active' | 'inactive';

export type AccountStatus = 'active' | 'restricted';

export type IdentityStatus =
  | 'verified'
  | 'identity_verified'
  | 'pending'
  | 'needs_attention'
  | 'not_verified'
  | 'unverified';

export type BloodType =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'not_provided';

export type DonorAvailability = 'available' | 'not_available' | 'unavailable';

export type RequestStatus =
  | 'awaiting_response'
  | 'accepted'
  | 'in_coordination'
  | 'fulfilled'
  | 'declined'
  | 'cancelled';

export type DonorDonationStatus =
  | 'awaiting_confirmation'
  | 'completed'
  | 'did_not_donate'
  | 'unfulfilled'
  | 'not_applicable';

export type ModerationStatus = 'active' | 'removed';

export type ReportStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';

export type ReportSubjectType = 'user' | 'request';

export interface CommunityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  locationArea?: string;
  bloodType: BloodType;
  donorAvailability: DonorAvailability;
  accountStatus: AccountStatus;
  identityStatus: IdentityStatus;
  registeredAt?: string;
  joinedAt?: string;
  lastActiveAt?: string;
  registrationIntent?: string;
}

export interface BloodRequest {
  id: string;
  requesterUserId: string;
  selectedDonorUserId?: string;
  bloodTypeNeeded: BloodType;
  bloodFor: string;
  generalLocation: string;
  healthcareFacility: string;
  neededDate: string;
  additionalNote?: string;
  createdAt: string;
  requestStatus: RequestStatus;
  donorDonationStatus: DonorDonationStatus;
  moderationStatus: ModerationStatus;
  acceptedAt?: string;
  coordinationStartedAt?: string;
  fulfilledAt?: string;
  donationConfirmedAt?: string;
  declinedAt?: string;
  cancelledAt?: string;
}

export interface Report {
  id: string;
  subjectType?: ReportSubjectType;
  reportedUserId?: string;
  requestId?: string;
  conversationId?: string;
  reporterUserId: string;
  type?: string;
  reason: string;
  details: string;
  createdAt: string;
  status: ReportStatus;
  adminNote?: string;
  resolvedAt?: string;
}

export type ModerationAction =
  | 'account_restricted'
  | 'account_reactivated'
  | 'request_removed'
  | 'request_restored'
  | 'report_resolved'
  | 'report_dismissed'
  | 'report_review_started';

export interface ModerationEvent {
  id: string;
  adminId: string;
  action: ModerationAction;
  targetType: 'user' | 'request' | 'report';
  targetId: string;
  reason?: string;
  note?: string;
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminAccountStatus;
  createdAt: string;
  lastLoginAt?: string;
  passwordCredential: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminAccountStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export type AuditAction =
  | 'administrator_login'
  | 'administrator_logout'
  | 'password_changed'
  | 'report_review_started'
  | 'report_resolved'
  | 'report_dismissed'
  | 'community_account_restricted'
  | 'community_account_reactivated'
  | 'blood_request_removed'
  | 'blood_request_restored'
  | 'administrator_created'
  | 'administrator_deactivated'
  | 'administrator_reactivated'
  | 'record_archived'
  | 'record_restored';

export type AuditTargetType = 'user' | 'request' | 'report' | 'administrator' | 'system' | 'archive';

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string;
  targetName?: string;
  relatedUserId?: string;
  relatedRequestId?: string;
  relatedReportId?: string;
  reason?: string;
  note?: string;
  details?: string;
  timestamp?: string;
  createdAt: string;
}

export type ArchiveCategory = 'requests' | 'reports' | 'administrators' | 'user_data';

export interface ArchivedItem {
  id: string;
  category: ArchiveCategory;
  recordId: string;
  originalId?: string;
  originalTitle?: string;
  archivedAt: string;
  archivedByAdminId: string;
  archivedByName?: string;
  reason?: string;
  snapshot?: any;
}

export type NavigationTarget =
  | { view: 'overview' }
  | { view: 'users' }
  | { view: 'user_details'; userId: string }
  | { view: 'requests' }
  | { view: 'request_details'; requestId: string }
  | { view: 'reports' }
  | { view: 'report_details'; reportId: string }
  | { view: 'admin_account' }
  | { view: 'admin_management' }
  | { view: 'admin_details'; targetAdminId: string }
  | { view: 'audit_logs' }
  | { view: 'archives' };

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'danger' | 'info';
}
