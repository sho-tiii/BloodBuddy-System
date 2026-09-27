import React from 'react';
import {
  IdentityStatus,
  AccountStatus,
  RequestStatus,
  DonorDonationStatus,
  ModerationStatus,
  ReportStatus,
} from '../../types';

export const IdentityBadge: React.FC<{ status: IdentityStatus }> = ({ status }) => {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#557A61] bg-[#EDF4EE] rounded-md border border-[#557A61]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#557A61]" />
          Identity Verified
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#9A6014] bg-[#FCF5E8] rounded-md border border-[#9A6014]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A6014]" />
          Pending
        </span>
      );
    case 'needs_attention':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#A92F35] bg-[#F7EAE7] rounded-md border border-[#A92F35]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A92F35]" />
          Needs Attention
        </span>
      );
    case 'not_verified':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#746C68] bg-[#F0ECE7] rounded-md border border-[#E6DDD7]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#958B86]" />
          Not Verified
        </span>
      );
  }
};

export const AccountStatusBadge: React.FC<{ status: AccountStatus }> = ({ status }) => {
  if (status === 'restricted') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#A92F35] bg-[#F7EAE7] rounded-md border border-[#A92F35]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A92F35]" />
        Restricted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#292525] bg-[#FAF7F2] rounded-md border border-[#E6DDD7]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#557A61]" />
      Active
    </span>
  );
};

export const RequestStatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  switch (status) {
    case 'fulfilled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#557A61] bg-[#EDF4EE] rounded-md border border-[#557A61]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#557A61]" />
          Request Fulfilled
        </span>
      );
    case 'accepted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#2E5E8A] bg-[#EEF4FA] rounded-md border border-[#2E5E8A]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E5E8A]" />
          Donor Accepted
        </span>
      );
    case 'in_coordination':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#8F5206] bg-[#FCF6E8] rounded-md border border-[#8F5206]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8F5206]" />
          In Coordination
        </span>
      );
    case 'awaiting_response':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#746C68] bg-[#F2EFE9] rounded-md border border-[#E6DDD7]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#958B86]" />
          Awaiting Response
        </span>
      );
    case 'declined':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#746C68] bg-[#F2EFE9] rounded-md border border-[#E6DDD7]">
          Declined
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#958B86] bg-[#F2EFE9] rounded-md border border-[#E6DDD7]">
          Cancelled
        </span>
      );
  }
};

export const DonorDonationBadge: React.FC<{ status: DonorDonationStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#557A61]">
          Donation Completed
        </span>
      );
    case 'awaiting_confirmation':
      return (
        <span className="inline-flex items-center gap-1 text-[13px] font-normal text-[#8F5206]">
          Awaiting Confirmation
        </span>
      );
    case 'did_not_donate':
      return (
        <span className="inline-flex items-center gap-1 text-[13px] font-normal text-[#746C68]">
          Did Not Donate
        </span>
      );
    case 'not_applicable':
    default:
      return <span className="text-[13px] text-[#958B86]">—</span>;
  }
};

export const ModerationBadge: React.FC<{ status: ModerationStatus }> = ({ status }) => {
  if (status === 'removed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#A92F35] bg-[#F7EAE7] rounded-md border border-[#A92F35]/20">
        Removed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#557A61] bg-[#EDF4EE] rounded-md border border-[#557A61]/20">
      Active
    </span>
  );
};

export const ReportStatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  switch (status) {
    case 'open':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#A92F35] bg-[#F7EAE7] rounded-md border border-[#A92F35]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A92F35]" />
          Open
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#9A6014] bg-[#FCF5E8] rounded-md border border-[#9A6014]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A6014]" />
          Under Review
        </span>
      );
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#557A61] bg-[#EDF4EE] rounded-md border border-[#557A61]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#557A61]" />
          Resolved
        </span>
      );
    case 'dismissed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#746C68] bg-[#F0ECE7] rounded-md border border-[#E6DDD7]">
          Dismissed
        </span>
      );
  }
};

export const AdminRoleBadge: React.FC<{ role: 'admin' | 'super_admin' }> = ({ role }) => {
  if (role === 'super_admin') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12.5px] font-semibold text-[#8F272D] bg-[#F7EAE7] rounded-md border border-[#A92F35]/30 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A92F35]" />
        Super Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12.5px] font-semibold text-[#292525] bg-[#F0ECE7] rounded-md border border-[#D5CDC6]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#746C68]" />
      Admin
    </span>
  );
};

export const AdminAccountStatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  if (status === 'inactive') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12.5px] font-medium text-[#746C68] bg-[#F0ECE7] rounded-md border border-[#E6DDD7]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#958B86]" />
        Inactive
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12.5px] font-medium text-[#557A61] bg-[#EDF4EE] rounded-md border border-[#557A61]/25">
      <span className="w-1.5 h-1.5 rounded-full bg-[#557A61]" />
      Active
    </span>
  );
};
