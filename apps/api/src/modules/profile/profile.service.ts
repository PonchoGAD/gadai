import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

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

    const profile = await this.prisma.profile.create({
      data: {
        userId,
        rawInput: input,
        facts: factsRes.data,
        interpretation: aiRes.data,
        tierUsed: input?.tierUsed ?? 'free'
      }
    });

    return profile;
  }

  async getAll(userId: string) {
    return this.prisma.profile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await this.prisma.profile.findFirst({
      where: { userId }
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    const isFree = user.plan === 'free';

    const interpretation = typeof profile.interpretation === 'string' 
      ? JSON.parse(profile.interpretation) 
      : profile.interpretation;

    return {
      data: {
        facts: profile.facts,
        interpretation: isFree
          ? {
              summary: interpretation?.summary || 'Analysis summary',
              note: 'Часть анализа доступна в полной версии'
            }
          : interpretation
      },
      paywall: isFree
        ? {
            show: true,
            reason: 'deep_analysis_locked',
            message: 'Хочешь глубже и практичнее?',
            plans: ['pro', 'premium']
          }
        : { show: false }
    };
  }
}
