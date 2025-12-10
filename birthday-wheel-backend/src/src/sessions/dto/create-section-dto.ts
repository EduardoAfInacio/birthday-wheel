import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserSpinSessionDto {
  @ApiProperty({
    description: 'ID of the User',
    example: 'f92a3f56-098a-4d22-9a8a-89c1d0b4a11a',
  })
  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;

  @ApiProperty({
    description: 'Code of the QR Token (QR Token)',
    example: 'summer-sale-2023-casasbahia',
  })
  @IsString()
  @IsNotEmpty({ message: 'QrToken code is required' })
  qrTokenCode: string;

  @ApiProperty({
    description: 'Whether the user has already spun the wheel',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasSpun?: boolean;

  @ApiProperty({
    description: 'Date and time when the user spun the wheel',
    example: '2025-01-15T14:48:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  spunAt?: string;

  @ApiProperty({
    description: 'ID of the prize won by the user',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  wonPrizeId?: number;
}
