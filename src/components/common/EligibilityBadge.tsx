import React from 'react';
import { EligibilityStatus } from '../../types';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  matchScore?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  status,
  matchScore,
  showScore = true,
  size = 'md',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'eligible':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Eligible',
          icon: CheckCircle2,
        };
      case 'potentially_eligible':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Potentially Eligible',
          icon: AlertCircle,
        };
      case 'not_eligible':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Not Eligible',
          icon: XCircle,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <div
      className={`inline-flex items-center rounded-md border ${config.bg} ${sizeClasses[size]} transition-colors`}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      <span>{config.label}</span>
      {showScore && matchScore !== undefined && (
        <>
          <span className="opacity-40">|</span>
          <span className="font-semibold">{matchScore}% match</span>
        </>
      )}
    </div>
  );
};
