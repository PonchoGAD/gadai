import { Injectable } from '@nestjs/common';
import { Paywall } from '@gadai/contracts';

@Injectable()
export class FeatureService {
  getProfileAccess(plan: string): Paywall | null {
    if (plan === 'free') {
      return {
        show: true,
        reason: 'deep_analysis_locked',
        plans: ['pro', 'premium']
      };
    }

    return null;
  }

  canUseDeepAnalysis(plan: string): boolean {
    return plan === 'pro' || plan === 'premium';
  }
}
