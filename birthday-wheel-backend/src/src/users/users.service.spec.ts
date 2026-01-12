import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

const mockUsersRepo = {
  upsertByPhone: jest.fn(),
  findByPhone: jest.fn(),
  findById: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should throw NotFoundException if user not found by phone', async () => {
    mockUsersRepo.findByPhone.mockResolvedValue(null);
    await expect(service.findUserByPhone('123')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should upsert user successfully', async () => {
    const userData = { name: 'A', phone: '1', email: 'e', storeName: 's' };
    const expectedUser = { id: 1, ...userData };
    mockUsersRepo.upsertByPhone.mockResolvedValue(expectedUser);

    const result = await service.upsertUser(userData);
    expect(result).toEqual(expectedUser);
  });
});
