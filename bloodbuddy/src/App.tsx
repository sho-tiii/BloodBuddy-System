import React, { useState, useEffect } from 'react';
import {
  BloodType,
  Donor,
  BloodRequest,
  IncomingDonationRequest,
  ChatMessage,
  UserProfile,
  ActiveView,
  RequesterStatus,
  Report,
} from './types';
import {
  INITIAL_USER,
  MOCK_DONORS,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_INCOMING_DONATIONS,
  INITIAL_MESSAGES,
} from './data/mockData';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Views
import { HomeView } from './views/HomeView';
import { DonateBloodPublicView } from './views/DonateBloodPublicView';
import { AboutUsView } from './views/AboutUsView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { VerifyEmailView } from './views/VerifyEmailView';
import { ConfirmRequestView } from './views/ConfirmRequestView';
import { ReviewRequestView } from './views/ReviewRequestView';
import { RequestDetailsView } from './views/RequestDetailsView';
import { MyRequestsView } from './views/MyRequestsView';
import { DonationRequestsView } from './views/DonationRequestsView';
import { ReviewDonationRequestView } from './views/ReviewDonationRequestView';
import { ConversationView } from './views/ConversationView';
import { AccountSettingsView } from './views/AccountSettingsView';

// Protected views list
const PROTECTED_VIEWS: ActiveView[] = [
  'confirm-request',
  'review-request',
  'request-details',
  'my-requests',
  'donation-requests',
  'review-donation-request',
  'conversation',
  'account-settings',
];

