import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class StripeController {
  constructor(private stripe: StripeService) {}

  @Post('checkout')
  create(@Body() body: { userId: string; priceId: string }) {
    return this.stripe.createCheckoutSession(
      body.userId,
      body.priceId
    );
  }
}
