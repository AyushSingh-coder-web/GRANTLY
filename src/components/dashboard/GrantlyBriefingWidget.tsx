import React from 'react';
import { Link } from 'react-router-dom';
import { DeadlineItem } from '../../types';
import { GrantlyBriefing } from '../../services/deadlineRisk';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface GrantlyBriefingWidgetProps {
  briefing: GrantlyBriefing;
  criticalDeadlines: DeadlineItem[];
}

export const GrantlyBriefingWidget: React.FC<GrantlyBriefingWidgetProps> = ({
  briefing,
  criticalDeadlines,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#151827] to-[#1E2238] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-800 relative overflow-hidden mb-8">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#635BFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Briefing Intro */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#635BFF] text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              Your GRANTLY Briefing
            </span>
            <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-semibold">
              Live Intelligence
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-white leading-snug">
            {briefing.urgentAction}
          </h2>

          <p className="text-xs text-gray-300 leading-relaxed">
            {briefing.highRiskCount > 0
              ? `You have ${briefing.highRiskCount} time-sensitive opportunity requiring action before deadlines lapse.`
              : 'All your saved applications and document requirements are currently well-balanced. Review new matches below.'}
          </p>
        </div>

        {/* Right Side: Quick Action Pills */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto shrink-0">
          <Link
            to="/dashboard/applications"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap"
          >
            <span>Open Application Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/dashboard/documents"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-all whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-teal-300" />
            <span>Manage Document Vault</span>
          </Link>
        </div>
      </div>

      {/* Mini Grid: Time-Sensitive Items Checklist */}
      {criticalDeadlines.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3">
          {criticalDeadlines.map((item) => (
            <Link
              key={item.id}
              to="/dashboard/applications"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="font-semibold text-rose-300">
                    {item.daysRemaining <= 0 ? 'Due Today' : `${item.daysRemaining} days left`}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-[#8B5CF6] transition-colors">
                  {item.scholarshipTitle}
                </h4>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                  {item.nextRecommendedAction}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
