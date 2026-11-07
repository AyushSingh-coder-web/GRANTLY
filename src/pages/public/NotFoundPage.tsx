import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GraduationCap, ArrowRight, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0E101B] text-[#151827] dark:text-[#E2E8F0] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <span className="text-6xl font-extrabold text-[#635BFF] font-mono block">
          404
        </span>
        <h1 className="text-2xl font-bold font-heading text-[#151827] dark:text-white">
          Opportunity Not Found
        </h1>
        <p className="text-xs text-[#697386] dark:text-gray-400">
          The page or scholarship resource you requested does not exist or has been moved to an updated scheme code.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-[#151827] dark:text-white"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#4941D1] text-white text-xs font-semibold shadow-xs"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
