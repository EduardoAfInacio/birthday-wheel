import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WinnersPaginatedResponseDto } from './dto/winners-paginated-response';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new session manually',
    description:
      'Creates a spin session for a user and token, primarily for internal or manual flows.',
  })
  @ApiResponse({
    status: 201,
    description: 'Session successfully created.',
    type: UserSpinSessionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User or QR Token does not exist.',
  })
  async createSection(
    @Body() dto: CreateUserSpinSessionDto,
  ): Promise<UserSpinSessionResponseDto> {
    const session = await this.sessionsService.createSession(dto);
    return plainToInstance(UserSpinSessionResponseDto, session, {
      excludeExtraneousValues: true,
    });
  }

  @Post('prizeWon')
  @ApiOperation({
    summary: 'Assign prize to session',
    description: 'Manually binds a specific prize to an existing session.',
  })
  @ApiResponse({
    status: 201,
    description: 'Prize successfully assigned to session.',
    type: UserSpinSessionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Session/Prize not found or User has already spun.',
  })
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
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List winners (Paginated)',
    description:
      'Retrieves a paginated list of sessions where a prize was won. Supports filtering by search term and store.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Filter by user name, email or prize name',
  })
  @ApiQuery({
    name: 'store',
    required: false,
    type: String,
    description: 'Filter by store name',
  })
  @ApiResponse({
    status: 200,
    description: 'List of winners retrieved successfully.',
    type: WinnersPaginatedResponseDto,
  })
  async getWinners(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('store') store?: string,
  ) {
    return await this.sessionsService.findAllWinners(
      page,
      limit,
      search,
      store,
    );
  }
}
