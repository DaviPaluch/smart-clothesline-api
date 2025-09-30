import { z } from 'zod';
import { ActionType, ActionOrigin } from '@prisma/client';

export const ActionsLogFiltersDto = z.object({
  clotheslineId: z.string().uuid().optional(),
  actionType: z.nativeEnum(ActionType).optional(),
  actionOrigin: z.nativeEnum(ActionOrigin).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const CreateActionsLogDto = z.object({
  clotheslineId: z.string().uuid(),
  actionType: z.nativeEnum(ActionType),
  actionOrigin: z.nativeEnum(ActionOrigin),
  humidity: z.number().min(0).max(100).optional(),
});

export type ActionsLogFilters = z.infer<typeof ActionsLogFiltersDto>;
export type CreateActionsLogData = z.infer<typeof CreateActionsLogDto>;