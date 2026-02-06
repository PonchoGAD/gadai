import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RefreshInterceptor implements NestInterceptor {
  async intercept(
    _context: ExecutionContext,
    next: CallHandler
  ) {
    try {
      return await lastValueFrom(next.handle());
    } catch (e: any) {
      if (e?.status === 401) {
        throw {
          error: 'access_expired',
          refresh: true
        };
      }
      throw e;
    }
  }
}
