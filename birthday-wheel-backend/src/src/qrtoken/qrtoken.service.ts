import { Injectable } from '@nestjs/common';
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
      return await this.qrtokenRepository.createQrToken(data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
