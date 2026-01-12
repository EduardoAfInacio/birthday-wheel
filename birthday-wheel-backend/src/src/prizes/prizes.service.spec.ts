import { PrizesService } from './prizes.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrizesRepository } from './prizes.repository';
import { BadRequestException } from '@nestjs/common';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace';

const mockPrizesRepository = {
  findActivePrizes: jest.fn(),
  decrementStock: jest.fn(),
  createPrice: jest.fn(),
  findById: jest.fn(),
};

describe('PrizesService', () => {
  let service: PrizesService;
  let repository: typeof mockPrizesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrizesService,
        { provide: PrizesRepository, useValue: mockPrizesRepository },
      ],
    }).compile();

    service = module.get<PrizesService>(PrizesService);
    repository = module.get(PrizesRepository);
    jest.clearAllMocks();
  });

  describe('drawPrize', () => {
    it('should throw BadRequestException if no prizes are available', async () => {
      repository.findActivePrizes.mockResolvedValue([]);

      await expect(service.drawPrize()).rejects.toThrow(BadRequestException);
    });

    it('should select a prize based on weight and decrement stock', async () => {
      const prizes = [
        { id: 1, name: 'Prize A', weight: new Decimal(10) },
        { id: 2, name: 'Prize B', weight: new Decimal(90) },
      ];

      repository.findActivePrizes.mockResolvedValue(prizes);

      jest.spyOn(Math, 'random').mockReturnValue(0.95);

      const result = await service.drawPrize();

      expect(result.id).toBe(2);
      expect(repository.decrementStock).toHaveBeenCalledWith(2);
    });

    it('should select the last prize if random calculation exceeds loop (fallback)', async () => {
      const prizes = [{ id: 1, weight: new Decimal(10) }];

      repository.findActivePrizes.mockResolvedValue(prizes);

      jest.spyOn(Math, 'random').mockReturnValue(0.99);
      const result = await service.drawPrize();
      expect(result.id).toBe(1);
    });
  });

  describe('getDisplayPrizes', () => {
    it('should return prizes list', async () => {
      const prizes = [{ id: 1, name: 'Prize A' }];
      repository.findActivePrizes.mockResolvedValue(prizes);
      const result = await service.getDisplayPrizes();
      expect(result).toEqual(prizes);
    });
  });
});
