import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useApp } from '../../context/AppContext';
import { NotificationType, AppNotification } from '../../types';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import {
  Bell,
  CheckCircle2,
  Calendar,
  FileText,
  User,
  CheckCheck,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [notifToDelete, setNotifToDelete] = useState<AppNotification | null>(null);

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'deadline':
        return Calendar;
      case 'document':
        return FileText;
      case 'profile':
        return User;
      case 'application':
        return CheckCircle2;
      default:
        return Bell;
    }
  };

  const handleDeleteSingle = (n: AppNotification, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(n.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-5 h-5 text-[#635BFF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                Notification Center
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#151827] font-heading">
              Platform Alerts & Updates
            </h1>
            <p className="text-xs text-[#697386] mt-1">
              Generated from verified database deadlines, vault matches, and status changes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearAllModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition-colors"
                title="Clear all alerts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E8EAF1] bg-white text-xs font-semibold text-[#697386] hover:text-[#151827] transition-colors shadow-2xs"
            >
              <CheckCheck className="w-4 h-4 text-[#635BFF]" />
              <span>Mark All Read</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-[#E8EAF1] pb-3 overflow-x-auto text-xs font-bold">
          {(['all', 'deadline', 'document', 'application', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                activeFilter === tab
                  ? 'bg-[#635BFF] text-white shadow-2xs'
                  : 'text-[#697386] hover:bg-gray-100'
              }`}
            >
              {tab === 'all' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#E8EAF1] p-8 space-y-2">
              <Bell className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#151827]">
                No notifications in this view
              </h3>
              <p className="text-xs text-gray-400">
                You are completely up to date with all scholarship deadlines and applications.
              </p>
            </div>
          ) : (
            filteredNotifs.map((n) => {
              const Icon = getIcon(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer group ${
                    n.isRead
                      ? 'bg-white border-[#E8EAF1] opacity-80'
                      : 'bg-white border-[#635BFF]/30 ring-1 ring-[#635BFF]/10 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        n.type === 'deadline'
                          ? 'bg-rose-50 text-rose-600'
                          : n.type === 'document'
                          ? 'bg-teal-50 text-teal-600'
                          : 'bg-[#635BFF]/10 text-[#635BFF]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#151827]">
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#635BFF] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#697386] leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-400 block pt-0.5">
                        {new Date(n.createdAt).toLocaleDateString()} at{' '}
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#635BFF] hover:underline"
                      >
                        <span>Action</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSingle(n, e)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showClearAllModal}
        title="Clear All Notifications"
        message="Are you sure you want to delete all notifications from your workspace? This action cannot be undone."
        confirmLabel="Clear All Alerts"
        onConfirm={() => {
          clearAllNotifications();
          setShowClearAllModal(false);
        }}
        onCancel={() => setShowClearAllModal(false)}
      />
    </DashboardLayout>
  );
};

