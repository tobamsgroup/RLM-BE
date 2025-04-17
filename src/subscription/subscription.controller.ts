import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('list')
  @UseGuards(AuthenticationGuard)
  listSubscriptions(@Req() req: Request) {
    return this.subscriptionService.list(req['organisationId']);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  findSubscription(@Req() req: Request, @Param('id') id:string) {
    return this.subscriptionService.findSubscription(req['organisationId'], id);
  }

  // @Get('pause')
  // pauseSubscription(@Param() {id}){
  //    return this.subscriptionService.pauseSubscription(id)
  // }
}
