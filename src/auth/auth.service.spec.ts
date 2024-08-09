import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = { id: 1, username: 'testuser', password: 'testpass' };
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(user);

      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toEqual({ id: 1, username: 'testuser' });
    });

    it('should return null when credentials are invalid', async () => {
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(null);

      const result = await authService.validateUser('testuser', 'wrongpass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const user = { id: 1, username: 'testuser' };
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'test-token' });
    });
  });

  describe('register', () => {
    it('should return user object when registration is successful', async () => {
      const user = { username: 'newuser', password: 'newpass' };
      jest.spyOn(userService, 'create').mockResolvedValue({ id: 2, ...user });

      const result = await authService.register(user);
      expect(result).toEqual({ id: 2, username: 'newuser', password: 'newpass' });
    });
  });
});