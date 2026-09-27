import React from 'react';
import { ShieldCheck, Heart, Users, Droplet, ArrowLeft, ArrowRight, Building } from 'lucide-react';
import { ActiveView } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Notice } from '../components/common/Notice';

interface AboutUsViewProps {
  onNavigate: (view: ActiveView) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-[1080px] mx-auto py-8 space-y-12">
      {/* Header breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-[#746C68] hover:text-[#292525] flex items-center gap-1 font-medium mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7EAE7] text-[#A92F35] text-xs font-semibold uppercase tracking-wider mb-3">
          <Droplet className="w-3.5 h-3.5 fill-current" />
          <span>About BloodBuddy</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#292525] leading-tight">
          "Every Drop Counts"
        </h1>
        <p className="text-base sm:text-lg text-[#746C68] mt-2 max-w-2xl leading-relaxed">
          A real-time community blood matching platform connecting local patients
          needing urgent blood transfusions directly with nearby matching donors
          during hospital shortages.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F7EAE7] text-[#A92F35] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#292525]">
            Community First
          </h3>
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            One account can both request blood and act as a volunteer donor. No
            fees, no monetary transactions, and no intermediaries.
          </p>
        </Card>

        <Card padding="md" className="space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EDF4EE] text-[#557A61] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#292525]">
            Voluntary Action
          </h3>
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            Donors maintain full control over their active visibility with the
            one-click "Available to Donate" toggle.
          </p>
        </Card>

        <Card padding="md" className="space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F5F2EF] text-[#746C68] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#292525]">
            Privacy Protected
          </h3>
          <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
            Public searches show only blood type and general proximity. Contact
            and coordination are unlocked solely through mutual consent.
          </p>
        </Card>
      </div>

      {/* Privacy and Trust Rules Breakdown */}
      <Card padding="lg" className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#292525]">
          Understanding Trust & Verification on BloodBuddy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] space-y-1">
            <span className="font-bold text-[#292525] block text-sm">
              Email Verified
            </span>
            <p className="text-[#746C68]">
              Confirms user ownership of the registered email address. Does not
              imply medical history or physical suitability.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] space-y-1">
            <span className="font-bold text-[#292525] block text-sm">
              Identity Verified
            </span>
            <p className="text-[#746C68]">
              Confirms real community member account ownership. Does not certify
              blood type or donation eligibility.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] space-y-1">
            <span className="font-bold text-[#292525] block text-sm">
              Self-Reported Blood Type
            </span>
            <p className="text-[#746C68]">
              Blood type provided directly by the user. BloodBuddy has not
              clinically verified this. Crossmatching is performed at the hospital.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] space-y-1">
            <span className="font-bold text-[#292525] block text-sm">
              Accepted Request
            </span>
            <p className="text-[#746C68]">
              Indicates a volunteer's readiness to coordinate arrival. It does not
              guarantee compatibility or blood clearance.
            </p>
          </div>
        </div>
      </Card>

      {/* Clinical Disclaimer Notice */}
      <Notice
        type="clinical"
        title="Sole Clinical Responsibility of Accredited Healthcare Facilities"
      >
        <p className="leading-relaxed">
          BloodBuddy is a matching and communication platform only. Medical screening,
          donor health evaluation, testing for transfusion-transmissible infections
          (TTIs), and crossmatching remain the sole responsibility of accredited
          blood bank personnel and healthcare facilities.
        </p>
      </Notice>

      {/* Academic Background / Project Info */}
      <Card padding="md" className="bg-[#FAF7F2] border-[#E6DDD7] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#746C68]">
          <Building className="w-5 h-5 text-[#A92F35] flex-shrink-0" />
          <span>
            Project Proposal for CC116-Advanced Web Systems and Technologies,
            University of Caloocan City (Congress Campus)
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('home')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Explore Matching Donors
        </Button>
      </Card>
    </div>
  );
};
