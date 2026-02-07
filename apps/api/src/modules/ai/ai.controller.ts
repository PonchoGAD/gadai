import { Controller, Post, Body, Req, UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { AI_LIMITS } from './ai.limits';
import { FeatureService } from '../../features/feature.service';

@Controller('ai')
export class AiController {
  constructor(private features: FeatureService) {}

  @UseGuards(JwtAuthGuard)
  @Post('dialogue')
  async dialogue(@Req() req: any, @Body() body: { message?: string } = {}) {
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    // If user's plan disallows deep analysis, return paywall response
    if (!this.features.canUseDeepAnalysis(user.plan)) {
      return {
        data: { message: 'Базовый ответ без углубления' },
        paywall: { show: true, reason: 'ai_dialogue_locked', plans: ['pro', 'premium'] }
      };
    }

    const plan = (user.plan || 'free') as keyof typeof AI_LIMITS;
    const limits = AI_LIMITS[plan];

    // simple usage check
    if ((user.dailyMessages ?? 0) >= limits.messagesPerDay) {
      throw new ForbiddenException({ reason: 'ai_limit_reached', upgrade: true });
    }

    const response = await axios.post(`${process.env.AI_SERVICE_URL}/ai/dialogue`, {
      userId: user.userId,
      message: body.message,
      memoryDepth: limits.memoryDepth
    });

    return response.data;
  }
}
