import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { CreatePaymentMethodDto } from 'src/organisation/organisation.dto';
import { ActivityLogsService } from 'src/activityLogs/activityLogs.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { formatDateShort } from 'utils/formatDate';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private activityLogService: ActivityLogsService,
    private invoiceService: InvoiceService,
  ) {}

  @Get('products')
  async getProducts() {
    return this.stripeService.getStripeProducts();
  }

  @Post('webhook')
  async webhook(@Req() req: Request) {
    return this.stripeService.manageWebhook(req);
  }

  @Post('subscriptions')
  @UseGuards(AuthenticationGuard)
  async createSubscription(
    @Body() body: { priceId: string; paymentMethodId: string },
    @Req() req: Request,
  ) {
    const { priceId, paymentMethodId } = body;
    const details = await this.stripeService.createSubscription(
      req['organisationId'],
      priceId,
      paymentMethodId,
    );
    await this.invoiceService.createInvoice(details?.data!);
    await this.activityLogService.addLog({
      action: `${details?.data?.name} Plan Subscription Successful `,
    });

  }

  @Post('customers')
  async createCustomer(@Body() { id }) {
    return this.stripeService.createCustomer(id);
  }

  @Post('products')
  async createProduct(
    @Body() body: { name: string; frequency: 'month' | 'year'; price: number },
  ) {
    return this.stripeService.createSubscriptionProduct(
      body.name,
      body.price,
      body.frequency,
    );
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
    const resp = this.stripeService.addCardPaymentMethod(
      req['organisationId'],
      paymentMethodDto,
    );
    await this.activityLogService.addLog({
      action: 'New Payment Method Added Successfully',
    });
    return;
  }

  @Get('subscription/pause/:id')
  pauseSubscription(@Param() { id }) {
    return this.stripeService.pauseSubscription(id);
  }

  @Get('subscription/resume/:id')
  resumeSubscription(@Param() { id }) {
    return this.stripeService.resumeSubscription(id);
  }

  @Post('subscription/cancel')
  @UseGuards(AuthenticationGuard)
  cancelSubscription(@Body() { id, reason }) {
    return this.stripeService.cancelSubscription(id, reason);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('delete-payment-method/:paymentMethodId')
  async deletePaymentMethod(
    @Param('paymentMethodId') paymentMethodId: string,
    @Req() req: Request,
  ) {
    return this.stripeService.deleteCardPaymentMethod(
      req['organisationId'],
      paymentMethodId,
    );
  }
}
