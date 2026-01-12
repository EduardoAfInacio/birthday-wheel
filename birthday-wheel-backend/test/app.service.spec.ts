import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';
import { QrtokenService } from '../src/src/qrtoken/qrtoken.service';
import { UsersService } from '../src/src/users/users.service';
import { SessionsService } from '../src/src/sessions/sessions.service';
import { PrizesService } from '../src/src/prizes/prizes.service';
import { AppService } from '../src/src/app/app.service';

const mockQrTokenService = { findQrTokenByCode: jest.fn() };
const mockUsersService = { upsertUser: jest.fn(), findUserById: jest.fn() };
const mockSessionsService = {
  findSessionByUserAndTokenIds: jest.fn(),
  createSessionFromParticipateFlow: jest.fn(),
  updateSessionAfterSpin: jest.fn(),
};
const mockPrizesService = {
  getDisplayPrizes: jest.fn(),
  drawPrize: jest.fn(),
};
const mockQueue = { add: jest.fn() };

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: QrtokenService, useValue: mockQrTokenService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: SessionsService, useValue: mockSessionsService },
        { provide: PrizesService, useValue: mockPrizesService },
        { provide: getQueueToken('email-queue'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    jest.clearAllMocks();
  });

  describe('startFlow', () => {
    const mockData = {
      name: 'John',
      email: 'john@test.com',
      phone: '1234567890',
      store: 'Store A',
      qrTokenCode: 'VALID_CODE',
    };

    it('should throw BadRequest if QR Token is invalid', async () => {
      mockQrTokenService.findQrTokenByCode.mockResolvedValue(null);

      await expect(service.startFlow(mockData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return existing session if found', async () => {
      const mockQr = { id: 'qr-1' };
      const mockUser = { id: 'user-1' };
      const mockSession = { id: 'session-1', prize: null };

      mockQrTokenService.findQrTokenByCode.mockResolvedValue(mockQr);
      mockUsersService.upsertUser.mockResolvedValue(mockUser);
      mockSessionsService.findSessionByUserAndTokenIds.mockResolvedValue(
        mockSession,
      );

      const result = await service.startFlow(mockData);

      expect(result.sessionId).toBe('session-1');
      expect(
        mockSessionsService.createSessionFromParticipateFlow,
      ).not.toHaveBeenCalled();
    });

    it('should create a new session if none exists', async () => {
      const mockQr = { id: 'qr-1' };
      const mockUser = { id: 'user-1' };
      const newSession = { id: 'new-session', prize: null };

      mockQrTokenService.findQrTokenByCode.mockResolvedValue(mockQr);
      mockUsersService.upsertUser.mockResolvedValue(mockUser);
      mockSessionsService.findSessionByUserAndTokenIds.mockResolvedValue(null);
      mockSessionsService.createSessionFromParticipateFlow.mockResolvedValue(
        newSession,
      );

      const result = await service.startFlow(mockData);

      expect(result.sessionId).toBe('new-session');
      expect(
        mockSessionsService.createSessionFromParticipateFlow,
      ).toHaveBeenCalled();
    });
  });

  describe('executeSpin', () => {
    const spinData = { userId: 'user-1', qrTokenCode: 'CODE' };
    const mockQr = { id: 'qr-1', isActive: true };
    const mockSession = { id: 'session-1', hasSpun: false };
    const mockPrize = { id: 1, name: 'Prize A', description: 'Desc' };
    const mockUser = { id: 'user-1', email: 'john@test.com', name: 'John' };

    it('should succeed, draw prize, update session and queue email', async () => {
      mockQrTokenService.findQrTokenByCode.mockResolvedValue(mockQr);
      mockSessionsService.findSessionByUserAndTokenIds.mockResolvedValue(
        mockSession,
      );
      mockPrizesService.getDisplayPrizes.mockResolvedValue([mockPrize]);
      mockPrizesService.drawPrize.mockResolvedValue(mockPrize);
      mockUsersService.findUserById.mockResolvedValue(mockUser);

      const result = await service.executeSpin(spinData);

      expect(result.success).toBe(true);
      expect(result.wonPrize).toEqual(mockPrize);

      expect(mockSessionsService.updateSessionAfterSpin).toHaveBeenCalledWith(
        'session-1',
        expect.objectContaining({ hasSpun: true, wonPrizeId: 1 }),
      );

      expect(mockQueue.add).toHaveBeenCalledWith(
        'send-prize-email',
        expect.objectContaining({
          user: { name: 'John', email: 'john@test.com' },
          prize: expect.objectContaining({ id: 1 }),
        }),
        expect.any(Object),
      );
    });

    it('should throw if session already spun', async () => {
      mockQrTokenService.findQrTokenByCode.mockResolvedValue(mockQr);
      mockSessionsService.findSessionByUserAndTokenIds.mockResolvedValue({
        ...mockSession,
        hasSpun: true,
      });

      await expect(service.executeSpin(spinData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
