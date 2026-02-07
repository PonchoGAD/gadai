import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import axios from 'axios';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { FeatureService } from '../../features/feature.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('ai')
export class AiController {
  constructor(
    private features: FeatureService,
    private prisma: PrismaService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('dialogue')
  async dialogue(
    @Req() req: any,
    @Body() body: { message?: string } = {}
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const used = await this.prisma.aiUsage.count({
      where: { userId: user.id }
    });

    const limit = this.features.aiMessageLimit(user);

    if (used >= limit) {
      return {
        message: 'Лимит диалога исчерпан',
        paywall: this.features.getAiLimitPaywall()
      };
    }

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/ai/dialogue`,
      {
        userId: user.id,
        message: body.message
      }
    );

    // 🔢 usage counter
    await this.prisma.aiUsage.create({
      data: {
        userId: user.id,
        date: new Date(),
        messages: 1
      }
    });

    return {
      data: response.data,
      paywall: { show: false }
    };
  }
}
