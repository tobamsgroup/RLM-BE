import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { StripeProduct, StripeProductSchema } from './schemas/stripeProduct.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeCustomer, StripeCustomerSchema } from './schemas/stripeCustomers.schema';
import { OrganisationModule } from 'src/organisation/organisation.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StripeProduct.name,
        schema: StripeProductSchema,
      },
      {
        name:StripeCustomer.name,
        schema:StripeCustomerSchema
      }
    ]),
    SubscriptionModule,
    InvoiceModule
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})

export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganisationMiddleware).forRoutes(StripeController);
  }
}