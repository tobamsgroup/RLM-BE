import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterDto } from './newsletter.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribeToNewsletter(@Body() newsletterDto: NewsletterDto) {
    return await this.newsletterService.subscribeToNewsletter(newsletterDto);
  }

  @Get('list')
  listAllSubscribers() {
    return this.newsletterService.listAllSubscriber();
  }
}
