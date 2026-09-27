import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Clock,
  Heart,
  AlertTriangle,
  History,
  Info,
  ArrowRight,
  Droplets,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget } from '../../types';
import {
  IdentityBadge,
  AccountStatusBadge,
  RequestStatusBadge,
  DonorDonationBadge,
  ReportStatusBadge,
} from '../common/Badge';
import { RestrictAccountModal, ReactivateAccountModal } from '../modals/ModerationModals';
import { useToast } from '../ui/ToastContext';

interface UserDetailsViewProps {
  userId: string;
  onNavigate: (target: NavigationTarget) => void;
}

export const UserDetailsView: React.FC<UserDetailsViewProps> = ({ userId, onNavigate }) => {
  const { addToast } = useToast();
  const [, setTick] = useState(0); // For forcing re-render after state changes

  const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);

  const user = dataService.getUser(userId);

  if (!user) {
    return (
      <div className="max-w-[800px] mx-auto p-8 text-center space-y-4">
        <h2 className="text-[24px] font-bold text-[#292525] font-serif">
          We couldn’t find this account.
        </h2>
        <p className="text-[14px] text-[#746C68]">
          The account with identifier <code className="font-mono text-[#A92F35]">{userId}</code> does
          not exist or may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'users' })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#A92F35] text-white text-[14px] font-medium rounded-lg hover:bg-[#8F272D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>
      </div>
    );
  }

  const { asRequester, asDonor } = dataService.getRequestsForUser(user.id);
  const { filedBy, filedAgainst } = dataService.getReportsForUser(user.id);
  const moderationEvents = dataService.getModerationEvents('user', user.id);

  const handleRestrict = (reason: string, note?: string) => {
    const success = dataService.restrictUser(user.id, reason, note);
    if (success) {
      setTick((t) => t + 1);
      addToast('Account restricted', 'The account has been restricted.', 'danger');
    }
  };

  const handleReactivate = () => {
    const success = dataService.reactivateUser(user.id);
    if (success) {
      setTick((t) => t + 1);
      addToast('Account reactivated', 'Normal platform access has been restored.', 'success');
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 lg:p-8 space-y-8">
      {/* Return to Users */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'users' })}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#746C68] hover:text-[#A92F35] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Users</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
              USER ACCOUNT
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <span className="font-mono text-[14px] text-[#746C68] bg-[#FAF7F2] border border-[#E6DDD7] px-2.5 py-1 rounded-md">
                {user.id}
              </span>
              <AccountStatusBadge status={user.accountStatus} />
            </div>
          </div>

          {/* Account Moderation Actions */}
          <div className="flex items-center gap-3">
            {user.accountStatus === 'active' ? (
              <button
                type="button"
                id="restrict-account-action-btn"
                onClick={() => setIsRestrictModalOpen(true)}
                className="px-4 py-2 text-[14px] font-medium text-[#A92F35] bg-[#F7EAE7] hover:bg-[#A92F35] hover:text-white border border-[#A92F35]/30 rounded-lg transition-colors shadow-sm"
              >
                Restrict Account
              </button>
            ) : (
              <button
                type="button"
                id="reactivate-account-action-btn"
                onClick={() => setIsReactivateModalOpen(true)}
                className="px-4 py-2 text-[14px] font-medium text-[#557A61] bg-[#EDF4EE] hover:bg-[#557A61] hover:text-white border border-[#557A61]/30 rounded-lg transition-colors shadow-sm"
              >
                Reactivate Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Account, Identity, Blood & Donation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SECTION 1: ACCOUNT */}
        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6DDD7] pb-3">
            <Shield className="w-4 h-4 text-[#746C68]" />
            <h2 className="text-[16px] font-bold text-[#292525]">Account</h2>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider">
              Email Address
            </div>
            <div className="text-[14px] font-medium text-[#292525] mt-0.5 break-all">{user.email}</div>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider">
              Joined Date
            </div>
            <div className="text-[14px] text-[#292525] mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#958B86]" />
              <span>{formatDateTime(user.joinedAt)}</span>
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider">
              Account Status
            </div>
            <div className="mt-1">
              <AccountStatusBadge status={user.accountStatus} />
            </div>
          </div>

          {user.locationArea && (
            <div>
              <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider">
                General Area
              </div>
              <div className="text-[14px] text-[#292525] mt-0.5">{user.locationArea}</div>
            </div>
          )}
        </div>

        {/* SECTION 2: IDENTITY */}
        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6DDD7] pb-3">
            <Shield className="w-4 h-4 text-[#746C68]" />
            <h2 className="text-[16px] font-bold text-[#292525]">Identity</h2>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider">
              Identity Status
            </div>
            <div className="mt-1.5">
              <IdentityBadge status={user.identityStatus} />
            </div>
          </div>

          {/* Mandatory Identity Boundary Disclaimer */}
          <div className="p-3 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-[#746C68] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#746C68] leading-relaxed">
              Identity status applies to account identity only. It does not verify blood type, donor
              eligibility, or blood compatibility.
            </p>
          </div>
        </div>

        {/* SECTION 3: BLOOD & DONATION */}
        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6DDD7] pb-3">
            <Heart className="w-4 h-4 text-[#A92F35]" />
            <h2 className="text-[16px] font-bold text-[#292525]">Blood &amp; Donation</h2>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider">
              Listed Blood Type
            </div>
            <div className="mt-1">
              {user.bloodType === 'not_provided' ? (
                <span className="text-[14px] text-[#958B86]">Not provided</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-bold text-[#292525]">{user.bloodType}</span>
                  <span className="text-[12px] font-medium text-[#746C68] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E6DDD7]">
                    Self-reported
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-[#958B86] uppercase tracking-wider">
              Potential Availability
            </div>
            <div className="mt-1 text-[14px] font-medium text-[#292525]">
              {user.donorAvailability === 'available' ? (
                <span className="inline-flex items-center gap-1.5 text-[#557A61]">
                  <span className="w-2 h-2 rounded-full bg-[#557A61]" />
                  Available to Donate
                </span>
              ) : (
                <span className="text-[#958B86]">Not Available</span>
              )}
            </div>
          </div>

          {/* Mandatory Self-reported disclaimer */}
          <div className="p-3 bg-[#FAF7F2] border border-[#E6DDD7] rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-[#746C68] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#746C68] leading-relaxed">
              Blood type is provided by the user and is not independently verified by BloodBuddy.
              Availability indicates potential willingness, not medical eligibility.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: PLATFORM ACTIVITY */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-6">
        <div>
          <h2 className="text-[18px] font-bold text-[#292525]">Platform Activity</h2>
          <p className="text-[13px] text-[#746C68] mt-0.5">
            Factual history of blood requests created, donation interactions, and moderation reports.
          </p>
        </div>

        {/* Requests Created */}
        <div>
          <h3 className="text-[14px] font-bold text-[#292525] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#A92F35]" />
            <span>Blood Requests Created ({asRequester.length})</span>
          </h3>

          {asRequester.length === 0 ? (
            <p className="text-[13px] text-[#958B86] italic bg-[#FAF7F2] p-3 rounded-lg border border-[#E6DDD7]">
              No blood requests created by this account.
            </p>
          ) : (
            <div className="space-y-2">
              {asRequester.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E6DDD7] hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[13.5px] font-bold text-[#292525]">#{req.id}</span>
                    <span className="px-2 py-0.5 text-[11px] font-bold text-[#A92F35] bg-[#F7EAE7] rounded">
                      {req.bloodTypeNeeded}
                    </span>
                    <span className="text-[13.5px] text-[#746C68]">{req.healthcareFacility}</span>
                    <RequestStatusBadge status={req.requestStatus} />
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate({ view: 'request_details', requestId: req.id })}
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-[#A92F35] hover:text-[#8F272D]"
                  >
                    <span>View Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requests where Selected as Donor */}
        <div>
          <h3 className="text-[14px] font-bold text-[#292525] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#557A61]" />
            <span>Selected Potential Donor History ({asDonor.length})</span>
          </h3>

          {asDonor.length === 0 ? (
            <p className="text-[13px] text-[#958B86] italic bg-[#FAF7F2] p-3 rounded-lg border border-[#E6DDD7]">
              This account has not been selected as a potential donor on any requests.
            </p>
          ) : (
            <div className="space-y-2">
              {asDonor.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E6DDD7] hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[13.5px] font-bold text-[#292525]">#{req.id}</span>
                    <span className="text-[13.5px] text-[#746C68]">{req.healthcareFacility}</span>
                    <RequestStatusBadge status={req.requestStatus} />
                    <span className="text-[13px] text-[#746C68]">
                      Donation: <DonorDonationBadge status={req.donorDonationStatus} />
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate({ view: 'request_details', requestId: req.id })}
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-[#A92F35] hover:text-[#8F272D]"
                  >
                    <span>View Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reports Involving This Account */}
        <div>
          <h3 className="text-[14px] font-bold text-[#292525] uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#A92F35]" />
            <span>Reports Involving This Account</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Reports Filed By User */}
            <div className="border border-[#E6DDD7] rounded-xl p-4 bg-[#FAF7F2]/40">
              <div className="text-[13px] font-semibold text-[#292525] mb-2">
                Reports Filed by User ({filedBy.length})
              </div>
              {filedBy.length === 0 ? (
                <p className="text-[12.5px] text-[#958B86]">No reports filed.</p>
              ) : (
                <div className="space-y-2">
                  {filedBy.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-white p-2.5 rounded-lg border border-[#E6DDD7] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-[#292525]">{rep.reason}</div>
                        <div className="text-[11.5px] text-[#958B86]">#{rep.id}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReportStatusBadge status={rep.status} />
                        <button
                          type="button"
                          onClick={() => onNavigate({ view: 'report_details', reportId: rep.id })}
                          className="text-[12px] font-medium text-[#A92F35] hover:underline"
                        >
                          Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reports Filed Against User */}
            <div className="border border-[#E6DDD7] rounded-xl p-4 bg-[#FAF7F2]/40">
              <div className="text-[13px] font-semibold text-[#292525] mb-2">
                Reports Involving Misconduct Signals ({filedAgainst.length})
              </div>
              {filedAgainst.length === 0 ? (
                <p className="text-[12.5px] text-[#958B86]">No reports filed against this account.</p>
              ) : (
                <div className="space-y-2">
                  {filedAgainst.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-white p-2.5 rounded-lg border border-[#E6DDD7] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-[#292525]">{rep.reason}</div>
                        <div className="text-[11.5px] text-[#958B86]">#{rep.id}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReportStatusBadge status={rep.status} />
                        <button
                          type="button"
                          onClick={() => onNavigate({ view: 'report_details', reportId: rep.id })}
                          className="text-[12px] font-medium text-[#A92F35] hover:underline"
                        >
                          Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: MODERATION HISTORY */}
      <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E6DDD7] pb-3">
          <History className="w-4 h-4 text-[#746C68]" />
          <h2 className="text-[16px] font-bold text-[#292525]">Moderation History</h2>
        </div>

        {moderationEvents.length === 0 ? (
          <p className="text-[13px] text-[#958B86] italic">No moderation actions recorded for this user.</p>
        ) : (
          <div className="space-y-3">
            {moderationEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-lg border border-[#E6DDD7] bg-[#FAF7F2]/50 text-[13px] space-y-1"
              >
                <div className="flex items-center justify-between font-medium text-[#292525]">
                  <span className="capitalize text-[#A92F35] font-semibold">
                    {evt.action.replace('_', ' ')}
                  </span>
                  <span className="text-[12px] text-[#958B86]">{formatDateTime(evt.createdAt)}</span>
                </div>
                {evt.reason && (
                  <div className="text-[#746C68]">
                    <strong>Reason:</strong> {evt.reason}
                  </div>
                )}
                {evt.note && (
                  <div className="text-[#746C68]">
                    <strong>Note:</strong> {evt.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <RestrictAccountModal
        isOpen={isRestrictModalOpen}
        onClose={() => setIsRestrictModalOpen(false)}
        userName={`${user.firstName} ${user.lastName}`}
        onConfirm={handleRestrict}
      />

      <ReactivateAccountModal
        isOpen={isReactivateModalOpen}
        onClose={() => setIsReactivateModalOpen(false)}
        userName={`${user.firstName} ${user.lastName}`}
        onConfirm={handleReactivate}
      />
    </div>
  );
};
