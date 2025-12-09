import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ParticipateRequestDto } from './dto/ParticipateRequestDto';
import { UserResponseDto } from './dto/UserResponseDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async participationRequest(
    @Body() dto: ParticipateRequestDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.createUser(dto);
  }
}
