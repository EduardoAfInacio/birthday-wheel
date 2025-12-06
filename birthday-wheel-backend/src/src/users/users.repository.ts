import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    phone: string;
    email: string;
    storeName: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getCount(): Promise<number> {
    return this.prisma.user.count();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
      include: { sessions: true },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phone },
      include: { sessions: true },
    });
  }
}
