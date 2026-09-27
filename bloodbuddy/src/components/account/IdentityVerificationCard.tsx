/**
 * The current verification interaction is simulated for the academic prototype.
 * A production implementation should replace the simulated verification service
 * with a trusted external identity verification provider and server-side
 * verification of the provider result.
 *
 * PRODUCTION UI RULE:
 * Internal mock data and development helpers may exist in code during
 * prototype development, but they must never automatically create
 * visible testing controls in the normal BloodBuddy interface.
 * Future feature additions must NOT reintroduce demo/test shortcuts into
 * production-facing pages.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { UserProfile, IdentityVerificationStatus } from '../../types';
import {
  identityVerificationService,
  VerificationSimulationStep,
} from '../../services/identityVerificationService';

interface IdentityVerificationCardProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const IdentityVerificationCard: React.FC<IdentityVerificationCardProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  // Resolve current status from user profile
  const isCurrentlyVerified = Boolean(
    currentUser.identityVerified ||
    currentUser.identityVerificationStatus === 'verified'
  );

  const [status, setStatus] = useState<IdentityVerificationStatus>(
    isCurrentlyVerified ? 'verified' : (currentUser.identityVerificationStatus || 'not_verified')
  );

  // Simulation modal & timer lifecycle state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<VerificationSimulationStep>('preparing');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Ref to hold cleanup callback for ongoing simulation
  const cancelSimulationRef = useRef<(() => void) | null>(null);

  // Synchronize when currentUser updates externally
  useEffect(() => {
    const verified = Boolean(
      currentUser.identityVerified ||
      currentUser.identityVerificationStatus === 'verified'
    );
    setStatus(verified ? 'verified' : (currentUser.identityVerificationStatus || 'not_verified'));
  }, [currentUser.identityVerificationStatus, currentUser.identityVerified]);

  // Clean up any active simulation timer on unmount
  useEffect(() => {
    return () => {
      if (cancelSimulationRef.current) {
        cancelSimulationRef.current();
        cancelSimulationRef.current = null;
      }
      identityVerificationService.cleanup();
    };
  }, []);

  /**
   * Starts the 10-second simulated identity verification flow.
   * Disables duplicate triggers and opens the custom BloodBuddy modal.
   */
  const handleStartVerification = () => {
    // Guard against duplicate clicks or running when already verified
    if (isProcessing || status === 'verified') {
      return;
    }

    // Initialize simulation state
    setIsProcessing(true);
    setSimulationStep('preparing');
    setIsModalOpen(true);

    // Launch controlled 10-second prototype simulation
    cancelSimulationRef.current = identityVerificationService.startSimulatedVerification({
      onStepChange: (step) => {
        setSimulationStep(step);
      },
      onComplete: () => {
        setIsProcessing(false);
        setSimulationStep('completed');

        // Persist verified state in application state & localStorage
        setStatus('verified');
        onUpdateUser({
          identityVerified: true,
          identityVerificationStatus: 'verified',
        });
      },
    });
  };

  /**
   * Handles closing the verification modal.
   */
  const handleCloseModal = () => {
    // While actively processing, prevent accidental closure to avoid confusing state
    if (isProcessing) {
      return;
    }

    setIsModalOpen(false);
    setSimulationStep('preparing');
  };

  // Helper text and titles during processing
  const getModalContent = () => {
    switch (simulationStep) {
      case 'preparing':
        return {
          title: 'Identity verification',
          stepHeading: 'Preparing verification…',
          description: 'BloodBuddy is preparing your identity verification.',
        };
      case 'verifying':
        return {
          title: 'Identity verification',
          stepHeading: 'Verifying identity…',
          description: 'Please keep this window open while verification is in progress.',
        };
      case 'finalizing':
        return {
          title: 'Identity verification',
          stepHeading: 'Finalizing verification…',
          description: 'Please keep this window open while verification is in progress.',
        };
      case 'completed':
        return {
          title: 'Verification complete',
          stepHeading: 'Verification complete',
          description: 'Your identity verification status has been updated for this prototype.',
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      {/* IDENTITY VERIFICATION CARD */}
      <Card padding="lg" className="space-y-5">
        {/* Card Header with Status Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE5]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#746C68]">
            Identity Verification
          </span>
          {status === 'verified' ? (
            <StatusBadge status="Identity: Verified" variant="verified" size="sm" />
          ) : (
            <StatusBadge status="Not verified" variant="neutral" size="sm" />
          )}
        </div>

        {/* Card Content according to Status */}
        {status === 'verified' ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EDF4EE] text-[#557A61] flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#292525]">
                  Community Identity Verified
                </h4>
                <p className="text-xs text-[#746C68] leading-relaxed">
                  Your identity has been confirmed for account accountability and
                  community coordination.
                </p>
                {/* Subtle prototype disclosure */}
                <p className="text-[11px] text-[#958B86] pt-0.5">
                  Identity verification is simulated in this prototype.
                </p>
              </div>
            </div>

            {/* Subtle boundary notice */}
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] text-xs text-[#746C68] space-y-1">
                <span className="font-semibold text-[#292525] block">
                  Identity Verification Boundary
                </span>
                <p className="leading-relaxed text-[11px]">
                  Identity verification confirms account identity only. It does not
                  verify blood type, donor medical eligibility, or final blood
                  compatibility.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-semibold text-[#292525]">
                Verify your identity
              </h4>
              <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
                Confirm your identity to strengthen account accountability when
                coordinating with other BloodBuddy community members.
              </p>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                id="verify-identity-btn"
                variant="primary"
                size="md"
                onClick={handleStartVerification}
                disabled={isProcessing}
                isLoading={isProcessing}
                rightIcon={!isProcessing ? <ArrowRight className="w-4 h-4" /> : undefined}
              >
                Verify Identity →
              </Button>
              <span className="text-xs text-[#958B86]">
                Identity verification is demonstrated as part of this prototype.
              </span>
            </div>

            {/* Subtle prototype disclosure */}
            <p className="text-[11px] text-[#958B86]">
              Identity verification is simulated in this prototype.
            </p>

            {/* Subtle boundary notice */}
            <div className="pt-2">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD7] text-xs text-[#746C68] space-y-1">
                <span className="font-semibold text-[#292525] block">
                  Identity Verification Boundary
                </span>
                <p className="leading-relaxed text-[11px]">
                  Identity verification confirms account identity only. It does not
                  verify blood type, donor medical eligibility, or final blood
                  compatibility.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* CUSTOM BLOODBUDDY SIMULATED VERIFICATION MODAL */}
      <Modal
        id="identity-verification-modal"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalContent.title}
        maxWidth="sm"
        preventClose={isProcessing}
      >
        <div className="py-2">
          {simulationStep !== 'completed' ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              {/* Calm restrained animated loading indicator */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#A92F35]/10 animate-ping opacity-30" />
                <div className="w-14 h-14 rounded-full border-[3px] border-[#E6DDD7] border-t-[#A92F35] animate-spin" />
                <ShieldCheck className="w-6 h-6 text-[#A92F35] absolute inset-0 m-auto" />
              </div>

              {/* Progress Copy */}
              <div className="space-y-1.5 max-w-sm px-2">
                <h4 className="text-base font-semibold text-[#292525]">
                  {modalContent.stepHeading}
                </h4>
                <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
                  {modalContent.description}
                </p>
              </div>

              {/* Neutral Simulation Status Pill */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E6DDD7] text-[11px] text-[#746C68]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A92F35] animate-pulse" />
                  Demonstration verification in progress
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              {/* Muted Green Confirmation Icon */}
              <div className="w-16 h-16 rounded-full bg-[#EDF4EE] text-[#557A61] flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              {/* Completed State Copy */}
              <div className="space-y-1.5 max-w-sm px-2">
                <h4 className="text-base font-semibold text-[#292525]">
                  {modalContent.stepHeading}
                </h4>
                <p className="text-xs sm:text-sm text-[#746C68] leading-relaxed">
                  {modalContent.description}
                </p>
              </div>

              {/* Action Button: Done */}
              <div className="pt-3 w-full sm:w-auto">
                <Button
                  id="verification-modal-done-btn"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-40"
                  onClick={handleCloseModal}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
