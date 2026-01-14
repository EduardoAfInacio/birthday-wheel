import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    phone: string;
    email: string;
    storeName: string;
  }): Promise<User> {
    return this.prisma.client.user.create({ data });
  }

  async upsertByPhone(data: {
    name: string;
    phone: string;
    email: string;
    storeName: string;
  }): Promise<User> {
    return this.prisma.client.user.upsert({
      where: { phone: data.phone },
      create: data,
      update: data,
    });
  }

  async getCount(): Promise<number> {
    return this.prisma.client.user.count();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.client.user.findFirst({
      where: { email },
      include: { sessions: true },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.client.user.findUnique({
      where: { phone },
      include: { sessions: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.client.user.findUnique({ where: { id } });
  }
}
