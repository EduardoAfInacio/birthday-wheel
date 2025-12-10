import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { PrizeResponseDto } from '../../prizes/dto/prize.response.dto';

export class UserSpinSessionResponseDto {
  @ApiProperty({
    example: 'c1b5e734-03f4-4cc7-9c38-23b129dc4af4',
    description: 'Unique identifier of the user spin session',
  })
  @Exclude()
  id: string;

  @ApiProperty({
    example: 'f92a3f56-098a-4d22-9a8a-89c1d0b4a11a',
    description: 'Identifier of the user associated with the session',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    example: '0fd3b730-c91e-4c49-a5ff-50e190e5f64e',
    description: 'Identifier of the QR token associated with the session',
  })
  @Expose()
  tokenId: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user has already spun the wheel',
  })
  @Expose()
  hasSpun: boolean;

  @ApiProperty({
    example: '2025-01-15T14:48:00.000Z',
    nullable: true,
    description: 'Timestamp of when the user spun the wheel',
  })
  @Expose()
  spunAt?: Date;

  @ApiProperty({
    example: 3,
    nullable: true,
    description: 'Identifier of the prize won by the user, if applicable',
  })
  @Expose()
  wonPrizeId?: number;

  @ApiProperty({
    description: 'Prize details if the user has won a prize',
    nullable: true,
    type: () => PrizeResponseDto,
  })
  @Expose()
  @Type(() => PrizeResponseDto)
  prize?: PrizeResponseDto;

  @ApiProperty({
    example: '2025-12-01T12:00:00.000Z',
    description: 'Timestamp of when the session was created',
  })
  @Expose()
  createdAt: Date;
}
