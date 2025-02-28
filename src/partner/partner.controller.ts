import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerDto } from './partner.dto';

@Controller('partners')
export class PartnersController {
  constructor(private partnerService: PartnerService) {}

  @Post('save')
  async savePartner(@Body() savePartnerDto: PartnerDto) {
    return await this.partnerService.savePartner(savePartnerDto);
  }

  @Get('list')
  async listPartners() {
    return await this.partnerService.listPartners();
  }

  @Get(':id')
  async getPartner(@Param('id') id: string) {
    return await this.partnerService.getPartner(id);
  }
}
