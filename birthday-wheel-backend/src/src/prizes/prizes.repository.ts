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
}
