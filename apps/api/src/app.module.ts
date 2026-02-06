import { Module } from '@nestjs/common';
import { ProfileController } from './modules/profile/profile.controller';
import { ProfileService } from './modules/profile/profile.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, JwtStrategy]
})
export class AppModule {}
