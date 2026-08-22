import { z } from 'zod';

// Mirrors backend validation (see docs/backend-integration.md):
// email + password (min 8 chars) for register, no min length enforced on login
// beyond "required" since the server is the source of truth there.
export const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
