import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Donor } from '../../types';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

interface DonorCardProps {
  donor: Donor;
  onConnect?: (donor: Donor) => void;
  onSelect?: (donor: Donor) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  actionLabel?: string;
  id?: string;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  onConnect,
  onSelect,
  isSelectable = false,
  isSelected = false,
  actionLabel = 'Connect with Donor',
  id,
}) => {
  return (
    <Card
      id={id || `donor-card-${donor.id}`}
      padding="md"
      className={`relative flex flex-col justify-between transition-all duration-150 ${
        isSelected
          ? 'border-[#A92F35] ring-2 ring-[#A92F35]/15 bg-[#FFFDFD]'
          : 'hover:border-[#D8CCC5] hover:shadow-[0_4px_12px_rgba(41,37,37,0.06)]'
      }`}
    >
      <div>
        {/* Top row: Blood Type and Availability Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-[#F7EAE7] text-[#A92F35] font-heading font-bold text-lg flex items-center justify-center border border-[#F0D5D1]">
              {donor.bloodType}
            </span>
            <span className="text-xs font-medium text-[#746C68]">
              Potential Volunteer Donor
            </span>
          </div>

          <StatusBadge
            status={donor.available ? 'Available to Donate' : 'Unavailable'}
            variant={donor.available ? 'available' : 'declined'}
            size="sm"
          />
        </div>

        {/* Location & Proximity */}
        <div className="space-y-1.5 mt-3 pt-3 border-t border-[#F0EAE5]">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#292525]">
            <MapPin className="w-3.5 h-3.5 text-[#A92F35] flex-shrink-0" />
            <span className="truncate">{donor.generalLocation}</span>
          </div>
          <p className="text-xs text-[#746C68] pl-5">
            {donor.proximity}
          </p>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-4 pt-3 border-t border-[#F0EAE5]">
        {isSelectable ? (
          <Button
            id={`select-donor-btn-${donor.id}`}
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            className="w-full"
            onClick={() => onSelect && onSelect(donor)}
          >
            {isSelected ? 'Selected Donor ✓' : 'Select This Donor'}
          </Button>
        ) : (
          <Button
            id={`connect-donor-btn-${donor.id}`}
            variant="primary"
            size="sm"
            className="w-full"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => onConnect && onConnect(donor)}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
