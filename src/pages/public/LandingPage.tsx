import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  FolderLock,
  Calendar,
  Compass,
  SlidersHorizontal,
  Bot,
  Layers,
  ChevronRight,
  Award,
  BookOpen,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0E101B] text-[#151827] dark:text-[#E2E8F0] flex flex-col transition-colors selection:bg-[#635BFF] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#635BFF]/15 via-[#8B5CF6]/10 to-[#14B8A6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-800/80 border border-[#E8EAF1] dark:border-gray-700 shadow-2xs text-xs font-semibold text-[#635BFF] dark:text-[#8B5CF6] mb-6">
            <Sparkles className="w-4 h-4" />
            <span>The Unified Opportunity Platform for Higher Education</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-[#151827] dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Your Future <span className="bg-gradient-to-r from-[#635BFF] via-[#8B5CF6] to-[#14B8A6] bg-clip-text text-transparent">Deserves Funding.</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#697386] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover scholarships that match your potential, understand your eligibility through explainable rules, and manage every application — all in one intelligent platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/scholarships"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-sm font-semibold shadow-md shadow-[#635BFF]/25 hover:shadow-lg transition-all"
            >
              <span>Find My Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#151827] dark:text-white border border-[#E8EAF1] dark:border-gray-700 text-sm font-semibold shadow-2xs transition-all"
            >
              <span>Explore How It Works</span>
            </Link>
          </div>

          {/* Hero Realistic Product Visualization */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-[#E8EAF1] dark:border-gray-800 bg-white dark:bg-[#151827] shadow-2xl p-4 sm:p-6 text-left overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-gray-400 font-mono ml-2">grantly.app/dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Deterministic Engine Active</span>
              </div>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                  Best Match Today
                </span>
                <h4 className="font-bold text-sm text-[#151827] dark:text-white">
                  Reliance Foundation UG Scholarship
                </h4>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Eligible • 95% Match</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#635BFF] h-full rounded-full w-[95%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                  Vault Readiness
                </span>
                <h4 className="font-bold text-sm text-[#151827] dark:text-white">
                  5 of 6 Documents Verified
                </h4>
                <p className="text-xs text-[#697386] dark:text-gray-400">
                  Reused across 7 compatible schemes
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[83%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                  Deadline Intelligence
                </span>
                <h4 className="font-bold text-sm text-[#151827] dark:text-white">
                  CSSS National Closes in 8 Days
                </h4>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Risk Priority: High (Prep Ready)
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-[70%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Value Section (4 Key Pillars) */}
      <section className="py-16 bg-white dark:bg-[#11131F] border-y border-[#E8EAF1] dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Personalized Discovery
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Filter through verified government, CSR, and institutional scholarships filtered specifically for your course, stream, and domicile.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Explainable Eligibility
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                No black-box rejections. See the exact mathematical rule breakdown for every requirement with instant What-If simulations.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Application Command Center
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Kanban workspaces, reference number tracking, next best action recommendations, and audit logs keep you organized.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Intelligent Deadline Tracking
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Risk-weighted deadlines that prioritize based on remaining days, document readiness, and preparation stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual 4-Step Process */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
              How GRANTLY Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#151827] dark:text-white font-heading mt-2">
              From Discovery to Disbursement in 4 Steps
            </h2>
            <p className="text-sm text-[#697386] dark:text-gray-400 mt-3">
              One profile. Zero repeated data entry. Complete control over your educational financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1C2033] rounded-2xl p-6 border border-[#E8EAF1] dark:border-gray-800 shadow-xs relative">
              <span className="text-3xl font-extrabold text-[#635BFF]/20 dark:text-[#635BFF]/30 font-mono">
                01
              </span>
              <h3 className="font-bold text-base text-[#151827] dark:text-white mt-2">
                Build Student Profile
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 mt-2 leading-relaxed">
                Enter your academic details, enrollment program, domicile state, and financial bracket once.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C2033] rounded-2xl p-6 border border-[#E8EAF1] dark:border-gray-800 shadow-xs relative">
              <span className="text-3xl font-extrabold text-[#635BFF]/20 dark:text-[#635BFF]/30 font-mono">
                02
              </span>
              <h3 className="font-bold text-base text-[#151827] dark:text-white mt-2">
                Discover Opportunities
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 mt-2 leading-relaxed">
                Filter verified government, CSR, and institutional grants ranked by transparent match algorithms.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C2033] rounded-2xl p-6 border border-[#E8EAF1] dark:border-gray-800 shadow-xs relative">
              <span className="text-3xl font-extrabold text-[#635BFF]/20 dark:text-[#635BFF]/30 font-mono">
                03
              </span>
              <h3 className="font-bold text-base text-[#151827] dark:text-white mt-2">
                Understand Eligibility
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 mt-2 leading-relaxed">
                Audit every mandatory rule. Use the What-If Simulator to test hypothetical academic or financial scenarios.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C2033] rounded-2xl p-6 border border-[#E8EAF1] dark:border-gray-800 shadow-xs relative">
              <span className="text-3xl font-extrabold text-[#635BFF]/20 dark:text-[#635BFF]/30 font-mono">
                04
              </span>
              <h3 className="font-bold text-base text-[#151827] dark:text-white mt-2">
                Manage & Submit
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 mt-2 leading-relaxed">
                Reuse vault documents, execute next best actions, and track submission deadlines before doors close.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase: All Six Core Engines */}
      <section className="py-20 bg-white dark:bg-[#11131F] border-t border-[#E8EAF1] dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
              Architectural Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#151827] dark:text-white font-heading mt-2">
              Six Interconnected Core Modules
            </h2>
            <p className="text-sm text-[#697386] dark:text-gray-400 mt-3">
              Engineered as a cohesive digital ecosystem where data flows seamlessly between profile, discovery, eligibility, vault, and deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                1. Smart Student Profile
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Captures academic performance, family income brackets, enrollment status, and funding preferences with real-time completeness meter.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                2. Scholarship Discovery Engine
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Fast, faceted search across verified national portals, CSR grants, and institutional funds with three distinct recommendation categories.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                3. Eligibility Intelligence Engine
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Deterministic rule matrix checking with What-If Simulation Lab and Opportunity Recovery that suggests alternatives when ineligible.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                4. Application Command Center
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Kanban pipelines, official reference number recording, activity timelines, and automated Next Best Action prompts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FolderLock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                5. Smart Document Vault
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Upload credentials once and see them automatically mapped across dozens of scholarships with Document Reuse Intelligence.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FC] dark:bg-gray-800/40 border border-[#E8EAF1] dark:border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                6. Deadline Intelligence Calendar
              </h3>
              <p className="text-xs text-[#697386] dark:text-gray-400 leading-relaxed">
                Composite Risk Scoring combining days remaining, incomplete documents, and preparation workflow urgency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final High-Conversion CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-tr from-[#635BFF] via-[#4941D1] to-[#151827] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading">
            Your next opportunity starts here.
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto">
            Join thousands of ambitious students taking control of their higher education financing with GRANTLY.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#151827] hover:bg-gray-100 text-sm font-bold shadow-lg transition-all"
            >
              Create Your Free Account
            </Link>
            <Link
              to="/scholarships"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-xs transition-all"
            >
              Browse Open Schemes
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
