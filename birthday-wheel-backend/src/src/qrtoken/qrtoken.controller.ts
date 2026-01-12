import { Body, Controller, Post } from '@nestjs/common';
import { QrtokenService } from './qrtoken.service';
import { QrTokenRequestDto } from './dto/qrtoken.request.dto';
import { QrTokenResponseDto } from './dto/qrtoken.response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('QR Tokens')
@Controller('qrtoken')
export class QrtokenController {
  constructor(private readonly qrtokenService: QrtokenService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a new QR Token',
    description:
      'Registers a new QR Token that allows users to access the wheel. Validates uniqueness of the code.',
  })
  @ApiResponse({
    status: 201,
    description: 'QR Token successfully created.',
    type: QrTokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'QR Code token already exists or validation failed.',
  })
  async createQrCodeToken(
    @Body() dto: QrTokenRequestDto,
  ): Promise<QrTokenResponseDto> {
    const qrToken = await this.qrtokenService.createQrToken(dto);
    return plainToInstance(QrTokenResponseDto, qrToken, {
      excludeExtraneousValues: true,
    });
  }
}