export default function App() {
  // 1. Authentication State with localStorage Persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('bloodbuddy_is_auth');
      return stored !== null ? stored === 'true' : false; // Default to unauthenticated public state
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('bloodbuddy_user_profile');
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Active navigation view
  const [currentView, setCurrentView] = useState<ActiveView>('home');

  // Redirection & Preserved Context State
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<ActiveView | null>(null);
  const [redirectReason, setRedirectReason] = useState<string | null>(null);
  const [preservedFlow, setPreservedFlow] = useState<{
    donor: Donor;
    criteria: { bloodType: BloodType; location: string };
  } | null>(null);

  // 2. Application Data with localStorage Persistence
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const stored = localStorage.getItem('bloodbuddy_donors');
      return stored ? JSON.parse(stored) : MOCK_DONORS;
    } catch {
      return MOCK_DONORS;
    }
  });

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    try {
      const stored = localStorage.getItem('bloodbuddy_blood_requests');
      return stored ? JSON.parse(stored) : INITIAL_BLOOD_REQUESTS;
    } catch {
      return INITIAL_BLOOD_REQUESTS;
    }
  });

  const [incomingDonations, setIncomingDonations] = useState<IncomingDonationRequest[]>(() => {
    try {
      const stored = localStorage.getItem('bloodbuddy_incoming_donations');
      return stored ? JSON.parse(stored) : INITIAL_INCOMING_DONATIONS;
    } catch {
      return INITIAL_INCOMING_DONATIONS;
    }
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const stored = localStorage.getItem('bloodbuddy_messages');
      return stored ? JSON.parse(stored) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const stored = localStorage.getItem('bloodbuddy_reports');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Active request and donor state for flows
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(() => donors[0] || null);
  const [searchCriteria, setSearchCriteria] = useState<{ bloodType: BloodType; location: string }>({
    bloodType: 'A+',
    location: 'Caloocan City',
  });
  const [activeRequestDraft, setActiveRequestDraft] = useState<Partial<BloodRequest> | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string>('#BR-8821');
  const [conversationRole, setConversationRole] = useState<'requester' | 'donor'>('requester');

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bloodbuddy_is_auth', String(isAuthenticated));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('bloodbuddy_user_profile', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('bloodbuddy_blood_requests', JSON.stringify(bloodRequests));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [bloodRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('bloodbuddy_incoming_donations', JSON.stringify(incomingDonations));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [incomingDonations]);

  useEffect(() => {
    try {
      localStorage.setItem('bloodbuddy_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('bloodbuddy_donors', JSON.stringify(donors));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [donors]);

  useEffect(() => {
    try {
      localStorage.setItem('bloodbuddy_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [reports]);

  // Synchronize donor availability with donors list
  useEffect(() => {
    setDonors((prev) => {
      // Check if current user is represented as donor-1 or matching
      return prev.map((d) => {
        if (d.id === 'donor-1') {
          return {
            ...d,
            bloodType: currentUser.bloodType === 'Not provided' ? d.bloodType : currentUser.bloodType,
            available: currentUser.availableToDonate,
          };
        }
        return d;
      });
    });
  }, [currentUser.availableToDonate, currentUser.bloodType]);

  // Badge count for pending donations
  const pendingDonationsCount = incomingDonations.filter(
    (req) => req.status === 'Needs your response'
  ).length;

  // ROUTE NAVIGATION WITH GUARD
  const handleNavigate = (view: ActiveView) => {
    // If attempting to access a protected view without authentication
    if (!isAuthenticated && PROTECTED_VIEWS.includes(view)) {
      setRedirectAfterLogin(view);
      let reason = 'Please sign in or create an account to access this page.';
      if (view === 'donation-requests' || view === 'review-donation-request') {
        reason = 'Please sign in to view your donation requests and donor dashboard.';
      } else if (view === 'my-requests' || view === 'request-details') {
        reason = 'Please sign in to view and manage your submitted blood requests.';
      } else if (view === 'account-settings') {
        reason = 'Please sign in to access account settings.';
      }
      setRedirectReason(reason);
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when user clicks "Connect with Donor" on Home
  const handleConnectDonor = (
    donor: Donor,
    criteria: { bloodType: BloodType; location: string }
  ) => {
    setSelectedDonor(donor);
    setSearchCriteria(criteria);

    if (!isAuthenticated) {
      // Preserve selected donor + criteria and route to login
      setPreservedFlow({ donor, criteria });
      setRedirectAfterLogin('confirm-request');
      setRedirectReason(
        `Please sign in or create an account to request blood from this volunteer (Blood Type ${donor.bloodType} in ${donor.city}).`
      );
      setCurrentView('login');
    } else {
      // Proceed directly to Confirm Blood Request
      setCurrentView('confirm-request');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth success (Login or Verified Register)
  const handleAuthSuccess = (user: UserProfile) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setRedirectReason(null);

    // If there was a preserved flow from clicking "Connect with Donor"
    if (preservedFlow) {
      setSelectedDonor(preservedFlow.donor);
      setSearchCriteria(preservedFlow.criteria);
      setPreservedFlow(null);
      setRedirectAfterLogin(null);
      setCurrentView('confirm-request');
    } else if (redirectAfterLogin) {
      const destination = redirectAfterLogin;
      setRedirectAfterLogin(null);
      setCurrentView(destination);
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Register form submission
  const handleRegisterSubmit = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    setCurrentView('verify-email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Email verification success
  const handleVerifyEmailSuccess = () => {
    const verifiedUser: UserProfile = {
      ...currentUser,
      emailVerified: true,
    };
    setCurrentUser(verifiedUser);
    handleAuthSuccess(verifiedUser);
  };

  // User Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPreservedFlow(null);
    setRedirectAfterLogin(null);
    setRedirectReason(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Requester Flow: Confirm -> Review
  const handleProceedToReview = (draft: Partial<BloodRequest>, donor: Donor) => {
    setActiveRequestDraft(draft);
    setSelectedDonor(donor);
    setCurrentView('review-request');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Requester Flow: Review -> Send Success
  const handleSendRequestSuccess = (created: BloodRequest) => {
    setBloodRequests((prev) => [created, ...prev]);

    // Also simulate creating an incoming donation request for that donor
    const newIncoming: IncomingDonationRequest = {
      id: 'inc-' + Date.now(),
      requestId: created.id,
      bloodType: created.bloodType,
      bloodFor: created.bloodFor,
      location: created.location,
      proximity: created.donorSnapshot.proximity,
      healthcareFacility: created.healthcareFacility,
      dateNeeded: created.dateNeeded,
      additionalNote: created.additionalNote,
      receivedTime: 'Just now',
      status: 'Needs your response',
    };
    setIncomingDonations((prev) => [newIncoming, ...prev]);
  };

  // View request details
  const handleViewRequestDetails = (requestId: string) => {
    setActiveRequestId(requestId);
    setCurrentView('request-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Status changes on requester side
  const handleRequesterStatusChange = (requestId: string, newStatus: RequesterStatus) => {
    const fulfilledTime = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: newStatus,
            requestFulfilled: newStatus === 'Request Fulfilled',
            requestFulfilledAt:
              newStatus === 'Request Fulfilled' ? fulfilledTime : req.requestFulfilledAt,
          };
        }
        return req;
      })
    );

    // Sync with incoming donation request if present
    setIncomingDonations((prev) =>
      prev.map((inc) => {
        if (inc.requestId === requestId) {
          if (newStatus === 'Donor accepted') return { ...inc, status: 'Accepted' };
          if (newStatus === 'Donor declined') return { ...inc, status: 'Declined' };
          if (newStatus === 'Request Fulfilled') {
            return {
              ...inc,
              requestFulfilled: true,
              requestFulfilledAt: fulfilledTime,
              donorDonationStatus: inc.donorDonationStatus || 'awaiting_confirmation',
            };
          }
          if (newStatus === 'Cancelled') {
            return {
              ...inc,
              status: 'Cancelled',
            };
          }
        }
        return inc;
      })
    );
  };

  // Donor confirms they completed donation
  const handleConfirmDonation = (requestId: string) => {
    const confirmedTime = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    setIncomingDonations((prev) =>
      prev.map((inc) =>
        inc.requestId === requestId
          ? {
              ...inc,
              status: 'Donation Completed',
              donorDonationStatus: 'completed',
              donationConfirmedAt: confirmedTime,
            }
          : inc
      )
    );

    setBloodRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              donorDonationStatus: 'completed',
              donationConfirmedAt: confirmedTime,
            }
          : req
      )
    );
  };

  // Donor confirms they did NOT donate
  const handleConfirmDidNotDonate = (requestId: string) => {
    setIncomingDonations((prev) =>
      prev.map((inc) =>
        inc.requestId === requestId
          ? {
              ...inc,
              status: 'Request Fulfilled — No donation recorded',
              donorDonationStatus: 'did_not_donate',
            }
          : inc
      )
    );

    setBloodRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              donorDonationStatus: 'did_not_donate',
            }
          : req
      )
    );
  };

  // Find another donor when declined
  const handleFindAnotherDonor = (bloodType: string, location: string) => {
    setSearchCriteria({
      bloodType: bloodType as BloodType,
      location,
    });
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Chat Conversation (Protected: only when status is accepted or fulfilled/closed)
  const handleOpenConversation = (requestId: string, role?: 'requester' | 'donor') => {
    const bloodReq = bloodRequests.find((r) => r.id === requestId);
    const incReq = incomingDonations.find((r) => r.requestId === requestId);

    const isAccessible =
      bloodReq?.status === 'Donor accepted' ||
      bloodReq?.status === 'Request Fulfilled' ||
      bloodReq?.status === 'Completed' ||
      incReq?.status === 'Accepted' ||
      incReq?.status === 'Donation Completed' ||
      incReq?.status === 'Request Fulfilled — No donation recorded' ||
      incReq?.requestFulfilled;

    if (!isAccessible) {
      return;
    }

    if (role) {
      setConversationRole(role);
    }
    setActiveRequestId(requestId);
    setCurrentView('conversation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Donor Flow: Accept Request
  const handleAcceptDonationRequest = (requestId: string) => {
    setIncomingDonations((prev) =>
      prev.map((req) => (req.requestId === requestId ? { ...req, status: 'Accepted' } : req))
    );
    // Also update requester's request status
    setBloodRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Donor accepted' } : req))
    );

    // If conversation messages don't exist yet, seed initial accepted exchange
    if (!messages[requestId]) {
      setMessages((prev) => ({
        ...prev,
        [requestId]: [
          {
            id: 'm-' + Date.now() + '-1',
            requestId,
            sender: 'requester',
            senderLabel: 'Requester',
            text: 'Hi! Thank you for accepting my request. The blood is needed at the hospital blood bank tomorrow.',
            timestamp: 'Just now',
          },
          {
            id: 'm-' + Date.now() + '-2',
            requestId,
            sender: 'donor',
            senderLabel: 'Volunteer Donor',
            text: "Hi, I am ready to help. What time should I arrive at the facility?",
            timestamp: 'Just now',
          },
        ],
      }));
    }
  };

  // Donor Flow: Decline Request
  const handleDeclineDonationRequest = (requestId: string, reason: string) => {
    setIncomingDonations((prev) =>
      prev.map((req) =>
        req.requestId === requestId
          ? { ...req, status: 'Declined', declineReason: reason }
          : req
      )
    );
    // Update requester's request status to Donor declined
    setBloodRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: 'Donor declined', declineReason: reason }
          : req
      )
    );
  };

  // Messaging: Send message
  const handleSendMessage = (
    requestId: string,
    text: string,
    sender: 'requester' | 'donor'
  ) => {
    const newMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      requestId,
      sender,
      senderLabel: sender === 'requester' ? 'Requester' : 'Volunteer Donor',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [requestId]: [...(prev[requestId] || []), newMessage],
    }));
  };

  // Donor settings: update blood type
  const handleUpdateBloodType = (newType: BloodType) => {
    setCurrentUser((prev) => ({ ...prev, bloodType: newType }));
  };

  // Donor settings: toggle availability
  const handleToggleAvailability = (isAvailable: boolean) => {
    setCurrentUser((prev) => ({ ...prev, availableToDonate: isAvailable }));
  };

  // Reporting: Create report in shared state
  const handleCreateReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: `RP-${1000 + reports.length + 1}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      status: 'open',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  // Find active request object for detail views
  const activeBloodRequest =
    bloodRequests.find((r) => r.id === activeRequestId) || bloodRequests[0];

  const activeIncomingRequest =
    incomingDonations.find((r) => r.requestId === activeRequestId) ||
    incomingDonations[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#292525] antialiased selection:bg-[#F7EAE7] selection:text-[#A92F35]">
      {/* GLOBAL HEADER */}
      <Header
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        currentView={currentView}
        pendingDonationCount={pendingDonationsCount}
        onNavigate={handleNavigate}
        onOpenLogin={() => {
          setPreservedFlow(null);
          setRedirectReason(null);
          handleNavigate('login');
        }}
        onOpenRegister={() => {
          setPreservedFlow(null);
          setRedirectReason(null);
          handleNavigate('register');
        }}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT VIEW CONTAINER */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. PUBLIC: HOME / FIND BLOOD */}
        {currentView === 'home' && (
          <HomeView
            donors={donors}
            onConnectDonor={handleConnectDonor}
            onNavigateToDonate={() => handleNavigate('donate-blood')}
          />
        )}

        {/* 2. PUBLIC: DONATE BLOOD PUBLIC INFO PAGE */}
        {currentView === 'donate-blood' && (
          <DonateBloodPublicView
            isAuthenticated={isAuthenticated}
            onNavigate={handleNavigate}
          />
        )}

        {/* 3. PUBLIC: ABOUT US */}
        {currentView === 'about-us' && (
          <AboutUsView onNavigate={handleNavigate} />
        )}

        {/* 4. PUBLIC: STANDALONE LOGIN PAGE */}
        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleAuthSuccess}
            onNavigate={handleNavigate}
            redirectReason={redirectReason}
            preservedFlow={preservedFlow}
          />
        )}

        {/* 5. PUBLIC: STANDALONE REGISTER PAGE */}
        {currentView === 'register' && (
          <RegisterView
            onRegisterSubmit={handleRegisterSubmit}
            onNavigate={handleNavigate}
          />
        )}

        {/* 6. PUBLIC: STANDALONE VERIFY EMAIL PAGE */}
        {currentView === 'verify-email' && (
          <VerifyEmailView
            user={currentUser}
            onVerifySuccess={handleVerifyEmailSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {/* 7. PROTECTED: CONFIRM BLOOD REQUEST */}
        {currentView === 'confirm-request' && selectedDonor && (
          <ConfirmRequestView
            initialDonor={selectedDonor}
            allDonors={donors}
            prefilledBloodType={searchCriteria.bloodType}
            prefilledLocation={searchCriteria.location}
            onCancel={() => handleNavigate('home')}
            onProceedToReview={handleProceedToReview}
          />
        )}

        {/* 8. PROTECTED: REVIEW BLOOD REQUEST */}
        {currentView === 'review-request' && activeRequestDraft && selectedDonor && (
          <ReviewRequestView
            requestData={activeRequestDraft}
            selectedDonor={selectedDonor}
            onBack={() => handleNavigate('confirm-request')}
            onSendSuccess={handleSendRequestSuccess}
            onViewRequestDetails={handleViewRequestDetails}
          />
        )}

        {/* 9. PROTECTED: MY BLOOD REQUESTS LIST */}
        {currentView === 'my-requests' && (
          <MyRequestsView
            requests={bloodRequests}
            onSelectRequest={handleViewRequestDetails}
            onNavigate={handleNavigate}
            pendingDonationsCount={pendingDonationsCount}
          />
        )}

        {/* 10. PROTECTED: BLOOD REQUEST DETAILS */}
        {currentView === 'request-details' && activeBloodRequest && (
          <RequestDetailsView
            request={activeBloodRequest}
            currentUser={currentUser}
            onBack={() => handleNavigate('my-requests')}
            onOpenConversation={(reqId) => handleOpenConversation(reqId, 'requester')}
            onFindAnotherDonor={handleFindAnotherDonor}
            onStatusChange={handleRequesterStatusChange}
            onMarkRequestFulfilled={(reqId) => handleRequesterStatusChange(reqId, 'Request Fulfilled')}
            onCreateReport={handleCreateReport}
          />
        )}

        {/* 11. PROTECTED: DONATION REQUESTS (DONOR VIEW) */}
        {currentView === 'donation-requests' && (
          <DonationRequestsView
            currentUser={currentUser}
            incomingRequests={incomingDonations}
            onReviewRequest={(reqId) => {
              setActiveRequestId(reqId);
              handleNavigate('review-donation-request');
            }}
            onNavigate={handleNavigate}
            onUpdateBloodType={handleUpdateBloodType}
            onToggleAvailability={handleToggleAvailability}
          />
        )}

        {/* 12. PROTECTED: REVIEW DONATION REQUEST (DONOR VIEW) */}
        {currentView === 'review-donation-request' && activeIncomingRequest && (
          <ReviewDonationRequestView
            request={activeIncomingRequest}
            currentUser={currentUser}
            onBack={() => handleNavigate('donation-requests')}
            onAcceptRequest={handleAcceptDonationRequest}
            onDeclineRequest={handleDeclineDonationRequest}
            onOpenConversation={(reqId) => handleOpenConversation(reqId, 'donor')}
            onConfirmDonation={handleConfirmDonation}
            onConfirmDidNotDonate={handleConfirmDidNotDonate}
            onCreateReport={handleCreateReport}
          />
        )}

        {/* 13. PROTECTED: REQUEST-SPECIFIC CONVERSATION (Accepted requests only) */}
        {currentView === 'conversation' && (
          <ConversationView
            requestId={activeRequestId}
            messages={messages[activeRequestId] || []}
            requestDetails={
              conversationRole === 'donor'
                ? activeIncomingRequest || activeBloodRequest
                : activeBloodRequest || activeIncomingRequest
            }
            userRole={conversationRole}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={() => {
              if (conversationRole === 'donor') {
                handleNavigate('review-donation-request');
              } else {
                handleNavigate('request-details');
              }
            }}
            onCreateReport={handleCreateReport}
          />
        )}

        {/* 14. PROTECTED: ACCOUNT SETTINGS */}
        {currentView === 'account-settings' && (
          <AccountSettingsView
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
            onNavigate={handleNavigate}
            pendingDonationsCount={pendingDonationsCount}
          />
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
