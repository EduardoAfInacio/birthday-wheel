import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QrToken } from '../../generated/prisma/client';

@Injectable()
export class QrtokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createQrToken(data: {
    code: string;
    description: string;
  }): Promise<QrToken> {
    return this.prisma.client.qrToken.create({ data });
  }
}
