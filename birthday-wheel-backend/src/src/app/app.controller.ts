import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ParticipateRequestDto } from './dto/participate.request.dto';
import { ParticipateResponseDto } from './dto/participate.response.dto';
import { SpinRequestDto } from './dto/spin.request.dto';
import { SpinResponseDto } from './dto/spin.response.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Client Flow')
@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/participate')
  @ApiOperation({
    summary: 'Register participant and start session',
    description:
      'Validates the QR Code, registers or updates the user information, and initiates a new session or retrieves an existing one.',
  })
  @ApiResponse({
    status: 201,
    description: 'Session successfully created or retrieved.',
    type: ParticipateResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid QR Token, Session not found, or User has already spun.',
  })
  async flow(
    @Body() dto: ParticipateRequestDto,
  ): Promise<ParticipateResponseDto> {
    return await this.appService.startFlow(dto);
  }

  @ApiOperation({
    summary: 'Execute prize draw',
    description: 'Verifies user eligibility, draws a prize based on weight, updates the session, and queues the confirmation email.'
  })
  @ApiResponse({
    status: 201,
    description: 'Spin executed successfully and prize assigned.',
    type: SpinResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid QR Token, Session not found, or User has already spun.'
  })
  @Post('/spin')
  async spin(@Body() dto: SpinRequestDto): Promise<SpinResponseDto> {
    return await this.appService.executeSpin(dto);
  }
}
