import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateDaysRemaining } from '../../services/deadlineRisk';
import { evaluateDocumentReadiness } from '../../services/documentIntelligence';
import { triggerSubmissionConfetti } from '../../utils/confetti';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import {
  FileText,
  Clock,
  ChevronRight,
  MoreVertical,
  Trash2,
} from 'lucide-react';

interface KanbanBoardProps {
  applications: Application[];
  onOpenDetails: (app: Application) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onOpenDetails,
}) => {
  const { vaultDocuments, updateApplicationStatus, deleteApplication } = useApp();
  const [activeMenuAppId, setActiveMenuAppId] = useState<string | null>(null);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);

  const columns: { status: ApplicationStatus; title: string; color: string }[] = [
    { status: 'Saved', title: 'Saved Watchlist', color: 'border-t-gray-400' },
    { status: 'Preparing', title: 'Preparing Workspace', color: 'border-t-[#8B5CF6]' },
    { status: 'Ready to Apply', title: 'Ready to Submit', color: 'border-t-[#14B8A6]' },
    { status: 'Submitted', title: 'Submitted to Portal', color: 'border-t-blue-500' },
    { status: 'Under Review', title: 'Under Review', color: 'border-t-amber-500' },
    { status: 'Approved', title: 'Approved / Awarded', color: 'border-t-emerald-500' },
  ];

  const allStatuses: ApplicationStatus[] = [
    'Saved',
    'Preparing',
    'Ready to Apply',
    'Submitted',
    'Under Review',
    'Approved',
    'Rejected',
    'Withdrawn',
  ];

  const handleStageChange = (appId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, newStatus);
    if (newStatus === 'Submitted') {
      triggerSubmissionConfetti();
    }
    setActiveMenuAppId(null);
  };

  const handleConfirmDelete = () => {
    if (appToDelete) {
      deleteApplication(appToDelete.id);
      setAppToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6">
        {columns.map((col) => {
          const columnApps = applications.filter((a) => a.status === col.status);

          return (
            <div
              key={col.status}
              className={`bg-[#F8F9FC] rounded-xl border border-[#E8EAF1] border-t-4 ${col.color} p-3 flex flex-col min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-xs font-bold text-[#151827] uppercase tracking-wider">
                  {col.title}
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#697386] border border-gray-200 shadow-2xs">
                  {columnApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {columnApps.length === 0 ? (
                  <div className="h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center p-3 text-center">
                    <span className="text-[11px] text-gray-400">No applications in this stage</span>
                  </div>
                ) : (
                  columnApps.map((app) => {
                    const days = calculateDaysRemaining(app.scholarship.deadline);
                    const readiness = evaluateDocumentReadiness(app.scholarship, vaultDocuments);

                    return (
                      <div
                        key={app.id}
                        className="bg-white rounded-lg border border-[#E8EAF1] p-3.5 shadow-2xs hover:shadow-xs hover:border-[#635BFF]/40 transition-all relative group"
                      >
                        {/* Top Row: Provider & Menu */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] truncate max-w-[140px]">
                            {app.scholarship.provider}
                          </span>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuAppId(activeMenuAppId === app.id ? null : app.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {activeMenuAppId === app.id && (
                              <div className="absolute right-0 top-6 z-30 w-44 bg-white border border-[#E8EAF1] rounded-lg shadow-lg py-1 text-xs">
                                <span className="block px-3 py-1 font-bold text-[10px] uppercase text-gray-400 border-b border-gray-100">
                                  Move to Stage:
                                </span>
                                {allStatuses
                                  .filter((s) => s !== app.status)
                                  .map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => handleStageChange(app.id, s)}
                                      className="w-full text-left px-3 py-1.5 text-xs text-[#151827] hover:bg-[#635BFF]/10 flex items-center justify-between"
                                    >
                                      <span>{s}</span>
                                      <ChevronRight className="w-3 h-3 opacity-40" />
                                    </button>
                                  ))}
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                  <button
                                    onClick={() => {
                                      setAppToDelete(app);
                                      setActiveMenuAppId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Withdraw / Delete</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Scholarship Title */}
                        <h5
                          onClick={() => onOpenDetails(app)}
                          className="font-bold text-xs text-[#151827] line-clamp-2 cursor-pointer hover:text-[#635BFF] transition-colors leading-snug"
                        >
                          {app.scholarship.title}
                        </h5>

                        {/* Reference Number if any */}
                        {app.referenceNumber && (
                          <div className="mt-1.5 text-[10px] font-mono text-[#635BFF] bg-[#635BFF]/10 px-1.5 py-0.5 rounded inline-block">
                            Ref: {app.referenceNumber}
                          </div>
                        )}

                        {/* Document Readiness Bar */}
                        <div className="mt-2.5 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-[10px] text-[#697386] mb-1">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Vault Readiness</span>
                            </span>
                            <span className="font-bold text-[#151827]">
                              {readiness.readinessPercentage}%
                            </span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                readiness.readinessPercentage === 100
                                  ? 'bg-emerald-500'
                                  : 'bg-[#635BFF]'
                              }`}
                              style={{ width: `${readiness.readinessPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Deadline & Details Footer */}
                        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#697386]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className={days <= 5 ? 'font-bold text-rose-600' : ''}>
                              {days < 0 ? 'Passed' : `${days}d left`}
                            </span>
                          </span>

                          <button
                            onClick={() => onOpenDetails(app)}
                            className="font-semibold text-[#635BFF] hover:underline"
                          >
                            Workspace →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!appToDelete}
        title="Withdraw & Delete Application"
        message="Are you sure you want to remove this application workspace? All local progress, notes, and checklist data will be permanently deleted."
        itemName={appToDelete?.scholarship.title}
        confirmLabel="Withdraw & Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setAppToDelete(null)}
      />
    </>
  );
};

