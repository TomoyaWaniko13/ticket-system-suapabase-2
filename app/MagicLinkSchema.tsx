import { z } from 'zod';

export const magicLinkSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
});

export type MagicLinkSchema = z.infer<typeof magicLinkSchema>;
