import { BadRequestException, Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { UsersService } from '../users/users.service';
import { QrtokenService } from '../qrtoken/qrtoken.service';
import { UserSpinSessionGetPayload } from '../../generated/prisma/models/UserSpinSession';
import { PrizesService } from '../prizes/prizes.service';
import { UserSpinSession } from '../../generated/prisma/client';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersService: UsersService,
    private readonly qrTokenService: QrtokenService,
    private readonly prizesService: PrizesService,
  ) {}

  async createSession(data: {
    userId: string;
    qrTokenCode: string;
    hasSpun?: boolean;
    spunAt?: string;
    wonPrizeId?: number;
  }): Promise<UserSpinSessionGetPayload<{ include: { prize: true } }> | null> {
    const user = await this.usersService.findUserById(data.userId);
    const qrtoken = await this.qrTokenService.findQrTokenByCode(
      data.qrTokenCode,
    );

    if (!user || !qrtoken) {
      throw new BadRequestException('Either user or qrToken does not exist.');
    }

    return await this.sessionsRepository.createSession({
      userId: data.userId,
      tokenId: qrtoken.id,
      hasSpun: data.hasSpun,
      spunAt: data.spunAt ? new Date(data.spunAt) : undefined,
      wonPrizeId: data.wonPrizeId,
    });
  }

  async createSessionFromParticipateFlow(data: {
    userId: string;
    qrTokenId: string;
    hasSpun?: boolean;
    spunAt?: string;
    wonPrizeId?: number;
  }): Promise<UserSpinSessionGetPayload<{ include: { prize: true } }> | null> {
    return await this.sessionsRepository.createSession({
      userId: data.userId,
      tokenId: data.qrTokenId,
      hasSpun: data.hasSpun,
      spunAt: data.spunAt ? new Date(data.spunAt) : undefined,
      wonPrizeId: data.wonPrizeId,
    });
  }

  async findSessionByUserAndTokenIds(
    userId: string,
    tokenId: string,
  ): Promise<UserSpinSessionGetPayload<{
    include: { prize: true };
  }> | null> {
    return await this.sessionsRepository.findByUserAndTokenIds(userId, tokenId);
  }

  async updateSessionAfterSpin(
    sessionId: string,
    data: { hasSpun: boolean; wonPrizeId: number; spunAt: Date },
  ) {
    await this.sessionsRepository.updateSession(sessionId, data);
  }

  async assignPrizeToSession(
    sessionId: string,
    prizeId: number,
  ): Promise<UserSpinSessionGetPayload<{ include: { prize: true } }>> {
    const prize = await this.prizesService.findByid(prizeId);

    if (!prize) {
      throw new BadRequestException('This prize does not exist.');
    }

    const session = await this.sessionsRepository.findById(sessionId);

    if (!session) {
      throw new BadRequestException('This session does not exist.');
    }

    if (session?.hasSpun) {
      throw new BadRequestException(
        'User has already spun, cant bind another prize.',
      );
    }
    return await this.sessionsRepository.bindPrizeToSession(sessionId, prizeId);
  }

  async findAllWinners(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.sessionsRepository.findWinnersPaginated(skip, limit),
      this.sessionsRepository.countWinners(),
    ]);

    const formatedData = data.map((session) => ({
      ...session,
      prize: session.prize
        ? {
            ...session.prize,
            price: session.prize.price.toString(),
            weight: session.prize.weight.toString(),
          }
        : null,
    }));
    return {
      data: formatedData,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
