import { Controller, Post, Body, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { AI_LIMITS } from './ai.limits';

@Controller('ai')
export class AiDialogueController {
  @UseGuards(JwtAuthGuard)
  @Post('dialogue')
  async talk(@Req() req: any, @Body() body: { message: string }) {
    const user = req.user;
    const plan = (user.plan || 'free') as keyof typeof AI_LIMITS;
    const limits = AI_LIMITS[plan];

    // 👉 здесь считаем usage (упрощённо)
    if (user.dailyMessages >= limits.messagesPerDay) {
      throw new ForbiddenException({
        reason: 'ai_limit_reached',
        upgrade: true
      });
    }

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/ai/dialogue`,
      {
        userId: user.userId,
        message: body.message,
        memoryDepth: limits.memoryDepth
      }
    );

    return response.data;
  }
}
