import { Parser as Json2CsvParser } from 'json2csv';
import * as ExcelJS from 'exceljs';
import { BadRequestException } from '@nestjs/common';


export async function exportDataAsFile<T extends object>(
    data: T[],
    type: 'csv' | 'xls',
  ): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    if (!data || data.length === 0) {
      throw new BadRequestException('No data to export')
    }
  
    const fields = Object.keys(data[0]);
  
    if (type === 'csv') {
      const json2csv = new Json2CsvParser({ fields });
      const csv = json2csv.parse(data);
      return {
        buffer: Buffer.from(csv, 'utf-8'),
        mimeType: 'text/csv',
        extension: 'csv',
      };
    }
  
    if (type === 'xls') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('ExportedData');
  
      worksheet.columns = fields.map((key) => ({ header: key, key }));
  
      data.forEach((item) => {
        worksheet.addRow(item);
      });
  
      const nodeBuffer = await workbook.xlsx.writeBuffer();
      return {
        buffer: Buffer.from(nodeBuffer), 
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
      };
    }
  
    throw new BadRequestException('Unsupported File Type')

  }