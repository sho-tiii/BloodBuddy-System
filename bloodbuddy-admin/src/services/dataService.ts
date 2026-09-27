import {
  CommunityUser,
  BloodRequest,
  Report,
  ModerationEvent,
  AdminUser,
  AdminAccount,
  AdminRole,
  AdminAccountStatus,
  AuditLog,
  AuditAction,
  AuditTargetType,
  ArchivedItem,
  ArchiveCategory,
} from '../types';

const STORAGE_KEY_DATA = 'bloodbuddy_admin_data_v2';
const STORAGE_KEY_AUTH = 'bloodbuddy_admin_session_v2';

export const INITIAL_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'ADM-001',
    name: 'Platform Administrator',
    email: 'admin@bloodbuddy.test',
    role: 'admin',
    status: 'active',
    createdAt: '2026-09-01T08:00:00Z',
    lastLoginAt: '2026-09-21T09:15:00Z',
    passwordCredential: 'Admin123!',
  },
  {
    id: 'ADM-000',
    name: 'System Administrator',
    email: 'superadmin@bloodbuddy.test',
    role: 'super_admin',
    status: 'active',
    createdAt: '2026-08-15T08:00:00Z',
    lastLoginAt: '2026-09-21T10:30:00Z',
    passwordCredential: 'SuperAdmin123!',
  },
];

interface AppDatabase {
  users: CommunityUser[];
  requests: BloodRequest[];
  reports: Report[];
  moderationEvents: ModerationEvent[];
  adminAccounts: AdminAccount[];
  auditLogs: AuditLog[];
  archivedItems: ArchivedItem[];
}

const INITIAL_USERS: CommunityUser[] = [
  {
    id: 'USR-001',
    firstName: 'Kyle Christian',
    lastName: 'Camacho',
    email: 'kyle@example.com',
    joinedAt: '2024-10-12T08:30:00Z',
    identityStatus: 'verified',
    bloodType: 'B+',
    donorAvailability: 'available',
    accountStatus: 'active',
    registrationIntent: 'Potential donor and community requester',
    locationArea: 'Caloocan City South',
  },
  {
    id: 'USR-002',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@example.com',
    joinedAt: '2024-10-14T11:15:00Z',
    identityStatus: 'verified',
    bloodType: 'A+',
    donorAvailability: 'not_available',
    accountStatus: 'active',
    registrationIntent: 'Family emergency coordination',
    locationArea: 'Caloocan City South',
  },
  {
    id: 'USR-003',
    firstName: 'Alvin',
    lastName: 'Dagohoy',
    email: 'alvin.dagohoy@example.com',
    joinedAt: '2024-09-18T14:20:00Z',
    identityStatus: 'verified',
    bloodType: 'O-',
    donorAvailability: 'available',
    accountStatus: 'active',
    registrationIntent: 'Regular voluntary community donor',
    locationArea: 'Caloocan City North',
  },
  {
    id: 'USR-004',
    firstName: 'Eddion Derek',
    lastName: 'Cagomoc',
    email: 'eddion.cagomoc@example.com',
    joinedAt: '2024-10-02T09:45:00Z',
    identityStatus: 'pending',
    bloodType: 'O+',
    donorAvailability: 'available',
    accountStatus: 'active',
    registrationIntent: 'Community volunteer',
    locationArea: 'Valenzuela City',
  },
  {
    id: 'USR-005',
    firstName: 'Dan Dexter',
    lastName: 'Yoingco',
    email: 'dan.yoingco@example.com',
    joinedAt: '2024-08-25T16:10:00Z',
    identityStatus: 'verified',
    bloodType: 'AB+',
    donorAvailability: 'not_available',
    accountStatus: 'restricted',
    registrationIntent: 'Blood coordination',
    locationArea: 'Quezon City',
  },
  {
    id: 'USR-006',
    firstName: 'Dave',
    lastName: 'Lota',
    email: 'dave.lota@example.com',
    joinedAt: '2024-09-05T13:00:00Z',
    identityStatus: 'verified',
    bloodType: 'B-',
    donorAvailability: 'available',
    accountStatus: 'active',
    registrationIntent: 'Potential blood donor',
    locationArea: 'Caloocan City North',
  },
  {
    id: 'USR-007',
    firstName: 'James Percie',
    lastName: 'Soriano',
    email: 'james.soriano@example.com',
    joinedAt: '2024-09-29T10:30:00Z',
    identityStatus: 'needs_attention',
    bloodType: 'A-',
    donorAvailability: 'not_available',
    accountStatus: 'active',
    registrationIntent: 'Emergency blood search',
    locationArea: 'Manila',
  },
  {
    id: 'USR-008',
    firstName: 'Angelica',
    lastName: 'Dela Cruz',
    email: 'angelica.delacruz@example.com',
    joinedAt: '2024-10-08T15:20:00Z',
    identityStatus: 'verified',
    bloodType: 'O+',
    donorAvailability: 'available',
    accountStatus: 'active',
    registrationIntent: 'Community advocate',
    locationArea: 'Caloocan City South',
  },
  {
    id: 'USR-009',
    firstName: 'Joshua',
    lastName: 'Garcia',
    email: 'joshua.garcia@example.com',
    joinedAt: '2024-10-18T18:05:00Z',
    identityStatus: 'not_verified',
    bloodType: 'not_provided',
    donorAvailability: 'not_available',
    accountStatus: 'active',
    registrationIntent: 'Urgent family assistance',
    locationArea: 'Quezon City',
  },
  {
    id: 'USR-010',
    firstName: 'Bea',
    lastName: 'Alonzo',
    email: 'bea.alonzo@example.com',
    joinedAt: '2024-10-01T12:00:00Z',
    identityStatus: 'verified',
    bloodType: 'AB-',
    donorAvailability: 'available',
    accountStatus: 'active',
    registrationIntent: 'Community blood donor',
    locationArea: 'Quezon City',
  },
];

