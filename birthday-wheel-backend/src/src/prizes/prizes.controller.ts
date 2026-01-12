import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { PrizeResponseDto } from './dto/prize.response.dto';
import { plainToInstance } from 'class-transformer';
import { Prize } from '../../generated/prisma/client';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Prizes')
@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a new prize',
    description:
      'Registers a new prize in the system with defined weight, stock, and visual attributes.',
  })
  @ApiResponse({
    status: 201,
    description: 'Prize successfully created.',
    type: PrizeResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data provided.',
  })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List available prizes',
    description:
      'Retrieves a list of all active prizes currently available in stock to be displayed on the wheel.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of prizes retrieved successfully.',
    type: [PrizeResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'Prize stock is empty.',
  })
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
