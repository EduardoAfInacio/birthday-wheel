import { BadRequestException, Injectable } from '@nestjs/common';
import { QrtokenService } from '../qrtoken/qrtoken.service';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { PrizesService } from '../prizes/prizes.service';


@Injectable()
export class AppService {
  constructor(
    private readonly qrTokenService: QrtokenService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly prizesService: PrizesService,
  ) {}
  async startFlow(data: {
    name: string;
    email: string;
    phone: string;
    store: string;
    qrTokenCode: string;
  }): Promise<any> {
    const qrToken = await this.qrTokenService.findQrTokenByCode(
      data.qrTokenCode,
    );
    if (!qrToken)
      throw new BadRequestException(
        'Invalid QR Token! please enter the website through a valid QR Code.',
      );

    const user = await this.usersService.upsertUser({
      name: data.name,
      phone: data.phone,
      email: data.email,
      storeName: data.store,
    });

    let session = await this.sessionsService.findSessionByUserAndTokenIds(
      user.id,
      qrToken.id,
    );

    if (!session) {
      console.log(
        '----------------------------------------------------------------',
      );
      console.log('CREATING SESSION');
      console.log(
        '----------------------------------------------------------------',
      );
      session = await this.sessionsService.createSessionFromParticipateFlow({
        userId: user.id,
        qrTokenId: qrToken.id,
      });
    }

    if (!session) throw new BadRequestException('Could not create session');

    return {
      ...session,
      sessionId: session?.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      prize: session.prize,
    };
  }

  async executeSpin(data: {
    userId: string;
    qrTokenCode: string;
  }): Promise<any> {
    const qrToken = await this.qrTokenService.findQrTokenByCode(
      data.qrTokenCode,
    );
    if (!qrToken || !qrToken.isActive)
      throw new BadRequestException('Invalid QR Token!');

    const session = await this.sessionsService.findSessionByUserAndTokenIds(
      data.userId,
      qrToken.id,
    );

    if (!session) throw new BadRequestException('Session not found!');
    if (session.hasSpun)
      throw new BadRequestException('You have already spun!');

    const allPrizes = await this.prizesService.getDisplayPrizes();

    const wonPrize = await this.prizesService.drawPrize();

    const prizeIndex = allPrizes.findIndex((p) => p.id === wonPrize.id);

    await this.sessionsService.updateSessionAfterSpin(session.id, {
      hasSpun: true,
      wonPrizeId: wonPrize.id,
      spunAt: new Date(),
    });

    return {
      success: true,
      prizeIndex: prizeIndex,
      wonPrize: wonPrize,
      allPrizes: allPrizes,
    };
  }
}
