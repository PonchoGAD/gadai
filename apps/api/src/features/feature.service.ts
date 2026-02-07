import { Injectable } from '@nestjs/common';
import { Paywall } from '@gadai/contracts';

export type Plan = 'free' | 'pro' | 'premium';

export type PlanUser = {
  id?: string;
  plan?: Plan;
};

@Injectable()
export class FeatureService {
  /* ===================== PROFILE ACCESS ===================== */

  getProfilePaywall(user: PlanUser): Paywall | null {
    const plan = user.plan ?? 'free';

    if (plan === 'free') {
      return {
        show: true,
        reason: 'deep_analysis_locked',
        plans: ['pro', 'premium']
      };
    }

    return null;
  }

  canDeepAnalysis(user: PlanUser): boolean {
    return (user.plan ?? 'free') !== 'free';
  }

  profileTier(user: PlanUser): 'basic' | 'full' {
    return (user.plan ?? 'free') === 'free' ? 'basic' : 'full';
  }

  /* ===================== AI LIMITS ===================== */

  aiMessageLimit(user: PlanUser): number {
    switch (user.plan) {
      case 'pro':
        return 50;
      case 'premium':
        return Number.POSITIVE_INFINITY;
      default:
        return 5;
    }
  }

  getAiLimitPaywall(): Paywall {
    return {
      show: true,
      reason: 'ai_limit_reached',
      plans: ['pro', 'premium']
    };
  }
}
