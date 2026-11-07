import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ScholarshipCategory, EducationLevel, EligibilityStatus } from '../../types';

export interface FilterState {
  search: string;
  category: ScholarshipCategory | 'All';
  educationLevel: EducationLevel | 'All';
  eligibilityStatus: EligibilityStatus | 'All';
  stateFilter: string;
  sortBy: 'match' | 'deadline' | 'amount';
}

interface ScholarshipFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export const ScholarshipFilters: React.FC<ScholarshipFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const categories: (ScholarshipCategory | 'All')[] = [
    'All',
    'Government',
    'Corporate CSR',
    'Private',
    'Research',
  ];

  const educationLevels: (EducationLevel | 'All')[] = [
    'All',
    'Undergraduate',
    'Postgraduate',
    'High School (10th/12th)',
    'Diploma / Vocational',
  ];

  const eligibilityOptions: { label: string; value: EligibilityStatus | 'All' }[] = [
    { label: 'All Opportunities', value: 'All' },
    { label: 'Fully Eligible', value: 'eligible' },
    { label: 'Potentially Eligible', value: 'potentially_eligible' },
  ];

  return (
    <div className="bg-white dark:bg-[#1C2033] rounded-xl border border-[#E8EAF1] dark:border-gray-800 p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      {/* Search Bar & Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by scholarship title, provider (e.g. Reliance, AICTE), stream, or keywords..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]/30 focus:border-[#635BFF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as any })}
              className="text-xs font-semibold py-2 px-3 rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden"
            >
              <option value="match">Sort: Highest Match Score</option>
              <option value="deadline">Sort: Closing Soonest</option>
              <option value="amount">Sort: Highest Grant Amount</option>
            </select>
          </div>

          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3 justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.category === cat
                  ? 'bg-[#635BFF] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-[#697386] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Eligibility Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mr-1">
            Eligibility:
          </span>
          {eligibilityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ eligibilityStatus: opt.value })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.eligibilityStatus === opt.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-[#697386] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Row: Education Level and State */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#697386] dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Level:</span>
          <select
            value={filters.educationLevel}
            onChange={(e) => onChange({ educationLevel: e.target.value as any })}
            className="py-1 px-2.5 rounded-md border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
          >
            {educationLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-medium text-[#697386] dark:text-gray-400">
          Showing <span className="font-bold text-[#151827] dark:text-white">{totalResults}</span> verified opportunities
        </div>
      </div>
    </div>
  );
};
