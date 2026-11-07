import React, { useState, useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ScholarshipCard } from '../../components/scholarships/ScholarshipCard';
import {
  ScholarshipFilters,
  FilterState,
} from '../../components/scholarships/ScholarshipFilters';
import { useApp } from '../../context/AppContext';
import { assessEligibility } from '../../services/eligibilityEngine';
import { calculateDaysRemaining } from '../../services/deadlineRisk';
import { Compass, Sparkles } from 'lucide-react';

export const PublicScholarshipsPage: React.FC = () => {
  const { scholarships, profile } = useApp();

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

  const filteredScholarships = useMemo(() => {
    let result = [...scholarships];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'All') {
      result = result.filter((s) => s.category === filters.category);
    }

    // Education Level
    if (filters.educationLevel !== 'All') {
      result = result.filter((s) =>
        s.educationLevel.some((lvl) => lvl === filters.educationLevel)
      );
    }

    // Eligibility Status
    if (filters.eligibilityStatus !== 'All') {
      result = result.filter((s) => {
        const assessment = assessEligibility(s, profile);
        return assessment.overallStatus === filters.eligibilityStatus;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'deadline') {
        return calculateDaysRemaining(a.deadline) - calculateDaysRemaining(b.deadline);
      }
      if (filters.sortBy === 'amount') {
        return b.fundingAmount - a.fundingAmount;
      }
      // default: match score
      const matchA = assessEligibility(a, profile).matchScore;
      const matchB = assessEligibility(b, profile).matchScore;
      return matchB - matchA;
    });

    return result;
  }, [scholarships, filters, profile]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0E101B] text-[#151827] dark:text-[#E2E8F0] flex flex-col transition-colors">
      <Navbar />

      {/* Header */}
      <section className="bg-white dark:bg-[#11131F] border-b border-[#E8EAF1] dark:border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-5 h-5 text-[#635BFF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
                  Public Opportunity Catalog
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] dark:text-white font-heading">
                Verified Higher Education Scholarships
              </h1>
              <p className="text-xs sm:text-sm text-[#697386] dark:text-gray-400 mt-1">
                Explore authentic government, corporate CSR, and merit grants with live deterministic criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <ScholarshipFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={filteredScholarships.length}
        />

        {/* Scholarships Grid */}
        {filteredScholarships.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-8 space-y-3">
            <Compass className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-[#151827] dark:text-white">
              No matching scholarships found
            </h3>
            <p className="text-xs text-[#697386] dark:text-gray-400 max-w-md mx-auto">
              Try relaxing your category or search filters, or reset filters to browse the entire verified catalog.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-[#635BFF] text-white text-xs font-semibold hover:bg-[#4941D1]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
