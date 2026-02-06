import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { loadMasterPrompt } from './prompt.loader';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  async interpret(profile: any, goal?: string) {
    const system = loadMasterPrompt();

    const res = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: JSON.stringify({ profile, goal })
        }
      ]
    });

    return {
      text: res.choices[0].message.content
    };
  }

  async dialogue(input: {
    userId: string;
    message: string;
    memoryDepth: number;
  }) {
    const memory = input.memoryDepth
      ? await this.loadMemory(input.userId, input.memoryDepth)
      : [];

    const system = loadMasterPrompt();

    const res = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: [
        { role: 'system', content: system },
        ...memory,
        { role: 'user', content: input.message }
      ]
    });

    const answer = res.choices[0].message.content || '';

    await this.saveMessage(input.userId, 'user', input.message);
    await this.saveMessage(input.userId, 'assistant', answer);

    return {
      answer,
      note: 'Ответ — интерпретация, не руководство к действию'
    };
  }

  private async loadMemory(userId: string, depth: number) {
    // TODO: Implement memory loading
    return [];
  }

  private async saveMessage(userId: string, role: 'user' | 'assistant', content: string) {
    // TODO: Implement message saving
  }
}
