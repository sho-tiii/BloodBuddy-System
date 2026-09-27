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

import { UserProfile } from '../types';

export type VerificationSimulationStep = 'preparing' | 'verifying' | 'finalizing' | 'completed';

export interface SimulatedVerificationCallbacks {
  onStepChange?: (step: VerificationSimulationStep) => void;
  onComplete?: () => void;
}

/**
 * Identity Verification Service (Simulated for Academic Prototype)
 *
 * Provides a controlled, timer-based demonstration of the identity verification lifecycle
 * without calling external providers, opening ungrounded iframes, or collecting actual credentials.
 */
class IdentityVerificationService {
  private activeTimers: ReturnType<typeof setTimeout>[] = [];

  /**
   * Starts the 10-second simulated identity verification process.
   *
   * @param callbacks Step change and completion handlers
   * @returns Cancel function to safely abort simulation and clear timers
   */
  public startSimulatedVerification(
    callbacks: SimulatedVerificationCallbacks
  ): () => void {
    this.cleanup();

    // 1. Initial phase: Preparing verification (~0-3s)
    callbacks.onStepChange?.('preparing');

    // 2. Middle phase: Verifying identity (~3-7s)
    const timerStep2 = setTimeout(() => {
      callbacks.onStepChange?.('verifying');
    }, 3000);

    // 3. Final phase: Finalizing verification (~7-10s)
    const timerStep3 = setTimeout(() => {
      callbacks.onStepChange?.('finalizing');
    }, 7000);

    // 4. Completion phase: Finished at approximately 10s
    const timerComplete = setTimeout(() => {
      callbacks.onStepChange?.('completed');
      callbacks.onComplete?.();
    }, 10000);

    this.activeTimers = [timerStep2, timerStep3, timerComplete];

    return () => this.cleanup();
  }

  /**
   * Cleans up any running simulation timers.
   */
  public cleanup(): void {
    this.activeTimers.forEach((timerId) => clearTimeout(timerId));
    this.activeTimers = [];
  }
}

export const identityVerificationService = new IdentityVerificationService();


