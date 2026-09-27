import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Droplet,
  User as UserIcon,
  LogOut,
  FileText,
  HeartHandshake,
  Settings,
  Menu,
  X,
  UserPlus
} from 'lucide-react';
import { UserProfile, ActiveView } from '../../types';

interface HeaderProps {
  isAuthenticated: boolean;
  currentUser: UserProfile;
  currentView: ActiveView;
  pendingDonationCount: number;
  onNavigate: (view: ActiveView) => void;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  currentUser,
  currentView,
  pendingDonationCount,
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  onLogout,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DDD7] h-20 min-h-[76px] max-h-[80px]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center justify-start">
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center group text-left focus:outline-none transition-opacity hover:opacity-95 py-1"
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
        </div>

        {/* Center: Desktop Nav Items (Truly Centered) */}
        <nav className="hidden md:flex items-center justify-center gap-7 lg:gap-8">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`text-xs lg:text-sm font-semibold tracking-wide transition-colors relative py-1.5 ${
              currentView === 'home'
                ? 'text-[#A92F35] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#A92F35] after:rounded-full'
                : 'text-[#746C68] hover:text-[#292525]'
            }`}
          >
            HOME
          </button>

          <button
            id="nav-donate-btn"
            onClick={() => onNavigate('donate-blood')}
            className={`text-xs lg:text-sm font-semibold tracking-wide transition-colors relative py-1.5 ${
              currentView === 'donate-blood'
                ? 'text-[#A92F35] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#A92F35] after:rounded-full'
                : 'text-[#746C68] hover:text-[#292525]'
            }`}
          >
            DONATE BLOOD
          </button>

          <button
            id="nav-about-btn"
            onClick={() => onNavigate('about-us')}
            className={`text-xs lg:text-sm font-semibold tracking-wide transition-colors relative py-1.5 ${
              currentView === 'about-us'
                ? 'text-[#A92F35] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#A92F35] after:rounded-full'
                : 'text-[#746C68] hover:text-[#292525]'
            }`}
          >
            ABOUT US
          </button>
        </nav>

        {/* Right: Public Actions OR Authenticated Profile */}
        <div className="flex items-center justify-end gap-3">
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                id="header-login-btn"
                onClick={onOpenLogin}
                className="h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide text-[#292525] hover:bg-white hover:text-[#A92F35] border border-[#E6DDD7] transition-all"
              >
                Log In
              </button>
              <button
                id="header-register-btn"
                onClick={() => (onOpenRegister ? onOpenRegister() : onNavigate('register'))}
                className="h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide bg-[#A92F35] text-white hover:bg-[#8F272D] transition-colors shadow-xs"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                id="profile-dropdown-trigger"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E6DDD7] transition-all focus:outline-none shadow-xs"
                aria-expanded={isProfileOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[#A92F35] text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                  <UserIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-xs font-semibold text-[#292525] leading-tight">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  {currentUser.bloodType && currentUser.bloodType !== 'Not provided' && (
                    <span className="text-[11px] text-[#746C68] leading-tight">
                      {currentUser.bloodType}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#746C68] transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-white border border-[#E6DDD7] rounded-2xl shadow-[0_12px_32px_rgba(41,37,37,0.08)] py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-4 py-3 border-b border-[#F0EAE5]">
                    <p className="text-sm font-semibold text-[#292525]">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-[#746C68] truncate">
                      {currentUser.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#F7EAE7] text-[#A92F35] text-[10px] font-bold">
                      Blood Type: {currentUser.bloodType}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      id="dropdown-my-requests"
                      onClick={() => {
                        onNavigate('my-requests');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#292525] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#A92F35]" />
                      <span>My Blood Requests</span>
                    </button>

                    <button
                      id="dropdown-donation-requests"
                      onClick={() => {
                        onNavigate('donation-requests');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#292525] hover:bg-[#FAF7F2] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <HeartHandshake className="w-4 h-4 text-[#A92F35]" />
                        <span>Donation Requests</span>
                      </div>
                      {pendingDonationCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#A92F35] text-white rounded-full">
                          {pendingDonationCount}
                        </span>
                      )}
                    </button>

                    <button
                      id="dropdown-account-settings"
                      onClick={() => {
                        onNavigate('account-settings');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#292525] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#746C68]" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#F0EAE5]">
                    <button
                      id="dropdown-logout"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#8F272D] hover:bg-[#FDF6F5] flex items-center gap-2.5 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-[#8F272D]" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 rounded-xl text-[#746C68] hover:bg-white border border-[#E6DDD7]"
            aria-label="Toggle menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t border-[#E6DDD7] bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              onNavigate('home');
              setIsMobileNavOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'home' ? 'bg-[#F7EAE7] text-[#A92F35]' : 'text-[#292525]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              onNavigate('donate-blood');
              setIsMobileNavOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'donate-blood' ? 'bg-[#F7EAE7] text-[#A92F35]' : 'text-[#292525]'
            }`}
          >
            Donate Blood
          </button>

          {isAuthenticated && (
            <>
              <button
                onClick={() => {
                  onNavigate('my-requests');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === 'my-requests' ? 'bg-[#F7EAE7] text-[#A92F35]' : 'text-[#292525]'
                }`}
              >
                My Blood Requests
              </button>

              <button
                onClick={() => {
                  onNavigate('donation-requests');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                  currentView === 'donation-requests' ? 'bg-[#F7EAE7] text-[#A92F35]' : 'text-[#292525]'
                }`}
              >
                <span>Donation Requests</span>
                {pendingDonationCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#A92F35] text-white">
                    {pendingDonationCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onNavigate('account-settings');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === 'account-settings' ? 'bg-[#F7EAE7] text-[#A92F35]' : 'text-[#292525]'
                }`}
              >
                Account Settings
              </button>
            </>
          )}

          <button
            onClick={() => {
              onNavigate('about-us');
              setIsMobileNavOpen(false);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'about-us' ? 'bg-[#F7EAE7] text-[#A92F35]' : 'text-[#292525]'
            }`}
          >
            About Us
          </button>

          <div className="pt-2 border-t border-[#F0EAE5]">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsMobileNavOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg border border-[#E6DDD7] text-[#292525]"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    if (onOpenRegister) onOpenRegister();
                    else onNavigate('register');
                    setIsMobileNavOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-[#A92F35] text-white"
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  onLogout();
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-[#8F272D] hover:bg-red-50"
              >
                Log Out ({currentUser.firstName})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
