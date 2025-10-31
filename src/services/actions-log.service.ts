  import { prisma } from '../infra/prisma';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { 
  CreateActionsLogData, 
  ActionsLogFilters 
} from '../dtos/actions-log.dto';
import { ActionsLog } from '@prisma/client';

export class ActionsLogService {
  async create(data: CreateActionsLogData) {
    return prisma.actionsLog.create({
      data,
      include: {
        clothesline: {
          select: { id: true, name: true, status: true }
        }
      }
    });
  }

  async findMany(
    filters: ActionsLogFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<ActionsLog & { clothesline: any }>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.clotheslineId) {
      where.clotheslineId = filters.clotheslineId;
    }

    if (filters.actionType) {
      where.actionType = filters.actionType;
    }

    if (filters.actionOrigin) {
      where.actionOrigin = filters.actionOrigin;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      prisma.actionsLog.findMany({
        where,
        include: {
          clothesline: {
            select: { id: true, name: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.actionsLog.count({ where })
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

  async getStats(clotheslineId?: string) {
    const where = clotheslineId ? { clotheslineId } : {};

    const [
      totalActions,
      openActions,
      closeActions,
      userActions,
      arduinoActions,
      systemActions,
    ] = await Promise.all([
      prisma.actionsLog.count({ where }),
      prisma.actionsLog.count({ where: { ...where, actionType: 'OPEN' } }),
      prisma.actionsLog.count({ where: { ...where, actionType: 'CLOSE' } }),
      prisma.actionsLog.count({ where: { ...where, actionOrigin: 'USER' } }),
      prisma.actionsLog.count({ where: { ...where, actionOrigin: 'ARDUINO' } }),
      prisma.actionsLog.count({ where: { ...where, actionOrigin: 'SYSTEM' } }),
    ]);

    return {
      total: totalActions,
      byAction: { open: openActions, close: closeActions },
      byOrigin: { 
        user: userActions, 
        arduino: arduinoActions, 
        system: systemActions 
      },
    };
  }
}

export const actionsLogService = new ActionsLogService();