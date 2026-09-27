import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shield, LogOut, User } from 'lucide-react';
import { AdminUser, NavigationTarget } from '../../types';

interface TopHeaderProps {
  admin: AdminUser;
  currentTarget: NavigationTarget;
  onNavigate: (target: NavigationTarget) => void;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  breadcrumbData?: {
    section: string;
    target?: NavigationTarget;
    detail?: string;
  };
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  admin,
  onNavigate,
  onLogout,
  onToggleSidebar,
  breadcrumbData,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#E6DDD7] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 text-[#746C68] hover:text-[#292525] rounded-md hover:bg-[#FAF7F2]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Restrained Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px]">
          {breadcrumbData ? (
            <div className="flex items-center gap-2 text-[#746C68]">
              {breadcrumbData.target ? (
                <button
                  type="button"
                  onClick={() => onNavigate(breadcrumbData.target!)}
                  className="hover:text-[#A92F35] font-medium transition-colors"
                >
                  {breadcrumbData.section}
                </button>
              ) : (
                <span className="font-semibold text-[#292525]">{breadcrumbData.section}</span>
              )}
              {breadcrumbData.detail && (
                <>
                  <span className="text-[#958B86]">/</span>
                  <span className="font-semibold text-[#292525]">{breadcrumbData.detail}</span>
                </>
              )}
            </div>
          ) : (
            <span className="font-semibold text-[#292525]">Overview</span>
          )}
        </nav>
      </div>

      {/* Right: Administrator Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id="admin-profile-menu-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#FAF7F2] transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#F7EAE7] border border-[#A92F35]/20 flex items-center justify-center text-[#A92F35] text-[13px] font-bold">
            {admin.role === 'super_admin' ? 'SA' : 'PA'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-[13px] font-semibold text-[#292525] leading-tight">{admin.name}</div>
            <div className="text-[12px] text-[#746C68] leading-tight">
              {admin.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#958B86] transition-transform duration-150 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownOpen && (
          <div
            id="admin-profile-dropdown"
            className="absolute right-0 mt-1.5 w-60 bg-white border border-[#E6DDD7] rounded-[14px] shadow-[0_8px_24px_rgba(41,37,37,0.08)] py-2 z-40 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-4 py-2 border-b border-[#E6DDD7]">
              <div className="text-[13px] font-semibold text-[#292525]">{admin.name}</div>
              <div className="text-[12px] text-[#746C68] truncate">{admin.email}</div>
            </div>

            <div className="py-1">
              <button
                type="button"
                id="header-admin-account-link"
                onClick={() => {
                  setDropdownOpen(false);
                  onNavigate({ view: 'admin_account' });
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#292525] hover:bg-[#FAF7F2] transition-colors text-left"
              >
                <User className="w-4 h-4 text-[#746C68]" />
                Admin Account
              </button>
              <button
                type="button"
                id="header-admin-logout-btn"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#A92F35] hover:bg-[#F7EAE7] transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-[#A92F35]" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
