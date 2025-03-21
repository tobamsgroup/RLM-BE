/* eslint-disable */ 
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { NotificationPreference, Organisation } from './organisation.schemas';
import { OrganisationDto, UpdateOrganisationDto } from './organisation.dto';
import { hashSync, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import {
  organisationCreationEmail,
  organisationPasswordResetEmail,
  organisationVerificationEmail,
} from 'utils/template';
import { MailService } from 'src/mail/mail.service';
import { NotificationType } from 'src/notifications/notification.schemas';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectModel(Organisation.name)
    private organisationModel: Model<Organisation>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async createOrganisation(organisationDto: OrganisationDto) {
    const isExist = await this.organisationModel.findOne({
      email: organisationDto.email?.toLowerCase(),
    });
    if (isExist) {
      throw new HttpException('Organisation Already Exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = hashSync(organisationDto.password, 10);
    const newOrganisation = await this.organisationModel.create({
      ...organisationDto,
      password: hashedPassword,
      email:organisationDto?.email?.toLowerCase()
    });
    
    const { password, ...targetOrganisationWithoutPassword } =
      newOrganisation.toObject();

    //Send creation and verification email
    const secret = this.configService.get('JWT_TOKEN');
    const token = sign(
      { token: targetOrganisationWithoutPassword._id },
      secret,
      { expiresIn: '24h' },
    );
    const link = `${this.configService.get('SITE_URL')}/verify-email?token=${token}`;
    try {
      const res = await this.mailService.sendEmail(
        targetOrganisationWithoutPassword.email,
        'Recycled Learning - Account Confirmation and Verification',
        organisationCreationEmail({
          name: targetOrganisationWithoutPassword.organisationName || 'User',
          verifyLink: link,
        }),
      );
      if (!res.success) {
        throw new HttpException('An Error Occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return targetOrganisationWithoutPassword;
    } catch (error) {
      throw new HttpException('An Error Occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOrganisation(
    id: string,
    updateOrganisationDto: UpdateOrganisationDto,
  ) {
    const updatedOrganisation = await this.organisationModel
      .findByIdAndUpdate(
        id,
        { $set: updateOrganisationDto }, // Updates only the provided fields
        { new: true, runValidators: true }, // Returns the updated document
      )
      .select('-password');

    if (!updatedOrganisation) {
      throw new NotFoundException(`Organisation with ID ${id} not found`);
    }

    return updatedOrganisation;
  }

  async googleAuth(email: string) {
    const isExist = await this.organisationModel
      .findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
      .select('-password');
    if (isExist) {
      return isExist;
    }

    const newOrganisation = await this.organisationModel.create({
      email:email?.toLowerCase(),
      country: '',
      isFirstTime: true,
      firstName: '',
      lastName: '',
      isVerified: true,
      mfaEnabled: false,
      isGoogleSignUp:true,
      organisationName: '',
      organisationUrl: '',
      password: '',
      phoneNumber: '',
      typeOfOrganisation: '',
    });

    const { password, ...targetOrganisationWithoutPassword } =
      newOrganisation.toObject();

    return targetOrganisationWithoutPassword;
  }

  async verifyEmail(token: string) {
    try {
      const decoded = verify(token, this.configService.get('JWT_TOKEN')!);
      return await this.organisationModel.findByIdAndUpdate(
        //@ts-ignore
        decoded.token,
        { isVerified: true },
        { new: true },
      );
    } catch (error) {
      throw new HttpException('An Error Occurred',HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listOrganisations() {
    return await this.organisationModel.find();
  }

  async getOrganisation(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }
    const targetOrganisation = await this.organisationModel
      .findById(id)
      .select('-password');
    if (!targetOrganisation) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }
    return targetOrganisation;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new HttpException('invalid Email or Password!', HttpStatus.BAD_REQUEST);
    }
    const targetOrganisation = await this.organisationModel
      .findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
      .select('-password');

    if (!targetOrganisation) {
      throw new HttpException('Organisation does not exist!', HttpStatus.NOT_FOUND);
    }

    if (!(await compare(password, targetOrganisation.password))) {
      throw new HttpException('Invalid Email Or Passowrd!', HttpStatus.BAD_REQUEST);
    }

    if (targetOrganisation.mfaEnabled) {
      //send mfa  link
    }
    return targetOrganisation;
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new HttpException('invalid Email!', HttpStatus.BAD_REQUEST);
    }

    const targetOrganisation = await this.organisationModel.findOne({ email:{ $regex: new RegExp(`^${email}$`, 'i') } });
    if (!targetOrganisation) {
      throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);
    }

    //send recovery link
    const secret = this.configService.get('JWT_TOKEN');
    const token = sign({ token: targetOrganisation._id }, secret, {
      expiresIn: '24h',
    });
    const link = `${this.configService.get('SITE_URL')}/create-new-password?token=${token}`;

    try {
      const res = await this.mailService.sendEmail(
        targetOrganisation.email,
        'Recycled Learning - Reset Account Password',
        organisationPasswordResetEmail({
          name: targetOrganisation.organisationName || 'User',
          resetLink: link,
        }),
      );
      if (!res.success) {
        throw new HttpException('An Error Occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return { message: 'Success' };
    } catch (error) {
      throw new HttpException('An Error Occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createNewPassword(password: string, token: string) {
    try {
      const decoded = verify(token, this.configService.get('JWT_TOKEN')!);
      const hashPassword = hashSync(password, 10);
      return await this.organisationModel.findByIdAndUpdate(
        //@ts-ignore
        decoded.token,
        { password: hashPassword },
        { new: true },
      );
    } catch (error) {
      throw new HttpException('An Error Occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resendVerificationLink(email: string) {

    if (!email) {
      throw new HttpException('Email not found', 400);
    }

    const targetOrganisation = await this.organisationModel.findOne({ email:{ $regex: new RegExp(`^${email}$`, 'i') } });

    if (!targetOrganisation) {
      throw new HttpException('Organisation not Found', 404);
    }
    const secret = this.configService.get('JWT_TOKEN');
    const token = sign({ token: targetOrganisation._id }, secret!, {
      expiresIn: '24h',
    });
    const link = `${this.configService.get('SITE_URL')}/verify-email?token=${token}`;
    try {
      const res = await this.mailService.sendEmail(
        targetOrganisation.email,
        'Recycled Learning - Verify Email',
        organisationVerificationEmail({
          name: targetOrganisation.organisationName || 'User',
          verifyLink: link,
        }),
      );
      if (!res.success) {
        throw new HttpException('An Error Occurred', 500);
      }
      return targetOrganisation;
    } catch (error) {
      throw new HttpException('An Error Occurred', 500);
    }
  }

  async updateNotificationPreferences(organisationId: string, preferences: Record<NotificationType, NotificationPreference>) {
    return this.organisationModel.findByIdAndUpdate(
      organisationId,
      { notificationPreferences: preferences },
      { new: true },
    );
  }

  async getNotificationPreferences(organisationId: string) {
    const organisation = await this.organisationModel.findById(organisationId).lean()
    return organisation?.notificationPreferences || {};
  }

  
}
