import {  Controller, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
    constructor (
        private readonly subscriptionService: SubscriptionService,
    ){}

    @Get('list')
    listSubscriptions(){
       return this.subscriptionService.list()
    }

    // @Get('pause')
    // pauseSubscription(@Param() {id}){
    //    return this.subscriptionService.pauseSubscription(id)
    // }
}
