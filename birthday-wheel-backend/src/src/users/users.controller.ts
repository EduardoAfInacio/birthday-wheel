import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ParticipateRequestDto } from './dto/ParticipateRequestDto';
import { UserResponseDto } from './dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async participationRequest(
    @Body() dto: ParticipateRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(dto);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
