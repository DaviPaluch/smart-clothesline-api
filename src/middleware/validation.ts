import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.errors,
        });
      }

      req.body = result.data.body || req.body;
      req.params = result.data.params || req.params;
      req.query = result.data.query || req.query;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        return res.status(400).json({
          error: 'Query validation failed',
          details: result.error.errors,
        });
      }

      req.query = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        return res.status(400).json({
          error: 'Params validation failed',
          details: result.error.errors,
        });
      }

      req.params = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: 'Body validation failed',
          details: result.error.errors,
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};