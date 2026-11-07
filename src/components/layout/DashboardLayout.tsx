import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  LayoutDashboard,
  Compass,
  FileCheck,
  FolderLock,
  Calendar,
  Sparkles,
  Bot,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isAi?: boolean;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    profile,
    profileCompleteness,
    notifications,
    resetDemoData,
    logout,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navGroups: NavGroup[] = [
    {
      title: 'Workspace',
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Discover Scholarships', href: '/dashboard/discover', icon: Compass },
        { label: 'My Applications', href: '/dashboard/applications', icon: FileCheck },
        { label: 'Document Vault', href: '/dashboard/documents', icon: FolderLock },
        { label: 'Deadline Calendar', href: '/dashboard/calendar', icon: Calendar },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { label: 'Eligibility Engine', href: '/dashboard/eligibility/reliance-ug-2025', icon: Sparkles },
        { label: 'Ask GRANTLY AI', href: '/dashboard/assistant', icon: Bot, isAi: true },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Student Profile', href: '/dashboard/profile', icon: User },
        {
          label: 'Notifications',
          href: '/dashboard/notifications',
          icon: Bell,
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        { label: 'Settings & Privacy', href: '/dashboard/settings', icon: Settings },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#151827] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8EAF1] px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer group" title="Return to Home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight font-heading group-hover:text-[#635BFF] transition-colors">GRANTLY</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/notifications"
            className="p-2 text-gray-500 hover:text-gray-700 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E8EAF1] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Close button */}
          <div className="p-5 border-b border-[#E8EAF1] flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight font-heading text-[#151827] group-hover:text-[#635BFF] transition-colors">
                  GRANTLY
                </span>
                <span className="block text-[10px] text-[#697386] font-medium -mt-1">
                  Opportunity Command Center
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile Snapshot Widget */}
          <div className="p-4 mx-3 my-3 bg-[#F8F9FC] rounded-xl border border-[#E8EAF1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#635BFF]/10 text-[#635BFF] font-bold text-sm flex items-center justify-center shrink-0 border border-[#635BFF]/20">
                {profile.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#151827] truncate">
                  {profile.fullName}
                </h4>
                <p className="text-[11px] text-[#697386] truncate">
                  {profile.degree} • {profile.course}
                </p>
              </div>
            </div>

            {/* Profile Completeness Bar */}
            <div className="mt-3 pt-2.5 border-t border-gray-200/60">
              <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                <span className="text-[#697386]">Profile Readiness</span>
                <span className="font-bold text-[#635BFF]">
                  {profileCompleteness}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#635BFF] to-[#14B8A6] rounded-full transition-all duration-500"
                  style={{ width: `${profileCompleteness}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 space-y-6 py-2">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h5 className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#697386] mb-1.5">
                  {group.title}
                </h5>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-[#635BFF] text-white shadow-xs font-semibold'
                            : 'text-[#697386] hover:text-[#151827] hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : item.isAi ? 'text-[#8B5CF6]' : ''}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              active ? 'bg-white text-[#635BFF]' : 'bg-rose-500 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.isAi && !active && (
                          <span className="text-[10px] uppercase font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">
                            AI
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Actions & Controls */}
          <div className="p-3 border-t border-[#E8EAF1] space-y-2">
            {/* Quick Demo Resetter */}
            <button
              onClick={() => {
                if (window.confirm('Reset demo state to clean authentic data?')) {
                  resetDemoData();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-[#E8EAF1] text-xs font-medium text-[#697386] hover:text-[#635BFF] hover:border-[#635BFF]/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Breadcrumb & Live Verification Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-[#E8EAF1]">
          <div className="flex items-center gap-2 text-xs text-[#697386]">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="font-semibold text-[#151827] capitalize">
              {location.pathname.replace('/dashboard/', '').replace('/dashboard', 'Overview')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Rule Engine Active</span>
            </div>

            <Link
              to="/dashboard/notifications"
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}
    </div>
  );
};
