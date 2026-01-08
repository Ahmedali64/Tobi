import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { CatchEverythingFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const PORT = configService.getOrThrow<number>('PORT');

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  app.enableShutdownHooks();
  await app.listen(PORT);
}
void bootstrap();
