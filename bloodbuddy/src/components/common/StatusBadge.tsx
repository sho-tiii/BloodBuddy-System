import React from 'react';

export type BadgeVariant =
  | 'awaiting'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'completed'
  | 'needs-response'
  | 'available'
  | 'verified'
  | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  id?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  id,
  size = 'md',
}) => {
  // Derive variant if not explicitly passed
  let resolvedVariant: BadgeVariant = variant || 'neutral';
  const lower = status.toLowerCase();

  if (!variant) {
    if (lower.includes('no donation recorded')) {
      resolvedVariant = 'neutral';
    } else if (lower.includes('fulfilled')) {
      resolvedVariant = 'completed';
    } else if (lower.includes('awaiting')) {
      resolvedVariant = 'awaiting';
    } else if (lower.includes('accepted')) {
      resolvedVariant = 'accepted';
    } else if (lower.includes('declined')) {
      resolvedVariant = 'declined';
    } else if (lower.includes('cancelled')) {
      resolvedVariant = 'cancelled';
    } else if (lower.includes('completed')) {
      resolvedVariant = 'completed';
    } else if (lower.includes('needs') || lower.includes('response')) {
      resolvedVariant = 'needs-response';
    } else if (lower.includes('available') || lower.includes('donate')) {
      resolvedVariant = 'available';
    } else if (lower.includes('verified')) {
      resolvedVariant = 'verified';
    }
  }

  const styles: Record<BadgeVariant, string> = {
    awaiting: 'bg-[#F7EAE7] text-[#A92F35] border border-[#F0D5D1]',
    accepted: 'bg-[#EDF4EE] text-[#557A61] border border-[#D5E5D8]',
    'needs-response': 'bg-[#FDF3DE] text-[#8C6418] border border-[#F2E0BA]',
    declined: 'bg-[#F5F2EF] text-[#746C68] border border-[#E6DDD7]',
    cancelled: 'bg-[#F5F2EF] text-[#958B86] border border-[#E6DDD7]',
    completed: 'bg-[#EDF4EE] text-[#557A61] border border-[#D5E5D8]',
    available: 'bg-[#EDF4EE] text-[#557A61] border border-[#D5E5D8]',
    verified: 'bg-[#EDF4EE] text-[#557A61] border border-[#D5E5D8]',
    neutral: 'bg-[#FAF7F2] text-[#746C68] border border-[#E6DDD7]',
  };

  const dotColors: Record<BadgeVariant, string> = {
    awaiting: 'bg-[#A92F35]',
    accepted: 'bg-[#557A61]',
    'needs-response': 'bg-[#B07B18]',
    declined: 'bg-[#958B86]',
    cancelled: 'bg-[#958B86]',
    completed: 'bg-[#557A61]',
    available: 'bg-[#557A61]',
    verified: 'bg-[#557A61]',
    neutral: 'bg-[#746C68]',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1.5'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      id={id}
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap select-none ${sizeClasses} ${styles[resolvedVariant]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[resolvedVariant]}`}
      />
      {status}
    </span>
  );
};
