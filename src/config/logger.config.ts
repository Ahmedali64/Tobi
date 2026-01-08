import pino, { StreamEntry, DestinationStream, Level } from 'pino';
import { Params } from 'nestjs-pino';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { Request, Response } from 'express';

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
];

export const pinoConfig: Params = {
  pinoHttp: {
    level: isProduction ? 'info' : 'debug',
    stream: pino.multistream(streams),
    serializers: {
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: isProduction ? undefined : req.headers, // Just to see the cookies header
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
      err: pino.stdSerializers.err,
    },
  },
};
