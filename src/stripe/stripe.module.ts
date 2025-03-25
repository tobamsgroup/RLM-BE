import { Global, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { StripeProduct, StripeProductSchema } from './schemas/stripeProduct.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeCustomer, StripeCustomerSchema } from './schemas/stripeCustomers.schema';
import { OrganisationModule } from 'src/organisation/organisation.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

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
    SubscriptionModule
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
