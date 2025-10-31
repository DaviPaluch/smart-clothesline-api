import { Request, Response, NextFunction } from 'express';
import { clotheslineService } from '../services/clothesline.service';

export class ClotheslineController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const clothesline = await clotheslineService.create(req.body);
      res.status(201).json(clothesline);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const clothesline = await clotheslineService.findById(req.params.id);
      
      if (!clothesline) {
        return res.status(404).json({ error: 'Clothesline not found' });
      }

      res.json(clothesline);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const clothesline = await clotheslineService.update(req.params.id, req.body);
      res.json(clothesline);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await clotheslineService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async executeOpenAction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await clotheslineService.executeOpenAction(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async executeCloseAction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await clotheslineService.executeCloseAction(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await clotheslineService.getStatus(req.params.id);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
}

export const clotheslineController = new ClotheslineController();