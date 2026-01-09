import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { PrizeResponseDto } from './dto/prize.response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Post('/create')
  async create(@Body() dto: CreatePrizeDto): Promise<PrizeResponseDto> {
    const prize = await this.prizesService.create(dto);
    return plainToInstance(
      PrizeResponseDto,
      {
        ...dto,
        price: prize.price.toString(),
        weight: prize.weight.toString(),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Get('/getAvailablePrizes')
  async getAvailablePrizes(): Promise<PrizeResponseDto[]> {
    const prizes = await this.prizesService.getDisplayPrizes();

    return plainToInstance(PrizeResponseDto, prizes, {
      excludeExtraneousValues: true,
    });
  }
}
