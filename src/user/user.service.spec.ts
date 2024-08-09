import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const user = { username: 'testuser', password: 'testpass' };
      jest.spyOn(userRepository, 'save').mockResolvedValue({ id: 1, ...user });

      const result = await userService.create(user as User);
      expect(result).toEqual({ id: 1, ...user });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, username: 'user1', password: 'pass1' },
        { id: 2, username: 'user2', password: 'pass2' },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await userService.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'testuser', password: 'testpass' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateResult = { affected: 1 };
      jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult as any);

      await expect(userService.update(1, { username: 'updateduser' } as User)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      const updateResult = { affected: 0 };
      jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult as any);

      await expect(userService.update(1, { username: 'updateduser' } as User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const deleteResult = { affected: 1 };
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult as any);

      await expect(userService.remove(1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if user to remove is not found', async () => {
      const deleteResult = { affected: 0 };
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult as any);

      await expect(userService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});