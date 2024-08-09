import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract JWT from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Don't ignore token expiration
      ignoreExpiration: false,
      // Secret key used to sign the token
      secretOrKey: 'secretKey', // TODO: Move this to environment variables
    });
  }

  // Validate and decode the JWT payload
  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub || !payload.username) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Return user information from the decoded token
    return { userId: payload.sub, username: payload.username };
  }
}