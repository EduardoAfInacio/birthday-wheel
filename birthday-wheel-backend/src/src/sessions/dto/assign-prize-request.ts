import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsInt } from 'class-validator';

export class AssignPrizeDto {
  @ApiProperty({
    example: 'f1d3b8a4-7c32-4bce-a8b7-91bc8a1e1f52',
    description:
      'Unique identifier of the user spin session that will receive the prize.',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'sessionId must be a valid UUID.' })
  @IsNotEmpty({ message: 'sessionId is required.' })
  sessionId: string;

  @ApiProperty({
    example: 12,
    description: 'Identifier of the prize to be assigned to the session.',
  })
  @IsInt({ message: 'prizeId must be an integer.' })
  @IsNotEmpty({ message: 'prizeId is required.' })
  prizeId: number;
}
