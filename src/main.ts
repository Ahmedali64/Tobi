import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');

  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  await app.listen(PORT);
}
void bootstrap();
