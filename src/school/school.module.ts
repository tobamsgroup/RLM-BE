import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { SchoolSchema, School } from './school.schemas';
import { organisationModels } from 'src/providers/organisation-models.provider';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: School.name,
        schema: SchoolSchema,
      },
    ]),
    MailModule,
    NotificationModule
  ],
  controllers: [SchoolController],
  providers: [SchoolService, organisationModels.schoolModel, NotificationService],
})

export class SchoolModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(OrganisationMiddleware).forRoutes(SchoolController)
    }
}
