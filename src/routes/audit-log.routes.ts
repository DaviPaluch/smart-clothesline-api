import { Router } from 'express';
import { auditLogController } from '../controller/audit-log.controller'; 
import { validateQuery } from '../middleware/validation';
import { AuditLogFiltersDto } from '../dtos/audit-log.dto';
import { PaginationSchema } from '../types/api';

const router = Router();

// GET /api/audit-log - Get audit logs with filters and pagination
router.get('/',
  validateQuery(AuditLogFiltersDto.merge(PaginationSchema)),
  auditLogController.findMany
);

export { router as auditLogRoutes };