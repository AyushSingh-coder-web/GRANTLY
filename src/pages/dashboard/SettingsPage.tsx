import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  RotateCcw,
  Download,
  ShieldCheck,
  User,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    resetDemoData,
    profile,
    applications,
    vaultDocuments,
    clearAllNotifications,
  } = useApp();

  const [resetSuccess, setResetSuccess] = useState(false);
  const [clearedNotifs, setClearedNotifs] = useState(false);

  const handleExportData = () => {
    const backup = {
      user: currentUser,
      profile,
      applicationsCount: applications.length,
      applications: applications.map((a) => ({
        scholarshipTitle: a.scholarship.title,
        status: a.status,
        refNumber: a.referenceNumber,
        notes: a.notes,
        submittedAt: a.submittedAt,
      })),
      vaultDocumentsCount: vaultDocuments.length,
      vaultDocuments: vaultDocuments.map((d) => ({
        title: d.customTitle,
        type: d.documentType,
        uploadedAt: d.uploadedAt,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grantly_student_backup_${profile.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to clean authentic initial state?')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  const handleClearNotifs = () => {
    if (window.confirm('Delete all alerts and notifications from your center?')) {
      clearAllNotifications();
      setClearedNotifs(true);
      setTimeout(() => setClearedNotifs(false), 2500);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-[#635BFF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
              Preferences & Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] font-heading">
            Account & Platform Settings
          </h1>
          <p className="text-xs text-[#697386] mt-1">
            Control your authenticated student session, data persistence, and private records.
          </p>
        </div>

        {resetSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstration environment reset to verified baseline.</span>
          </div>
        )}

        {clearedNotifs && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All notifications cleared and deleted.</span>
          </div>
        )}

        <div className="space-y-6">
          {/* User Account Info */}
          <div className="bg-white rounded-2xl border border-[#E8EAF1] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <User className="w-4 h-4 text-[#635BFF]" />
              <h3 className="font-bold text-base text-[#151827]">
                Active Student Account
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-gray-400 uppercase block mb-1">Signed In As:</span>
                <span className="font-semibold text-sm text-[#151827]">
                  {currentUser?.email || profile.email}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase block mb-1">Student Legal Name:</span>
                <span className="font-semibold text-sm text-[#151827]">
                  {currentUser?.name || profile.fullName}
                </span>
              </div>
            </div>
          </div>

          {/* Data Export */}
          <div className="bg-white rounded-2xl border border-[#E8EAF1] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-base text-[#151827]">
                  Export Student Data
                </h3>
                <p className="text-xs text-[#697386] mt-0.5">
                  Download a complete JSON export of your student profile, application pipelines, and vault metadata.
                </p>
              </div>

              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8EAF1] bg-white text-xs font-bold text-[#151827] hover:border-[#635BFF] transition-colors"
              >
                <Download className="w-4 h-4 text-[#635BFF]" />
                <span>Export JSON Package</span>
              </button>
            </div>
          </div>

          {/* Delete All Notifications */}
          <div className="bg-white rounded-2xl border border-[#E8EAF1] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-base text-[#151827]">
                  Notification Center Data
                </h3>
                <p className="text-xs text-[#697386] mt-0.5">
                  Clear and delete all past alerts from the in-app notification center.
                </p>
              </div>

              <button
                onClick={handleClearNotifs}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All Notifications</span>
              </button>
            </div>
          </div>

          {/* Demo Resetter Tool */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-base text-rose-600 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Demo Environment</span>
                </h3>
                <p className="text-xs text-[#697386] mt-0.5">
                  Restores default verified opportunities, sample student profile, and clean applications list.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Reset to Authentic Seed State
              </button>
            </div>
          </div>

          {/* Security Transparency */}
          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-gray-100 text-xs text-[#697386] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              GRANTLY complies with strict student privacy guidelines. Sensitive demographic records, family income statements, and uploaded academic marksheets remain in your authenticated session vault.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
