import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Newsletter } from './newsletter.schema';
import { Model } from 'mongoose';
import { NewsletterDto } from './newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(Newsletter.name) private newsletterModel: Model<Newsletter>,
  ) {}

  async subscribeToNewsletter(newsletterDto: NewsletterDto) {
    const isExist = await this.newsletterModel.findOne({
      email: newsletterDto.email,
    });
    if (isExist) {
      throw new HttpException('Email Already Added', 409);
    }
    const subscriber = new this.newsletterModel(newsletterDto);
    return await subscriber.save()
  }

  async listAllSubscriber () {
    return await this.newsletterModel.find()
  }
}
