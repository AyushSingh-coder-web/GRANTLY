import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useApp } from '../../context/AppContext';
import { assessEligibility } from '../../services/eligibilityEngine';
import { calculateDaysRemaining } from '../../services/deadlineRisk';
import { evaluateDocumentReadiness } from '../../services/documentIntelligence';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import {
  Building2,
  Calendar,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  Award,
  ChevronLeft,
} from 'lucide-react';

export const ScholarshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    scholarships,
    profile,
    isScholarshipSaved,
    toggleSaveScholarship,
    createApplication,
    applications,
    vaultDocuments,
  } = useApp();

  const scholarship = scholarships.find((s) => s.id === id) || scholarships[0];
  const assessment = assessEligibility(scholarship, profile);
  const docReadiness = evaluateDocumentReadiness(scholarship, vaultDocuments);
  const days = calculateDaysRemaining(scholarship.deadline);
  const isSaved = isScholarshipSaved(scholarship.id);
  const existingApp = applications.find((a) => a.scholarshipId === scholarship.id);

  const handleApply = () => {
    createApplication(scholarship.id);
    navigate('/dashboard/applications');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0E101B] text-[#151827] dark:text-[#E2E8F0] flex flex-col transition-colors">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb Back */}
        <div>
          <Link
            to="/scholarships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#697386] hover:text-[#635BFF] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Discovery Catalog</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E8EAF1] dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] bg-[#635BFF]/10 px-2.5 py-0.5 rounded">
                  {scholarship.category}
                </span>
                {scholarship.verificationStatus === 'Verified Official' && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Official Source
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  Last verified: {new Date(scholarship.lastVerifiedAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] dark:text-white font-heading">
                {scholarship.title}
              </h1>

              <div className="flex items-center gap-4 mt-3 text-xs sm:text-sm text-[#697386] dark:text-gray-400 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium text-[#151827] dark:text-gray-200">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {scholarship.provider}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {scholarship.eligibleStates.includes('All India')
                    ? 'All India'
                    : scholarship.eligibleStates.join(', ')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()} (
                  <span className={days <= 5 ? 'font-bold text-rose-600' : ''}>
                    {days < 0 ? 'Closed' : `${days} days left`}
                  </span>
                  )
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => toggleSaveScholarship(scholarship.id)}
                className={`p-3 rounded-xl border transition-all ${
                  isSaved
                    ? 'bg-[#635BFF]/10 text-[#635BFF] border-[#635BFF]/30'
                    : 'border-[#E8EAF1] dark:border-gray-700 text-[#697386] hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title="Save to watchlist"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 fill-current" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>

              {existingApp ? (
                <Link
                  to="/dashboard/applications"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#151827] dark:text-white text-xs font-semibold"
                >
                  <span>In Workspace ({existingApp.status})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleApply}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-md transition-all"
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                Grant Amount
              </span>
              <span className="text-lg font-extrabold text-[#151827] dark:text-white">
                {scholarship.fundingAmountDisplay}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                Target Level
              </span>
              <span className="text-sm font-semibold text-[#151827] dark:text-gray-200">
                {scholarship.educationLevel.join(', ')}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                Funding Structure
              </span>
              <span className="text-sm font-semibold text-[#151827] dark:text-gray-200">
                {scholarship.fundingType}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                Your Assessment
              </span>
              <div className="mt-0.5">
                <EligibilityBadge
                  status={assessment.overallStatus}
                  matchScore={assessment.matchScore}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Eligibility Callout Banner */}
        <div className="bg-gradient-to-r from-[#635BFF]/10 via-[#8B5CF6]/10 to-teal-500/10 p-5 rounded-2xl border border-[#635BFF]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#635BFF] text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#151827] dark:text-white">
                Deterministic Eligibility Breakdown Available
              </h4>
              <p className="text-xs text-[#697386] dark:text-gray-400 mt-0.5">
                See exactly why you match or fail this scholarship&apos;s rules, or run What-If simulations to test alternate academic scenarios.
              </p>
            </div>
          </div>

          <Link
            to={`/dashboard/eligibility/${scholarship.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold whitespace-nowrap shadow-xs"
          >
            <span>Open Eligibility Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Description & Detailed Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Program Overview
              </h3>
              <p className="text-sm text-[#697386] dark:text-gray-300 leading-relaxed">
                {scholarship.description}
              </p>
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                {scholarship.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[#697386] dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Selection Criteria */}
            <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-2">
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Selection & Evaluation Criteria
              </h3>
              <p className="text-xs sm:text-sm text-[#697386] dark:text-gray-300 leading-relaxed">
                {scholarship.selectionCriteria}
              </p>
            </div>

            {/* Application Procedure */}
            <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Application Procedure & Timeline
              </h3>
              <ol className="space-y-3">
                {scholarship.applicationProcedure.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#635BFF]/10 text-[#635BFF] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[#151827] dark:text-gray-300 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Sidebar: Document Checklist & Official Links */}
          <div className="space-y-6">
            {/* Required Documents Card */}
            <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#151827] dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#635BFF]" />
                  <span>Required Credentials</span>
                </h4>
                <span className="text-xs font-semibold text-[#635BFF]">
                  {docReadiness.readinessPercentage}% Ready
                </span>
              </div>

              <div className="space-y-2">
                {scholarship.requiredDocuments.map((doc, idx) => {
                  const hasInVault = vaultDocuments.some(
                    (d) => d.documentType === doc.documentType
                  );
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-[#F8F9FC] dark:bg-gray-800/30 text-xs flex items-start gap-2"
                    >
                      {hasInVault ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-[#151827] dark:text-white block">
                          {doc.documentType}
                        </span>
                        <span className="text-[11px] text-[#697386] dark:text-gray-400">
                          {doc.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/dashboard/documents"
                className="block text-center py-2 rounded-lg bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] text-xs font-semibold hover:bg-[#635BFF]/20 transition-colors"
              >
                Open Document Vault →
              </Link>
            </div>

            {/* Official Source Verified Links */}
            <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-5 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-sm text-[#151827] dark:text-white">
                Official Sources
              </h4>
              <p className="text-[#697386] dark:text-gray-400 text-[11px]">
                GRANTLY verifies all opportunities directly against official government gazettes and CSR foundation portals.
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href={scholarship.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E8EAF1] dark:border-gray-700 text-[#635BFF] font-semibold hover:bg-[#635BFF]/5"
                >
                  <span>Official Application Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={scholarship.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E8EAF1] dark:border-gray-700 text-[#697386] font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span>Official Scheme Guidelines</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
