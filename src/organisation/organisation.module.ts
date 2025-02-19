import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organisation, OrganisationSchema } from './organisation.schemas';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { GoogleStrategy } from 'src/strategy/google.strategy';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Organisation.name,
    schema: OrganisationSchema
  }])],
  controllers: [OrganisationController],
  providers: [OrganisationService, GoogleStrategy ],
})

export class OrganisationModule {}