const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'BR-8821',
    requesterUserId: 'USR-001',
    selectedDonorUserId: 'USR-002',
    bloodTypeNeeded: 'A+',
    bloodFor: 'Immediate family member undergoing surgical procedure',
    generalLocation: 'Caloocan City South',
    healthcareFacility: 'Caloocan City Medical Center',
    neededDate: '2024-10-25',
    additionalNote: 'Patient admitted in surgical wing. Direct donor coordination required for morning schedule.',
    createdAt: '2024-10-20T09:15:00Z',
    requestStatus: 'fulfilled',
    donorDonationStatus: 'completed',
    moderationStatus: 'active',
    acceptedAt: '2024-10-21T10:00:00Z',
    coordinationStartedAt: '2024-10-21T10:30:00Z',
    fulfilledAt: '2024-10-24T15:00:00Z',
    donationConfirmedAt: '2024-10-24T16:30:00Z',
  },
  {
    id: 'BR-8822',
    requesterUserId: 'USR-004',
    selectedDonorUserId: 'USR-003',
    bloodTypeNeeded: 'O-',
    bloodFor: 'Dialysis patient with acute anemia',
    generalLocation: 'Caloocan City North',
    healthcareFacility: 'Dr. Jose N. Rodriguez Memorial Hospital',
    neededDate: '2024-10-28',
    additionalNote: 'Hospital blood bank accepts replacement donors between 8:00 AM and 2:00 PM.',
    createdAt: '2024-10-22T14:30:00Z',
    requestStatus: 'accepted',
    donorDonationStatus: 'awaiting_confirmation',
    moderationStatus: 'active',
    acceptedAt: '2024-10-23T08:20:00Z',
    coordinationStartedAt: '2024-10-23T09:00:00Z',
  },
  {
    id: 'BR-8823',
    requesterUserId: 'USR-008',
    bloodTypeNeeded: 'B+',
    bloodFor: 'Community member recovering from severe dengue fever',
    generalLocation: 'Caloocan City South',
    healthcareFacility: 'MCU-FDTMF Hospital',
    neededDate: '2024-10-29',
    additionalNote: 'Need 2 units of packed red blood cells. Platelet screening also welcomed.',
    createdAt: '2024-10-24T07:45:00Z',
    requestStatus: 'awaiting_response',
    donorDonationStatus: 'not_applicable',
    moderationStatus: 'active',
  },
  {
    id: 'BR-8824',
    requesterUserId: 'USR-005',
    selectedDonorUserId: 'USR-006',
    bloodTypeNeeded: 'B-',
    bloodFor: 'Emergency orthopedic surgery',
    generalLocation: 'Quezon City',
    healthcareFacility: 'East Avenue Medical Center',
    neededDate: '2024-10-27',
    additionalNote: 'Scheduled for trauma ward replacement unit.',
    createdAt: '2024-10-21T11:00:00Z',
    requestStatus: 'in_coordination',
    donorDonationStatus: 'awaiting_confirmation',
    moderationStatus: 'active',
    acceptedAt: '2024-10-22T08:15:00Z',
    coordinationStartedAt: '2024-10-22T08:45:00Z',
  },
  {
    id: 'BR-8825',
    requesterUserId: 'USR-007',
    selectedDonorUserId: 'USR-001',
    bloodTypeNeeded: 'B+',
    bloodFor: 'Cardiovascular surgical backup unit',
    generalLocation: 'Manila',
    healthcareFacility: 'Philippine General Hospital',
    neededDate: '2024-10-23',
    additionalNote: 'Selected donor could not attend; hospital secured units from central reserve.',
    createdAt: '2024-10-18T13:20:00Z',
    requestStatus: 'fulfilled',
    donorDonationStatus: 'did_not_donate',
    moderationStatus: 'active',
    acceptedAt: '2024-10-19T09:00:00Z',
    coordinationStartedAt: '2024-10-19T09:30:00Z',
    fulfilledAt: '2024-10-23T18:00:00Z',
  },
  {
    id: 'BR-8826',
    requesterUserId: 'USR-009',
    bloodTypeNeeded: 'O+',
    bloodFor: 'Scheduled elective procedure backup',
    generalLocation: 'Quezon City',
    healthcareFacility: 'Quirino Memorial Medical Center',
    neededDate: '2024-10-26',
    additionalNote: 'Doctor cancelled procedure; blood units no longer required.',
    createdAt: '2024-10-19T10:00:00Z',
    requestStatus: 'cancelled',
    donorDonationStatus: 'not_applicable',
    moderationStatus: 'active',
    cancelledAt: '2024-10-20T11:30:00Z',
  },
  {
    id: 'BR-8827',
    requesterUserId: 'USR-002',
    selectedDonorUserId: 'USR-010',
    bloodTypeNeeded: 'AB-',
    bloodFor: 'Chemotherapy supportive blood replenishment',
    generalLocation: 'Quezon City',
    healthcareFacility: 'Veterans Memorial Medical Center',
    neededDate: '2024-10-27',
    additionalNote: 'Potential donor could not travel across district due to schedule conflict.',
    createdAt: '2024-10-22T16:00:00Z',
    requestStatus: 'declined',
    donorDonationStatus: 'not_applicable',
    moderationStatus: 'active',
    declinedAt: '2024-10-23T14:10:00Z',
  },
  {
    id: 'BR-8828',
    requesterUserId: 'USR-003',
    selectedDonorUserId: 'USR-004',
    bloodTypeNeeded: 'O+',
    bloodFor: 'Post-delivery maternal anemia management',
    generalLocation: 'Valenzuela City',
    healthcareFacility: 'Valenzuela City General Hospital',
    neededDate: '2024-10-30',
    additionalNote: 'In active communication with selected potential donor for Sunday morning slot.',
    createdAt: '2024-10-23T11:30:00Z',
    requestStatus: 'in_coordination',
    donorDonationStatus: 'awaiting_confirmation',
    moderationStatus: 'active',
    acceptedAt: '2024-10-23T13:40:00Z',
    coordinationStartedAt: '2024-10-23T14:00:00Z',
  },
  {
    id: 'BR-8829',
    requesterUserId: 'USR-005',
    bloodTypeNeeded: 'AB+',
    bloodFor: 'Unverified emergency assistance request',
    generalLocation: 'Caloocan City South',
    healthcareFacility: 'Caloocan City Medical Center',
    neededDate: '2024-10-22',
    additionalNote: 'Listing contained misleading details and duplicate postings.',
    createdAt: '2024-10-21T09:00:00Z',
    requestStatus: 'awaiting_response',
    donorDonationStatus: 'not_applicable',
    moderationStatus: 'removed',
  },
  {
    id: 'BR-8830',
    requesterUserId: 'USR-006',
    selectedDonorUserId: 'USR-008',
    bloodTypeNeeded: 'O+',
    bloodFor: 'Trauma ward replacement requirement',
    generalLocation: 'Caloocan City South',
    healthcareFacility: 'MCU-FDTMF Hospital',
    neededDate: '2024-10-24',
    additionalNote: 'Successful direct community coordination at hospital blood donation station.',
    createdAt: '2024-10-20T08:00:00Z',
    requestStatus: 'fulfilled',
    donorDonationStatus: 'completed',
    moderationStatus: 'active',
    acceptedAt: '2024-10-20T10:15:00Z',
    coordinationStartedAt: '2024-10-20T10:45:00Z',
    fulfilledAt: '2024-10-24T11:00:00Z',
    donationConfirmedAt: '2024-10-24T11:45:00Z',
  },
];

