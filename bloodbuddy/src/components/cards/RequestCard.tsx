import React from 'react';
import { MapPin, Building2, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BloodType } from '../../types';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

interface RequestCardProps {
  id?: string;
  requestId: string;
  bloodType: BloodType;
  healthcareFacility: string;
  location: string;
  dateNeeded: string;
  status: string;
  proximity?: string;
  receivedTime?: string;
  actionLabel?: string;
  onAction: () => void;
  type?: 'requester' | 'donor';
}

export const RequestCard: React.FC<RequestCardProps> = ({
  id,
  requestId,
  bloodType,
  healthcareFacility,
  location,
  dateNeeded,
  status,
  proximity,
  receivedTime,
  actionLabel = 'View Request',
  onAction,
  type = 'requester',
}) => {
  return (
    <Card
      id={id || `req-card-${requestId}`}
      padding="md"
      className="hover:border-[#D8CCC5] hover:shadow-[0_4px_12px_rgba(41,37,37,0.05)] transition-all duration-150"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#F0EAE5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7EAE7] text-[#A92F35] font-heading font-bold text-lg flex items-center justify-center border border-[#F0D5D1] flex-shrink-0">
            {bloodType}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#746C68] tracking-wider uppercase">
                {requestId}
              </span>
              {receivedTime && (
                <span className="text-[11px] text-[#958B86] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {receivedTime}
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-[#292525] mt-0.5">
              {healthcareFacility}
            </h3>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3.5 text-xs text-[#746C68]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#A92F35] flex-shrink-0" />
          <span className="truncate">
            {location}
            {proximity ? ` (${proximity})` : ''}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#A92F35] flex-shrink-0" />
          <span className="truncate">Needed: {dateNeeded}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:col-span-2 md:col-span-1">
          <Building2 className="w-3.5 h-3.5 text-[#746C68] flex-shrink-0" />
          <span className="truncate">Clinical setting</span>
        </div>
      </div>

      <div className="pt-3 border-t border-[#F0EAE5] flex justify-end">
        <Button
          id={`view-action-btn-${requestId.replace('#', '')}`}
          variant={
            status === 'Needs your response'
              ? 'primary'
              : status === 'Donor accepted'
              ? 'secondary'
              : 'outline'
          }
          size="sm"
          onClick={onAction}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
};
