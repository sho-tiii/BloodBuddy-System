import React from 'react';
import {
  Users as UsersIcon,
  Droplets,
  HeartHandshake,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { NavigationTarget } from '../../types';
import { ReportStatusBadge, RequestStatusBadge } from '../common/Badge';

interface OverviewViewProps {
  onNavigate: (target: NavigationTarget) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const stats = dataService.getOverviewStats();
  const reports = dataService.getReports().slice(0, 5);
  const requests = dataService.getRequests().slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-[12px] font-bold tracking-[0.12em] text-[#A92F35] uppercase mb-1">
          ADMIN OVERVIEW
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#292525] font-serif tracking-tight">
          Overview
        </h1>
        <p className="text-[15px] text-[#746C68] mt-1">
          Review BloodBuddy platform activity and moderation items.
        </p>
      </div>

      {/* 4 Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* TOTAL ACCOUNTS */}
        <div
          id="stat-card-accounts"
          className="bg-white border border-[#E6DDD7] rounded-[16px] p-5 shadow-[0_2px_8px_rgba(41,37,37,0.03)] hover:border-[#A92F35]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold tracking-wider text-[#746C68] uppercase">
              Total Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#746C68] flex items-center justify-center">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#292525] leading-none mb-1">
            {stats.totalAccounts}
          </div>
          <p className="text-[12.5px] text-[#958B86]">Registered community accounts</p>
        </div>

        {/* ACTIVE BLOOD REQUESTS */}
        <div
          id="stat-card-active-requests"
          className="bg-white border border-[#E6DDD7] rounded-[16px] p-5 shadow-[0_2px_8px_rgba(41,37,37,0.03)] hover:border-[#A92F35]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold tracking-wider text-[#746C68] uppercase">
              Active Blood Requests
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#292525] leading-none mb-1">
            {stats.activeRequests}
          </div>
          <p className="text-[12.5px] text-[#958B86]">Awaiting response, accepted, or in coordination</p>
        </div>

        {/* AVAILABLE POTENTIAL DONORS */}
        <div
          id="stat-card-donors"
          className="bg-white border border-[#E6DDD7] rounded-[16px] p-5 shadow-[0_2px_8px_rgba(41,37,37,0.03)] hover:border-[#557A61]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold tracking-wider text-[#746C68] uppercase">
              Available Potential Donors
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EDF4EE] text-[#557A61] flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#292525] leading-none mb-1">
            {stats.availableDonors}
          </div>
          <p className="text-[12px] text-[#746C68] leading-tight">
            Self-reported blood type &amp; availability enabled. <span className="text-[#958B86]">Not medically verified.</span>
          </p>
        </div>

        {/* OPEN REPORTS */}
        <div
          id="stat-card-reports"
          className="bg-white border border-[#E6DDD7] rounded-[16px] p-5 shadow-[0_2px_8px_rgba(41,37,37,0.03)] hover:border-[#A92F35]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold tracking-wider text-[#746C68] uppercase">
              Open Reports
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#A92F35] leading-none mb-1">
            {stats.openReports}
          </div>
          <p className="text-[12.5px] text-[#958B86]">Reports requiring administrative review</p>
        </div>
      </div>

      {/* Critical Platform Boundary Callout */}
      <div className="bg-[#FAF7F2] border border-[#E6DDD7] rounded-[14px] p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#A92F35] shrink-0 mt-0.5" />
        <div className="text-[13px] text-[#746C68] leading-relaxed">
          <strong className="text-[#292525] font-semibold">Medical Verification Boundary: </strong>
          BloodBuddy Admin administers platform accounts and community moderation only. Blood types and donor
          availability are self-reported by community members. Final donor health screening, medical eligibility,
          blood testing, and compatibility testing remain the sole responsibility of accredited healthcare facilities.
        </div>
      </div>

      {/* Recent Activity Dual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT REPORTS */}
        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#292525]">Recent Reports</h2>
              <p className="text-[13px] text-[#746C68]">Moderation signals reported by community members</p>
            </div>
            <button
              type="button"
              id="view-all-reports-btn"
              onClick={() => onNavigate({ view: 'reports' })}
              className="text-[13.5px] font-semibold text-[#A92F35] hover:text-[#8F272D] flex items-center gap-1 transition-colors"
            >
              <span>View All Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                id={`recent-report-${report.id}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6DDD7] hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-[#292525] truncate">
                      {report.reason}
                    </span>
                    <span className="text-[12px] font-mono text-[#958B86]">#{report.id}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[12.5px] text-[#746C68]">
                    {report.requestId && <span>Related request #{report.requestId}</span>}
                    <ReportStatusBadge status={report.status} />
                  </div>
                </div>

                <button
                  type="button"
                  id={`review-report-btn-${report.id}`}
                  onClick={() => onNavigate({ view: 'report_details', reportId: report.id })}
                  className="shrink-0 px-3 py-1.5 text-[13px] font-medium text-[#A92F35] hover:bg-[#F7EAE7] rounded-md transition-colors flex items-center gap-1"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT BLOOD REQUEST ACTIVITY */}
        <div className="bg-white border border-[#E6DDD7] rounded-[16px] p-6 shadow-[0_2px_8px_rgba(41,37,37,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#292525]">Recent Blood Request Activity</h2>
              <p className="text-[13px] text-[#746C68]">Recent listings and coordination status updates</p>
            </div>
            <button
              type="button"
              id="view-all-requests-btn"
              onClick={() => onNavigate({ view: 'requests' })}
              className="text-[13.5px] font-semibold text-[#A92F35] hover:text-[#8F272D] flex items-center gap-1 transition-colors"
            >
              <span>View All Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                id={`recent-request-${request.id}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6DDD7] hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13.5px] font-bold font-mono text-[#292525]">
                      #{request.id}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-bold text-[#A92F35] bg-[#F7EAE7] rounded">
                      {request.bloodTypeNeeded}
                    </span>
                    <span className="text-[13px] text-[#746C68] truncate">
                      {request.healthcareFacility}
                    </span>
                  </div>
                  <div>
                    <RequestStatusBadge status={request.requestStatus} />
                  </div>
                </div>

                <button
                  type="button"
                  id={`view-request-btn-${request.id}`}
                  onClick={() => onNavigate({ view: 'request_details', requestId: request.id })}
                  className="shrink-0 px-3 py-1.5 text-[13px] font-medium text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2] rounded-md transition-colors flex items-center gap-1"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
