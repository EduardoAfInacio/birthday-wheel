import { Body, Controller, Post } from '@nestjs/common';
import { QrtokenService } from './qrtoken.service';
import { QrTokenRequestDto } from './dto/qrtoken.request.dto';
import { QrTokenResponseDto } from './dto/qrtoken.response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('qrtoken')
export class QrtokenController {
  constructor(private readonly qrtokenService: QrtokenService) {}

  @Post('/create')
  async createQrCodeToken(
    @Body() dto: QrTokenRequestDto,
  ): Promise<QrTokenResponseDto> {
    const qrToken = await this.qrtokenService.createQrToken(dto);

    return plainToInstance(QrTokenResponseDto, qrToken, {
      excludeExtraneousValues: true,
    });
  }
}
