import { Controller, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16'
  });

  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Req() req: any) {
    const sig = req.headers['stripe-signature'];

    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session: any = event.data.object;

      const existing = await this.prisma.subscription.findFirst({
        where: { userId: session.metadata.userId }
      });

      if (existing) {
        await this.prisma.subscription.update({
          where: { id: existing.id },
          data: {
            plan: 'pro',
            status: 'active',
            providerRef: session.subscription,
            validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      } else {
        await this.prisma.subscription.create({
          data: {
            userId: session.metadata.userId,
            plan: 'pro',
            status: 'active',
            provider: 'stripe',
            providerRef: session.subscription,
            validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }

    return { received: true };
  }
}
