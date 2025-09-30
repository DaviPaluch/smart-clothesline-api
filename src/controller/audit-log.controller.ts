import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service';

export class AuditLogController {
  async findMany(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, ...filters } = req.query as any;
      const result = await auditService.findMany(
        filters,
        { page: page || 1, limit: limit || 10 }
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const auditLogController = new AuditLogController();