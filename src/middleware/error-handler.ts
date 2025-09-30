import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors,
    });
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Unique constraint violation',
          details: error.meta,
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found',
        });
      default:
        return res.status(500).json({
          error: 'Database error',
          details: error.message,
        });
    }
  }

  // Custom application errors
  if (error.message === 'Clothesline not found') {
    return res.status(404).json({
      error: error.message,
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
};