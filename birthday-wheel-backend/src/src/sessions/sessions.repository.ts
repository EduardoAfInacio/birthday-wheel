import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  UserSpinSessionGetPayload,
} from '../../generated/prisma/internal/prismaNamespace';
import { UserSpinSession } from '../../generated/prisma/client';

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

  async findById(id: string): Promise<UserSpinSession | null> {
    return this.prisma.client.userSpinSession.findUnique({ where: { id } });
  }

  async updateSession(
    sessionId: string,
    data: { hasSpun: boolean; wonPrizeId: number; spunAt: Date },
  ) {
    return this.prisma.client.userSpinSession.update({
      where: { id: sessionId },
      data: {
        hasSpun: data.hasSpun,
        spunAt: data.spunAt,
        prize: {
          connect: { id: data.wonPrizeId },
        },
      },
    });
  }

  async bindPrizeToSession(
    sessionId: string,
    prizeId: number,
  ): Promise<UserSpinSessionGetPayload<{ include: { prize: true } }>> {
    return this.prisma.client.userSpinSession.update({
      where: { id: sessionId },
      data: {
        prize: {
          connect: { id: prizeId },
        },
        hasSpun: true,
        spunAt: new Date(),
      },
      include: {
        prize: true,
        user: true,
        token: true,
      },
    });
  }

  async unbindPrizeFromSession(
    sessionId: string,
    prizeId: number,
  ): Promise<UserSpinSessionGetPayload<{ include: { prize: true } }>> {
    return this.prisma.client.userSpinSession.update({
      where: { id: sessionId },
      data: {
        prize: { disconnect: true },
        hasSpun: false,
        spunAt: null,
      },
      include: {
        prize: true,
        user: true,
        token: true,
      },
    });
  }
}
