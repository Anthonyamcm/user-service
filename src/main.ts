import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);

  // Security Middlewares
  app.use(helmet());

  // CORS Configuration
  app.enableCors({
    origin: configService.get<string[]>('cors.origins'),
    optionsSuccessStatus: 200,
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger Setup
  if (configService.get<string>('nodeEnv') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('User Service API')
      .setDescription('API documentation for the User Service')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  // Start the application
  const port = configService.get<number>('port');
  await app.listen(port!);
  logger.info(`User service is running on port ${port}`);
}
bootstrap();
