import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true,
    format: 'uuid',
  })
  @Exclude()
  id: string;
  @ApiProperty({
    description: "User's full name",
    example: 'John Smith',
    minLength: 3,
    maxLength: 50,
  })
  @Expose()
  name: string;
  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com',
    format: 'email',
  })
  @Expose()
  phone: string;
  @ApiProperty()
  @Expose()
  email: string;
  @ApiProperty()
  @Expose()
  storeName: string;
  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2023-12-01T12:00:00Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;
}
