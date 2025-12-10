import { BadRequestException, Injectable } from '@nestjs/common';
import { QrtokenService } from '../qrtoken/qrtoken.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly qrTokenService: QrtokenService,
    private readonly usersService: UsersService,
  ) {}
  async startFlow(data: {
    name: string;
    email: string;
    phone: string;
    store: string;
    qrTokenCode: string;
  }): Promise<void> {
    const qrToken = await this.qrTokenService.findQrTokenByCode(
      data.qrTokenCode,
    );
    if (!qrToken)
      throw new BadRequestException(
        "You don't have any QR Token! please enter the website through a valid QR Code.",
      );
    let user = await this.usersService.findUserByPhone(data.phone);

    if (!user) {
      user = await this.usersService.createUser({
        name: data.name,
        phone: data.phone,
        email: data.email,
        storeName: data.store,
      });
    }
    console.log(qrToken);
    console.log(user);
  }
}
