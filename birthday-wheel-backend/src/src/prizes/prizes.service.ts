import { Injectable } from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { PrizesRepository } from './prizes.repository';
import { plainToInstance } from 'class-transformer';
import { PrizeResponseDto } from './dto/prize.response.dto';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class PrizesService {
  constructor(private readonly prizesRepository: PrizesRepository) {}
  async create(dto: CreatePrizeDto): Promise<PrizeResponseDto> {
    try {
      const prize = await this.prizesRepository.createPrize({
        ...dto,
        price: new Decimal(dto.price),
        weight: new Decimal(dto.weight),
      });

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
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
