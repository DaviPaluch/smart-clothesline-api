import { z } from 'zod';
import { AuditAction } from '@prisma/client';

export const AuditLogFiltersDto = z.object({
  tableName: z.string().optional(),
  action: z.nativeEnum(AuditAction).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const CreateAuditLogDto = z.object({
  tableName: z.string(),
  recordId: z.string().optional(),
  action: z.nativeEnum(AuditAction),
  oldData: z.any().optional(),
  newData: z.any().optional(),
});

export type AuditLogFilters = z.infer<typeof AuditLogFiltersDto>;
export type CreateAuditLogData = z.infer<typeof CreateAuditLogDto>;
