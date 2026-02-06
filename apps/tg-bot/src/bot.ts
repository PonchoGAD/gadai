import { Telegraf } from 'telegraf';
import { onboardingFlow } from './flows/onboarding.flow';
import { dialogueFlow } from './flows/dialogue.flow';

export function startBot() {
  const bot = new Telegraf(process.env.TG_BOT_TOKEN!);

  bot.start(onboardingFlow);
  bot.on('text', dialogueFlow);

  bot.launch();
}
