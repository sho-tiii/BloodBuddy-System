import React from 'react';
import {
  LayoutDashboard,
  Users as UsersIcon,
  Droplets,
  AlertTriangle,
  UserCheck,
  LogOut,
  X,
  ShieldCheck,
  FileText,
  Archive,
} from 'lucide-react';
import { NavigationTarget, AdminUser } from '../../types';

interface SidebarProps {
  admin: AdminUser;
  currentTarget: NavigationTarget;
  onNavigate: (target: NavigationTarget) => void;
  onLogout: () => void;
  openReportsCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  admin,
  currentTarget,
  onNavigate,
  onLogout,
  openReportsCount,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const currentView = currentTarget.view;

  const isUsersActive = currentView === 'users' || currentView === 'user_details';
  const isRequestsActive = currentView === 'requests' || currentView === 'request_details';
  const isReportsActive = currentView === 'reports' || currentView === 'report_details';
  const isOverviewActive = currentView === 'overview';
  const isAdminAccountActive = currentView === 'admin_account';

  // Super Admin view states
  const isAdminManagementActive = currentView === 'admin_management' || currentView === 'admin_details';
  const isAuditLogsActive = currentView === 'audit_logs';
  const isArchivesActive = currentView === 'archives';

  const isSuperAdmin = admin.role === 'super_admin';

  const navItems = [
    {
      id: 'nav-overview',
      label: 'Overview',
      icon: LayoutDashboard,
      active: isOverviewActive,
      onClick: () => {
        onNavigate({ view: 'overview' });
        if (onCloseMobile) onCloseMobile();
      },
    },
    {
      id: 'nav-users',
      label: 'Users',
      icon: UsersIcon,
      active: isUsersActive,
      onClick: () => {
        onNavigate({ view: 'users' });
        if (onCloseMobile) onCloseMobile();
      },
    },
    {
      id: 'nav-requests',
      label: 'Blood Requests',
      icon: Droplets,
      active: isRequestsActive,
      onClick: () => {
        onNavigate({ view: 'requests' });
        if (onCloseMobile) onCloseMobile();
      },
    },
    {
      id: 'nav-reports',
      label: 'Reports',
      icon: AlertTriangle,
      active: isReportsActive,
      badge: openReportsCount > 0 ? openReportsCount : undefined,
      onClick: () => {
        onNavigate({ view: 'reports' });
        if (onCloseMobile) onCloseMobile();
      },
    },
  ];

  const superAdminNavItems = [
    {
      id: 'nav-admin-management',
      label: 'Admins',
      icon: ShieldCheck,
      active: isAdminManagementActive,
      onClick: () => {
        onNavigate({ view: 'admin_management' });
        if (onCloseMobile) onCloseMobile();
      },
    },
    {
      id: 'nav-audit-logs',
      label: 'Audit Logs',
      icon: FileText,
      active: isAuditLogsActive,
      onClick: () => {
        onNavigate({ view: 'audit_logs' });
        if (onCloseMobile) onCloseMobile();
      },
    },
    {
      id: 'nav-archives',
      label: 'Archives',
      icon: Archive,
      active: isArchivesActive,
      onClick: () => {
        onNavigate({ view: 'archives' });
        if (onCloseMobile) onCloseMobile();
      },
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-[#292525]/40 z-40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-[260px] bg-white border-r border-[#E6DDD7] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Brand Header */}
          <div className="h-16 px-6 border-b border-[#E6DDD7] flex items-center justify-between">
            <div>
              <div className="text-[17px] font-bold text-[#292525] tracking-tight font-serif">
                BloodBuddy
              </div>
              <div className="text-[10.5px] font-bold tracking-[0.14em] text-[#A92F35] uppercase flex items-center gap-1.5">
                <span>{isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN PORTAL'}</span>
              </div>
            </div>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="md:hidden p-1 text-[#746C68] hover:text-[#292525] rounded"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <div className="p-3">
            <div className="px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-[#958B86] uppercase">
              Platform Moderation
            </div>
            <nav className="space-y-1 mt-1" aria-label="Sidebar Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={item.id}
                    type="button"
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all cursor-pointer ${
                      item.active
                        ? 'bg-[#F7EAE7] text-[#A92F35] font-semibold'
                        : 'text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-[18px] h-[18px] ${item.active ? 'text-[#A92F35]' : 'text-[#958B86]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold text-[#A92F35] bg-white rounded-full border border-[#A92F35]/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Super Admin Exclusive Navigation Section */}
          {isSuperAdmin && (
            <div className="p-3 pt-1 border-t border-[#F0ECE7]">
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-[#A92F35] uppercase flex items-center justify-between">
                <span>Governance</span>
                <span className="text-[10px] font-semibold bg-[#F7EAE7] text-[#A92F35] px-1.5 py-0.5 rounded">
                  Super Admin
                </span>
              </div>
              <nav className="space-y-1 mt-1" aria-label="Governance Navigation">
                {superAdminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      id={item.id}
                      type="button"
                      onClick={item.onClick}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all cursor-pointer ${
                        item.active
                          ? 'bg-[#F7EAE7] text-[#A92F35] font-semibold'
                          : 'text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[18px] h-[18px] ${item.active ? 'text-[#A92F35]' : 'text-[#958B86]'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-[#E6DDD7] space-y-1 shrink-0">
          <button
            id="nav-admin-account"
            type="button"
            onClick={() => {
              onNavigate({ view: 'admin_account' });
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all cursor-pointer ${
              isAdminAccountActive
                ? 'bg-[#F7EAE7] text-[#A92F35] font-semibold'
                : 'text-[#746C68] hover:text-[#292525] hover:bg-[#FAF7F2]'
            }`}
          >
            <UserCheck
              className={`w-[18px] h-[18px] ${isAdminAccountActive ? 'text-[#A92F35]' : 'text-[#958B86]'}`}
            />
            <span>Account Details</span>
          </button>

          <button
            id="nav-logout"
            type="button"
            onClick={() => {
              onLogout();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-[#746C68] hover:text-[#A92F35] hover:bg-[#F7EAE7]/60 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px] text-[#958B86] hover:text-[#A92F35]" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
