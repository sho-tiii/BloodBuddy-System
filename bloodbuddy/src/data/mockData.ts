/**
 * PRODUCTION UI RULE:
 * Internal mock data and development helpers may exist in code during
 * prototype development, but they must never automatically create
 * visible testing controls in the normal BloodBuddy interface.
 * Future feature additions must NOT reintroduce demo/test shortcuts into
 * production-facing pages.
 */

import { Donor, BloodRequest, IncomingDonationRequest, ChatMessage, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  firstName: 'Maria',
  lastName: 'Santos',
  email: 'maria@email.com',
  emailVerified: true,
  identityVerified: false,
  identityVerificationStatus: 'not_verified',
  bloodType: 'A+',
  availableToDonate: true,
  plan: 'I need to find blood',
};

export const MOCK_DONORS: Donor[] = [
  {
    id: 'donor-1',
    bloodType: 'A+',
    available: true,
    generalLocation: 'Caloocan City — Monumento',
    proximity: 'Approx. 3.8 km away',
    city: 'Caloocan City',
  },
  {
    id: 'donor-2',
    bloodType: 'A+',
    available: true,
    generalLocation: 'Caloocan City — Grace Park East',
    proximity: 'Approx. 4.5 km away',
    city: 'Caloocan City',
  },
  {
    id: 'donor-3',
    bloodType: 'A+',
    available: true,
    generalLocation: 'Quezon City — Novaliches',
    proximity: 'Approx. 6.2 km away',
    city: 'Quezon City',
  },
  {
    id: 'donor-4',
    bloodType: 'A+',
    available: true,
    generalLocation: 'Manila — Sampaloc',
    proximity: 'Approx. 8.1 km away',
    city: 'Manila',
  },
  {
    id: 'donor-5',
    bloodType: 'O+',
    available: true,
    generalLocation: 'Caloocan City — Bagong Barrio',
    proximity: 'Approx. 4.1 km away',
    city: 'Caloocan City',
  },
  {
    id: 'donor-6',
    bloodType: 'O+',
    available: true,
    generalLocation: 'Quezon City — Diliman',
    proximity: 'Approx. 7.9 km away',
    city: 'Quezon City',
  },
  {
    id: 'donor-7',
    bloodType: 'B+',
    available: true,
    generalLocation: 'Caloocan City — Camarin',
    proximity: 'Approx. 5.7 km away',
    city: 'Caloocan City',
  },
  {
    id: 'donor-8',
    bloodType: 'B−',
    available: true,
    generalLocation: 'Valenzuela City — Karuhatan',
    proximity: 'Approx. 5.1 km away',
    city: 'Valenzuela City',
  },
  {
    id: 'donor-9',
    bloodType: 'AB+',
    available: true,
    generalLocation: 'Malabon City — Potrero',
    proximity: 'Approx. 3.2 km away',
    city: 'Malabon City',
  },
  {
    id: 'donor-10',
    bloodType: 'O−',
    available: true,
    generalLocation: 'Quezon City — Cubao',
    proximity: 'Approx. 9.4 km away',
    city: 'Quezon City',
  },
  {
    id: 'donor-11',
    bloodType: 'A−',
    available: true,
    generalLocation: 'Caloocan City — South Caloocan',
    proximity: 'Approx. 3.9 km away',
    city: 'Caloocan City',
  },
];

