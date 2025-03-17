import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Notification, NotificationType } from './notification.schemas';
import { Organisation } from 'src/organisation/organisation.schemas';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_MODEL')
    private notificationModel: Model<Notification>,
    private organisationModel: Model<Organisation>,
  ) {}

  async getNotifications() {
    return this.notificationModel.find();
  }

  async sendNotification( organisationId: string, type: NotificationType, data: any) {
    const organisation = await this.organisationModel.findById(organisationId)?.lean();
    const preferences = organisation?.notificationPreferences[type] || {
      inApp: true,
      email: false,
    };

    if (preferences.inApp) {
      await this.notificationModel.create({
        organisation: organisationId,
        type,
        data,
      });
    }

    if (preferences.email) {
      //send email
    }
  }
}
