import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useApp } from '../../context/AppContext';
import { calculateProfileCompleteness } from '../../services/eligibilityEngine';
import { EducationLevel, Category } from '../../types';
import {
  User,
  Building2,
  BookOpen,
  DollarSign,
  Sliders,
  Save,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, profileCompleteness } = useApp();
  const [formData, setFormData] = useState(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { missingFields } = calculateProfileCompleteness(formData);

  const states = [
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
    'Haryana',
    'Odisha',
    'Assam',
  ];

  const educationLevels: EducationLevel[] = [
    'High School (10th/12th)',
    'Undergraduate',
    'Postgraduate',
    'Doctorate (Ph.D.)',
    'Diploma / Vocational',
  ];

  const categories: Category[] = [
    'General',
    'OBC',
    'SC',
    'ST',
    'EWS',
    'Minority',
    'Person with Disability (PwD)',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="w-5 h-5 text-[#635BFF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
                Core Module 01
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] dark:text-white font-heading">
              Smart Student Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#697386] dark:text-gray-400 mt-1">
              The foundation of your automated eligibility matching and document vault.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>

        {/* Profile Completeness & Missing Fields Alert */}
        <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
                Profile Readiness
              </span>
              <h3 className="text-lg font-bold text-[#151827] dark:text-white">
                {profileCompleteness}% Complete
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-md ${
                profileCompleteness >= 90
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {profileCompleteness >= 90 ? 'Verification Ready' : 'Missing Information'}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#635BFF] to-[#14B8A6] rounded-full transition-all duration-500"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>

          {missingFields.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Missing Information Alert:</span>
                <p className="mt-0.5">
                  Complete these fields to unlock all verified matches:{' '}
                  <strong>{missingFields.join(', ')}</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile saved successfully! Eligibility scores have been updated across your catalog.</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Personal & Domicile */}
          <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <User className="w-4 h-4 text-[#635BFF]" />
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                1. Personal Information & State Domicile
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Domicile State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Non-Binary">Non-Binary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Educational Information */}
          <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Building2 className="w-4 h-4 text-[#635BFF]" />
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                2. Educational Institution & Program
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Education Level
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                >
                  {educationLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Degree & Stream
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Academic & Financial */}
          <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <DollarSign className="w-4 h-4 text-[#635BFF]" />
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                3. Academic Scores & Family Income
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Latest Academic Score (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.academicScore}
                  onChange={(e) => setFormData({ ...formData, academicScore: parseFloat(e.target.value) || 0 })}
                  className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                  Annual Household Income (₹)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={formData.annualFamilyIncome}
                  onChange={(e) => setFormData({ ...formData, annualFamilyIncome: parseInt(e.target.value, 10) || 0 })}
                  className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Preferences */}
          <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Sliders className="w-4 h-4 text-[#635BFF]" />
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                4. Scheme Preferences
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'government', label: 'Government State & National Schemes' },
                { key: 'private', label: 'Corporate CSR & Private Foundations' },
                { key: 'meritBased', label: 'Merit-Based Awards' },
                { key: 'needBased', label: 'Need-Based & Means-Tested Grants' },
                { key: 'researchGrants', label: 'Research & Innovation Grants' },
              ].map((pref) => {
                const isChecked = (formData.preferences as any)[pref.key];
                return (
                  <label
                    key={pref.key}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            [pref.key]: e.target.checked,
                          },
                        })
                      }
                      className="rounded accent-[#635BFF] w-4 h-4"
                    />
                    <span className="text-xs font-medium text-[#151827] dark:text-white">
                      {pref.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
