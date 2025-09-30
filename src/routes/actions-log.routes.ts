import { Router } from 'express';
import { actionsLogController } from '../controller/actions-log.controller'; 
import { validateBody, validateQuery } from '../middleware/validation';
import { 
  CreateActionsLogDto,
  ActionsLogFiltersDto
} from '../dtos/actions-log.dto';
import { PaginationSchema } from '../types/api';

const router = Router();

// POST /api/actions-log - Create action log (for Arduino)
router.post('/',
  validateBody(CreateActionsLogDto),
  actionsLogController.create
);

// GET /api/actions-log - Get actions with filters and pagination
router.get('/',
  validateQuery(ActionsLogFiltersDto.merge(PaginationSchema)),
  actionsLogController.findMany
);

// GET /api/actions-log/stats - Get statistics
router.get('/stats',
  actionsLogController.getStats
);

export { router as actionsLogRoutes };