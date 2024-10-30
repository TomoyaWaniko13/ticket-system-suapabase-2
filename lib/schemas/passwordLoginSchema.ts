import { z } from 'zod';

export const passwordLoginSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'password is required' }),
});

export type PasswordLoginSchema = z.infer<typeof passwordLoginSchema>;
