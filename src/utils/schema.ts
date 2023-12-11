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

export const createTxtToImageSchema = z.object({
  school: z.string().min(1),
  prompt: z.string().min(1, { message: '需要输入对应的prompt' }),
  negativePrompt: z.string().default(''),
  batchSize: z
    .number()
    .int({ message: '需要输入为整数' })
    .min(1)
    .max(8, { message: '最大为八张' })
    .default(1),
  width: z.number().int().min(256).default(512),
  height: z.number().int().min(256).default(512),
  steps: z.number().int().min(1).max(100).default(50),
  initImage: z.string().default('')
});
