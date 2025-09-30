import { prisma } from '../lib/prisma';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { CreateAuditLogData, AuditLogFilters } from '../dtos/audit-log.dto';
import { AuditLog } from '@prisma/client';

export class AuditService {
  async log(data: CreateAuditLogData) {
    return prisma.auditLog.create({ data });
  }

  async findMany(
    filters: AuditLogFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<AuditLog>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.tableName) {
      where.tableName = { contains: filters.tableName, mode: 'insensitive' };
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where })
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
