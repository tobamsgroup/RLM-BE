import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeProduct } from './schemas/stripeProduct.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrganisationService } from 'src/organisation/organisation.service';
import {
  CreateBillingAddressDto,
  CreatePaymentMethodDto,
} from 'src/organisation/organisation.dto';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { ORGANISATION_SUBSCRIPTION_DATA } from 'src/common/constant';
import { SubscriptionStatus } from 'src/common/enum';

const relevantSubscriptionEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(StripeProduct.name)
    private stripeProductModel: Model<StripeProduct>,
    private organisationService: OrganisationService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_API_KEY')!, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async getStripeProducts() {
    try {
      const products = await this.stripeProductModel.find();
      this.logger.log('Products fetched successfully');
      return products;
    } catch (error) {
      this.logger.error('Failed to fetch products', error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSubscription(
    organisationId: string,
    priceId: string,
    paymentMethodId: string,
  ) {
    try {
      let stripeCustomerId = (
        await this.organisationService.getOrganisation(organisationId)
      )?.stripeCustomerId;
      if (!stripeCustomerId) {
        stripeCustomerId = await this.createCustomer(organisationId);
      }

      const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);

      if (paymentMethod.customer !== stripeCustomerId) {
        this.attachPaymentMethod(stripeCustomerId, paymentMethodId)
      }
      const subscription = await this.stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
      });

      const stripeProduct = await this.stripeProductModel.findOne({
        stripePriceId: priceId,
      });
      const targetPlan = ORGANISATION_SUBSCRIPTION_DATA?.find(
        (i) => i.name === stripeProduct?.name,
      )!;
      const subscriptionDetails = {
        frequency: targetPlan?.frequency,
        startDate: new Date(subscription.start_date * 1000)!,
        paymentSubscriptionId: subscription?.id,
        organisation: organisationId,
        status: SubscriptionStatus.ACTIVE,
        nextBillingDate: new Date(subscription.current_period_end * 1000),
        name: targetPlan.name,
      };
     const data = await this.subscriptionService.saveSubscription(subscriptionDetails);

      // TODO: send successful email
      return data
    } catch (error) {
      this.logger.error('Failed to create subscription', error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createCustomer(id: string) {
    try {
      const targetOrganisation =
        await this.organisationService.getOrganisation(id);
      if (!targetOrganisation?.stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          email: targetOrganisation.email,
          name:
            targetOrganisation.firstName + ' ' + targetOrganisation.lastName,
        });
        await this.organisationService.saveStripeCustomerId(id, customer.id);
        return customer.id;
      }
      return targetOrganisation.stripeCustomerId;
    } catch (error) {
      this.logger.error('Failed to create customer', error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSubscriptionProduct(
    name: string,
    price: number,
    frequency: 'year' | 'month',
  ): Promise<Stripe.Product> {
    try {
      const description = `Subscription for Recycled Learning ${name} Plan`;
      const product = await this.stripe.products.create({ name, description });
      const stripeprice = await this.stripe.prices.create({
        product: product.id,
        unit_amount: price * 100,
        currency: 'usd',
        recurring: { interval: frequency },
      });

      await this.stripeProductModel.create({
        name,
        stripePriceId: stripeprice.id,
        stripeProductId: product.id,
        price,
      });

      return product;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      this.logger.log(
        `Refund processed successfully for PaymentIntent: ${paymentIntentId}`,
      );
      return refund;
    } catch (error) {
      this.logger.error('Failed to process refund', error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addCardPaymentMethod(
    organisationId: string,
    paymentMethodDto: CreatePaymentMethodDto,
  ) {
    try {
      const targetOrganisation =
        await this.organisationService.getOrganisation(organisationId);

      if (!targetOrganisation) {
        throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
      }

      let stripeCustomerId = targetOrganisation?.stripeCustomerId;
      if (!targetOrganisation.stripeCustomerId) {
        stripeCustomerId = await this.createCustomer(organisationId);
      }

      await this.attachPaymentMethod(
        stripeCustomerId,
        paymentMethodDto.paymentMethodId!,
      );

      await this.organisationService.addPaymentMethod(
        organisationId,
        paymentMethodDto,
      );
    } catch (error) {
      this.logger.error('Failed to attach payment method', error.stack);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCardPaymentMethod(organisationId: string, id: string) {
    try {
      const targetOrganisation =
        await this.organisationService.getOrganisation(organisationId);

      if (!targetOrganisation) {
        throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log({ targetOrganisation });

      const targetPaymentMethod = targetOrganisation?.paymentMethods?.find(
        (p) => p.id === id,
      );
      this.logger.log({ targetOrganisation, id, targetPaymentMethod });

      if (!targetPaymentMethod) {
        throw new HttpException(
          'Payment Method not found',
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log({ targetPaymentMethod });

      if (
        !targetPaymentMethod.paymentMethodId &&
        targetPaymentMethod.provider === 'stripe'
      ) {
        await this.stripe.paymentMethods.detach(
          targetPaymentMethod.paymentMethodId!,
        );
      }

      await this.organisationService.deletePaymentMethod(
        organisationId,
        targetPaymentMethod.id,
      );
    } catch (error) {
      this.logger.error('Failed to attach payment method', error.stack);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<void> {
    try {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      this.logger.log(
        `Payment method ${paymentMethodId} attached to customer ${customerId}`,
      );
    } catch (error) {
      this.logger.error('Failed to attach payment method', error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPaymentLink(priceId: string): Promise<Stripe.PaymentLink> {
    try {
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: 1 }],
      });
      this.logger.log('Payment link created successfully');
      return paymentLink;
    } catch (error) {
      this.logger.error('Failed to create payment link', error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async manageWebhook(req: Request) {
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET')!;

    try {
      if (!sig || !webhookSecret) {
        throw new Error();
      }
      event = this.stripe.webhooks.constructEvent(
        req.body as any,
        sig,
        webhookSecret,
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed.', err.message);
      throw new HttpException(
        'Webhook signature verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (relevantSubscriptionEvents.has(event.type)) {
      try {
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            await this.manageSubscriptionStatusChange(
              subscription.id,
              subscription.customer as string,
              event.type === 'customer.subscription.created',
            );
            break;
          case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.mode === 'subscription') {
              const subscriptionId = session.subscription as string;
              await this.manageSubscriptionStatusChange(
                subscriptionId,
                session.customer as string,
                true,
              );
            }
            break;
          default:
            console.warn(`Unhandled event type: ${event.type}`);
        }
      } catch (error) {
        console.error('Error handling event', error);
        return new Response('Webhook Error', { status: 400 });
      }

      return new Response('Webhook received', { status: 200 });
    }
  }

  async manageSubscriptionStatusChange(
    subscriptionId: string,
    customerId: string,
    createAction?: boolean,
  ) {
    const organisation = await this.organisationService.findOne({
      stripeCustomerId: customerId,
    });

    if (!organisation) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }

    const subscription = await this.stripe.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ['default_payment_method'],
      },
    );

    const priceData = subscription.items.data[0].price;
    const price = await this.stripeProductModel.findOne({
      stripePriceId: priceData.id,
    });

    if (!price) {
      throw new HttpException(
        `Price with ID ${priceData.id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    const targetPlan = ORGANISATION_SUBSCRIPTION_DATA?.find(
      (i) => i.name === price?.name,
    )!;

    const subscriptionDetails = {
      frequency: targetPlan?.frequency,
      startDate: new Date(subscription.start_date * 1000)!,
      paymentSubscriptionId: subscriptionId,
      organisation: organisation?._id,
      status: this.getNewStatus(subscription.status),
      nextBillingDate: new Date(subscription.current_period_end * 1000),
      currentPeriodStartDate: new Date(subscription.current_period_end * 1000),
      name: price.name,
      endDate: subscription.ended_at
        ? new Date(subscription.ended_at * 1000)
        : null,
    };


    await this.subscriptionService.saveSubscription(subscriptionDetails);
  }

  async pauseSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.update(subscriptionId, {
      pause_collection: { behavior: 'void' },
    });
  }
  async resumeSubscription(subscriptionId: string) {
    await this.stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
    });
  }

  async cancelSubscription(id: string, reason?: string) {
    const subscription = await this.subscriptionService.findOne({ _id: id });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.stripe.subscriptions.update(
      subscription.paymentSubscriptionId!,
      {
        cancel_at_period_end: true,
      },
    );

    await this.subscriptionService.updateSubscriptionStatus(
      id,
      SubscriptionStatus.CANCELED,
      reason,
    );
  }

  getNewStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    const statusMap = {
      canceled: SubscriptionStatus.CANCELED,
      active: SubscriptionStatus.ACTIVE,
      paused: SubscriptionStatus.PAUSED,
      past_due: SubscriptionStatus.EXPIRED,
    };

    return statusMap[status] || SubscriptionStatus.INCOMPLETE;
  }
}
