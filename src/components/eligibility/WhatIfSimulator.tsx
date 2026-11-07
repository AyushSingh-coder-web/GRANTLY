import React from 'react';
import { StudentProfile, EducationLevel } from '../../types';
import { Sparkles, RotateCcw, Save, Info } from 'lucide-react';

interface WhatIfSimulatorProps {
  simulationProfile: Partial<StudentProfile>;
  originalProfile: StudentProfile;
  onChange: (updated: Partial<StudentProfile>) => void;
  onReset: () => void;
  onCommitToProfile: () => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  simulationProfile,
  originalProfile,
  onChange,
  onReset,
  onCommitToProfile,
}) => {
  const currentScore = simulationProfile.academicScore ?? originalProfile.academicScore ?? 75;
  const currentIncome = simulationProfile.annualFamilyIncome ?? originalProfile.annualFamilyIncome ?? 300000;
  const currentState = simulationProfile.state ?? originalProfile.state ?? 'Uttar Pradesh';
  const currentLevel = (simulationProfile.educationLevel ?? originalProfile.educationLevel ?? 'Undergraduate') as EducationLevel;

  const states = [
    'All India',
    'Uttar Pradesh',
    'Maharashtra',
    'Karnataka',
    'Delhi',
    'Tamil Nadu',
    'Gujarat',
    'Rajasthan',
    'West Bengal',
    'Madhya Pradesh',
    'Bihar',
    'Telangana',
    'Punjab',
    'Kerala',
  ];

  const levels: EducationLevel[] = [
    'High School (10th/12th)',
    'Undergraduate',
    'Postgraduate',
    'Doctorate (Ph.D.)',
    'Diploma / Vocational',
  ];

  const hasModifications =
    currentScore !== originalProfile.academicScore ||
    currentIncome !== originalProfile.annualFamilyIncome ||
    currentState !== originalProfile.state ||
    currentLevel !== originalProfile.educationLevel;

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-teal-50/40 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-teal-950/20 rounded-xl border border-[#635BFF]/30 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#635BFF] text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#151827] dark:text-white flex items-center gap-2">
              <span>What-If Eligibility Simulator</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-[#8B5CF6] px-2 py-0.5 rounded">
                Interactive Lab
              </span>
            </h3>
            <p className="text-xs text-[#697386] dark:text-gray-400">
              Simulate hypothetical score, income, and domicile changes to instantly recalculate scholarship eligibility without altering your saved records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasModifications && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-[#697386] dark:text-gray-300 hover:text-[#151827] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {hasModifications && (
            <button
              onClick={onCommitToProfile}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Slider 1: Academic Score */}
        <div className="bg-white dark:bg-[#1C2033] p-3.5 rounded-lg border border-[#E8EAF1] dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#697386] dark:text-gray-400">Academic Score:</span>
            <span className="font-bold text-[#635BFF] dark:text-[#8B5CF6] text-sm">
              {currentScore}%
            </span>
          </div>
          <input
            type="range"
            min={45}
            max={100}
            step={0.5}
            value={currentScore}
            onChange={(e) => onChange({ academicScore: parseFloat(e.target.value) })}
            className="w-full accent-[#635BFF] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>45% Min</span>
            <span>100% Max</span>
          </div>
        </div>

        {/* Slider 2: Annual Household Income */}
        <div className="bg-white dark:bg-[#1C2033] p-3.5 rounded-lg border border-[#E8EAF1] dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#697386] dark:text-gray-400">Family Income:</span>
            <span className="font-bold text-[#635BFF] dark:text-[#8B5CF6] text-sm">
              ₹{currentIncome.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={1800000}
            step={25000}
            value={currentIncome}
            onChange={(e) => onChange({ annualFamilyIncome: parseInt(e.target.value, 10) })}
            className="w-full accent-[#635BFF] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>₹50K</span>
            <span>₹18 Lakh</span>
          </div>
        </div>

        {/* State Selection */}
        <div className="bg-white dark:bg-[#1C2033] p-3.5 rounded-lg border border-[#E8EAF1] dark:border-gray-800 space-y-1.5">
          <label className="block text-xs font-semibold text-[#697386] dark:text-gray-400">
            Domicile State:
          </label>
          <select
            value={currentState}
            onChange={(e) => onChange({ state: e.target.value })}
            className="w-full text-xs font-medium py-1.5 px-2.5 rounded-md border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Education Level */}
        <div className="bg-white dark:bg-[#1C2033] p-3.5 rounded-lg border border-[#E8EAF1] dark:border-gray-800 space-y-1.5">
          <label className="block text-xs font-semibold text-[#697386] dark:text-gray-400">
            Education Level:
          </label>
          <select
            value={currentLevel}
            onChange={(e) => onChange({ educationLevel: e.target.value as any })}
            className="w-full text-xs font-medium py-1.5 px-2.5 rounded-md border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="flex items-center gap-2 text-xs text-[#697386] dark:text-gray-400 bg-white/60 dark:bg-gray-900/60 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <Info className="w-4 h-4 text-[#635BFF] shrink-0" />
        <span>
          Simulated values recalculate match scores dynamically in memory. Your official profile data remains untouched unless you click <strong>Save to Profile</strong>.
        </span>
      </div>
    </div>
  );
};
