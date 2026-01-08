import { PrismaService } from '../prisma/prisma.service';
import { Prize } from '../../generated/prisma/client';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrizesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPrize(data: {
    name: string;
    description?: string;
    imageUrl?: string;
    color?: string;
    price: Decimal;
    stock: number;
    initialStock: number;
    weight: Decimal;
    isActive?: boolean;
    isLoss?: boolean;
  }): Promise<Prize> {
    return this.prisma.client.prize.create({ data });
  }

  async findActivePrizes(): Promise<Prize[]> {
    return this.prisma.client.prize.findMany({
      where: {
        isActive: true,
        stock: {
          gt: 0,
        },
      },
    });
  }

  async decrementStock(id: number): Promise<Prize> {
    return this.prisma.client.prize.update({
      where: { id },
      data: {
        stock: {
          decrement: 1,
        },
      },
    });
  }

  async findAllForWheelDisplay(): Promise<Prize[]> {
    return this.prisma.client.prize.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number): Promise<Prize | null> {
    return this.prisma.client.prize.findUnique({
      where: { id },
    });
  }
}
