import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { evaluateDocumentReadiness } from '../../services/documentIntelligence';
import { determineNextBestAction } from '../../services/nextBestAction';
import { triggerSubmissionConfetti } from '../../utils/confetti';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import {
  X,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Trash2,
  FileText,
} from 'lucide-react';

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
  onOpenUpload: (suggestedType?: string) => void;
}

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  application,
  onClose,
  onOpenUpload,
}) => {
  const {
    profile,
    vaultDocuments,
    updateApplicationStatus,
    updateApplicationNotes,
    deleteApplication,
  } = useApp();

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(application.status);
  const [refNumber, setRefNumber] = useState<string>(application.referenceNumber || '');
  const [notes, setNotes] = useState<string>(application.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const docReadiness = evaluateDocumentReadiness(application.scholarship, vaultDocuments);
  const nextAction = determineNextBestAction(application, vaultDocuments, profile);

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

  const handleSaveChanges = () => {
    updateApplicationStatus(application.id, currentStatus, refNumber, notes);
    updateApplicationNotes(application.id, notes);
    if (currentStatus === 'Submitted') {
      triggerSubmissionConfetti();
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleConfirmDelete = () => {
    deleteApplication(application.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E8EAF1] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-[#E8EAF1] flex items-start justify-between gap-4 bg-[#F8F9FC]">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#635BFF] bg-[#635BFF]/10 px-2 py-0.5 rounded">
                  Application Workspace
                </span>
                <span className="text-xs text-[#697386] font-medium">
                  {application.scholarship.category}
                </span>
                {application.scholarship.verificationStatus === 'Verified Official' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#151827] leading-tight">
                {application.scholarship.title}
              </h2>

              <div className="flex items-center gap-4 mt-2 text-xs text-[#697386]">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {application.scholarship.provider}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Deadline: {new Date(application.scholarship.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* Status & Next Action Control */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F8F9FC] p-4 rounded-xl border border-[#E8EAF1] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386]">
                  Application Stage
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => {
                    const newSt = e.target.value as ApplicationStatus;
                    setCurrentStatus(newSt);
                    if (newSt === 'Submitted') {
                      triggerSubmissionConfetti();
                    }
                  }}
                  className="w-full py-2 px-3 text-sm font-semibold rounded-lg border border-[#E8EAF1] bg-white text-[#151827] focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                >
                  {allStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#697386]">
                  Transitioning to 'Submitted' triggers celebratory confetti.
                </p>
              </div>

              <div className="bg-[#F8F9FC] p-4 rounded-xl border border-[#E8EAF1] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386]">
                  Official Reference / Registration No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. NSP-2025-XXXX or REL-UG-XXXX"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full py-2 px-3 text-sm font-mono rounded-lg border border-[#E8EAF1] bg-white text-[#151827] placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                />
                <p className="text-[11px] text-[#697386]">
                  Saved locally to reference when contacting the scholarship authority.
                </p>
              </div>
            </div>

            {/* Next Best Action Widget */}
            <div className="bg-gradient-to-r from-[#635BFF]/10 via-[#8B5CF6]/10 to-teal-500/10 p-4 rounded-xl border border-[#635BFF]/20 flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#635BFF] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#635BFF]">
                  Automated Recommendation
                </span>
                <h4 className="font-bold text-sm text-[#151827] mt-0.5">
                  {nextAction.actionText}
                </h4>
                <p className="text-xs text-[#697386] mt-0.5">
                  {nextAction.actionSubtext}
                </p>
              </div>
            </div>

            {/* Document Vault Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-sm text-[#151827] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#635BFF]" />
                    <span>Required Documents Checklist</span>
                  </h4>
                  <p className="text-xs text-[#697386]">
                    Document Vault matches {docReadiness.availableCount} of {docReadiness.totalRequired} required credentials ({docReadiness.readinessPercentage}% ready).
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    docReadiness.readinessPercentage === 100
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {docReadiness.readinessPercentage}% Ready
                </span>
              </div>

              <div className="space-y-2">
                {docReadiness.matches.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#E8EAF1] bg-[#F8F9FC] text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.status === 'available' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-[#151827]">
                          {item.requirement.documentType}
                        </span>
                        <p className="text-[11px] text-[#697386]">
                          {item.requirement.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      {item.status === 'available' ? (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Available in Vault
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenUpload(item.requirement.documentType);
                          }}
                          className="px-2.5 py-1 rounded bg-[#635BFF] text-white text-[11px] font-semibold hover:bg-[#4941D1] transition-colors"
                        >
                          Upload to Vault
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#697386]">
                Personal Application Notes & Checklist
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Completed online aptitude exam, need to follow up with College Registrar for stamp..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 text-xs rounded-lg border border-[#E8EAF1] bg-white text-[#151827] placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>

            {/* Activity Log Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#697386] mb-2">
                Workspace Activity History
              </h4>
              <div className="space-y-2 border-l-2 border-gray-200 pl-4 ml-2">
                {application.history.map((h) => (
                  <div key={h.id} className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#151827]">{h.action}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(h.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#697386]">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-[#E8EAF1] bg-[#F8F9FC] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <a
                href={application.scholarship.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:underline"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Withdraw Application</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Changes Saved!
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveChanges}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Workspace</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        title="Withdraw & Delete Application"
        message="Are you sure you want to withdraw this application? All pipeline notes and local progress will be permanently erased."
        itemName={application.scholarship.title}
        confirmLabel="Withdraw & Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

