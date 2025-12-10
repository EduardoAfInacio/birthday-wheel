import { BadRequestException, Injectable } from '@nestjs/common';
import { QrtokenRepository } from './qrtoken.repository';
import { QrToken } from '../../generated/prisma/client';

@Injectable()
export class QrtokenService {
  constructor(private readonly qrtokenRepository: QrtokenRepository) {}

  async createQrToken(data: {
    code: string;
    description: string;
  }): Promise<QrToken> {
    try {
      const qrTokenAlreadyExists =
        await this.qrtokenRepository.getQrTokenByCode(data.code);

      if (qrTokenAlreadyExists)
        throw new BadRequestException('QR code token already exists');

      return await this.qrtokenRepository.createQrToken(data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findQrTokenByCode(code: string): Promise<QrToken | null> {
    const qrToken = await this.qrtokenRepository.getQrTokenByCode(code);
    if (!qrToken) throw new BadRequestException('QR code not found');
    return qrToken;
  }
}
