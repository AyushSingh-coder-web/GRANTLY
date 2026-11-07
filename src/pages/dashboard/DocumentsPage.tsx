import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DocumentCard } from '../../components/documents/DocumentCard';
import { DocumentUploadModal } from '../../components/documents/DocumentUploadModal';
import { useApp } from '../../context/AppContext';
import { DocumentType } from '../../types';
import { calculateDocumentReuseStats } from '../../services/documentIntelligence';
import {
  FolderLock,
  UploadCloud,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DocumentsPage: React.FC = () => {
  const { vaultDocuments, scholarships, applications } = useApp();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<DocumentType | 'All'>('All');
  const [search, setSearch] = useState('');

  // Calculate Document Reuse Intelligence
  const reuseStats = useMemo(() => {
    return calculateDocumentReuseStats(vaultDocuments, scholarships);
  }, [vaultDocuments, scholarships]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return vaultDocuments.filter((doc) => {
      const matchesType =
        selectedTypeFilter === 'All' || doc.documentType === selectedTypeFilter;
      const matchesSearch =
        search.trim() === '' ||
        doc.customTitle.toLowerCase().includes(search.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [vaultDocuments, selectedTypeFilter, search]);

  const documentTypes: (DocumentType | 'All')[] = [
    'All',
    'Identity Proof',
    'Income Certificate',
    'Academic Marksheets',
    'Bonafide Certificate',
    'Caste Certificate',
    'Bank Proof',
    'Photograph',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FolderLock className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Core Module 05
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] font-heading">
              Smart Document Vault
            </h1>
            <p className="text-xs sm:text-sm text-[#697386] mt-1">
              Secure, private document management with cross-scholarship Document Reuse Intelligence.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Credential</span>
          </button>
        </div>

        {/* Feature 23 Diff 03: Document Reuse Intelligence Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-[#635BFF]/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Signature Differentiator • Document Reuse Multiplier</span>
            </div>
            <span className="text-xs text-[#697386] font-medium">
              Upload once, satisfy multiple providers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-3.5 rounded-xl bg-white/80 border border-emerald-200/50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Total Vault Files
              </span>
              <span className="text-xl font-extrabold text-[#151827]">
                {vaultDocuments.length} Documents
              </span>
              <p className="text-[11px] text-[#697386]">
                Stored in private encrypted session
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 border border-emerald-200/50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Total Fulfillments
              </span>
              <span className="text-xl font-extrabold text-emerald-600">
                {reuseStats.reduce((sum, item) => sum + item.usedInCount, 0)} Schemes Satisfied
              </span>
              <p className="text-[11px] text-[#697386]">
                Across {scholarships.length} verified catalog opportunities
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 border border-emerald-200/50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Average Reuse Ratio
              </span>
              <span className="text-xl font-extrabold text-[#635BFF]">
                {(
                  reuseStats.reduce((sum, item) => sum + item.usedInCount, 0) /
                  (vaultDocuments.length || 1)
                ).toFixed(1)}
                x per file
              </span>
              <p className="text-[11px] text-[#697386]">
                Eliminates redundant document collection
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl border border-[#E8EAF1] p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vault documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8EAF1] bg-white text-[#151827] focus:outline-hidden"
              />
            </div>

            <div className="text-xs text-[#697386]">
              Showing <span className="font-bold text-[#151827]">{filteredDocs.length}</span> stored files
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-gray-100">
            {documentTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTypeFilter(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedTypeFilter === t
                    ? 'bg-[#635BFF] text-white'
                    : 'bg-gray-100 text-[#697386] hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8EAF1] p-8 space-y-3">
            <FolderLock className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-[#151827]">
              No documents found
            </h3>
            <p className="text-xs text-[#697386] max-w-sm mx-auto">
              Upload your income certificate, college bonafide letter, or academic marksheets to unlock instant eligibility verification.
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#635BFF] text-white text-xs font-semibold"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => {
              const reuse = reuseStats.find((r) => r.documentId === doc.id);
              return (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  satisfiedCount={reuse?.usedInCount || 0}
                  satisfiedTitles={reuse?.satisfiedScholarshipTitles || []}
                />
              );
            })}
          </div>
        )}

        {/* Upload Modal */}
        {uploadModalOpen && (
          <DocumentUploadModal onClose={() => setUploadModalOpen(false)} />
        )}
      </div>
    </DashboardLayout>
  );
};
