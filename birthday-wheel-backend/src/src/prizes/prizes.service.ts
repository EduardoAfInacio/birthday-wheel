import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { PrizesRepository } from './prizes.repository';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace';
import { Prize } from '../../generated/prisma/client';

@Injectable()
export class PrizesService {
  constructor(private readonly prizesRepository: PrizesRepository) {}

  async drawPrize(): Promise<Prize> {
    const availablePrizes = await this.prizesRepository.findActivePrizes();

    if (availablePrizes.length === 0) {
      throw new BadRequestException('Sorry, prize stock is empty!');
    }

    const totalWeight = availablePrizes.reduce((sum, prize) => {
      return sum + Number(prize.weight);
    }, 0);

    const random = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    let selectedPrize: Prize | null = null;

    for (const prize of availablePrizes) {
      cumulativeWeight += Number(prize.weight);
      if (random <= cumulativeWeight) {
        selectedPrize = prize;
        break;
      }
    }

    if (!selectedPrize) {
      selectedPrize = availablePrizes[availablePrizes.length - 1];
    }

    await this.prizesRepository.decrementStock(selectedPrize.id);

    return selectedPrize;
  }

  async getDisplayPrizes(): Promise<Prize[]> {
    const availablePrizes = await this.prizesRepository.findActivePrizes();
    if (availablePrizes.length === 0) {
      throw new BadRequestException('Sorry, prize stock is empty!');
    }
    return availablePrizes;
  }

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

  async findByid(id: number): Promise<Prize | null> {
    return await this.prizesRepository.findById(id);
  }
}
