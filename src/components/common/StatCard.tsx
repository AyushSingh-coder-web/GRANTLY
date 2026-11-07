import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'urgent';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = 'text-[#635BFF]',
  trend,
  trendType = 'neutral',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-[#E8EAF1] shadow-xs hover:border-[#635BFF]/30 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#697386]">
          {label}
        </span>
        <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[#151827]">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              trendType === 'urgent'
                ? 'bg-rose-50 text-rose-700'
                : trendType === 'positive'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-[#697386] line-clamp-1">
          {subtext}
        </p>
      )}
    </div>
  );
};

