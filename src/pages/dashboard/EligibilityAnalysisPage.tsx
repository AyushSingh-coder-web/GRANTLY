import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EligibilityBreakdownTable } from '../../components/eligibility/EligibilityBreakdownTable';
import { WhatIfSimulator } from '../../components/eligibility/WhatIfSimulator';
import { EligibilityBadge } from '../../components/common/EligibilityBadge';
import { ScholarshipCard } from '../../components/scholarships/ScholarshipCard';
import { useApp } from '../../context/AppContext';
import {
  assessEligibility,
  getOpportunityRecovery,
} from '../../services/eligibilityEngine';
import { StudentProfile } from '../../types';
import {
  Sparkles,
  Bot,
  Building2,
  Calendar,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';

export const EligibilityAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { scholarships, profile, updateProfile, createApplication } = useApp();

  const scholarship = scholarships.find((s) => s.id === id) || scholarships[0];

  // What-If simulated profile state
  const [simulatedProfile, setSimulatedProfile] = useState<Partial<StudentProfile>>(profile);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [hindiRequested, setHindiRequested] = useState<boolean>(false);

  // Sync when real profile updates
  useEffect(() => {
    setSimulatedProfile(profile);
  }, [profile]);

  // Assessment against simulation profile
  const assessment = assessEligibility(scholarship, simulatedProfile, true);

  // Opportunity Recovery alternatives if not eligible
  const recoveryAlternatives = getOpportunityRecovery(scholarship.id, simulatedProfile);

  // Fetch AI explanation from server proxy
  const fetchAiExplanation = async (languageHindi = false) => {
    setLoadingAi(true);
    try {
      const response = await fetch('/api/ai/explain-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipTitle: scholarship.title,
          provider: scholarship.provider,
          studentProfile: simulatedProfile,
          evaluationResults: assessment.results,
          language: languageHindi ? 'Hindi' : 'English',
        }),
      });
      const data = await response.json();
      setAiExplanation(data.explanation || 'Eligibility assessment generated successfully.');
    } catch (err) {
      console.error('Failed to load AI explanation:', err);
      setAiExplanation(
        `Based on deterministic criteria, your profile satisfies ${assessment.passedCount} out of ${assessment.results.length} conditions for ${scholarship.title}. Review individual criteria in the matrix below.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiExplanation(hindiRequested);
  }, [scholarship.id, assessment.overallStatus]);

  const handleSimChange = (updated: Partial<StudentProfile>) => {
    setSimulatedProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetSim = () => {
    setSimulatedProfile(profile);
  };

  const handleCommitSim = () => {
    updateProfile(simulatedProfile);
    alert('Simulated profile modifications saved successfully to your student profile!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Back Link */}
        <div>
          <Link
            to="/dashboard/discover"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#697386] hover:text-[#635BFF] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8EAF1] dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] bg-[#635BFF]/10 px-2.5 py-0.5 rounded">
                  Core Module 03 • Intelligence Lab
                </span>
                <span className="text-xs text-gray-400">
                  Scheme ID: {scholarship.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] dark:text-white font-heading">
                Eligibility Intelligence: {scholarship.title}
              </h1>

              <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-[#697386] dark:text-gray-400 flex-wrap">
                <span className="flex items-center gap-1.5 text-[#151827] dark:text-gray-200 font-medium">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {scholarship.provider}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                  Current Assessment
                </span>
                <div className="mt-1">
                  <EligibilityBadge
                    status={assessment.overallStatus}
                    matchScore={assessment.matchScore}
                    size="lg"
                  />
                </div>
              </div>

              <button
                onClick={() => createApplication(scholarship.id)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-md transition-all shrink-0"
              >
                <span>Add to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick criteria tally */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-4 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Total Rules</span>
              <span className="text-base font-extrabold text-[#151827] dark:text-white">
                {assessment.results.length} Criteria
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-600 block">Satisfied</span>
              <span className="text-base font-extrabold text-emerald-600">
                {assessment.passedCount} Matched
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-rose-600 block">Failed Mandatory</span>
              <span className="text-base font-extrabold text-rose-600">
                {assessment.failedMandatoryCount} Blockers
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-600 block">Missing Data</span>
              <span className="text-base font-extrabold text-amber-600">
                {assessment.missingInfoCount} Unverified
              </span>
            </div>
          </div>
        </div>

        {/* AI Explainable Synthesis Card */}
        <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-teal-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-teal-950/30 rounded-2xl border border-[#635BFF]/30 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6]">
              <Bot className="w-4 h-4" />
              <span>GRANTLY AI Natural Language Explanation</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = !hindiRequested;
                  setHindiRequested(next);
                  fetchAiExplanation(next);
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#635BFF]/30 bg-white dark:bg-gray-800 text-[#635BFF] dark:text-[#8B5CF6] hover:bg-[#635BFF]/10 transition-colors"
              >
                {hindiRequested ? 'Translate to English' : 'हिंदी में स्पष्टीकरण (Hindi)'}
              </button>
              <button
                onClick={() => fetchAiExplanation(hindiRequested)}
                title="Regenerate explanation"
                className="p-1 text-gray-400 hover:text-[#635BFF]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#151827] dark:text-gray-200 leading-relaxed font-medium">
            {loadingAi ? 'Synthesizing verified criteria with Gemini API...' : aiExplanation}
          </p>

          <div className="text-[11px] text-[#697386] dark:text-gray-400 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grounded strictly on verified database rules. AI never overrides deterministic eligibility.</span>
          </div>
        </div>

        {/* Feature 03 / Diff 02: What-If Simulator */}
        <div className="space-y-3">
          <WhatIfSimulator
            simulationProfile={simulatedProfile}
            originalProfile={profile}
            onChange={handleSimChange}
            onReset={handleResetSim}
            onCommitToProfile={handleCommitSim}
          />
        </div>

        {/* Audit Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white font-heading">
                Deterministic Rule Evaluation Matrix
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400">
                Audit breakdown comparing student profile inputs against mandatory criteria.
              </p>
            </div>
          </div>

          <EligibilityBreakdownTable results={assessment.results} />
        </div>

        {/* Feature 23 Diff 06: Opportunity Recovery Engine */}
        {assessment.overallStatus === 'not_eligible' && recoveryAlternatives.length > 0 && (
          <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Opportunity Recovery Engine
                </span>
                <h3 className="text-base font-bold text-[#151827] dark:text-white mt-0.5">
                  Don&apos;t worry! Here are alternative grants where you ARE 100% eligible:
                </h3>
                <p className="text-xs text-[#697386] dark:text-gray-400 mt-0.5">
                  While you don&apos;t meet this specific grant&apos;s criteria, our recovery engine scanned your profile and found matching funding alternatives:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {recoveryAlternatives.map((alt) => (
                <ScholarshipCard key={alt.scholarship.id} scholarship={alt.scholarship} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
