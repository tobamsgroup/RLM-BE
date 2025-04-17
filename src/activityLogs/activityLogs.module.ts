import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { organisationModels } from 'src/providers/organisation-models.provider';
import { ActivityLogs, ActivityLogsSchema } from './activityLogs.schema';
import { ActivityLogsController } from './activityLogs.controller';
import { ActivityLogsService } from './activityLogs.service';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ActivityLogs.name,
        schema: ActivityLogsSchema,
      },
    ]),
  ],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService, organisationModels.activityLogsModel],
  exports: [ActivityLogsService, organisationModels.activityLogsModel],
})

export class ActivityLogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganisationMiddleware).forRoutes(ActivityLogsController);
  }
}
