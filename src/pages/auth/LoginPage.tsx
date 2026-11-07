import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your student email address.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address (e.g., student@college.ac.in).');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);

    // Simulate network authentication request
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 450);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('aarav.sharma@example.edu.in', 'password123');
      setLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 mb-4 group cursor-pointer"
          title="Return to GRANTLY Home"
          aria-label="GRANTLY Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight font-heading text-[#151827]">
            GRANTLY
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-[#151827] font-heading">
          Welcome back to your workspace
        </h2>
        <p className="mt-1 text-xs text-[#697386]">
          Enter your student account credentials or explore our live demo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-[#E8EAF1] space-y-6">
          {/* Quick Demo Access Button */}
          <div className="bg-gradient-to-r from-[#635BFF]/10 via-[#8B5CF6]/10 to-teal-500/10 p-4 rounded-xl border border-[#635BFF]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#635BFF]">
              <Sparkles className="w-4 h-4" />
              <span>Instant Hackathon Evaluation Access</span>
            </div>
            <p className="text-[11px] text-[#697386] leading-snug">
              1-click sign in with pre-seeded student profile (Aarav Sharma - NIT CS 2nd Year) and active applications.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Launch Demo Student Workspace</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-gray-400 absolute">
              or sign in with credentials
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#697386] mb-1">
                Student Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu.in"
                className="w-full py-2.5 px-3.5 text-xs rounded-lg border border-[#E8EAF1] bg-white text-[#151827] focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#697386]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#635BFF] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2.5 pl-3.5 pr-10 text-xs rounded-lg border border-[#E8EAF1] bg-white text-[#151827] focus:outline-hidden focus:ring-2 focus:ring-[#635BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#151827] hover:bg-gray-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#697386] pt-2 border-t border-gray-100">
            <span>Don&apos;t have an account? </span>
            <Link to="/register" className="font-bold text-[#635BFF] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
