import { BadRequestException, Injectable } from '@nestjs/common';
import { QrtokenRepository } from './qrtoken.repository';
import { plainToInstance } from 'class-transformer';
import { QrTokenResponseDto } from './dto/qrtoken.response.dto';
import { QrToken } from '../../generated/prisma/client';

@Injectable()
export class QrtokenService {
  constructor(private readonly qrtokenRepository: QrtokenRepository) {}

  async createQrToken(data: {
    code: string;
    description: string;
  }): Promise<QrTokenResponseDto> {
    try {
      const qrTokenAlreadyExists =
        await this.qrtokenRepository.getQrTokenByCode(data.code);

      if (qrTokenAlreadyExists)
        throw new BadRequestException('QR code token already exists');

      const qrToken = await this.qrtokenRepository.createQrToken(data);

      return plainToInstance(QrTokenResponseDto, qrToken, {
        excludeExtraneousValues: true,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findQrTokenByCode(code: string): Promise<QrToken | null> {
    const qrToken = await this.qrtokenRepository.getQrTokenByCode(code);
    return qrToken;
  }
}
