import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Validates user credentials
  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.userService.findOneByUsername(username);
      console.log('Login validate:', user);
      if (user && pass === user.password) {
        // Remove password from the returned user object
        const { password, ...result } = user;
        return result;
      }
      return null;  // This is the correct way to return null in TypeScript/JavaScript
    } catch (error) {
      throw new Error(`Error validating user: ${error.message}`);
    }
  }

  // Generates JWT token for authenticated user
  async login(user: any) {
    try {
      const payload: JwtPayload = { username: user.username, sub: user.userId };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new Error(`Error generating JWT token: ${error.message}`);
    }
  }

  // Registers a new user
  async register(user: any) {
    try {
      return await this.userService.create(user);
    } catch (error) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  } 
}