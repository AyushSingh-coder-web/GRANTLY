import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KanbanBoard } from '../../components/applications/KanbanBoard';
import { ApplicationsTable } from '../../components/applications/ApplicationsTable';
import { ApplicationDetailsModal } from '../../components/applications/ApplicationDetailsModal';
import { NextBestActionBanner } from '../../components/applications/NextBestActionBanner';
import { DocumentUploadModal } from '../../components/documents/DocumentUploadModal';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { determineNextBestAction } from '../../services/nextBestAction';
import {
  FileCheck,
  Kanban,
  Table as TableIcon,
  Search,
  Plus,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApplicationsPage: React.FC = () => {
  const { applications, vaultDocuments, profile } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSuggestedType, setUploadSuggestedType] = useState<string | undefined>(undefined);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        search.trim() === '' ||
        app.scholarship.title.toLowerCase().includes(search.toLowerCase()) ||
        app.scholarship.provider.toLowerCase().includes(search.toLowerCase()) ||
        (app.referenceNumber && app.referenceNumber.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // Compute Next Best Action for top urgent application
  const topApp = applications.find((a) => a.status !== 'Approved' && a.status !== 'Rejected') || applications[0];
  const nextAction = topApp ? determineNextBestAction(topApp, vaultDocuments, profile) : null;

  const handleOpenUpload = (suggestedType?: string) => {
    setUploadSuggestedType(suggestedType);
    setUploadModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="w-5 h-5 text-[#635BFF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                Core Module 04
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] font-heading">
              Application Command Center
            </h1>
            <p className="text-xs sm:text-sm text-[#697386] mt-1">
              Manage your scholarship preparation pipelines, official reference numbers, and submission milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-gray-100 border border-[#E8EAF1]">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-[#151827] shadow-2xs'
                    : 'text-[#697386]'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-[#151827] shadow-2xs'
                    : 'text-[#697386]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            <Link
              to="/dashboard/discover"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Scheme</span>
            </Link>
          </div>
        </div>

        {/* Next Best Action Banner */}
        {nextAction && topApp && (
          <NextBestActionBanner
            action={nextAction}
            scholarshipTitle={topApp.scholarship.title}
          />
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-[#E8EAF1] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by scholarship or ref number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8EAF1] bg-white text-[#151827] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <span className="text-xs text-[#697386] font-medium">
              Stage:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-[#E8EAF1] bg-white text-[#151827]"
            >
              <option value="All">All Stages ({applications.length})</option>
              <option value="Saved">Saved</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready to Apply">Ready to Apply</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Workspace Display */}
        {filteredApps.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8EAF1] p-8 space-y-3">
            <FileCheck className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-[#151827]">
              No applications match this view
            </h3>
            <p className="text-xs text-[#697386] max-w-sm mx-auto">
              You haven&apos;t added any scholarships to this stage yet. Explore verified opportunities to launch a new workspace.
            </p>
            <Link
              to="/dashboard/discover"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#635BFF] text-white text-xs font-semibold"
            >
              Discover Scholarships →
            </Link>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            applications={filteredApps}
            onOpenDetails={(app) => setSelectedApp(app)}
          />
        ) : (
          <ApplicationsTable
            applications={filteredApps}
            onOpenDetails={(app) => setSelectedApp(app)}
          />
        )}

        {/* Details & Workspace Modal */}
        {selectedApp && (
          <ApplicationDetailsModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onOpenUpload={handleOpenUpload}
          />
        )}

        {/* Upload Modal */}
        {uploadModalOpen && (
          <DocumentUploadModal
            initialType={uploadSuggestedType}
            onClose={() => setUploadModalOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
