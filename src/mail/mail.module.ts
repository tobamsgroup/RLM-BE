import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.zoho.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get<string>('MAIL_ACCOUNT'),
            pass: config.get<string>('MAIL_PASSKEY'),
          },
        },
        defaults: {
          from: `Recycled Learning <${config.get<string>('MAIL_ACCOUNT')}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
