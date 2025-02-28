import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnerModule } from './partner/partner.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganisationModule } from './organisation/organisation.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
