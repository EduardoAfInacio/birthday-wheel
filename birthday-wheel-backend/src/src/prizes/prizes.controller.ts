import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { PrizeResponseDto } from './dto/prize.response.dto';

@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Post('/create')
  async create(@Body() dto: CreatePrizeDto): Promise<PrizeResponseDto> {
    return await this.prizesService.create(dto);
  }
}
