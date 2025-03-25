import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import {
  CreateBillingAddressDto,
  CreatePaymentMethodDto,
  OrganisationDto,
  UpdateOrganisationDto,
} from './organisation.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Types } from 'mongoose';

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
  @UseGuards(AuthenticationGuard)
  async updateOrganisation(
    @Param('id') id: Types.ObjectId,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
  ) {
    return await this.organisationService.updateOrganisation(
      id,
      updateOrganisationDto,
    );
  }

  @Post('login')
  async login(@Body() { email, password, remember }) {
    console.log({email, password, remember})
    return this.organisationService.login(email, password, remember);
  }
  
  @Post('google/auth')
  async googleLogin(@Body() { email }) {
    return this.organisationService.googleAuth(email);
  }

  @Post('refresh-token')
  async refreshToken(@Body() { token }) {
    return this.organisationService.refreshTokens(token);
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
  async resendVerification(@Body() { email }) {
    return this.organisationService.resendVerificationLink(email);
  }

  @Post('notification/preferences/update')
  @UseGuards(AuthenticationGuard)
  async updateNotificationPreferences(@Body() { preferences }, @Req() req: Request) {
    return this.organisationService.updateNotificationPreferences(
      req['organisationId'],
      preferences,
    );
  }

  @Get('notification/preferences/:id')
  @UseGuards(AuthenticationGuard)
  async getNotificationPreferences(@Param('id') id: string) {
    return this.organisationService.getNotificationPreferences(id);
  }


  @Get('payment-method/list')
  @UseGuards(AuthenticationGuard)
  listPaymentMethod(@Req() req: Request) {
    return this.organisationService.fetchPaymentMethods(  req['organisationId']);
  }

  @Delete('payment-method/delete/:paymentMethodId')
  @UseGuards(AuthenticationGuard)
  removePaymentMethod(
    @Req() req: Request,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    return this.organisationService.deletePaymentMethod(
      req['organisationId'],
      paymentMethodId,
    );
  }

  //billing address
  @Put('billing-address/save')
  @UseGuards(AuthenticationGuard)
  saveBillingAddress(
    @Req() req: Request,
    @Body() billingAddress: CreateBillingAddressDto,
  ) {
    return this.organisationService.saveBillingDetails(
      req['organisationId'],
      billingAddress,
    );
  }

  //billing address
  @Get('billing-address/list')
  @UseGuards(AuthenticationGuard)
  getBillingAddress(
    @Req() req: Request,
  ) {
    return this.organisationService.getBillingDetails(req['organisationId'])
  }
}
