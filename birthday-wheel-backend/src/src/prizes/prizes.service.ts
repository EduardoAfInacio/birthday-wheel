import { Injectable } from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { PrizesRepository } from './prizes.repository';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace';
import { Prize } from '../../generated/prisma/client';

@Injectable()
export class PrizesService {
  constructor(private readonly prizesRepository: PrizesRepository) {}
  async create(dto: CreatePrizeDto): Promise<Prize> {
    try {
      return await this.prizesRepository.createPrize({
        ...dto,
        price: new Decimal(dto.price),
        weight: new Decimal(dto.weight),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
