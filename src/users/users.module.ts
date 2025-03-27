import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { organisationModels } from 'src/providers/organisation-models.provider';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { MailModule } from 'src/mail/mail.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
    SchoolModule
  ],
  controllers: [UsersController],
  providers: [UsersService, organisationModels.usersModel],
  exports: [UsersService, organisationModels.usersModel],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganisationMiddleware).forRoutes(UsersController);
  }
}

