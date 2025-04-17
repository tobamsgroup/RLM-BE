import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ActivityLogsService } from 'src/activityLogs/activityLogs.service';
import { Types } from 'mongoose';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private activityLogService: ActivityLogsService,
  ) {}

  @Get('export')
  @UseGuards(AuthenticationGuard)
  async export(@Query('type') type: 'csv' | 'xls', @Res() res: Response) {
    const { buffer, mimeType, extension } =
      await this.invoiceService.exportInvoice(type);
    await this.activityLogService.addLog({
      action: 'Invoice Exported Successfully',
    });

    const filename = `recycled-learning-invoices.${extension}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', mimeType);
    res.send(buffer);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async listInvoices() {
    return await this.invoiceService.listInvoices();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findInvoice(@Param('id') id: Types.ObjectId) {
    return await this.invoiceService.findInvoice(id);
  }
}
