import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scholarship } from '../../types';
import { useApp } from '../../context/AppContext';
import { assessEligibility } from '../../services/eligibilityEngine';
import { calculateDaysRemaining, getDeadlineUrgency } from '../../services/deadlineRisk';
import { EligibilityBadge } from '../common/EligibilityBadge';
import {
  Calendar,
  Bookmark,
  BookmarkCheck,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { profile, isScholarshipSaved, toggleSaveScholarship, createApplication, applications } = useApp();
  const navigate = useNavigate();

  const assessment = assessEligibility(scholarship, profile);
  const isSaved = isScholarshipSaved(scholarship.id);
  const existingApp = applications.find((a) => a.scholarshipId === scholarship.id);

  const daysRemaining = calculateDaysRemaining(scholarship.deadline);
  const urgency = getDeadlineUrgency(daysRemaining);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    createApplication(scholarship.id);
    navigate('/dashboard/applications');
  };

  const getUrgencyBadge = () => {
    if (daysRemaining < 0) {
      return <span className="text-[11px] font-semibold text-gray-500">Deadline Passed</span>;
    }
    if (urgency === 'critical') {
      return (
        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 px-2 py-0.5 rounded">
          Closing in {daysRemaining} days!
        </span>
      );
    }
    if (urgency === 'urgent') {
      return (
        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 px-2 py-0.5 rounded">
          {daysRemaining} days left
        </span>
      );
    }
    return (
      <span className="text-[11px] text-[#697386] dark:text-gray-400">
        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#E8EAF1] p-5 hover:border-[#635BFF]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-[#151827]">
              {scholarship.category}
            </span>
            {scholarship.verificationStatus === 'Verified Official' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaveScholarship(scholarship.id);
            }}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'text-[#635BFF] bg-[#635BFF]/10'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title & Provider */}
        <Link to={`/dashboard/scholarships/${scholarship.id}`} className="block group-hover:text-[#635BFF] transition-colors">
          <h3 className="font-bold text-base text-[#151827] line-clamp-2 leading-snug">
            {scholarship.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1.5 text-xs text-[#697386]">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </div>

        {/* Key Metrics Pill Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#F8F9FC] border border-[#E8EAF1]/70 text-xs">
          <div>
            <span className="block text-[10px] text-[#697386] font-medium uppercase tracking-wider">
              Award Amount
            </span>
            <span className="font-bold text-[#151827] line-clamp-1">
              {scholarship.fundingAmountDisplay}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-[#697386] font-medium uppercase tracking-wider">
              Eligible Level
            </span>
            <span className="font-medium text-[#151827] line-clamp-1">
              {scholarship.educationLevel.join(', ')}
            </span>
          </div>
        </div>

        {/* Region & Tag Line */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#697386]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span className="truncate">
              {scholarship.eligibleStates.includes('All India') ? 'All India' : scholarship.eligibleStates.join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            {getUrgencyBadge()}
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 pt-3.5 border-t border-[#E8EAF1] flex items-center justify-between gap-2">
        <EligibilityBadge
          status={assessment.overallStatus}
          matchScore={assessment.matchScore}
          size="sm"
        />

        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/eligibility/${scholarship.id}`}
            title="Inspect explainable eligibility rules"
            className="p-1.5 rounded-lg text-xs font-semibold text-[#635BFF] hover:bg-[#635BFF]/10 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </Link>

          {existingApp ? (
            <Link
              to="/dashboard/applications"
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#151827] transition-colors"
            >
              In Workspace ({existingApp.status})
            </Link>
          ) : (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-xs font-semibold text-white shadow-xs transition-all"
            >
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

