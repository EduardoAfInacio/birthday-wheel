import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "User's full name",
    example: 'John Smith',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must have at least 3 characters' })
  name: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.smith@email.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User phone number (numbers only, 10 or 11 digits)',
    example: '11987654321',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\d{10,11}$/, {
    message: 'Phone number must contain 10 or 11 numeric digits',
  })
  phone: string;

  @ApiProperty({
    description: 'Name of the store where the purchase was made',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Store name is required' })
  storeName: string;
}
