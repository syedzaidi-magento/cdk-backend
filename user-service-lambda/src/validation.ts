import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please include a valid email'),
  password: z.string().min(6, 'Password must be 6 or more characters'),
  role: z.enum(['customer', 'company'], { errorMap: () => ({ message: 'Role must be customer or company' }) }),
});

export const loginSchema = z.object({
  email: z.string().email('Please include a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
  accessToken: z.string().min(1, 'Access token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;