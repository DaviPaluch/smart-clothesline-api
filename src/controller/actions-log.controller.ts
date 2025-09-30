import { Request, Response, NextFunction } from 'express';
import { actionsLogService } from '../services/actions-log.service';

export class ActionsLogController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const actionLog = await actionsLogService.create(req.body);
      res.status(201).json(actionLog);
    } catch (error) {
      next(error);
    }
  }

  async findMany(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, ...filters } = req.query as any;
      const result = await actionsLogService.findMany(
        filters,
        { page: page || 1, limit: limit || 10 }
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { clotheslineId } = req.query;
      const stats = await actionsLogService.getStats(clotheslineId as string);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const actionsLogController = new ActionsLogController();