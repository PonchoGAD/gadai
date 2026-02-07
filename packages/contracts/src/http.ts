import { z } from 'zod';

export const PaywallSchema = z.object({
  show: z.boolean(),
  reason: z.string().optional(),
  plans: z.array(z.enum(['pro', 'premium'])).optional()
});

export type Paywall = z.infer<typeof PaywallSchema>;

export type PaywallReason =
  | 'deep_analysis_locked'
  | 'ai_limit_reached';

export interface PaywallResponse {
  show: boolean;
  reason?: PaywallReason;
  plans?: Array<'pro' | 'premium'>;
}


export const ApiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    data: data,
    paywall: PaywallSchema.optional()
  });

export type ApiResponse<T> = {
  data: T;
  paywall?: Paywall;
};
