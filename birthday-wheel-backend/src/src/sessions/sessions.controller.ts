import { Body, Controller, Post } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateUserSpinSessionDto } from './dto/create-section-dto';
import { UserSpinSessionResponseDto } from './dto/session-response-dto';
import { plainToInstance } from 'class-transformer';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('create')
  async createSection(
    @Body() dto: CreateUserSpinSessionDto,
  ): Promise<UserSpinSessionResponseDto> {
    const session = await this.sessionsService.createSession(dto);
    return plainToInstance(UserSpinSessionResponseDto, session, {
      excludeExtraneousValues: true,
    });
  }
}
