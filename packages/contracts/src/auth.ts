import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const LoginSchema = RegisterSchema;

export const TokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
