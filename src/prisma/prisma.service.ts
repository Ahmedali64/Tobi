import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const dbHost = configService.getOrThrow<string>('DB_HOST');
    const dbPort = configService.getOrThrow<number>('DB_PORT');
    const dbUser = configService.getOrThrow<string>('DB_USER');
    const dbName = configService.getOrThrow<string>('DB_NAME');
    const dbConnections = configService.getOrThrow<number>('DB_CONNECTION');
    const dbPassword = configService.getOrThrow<string>('DB_USER_PASSWORD');

    /*
      This adapter introduced in prisma 7
      It gives you a connection obj that prisma client can interact with the database through it
      So we have to make adapter which is a connection obj and send it to the client 
    */
    const adapter = new PrismaMariaDb({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      connectionLimit: dbConnections,
    });
    super({
      adapter,
      log: ['error', 'info', 'warn'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      const dbConnections =
        this.configService.getOrThrow<number>('DB_CONNECTION');

      this.logger.log(
        `Database connected successfully, with a pool of: ${dbConnections} connections`,
      );
    } catch (error) {
      this.logger.error(`Database connection failed`);
      throw error;
    }
  }
  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log(`Database disconnected successfully`);
    } catch (error) {
      this.logger.error(`Database disconnection failed`);
      throw error;
    }
  }
}
