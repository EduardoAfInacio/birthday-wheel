import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async upsertUser(data: {
    name: string;
    phone: string;
    email: string;
    storeName: string;
  }): Promise<User> {
    try {
      return await this.users.upsertByPhone(data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    const user = await this.users.findByPhone(phone);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.users.findById(id);
    return user;
  }
}
