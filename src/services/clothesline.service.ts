import { prisma } from '../lib/prisma';
import { auditService } from './audit.service';
import { actionsLogService } from './actions-log.service';
import { 
  CreateClotheslineData, 
  UpdateClotheslineData,
  ClotheslineAction 
} from '../dtos/clothesline.dto';
import { ClotheslineStatus, ActionType } from '@prisma/client';

export class ClotheslineService {
  async create(data: CreateClotheslineData) {
    const clothesline = await prisma.clothesline.create({
      data: {
        ...data,
        status: ClotheslineStatus.CLOSED,
      },
    });

    await auditService.log({
      tableName: 'Clothesline',
      recordId: clothesline.id,
      action: 'INSERT',
      newData: clothesline,
    });

    return clothesline;
  }

  async findById(id: string) {
    return prisma.clothesline.findUnique({
      where: { id },
      include: {
        actionsLog: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async update(id: string, data: UpdateClotheslineData) {
    const oldClothesline = await prisma.clothesline.findUnique({
      where: { id },
    });

    if (!oldClothesline) {
      throw new Error('Clothesline not found');
    }

    const updatedClothesline = await prisma.clothesline.update({
      where: { id },
      data,
    });

    await auditService.log({
      tableName: 'Clothesline',
      recordId: id,
      action: 'UPDATE',
      oldData: oldClothesline,
      newData: updatedClothesline,
    });

    return updatedClothesline;
  }

  async delete(id: string) {
    const clothesline = await prisma.clothesline.findUnique({
      where: { id },
    });

    if (!clothesline) {
      throw new Error('Clothesline not found');
    }

    await prisma.clothesline.delete({
      where: { id },
    });

    await auditService.log({
      tableName: 'Clothesline',
      recordId: id,
      action: 'DELETE',
      oldData: clothesline,
    });

    return { message: 'Clothesline deleted successfully' };
  }

  async executeAction(id: string, actionData: ClotheslineAction) {
    const clothesline = await this.findById(id);
    
    if (!clothesline) {
      throw new Error('Clothesline not found');
    }

    const newStatus = actionData.action === 'OPEN' 
      ? ClotheslineStatus.OPEN 
      : ClotheslineStatus.CLOSED;

    // Update clothesline status
    const updatedClothesline = await this.update(id, { status: newStatus });

    // Log the action
    await actionsLogService.create({
      clotheslineId: id,
      actionType: actionData.action as ActionType,
      actionOrigin: actionData.origin,
      humidity: actionData.humidity,
    });

    return {
      clothesline: updatedClothesline,
      message: `Clothesline ${actionData.action.toLowerCase()}ed successfully`,
    };
  }

  async getStatus(id: string) {
    const clothesline = await this.findById(id);
    
    if (!clothesline) {
      throw new Error('Clothesline not found');
    }

    return {
      id: clothesline.id,
      name: clothesline.name,
      status: clothesline.status,
      lastActions: clothesline.actionsLog,
    };
  }
}

export const clotheslineService = new ClotheslineService();