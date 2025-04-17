import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organisation,
  OrganisationSchema,
} from './schemas/organisation.schemas';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { MailModule } from 'src/mail/mail.module';
import { organisationConnectionProvider } from 'src/providers/organisation-connection.provider';
import { RefreshToken, RefreshTokenSchema } from './schemas/refreshToken.schemas';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';

@Global()
@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      {
        name: Organisation.name,
        schema: OrganisationSchema,
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]),
  ],
  controllers: [OrganisationController],
  providers: [OrganisationService, organisationConnectionProvider],
  exports: [OrganisationService, organisationConnectionProvider],
})
export class OrganisationModule {}