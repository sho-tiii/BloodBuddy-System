import React from 'react';
import { Droplet, ShieldCheck } from 'lucide-react';
import { ActiveView } from '../../types';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#E6DDD7] bg-[#FAF7F2] mt-20 pt-12 pb-10 text-[#746C68]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E6DDD7]">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <button
              id="footer-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex items-center group text-left focus:outline-none transition-opacity hover:opacity-95"
              aria-label="BloodBuddy Home"
            >
              <img
                src="/BloodBuddyLogo.png"
                alt="BloodBuddy Logo"
                className="h-14 w-14 sm:h-16 sm:w-16 object-contain shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/BloodBuddyLogo.svg';
                }}
              />
            </button>
            <p className="text-xs sm:text-sm text-[#746C68] max-w-md leading-relaxed">
              A real-time community blood matching platform connecting people in
              need with nearby volunteer donors based on self-reported blood type,
              general location, and availability.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#557A61] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#557A61]" />
              <span className="font-medium">
                100% Non-monetary community voluntary coordination
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-[#292525] uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#A92F35] transition-colors"
                >
                  Find Blood
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donate-blood')}
                  className="hover:text-[#A92F35] transition-colors"
                >
                  Donate Blood
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-requests')}
                  className="hover:text-[#A92F35] transition-colors"
                >
                  My Blood Requests
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about-us')}
                  className="hover:text-[#A92F35] transition-colors"
                >
                  About Us & Principles
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Disclaimer Summary */}
          <div>
            <h4 className="text-xs font-semibold text-[#292525] uppercase tracking-wider mb-3">
              Clinical Statement
            </h4>
            <p className="text-[11px] leading-relaxed text-[#958B86]">
              BloodBuddy facilitates contact and matching only. Medical screening,
              donor eligibility, crossmatching, and blood compatibility testing
              remain the sole responsibility of accredited healthcare facilities.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#958B86]">
          <p>© {new Date().getFullYear()} BloodBuddy. Every Drop Counts.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Community Blood Coordination</span>
            <span>·</span>
            <span>Metro Manila, Philippines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
