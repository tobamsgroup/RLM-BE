import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnerModule } from './partner/partner.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganisationModule } from './organisation/organisation.module';
import { MailModule } from './mail/mail.module';
import { SchoolModule } from './school/school.module';
import { NotificationModule } from './notifications/notification.module';
import {JwtModule} from '@nestjs/jwt'
import { StripeModule } from './stripe/stripe.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('MONGO_URI'),
      }),
      global:true,
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    PartnerModule,
    NewsletterModule,
    OrganisationModule,
    MailModule,
    SchoolModule,
    NotificationModule,
    StripeModule,
    SubscriptionModule,
    FileUploadModule,
    ResourcesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
