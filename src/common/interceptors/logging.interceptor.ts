import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const start = Date.now();
    this.logger.log(
      `[Received] ${req.method} ${req.url} at ${new Date().toISOString()}`,
    );

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `[Responded] Successfully in ${Date.now() - start}ms`,
          ),
        ),
      );
  }
}
