import { Controller, Post, Body, Request, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('Login Raw request body:', req.body);
    try {
      if (!req.body) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return await this.authService.login(req.body);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Req() req, @Body() user: RegisterDto) {
    console.log('Raw request body:', req.body);
    console.log('Parsed user object:', user);
    try {
      return await this.authService.register(user);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === '23505') { // Assuming this is the PostgreSQL error code for unique constraint violation
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}