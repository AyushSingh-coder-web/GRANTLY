import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E8EAF1] text-[#697386] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to GRANTLY Home"
              aria-label="GRANTLY Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#151827] font-heading">
                GRANTLY
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#697386]">
              The unified scholarship discovery and management command center for higher education students. Discover opportunities, understand deterministic eligibility, and stay in control of your future.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-medium text-emerald-600">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Verified data sources & deterministic eligibility engine</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151827] mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/scholarships" className="hover:text-[#635BFF] transition-colors">
                  Scholarship Discovery
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#635BFF] transition-colors">
                  Eligibility Intelligence
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#635BFF] transition-colors">
                  Application Command Center
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#635BFF] transition-colors">
                  Smart Document Vault
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#635BFF] transition-colors">
                  Deadline Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151827] mb-4">
              Official Portals
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#635BFF] transition-colors"
                >
                  National Scholarship Portal <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.aicte-india.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#635BFF] transition-colors"
                >
                  AICTE Schemes <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://dst.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#635BFF] transition-colors"
                >
                  DST INSPIRE <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ugc.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#635BFF] transition-colors"
                >
                  UGC Higher Education <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151827] mb-4">
              Trust & Transparency
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <span className="text-xs text-gray-500">Student Privacy Guard</span>
              </li>
              <li>
                <span className="text-xs text-gray-500">No Telemetry / No Data Selling</span>
              </li>
              <li>
                <span className="text-xs text-gray-500">Open Rule Verification</span>
              </li>
              <li>
                <span className="text-xs text-gray-500">Local Vault Encryption</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8EAF1] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} GRANTLY Inc. Every opportunity deserves a fair chance.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for ambitious students across India.
          </p>
        </div>
      </div>
    </footer>
  );
};

