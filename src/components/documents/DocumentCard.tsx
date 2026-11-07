import React, { useState } from 'react';
import { VaultDocument } from '../../types';
import { useApp } from '../../context/AppContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import {
  FileText,
  AlertTriangle,
  Clock,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface DocumentCardProps {
  document: VaultDocument;
  satisfiedCount: number;
  satisfiedTitles: string[];
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  satisfiedCount,
  satisfiedTitles,
}) => {
  const { deleteVaultDocument } = useApp();
  const [showUsedList, setShowUsedList] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getStatusBadge = () => {
    switch (document.verificationStatus) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        );
      case 'Requires Renewal':
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Expired / Renewal Due
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Clock className="w-3 h-3" />
            Vault Stored
          </span>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E8EAF1] p-4 shadow-xs hover:border-[#635BFF]/30 transition-all flex flex-col justify-between">
        <div>
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#697386] bg-[#F8F9FC] px-2 py-0.5 rounded">
              {document.documentType}
            </span>
            {getStatusBadge()}
          </div>

          {/* Title & File Name */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#635BFF]/10 text-[#635BFF] shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#151827] truncate">
                {document.customTitle}
              </h4>
              <p className="text-xs text-[#697386] font-mono truncate">
                {document.fileName}
              </p>
            </div>
          </div>

          {/* Document Metadata Details */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#697386] bg-[#F8F9FC] p-2.5 rounded-lg border border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400 block">Size:</span>
              <span className="font-medium text-[#151827]">
                {formatFileSize(document.fileSize)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400 block">Uploaded:</span>
              <span className="font-medium text-[#151827]">
                {new Date(document.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Document Reuse Badge */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowUsedList(!showUsedList)}
              className="w-full flex items-center justify-between text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100/50 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Satisfies {satisfiedCount} Schemes</span>
              </span>
              <span className="text-[10px] underline">
                {showUsedList ? 'Hide' : 'View'}
              </span>
            </button>

            {showUsedList && (
              <div className="mt-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  Compatible Scholarship Requirements:
                </span>
                {satisfiedTitles.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[11px] text-[#151827]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="mt-4 pt-3 border-t border-[#E8EAF1] flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            {document.issuingAuthority || 'Local Vault Encrypted'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Vault Credential"
        message="Are you sure you want to delete this document from your vault? Associated scholarship readiness scores may be updated."
        itemName={document.customTitle}
        confirmLabel="Delete Document"
        onConfirm={() => {
          deleteVaultDocument(document.id);
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

