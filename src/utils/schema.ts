import { z } from 'zod';

export const createAppSchema = z.object({
  icon: z.string().emoji(),
  name: z.string().min(1),
  description: z.string().min(1),
  demoInput: z.string().min(1),
  prompt: z.string().min(1)
});

export const createImageSchema = z.object({
  prompt: z.string().min(1, { message: '需要输入对应的prompt' }),
  negativePrompt: z.optional(z.string()),
  batchSize: z.number().int().min(1).max(8).default(1)
});
