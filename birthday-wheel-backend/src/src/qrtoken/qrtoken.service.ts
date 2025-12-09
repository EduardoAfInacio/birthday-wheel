import { Injectable } from '@nestjs/common';
import { QrtokenRepository } from './qrtoken.repository';
import { plainToInstance } from 'class-transformer';
import { QrTokenResponseDto } from './dto/qrtoken.response.dto';

@Injectable()
export class QrtokenService {
  constructor(private readonly qrtokenRepository: QrtokenRepository) {}

  async createQrToken(data: {
    code: string;
    description: string;
  }): Promise<QrTokenResponseDto> {
    try {
      const qrToken = await this.qrtokenRepository.createQrToken(data);

      return plainToInstance(QrTokenResponseDto, qrToken, {
        excludeExtraneousValues: true,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
