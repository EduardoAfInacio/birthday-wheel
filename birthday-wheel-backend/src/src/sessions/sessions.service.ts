import { BadRequestException, Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { UsersService } from '../users/users.service';
import { QrtokenService } from '../qrtoken/qrtoken.service';
import { UserSpinSessionGetPayload } from '../../generated/prisma/models/UserSpinSession';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersService: UsersService,
    private readonly qrTokenService: QrtokenService,
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

  async findSessionByUserAndTokenIds(
    userId: string,
    tokenId: string,
  ): Promise<UserSpinSessionGetPayload<{
    include: { prize: true };
  }> | null> {
    return await this.sessionsRepository.findByUserAndTokenIds(userId, tokenId);
  }
}
