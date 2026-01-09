import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PrizeResponseDto } from './prize.response.dto';

export class SpinResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the spin transaction was successful',
  })
  @Expose()
  success: boolean;

  @ApiProperty({
    example: 3,
    description:
      'Index of the winning prize in the allPrizes array. Used for frontend animation calculation.',
  })
  @Expose()
  prizeIndex: number;

  @ApiProperty({
    description: 'The prize object that was won in this spin',
    type: () => PrizeResponseDto,
  })
  @Expose()
  @Type(() => PrizeResponseDto)
  wonPrize: PrizeResponseDto;

  @ApiProperty({
    description: 'List of all available prizes to be rendered on the wheel',
    type: [PrizeResponseDto],
  })
  @Expose()
  @Type(() => PrizeResponseDto)
  allPrizes: PrizeResponseDto[];
}
