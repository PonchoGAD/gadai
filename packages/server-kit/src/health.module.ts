import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController]
})
export class HealthModule {}
