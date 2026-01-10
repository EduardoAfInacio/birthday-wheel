import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: "Admin's email address",
    example: 'john.smith@email.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: "Admin's password",
    example: '123456Jill!',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message:
      'Password must have at least 8 characters, one uppercase letter, one lowercase letter and one special character',
  })
  password: string;
}
