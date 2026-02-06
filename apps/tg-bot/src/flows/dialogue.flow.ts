import { aiDialogue } from '../api.client';

export async function dialogueFlow(ctx: any) {
  const token = ctx.session?.token;
  if (!token) return;

  const res = await aiDialogue(token, ctx.message.text);

  if (res.upgrade) {
    return ctx.reply(
      'Хочешь продолжить глубже и практичнее?\nДоступно в расширенном режиме.'
    );
  }

  return ctx.reply(res.answer);
}
