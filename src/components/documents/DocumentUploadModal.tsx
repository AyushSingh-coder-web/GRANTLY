import React, { useState } from 'react';
import { DocumentType } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface DocumentUploadModalProps {
  initialType?: string;
  onClose: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  initialType,
  onClose,
}) => {
  const { uploadVaultDocument } = useApp();

  const [documentType, setDocumentType] = useState<DocumentType>(
    (initialType as DocumentType) || 'Identity Proof'
  );
  const [customTitle, setCustomTitle] = useState(
    initialType ? `${initialType} (Official)` : 'Government ID Proof'
  );
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('application/pdf');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const documentTypes: DocumentType[] = [
    'Identity Proof',
    'Income Certificate',
    'Academic Marksheets',
    'Bonafide Certificate',
    'Caste Certificate',
    'Bank Proof',
    'Photograph',
    'Fee Receipt',
    'Other',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type || 'application/pdf');
      if (!customTitle || customTitle === 'Government ID Proof') {
        setCustomTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type || 'application/pdf');
      if (!customTitle || customTitle === 'Government ID Proof') {
        setCustomTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      alert('Please select or drop a file to upload.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      uploadVaultDocument({
        documentType,
        customTitle: customTitle || fileName,
        fileName,
        fileSize: fileSize || 350000,
        fileType,
        verificationStatus: 'Uploaded',
        issuingAuthority: issuingAuthority || 'Issuing Authority Attested',
        notes,
      });

      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#151827] rounded-2xl max-w-lg w-full border border-[#E8EAF1] dark:border-gray-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-[#E8EAF1] dark:border-gray-800 flex items-center justify-between bg-[#F8F9FC] dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#151827] dark:text-white">
                Upload Document to Vault
              </h3>
              <p className="text-[11px] text-[#697386] dark:text-gray-400">
                Encrypted storage for instant multi-scheme verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              dragActive
                ? 'border-[#635BFF] bg-[#635BFF]/5'
                : fileName
                ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30'
            }`}
          >
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
            />
            {fileName ? (
              <div className="space-y-1">
                <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-[#151827] dark:text-white">{fileName}</p>
                <p className="text-[11px] text-[#697386] dark:text-gray-400">
                  {(fileSize / 1024).toFixed(1)} KB • File ready to store
                </p>
                <label
                  htmlFor="fileInput"
                  className="text-xs text-[#635BFF] hover:underline cursor-pointer block pt-1 font-semibold"
                >
                  Change file
                </label>
              </div>
            ) : (
              <label htmlFor="fileInput" className="cursor-pointer space-y-2 block">
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-xs font-semibold text-[#151827] dark:text-white">
                  Drag & drop your document here, or <span className="text-[#635BFF]">browse</span>
                </p>
                <p className="text-[11px] text-gray-400">
                  Accepts PDF, JPG, PNG up to 10 MB
                </p>
              </label>
            )}
          </div>

          {/* Document Type Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
              Document Category
            </label>
            <select
              value={documentType}
              onChange={(e) => {
                const val = e.target.value as DocumentType;
                setDocumentType(val);
                if (!customTitle || customTitle === 'Government ID Proof') {
                  setCustomTitle(`${val} (Verified)`);
                }
              }}
              className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
            >
              {documentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Title / Label */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
              Document Display Name
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Current Year Tehsildar Income Certificate"
              className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          {/* Issuing Authority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
              Issuing Authority (Optional)
            </label>
            <input
              type="text"
              value={issuingAuthority}
              onChange={(e) => setIssuingAuthority(e.target.value)}
              placeholder="e.g. Tehsildar Lucknow / CBSE / NIT Registrar"
              className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8F9FC] dark:bg-gray-800/40 text-[11px] text-[#697386] dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <Lock className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
            <span>Vault storage strictly private to your session. Never shared with third parties without consent.</span>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-[#697386] hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <span>Storing in Vault...</span>
              ) : uploadSuccess ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded!
                </span>
              ) : (
                <span>Upload to Vault</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
