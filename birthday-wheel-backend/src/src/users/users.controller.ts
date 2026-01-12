import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UserResponseDto } from './dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create or update user',
    description:
      'Registers a new user or updates an existing one based on the phone number provided. This endpoint uses an upsert strategy.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered or updated.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input data (e.g., missing name or invalid phone format).',
  })
  async participationRequest(
    @Body() dto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.upsertUser(dto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
