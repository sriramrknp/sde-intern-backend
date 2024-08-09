import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

// Main function to bootstrap the NestJS application
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Create a new NestJS application instance
    const app = await NestFactory.create(AppModule);

    // Apply ValidationPipe globally to automatically validate incoming requests
    app.useGlobalPipes(new ValidationPipe());

    // Start the application and listen on port 3000
    const port = 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error(`Error starting the application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

// Execute the bootstrap function to start the application
bootstrap();