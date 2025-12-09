import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QrTokenRequestDto {
  @ApiProperty({
    description: 'QR code token',
    example: 'summer-sale-2023-casasbahia',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'QR code token is required' })
  code: string;
  @ApiProperty({
    description: 'Description of the event',
    example: 'Summer sale birthday wheel - 2023',
  })
  @IsString()
  @IsOptional()
  description: string;
}
