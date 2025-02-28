import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organisation, OrganisationSchema } from './organisation.schemas';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organisation.name,
        schema: OrganisationSchema,
      },
    ]),
    MailModule,
  ],
  controllers: [OrganisationController],
  providers: [OrganisationService],
})
export class OrganisationModule {}
