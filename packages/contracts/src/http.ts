import { z } from 'zod';

export const PaywallSchema = z.object({
  show: z.boolean(),
  reason: z.string().optional(),
  message: z.string().optional(),
  plans: z.array(z.string()).optional()
});

export const ApiResponseSchema = z.object({
  data: z.any(),
  paywall: PaywallSchema.optional()
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type Paywall = z.infer<typeof PaywallSchema>;
