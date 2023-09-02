import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger, WinstonLoggerService } from './helper/winston';
import { setupSwagger } from './swagger';
import { ConfigService } from '@nestjs/config';

import * as packageJson from 'package.json';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: new WinstonLoggerService(),
    });

    app.enableCors();

    const { version } = packageJson;

    const configService = app.get(ConfigService);
    const PORT = configService.get('PORT');
    const isProduction = configService.get<boolean>('isProduction');

    const getVersion = Math.floor(parseInt(version));
    app.setGlobalPrefix(`api/v${getVersion}`);

    app.useGlobalPipes(
      new ValidationPipe({
        validationError: {
          target: false,
        },
      }),
    );

    if (!isProduction) {
      await setupSwagger(app);
    }

    await app.listen(PORT, () => winstonLogger.info(`app running on ${PORT}`));
  } catch (error) {
    winstonLogger.error('Error starting server', error);
  }
}
bootstrap();
