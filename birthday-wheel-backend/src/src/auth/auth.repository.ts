import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Admin } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUniqueByEmail(email: string): Promise<Admin | null> {
    return await this.prisma.client.admin.findUnique({
      where: { email: email },
    });
  }
}
