import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [ 
    UserModule, // Imports UserModule for user-related functionality
    PassportModule, // Imports PassportModule for authentication
    JwtModule.register({
      secret: 'secretKey', // TODO: Move this to an environment variable for security
      signOptions: { expiresIn: '60m' }, // Sets JWT expiration time to 60 minutes
    }),
    TypeOrmModule.forFeature([User]), // Imports User entity for database operations
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy], // Provides authentication-related services and strategies
  controllers: [AuthController], // Registers the AuthController
  exports: [AuthService], // Exports AuthService to be used in other modules
})
export class AuthModule {}