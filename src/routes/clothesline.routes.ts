import { Router } from 'express';
import { clotheslineController } from '../controller/clothesline.controller';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  CreateClotheslineDto, 
  UpdateClotheslineDto,
  ClotheslineParamsDto,
  ClotheslineActionDto
} from '../dtos/clothesline.dto';

const router = Router();

// POST /api/clothesline - Create clothesline
router.post('/',
  validateBody(CreateClotheslineDto),
  clotheslineController.create
);

// GET /api/clothesline/:id - Get clothesline by ID
router.get('/:id',
  validateParams(ClotheslineParamsDto),
  clotheslineController.findById
);

// PUT /api/clothesline/:id - Update clothesline
router.put('/:id',
  validateParams(ClotheslineParamsDto),
  validateBody(UpdateClotheslineDto),
  clotheslineController.update
);

// DELETE /api/clothesline/:id - Delete clothesline
router.delete('/:id',
  validateParams(ClotheslineParamsDto),
  clotheslineController.delete
);

// POST /api/clothesline/:id/action - Execute action (open/close)
router.post('/:id/action',
  validateParams(ClotheslineParamsDto),
  validateBody(ClotheslineActionDto),
  clotheslineController.executeAction
);

// GET /api/clothesline/:id/status - Get status
router.get('/:id/status',
  validateParams(ClotheslineParamsDto),
  clotheslineController.getStatus
);

export { router as clotheslineRoutes };