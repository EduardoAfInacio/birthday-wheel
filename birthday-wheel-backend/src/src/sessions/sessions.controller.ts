import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateUserSpinSessionDto } from './dto/create-section-dto';
import { UserSpinSessionResponseDto } from './dto/session-response-dto';
import { plainToInstance } from 'class-transformer';
import { AssignPrizeDto } from './dto/assign-prize-request';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('prizeWon')
  async assignPrizeToUserSession(
    @Body()
    dto: AssignPrizeDto,
  ): Promise<UserSpinSessionResponseDto> {
    const session = await this.sessionsService.assignPrizeToSession(
      dto.sessionId,
      dto.prizeId,
    );

    return plainToInstance(UserSpinSessionResponseDto, session, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('winners')
  async getWinners(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
  ) {
    return await this.sessionsService.findAllWinners(page, limit);
  }
}
