import { prisma } from '../infra/prisma';
import { auditService } from './audit.service';
import { actionsLogService } from './actions-log.service';
import { 
  CreateClotheslineData, 
  UpdateClotheslineData, 
} from '../dtos/clothesline.dto';
import { ClotheslineStatus, ActionType } from '@prisma/client';
import client from '../infra/mqtt';

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
      // include: {
      //   actionsLog: {
      //     orderBy: { createdAt: 'desc' },
      //     take: 5,
      //   },
      // },
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

  async executeOpenAction(id: string) {
    const clothesline = await this.findById(id);
    
    if (!clothesline) {
      throw new Error('Clothesline not found');
    }

    const newStatus = ActionType.OPEN 

    client.publish('clothesline', newStatus, { qos: 1 }, (err) => {
      if (err) {
        console.error('Erro ao publicar:', err.message);
        throw new Error('Message not sent');
      } else {
        console.log(`📡 Mensagem publicada: ${newStatus}`);
      }
    });

    // Update clothesline status
    const updatedClothesline = await this.update(id, { status: newStatus }); // TODO: it may return from Arduino

    // Log the action
    await actionsLogService.create({
      clotheslineId: id,
      actionType: 'OPEN',
      actionOrigin: 'USER',
      humidity: undefined,
    });

    return {
      clothesline: updatedClothesline,
      message: `Clothesline opened successfully`,
    };
  }

  async executeCloseAction(id: string) {
    const clothesline = await this.findById(id);

    if (!clothesline) {
      throw new Error('Clothesline not found');
    }

    const newStatus = ClotheslineStatus.CLOSED;

    client.publish('clothesline', newStatus, { qos: 1 }, (err) => {
      if (err) {
        console.error('Erro ao publicar:', err.message);
        throw new Error('Message not sent');
      } else {
        console.log(`📡 Mensagem publicada: ${newStatus}`);
      }
    });

    // Update clothesline status
    const updatedClothesline = await this.update(id, { status: newStatus }); // TODO: it may return from Arduino

    // Log the action
    await actionsLogService.create({
      clotheslineId: id,
      actionType: 'CLOSE',
      actionOrigin: 'USER',
      humidity: undefined,
    });

    return {
      clothesline: updatedClothesline,
      message: `Clothesline closed successfully`,
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
    };
  }
}

export const clotheslineService = new ClotheslineService();