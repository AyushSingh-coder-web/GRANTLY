import React from 'react';
import { RuleEvaluationResult } from '../../types';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface EligibilityBreakdownTableProps {
  results: RuleEvaluationResult[];
}

export const EligibilityBreakdownTable: React.FC<EligibilityBreakdownTableProps> = ({
  results,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E8EAF1] dark:border-gray-800 bg-white dark:bg-[#1C2033] shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#F8F9FC] dark:bg-gray-800/60 border-b border-[#E8EAF1] dark:border-gray-800 text-[11px] font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400">
          <tr>
            <th className="py-3.5 px-4 sm:px-6">Requirement Rule</th>
            <th className="py-3.5 px-4">Your Profile Data</th>
            <th className="py-3.5 px-4">Required Condition</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 sm:px-6">Deterministic Explanation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8EAF1] dark:divide-gray-800">
          {results.map((r) => {
            const isPassed = r.status === 'passed';
            const isFailed = r.status === 'failed';
            const isMissing = r.status === 'missing_info';

            return (
              <tr
                key={r.ruleId}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Rule Title */}
                <td className="py-4 px-4 sm:px-6 font-semibold text-[#151827] dark:text-white">
                  <div className="flex items-center gap-2">
                    <span>{r.ruleName}</span>
                    {r.isMandatory && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                        Mandatory
                      </span>
                    )}
                  </div>
                </td>

                {/* Student's Value */}
                <td className="py-4 px-4 text-xs font-medium text-[#151827] dark:text-gray-200">
                  <span
                    className={
                      isMissing
                        ? 'text-amber-600 dark:text-amber-400 italic'
                        : isFailed
                        ? 'text-rose-600 dark:text-rose-400 font-semibold'
                        : 'font-semibold text-emerald-700 dark:text-emerald-400'
                    }
                  >
                    {r.studentValue}
                  </span>
                </td>

                {/* Required Threshold */}
                <td className="py-4 px-4 text-xs font-medium text-[#697386] dark:text-gray-300">
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-xs">
                    {r.requiredValue}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4 text-center">
                  {isPassed && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Matched
                    </span>
                  )}
                  {isFailed && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                      <XCircle className="w-3.5 h-3.5" />
                      Failed
                    </span>
                  )}
                  {isMissing && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Missing
                    </span>
                  )}
                </td>

                {/* Explanation */}
                <td className="py-4 px-4 sm:px-6 text-xs text-[#697386] dark:text-gray-400 max-w-xs leading-relaxed">
                  {r.explanation}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
