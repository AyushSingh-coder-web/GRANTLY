import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ScholarshipCard } from '../../components/scholarships/ScholarshipCard';
import {
  ScholarshipFilters,
  FilterState,
} from '../../components/scholarships/ScholarshipFilters';
import { useApp } from '../../context/AppContext';
import { assessEligibility } from '../../services/eligibilityEngine';
import { calculateDaysRemaining } from '../../services/deadlineRisk';
import {
  Sparkles,
  Compass,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const DiscoverScholarshipsPage: React.FC = () => {
  const { scholarships, profile } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'best' | 'explore' | 'closing'>('best');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    educationLevel: 'All',
    eligibilityStatus: 'All',
    stateFilter: 'All',
    sortBy: 'match',
  });

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      educationLevel: 'All',
      eligibilityStatus: 'All',
      stateFilter: 'All',
      sortBy: 'match',
    });
  };

  // Pre-assess all scholarships
  const assessedScholarships = useMemo(() => {
    return scholarships.map((s) => ({
      scholarship: s,
      assessment: assessEligibility(s, profile),
      daysRemaining: calculateDaysRemaining(s.deadline),
    }));
  }, [scholarships, profile]);

  // Section categories
  const bestMatches = useMemo(() => {
    return assessedScholarships
      .filter((item) => item.assessment.overallStatus === 'eligible')
      .sort((a, b) => b.assessment.matchScore - a.assessment.matchScore);
  }, [assessedScholarships]);

  const exploreMore = useMemo(() => {
    return assessedScholarships
      .filter((item) => item.assessment.overallStatus === 'potentially_eligible')
      .sort((a, b) => b.assessment.matchScore - a.assessment.matchScore);
  }, [assessedScholarships]);

  const closingSoon = useMemo(() => {
    return assessedScholarships
      .filter((item) => item.daysRemaining > 0 && item.daysRemaining <= 20)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [assessedScholarships]);

  // Filtered view for "All" or when filters active
  const filteredList = useMemo(() => {
    let pool = assessedScholarships;
    if (activeTab === 'best') pool = bestMatches;
    else if (activeTab === 'explore') pool = exploreMore;
    else if (activeTab === 'closing') pool = closingSoon;

    let result = [...pool];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.scholarship.title.toLowerCase().includes(q) ||
          i.scholarship.provider.toLowerCase().includes(q) ||
          i.scholarship.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.category !== 'All') {
      result = result.filter((i) => i.scholarship.category === filters.category);
    }

    if (filters.educationLevel !== 'All') {
      result = result.filter((i) =>
        i.scholarship.educationLevel.some((lvl) => lvl === filters.educationLevel)
      );
    }

    if (filters.eligibilityStatus !== 'All') {
      result = result.filter(
        (i) => i.assessment.overallStatus === filters.eligibilityStatus
      );
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'deadline') {
        return a.daysRemaining - b.daysRemaining;
      }
      if (filters.sortBy === 'amount') {
        return b.scholarship.fundingAmount - a.scholarship.fundingAmount;
      }
      return b.assessment.matchScore - a.assessment.matchScore;
    });

    return result.map((i) => i.scholarship);
  }, [assessedScholarships, activeTab, filters, bestMatches, exploreMore, closingSoon]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-[#635BFF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
                Core Module 02
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] dark:text-white font-heading">
              Personalized Scholarship Discovery Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#697386] dark:text-gray-400 mt-1">
              Ranked and evaluated against your profile: {profile.educationLevel} • {profile.course} • ₹{profile.annualFamilyIncome.toLocaleString('en-IN')}/yr
            </p>
          </div>
        </div>

        {/* Personalized Section Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8EAF1] dark:border-gray-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('best')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'best'
                ? 'bg-[#635BFF] text-white shadow-xs'
                : 'text-[#697386] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Best Matches ({bestMatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('closing')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'closing'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-[#697386] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Closing Soon ({closingSoon.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'explore'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-[#697386] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Explore More ({exploreMore.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-xs'
                : 'text-[#697386] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>All Catalog ({scholarships.length})</span>
          </button>
        </div>

        {/* Multifaceted Filters */}
        <ScholarshipFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={filteredList.length}
        />

        {/* Scholarships Grid */}
        {filteredList.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-8 space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-[#151827] dark:text-white">
              No scholarships match this combination of filters
            </h3>
            <p className="text-xs text-[#697386] dark:text-gray-400 max-w-sm mx-auto">
              Switch section tabs above or reset the filter controls to discover more opportunities.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-[#635BFF] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
