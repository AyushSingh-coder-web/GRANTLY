import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { ScholarshipCard } from '../../components/scholarships/ScholarshipCard';
import { GrantlyBriefingWidget } from '../../components/dashboard/GrantlyBriefingWidget';
import { NextBestActionBanner } from '../../components/applications/NextBestActionBanner';
import { assessEligibility } from '../../services/eligibilityEngine';
import {
  generateDeadlineItems,
  generateGrantlyBriefing,
} from '../../services/deadlineRisk';
import { determineNextBestAction } from '../../services/nextBestAction';
import {
  Sparkles,
  Bookmark,
  FileCheck,
  Calendar,
  FolderLock,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    profile,
    scholarships,
    savedScholarshipIds,
    applications,
    vaultDocuments,
  } = useApp();

  // Compute stats
  const eligibleCount = scholarships.filter((s) => {
    const assessment = assessEligibility(s, profile);
    return assessment.overallStatus === 'eligible';
  }).length;

  const deadlineItems = generateDeadlineItems(scholarships, applications, vaultDocuments);
  const briefing = generateGrantlyBriefing(deadlineItems);
  const closingSoonCount = deadlineItems.filter((i) => i.daysRemaining > 0 && i.daysRemaining <= 14).length;

  // Best matches (top 3)
  const bestMatches = [...scholarships]
    .map((s) => ({ scholarship: s, assessment: assessEligibility(s, profile) }))
    .sort((a, b) => b.assessment.matchScore - a.assessment.matchScore)
    .slice(0, 3)
    .map((item) => item.scholarship);

  // Highest priority application for Next Best Action banner
  const activeApp = applications.find((a) => a.status !== 'Approved' && a.status !== 'Rejected') || applications[0];
  const nextAction = activeApp ? determineNextBestAction(activeApp, vaultDocuments, profile) : null;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] dark:text-white font-heading">
              Good morning, {profile.fullName.split(' ')[0]}.
            </h1>
            <p className="text-xs sm:text-sm text-[#697386] dark:text-gray-400 mt-1">
              Let&apos;s make your next opportunity count. Here is your financial aid status today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/discover"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore New Matches</span>
            </Link>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Matched Opportunities"
            value={eligibleCount}
            subtext={`${scholarships.length} total schemes verified`}
            icon={Sparkles}
            iconColor="text-emerald-600"
            trend={`${eligibleCount} Eligible`}
            trendType="positive"
          />

          <StatCard
            label="Saved Opportunities"
            value={savedScholarshipIds.length}
            subtext="Tracked on your personal watchlist"
            icon={Bookmark}
            iconColor="text-[#635BFF]"
          />

          <StatCard
            label="Active Applications"
            value={applications.length}
            subtext="In preparation & submission"
            icon={FileCheck}
            iconColor="text-[#8B5CF6]"
          />

          <StatCard
            label="Deadlines (Next 14 Days)"
            value={closingSoonCount}
            subtext="High-risk windows approaching"
            icon={Calendar}
            iconColor="text-rose-600"
            trend={closingSoonCount > 0 ? 'Urgent' : 'On Track'}
            trendType={closingSoonCount > 0 ? 'urgent' : 'positive'}
          />
        </div>

        {/* Signature Feature: Your GRANTLY Briefing */}
        <GrantlyBriefingWidget
          briefing={briefing}
          criticalDeadlines={briefing.criticalDeadlines}
        />

        {/* Next Best Action Prompt if active app exists */}
        {nextAction && activeApp && (
          <NextBestActionBanner
            action={nextAction}
            scholarshipTitle={activeApp.scholarship.title}
          />
        )}

        {/* Recommended Scholarships: Best Matches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#151827] dark:text-white font-heading">
                Top Recommended Matches for You
              </h2>
              <p className="text-xs text-[#697386] dark:text-gray-400">
                100% of mandatory criteria satisfied based on your academic and income profile.
              </p>
            </div>

            <Link
              to="/dashboard/discover"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#635BFF] hover:underline"
            >
              <span>View All Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestMatches.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        </div>

        {/* Two-Column Lower Grid: Application Pipelines + Upcoming Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Applications Quick Pipeline */}
          <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Application Workspace Status
              </h3>
              <Link
                to="/dashboard/applications"
                className="text-xs font-semibold text-[#635BFF] hover:underline"
              >
                Open Kanban →
              </Link>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <Link
                  key={app.id}
                  to="/dashboard/applications"
                  className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-[#F8F9FC] dark:bg-gray-800/40 hover:border-[#635BFF]/30 transition-all flex items-center justify-between gap-3 block group"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">
                      {app.scholarship.provider}
                    </span>
                    <h4 className="text-xs font-bold text-[#151827] dark:text-white truncate group-hover:text-[#635BFF] transition-colors">
                      {app.scholarship.title}
                    </h4>
                    <p className="text-[11px] text-[#697386] dark:text-gray-400 truncate mt-0.5">
                      {app.nextAction}
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 text-[#151827] dark:text-white border border-gray-200 dark:border-gray-700 shrink-0">
                    {app.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Document Vault Readiness Meter */}
          <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#151827] dark:text-white">
                  Document Vault Readiness
                </h3>
              </div>
              <Link
                to="/dashboard/documents"
                className="text-xs font-semibold text-[#635BFF] hover:underline"
              >
                Manage Vault →
              </Link>
            </div>

            <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
              You have {vaultDocuments.length} credentials stored. By keeping your income certificate and college bonafide updated, you ensure 100% submission readiness.
            </p>

            <div className="space-y-2 pt-1">
              {vaultDocuments.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-[#F8F9FC] dark:bg-gray-800/30 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[#151827] dark:text-white truncate">
                      {doc.customTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#697386] dark:text-gray-400 shrink-0">
                    {doc.verificationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