const INITIAL_REPORTS: Report[] = [
  {
    id: 'RP-1001',
    reporterUserId: 'USR-001',
    reportedUserId: 'USR-002',
    requestId: 'BR-8821',
    type: 'No-show report',
    reason: 'Donor did not show up',
    details:
      'The selected potential donor indicated willingness to coordinate at Caloocan City Medical Center, but did not arrive at the blood bank reception at the agreed time. Messages sent during that hour went unanswered.',
    createdAt: '2024-10-24T10:15:00Z',
    status: 'open',
  },
  {
    id: 'RP-1002',
    reporterUserId: 'USR-006',
    reportedUserId: 'USR-005',
    requestId: 'BR-8824',
    type: 'Safety concern',
    reason: 'Suspicious request',
    details:
      'The requester asked for cash transport reimbursement via personal electronic wallet prior to meeting at East Avenue Medical Center. This raises platform policy and safety concerns.',
    createdAt: '2024-10-22T14:45:00Z',
    status: 'under_review',
    adminNote: 'Cross-checking with previous reports on USR-005. Evaluating account restriction.',
  },
  {
    id: 'RP-1003',
    reporterUserId: 'USR-003',
    reportedUserId: 'USR-004',
    requestId: 'BR-8822',
    type: 'No-show report',
    reason: 'Requester did not show up',
    details:
      'Potential donor arrived at Dr. Jose N. Rodriguez Memorial Hospital blood bank station at 9:00 AM as scheduled, but requester could not be contacted at the designated lobby waiting area.',
    createdAt: '2024-10-23T11:30:00Z',
    status: 'open',
  },
  {
    id: 'RP-1004',
    reporterUserId: 'USR-008',
    reportedUserId: 'USR-005',
    requestId: 'BR-8829',
    type: 'Platform integrity',
    reason: 'Spam or misleading information',
    details:
      'Multiple identical requests were posted with varying blood types and conflicting patient relationships within a few hours.',
    createdAt: '2024-10-21T10:30:00Z',
    status: 'resolved',
    adminNote: 'Duplicate request BR-8829 was removed from platform listing. Account remains under close administrative observation.',
    resolvedAt: '2024-10-21T14:00:00Z',
  },
  {
    id: 'RP-1005',
    reporterUserId: 'USR-010',
    reportedUserId: 'USR-007',
    conversationId: 'CONV-4412',
    type: 'Behavior concern',
    reason: 'Inappropriate behavior',
    details:
      'After explaining inability to travel to the requested facility due to schedule limitations, received repeated hostile and pressuring messages from the requester.',
    createdAt: '2024-10-23T15:20:00Z',
    status: 'open',
  },
  {
    id: 'RP-1006',
    reporterUserId: 'USR-004',
    reportedUserId: 'USR-009',
    type: 'Privacy concern',
    reason: 'Privacy concern',
    details:
      'Reported that the user published an unredacted family phone number and home barangay street in public listing notes.',
    createdAt: '2024-10-20T09:00:00Z',
    status: 'dismissed',
    adminNote: 'Reviewed public note text. User had independently removed contact detail prior to admin review; no active leak present.',
    resolvedAt: '2024-10-20T12:00:00Z',
  },
  {
    id: 'RP-1007',
    reporterUserId: 'USR-002',
    reportedUserId: 'USR-005',
    requestId: 'BR-8824',
    type: 'Safety concern',
    reason: 'Suspicious activity',
    details:
      'Requester sent conflicting hospital admission slips and requested blood units for unknown third parties outside verified medical facilities.',
    createdAt: '2024-10-22T17:00:00Z',
    status: 'under_review',
    adminNote: 'Multiple community members reported similar patterns for this account.',
  },
  {
    id: 'RP-1008',
    reporterUserId: 'USR-007',
    reportedUserId: 'USR-001',
    requestId: 'BR-8825',
    type: 'No-show report',
    reason: 'Donor did not show up',
    details:
      'Selected donor Kyle Camacho was unable to reach PGH due to flood advisory; both parties communicated afterward and requester sourced unit from hospital inventory.',
    createdAt: '2024-10-23T19:00:00Z',
    status: 'resolved',
    adminNote: 'Confirmed with both community members that weather prevented transit; no intentional misconduct.',
    resolvedAt: '2024-10-24T08:30:00Z',
  },
];

