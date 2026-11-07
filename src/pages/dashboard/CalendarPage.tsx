import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { InteractiveCalendar } from '../../components/calendar/InteractiveCalendar';
import { useApp } from '../../context/AppContext';
import { generateDeadlineItems } from '../../services/deadlineRisk';
import { DeadlineItem, DeadlineUrgency } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    scholarships,
    applications,
    vaultDocuments,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-11-15');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderNotes, setReminderNotes] = useState('');
  const [urgency, setUrgency] = useState<DeadlineUrgency>('urgent');

  const deadlineItems = generateDeadlineItems(scholarships, applications, vaultDocuments);

  const handleOpenAddReminder = (date: string) => {
    setSelectedDate(date);
    setReminderTitle('');
    setReminderNotes('');
    setModalOpen(true);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    addCalendarEvent({
      title: reminderTitle,
      date: selectedDate,
      type: 'personal_task',
      urgency,
      notes: reminderNotes,
    });

    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-5 h-5 text-[#635BFF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6]">
                Core Module 06
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151827] dark:text-white font-heading">
              Deadline Intelligence & Personalized Calendar
            </h1>
            <p className="text-xs sm:text-sm text-[#697386] dark:text-gray-400 mt-1">
              Risk-prioritized timeline based on remaining days, document completeness, and application status.
            </p>
          </div>

          <button
            onClick={() => handleOpenAddReminder('2026-11-15')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Milestone / Reminder</span>
          </button>
        </div>

        {/* Feature 23 Diff 05: Deadline Risk Intelligence Ranking */}
        <div className="bg-white dark:bg-[#1C2033] rounded-2xl border border-[#E8EAF1] dark:border-gray-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Deadline Risk Priority Matrix
              </span>
              <h3 className="font-bold text-base text-[#151827] dark:text-white mt-0.5">
                Dynamic Urgency Scoring (0 - 100)
              </h3>
            </div>
            <p className="text-xs text-[#697386] dark:text-gray-400">
              Calculated dynamically from: Time Remaining (50%) + Prep Stage (30%) + Missing Vault Documents (20%)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {deadlineItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-[#F8F9FC] dark:bg-gray-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {item.provider}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      item.riskScore >= 70
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : item.riskScore >= 40
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    Risk: {item.riskScore}/100
                  </span>
                </div>

                <h4 className="font-bold text-xs text-[#151827] dark:text-white line-clamp-1">
                  {item.scholarshipTitle}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-[#697386] dark:text-gray-400">
                  <span>
                    Deadline:{' '}
                    <strong className="text-[#151827] dark:text-white">
                      {new Date(item.deadlineDate).toLocaleDateString()}
                    </strong>
                  </span>
                  <span className={item.daysRemaining <= 5 ? 'font-bold text-rose-600' : ''}>
                    {item.daysRemaining <= 0 ? 'Closed' : `${item.daysRemaining} days left`}
                  </span>
                </div>

                <div className="pt-1 text-[11px] text-[#697386] dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50">
                  <span className="font-semibold text-[#151827] dark:text-gray-300">Action:</span>{' '}
                  {item.nextRecommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Calendar Component */}
        <InteractiveCalendar
          events={calendarEvents}
          onAddReminder={handleOpenAddReminder}
        />

        {/* Modal: Add Personal Reminder */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#151827] rounded-2xl max-w-md w-full border border-[#E8EAF1] dark:border-gray-800 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#151827] dark:text-white">
                  Add Personal Deadline / Task
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReminder} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Task / Milestone Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Visit Tehsil office for renewed family income seal"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Urgency Tier
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as DeadlineUrgency)}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                  >
                    <option value="critical">Critical Priority (Red)</option>
                    <option value="urgent">Urgent Priority (Amber)</option>
                    <option value="upcoming">Standard Milestone (Indigo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] dark:text-gray-400 mb-1">
                    Notes & Action Items (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Bring 2 passport photos, college identity card, and original marksheet copy..."
                    value={reminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-lg border border-[#E8EAF1] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#151827] dark:text-white"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#697386]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
