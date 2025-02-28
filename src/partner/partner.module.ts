import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Partner, PartnerSchema } from './partner.schemas';
import { PartnerService } from './partner.service';
import { PartnersController } from './partner.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Partner.name,
        schema: PartnerSchema,
      },
    ]),
  ],
  controllers: [PartnersController],
  providers: [PartnerService],
})
export class PartnerModule {}
