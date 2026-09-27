import React, { useState } from 'react';
import { Search, MapPin, Droplet, ArrowRight, HeartHandshake, CheckCircle2, ShieldCheck, Users, Sparkles } from 'lucide-react';
import { BloodType, Donor } from '../types';
import { DonorCard } from '../components/cards/DonorCard';
import { Notice } from '../components/common/Notice';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface HomeViewProps {
  donors: Donor[];
  onConnectDonor: (donor: Donor, searchState: { bloodType: BloodType; location: string }) => void;
  onNavigateToDonate: () => void;
}

const BLOOD_TYPES: BloodType[] = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export const HomeView: React.FC<HomeViewProps> = ({
  donors,
  onConnectDonor,
  onNavigateToDonate,
}) => {
  // Search criteria state
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | ''>('');
  const [locationInput, setLocationInput] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [matchingDonors, setMatchingDonors] = useState<Donor[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    const filtered = donors.filter((donor) => {
      const matchesBlood =
        !selectedBloodType || donor.bloodType === selectedBloodType;
      const matchesLocation =
        !locationInput ||
        donor.generalLocation.toLowerCase().includes(locationInput.toLowerCase()) ||
        donor.city.toLowerCase().includes(locationInput.toLowerCase());
      return matchesBlood && matchesLocation && donor.available;
    });

    setMatchingDonors(filtered);

    // Smoothly scroll to results
    setTimeout(() => {
      const resultsEl = document.getElementById('search-results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleQuickPreset = (type: BloodType, loc: string) => {
    setSelectedBloodType(type);
    setLocationInput(loc);
    setHasSearched(true);
    const filtered = donors.filter((donor) => {
      return (
        donor.bloodType === type &&
        (donor.generalLocation.toLowerCase().includes(loc.toLowerCase()) ||
          donor.city.toLowerCase().includes(loc.toLowerCase())) &&
        donor.available
      );
    });
    setMatchingDonors(filtered);

    setTimeout(() => {
      const resultsEl = document.getElementById('search-results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION: CENTERED COMPOSITION WITH HORIZONTAL SEARCH */}
      <section className="pt-6 sm:pt-10 md:pt-14 pb-4 text-center max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EAE7] text-[#A92F35] text-xs font-semibold tracking-wider uppercase mb-5">
          <Droplet className="w-3.5 h-3.5 fill-current" />
          <span>Community Blood Matching</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#292525] tracking-tight leading-[1.12] max-w-3xl mx-auto">
          Find blood when every second counts.
        </h1>

        <p className="text-[#746C68] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mt-4">
          BloodBuddy connects families in urgent need directly with nearby volunteer donors, making it simple and fast to coordinate support when hospitals experience blood shortages.
        </p>

        {/* Centered Horizontal Search Card */}
        <div className="mt-8 sm:mt-10 max-w-[980px] mx-auto w-full text-left">
          <div className="bg-white rounded-2xl border border-[#E6DDD7] shadow-[0_10px_35px_rgba(41,37,37,0.06)] p-4 sm:p-5">
            <form id="donor-search-form" onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-end gap-3.5">
              {/* Blood Type Selection */}
              <div className="w-full md:w-5/12 space-y-1.5">
                <label htmlFor="search-blood-type" className="text-xs font-semibold text-[#292525] flex items-center gap-1">
                  <span>Blood Type Needed</span>
                  <span className="text-[#A92F35]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="search-blood-type"
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value as BloodType)}
                    className="w-full h-12 bg-[#FAF7F2] hover:bg-white text-sm font-semibold text-[#292525] px-3.5 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none cursor-pointer transition-colors"
                  >
                    <option value="">Select blood type (e.g. A+, O−, B+)</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        Blood Type {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Input */}
              <div className="w-full md:w-5/12 space-y-1.5">
                <label htmlFor="search-location" className="text-xs font-semibold text-[#292525] flex items-center justify-between">
                  <span>City or Area</span>
                  <span className="text-[#746C68] font-normal text-[11px]">(Metro Manila)</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-[#A92F35] absolute left-3.5 pointer-events-none" />
                  <input
                    id="search-location"
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. Caloocan City or Quezon City"
                    className="w-full h-12 bg-[#FAF7F2] focus:bg-white text-sm text-[#292525] placeholder:text-[#958B86] pl-10 pr-14 rounded-xl border border-[#E6DDD7] focus:border-[#A92F35] focus:outline-none transition-colors"
                  />
                  {locationInput && (
                    <button
                      type="button"
                      onClick={() => setLocationInput('')}
                      className="absolute right-3 text-xs text-[#958B86] hover:text-[#292525] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Primary Search Button */}
              <div className="w-full md:w-auto md:shrink-0 pt-1 md:pt-0">
                <Button
                  id="search-donors-submit-btn"
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto h-12 px-7 text-sm font-semibold whitespace-nowrap shadow-xs"
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Search Donors
                </Button>
              </div>
            </form>

            {/* Quick Helper Presets */}
            <div className="mt-3.5 pt-3 border-t border-[#F0EAE5] flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-[#958B86] mr-1">
                Quick searches:
              </span>
              <button
                type="button"
                onClick={() => handleQuickPreset('A+', 'Caloocan')}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#FAF7F2] hover:bg-[#F7EAE7] border border-[#E6DDD7] hover:border-[#A92F35] text-[#292525] transition-colors"
              >
                A+ in Caloocan
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('O+', 'Quezon City')}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#FAF7F2] hover:bg-[#F7EAE7] border border-[#E6DDD7] hover:border-[#A92F35] text-[#292525] transition-colors"
              >
                O+ in Quezon City
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('B+', 'Caloocan')}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#FAF7F2] hover:bg-[#F7EAE7] border border-[#E6DDD7] hover:border-[#A92F35] text-[#292525] transition-colors"
              >
                B+ in Caloocan
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('O−', 'Manila')}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#FAF7F2] hover:bg-[#F7EAE7] border border-[#E6DDD7] hover:border-[#A92F35] text-[#292525] transition-colors"
              >
                O− in Manila
              </button>
            </div>
          </div>

          {/* Structured Trust Highlights */}
          <div className="mt-6 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto text-left">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#557A61] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#292525] block">Real-Time Status</span>
                <span className="text-[11px] text-[#746C68] leading-tight block">Active availability updated by donors</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#557A61] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#292525] block">100% Voluntary</span>
                <span className="text-[11px] text-[#746C68] leading-tight block">No fees or commercial intermediaries</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#A92F35] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#292525] block">Hospital Screening</span>
                <span className="text-[11px] text-[#746C68] leading-tight block">Final health tests verified at the facility</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS SECTION */}
      {hasSearched && (
        <section id="search-results-section" className="scroll-mt-24 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6DDD7] mb-6">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#292525]">
                Available Volunteer Donors
              </h2>
              <p className="text-xs sm:text-sm text-[#746C68] mt-0.5">
                Showing potential donors matching{' '}
                <span className="font-semibold text-[#292525]">
                  {selectedBloodType || 'All blood types'}
                </span>
                {locationInput ? ` in "${locationInput}"` : ''}
              </p>
            </div>

            <div className="text-xs font-semibold text-[#746C68] bg-white px-3.5 py-1.5 rounded-full border border-[#E6DDD7] self-start sm:self-auto">
              Found {matchingDonors.length} matching{' '}
              {matchingDonors.length === 1 ? 'volunteer' : 'volunteers'}
            </div>
          </div>

          {matchingDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingDonors.map((donor) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  actionLabel="Connect with Donor →"
                  onConnect={() =>
                    onConnectDonor(donor, {
                      bloodType: (selectedBloodType || donor.bloodType) as BloodType,
                      location: locationInput || donor.city,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center max-w-xl mx-auto py-12">
              <Droplet className="w-10 h-10 text-[#A92F35]/40 mx-auto mb-3" />
              <h3 className="font-heading text-xl font-bold text-[#292525]">
                No available donors currently found for this search
              </h3>
              <p className="text-xs sm:text-sm text-[#746C68] mt-2 mb-5 leading-relaxed">
                Try expanding your search to neighboring cities or clearing the
                blood type to see all active voluntary donors in Metro Manila.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedBloodType('');
                  setLocationInput('');
                  setMatchingDonors(donors.filter((d) => d.available));
                }}
              >
                View All Available Donors
              </Button>
            </Card>
          )}

          {/* Privacy & Clinical Notice right beneath donor cards */}
          <div className="mt-8">
            <Notice type="privacy" title="Safe Community Matching Standards">
              To protect community members, donor cards display only self-reported
              blood type and approximate distance. Contact details and coordination
              tools are unlocked only after mutual confirmation.
            </Notice>
          </div>
        </section>
      )}

      {/* HOW BLOODBUDDY WORKS */}
      <section className="pt-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A92F35] block mb-1">
            Community Workflow
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#292525]">
            How BloodBuddy Works
          </h2>
          <p className="text-xs sm:text-sm text-[#746C68] mt-1.5">
            A simple three-step coordination flow designed for urgent times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="lg" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-bold text-base border border-[#F0D5D1]">
              1
            </div>
            <h3 className="font-heading text-xl font-bold text-[#292525]">
              Search
            </h3>
            <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
              Find potential voluntary donors based on self-reported blood type,
              general city location, and active donor availability.
            </p>
          </Card>

          <Card padding="lg" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-bold text-base border border-[#F0D5D1]">
              2
            </div>
            <h3 className="font-heading text-xl font-bold text-[#292525]">
              Connect
            </h3>
            <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
              Submit your hospital request details. The selected donor receives an
              immediate alert to review and voluntarily accept or decline.
            </p>
          </Card>

          <Card padding="lg" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-bold text-base border border-[#F0D5D1]">
              3
            </div>
            <h3 className="font-heading text-xl font-bold text-[#292525]">
              Coordinate
            </h3>
            <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
              Once accepted, use our direct in-app messaging to coordinate arrival
              times at the designated healthcare facility.
            </p>
          </Card>
        </div>
      </section>

      {/* NEED BLOOD? / WANT TO HELP? DUAL PATHWAYS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#A92F35] uppercase tracking-wider">
            <Droplet className="w-4 h-4 fill-current" />
            <span>Need Blood?</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#292525]">
            For Patients & Families
          </h3>
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            Search nearby community volunteers and send a structured request with
            your healthcare facility details. Transparent, direct, and completely free.
          </p>
          <ul className="text-xs text-[#746C68] space-y-2 pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#557A61] flex-shrink-0" />
              <span>Real-time availability of active community volunteers</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#557A61] flex-shrink-0" />
              <span>No fees or intermediaries involved</span>
            </li>
          </ul>
        </Card>

        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#557A61] uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Want to Help?</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#292525]">
            Become a Volunteer Donor
          </h3>
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            List your blood type and turn on "Available to Donate". You will receive
            request alerts only when someone nearby needs emergency blood.
          </p>
          <div className="pt-2">
            <Button
              id="home-register-donor-btn"
              variant="outline"
              size="md"
              onClick={onNavigateToDonate}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Configure Donor Availability
            </Button>
          </div>
        </Card>
      </section>

      {/* CLINICAL RESPONSIBILITY SECTION */}
      <section className="pt-4">
        <Notice
          type="clinical"
          title="Clinical Responsibility & Healthcare Facility Boundaries"
        >
          <p className="mb-2">
            BloodBuddy facilitates communication and matching between willing
            individuals and patients. Medical screening, physical donor health
            evaluation, infection testing, and final compatibility tests remain the
            sole responsibility of accredited healthcare facilities prior to
            transfusion.
          </p>
          <p className="text-[11px] text-[#8F272D]/90 font-semibold">
            BloodBuddy never claims or certifies: verified blood types, verified
            donors, clinical compatibility, medical clearance, or transfusion safety.
          </p>
        </Notice>
      </section>

      {/* COMMUNITY CALL TO ACTION */}
      <section className="pt-6">
        <Card padding="lg" className="bg-[#FAF7F2] border-[#E6DDD7] max-w-3xl mx-auto py-10 space-y-4 text-center">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#292525]">
            Every Drop Counts in Your Local Community
          </h3>
          <p className="text-xs sm:text-sm text-[#746C68] max-w-lg mx-auto leading-relaxed">
            Join community members across Metro Manila who stand ready to answer
            the call when an urgent transfusion is required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              id="cta-search-donors-btn"
              variant="primary"
              size="md"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const bloodSelect = document.getElementById('search-blood-type');
                bloodSelect?.focus();
              }}
            >
              Search Donors Now
            </Button>
            <Button
              id="cta-donate-btn"
              variant="outline"
              size="md"
              onClick={onNavigateToDonate}
            >
              Register as Volunteer Donor
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};
