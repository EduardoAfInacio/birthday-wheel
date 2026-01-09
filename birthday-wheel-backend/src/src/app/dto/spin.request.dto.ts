import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SpinRequestDto {
  @ApiProperty({
    description: 'Unique identifier of the user performing the spin',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'Unique code of the QR token associated with the session',
    example: 'DWEQ9DF0W189T0931G03J1I',
  })
  @IsNotEmpty({ message: 'QR Token code is required' })
  @IsString()
  qrTokenCode: string;
}