export const INITIAL_BLOOD_REQUESTS: BloodRequest[] = [
  {
    id: '#BR-8821',
    bloodFor: 'Myself',
    bloodType: 'A+',
    location: 'Caloocan City',
    healthcareFacility: 'Caloocan City Medical Center',
    dateNeeded: 'Tomorrow, Oct 24, 2024',
    additionalNote: 'Pre-surgery replacement units needed for scheduled operation at 9:00 AM.',
    donorId: 'donor-1',
    donorSnapshot: {
      bloodType: 'A+',
      generalLocation: 'Caloocan City — Monumento',
      proximity: 'Approx. 3.8 km away',
    },
    status: 'Awaiting donor response',
    createdAt: 'Today, 8:45 AM',
  },
  {
    id: '#BR-7419',
    bloodFor: 'Someone else',
    recipientName: 'Family member',
    bloodType: 'O+',
    location: 'Quezon City',
    healthcareFacility: 'Philippine Heart Center',
    dateNeeded: 'Oct 12, 2024',
    additionalNote: 'Urgent cardiovascular procedure.',
    donorId: 'donor-6',
    donorSnapshot: {
      bloodType: 'O+',
      generalLocation: 'Quezon City — Diliman',
      proximity: 'Approx. 7.9 km away',
    },
    status: 'Completed',
    createdAt: 'Oct 11, 2024',
  },
  {
    id: '#BR-6290',
    bloodFor: 'Myself',
    bloodType: 'B+',
    location: 'Manila',
    healthcareFacility: 'Manila Doctors Hospital',
    dateNeeded: 'Sep 28, 2024',
    additionalNote: 'Emergency ward request.',
    donorId: 'donor-7',
    donorSnapshot: {
      bloodType: 'B+',
      generalLocation: 'Caloocan City — Camarin',
      proximity: 'Approx. 5.7 km away',
    },
    status: 'Cancelled',
    createdAt: 'Sep 27, 2024',
  },
];

export const INITIAL_INCOMING_DONATIONS: IncomingDonationRequest[] = [
  {
    id: 'inc-1',
    requestId: '#BR-8821',
    bloodType: 'A+',
    bloodFor: 'Myself',
    location: 'Caloocan City',
    proximity: 'Approx. 3.8 km away',
    healthcareFacility: 'Caloocan City Medical Center',
    dateNeeded: 'Tomorrow, Oct 24, 2024',
    additionalNote: 'Scheduled orthopedic surgery replacement units needed.',
    receivedTime: 'Just now',
    status: 'Needs your response',
  },
  {
    id: 'inc-2',
    requestId: '#BR-8104',
    bloodType: 'A+',
    bloodFor: 'Someone else',
    location: 'Quezon City',
    proximity: 'Approx. 6.2 km away',
    healthcareFacility: 'Novaliches District Hospital',
    dateNeeded: 'Oct 20, 2024',
    additionalNote: 'Dialysis patient support unit.',
    receivedTime: '3 days ago',
    status: 'Accepted',
  },
  {
    id: 'inc-3',
    requestId: '#BR-7940',
    bloodType: 'A+',
    bloodFor: 'Myself',
    location: 'Quezon City',
    proximity: 'Approx. 8.5 km away',
    healthcareFacility: 'Quezon City General Hospital',
    dateNeeded: 'Oct 14, 2024',
    additionalNote: 'Inpatient transfusion.',
    receivedTime: '1 week ago',
    status: 'Declined',
    declineReason: 'Not available',
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  '#BR-8821': [
    {
      id: 'm1',
      requestId: '#BR-8821',
      sender: 'requester',
      senderLabel: 'Requester',
      text: 'Hi! Thank you for accepting my request. The blood is needed tomorrow at Caloocan City Medical Center.',
      timestamp: 'Today, 9:15 AM',
    },
    {
      id: 'm2',
      requestId: '#BR-8821',
      sender: 'donor',
      senderLabel: 'Donor',
      text: "Hi, I'm available tomorrow morning. What time should I be there?",
      timestamp: 'Today, 9:18 AM',
    },
  ],
  '#BR-8104': [
    {
      id: 'm-8104-1',
      requestId: '#BR-8104',
      sender: 'requester',
      senderLabel: 'Requester',
      text: 'Hello, thank you so much for agreeing to coordinate for Novaliches District Hospital.',
      timestamp: 'Oct 20, 10:00 AM',
    },
    {
      id: 'm-8104-2',
      requestId: '#BR-8104',
      sender: 'donor',
      senderLabel: 'Donor',
      text: 'Glad to help! I will head to the blood station at 11:30 AM.',
      timestamp: 'Oct 20, 10:15 AM',
    },
  ],
};
