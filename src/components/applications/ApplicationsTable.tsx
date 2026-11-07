import React from 'react';
import { Application, ApplicationStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateDaysRemaining } from '../../services/deadlineRisk';
import { evaluateDocumentReadiness } from '../../services/documentIntelligence';
import { triggerSubmissionConfetti } from '../../utils/confetti';
import { ChevronRight } from 'lucide-react';

interface ApplicationsTableProps {
  applications: Application[];
  onOpenDetails: (app: Application) => void;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onOpenDetails,
}) => {
  const { vaultDocuments, updateApplicationStatus } = useApp();

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
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Submitted':
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ready to Apply':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Preparing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E8EAF1] bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#F8F9FC] border-b border-[#E8EAF1] text-[11px] font-bold uppercase tracking-wider text-[#697386]">
          <tr>
            <th className="py-3.5 px-4 sm:px-6">Opportunity</th>
            <th className="py-3.5 px-4">Stage</th>
            <th className="py-3.5 px-4">Vault Readiness</th>
            <th className="py-3.5 px-4">Reference No.</th>
            <th className="py-3.5 px-4">Deadline</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8EAF1]">
          {applications.map((app) => {
            const days = calculateDaysRemaining(app.scholarship.deadline);
            const readiness = evaluateDocumentReadiness(app.scholarship, vaultDocuments);

            return (
              <tr
                key={app.id}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => onOpenDetails(app)}
              >
                {/* Title & Provider */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="max-w-xs">
                    <span className="font-bold text-[#151827] line-clamp-1">
                      {app.scholarship.title}
                    </span>
                    <span className="text-xs text-[#697386] block truncate">
                      {app.scholarship.provider}
                    </span>
                  </div>
                </td>

                {/* Stage Dropdown */}
                <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={app.status}
                    onChange={(e) => handleStageChange(app.id, e.target.value as ApplicationStatus)}
                    className={`text-xs font-semibold py-1 px-2.5 rounded-md border ${getStatusBadge(
                      app.status
                    )} bg-white focus:outline-hidden`}
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s} className="bg-white text-[#151827]">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Vault Readiness Bar */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 max-w-[120px]">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          readiness.readinessPercentage === 100
                            ? 'bg-emerald-500'
                            : 'bg-[#635BFF]'
                        }`}
                        style={{ width: `${readiness.readinessPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#151827]">
                      {readiness.readinessPercentage}%
                    </span>
                  </div>
                </td>

                {/* Reference Number */}
                <td className="py-4 px-4 text-xs font-mono text-[#697386]">
                  {app.referenceNumber || <span className="text-gray-400 italic">None</span>}
                </td>

                {/* Deadline */}
                <td className="py-4 px-4 text-xs font-medium">
                  <span className={days <= 5 ? 'font-bold text-rose-600' : 'text-[#697386]'}>
                    {days < 0 ? 'Passed' : `${days} days left`}
                  </span>
                </td>

                {/* Action */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <button
                    onClick={() => onOpenDetails(app)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#635BFF] hover:underline"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
