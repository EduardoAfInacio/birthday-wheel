import { ApiProperty } from '@nestjs/swagger';
import { UserSpinSessionResponseDto } from './session-response-dto';

class PaginationMetaDto {
  @ApiProperty({ example: 10 })
  total: number;
  @ApiProperty({ example: 1 })
  page: number;
  @ApiProperty({ example: 5 })
  lastPage: number;
}

export class WinnersPaginatedResponseDto {
  @ApiProperty({ type: [UserSpinSessionResponseDto] })
  data: UserSpinSessionResponseDto[];
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
