import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchEverythingFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const path = httpAdapter.getRequestUrl(req) as string;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'string' ? response : JSON.stringify(response);
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: path,
      message,
    };

    this.logger.error(
      `\n Method: ${req.method}\n URL_Path: ${path}\n Status_Code: ${httpStatus}\n Message: ${message}\n Stack: ${stack}`,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
