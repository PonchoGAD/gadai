import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}

  @Post('interpret')
  async interpret(@Body() body: any): Promise<{ text: string | null }> {
    return this.ai.interpret(body.profile, body.goal);
  }
}
