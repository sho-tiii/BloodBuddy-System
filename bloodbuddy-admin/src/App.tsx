import React, { useState, useEffect, useMemo } from 'react';
import { dataService } from './services/dataService';
import { AdminUser, NavigationTarget } from './types';
import { ToastProvider, useToast } from './components/ui/ToastContext';
import { LoginView } from './components/views/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { OverviewView } from './components/views/OverviewView';
import { UsersView } from './components/views/UsersView';
import { UserDetailsView } from './components/views/UserDetailsView';
import { BloodRequestsView } from './components/views/BloodRequestsView';
import { BloodRequestDetailsView } from './components/views/BloodRequestDetailsView';
import { ReportsView } from './components/views/ReportsView';
import { ReportDetailsView } from './components/views/ReportDetailsView';
import { AdminAccountView } from './components/views/AdminAccountView';
import { AdminManagementView } from './components/views/AdminManagementView';
import { AdminDetailsView } from './components/views/AdminDetailsView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { ArchivesView } from './components/views/ArchivesView';

function AdminPortalApp() {
  const [admin, setAdmin] = useState<AdminUser | null>(() => dataService.getSession());
  const [navigationTarget, setNavigationTarget] = useState<NavigationTarget>({ view: 'overview' });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const { addToast } = useToast();

  // Validate active session
  useEffect(() => {
    const verified = dataService.getSession();
    if (!verified && admin) {
      setAdmin(null);
      setNavigationTarget({ view: 'overview' });
      addToast('Session Expired', 'Please sign in to continue.', 'danger');
    }
  }, [navigationTarget, admin]);

  const handleLoginSuccess = (authenticatedAdmin: AdminUser) => {
    setAdmin(authenticatedAdmin);
    setNavigationTarget({ view: 'overview' });
    addToast(
      'Signed in',
      `Welcome, ${authenticatedAdmin.name} (${authenticatedAdmin.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}).`,
      'info',
    );
  };

  const handleLogout = () => {
    dataService.logout();
    setAdmin(null);
    setNavigationTarget({ view: 'overview' });
    addToast('Logged out', 'Administrator session ended.', 'info');
  };

  const handleNavigate = (target: NavigationTarget) => {
    // Role-based route guard
    const superAdminOnlyViews = ['admin_management', 'admin_details', 'audit_logs', 'archives'];
    if (superAdminOnlyViews.includes(target.view) && admin?.role !== 'super_admin') {
      addToast('Access Denied', 'Super Administrator privileges are required for this section.', 'danger');
      setNavigationTarget({ view: 'overview' });
      return;
    }

    setNavigationTarget(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDataReset = () => {
    setDataVersion((v) => v + 1);
    setNavigationTarget({ view: 'overview' });
  };

  // Open reports count for sidebar badge
  const openReportsCount = useMemo(() => {
    if (!admin) return 0;
    return dataService.getReports().filter((r) => r.status === 'open' || r.status === 'under_review')
      .length;
  }, [admin, dataVersion, navigationTarget]);

  // Compute breadcrumb info
  const breadcrumbData = useMemo(() => {
    switch (navigationTarget.view) {
      case 'overview':
        return { section: 'Overview' };
      case 'users':
        return { section: 'Users' };
      case 'user_details': {
        const u = dataService.getUser(navigationTarget.userId);
        return {
          section: 'Users',
          target: { view: 'users' as const },
          detail: u ? `${u.firstName} ${u.lastName}` : navigationTarget.userId,
        };
      }
      case 'requests':
        return { section: 'Blood Requests' };
      case 'request_details':
        return {
          section: 'Blood Requests',
          target: { view: 'requests' as const },
          detail: `#${navigationTarget.requestId}`,
        };
      case 'reports':
        return { section: 'Reports' };
      case 'report_details':
        return {
          section: 'Reports',
          target: { view: 'reports' as const },
          detail: `#${navigationTarget.reportId}`,
        };
      case 'admin_account':
        return { section: 'Account Details' };
      case 'admin_management':
        return { section: 'Administrator Management' };
      case 'admin_details': {
        const a = dataService.getAdminAccountById(navigationTarget.targetAdminId);
        return {
          section: 'Administrator Management',
          target: { view: 'admin_management' as const },
          detail: a ? a.name : navigationTarget.targetAdminId,
        };
      }
      case 'audit_logs':
        return { section: 'System Audit Logs' };
      case 'archives':
        return { section: 'System Archives' };
      default:
        return { section: 'Admin Portal' };
    }
  }, [navigationTarget]);

  // If no admin session exists: Show ONLY the Admin Login page
  if (!admin) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#292525] flex flex-row">
      {/* Sidebar navigation */}
      <Sidebar
        admin={admin}
        currentTarget={navigationTarget}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        openReportsCount={openReportsCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          admin={admin}
          currentTarget={navigationTarget}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          breadcrumbData={breadcrumbData}
        />

        {/* View Routing with Role Protection */}
        <main className="flex-1 pb-16">
          {navigationTarget.view === 'overview' && (
            <OverviewView onNavigate={handleNavigate} key={dataVersion} />
          )}

          {navigationTarget.view === 'users' && (
            <UsersView onNavigate={handleNavigate} key={dataVersion} />
          )}

          {navigationTarget.view === 'user_details' && (
            <UserDetailsView
              userId={navigationTarget.userId}
              onNavigate={handleNavigate}
              key={`${navigationTarget.userId}-${dataVersion}`}
            />
          )}

          {navigationTarget.view === 'requests' && (
            <BloodRequestsView onNavigate={handleNavigate} key={dataVersion} />
          )}

          {navigationTarget.view === 'request_details' && (
            <BloodRequestDetailsView
              requestId={navigationTarget.requestId}
              onNavigate={handleNavigate}
              key={`${navigationTarget.requestId}-${dataVersion}`}
            />
          )}

          {navigationTarget.view === 'reports' && (
            <ReportsView onNavigate={handleNavigate} key={dataVersion} />
          )}

          {navigationTarget.view === 'report_details' && (
            <ReportDetailsView
              reportId={navigationTarget.reportId}
              onNavigate={handleNavigate}
              key={`${navigationTarget.reportId}-${dataVersion}`}
            />
          )}

          {navigationTarget.view === 'admin_account' && (
            <AdminAccountView
              admin={admin}
              onNavigate={handleNavigate}
              onDataReset={handleDataReset}
              key={dataVersion}
            />
          )}

          {/* Super Admin Exclusive Views */}
          {navigationTarget.view === 'admin_management' && admin.role === 'super_admin' && (
            <AdminManagementView onNavigate={handleNavigate} key={dataVersion} />
          )}

          {navigationTarget.view === 'admin_details' && admin.role === 'super_admin' && (
            <AdminDetailsView
              adminId={navigationTarget.targetAdminId}
              onNavigate={handleNavigate}
              key={`${navigationTarget.targetAdminId}-${dataVersion}`}
            />
          )}

          {navigationTarget.view === 'audit_logs' && admin.role === 'super_admin' && (
            <AuditLogsView onNavigate={handleNavigate} key={dataVersion} />
          )}

          {navigationTarget.view === 'archives' && admin.role === 'super_admin' && (
            <ArchivesView onNavigate={handleNavigate} key={dataVersion} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AdminPortalApp />
    </ToastProvider>
  );
}
