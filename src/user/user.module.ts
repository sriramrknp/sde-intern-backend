import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

@Module({
  // Import TypeOrmModule for the User entity to enable database operations
  imports: [TypeOrmModule.forFeature([User])],
  // Register UserService as a provider in this module
  providers: [UserService],
  // Register UserController to handle HTTP requests related to users
  controllers: [UserController], 
  // Export UserService to make it available for other modules
  exports: [UserService],
}) 
export class UserModule {}