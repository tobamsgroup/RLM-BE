import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, htmlContent: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html: htmlContent,
      });
      return { success: true, message: 'Email sent successfully' };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  }
}
