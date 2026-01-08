import pino, { StreamEntry, DestinationStream, Level } from 'pino';
import { Params } from 'nestjs-pino';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const isProduction = process.env.NODE_ENV === 'production';

const logsDir = join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

const streams: StreamEntry[] = [
  ...(isProduction
    ? []
    : [
        {
          level: 'debug' as Level,
          stream: pino.transport({
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }) as DestinationStream,
        },
      ]),
  // All logs
  {
    level: 'info' as Level,
    stream: pino.transport({
      target: 'pino-roll',
      options: {
        file: join(logsDir, 'combined.log'),
        frequency: 'daily',
        size: '10m',
        mkdir: true,
        limit: {
          count: 7,
        },
      },
    }) as DestinationStream,
  },
  // Errors only
  {
    level: 'error' as Level,
    stream: pino.transport({
      target: 'pino-roll',
      options: {
        file: join(logsDir, 'error.log'),
        frequency: 'daily',
        size: '10m',
        mkdir: true,
        limit: {
          count: 7,
        },
      },
    }) as DestinationStream,
  },
];

export const pinoConfig: Params = {
  pinoHttp: {
    autoLogging: false,
    stream: pino.multistream(streams),
    /*
      Why did we do this ?
      - Because Pino will attach these objects whenever we call its logger, and I don’t want that noise
      - So I set them to undefined and handle everything myself in the exception filter
    */
    serializers: {
      err: () => undefined,
      req: () => undefined,
      res: () => undefined,
    },
  },
};
