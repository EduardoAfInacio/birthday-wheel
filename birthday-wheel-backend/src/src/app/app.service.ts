import { BadRequestException, Injectable } from '@nestjs/common';
import { QrtokenService } from '../qrtoken/qrtoken.service';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { plainToInstance } from 'class-transformer';
import { ParticipateResponseDto } from './dto/participate-response-dto';

@Injectable()
export class AppService {
  constructor(
    private readonly qrTokenService: QrtokenService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}
  async startFlow(data: {
    name: string;
    email: string;
    phone: string;
    store: string;
    qrTokenCode: string;
  }): Promise<ParticipateResponseDto> {
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

    return plainToInstance(
      ParticipateResponseDto,
      {
        ...session,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
