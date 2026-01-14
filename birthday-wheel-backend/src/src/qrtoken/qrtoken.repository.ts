import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QrToken } from '@prisma/client';

@Injectable()
export class QrtokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createQrToken(data: {
    code: string;
    description: string;
  }): Promise<QrToken> {
    return this.prisma.client.qrToken.create({ data });
  }

  async getQrTokenByCode(code: string): Promise<QrToken | null> {
    return this.prisma.client.qrToken.findUnique({ where: { code } });
  }
}
