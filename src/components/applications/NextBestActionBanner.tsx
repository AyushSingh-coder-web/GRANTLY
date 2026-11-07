import React from 'react';
import { Link } from 'react-router-dom';
import { NextBestActionResult } from '../../services/nextBestAction';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface NextBestActionBannerProps {
  action: NextBestActionResult;
  scholarshipTitle?: string;
}

export const NextBestActionBanner: React.FC<NextBestActionBannerProps> = ({
  action,
  scholarshipTitle,
}) => {
  const getIcon = () => {
    switch (action.category) {
      case 'document':
        return FileText;
      case 'submission':
        return Sparkles;
      case 'profile':
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  const Icon = getIcon();

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#635BFF]/30 bg-gradient-to-r from-[#635BFF]/10 via-[#8B5CF6]/10 to-[#14B8A6]/10 dark:from-[#635BFF]/20 dark:via-[#8B5CF6]/20 dark:to-[#14B8A6]/20 p-5 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#635BFF] text-white shadow-xs shrink-0 mt-0.5">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
                Next Best Action
              </span>
              {scholarshipTitle && (
                <span className="text-xs text-[#697386] dark:text-gray-400 font-medium">
                  • for {scholarshipTitle}
                </span>
              )}
              {action.priority === 'critical' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white">
                  High Priority
                </span>
              )}
            </div>
            <h4 className="text-base font-bold text-[#151827] dark:text-white">
              {action.actionText}
            </h4>
            <p className="text-xs text-[#697386] dark:text-gray-400 mt-0.5 max-w-2xl leading-relaxed">
              {action.actionSubtext}
            </p>
          </div>
        </div>

        <Link
          to={action.targetRoute}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <span>{action.ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
