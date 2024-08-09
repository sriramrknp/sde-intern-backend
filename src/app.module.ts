import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Main application module
@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    // Configure TypeORM for database connection with error handling
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        try {
          return {
            type: 'postgres',
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD', 'host'),
            database: configService.get('DB_NAME', 'postgres'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('NODE_ENV') !== 'production',
          };
        } catch (error) {
          console.error('Database connection error:', error);
          throw new Error('Failed to connect to the database');
        }
      },
      inject: [ConfigService],
    }),
    UserModule, // Import User module
    AuthModule, // Import Auth module
  ]
})
export class AppModule {}