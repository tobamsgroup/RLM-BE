import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { organisationModels } from 'src/providers/organisation-models.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Resources, ResourcesSchema } from './resources.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Resources.name,
        schema: ResourcesSchema,
      },
    ])
 ],
  controllers: [ResourcesController],
  providers: [ResourcesService, organisationModels.resourcesModel],
})


export class  ResourcesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganisationMiddleware).forRoutes(ResourcesController);
  }
}
