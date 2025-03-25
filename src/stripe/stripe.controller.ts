import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { CreatePaymentMethodDto } from 'src/organisation/organisation.dto';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('products')
  async getProducts() {
    return this.stripeService.getStripeProducts();
  }


  @Post('webhook')
  async webhook(@Req() req:Request ) {
    return this.stripeService.manageWebhook(req);
  }


  @Post('subscriptions')
  @UseGuards(AuthenticationGuard)
  async createSubscription(
    @Body() body: { priceId: string; paymentMethodId: string },
    @Req() req: Request,
  ) {
    const { priceId, paymentMethodId } = body;
    return this.stripeService.createSubscription(req["organisationId"], priceId, paymentMethodId);
  }

  @Post('customers')
  async createCustomer(@Body() { id }) {
    return this.stripeService.createCustomer(id);
  }

  @Post('products')
  async createProduct(
    @Body() body: { name: string; frequency: "month"|"year", price: number },
  ) {
    return this.stripeService.createSubscriptionProduct(body.name, body.price, body.frequency);
  }

  @Post('refunds')
  async refundPayment(@Body() body: { paymentIntentId: string }) {
    return this.stripeService.refundPayment(body.paymentIntentId);
  }

  @Post('payment-links')
  async createPaymentLink(@Body() body: { priceId: string }) {
    return this.stripeService.createPaymentLink(body.priceId);
  }



  @Post('add-payment-method')
  @UseGuards(AuthenticationGuard)
  async addPaymentMethod(
    @Body() paymentMethodDto: CreatePaymentMethodDto,
    @Req() req: Request,
  ) {
    return this.stripeService.addCardPaymentMethod(
     req["organisationId"],
      paymentMethodDto,
    );
  }

  @Get('subscription/pause/:id')
  pauseSubscription(@Param() {id}){
     return this.stripeService.pauseSubscription(id)
  }

  @Get('subscription/resume/:id')
  resumeSubscription(@Param() {id}){
     return this.stripeService.resumeSubscription(id)
  }

  @UseGuards(AuthenticationGuard)
  @Delete('delete-payment-method/:paymentMethodId')
  async deletePaymentMethod(
    @Param('paymentMethodId') paymentMethodId:string,
    @Req() req: Request,
  ) {
    return this.stripeService.deleteCardPaymentMethod(
      req["organisationId"],
      paymentMethodId
    );
  }
}
