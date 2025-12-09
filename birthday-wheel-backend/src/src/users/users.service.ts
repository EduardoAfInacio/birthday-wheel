import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../../generated/prisma/client';
import { UserResponseDto } from './dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async createUser(data: {
    name: string;
    phone: string;
    email: string;
    storeName: string;
  }): Promise<UserResponseDto> {
    try {
      const user = await this.users.create(data);
      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
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
}
