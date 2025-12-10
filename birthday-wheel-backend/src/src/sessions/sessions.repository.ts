import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  UserSpinSessionGetPayload,
} from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(data: {
    userId: string;
    tokenId: string;
    hasSpun?: boolean;
    spunAt?: Date;
    wonPrizeId?: number;
  }): Promise<UserSpinSessionGetPayload<{ include: { prize: true } }> | null> {
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

  async findByUserAndTokenIds(
    userId: string,
    tokenId: string,
  ): Promise<UserSpinSessionGetPayload<{ include: { prize: true } }> | null> {
    return await this.prisma.client.userSpinSession.findUnique({
      where: {
        userId_tokenId: {
          userId,
          tokenId,
        },
      },
      include: { prize: true },
    });
  }
}
