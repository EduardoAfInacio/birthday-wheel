import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class QrTokenResponseDto {
  @ApiProperty({
    description: 'ID of unique QR code token',
    example: 'uuid',
  })
  @Exclude()
  id: string;
  @ApiProperty({
    description: 'QR code token',
    example: 'summer-sale-2023-casasbahia',
  })
  @Expose()
  code: string;
  @ApiProperty({
    description: 'Description of the event',
    example: 'Summer sale birthday wheel - 2023',
  })
  @Expose()
  description: string;
  @ApiProperty({
    description: 'Whether the token is active or not',
    example: true,
  })
  @Expose()
  isActive: boolean;
  @ApiProperty({
    description: 'Timestamp when the token was created',
    example: '2023-12-01T12:00:00Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;
}