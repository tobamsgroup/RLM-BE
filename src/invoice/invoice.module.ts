import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganisationMiddleware } from 'src/midddlewares/organisation.middleware';
import { organisationModels } from 'src/providers/organisation-models.provider';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, organisationModels.invoiceModel],
  exports: [InvoiceService, organisationModels.invoiceModel],
})
export class InvoiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganisationMiddleware).forRoutes(InvoiceController);
  }
}
