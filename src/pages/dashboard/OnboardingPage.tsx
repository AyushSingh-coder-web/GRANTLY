import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EducationLevel, Category, StudentProfile } from '../../types';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  BookOpen,
  DollarSign,
  User,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentProfile>(profile);

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Education & College', icon: Building2 },
    { number: 3, title: 'Academic Performance', icon: BookOpen },
    { number: 4, title: 'Financial Background', icon: DollarSign },
    { number: 5, title: 'Scheme Preferences', icon: Sliders },
  ];

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

  const handleNext = () => {
    updateProfile(formData);
    if (step < 5) {
      setStep(step + 1);
    } else {
      updateProfile({ ...formData, isOnboarded: true });
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-10 px-4 sm:px-6 lg:px-8 transition-colors flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-2 cursor-pointer group hover:opacity-95 transition-opacity"
            title="Return to Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight font-heading text-[#151827] group-hover:text-[#635BFF] transition-colors">
              GRANTLY
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-heading text-[#151827]">
            Smart Student Profile Setup
          </h1>
          <p className="text-xs text-[#697386] mt-1">
            Step {step} of 5: {steps[step - 1].title}
          </p>
        </div>

        {/* Multi-step progress bar */}
        <div className="mb-8">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((s) => {
              const isPast = step > s.number;
              const isCurrent = step === s.number;
              return (
                <div key={s.number} className="text-center">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isPast
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-[#635BFF]'
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider hidden sm:block truncate ${
                      isCurrent
                        ? 'text-[#635BFF] dark:text-[#8B5CF6]'
                        : isPast
                        ? 'text-emerald-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Card Form */}
        <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-6 sm:p-8 shadow-md">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#151827] dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                Personal Identification & Domicile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
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
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Domicile State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
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
                    placeholder="e.g. Lucknow / Pune"
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Gender (For gender-specific grants)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Category (For affirmative grants)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Educational Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#151827] dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                College & Higher Education Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. National Institute of Technology, Lucknow"
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Education Level
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
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
                    Degree Type
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. B.Tech / B.Sc / MBBS"
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Course / Branch Stream
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Current Academic Year
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Academic Performance */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#151827] dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                Academic Performance Metrics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Latest Aggregate Score (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="40"
                    max="100"
                    value={formData.academicScore}
                    onChange={(e) => setFormData({ ...formData, academicScore: parseFloat(e.target.value) || 0 })}
                    className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">If using 10-point CGPA, multiply by 9.5</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Previous Year / 12th Board Score (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.previousAcademicScore || ''}
                    onChange={(e) => setFormData({ ...formData, previousAcademicScore: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 88.4"
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Academic Achievements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.academicAchievements || ''}
                    onChange={(e) => setFormData({ ...formData, academicAchievements: e.target.value })}
                    placeholder="e.g. 1st Rank State Science Olympiad, Dean's List 2024..."
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Financial Background */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#151827] dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                Household Financial Background
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Annual Family Income (in INR ₹)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={formData.annualFamilyIncome}
                    onChange={(e) => setFormData({ ...formData, annualFamilyIncome: parseInt(e.target.value, 10) || 0 })}
                    className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Currently: ₹{formData.annualFamilyIncome.toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Income Bracket
                  </label>
                  <select
                    value={formData.incomeRange}
                    onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value as any })}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  >
                    <option value="Below ₹1,50,000">Below ₹1,50,000</option>
                    <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
                    <option value="₹3,00,000 - ₹6,00,000">₹3,00,000 - ₹6,00,000</option>
                    <option value="₹6,00,000 - ₹8,00,000">₹6,00,000 - ₹8,00,000</option>
                    <option value="Above ₹8,00,000">Above ₹8,00,000</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Special Financial Circumstances (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.financialCircumstances || ''}
                    onChange={(e) => setFormData({ ...formData, financialCircumstances: e.target.value })}
                    placeholder="e.g. Single parent household, agricultural dependence, or disaster impact (used for crisis grants)"
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Preferences */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#151827] dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                Scholarship & Funding Preferences
              </h2>
              <p className="text-xs text-[#697386] dark:text-gray-400">
                Select the types of financial aid opportunities you want prioritized in your recommendations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { key: 'government', label: 'Government State & National Schemes' },
                  { key: 'private', label: 'Private Foundations & Corporate CSR' },
                  { key: 'meritBased', label: 'Merit-Based Excellence Awards' },
                  { key: 'needBased', label: 'Need-Based & Means-Tested Grants' },
                  { key: 'researchGrants', label: 'Innovation & Research Prototype Grants' },
                  { key: 'international', label: 'International & Study Abroad Scholarships' },
                ].map((pref) => {
                  const isChecked = (formData.preferences as any)[pref.key];
                  return (
                    <label
                      key={pref.key}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#635BFF] bg-[#635BFF]/5 dark:bg-[#635BFF]/10 text-[#151827] dark:text-white'
                          : 'border-[#E8EAF1] dark:border-gray-800 text-[#697386] dark:text-gray-400'
                      }`}
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
                      <span className="text-xs font-semibold">{pref.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-[#697386] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
            >
              <span>{step === 5 ? 'Finish & Launch Dashboard' : 'Save & Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4">
        GRANTLY • Profile data is encrypted and used solely for deterministic matching.
      </div>
    </div>
  );
};
