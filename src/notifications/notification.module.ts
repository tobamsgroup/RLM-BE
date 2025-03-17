import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { organisationModels } from 'src/providers/organisation-models.provider';
import { Notification, NotificationSchema } from './notification.schemas';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { OrganisationModule } from 'src/organisation/organisation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    MailModule 
 ],
  controllers: [NotificationController],
  providers: [NotificationService, organisationModels.notificationModel],
  exports:[NotificationService, organisationModels.notificationModel]
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganisationMiddleware).forRoutes(NotificationController);
  }
}
