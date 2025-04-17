import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { Subscription, SubscriptionSchema } from './subscription.schemas';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { StripeModule } from 'src/stripe/stripe.module';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    MailModule,
    InvoiceModule
 ],
  controllers:[SubscriptionController],
  providers: [SubscriptionService],
  exports:[SubscriptionService]
})
export class SubscriptionModule  {}