const INITIAL_MODERATION_EVENTS: ModerationEvent[] = [
  {
    id: 'MOD-001',
    adminId: 'ADM-001',
    action: 'account_restricted',
    targetType: 'user',
    targetId: 'USR-005',
    reason: 'Repeated inappropriate behavior',
    note: 'Account restricted following multiple reports regarding unverified reimbursement requests and duplicate listings.',
    createdAt: '2024-10-22T18:00:00Z',
  },
  {
    id: 'MOD-002',
    adminId: 'ADM-001',
    action: 'request_removed',
    targetType: 'request',
    targetId: 'BR-8829',
    reason: 'Spam or misleading request',
    note: 'Removed duplicate unverified emergency listing per platform moderation policy.',
    createdAt: '2024-10-21T13:45:00Z',
  },
  {
    id: 'MOD-003',
    adminId: 'ADM-001',
    action: 'report_resolved',
    targetType: 'report',
    targetId: 'RP-1004',
    note: 'Duplicate request was removed and listing issue closed.',
    createdAt: '2024-10-21T14:00:00Z',
  },
  {
    id: 'MOD-004',
    adminId: 'ADM-001',
    action: 'report_dismissed',
    targetType: 'report',
    targetId: 'RP-1006',
    note: 'User independently redacted phone number from request notes before review.',
    createdAt: '2024-10-20T12:00:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    adminId: 'ADM-001',
    adminName: 'Platform Administrator',
    adminEmail: 'admin@bloodbuddy.test',
    action: 'community_account_restricted',
    targetType: 'user',
    targetId: 'USR-005',
    targetName: 'Maria Santos',
    relatedUserId: 'USR-005',
    reason: 'Repeated inappropriate behavior',
    note: 'Account restricted following multiple reports regarding unverified reimbursement requests and duplicate listings.',
    details: 'Account restricted following multiple reports regarding unverified reimbursement requests and duplicate listings.',
    timestamp: '2024-10-22T18:00:00Z',
    createdAt: '2024-10-22T18:00:00Z',
  },
  {
    id: 'AUD-002',
    adminId: 'ADM-001',
    adminName: 'Platform Administrator',
    adminEmail: 'admin@bloodbuddy.test',
    action: 'blood_request_removed',
    targetType: 'request',
    targetId: 'BR-8829',
    targetName: 'Blood Request #BR-8829',
    relatedRequestId: 'BR-8829',
    relatedUserId: 'USR-005',
    reason: 'Spam or misleading request',
    note: 'Removed duplicate unverified emergency listing per platform moderation policy.',
    details: 'Removed duplicate unverified emergency listing per platform moderation policy.',
    timestamp: '2024-10-21T13:45:00Z',
    createdAt: '2024-10-21T13:45:00Z',
  },
  {
    id: 'AUD-003',
    adminId: 'ADM-001',
    adminName: 'Platform Administrator',
    adminEmail: 'admin@bloodbuddy.test',
    action: 'report_resolved',
    targetType: 'report',
    targetId: 'RP-1004',
    targetName: 'Report #RP-1004',
    relatedReportId: 'RP-1004',
    relatedRequestId: 'BR-8829',
    relatedUserId: 'USR-005',
    note: 'Duplicate request was removed and listing issue closed.',
    details: 'Duplicate request was removed and listing issue closed.',
    timestamp: '2024-10-21T14:00:00Z',
    createdAt: '2024-10-21T14:00:00Z',
  },
  {
    id: 'AUD-004',
    adminId: 'ADM-001',
    adminName: 'Platform Administrator',
    adminEmail: 'admin@bloodbuddy.test',
    action: 'report_dismissed',
    targetType: 'report',
    targetId: 'RP-1006',
    targetName: 'Report #RP-1006',
    relatedReportId: 'RP-1006',
    relatedRequestId: 'BR-8821',
    relatedUserId: 'USR-001',
    note: 'User independently redacted phone number from request notes before review.',
    details: 'User independently redacted phone number from request notes before review.',
    timestamp: '2024-10-20T12:00:00Z',
    createdAt: '2024-10-20T12:00:00Z',
  },
  {
    id: 'AUD-005',
    adminId: 'ADM-000',
    adminName: 'System Administrator',
    adminEmail: 'superadmin@bloodbuddy.test',
    action: 'administrator_created',
    targetType: 'administrator',
    targetId: 'ADM-001',
    targetName: 'Platform Administrator',
    note: 'Initial platform administrator account provisioned.',
    details: 'Initial platform administrator account provisioned.',
    timestamp: '2026-09-01T08:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
  },
];

const INITIAL_ARCHIVED_ITEMS: ArchivedItem[] = [];

