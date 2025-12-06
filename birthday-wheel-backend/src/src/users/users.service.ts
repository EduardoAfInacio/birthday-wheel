import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async createUser(data: {
    name: string;
    phone: string;
    email: string;
    storeName: string;
  }): Promise<User> {
    return this.users.create(data);
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    const user = await this.users.findByPhone(phone);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
