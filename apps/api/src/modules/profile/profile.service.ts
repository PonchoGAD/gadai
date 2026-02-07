import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FeatureService } from '../../features/feature.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private features: FeatureService
  ) {}

  /* ===================== BUILD PROFILE ===================== */

  async buildProfile(userId: string, input: any) {
    const factsRes = await axios.post(
      `${process.env.CALC_SERVICE_URL}/calc/profile`,
      input
    );

    const aiRes = await axios.post(
      `${process.env.AI_SERVICE_URL}/ai/interpret`,
      {
        profile: factsRes.data,
        goal: input.goal
      }
    );

    return this.prisma.profile.create({
      data: {
        userId,
        rawInput: input,
        facts: factsRes.data,
        interpretation: aiRes.data,
        tierUsed: input?.tierUsed ?? 'free'
      }
    });
  }

  /* ===================== HISTORY ===================== */

  async getAll(userId: string) {
    return this.prisma.profile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /* ===================== LAST PROFILE ===================== */

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new NotFoundException('User not found');

    const profile = await this.prisma.profile.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!profile) throw new NotFoundException('Profile not found');

    const interpretation =
      typeof profile.interpretation === 'string'
        ? JSON.parse(profile.interpretation)
        : profile.interpretation;

    const canDeep = this.features.canDeepAnalysis(user as any);

    return {
      data: {
        facts: profile.facts,
        interpretation: canDeep
          ? interpretation
          : {
              summary: interpretation?.summary ?? 'Краткий разбор',
              note: 'Полный разбор доступен в расширенной версии'
            }
      },
      paywall: canDeep
        ? { show: false }
        : {
            show: true,
            reason: 'deep_analysis_locked',
            plans: ['pro', 'premium']
          }
    };
  }
}
