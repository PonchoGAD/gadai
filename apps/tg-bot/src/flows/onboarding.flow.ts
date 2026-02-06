export async function onboardingFlow(ctx: any) {
  await ctx.reply(
    'Привет. Я помогу разобраться в твоих сильных сторонах и направлениях.\n\nНапиши дату рождения (ГГГГ-ММ-ДД)'
  );
}
