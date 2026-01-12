import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SessionsRepository } from '../src/src/sessions/sessions.repository';
import { UsersService } from '../src/src/users/users.service';
import { QrtokenService } from '../src/src/qrtoken/qrtoken.service';
import { PrizesService } from '../src/src/prizes/prizes.service';
import { SessionsService } from '../src/src/sessions/sessions.service';

const mockSessionsRepo = {
  createSession: jest.fn(),
  findByUserAndTokenIds: jest.fn(),
  findById: jest.fn(),
  bindPrizeToSession: jest.fn(),
};
const mockUsersService = { findUserById: jest.fn() };
const mockQrService = { findQrTokenByCode: jest.fn() };
const mockPrizesService = { findByid: jest.fn() };

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: SessionsRepository, useValue: mockSessionsRepo },
        { provide: UsersService, useValue: mockUsersService },
        { provide: QrtokenService, useValue: mockQrService },
        { provide: PrizesService, useValue: mockPrizesService },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should throw if user or token not found', async () => {
      mockUsersService.findUserById.mockResolvedValue(null);
      await expect(
        service.createSession({ userId: '1', qrTokenCode: 'code' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create session if validation passes', async () => {
      mockUsersService.findUserById.mockResolvedValue({ id: 'u1' });
      mockQrService.findQrTokenByCode.mockResolvedValue({ id: 't1' });

      const expectedSession = { id: 's1' };
      mockSessionsRepo.createSession.mockResolvedValue(expectedSession);

      const result = await service.createSession({
        userId: 'u1',
        qrTokenCode: 'code',
      });
      expect(result).toBe(expectedSession);
      expect(mockSessionsRepo.createSession).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'u1', tokenId: 't1' }),
      );
    });
  });

  describe('assignPrizeToSession', () => {
    it('should throw if prize does not exist', async () => {
      mockPrizesService.findByid.mockResolvedValue(null);
      await expect(service.assignPrizeToSession('s1', 1)).rejects.toThrow(
        'prize does not exist',
      );
    });

    it('should throw if session already spun', async () => {
      mockPrizesService.findByid.mockResolvedValue({ id: 1 });
      mockSessionsRepo.findById.mockResolvedValue({ id: 's1', hasSpun: true });

      await expect(service.assignPrizeToSession('s1', 1)).rejects.toThrow(
        /already spun/,
      );
    });

    it('should bind prize if all valid', async () => {
      mockPrizesService.findByid.mockResolvedValue({ id: 1 });
      mockSessionsRepo.findById.mockResolvedValue({ id: 's1', hasSpun: false });
      mockSessionsRepo.bindPrizeToSession.mockResolvedValue({
        id: 's1',
        wonPrizeId: 1,
      });

      const result = await service.assignPrizeToSession('s1', 1);
      expect(result.wonPrizeId).toBe(1);
    });
  });
});
