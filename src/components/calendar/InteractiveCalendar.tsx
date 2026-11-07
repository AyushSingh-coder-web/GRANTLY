import React, { useState } from 'react';
import { CalendarEvent, DeadlineUrgency } from '../../types';
import { useApp } from '../../context/AppContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  onAddReminder: (date: string) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  events,
  onAddReminder,
}) => {
  const { toggleCalendarEventCompleted, deleteCalendarEvent } = useApp();

  // Calendar date navigation (November 2026 default)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-15');
  const [urgencyFilter] = useState<DeadlineUrgency | 'all'>('all');
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateKey = (day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const selectedEvents = events.filter((e) => {
    const matchesDate = e.date === selectedDateStr;
    const matchesFilter = urgencyFilter === 'all' || e.urgency === urgencyFilter;
    return matchesDate && matchesFilter;
  });

  const getUrgencyColor = (urgency: DeadlineUrgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-rose-500 text-white';
      case 'urgent':
        return 'bg-amber-500 text-white';
      case 'upcoming':
        return 'bg-[#635BFF] text-white';
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteCalendarEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8EAF1] p-5 sm:p-6 shadow-xs">
          {/* Month Header & Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#635BFF]" />
              <h3 className="font-bold text-lg text-[#151827] font-heading">
                {monthNames[month]} {year}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg border border-[#E8EAF1] hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-[#E8EAF1] hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#697386] mb-2 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty cells before 1st of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 sm:h-20 bg-gray-50/50 rounded-lg border border-dashed border-gray-100" />
            ))}

            {/* Active days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateKey = formatDateKey(dayNum);
              const isSelected = selectedDateStr === dateKey;
              const dayEvents = events.filter((e) => e.date === dateKey);

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateKey)}
                  className={`h-14 sm:h-20 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#635BFF] bg-[#635BFF]/5 ring-2 ring-[#635BFF]/20'
                      : 'border-[#E8EAF1] hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-md w-6 h-6 flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#635BFF] text-white'
                          : 'text-[#151827]'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-gray-400 hidden sm:inline">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event indicators */}
                  <div className="flex items-center gap-1 flex-wrap overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <span
                        key={ev.id}
                        title={ev.title}
                        className={`h-1.5 w-1.5 rounded-full ${getUrgencyColor(ev.urgency)}`}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-gray-400 font-bold">
                        +{dayEvents.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 text-xs text-[#697386]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Critical (≤ 5d)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Urgent (≤ 14d)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#635BFF]" />
                <span>Upcoming</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAddReminder(selectedDateStr)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#635BFF] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Personal Reminder</span>
            </button>
          </div>
        </div>

        {/* Selected Day Agenda Drawer */}
        <div className="bg-white rounded-2xl border border-[#E8EAF1] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#697386]">
                  Agenda for
                </span>
                <h4 className="text-base font-bold text-[#151827]">
                  {new Date(selectedDateStr).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => onAddReminder(selectedDateStr)}
                className="p-1.5 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white shadow-xs"
                title="Add reminder for this day"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Agenda Event Cards */}
            <div className="mt-4 space-y-3">
              {selectedEvents.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs font-medium text-gray-400">
                    No deadlines or tasks scheduled for this day.
                  </p>
                  <button
                    type="button"
                    onClick={() => onAddReminder(selectedDateStr)}
                    className="text-xs font-semibold text-[#635BFF] hover:underline"
                  >
                    Create a task reminder
                  </button>
                </div>
              ) : (
                selectedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      ev.isCompleted
                        ? 'bg-gray-50 border-gray-200 opacity-60'
                        : 'bg-[#F8F9FC] border-[#E8EAF1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCalendarEventCompleted(ev.id)}
                          className="mt-0.5 text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${ev.isCompleted ? 'text-emerald-500 fill-emerald-500/20' : ''}`}
                          />
                        </button>
                        <div>
                          <h5
                            className={`text-xs font-bold ${
                              ev.isCompleted
                                ? 'line-through text-gray-400'
                                : 'text-[#151827]'
                            }`}
                          >
                            {ev.title}
                          </h5>
                          {ev.scholarshipTitle && (
                            <p className="text-[11px] text-[#635BFF] font-medium mt-0.5">
                              {ev.scholarshipTitle}
                            </p>
                          )}
                          {ev.notes && (
                            <p className="text-[11px] text-[#697386] mt-1">
                              {ev.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEventToDelete(ev)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Calendar Footer Tip */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-[#697386] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Calculated deadline alerts update automatically as time elapses.</span>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={!!eventToDelete}
        title="Delete Reminder / Task"
        message="Are you sure you want to delete this scheduled milestone? It will be removed from your personal calendar."
        itemName={eventToDelete?.title}
        confirmLabel="Delete Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </>
  );
};

