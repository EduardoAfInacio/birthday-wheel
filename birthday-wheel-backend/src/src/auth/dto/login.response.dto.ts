import { ApiProperty } from '@nestjs/swagger';

class UserPayloadDto {
  @ApiProperty({ example: 'admin@example.com' })
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT Access Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserPayloadDto,
  })
  user: UserPayloadDto;
}
