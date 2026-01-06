import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    const dbHost = configService.getOrThrow<string>('DB_HOST');
    const dbPort = configService.getOrThrow<number>('DB_PORT');
    const dbUser = configService.getOrThrow<string>('DB_USER');
    const dbName = configService.getOrThrow<string>('DB_NAME');
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
      connectionLimit: 12,
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
      console.log('Database connected successfully');
    } catch (error) {
      console.log('Database connection failed');
      throw error;
    }
  }
  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('Database disconnected successfully');
    } catch (error) {
      console.log('Database disconnection failed');
      throw error;
    }
  }
}
