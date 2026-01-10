import { Controller, Post, Body, Get } from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { PrizeResponseDto } from './dto/prize.response.dto';
import { plainToInstance } from 'class-transformer';
import { Prize } from '../../generated/prisma/client';

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

    const transformedPrizes = prizes.map((prize: Prize) => ({
      ...prize,
      weight: prize.weight.toString(),
      price: prize.price.toString(),
    }));

    return plainToInstance(PrizeResponseDto, transformedPrizes, {
      excludeExtraneousValues: true,
    });
  }
}
