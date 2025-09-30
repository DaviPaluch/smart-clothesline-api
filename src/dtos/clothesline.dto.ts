import { z } from 'zod';
import { ClotheslineStatus } from '@prisma/client';

export const CreateClotheslineDto = z.object({
  name: z.string().min(1).max(100),
});

export const UpdateClotheslineDto = z.object({
  name: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(ClotheslineStatus).optional(),
});

export const ClotheslineParamsDto = z.object({
  id: z.string().uuid(),
});

export const ClotheslineActionDto = z.object({
  action: z.enum(['OPEN', 'CLOSE']),
  origin: z.enum(['USER', 'ARDUINO', 'SYSTEM']).default('USER'),
  humidity: z.number().min(0).max(100).optional(),
});

export type CreateClotheslineData = z.infer<typeof CreateClotheslineDto>;
export type UpdateClotheslineData = z.infer<typeof UpdateClotheslineDto>;
export type ClotheslineParams = z.infer<typeof ClotheslineParamsDto>;
export type ClotheslineAction = z.infer<typeof ClotheslineActionDto>;