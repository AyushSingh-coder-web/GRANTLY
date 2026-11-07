import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  User,
  Compass,
  BookOpen,
  Home,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser, profile, logout } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Discover Scholarships', href: '/scholarships', icon: Compass },
    { label: 'How It Works', href: '/how-it-works', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Support Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8EAF1] shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo on Left */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
            title="Return to GRANTLY Home"
            aria-label="GRANTLY Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-sm shadow-[#635BFF]/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#151827] font-heading">
                  GRANTLY
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] px-1.5 py-0.5 rounded">
                  Intelligence
                </span>
              </div>
              <span className="text-[10px] text-[#697386] hidden sm:block -mt-1 font-medium">
                Fair Chance for Every Opportunity
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Centered) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'text-[#635BFF] bg-[#635BFF]/8 font-bold'
                      : 'text-[#697386] hover:text-[#151827] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Dashboard ({currentUser?.name?.split(' ')[0] || profile.fullName.split(' ')[0]})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-[#151827] hover:text-[#635BFF] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started Free</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Hamburger Button on Right */}
          <div className="flex lg:hidden items-center">
            <button
              ref={buttonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl text-[#151827] hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]/30 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden border-b border-[#E8EAF1] bg-white px-4 pt-3 pb-6 shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'text-[#635BFF] bg-[#635BFF]/8'
                      : 'text-[#697386] hover:text-[#151827] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#635BFF] text-white font-bold text-xs shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>Go to Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl border border-[#E8EAF1] text-[#151827] text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-[#635BFF] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
