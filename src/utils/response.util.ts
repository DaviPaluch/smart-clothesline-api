import { Response } from 'express';
import { PaginatedResponse } from '../types/api';

export class ResponseUtil {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode = 400, details?: any) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      details,
    });
  }

  static paginated<T>(
    res: Response, 
    data: PaginatedResponse<T>, 
    message?: string,
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...data,
    });
  }
}