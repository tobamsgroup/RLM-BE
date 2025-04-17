import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Subscription } from './subscription.schemas';
import mongoose, { Model, RootFilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSubscriptionDto } from './subscription.dto';
import { OrganisationService } from 'src/organisation/organisation.service';
import { SubscriptionStatus } from 'src/common/enum';
import { StripeService } from 'src/stripe/stripe.service';
import { ActivityLogsService } from 'src/activityLogs/activityLogs.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { ORGANISATION_SUBSCRIPTION_DATA } from 'src/common/constant';
import { formatDateShort } from 'utils/formatDate';

type SubscriptionDetails = {
  frequency: string | undefined;
  startDate: Date;
  paymentSubscriptionId: string;
  organisation: string | Types.ObjectId;
  status: SubscriptionStatus;
  nextBillingDate: Date;
  name: string;
};

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private organisationService: OrganisationService,
    // private activityLogService: ActivityLogsService,
    // private invoiceService: InvoiceService,

    // private stripeService: StripeService
  ) {}

  async saveSubscription(subscriptionPlan: SubscriptionDetails) {
    try {
      const subscription = await this.subscriptionModel.create({
        ...subscriptionPlan,
      });

      await this.organisationService.updateOrganisation(
        subscription.organisation!,
        { subscription: subscription._id },
      );

      const amount = ORGANISATION_SUBSCRIPTION_DATA?.find(
        (i) => i.name === subscriptionPlan?.name,
      )?.price!;

      const invoiceDetails = {
      name: `${subscriptionPlan?.name} Subscription`,
      period: `${formatDateShort(subscriptionPlan?.startDate)} - ${formatDateShort(subscriptionPlan?.nextBillingDate)}`,
      status: "Paid",
      amount,
    }
   
      return { success: true, data:invoiceDetails };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  }

  async list(organisationId: string) {
    try {
      return await this.subscriptionModel.find({
        organisation: organisationId,
      });
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  }

  async findOne(filter: RootFilterQuery<Subscription>) {
    return await this.subscriptionModel.findOne(filter);
  }

  async updateSubscriptionStatus(
    subscriptionId: string,
    status: SubscriptionStatus,
    reason?: string,
  ) {
    if (!subscriptionId || !status) {
      throw new HttpException(
        'Request Body Incomplete',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.subscriptionModel.findByIdAndUpdate(
        { _id: subscriptionId },
        { $set: { status, ...(reason ? { cancellationReason: reason } : {}) } },
      );
      // await this.activityLogService.addLog({
      //   action: `Subscription Status Updated Successfully`,
      // });
      return { success: true, message: 'Email sent successfully' };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  }

  async findSubscription(organisationId: string, id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!organisationId || !id || !isValid) {
      throw new HttpException(
        'Request Body Incomplete',
        HttpStatus.BAD_REQUEST,
      );
    }

    const subscription = await this.findOne({ _id: id });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    if (subscription?.organisation?.toString() !== organisationId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return subscription;
  }

  //   async pauseSubscription(id:string){
  //     const targetSubscription = await this.subscriptionModel.findById(id)
  //     if(!targetSubscription){
  //         throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND)
  //     }
  //     await this.stripeService.pauseSubscription(targetSubscription.paymentSubscriptionId!)
  //   }
}
