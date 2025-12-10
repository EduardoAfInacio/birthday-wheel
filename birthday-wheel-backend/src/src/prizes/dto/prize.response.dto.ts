import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class PrizeResponseDto {
  @ApiProperty({
    example: 'clso1abcd001234xyz987',
    description: 'Unique identifier of the prize',
  })
  @Exclude()
  id: string;

  @ApiProperty({
    example: 'Summer sale ticket',
    description: 'Name of the prize',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Summer sale ticket - 2023/02',
    nullable: true,
    description: 'Optional description providing more details about the prize',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/summer-sale-ticket.png',
    nullable: true,
    description: 'URL pointing to an image that visually represents the prize',
  })
  @Expose()
  imageUrl?: string;

  @ApiProperty({
    example: '#ff0000',
    nullable: true,
    description: 'Hexadecimal color associated with the prize',
  })
  @Expose()
  color?: string;

  @ApiProperty({
    example: '100.50',
    description: 'Prize price formatted as a decimal string (up to 2 decimals)',
  })
  @Expose()
  price: string;

  @ApiProperty({
    example: 100,
    description: 'Current available quantity of the prize in stock',
  })
  @Expose()
  stock: number;

  @ApiProperty({
    example: 100,
    description: 'Initial amount of the prize available when registered',
  })
  @Expose()
  initialStock: number;

  @ApiProperty({
    example: '1.5',
    description: 'Prize weight used for draw probability calculations',
  })
  @Expose()
  weight: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the prize is currently active',
  })
  @Expose()
  isActive?: boolean;

  @ApiProperty({
    example: false,
    description:
      'Indicates whether the prize is considered a loss (used in raffles)',
  })
  @Expose()
  isLoss?: boolean;

  @ApiProperty({
    example: '2025-12-01T12:00:00.000Z',
    description: 'Timestamp of when the prize was created',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2025-12-01T12:00:00.000Z',
    description: 'Timestamp of the latest update applied to the prize',
  })
  @Expose()
  updatedAt: Date;
}
