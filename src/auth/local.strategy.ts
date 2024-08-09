import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('Login username:', username, password);
    try {
      const user = await this.authService.validateUser(username, password);
      console.log('Login username:', user);
      if (user === null) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Log the error for debugging purposes
      console.error('Error in LocalStrategy.validate:', error);
      throw new UnauthorizedException('An error occurred during authentication');
    }
  }
}