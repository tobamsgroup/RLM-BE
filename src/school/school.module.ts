import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { SchoolSchema, School } from './school.schemas';
import { organisationConnectionProvider } from 'src/providers/organisation-connection.provider';
import { organisationModels } from 'src/providers/organisation-models.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: School.name,
        schema: SchoolSchema,
      },
    ]),
    MailModule,
  ],
  controllers: [SchoolController],
  providers: [SchoolService, organisationModels.schoolModel],
})

export class SchoolModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(OrganisationMiddleware).forRoutes(SchoolController)
    }
}
