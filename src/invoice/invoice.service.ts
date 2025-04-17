import { Inject, Injectable } from '@nestjs/common';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { Invoice } from './invoice.schema';
import { CreateInvoiceDto } from './invoice.dto';
import { exportDataAsFile } from 'utils/export';
import { ActivityLogsService } from 'src/activityLogs/activityLogs.service';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject('INVOICE_MODEL') private InvoiceModel: Model<Invoice>,
  ) {}

  async createInvoice(invoice: CreateInvoiceDto) {
    const number = await this.InvoiceModel.countDocuments()
    await this.InvoiceModel.create({
      ...invoice,
      number: number + 1
    });
  }

  async exportInvoice(type:'csv' | 'xls'){
    const allInvoice =  await this.InvoiceModel.find().lean()
    return await exportDataAsFile(allInvoice, type)
  }

  async listInvoices(){
  return await this.InvoiceModel.find().lean()
  }

  async findInvoice(id:Types.ObjectId){
  return await this.InvoiceModel.findById(id).lean()
  }
}
