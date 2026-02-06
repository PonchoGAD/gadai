import { z } from 'zod';

export const StructuredProfileSchema = z.object({
  meta: z.object({
    has_time_of_birth: z.boolean(),
    limitations: z.array(z.string())
  }),
  astrology: z.record(z.string(), z.any()),
  numerology: z.record(z.string(), z.any()),
  archetypes: z.record(z.string(), z.any())
});

export const ProfileInputSchema = z.object({
  date_of_birth: z.string(),
  time_of_birth: z.string().optional(),
  place_of_birth: z.string().optional(),
  locale: z.enum(['ru', 'en']),
  goal: z.string().optional()
});

export type StructuredProfile = z.infer<typeof StructuredProfileSchema>;
export type ProfileInput = z.infer<typeof ProfileInputSchema>;
