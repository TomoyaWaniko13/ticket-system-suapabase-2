import { z } from 'zod';

export const magicLinkLoginSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
});

export type MagicLinkLoginSchema = z.infer<typeof magicLinkLoginSchema>;