class DataService {
  private data: AppDatabase;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): AppDatabase {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all required fields exist
        if (!parsed.adminAccounts) parsed.adminAccounts = INITIAL_ADMIN_ACCOUNTS;
        if (!parsed.auditLogs) parsed.auditLogs = INITIAL_AUDIT_LOGS;
        if (!parsed.archivedItems) parsed.archivedItems = INITIAL_ARCHIVED_ITEMS;
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read stored data:', e);
    }

    const initial: AppDatabase = {
      users: INITIAL_USERS,
      requests: INITIAL_REQUESTS,
      reports: INITIAL_REPORTS,
      moderationEvents: INITIAL_MODERATION_EVENTS,
      adminAccounts: INITIAL_ADMIN_ACCOUNTS,
      auditLogs: INITIAL_AUDIT_LOGS,
      archivedItems: INITIAL_ARCHIVED_ITEMS,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: AppDatabase): void {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
      this.data = data;
    } catch (e) {
      console.error('Could not save data to localStorage:', e);
    }
  }

  // ==========================================
  // AUTHENTICATION & SESSIONS
  // ==========================================
  public getSession(): AdminUser | null {
    try {
      const auth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (auth) {
        const session: AdminUser = JSON.parse(auth);
        // Verify this admin still exists and is active in database
        const adminAccount = this.data.adminAccounts.find((a) => a.id === session.id);
        if (!adminAccount || adminAccount.status === 'inactive') {
          this.logout();
          return null;
        }
        return {
          id: adminAccount.id,
          name: adminAccount.name,
          email: adminAccount.email,
          role: adminAccount.role,
          status: adminAccount.status,
          createdAt: adminAccount.createdAt,
          lastLoginAt: adminAccount.lastLoginAt,
        };
      }
    } catch (e) {
      console.warn('Could not read admin session:', e);
    }
    return null;
  }

  public login(email: string, pass: string): { success: boolean; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const account = this.data.adminAccounts.find(
      (a) => a.email.toLowerCase() === trimmedEmail,
    );

    if (!account) {
      return { success: false, error: 'Email or password is incorrect.' };
    }

    if (account.passwordCredential !== pass) {
      return { success: false, error: 'Email or password is incorrect.' };
    }

    if (account.status === 'inactive') {
      return {
        success: false,
        error: 'This administrator account is deactivated. Contact a Super Administrator.',
      };
    }

    // Update lastLoginAt
    account.lastLoginAt = new Date().toISOString();
    this.saveData(this.data);

    const sessionUser: AdminUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      status: account.status,
      createdAt: account.createdAt,
      lastLoginAt: account.lastLoginAt,
    };

    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionUser));

    // Create audit log
    this.createAuditLog({
      action: 'administrator_login',
      targetType: 'administrator',
      targetId: account.id,
      note: `Administrator signed in with role ${account.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}.`,
    }, sessionUser);

    return { success: true };
  }

  public logout(): void {
    const session = this.getSession();
    if (session) {
      this.createAuditLog({
        action: 'administrator_logout',
        targetType: 'administrator',
        targetId: session.id,
        note: 'Administrator signed out.',
      }, session);
    }
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }

  // ==========================================
  // FORGOT PASSWORD & RECOVERY
  // ==========================================
  public findAdminByEmail(email: string): AdminAccount | undefined {
    const trimmed = email.trim().toLowerCase();
    return this.data.adminAccounts.find((a) => a.email.toLowerCase() === trimmed);
  }

  public resetAdminPassword(adminId: string, newPassword: string): boolean {
    const account = this.data.adminAccounts.find((a) => a.id === adminId);
    if (!account) return false;

    account.passwordCredential = newPassword;
    this.saveData(this.data);

    this.createAuditLog({
      action: 'password_changed',
      targetType: 'administrator',
      targetId: account.id,
      note: 'Administrator password reset via self-service recovery.',
    }, {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      status: account.status,
      createdAt: account.createdAt,
    });

    return true;
  }

  public changeOwnPassword(adminId: string, currentPass: string, newPass: string): { success: boolean; error?: string } {
    const account = this.data.adminAccounts.find((a) => a.id === adminId);
    if (!account) {
      return { success: false, error: 'Administrator account not found.' };
    }

    if (account.passwordCredential !== currentPass) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    account.passwordCredential = newPass;
    this.saveData(this.data);

    const session = this.getSession();
    this.createAuditLog({
      action: 'password_changed',
      targetType: 'administrator',
      targetId: account.id,
      note: 'Administrator changed their own password.',
    }, session || {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      status: account.status,
      createdAt: account.createdAt,
    });

    return { success: true };
  }

  // ==========================================
  // AUDIT LOG MANAGEMENT
  // ==========================================
  public getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  public getAuditLog(id: string): AuditLog | undefined {
    return this.data.auditLogs.find((l) => l.id === id);
  }

  private createAuditLog(
    params: {
      action: AuditAction;
      targetType: AuditTargetType;
      targetId?: string;
      relatedUserId?: string;
      relatedRequestId?: string;
      relatedReportId?: string;
      reason?: string;
      note?: string;
    },
    actingAdmin?: AdminUser | null,
  ): AuditLog {
    const admin = actingAdmin || this.getSession() || {
      id: 'SYSTEM',
      name: 'System',
      email: 'system@bloodbuddy.test',
      role: 'super_admin' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };

    const details = params.note || params.reason || `Action ${params.action} performed.`;
    const targetName =
      params.targetType === 'user' && params.targetId
        ? this.getUser(params.targetId)?.firstName + ' ' + this.getUser(params.targetId)?.lastName
        : params.targetType === 'request' && params.targetId
        ? `Blood Request #${params.targetId}`
        : params.targetType === 'report' && params.targetId
        ? `Report #${params.targetId}`
        : params.targetType === 'administrator' && params.targetId
        ? this.getAdminAccount(params.targetId)?.name || `Admin ${params.targetId}`
        : params.targetId || 'Platform';

    const timestamp = new Date().toISOString();

    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      targetName,
      relatedUserId: params.relatedUserId,
      relatedRequestId: params.relatedRequestId,
      relatedReportId: params.relatedReportId,
      reason: params.reason,
      note: params.note,
      details,
      timestamp,
      createdAt: timestamp,
    };

    this.data.auditLogs.unshift(newLog);
    this.saveData(this.data);
    return newLog;
  }

  // ==========================================
  // ADMINISTRATOR MANAGEMENT (SUPER ADMIN ONLY)
  // ==========================================
  public getAdminAccounts(): AdminAccount[] {
    return [...this.data.adminAccounts];
  }

  public getAdminAccount(id: string): AdminAccount | undefined {
    return this.data.adminAccounts.find((a) => a.id === id);
  }

  public getAdminAccountById(id: string): AdminAccount | undefined {
    return this.getAdminAccount(id);
  }

  public changeAdminPassword(adminId: string, currentPass: string, newPass: string) {
    return this.changeOwnPassword(adminId, currentPass, newPass);
  }

  public createAdministrator(name: string, email: string, passwordCredential: string): { success: boolean; error?: string; account?: AdminAccount } {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = this.data.adminAccounts.find((a) => a.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An administrator account with this email address already exists.' };
    }

    const newId = `ADM-${(this.data.adminAccounts.length + 1).toString().padStart(3, '0')}`;
    const newAccount: AdminAccount = {
      id: newId,
      name: name.trim(),
      email: trimmedEmail,
      role: 'admin', // Regular administrator only
      status: 'active',
      createdAt: new Date().toISOString(),
      passwordCredential,
    };

    this.data.adminAccounts.push(newAccount);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'administrator_created',
      targetType: 'administrator',
      targetId: newAccount.id,
      note: `Administrator ${newAccount.name} (${newAccount.email}) created with role Administrator.`,
    });

    return { success: true, account: newAccount };
  }

  public deactivateAdministrator(adminId: string, reason?: string, note?: string): { success: boolean; error?: string } {
    const currentSession = this.getSession();
    if (currentSession?.id === adminId) {
      return { success: false, error: 'You cannot deactivate your own administrative account.' };
    }

    const account = this.data.adminAccounts.find((a) => a.id === adminId);
    if (!account) {
      return { success: false, error: 'Administrator not found.' };
    }

    if (account.role === 'super_admin') {
      const activeSuperAdmins = this.data.adminAccounts.filter(
        (a) => a.role === 'super_admin' && a.status === 'active',
      );
      if (activeSuperAdmins.length <= 1) {
        return { success: false, error: 'Cannot deactivate the only active Super Administrator account.' };
      }
    }

    account.status = 'inactive';
    this.saveData(this.data);

    this.createAuditLog({
      action: 'administrator_deactivated',
      targetType: 'administrator',
      targetId: account.id,
      reason,
      note: note || 'Administrator account disabled by Super Administrator.',
    });

    return { success: true };
  }

  public reactivateAdministrator(adminId: string): { success: boolean; error?: string } {
    const account = this.data.adminAccounts.find((a) => a.id === adminId);
    if (!account) {
      return { success: false, error: 'Administrator not found.' };
    }

    account.status = 'active';
    this.saveData(this.data);

    this.createAuditLog({
      action: 'administrator_reactivated',
      targetType: 'administrator',
      targetId: account.id,
      note: 'Administrative access restored by Super Administrator.',
    });

    return { success: true };
  }

  // ==========================================
  // ARCHIVES MANAGEMENT (SUPER ADMIN ONLY)
  // ==========================================
  public getArchivedItems(category?: ArchiveCategory): ArchivedItem[] {
    if (category) {
      return this.data.archivedItems.filter((i) => i.category === category);
    }
    return [...this.data.archivedItems];
  }

  public isRecordArchived(category: ArchiveCategory, recordId: string): boolean {
    return this.data.archivedItems.some((i) => i.category === category && i.recordId === recordId);
  }

  public archiveRecord(category: ArchiveCategory, recordId: string, reason?: string): { success: boolean; error?: string } {
    if (this.isRecordArchived(category, recordId)) {
      return { success: false, error: 'Record is already archived.' };
    }

    const session = this.getSession();
    const adminId = session ? session.id : 'SYSTEM';

    const adminName = session ? session.name : 'System';

    let originalTitle = recordId;
    let snapshot: any = null;
    if (category === 'requests') {
      const r = this.getRequest(recordId);
      if (r) {
        originalTitle = `Blood Request #${r.id} (${r.bloodTypeNeeded} at ${r.healthcareFacility})`;
        snapshot = r;
      }
    } else if (category === 'reports') {
      const rep = this.data.reports.find((r) => r.id === recordId);
      if (rep) {
        originalTitle = `Report #${rep.id} (${rep.reason})`;
        snapshot = rep;
      }
    } else if (category === 'administrators') {
      const a = this.getAdminAccount(recordId);
      if (a) {
        originalTitle = `${a.name} (${a.email})`;
        snapshot = a;
      }
    }

    const item: ArchivedItem = {
      id: `ARC-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
      category,
      recordId,
      originalId: recordId,
      originalTitle,
      archivedAt: new Date().toISOString(),
      archivedByAdminId: adminId,
      archivedByName: adminName,
      reason,
      snapshot,
    };

    this.data.archivedItems.unshift(item);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'record_archived',
      targetType: category === 'requests' ? 'request' : category === 'reports' ? 'report' : 'administrator',
      targetId: recordId,
      relatedRequestId: category === 'requests' ? recordId : undefined,
      relatedReportId: category === 'reports' ? recordId : undefined,
      reason,
      note: `Record archived under ${category} archives.`,
    });

    return { success: true };
  }

  public restoreRecord(category: ArchiveCategory, recordId: string): { success: boolean; error?: string } {
    const idx = this.data.archivedItems.findIndex(
      (i) => i.category === category && i.recordId === recordId,
    );
    if (idx === -1) {
      return { success: false, error: 'Archived record not found.' };
    }

    this.data.archivedItems.splice(idx, 1);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'record_restored',
      targetType: category === 'requests' ? 'request' : category === 'reports' ? 'report' : 'administrator',
      targetId: recordId,
      relatedRequestId: category === 'requests' ? recordId : undefined,
      relatedReportId: category === 'reports' ? recordId : undefined,
      note: `Record restored from ${category} archives to active views.`,
    });

    return { success: true };
  }

  public restoreArchivedItem(archiveIdOrRecordId: string): boolean {
    const item = this.data.archivedItems.find(
      (i) => i.id === archiveIdOrRecordId || i.recordId === archiveIdOrRecordId,
    );
    if (!item) return false;
    const res = this.restoreRecord(item.category, item.recordId);
    return res.success;
  }

  // ==========================================
  // STATS (DERIVED ONLY)
  // ==========================================
  public getOverviewStats() {
    const totalAccounts = this.data.users.length;
    // Active requests: not archived, active moderation, and lifecycle awaiting/accepted/in_coordination
    const activeRequests = this.data.requests.filter(
      (r) =>
        !this.isRecordArchived('requests', r.id) &&
        r.moderationStatus === 'active' &&
        (r.requestStatus === 'awaiting_response' ||
          r.requestStatus === 'accepted' ||
          r.requestStatus === 'in_coordination'),
    ).length;

    // Available potential donors
    const availableDonors = this.data.users.filter(
      (u) =>
        u.accountStatus === 'active' &&
        u.bloodType !== 'not_provided' &&
        u.donorAvailability === 'available',
    ).length;

    // Open reports: not archived, open or under_review
    const openReports = this.data.reports.filter(
      (r) =>
        !this.isRecordArchived('reports', r.id) &&
        (r.status === 'open' || r.status === 'under_review'),
    ).length;

    // Super Admin stats
    const activeAdmins = this.data.adminAccounts.filter((a) => a.status === 'active').length;
    const inactiveAdmins = this.data.adminAccounts.filter((a) => a.status === 'inactive').length;
    const archivedCount = this.data.archivedItems.length;

    return {
      totalAccounts,
      activeRequests,
      availableDonors,
      openReports,
      activeAdmins,
      inactiveAdmins,
      archivedCount,
    };
  }

  // ==========================================
  // COMMUNITY USERS
  // ==========================================
  public getUsers(): CommunityUser[] {
    return [...this.data.users];
  }

  public getUser(id: string): CommunityUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public restrictUser(userId: string, reason: string, note?: string): boolean {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return false;

    user.accountStatus = 'restricted';
    const session = this.getSession();
    const adminId = session ? session.id : 'ADM-001';

    const newEvent: ModerationEvent = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      adminId,
      action: 'account_restricted',
      targetType: 'user',
      targetId: userId,
      reason,
      note,
      createdAt: new Date().toISOString(),
    };
    this.data.moderationEvents.unshift(newEvent);
    this.saveData(this.data);

    // Also write to centralized audit logs
    this.createAuditLog({
      action: 'community_account_restricted',
      targetType: 'user',
      targetId: userId,
      relatedUserId: userId,
      reason,
      note: note || 'Community user account restricted.',
    });

    return true;
  }

  public reactivateUser(userId: string): boolean {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return false;

    user.accountStatus = 'active';
    const session = this.getSession();
    const adminId = session ? session.id : 'ADM-001';

    const newEvent: ModerationEvent = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      adminId,
      action: 'account_reactivated',
      targetType: 'user',
      targetId: userId,
      note: 'Normal platform access restored by administrator.',
      createdAt: new Date().toISOString(),
    };
    this.data.moderationEvents.unshift(newEvent);
    this.saveData(this.data);

    // Also write to centralized audit logs
    this.createAuditLog({
      action: 'community_account_reactivated',
      targetType: 'user',
      targetId: userId,
      relatedUserId: userId,
      note: 'Normal platform access restored by administrator.',
    });

    return true;
  }

  // ==========================================
  // BLOOD REQUESTS
  // ==========================================
  public getRequests(includeArchived = false): BloodRequest[] {
    if (includeArchived) {
      return [...this.data.requests];
    }
    const archivedIds = new Set(
      this.data.archivedItems
        .filter((i) => i.category === 'requests')
        .map((i) => i.recordId),
    );
    return this.data.requests.filter((r) => !archivedIds.has(r.id));
  }

  public getRequest(id: string): BloodRequest | undefined {
    return this.data.requests.find((r) => r.id === id);
  }

  public removeRequest(requestId: string, reason: string, note?: string): boolean {
    const req = this.data.requests.find((r) => r.id === requestId);
    if (!req) return false;

    // Do NOT alter original requestStatus or donorDonationStatus
    req.moderationStatus = 'removed';
    const session = this.getSession();
    const adminId = session ? session.id : 'ADM-001';

    const newEvent: ModerationEvent = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      adminId,
      action: 'request_removed',
      targetType: 'request',
      targetId: requestId,
      reason,
      note,
      createdAt: new Date().toISOString(),
    };
    this.data.moderationEvents.unshift(newEvent);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'blood_request_removed',
      targetType: 'request',
      targetId: requestId,
      relatedRequestId: requestId,
      relatedUserId: req.requesterUserId,
      reason,
      note,
    });

    return true;
  }

  public restoreRequest(requestId: string): boolean {
    const req = this.data.requests.find((r) => r.id === requestId);
    if (!req) return false;

    req.moderationStatus = 'active';
    const session = this.getSession();
    const adminId = session ? session.id : 'ADM-001';

    const newEvent: ModerationEvent = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      adminId,
      action: 'request_restored',
      targetType: 'request',
      targetId: requestId,
      note: 'Request visibility restored by administrator.',
      createdAt: new Date().toISOString(),
    };
    this.data.moderationEvents.unshift(newEvent);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'blood_request_restored',
      targetType: 'request',
      targetId: requestId,
      relatedRequestId: requestId,
      relatedUserId: req.requesterUserId,
      note: 'Request visibility restored by administrator.',
    });

    return true;
  }

  // ==========================================
  // REPORTS
  // ==========================================
  public getReports(includeArchived = false): Report[] {
    if (includeArchived) {
      return [...this.data.reports];
    }
    const archivedIds = new Set(
      this.data.archivedItems
        .filter((i) => i.category === 'reports')
        .map((i) => i.recordId),
    );
    return this.data.reports.filter((r) => !archivedIds.has(r.id));
  }

  public getReport(id: string): Report | undefined {
    return this.data.reports.find((r) => r.id === id);
  }

  public startReportReview(reportId: string): boolean {
    const rep = this.data.reports.find((r) => r.id === reportId);
    if (!rep) return false;

    rep.status = 'under_review';
    const session = this.getSession();
    const adminId = session ? session.id : 'ADM-001';

    const newEvent: ModerationEvent = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      adminId,
      action: 'report_review_started',
      targetType: 'report',
      targetId: reportId,
      note: 'Administrator commenced formal review of report signals.',
      createdAt: new Date().toISOString(),
    };
    this.data.moderationEvents.unshift(newEvent);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'report_review_started',
      targetType: 'report',
      targetId: reportId,
      relatedReportId: reportId,
      relatedRequestId: rep.requestId,
      relatedUserId: rep.reportedUserId || rep.reporterUserId,
      note: 'Administrator commenced formal review of report signals.',
    });

    return true;
  }

  public resolveReport(reportId: string, adminNote?: string): boolean {
    const rep = this.data.reports.find((r) => r.id === reportId);
    if (!rep) return false;

    rep.status = 'resolved';
    rep.resolvedAt = new Date().toISOString();
    if (adminNote) rep.adminNote = adminNote;

    const session = this.getSession();
    const adminId = session ? session.id : 'ADM-001';

    const newEvent: ModerationEvent = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      adminId,
      action: 'report_resolved',
      targetType: 'report',
      targetId: reportId,
      note: adminNote || 'Report marked resolved after platform review.',
      createdAt: new Date().toISOString(),
    };
    this.data.moderationEvents.unshift(newEvent);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'report_resolved',
      targetType: 'report',
      targetId: reportId,
      relatedReportId: reportId,
      relatedRequestId: rep.requestId,
      relatedUserId: rep.reportedUserId || rep.reporterUserId,
      note: adminNote || 'Report marked resolved after platform review.',
    });

    return true;
  }

  public dismissReport(reportId: string, adminNote?: string): boolean {
    const rep = this.data.reports.find((r) => r.id === reportId);
    if (!rep) return false;

    rep.status = 'dismissed';
    rep.resolvedAt = new Date().toISOString();
    if (adminNote) rep.adminNote = adminNote;

    const session = this.getSession();
    const adminId = session ? session.id : 'ADM-001';

    const newEvent: ModerationEvent = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      adminId,
      action: 'report_dismissed',
      targetType: 'report',
      targetId: reportId,
      note: adminNote || 'Report dismissed after review; no action required.',
      createdAt: new Date().toISOString(),
    };
    this.data.moderationEvents.unshift(newEvent);
    this.saveData(this.data);

    this.createAuditLog({
      action: 'report_dismissed',
      targetType: 'report',
      targetId: reportId,
      relatedReportId: reportId,
      relatedRequestId: rep.requestId,
      relatedUserId: rep.reportedUserId || rep.reporterUserId,
      note: adminNote || 'Report dismissed after review; no action required.',
    });

    return true;
  }

  // ==========================================
  // MODERATION EVENTS (RECORD-SPECIFIC)
  // ==========================================
  public getModerationEvents(targetType?: 'user' | 'request' | 'report', targetId?: string): ModerationEvent[] {
    let events = [...this.data.moderationEvents];
    if (targetType) {
      events = events.filter((e) => e.targetType === targetType);
    }
    if (targetId) {
      events = events.filter((e) => e.targetId === targetId);
    }
    return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==========================================
  // HELPERS FOR CROSS-RELATION
  // ==========================================
  public getRequestsForUser(userId: string): { asRequester: BloodRequest[]; asDonor: BloodRequest[] } {
    return {
      asRequester: this.data.requests.filter((r) => r.requesterUserId === userId),
      asDonor: this.data.requests.filter((r) => r.selectedDonorUserId === userId),
    };
  }

  public getReportsForUser(userId: string): { filedBy: Report[]; filedAgainst: Report[] } {
    return {
      filedBy: this.data.reports.filter((r) => r.reporterUserId === userId),
      filedAgainst: this.data.reports.filter((r) => r.reportedUserId === userId),
    };
  }

  public getReportsForRequest(requestId: string): Report[] {
    return this.data.reports.filter((r) => r.requestId === requestId);
  }

  public getModerationHistoryForAdmin(adminId: string): (ModerationEvent | AuditLog)[] {
    const adminAudit = this.data.auditLogs.filter((a) => a.adminId === adminId);
    return adminAudit;
  }

  public resetToDefaults(): void {
    const fresh: AppDatabase = {
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
      requests: JSON.parse(JSON.stringify(INITIAL_REQUESTS)),
      reports: JSON.parse(JSON.stringify(INITIAL_REPORTS)),
      moderationEvents: JSON.parse(JSON.stringify(INITIAL_MODERATION_EVENTS)),
      adminAccounts: JSON.parse(JSON.stringify(INITIAL_ADMIN_ACCOUNTS)),
      auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
      archivedItems: JSON.parse(JSON.stringify(INITIAL_ARCHIVED_ITEMS)),
    };
    this.data = fresh;
    this.saveData(fresh);
  }
}

export const dataService = new DataService();
