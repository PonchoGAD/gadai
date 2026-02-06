import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

export class PaidGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const plan = req.user?.plan || 'free';

    if (plan === 'free') {
      throw new ForbiddenException('Upgrade required');
    }
    return true;
  }
}
