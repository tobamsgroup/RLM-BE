import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationDto } from './organisation.dto';

@Controller('organisation')
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}

  @Post('create')
  async createOrganisation(@Body() organisationDto: OrganisationDto) {
    return await this.organisationService.createOrganisation(organisationDto);
  }

  @Get('list')
  async listOrganisations() {
    return await this.organisationService.listOrganisations();
  }

  @Get(':id')
  async getOrganisation(@Param('id') id: string) {
    return await this.organisationService.getOrganisation(id);
  }

  @Post('login')
  async login(@Body() { email, password }) {
    return this.organisationService.login({ email, password });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email}) {
    return this.organisationService.forgotPassword(email);
  }

  @Post('create-new-password')
  async createnewPassword(@Body() { email, token}) {
    return this.organisationService.createNewPassword(email, token);
  }
}
