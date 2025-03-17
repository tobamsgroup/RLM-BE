import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Notification, NotificationType } from './notification.schemas';
import { Organisation } from 'src/organisation/organisation.schemas';
import { OrganisationService } from 'src/organisation/organisation.service';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_MODEL') private notificationModel: Model<Notification>,
    private organisationService: OrganisationService,
  ) {}

  async getNotifications() {
    return this.notificationModel.find();
  }

  async sendNotification( organisationId: string, type: NotificationType, data: any) {
    const organisation = await this.organisationService.getOrganisation(organisationId)
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
