import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PrizeResponseDto } from './prize.response.dto';

export class ParticipateResponseDto {
  /* ---------------------------- SESSION FIELDS ---------------------------- */

  @ApiProperty({
    example: 'clsxyz123session0001',
    description: 'Unique identifier of the spin session',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'abc123qr0987token',
    description: 'Code of the QR Token used to start the session',
  })
  @Expose()
  qrTokenCode: string;

  @ApiProperty({
    example: '2025-12-01T12:00:00.000Z',
    description: 'Date when the session was created',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2025-12-01T12:10:00.000Z',
    description: 'Last update time of the session',
  })
  @Expose()
  updatedAt: Date;

  /* ----------------------------- USER FIELDS ----------------------------- */

  @ApiProperty({
    example: 'John Smith',
    description: "User's full name",
  })
  @Expose()
  userName: string;

  @ApiProperty({
    example: 'john.smith@email.com',
    description: "User's email address",
  })
  @Expose()
  userEmail: string;

  @ApiProperty({
    example: '11987654321',
    description: "User's phone number",
  })
  @Expose()
  userPhone: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user has already spun the wheel',
  })
  @Expose()
  hasSpun: boolean;

  /* ----------------------------- PRIZE OBJECT ----------------------------- */

  @ApiProperty({
    description: 'Prize obtained in the spin session (can be null)',
    type: () => PrizeResponseDto,
    nullable: true,
  })
  @Expose()
  @Type(() => PrizeResponseDto)
  prize: PrizeResponseDto | null;
}
