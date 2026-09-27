import React from 'react';
import {
  Droplet,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
  MapPin,
  Building,
  UserCheck
} from 'lucide-react';
import { ActiveView } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Notice } from '../components/common/Notice';

interface DonateBloodPublicViewProps {
  isAuthenticated: boolean;
  onNavigate: (view: ActiveView) => void;
}

export const DonateBloodPublicView: React.FC<DonateBloodPublicViewProps> = ({
  isAuthenticated,
  onNavigate,
}) => {
  return (
    <div className="max-w-[1200px] mx-auto py-8 sm:py-12 space-y-16">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EAE7] text-[#A92F35] text-xs font-semibold uppercase tracking-wider">
          <Droplet className="w-3.5 h-3.5 fill-current" />
          <span>Voluntary Blood Donation</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#292525] leading-[1.15] tracking-tight">
          Give Blood. Save a Life in Your Community.
        </h1>

        <p className="text-base sm:text-lg text-[#746C68] leading-relaxed max-w-2xl mx-auto">
          BloodBuddy empowers everyday community members across Metro Manila to connect directly with patients and families during urgent hospital blood shortages — transparently, voluntarily, and free from middlemen.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {!isAuthenticated ? (
            <>
              <Button
                id="donate-hero-register-btn"
                variant="primary"
                size="lg"
                onClick={() => onNavigate('register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Register as a Volunteer Donor
              </Button>
              <Button
                id="donate-hero-login-btn"
                variant="outline"
                size="lg"
                onClick={() => onNavigate('login')}
              >
                Log In to Update Availability
              </Button>
            </>
          ) : (
            <>
              <Button
                id="donate-hero-dashboard-btn"
                variant="primary"
                size="lg"
                onClick={() => onNavigate('donation-requests')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Open Donation Requests
              </Button>
              <Button
                id="donate-hero-home-btn"
                variant="outline"
                size="lg"
                onClick={() => onNavigate('home')}
              >
                Search Potential Donors
              </Button>
            </>
          )}
        </div>
      </section>

      {/* HOW VOLUNTEER DONATION WORKS (3-STEP PROCESS) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A92F35]">
            Simple Community Process
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#292525]">
            How Donating Blood on BloodBuddy Works
          </h2>
          <p className="text-xs sm:text-sm text-[#746C68]">
            You maintain 100% control of your readiness and schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="lg" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-heading font-bold text-xl border border-[#F0D5D1]">
              1
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#292525]">
              Set Your Blood Type
            </h3>
            <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
              Indicate your self-reported blood type (e.g., A+, O−, B+) and general city in Metro Manila. If you aren't sure of your type, you can update it after your next hospital donation.
            </p>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-heading font-bold text-xl border border-[#F0D5D1]">
              2
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#292525]">
              Control Your Availability
            </h3>
            <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
              Use the simple one-click "Available to Donate" toggle in your dashboard. Switch it ON when ready to respond, or switch it OFF when busy, traveling, or resting between donations.
            </p>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-heading font-bold text-xl border border-[#F0D5D1]">
              3
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#292525]">
              Review & Coordinate
            </h3>
            <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
              Receive structured request alerts containing healthcare facility details and required dates. Accept requests you can fulfill, then coordinate facility arrival directly inside BloodBuddy.
            </p>
          </Card>
        </div>
      </section>

      {/* ELIGIBILITY CRITERIA SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E6DDD7]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A92F35]">
              Donor Readiness
            </span>
            <h2 className="font-heading text-3xl font-bold text-[#292525] mt-1">
              General Donor Eligibility Guidelines
            </h2>
          </div>
          <p className="text-xs text-[#746C68] max-w-md">
            Final medical evaluations are conducted by licensed clinical personnel at the hospital before every donation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-[#E6DDD7] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center font-bold text-sm">
              18+
            </div>
            <h4 className="font-bold text-sm text-[#292525]">Age Requirement</h4>
            <p className="text-xs text-[#746C68] leading-relaxed">
              Generally between 18 and 65 years old. 16–17 year olds may donate with formal parental or guardian consent.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6DDD7] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDF4EE] text-[#557A61] flex items-center justify-center font-bold text-sm">
              50kg
            </div>
            <h4 className="font-bold text-sm text-[#292525]">Minimum Weight</h4>
            <p className="text-xs text-[#746C68] leading-relaxed">
              You must weigh at least 50 kg (110 lbs) to donate a standard unit of 450 mL whole blood safely.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6DDD7] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5F2EF] text-[#746C68] flex items-center justify-center font-bold text-sm">
              12w
            </div>
            <h4 className="font-bold text-sm text-[#292525]">Donation Interval</h4>
            <p className="text-xs text-[#746C68] leading-relaxed">
              Whole blood can be donated once every 12 weeks (3 months) to allow full hemoglobin replenishment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6DDD7] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDF4EE] text-[#557A61] flex items-center justify-center font-bold text-sm">
              100%
            </div>
            <h4 className="font-bold text-sm text-[#292525]">Good General Health</h4>
            <p className="text-xs text-[#746C68] leading-relaxed">
              Well-rested, hydrated, with no acute fever, active infections, or alcohol intake within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* PRIVACY & CLINICAL BOUNDARIES */}
      <section className="space-y-4">
        <Notice
          type="clinical"
          title="Clinical Screening & Hospital Blood Bank Responsibilities"
        >
          <div className="space-y-2">
            <p>
              BloodBuddy connects willing volunteers with families in urgent need of blood. <strong>BloodBuddy does not collect, store, screen, or certify blood.</strong>
            </p>
            <p className="text-xs text-[#8F272D]/90">
              All physical donor screening, hemoglobin finger-pricks, blood pressure checks, transfusion-transmissible infection (TTI) testing, and crossmatching are performed solely by accredited healthcare facilities prior to any transfusion.
            </p>
          </div>
        </Notice>

        <Notice
          type="privacy"
          title="Privacy by Design for Volunteers"
        >
          <p>
            Your exact home address, phone number, and personal surname are never published on open search pages. Search results display only your self-reported blood type, general district/city, and approximate distance. Real-time coordination occurs safely through authenticated requests.
          </p>
        </Notice>
      </section>

      {/* BOTTOM CTA CARD */}
      <section>
        <Card
          padding="lg"
          className="bg-white border-[#E6DDD7] text-center max-w-3xl mx-auto py-12 space-y-5 rounded-2xl shadow-[0_4px_24px_rgba(41,37,37,0.05)]"
        >
          <h3 className="font-heading text-3xl font-bold text-[#292525]">
            Ready to Stand by for Your Neighbors?
          </h3>
          <p className="text-sm text-[#746C68] max-w-lg mx-auto leading-relaxed">
            One blood donation can save up to three lives. Sign up in under two minutes and make your availability count when emergency strikes.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button
                  id="cta-bottom-register-btn"
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('register')}
                >
                  Create Volunteer Account
                </Button>
                <Button
                  id="cta-bottom-login-btn"
                  variant="outline"
                  size="md"
                  onClick={() => onNavigate('login')}
                >
                  Sign In to Existing Account
                </Button>
              </>
            ) : (
              <Button
                id="cta-bottom-dashboard-btn"
                variant="primary"
                size="md"
                onClick={() => onNavigate('donation-requests')}
              >
                Go to Donation Requests
              </Button>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};
