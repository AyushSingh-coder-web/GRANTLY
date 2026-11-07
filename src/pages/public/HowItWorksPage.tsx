import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import {
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
  FileText,
  User,
  Scale,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0E101B] text-[#151827] dark:text-[#E2E8F0] flex flex-col transition-colors">
      <Navbar />

      {/* Header */}
      <section className="pt-16 pb-12 bg-white dark:bg-[#11131F] border-b border-[#E8EAF1] dark:border-gray-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
            System Architecture & Principles
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#151827] dark:text-white font-heading mt-2">
            The Engine Behind GRANTLY
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#697386] dark:text-gray-300 max-w-2xl mx-auto">
            How our deterministic rule engine, document reuse intelligence, and deadline prioritization work together to transform scholarship management.
          </p>
        </div>
      </section>

      {/* Philosophy Section: Deterministic vs Generative AI */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/20 dark:via-gray-900/40 dark:to-purple-950/20 rounded-2xl border border-[#635BFF]/30 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#635BFF] text-white">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#151827] dark:text-white">
              Deterministic Rules First, AI as the Explainer
            </h2>
          </div>
          <p className="text-sm text-[#697386] dark:text-gray-300 leading-relaxed">
            Unlike platforms that rely on generative AI to guess eligibility, GRANTLY uses strict, deterministic mathematical logic for evaluation. When a government scheme demands an annual income below ₹2.5 Lakh or a minimum 80th percentile, our rule matrix audits that condition objectively.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white dark:bg-[#1C2033] border border-[#E8EAF1] dark:border-gray-800 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Deterministic Rule Engine
              </span>
              <p className="text-xs text-[#697386] dark:text-gray-400">
                Guarantees zero hallucinations. Evaluates cutoff marks, state domiciles, income ceilings, and degree streams mathematically.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#1C2033] border border-[#E8EAF1] dark:border-gray-800 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                Gemini Explanatory Layer
              </span>
              <p className="text-xs text-[#697386] dark:text-gray-400">
                Translates dense official legal rules and audit results into simple, actionable language and multi-lingual guidance for students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Six Modules Breakdown */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Module 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">
              Module 01
            </span>
            <h3 className="text-2xl font-bold text-[#151827] dark:text-white font-heading">
              Smart Student Profile
            </h3>
            <p className="text-sm text-[#697386] dark:text-gray-400 leading-relaxed">
              Eliminates the fatigue of filling out identical demographic, academic, and financial questionnaires repeatedly. Your profile serves as the single source of truth for the entire platform.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1C2033] p-5 rounded-2xl border border-[#E8EAF1] dark:border-gray-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Profile Features</span>
            <ul className="space-y-1.5 text-xs text-[#151827] dark:text-gray-300">
              <li className="flex items-center gap-2">✓ 5-Step Guided Onboarding</li>
              <li className="flex items-center gap-2">✓ Completeness Percentage Meter</li>
              <li className="flex items-center gap-2">✓ Missing Data Warnings</li>
              <li className="flex items-center gap-2">✓ Scheme Preference Toggles</li>
            </ul>
          </div>
        </div>

        {/* Module 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Module 02
            </span>
            <h3 className="text-2xl font-bold text-[#151827] dark:text-white font-heading">
              Scholarship Discovery Engine
            </h3>
            <p className="text-sm text-[#697386] dark:text-gray-400 leading-relaxed">
              Curated opportunities categorized into three personalized streams: <strong>Best Matches</strong> (100% verified criteria met), <strong>Explore More</strong> (potentials requiring verification), and <strong>Closing Soon</strong> (approaching cutoffs).
            </p>
          </div>
          <div className="bg-white dark:bg-[#1C2033] p-5 rounded-2xl border border-[#E8EAF1] dark:border-gray-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Discovery Features</span>
            <ul className="space-y-1.5 text-xs text-[#151827] dark:text-gray-300">
              <li className="flex items-center gap-2">✓ Faceted Multi-filter Sidebar</li>
              <li className="flex items-center gap-2">✓ Live Match Percentage Ranking</li>
              <li className="flex items-center gap-2">✓ Official Source Badges</li>
              <li className="flex items-center gap-2">✓ Instant Watchlist Bookmarking</li>
            </ul>
          </div>
        </div>

        {/* Module 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
              Module 03
            </span>
            <h3 className="text-2xl font-bold text-[#151827] dark:text-white font-heading">
              Eligibility Intelligence & What-If Simulator
            </h3>
            <p className="text-sm text-[#697386] dark:text-gray-400 leading-relaxed">
              Audit the exact reason why a scholarship is matched or blocked. Use our interactive simulator to adjust academic scores, income, or state domicile in memory to see what opens up. If ineligible, Opportunity Recovery immediately suggests alternatives!
            </p>
          </div>
          <div className="bg-white dark:bg-[#1C2033] p-5 rounded-2xl border border-[#E8EAF1] dark:border-gray-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Eligibility Features</span>
            <ul className="space-y-1.5 text-xs text-[#151827] dark:text-gray-300">
              <li className="flex items-center gap-2">✓ Rule Evaluation Audit Matrix</li>
              <li className="flex items-center gap-2">✓ In-Memory What-If Simulator</li>
              <li className="flex items-center gap-2">✓ Opportunity Recovery Engine</li>
              <li className="flex items-center gap-2">✓ AI Natural Language Explanations</li>
            </ul>
          </div>
        </div>

        {/* Module 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Module 04
            </span>
            <h3 className="text-2xl font-bold text-[#151827] dark:text-white font-heading">
              Application Command Center
            </h3>
            <p className="text-sm text-[#697386] dark:text-gray-400 leading-relaxed">
              Track applications from Saved Watchlist through to Approved Award with Kanban boards, custom notes, official portal reference numbers, and automated Next Best Action prompts.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1C2033] p-5 rounded-2xl border border-[#E8EAF1] dark:border-gray-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Workspace Features</span>
            <ul className="space-y-1.5 text-xs text-[#151827] dark:text-gray-300">
              <li className="flex items-center gap-2">✓ Kanban & Tabular Grid Views</li>
              <li className="flex items-center gap-2">✓ Official Ref Number Tracking</li>
              <li className="flex items-center gap-2">✓ Next Best Action Guidance</li>
              <li className="flex items-center gap-2">✓ Activity History Audit Trail</li>
            </ul>
          </div>
        </div>

        {/* Module 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Module 05
            </span>
            <h3 className="text-2xl font-bold text-[#151827] dark:text-white font-heading">
              Smart Document Vault & Reuse Intelligence
            </h3>
            <p className="text-sm text-[#697386] dark:text-gray-400 leading-relaxed">
              Upload critical identity proof, income certificates, marksheets, and bonafide letters. GRANTLY calculates your Document Readiness percentage for every opportunity and demonstrates how 1 document can satisfy 5+ scholarships.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1C2033] p-5 rounded-2xl border border-[#E8EAF1] dark:border-gray-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Vault Features</span>
            <ul className="space-y-1.5 text-xs text-[#151827] dark:text-gray-300">
              <li className="flex items-center gap-2">✓ Drag & Drop Local Storage</li>
              <li className="flex items-center gap-2">✓ Requirement Checklist Mapping</li>
              <li className="flex items-center gap-2">✓ Document Reuse Multiplier</li>
              <li className="flex items-center gap-2">✓ Expiry & Renewal Alerts</li>
            </ul>
          </div>
        </div>

        {/* Module 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Module 06
            </span>
            <h3 className="text-2xl font-bold text-[#151827] dark:text-white font-heading">
              Deadline Intelligence & Personalized Calendar
            </h3>
            <p className="text-sm text-[#697386] dark:text-gray-400 leading-relaxed">
              Combines remaining days, document vault gaps, and application stages into a composite Deadline Risk Score. The "GRANTLY Briefing" widget prioritizes exactly what needs attention right now.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1C2033] p-5 rounded-2xl border border-[#E8EAF1] dark:border-gray-800 shadow-xs space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Calendar Features</span>
            <ul className="space-y-1.5 text-xs text-[#151827] dark:text-gray-300">
              <li className="flex items-center gap-2">✓ Monthly & Weekly Interactive View</li>
              <li className="flex items-center gap-2">✓ Risk Priority Scoring (0-100)</li>
              <li className="flex items-center gap-2">✓ GRANTLY Executive Briefing</li>
              <li className="flex items-center gap-2">✓ In-App Notification Center</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#151827] dark:text-white">
            Experience the Unified Platform Today
          </h3>
          <p className="text-xs text-[#697386] dark:text-gray-400 mt-2">
            Access our fully seeded, interactive demonstration workspace with one click.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-sm font-semibold shadow-md transition-all"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
