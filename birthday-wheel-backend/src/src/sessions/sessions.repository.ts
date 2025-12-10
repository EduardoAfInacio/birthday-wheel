import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserSpinSession } from '../../generated/prisma/client';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(data: {
    userId: string;
    tokenId: string;
    hasSpun?: boolean;
    spunAt?: Date;
    wonPrizeId?: number;
  }): Promise<UserSpinSession> {
    try {
      return await this.prisma.client.userSpinSession.create({
        data,
        include: { prize: true },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'User already has a session for this token',
        );
      }
      throw error;
    }
  }
}
