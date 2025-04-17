import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Notification, NotificationType } from './notification.schemas';
import { Organisation } from 'src/organisation/schemas/organisation.schemas';
import { OrganisationService } from 'src/organisation/organisation.service';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_MODEL')
    private notificationModel: Model<Notification>,
    private organisationService: OrganisationService,
  ) {}

  async getNotifications() {
    const notifications = await this.notificationModel
    .find()
    .sort({ createdAt: -1 }); 
  
  return notifications || [];
  }

  async createNotification(
    organisationId: string,
    type: NotificationType,
    data: any,
  ) {
   await this.sendNotification(organisationId, type, data)
  }

  async sendNotification(
    organisationId: string,
    type: NotificationType,
    data: any,
  ) {
    const organisation =
      await this.organisationService.getOrganisation(organisationId);
    const preferences = organisation?.notificationPreferences?.[type] || {
      inApp: true,
      email: false,
    };


    if (preferences.inApp) {
     const notification = await this.notificationModel.create({
        organisation: organisationId,
        type,
        data,
      });

      return notification
    }



    if (preferences.email) {
      //send email
    }
  }

  async deleteNotifications(notificationIds:string[]){
    if(notificationIds?.length < 1) return
     await this.notificationModel.deleteMany({
      _id: { $in: notificationIds },
    });
  }
  async unreadCount(): Promise<number> {
    return await this.notificationModel.countDocuments({ read: false });
  }

  async markAllAsRead() {
    await this.notificationModel.updateMany(
      { read: false },
      { $set: { read: true } }
    );
  }
  
}
