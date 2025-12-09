import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePrizeDto {
  @ApiProperty({
    description: 'Name of the prize',
    example: 'Summer sale ticket',
  })
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @ApiProperty({
    description: 'Description of the prize',
    example: 'Summer sale ticket - 2023/02',
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    description: 'Image URL of the prize',
    example: 'https://example.com/summer-sale-ticket.png',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
  @ApiProperty({
    description: 'Color of the prize',
    example: '#ff0000',
  })
  @IsOptional()
  @IsString()
  color?: string;
  @ApiProperty({
    description: 'Price of the prize in BRL',
    example: '100.50',
    type: String,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsDecimal(
    { decimal_digits: '1,2' },
    { message: 'Price must have up to 2 decimal places' },
  )
  @Transform(({ value }): string => String(value))
  price: string;
  @ApiProperty({
    description: 'Stock of the prize',
    example: 100,
  })
  @IsInt()
  @Min(-1, {
    message: 'Stock must be greater than or equal to 0. If -1, its unlimited',
  })
  stock: number;
  @ApiProperty({
    description: 'Initial stock of the prize',
    example: 100,
  })
  @IsInt()
  @Min(-1, {
    message:
      'Initial stock must be greater than or equal to 0. If -1, its unlimited',
  })
  initialStock: number;
  @ApiProperty({
    description: 'Weight of the prize used for draw probability calculations',
    example: 99.55,
  })
  @IsNotEmpty({ message: 'Weight is required' })
  @Transform(({ value }): string => String(value))
  weight: string;
  @ApiProperty({
    description: 'Whether the prize is active or not',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @ApiProperty({
    description: 'Whether the prize is a loss or not',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isLoss?: boolean;
}
