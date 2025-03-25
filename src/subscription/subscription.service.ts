import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Subscription } from './subscription.schemas';
import { Model, RootFilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSubscriptionDto } from './subscription.dto';
import { OrganisationService } from 'src/organisation/organisation.service';
import { SubscriptionStatus } from 'src/common/enum';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private organisationService: OrganisationService,
    // private stripeService: StripeService
  ) {}

  async saveSubscription(subscriptionPlan: CreateSubscriptionDto) {
    try {
        const subscription = await this.subscriptionModel.findOneAndUpdate(
            { organisation: subscriptionPlan.organisation }, 
            { ...subscriptionPlan },
            { new: true, upsert: true } 
          );
          
          // Update the organisation with the subscription ID
          await this.organisationService.updateOrganisation(subscription.organisation, {
            subscription: subscription._id,
          })
       await this.organisationService.updateOrganisation(subscription.organisation!, {subscription:subscription._id})
      return { success: true, message: 'Email sent successfully' };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  }

  async list() {
    try {
      return  await this.subscriptionModel.find()
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  }

  async findOne(filter:RootFilterQuery<Subscription>) {
    return await this.subscriptionModel.findOne(filter)
  }

  async updateSubscriptionStatus(
    subscriptionId: string,
    status: SubscriptionStatus,
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
        { $set: { status } },
      );
      return { success: true, message: 'Email sent successfully' };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  }

//   async pauseSubscription(id:string){
//     const targetSubscription = await this.subscriptionModel.findById(id)
//     if(!targetSubscription){
//         throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND)
//     }
//     await this.stripeService.pauseSubscription(targetSubscription.paymentSubscriptionId!)
//   }
}
