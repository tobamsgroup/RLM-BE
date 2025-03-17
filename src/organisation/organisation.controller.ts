import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationDto, UpdateOrganisationDto } from './organisation.dto';

@Controller('organisation')
export class OrganisationController {
  constructor(private organisationService: OrganisationService) {}

  @Post('create')
  async createOrganisation(@Body() organisationDto: OrganisationDto) {
    return await this.organisationService.createOrganisation(organisationDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() { token }) {
    return await this.organisationService.verifyEmail(token);
  }

  @Get('list')
  async listOrganisations() {
    return await this.organisationService.listOrganisations();
  }

  @Get(':id')
  async getOrganisation(@Param('id') id: string) {
    return await this.organisationService.getOrganisation(id);
  }

  @Patch('/update/:id')
  async updateOrganisation(
    @Param('id') id: string,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
  ) {
    return await this.organisationService.updateOrganisation(
      id,
      updateOrganisationDto,
    );
  }

  @Post('login')
  async login(@Body() { email, password }) {
    return this.organisationService.login(email, password);
  }
  @Post('google/auth')
  async googleLogin(@Body() { email }) {
    return this.organisationService.googleAuth(email);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }) {
    return this.organisationService.forgotPassword(email);
  }

  @Post('create-new-password')
  async createnewPassword(@Body() { password, token }) {
    return this.organisationService.createNewPassword(password, token);
  }

  @Post('resend-verification')
  async resendVerification(@Body() { email}) {
    return this.organisationService.resendVerificationLink(email);
  }

  @Post('notification/preferences/update')
  async updateNotificationPreferences(@Body() { organisationId, preferences}) {
    return this.organisationService.updateNotificationPreferences(organisationId, preferences);
  }

  @Get('notification/preferences/:id')
  async getNotificationPreferences( @Param('id') id: string,) {
    return this.organisationService.getNotificationPreferences(id);
  }
}
