import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organisation, OrganisationSchema } from './organisation.schemas';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { MailModule } from 'src/mail/mail.module';
import { organisationConnectionProvider } from 'src/providers/organisation-connection.provider';

@Global()
@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      {
        name: Organisation.name,
        schema: OrganisationSchema,
      },
    ]),
  ],
  controllers: [OrganisationController],
  providers: [OrganisationService,  organisationConnectionProvider],
  exports:[OrganisationService, organisationConnectionProvider]
})
export class OrganisationModule {}
