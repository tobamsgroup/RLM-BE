/* eslint-disable */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, RootFilterQuery, Types } from 'mongoose';
import {
  NotificationPreference,
  Organisation,
} from './schemas/organisation.schemas';
import {
  CreateBillingAddressDto,
  CreatePaymentMethodDto,
  OrganisationDto,
  UpdateOrganisationDto,
} from './organisation.dto';
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
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refreshToken.schemas';
import {v4} from 'uuid'


const TOKEN_TTL_LONG = 7
const TOKEN_TTL_SHORT = 2

@Injectable()
export class OrganisationService {
  constructor(
    @InjectModel(Organisation.name)
    private organisationModel: Model<Organisation>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
  ) {}

  async createOrganisation(organisationDto: OrganisationDto) {
    const isExist = await this.organisationModel.findOne({
      email: organisationDto.email?.toLowerCase(),
    });
    if (isExist) {
      throw new HttpException(
        'Organisation Already Exists',
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = hashSync(organisationDto.password, 10);
    const newOrganisation = await this.organisationModel.create({
      ...organisationDto,
      password: hashedPassword,
      email: organisationDto?.email?.toLowerCase(),
    });


    //Send creation and verification email
    const secret = this.configService.get('JWT_TOKEN');
    const token = sign(
      { token: newOrganisation._id },
      secret,
      { expiresIn: '24h' },
    );
    const link = `${this.configService.get('SITE_URL')}/verify-email?token=${token}`;
    try {
      const res = await this.mailService.sendEmail(
        newOrganisation.email,
        'Recycled Learning - Account Confirmation and Verification',
        organisationCreationEmail({
          name: newOrganisation.organisationName || 'User',
          verifyLink: link,
        }),
      );
      if (!res.success) {
        throw new HttpException(
          'An Error Occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {message:"succesful"}
    } catch (error) {
      throw new HttpException(
        'An Error Occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrganisation(
    id: Types.ObjectId,
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
      .select('-password').lean()
    if (isExist) {
      const tokens = await  this.generateTokens(isExist?._id!, false)
      return {...this.cleanOrganisationData(isExist), ...tokens}
    }

    const newOrganisation = await this.organisationModel.create({
      email: email?.toLowerCase(),
      country: '',
      isFirstTime: true,
      firstName: '',
      lastName: '',
      isVerified: true,
      mfaEnabled: false,
      isGoogleSignUp: true,
      organisationName: '',
      organisationUrl: '',
      password: '',
      phoneNumber: '',
      typeOfOrganisation: '',
    })

    const {password, paymentMethods, schools, subscription, billingAddress, country, ...cleanData} = newOrganisation.toObject()
    const tokens = await  this.generateTokens(newOrganisation?._id!, false)
    return {...cleanData, ...tokens}
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
      throw new HttpException(
        'An Error Occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      .findById(id).lean()
    if (!targetOrganisation) {
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }
    return targetOrganisation
  }

  async login(email: string, lpassword: string, remember:boolean = false) {
    if (!email || !lpassword) {
      throw new HttpException(
        'invalid Email or Password!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const targetOrganisation = await this.organisationModel
      .findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).lean()

    if (!targetOrganisation) {
      throw new HttpException(
        'Organisation does not exist!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!targetOrganisation.password) {
      throw new HttpException(
        'Please login via google.',
        HttpStatus.BAD_REQUEST,
      );
    }


    if (!(await compare(lpassword, targetOrganisation.password))) {
      throw new HttpException(
        'Invalid Email Or Passowrd!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (targetOrganisation.mfaEnabled) {
      //send mfa  link
    }

    const tokens = await  this.generateTokens(targetOrganisation?._id!, remember)
    return { ...this.cleanOrganisationData(targetOrganisation), ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new HttpException('Refresh Token is invalid', HttpStatus.BAD_REQUEST);
    }
    return this.generateTokens(token.organisationId, token.ttl === TOKEN_TTL_LONG, token.token!);
  }

  async generateTokens(organisationId:mongoose.Types.ObjectId, remember:boolean, staleRefreshToken?:string) {
    const accessToken = this.jwtService.sign({ organisationId }, { expiresIn: '3h' });
    let refreshToken = staleRefreshToken
    if(!staleRefreshToken){
      refreshToken = this.jwtService.sign({ organisationId });
      await this.storeRefreshToken(refreshToken, organisationId, remember);
    }
    return {
      accessToken,
      refreshToken: refreshToken,
    };
  }

  async storeRefreshToken(token: string,organisationId: mongoose.Types.ObjectId, remember:boolean) {
    const ttl = remember ? TOKEN_TTL_LONG : TOKEN_TTL_SHORT 
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + ttl);

    await this.RefreshTokenModel.updateOne(
      {organisationId },
      { $set: { expiryDate, token } },
      {
        upsert: true,
      },
    );
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new HttpException('invalid Email!', HttpStatus.BAD_REQUEST);
    }

    const targetOrganisation = await this.organisationModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    });
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
        throw new HttpException(
          'An Error Occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { message: 'Success' };
    } catch (error) {
      throw new HttpException(
        'An Error Occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'An Error Occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resendVerificationLink(email: string) {
    if (!email) {
      throw new HttpException('Email not found', 400);
    }

    const targetOrganisation = await this.organisationModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    });

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

  async updateNotificationPreferences(
    organisationId: string,
    preferences: Record<NotificationType, NotificationPreference>,
  ) {
    return this.organisationModel.findByIdAndUpdate(
      organisationId,
      { notificationPreferences: preferences },
      { new: true },
    );
  }

  async getNotificationPreferences(organisationId: string) {
    const organisation = await this.organisationModel
      .findById(organisationId)
      .lean();
    return organisation?.notificationPreferences || {};
  }

  //billing details
  async saveBillingDetails(
    organisationId: string,
    billingDetails: CreateBillingAddressDto,
  ) {
    if (!organisationId) {
      throw new HttpException(
        'Organisation Id Missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedOrganisation = await this.organisationModel.findOneAndUpdate(
      { _id: organisationId },
      { $set: { billingAddress: billingDetails } },
      { new: true, upsert: true },
    );

   return {message:"successful"}
  }

  //billing details
  async getBillingDetails(
    organisationId: string
  ) {
    console.log({organisationId})
    if (!organisationId) {
      throw new HttpException(
        'Organisation Id Missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const organisation = await this.getOrganisation(organisationId)
   return organisation?.billingAddress || {}
  }

  //payment
  async addPaymentMethod(organisationId: string, dto:any) {
    if (!organisationId) {
      throw new HttpException( 'Organisation Id Missing',  HttpStatus.BAD_REQUEST);
    }

    if (dto.isDefault) {
      await this.organisationModel.updateOne(
        { _id: organisationId, "paymentMethods.0": { $exists: true } },
        { $set: { "paymentMethods.$[].isDefault": false } }
      );
    }

    await  this.organisationModel.findByIdAndUpdate(
      organisationId,
      { $push: { paymentMethods: {id: v4() , ...dto} } },
      { new: true },
    );
    return {message:"successful"}
  }

  async deletePaymentMethod(organisationId: string, paymentMethodId: string) {
    if (!organisationId || !paymentMethodId) {
      throw new HttpException('Missing Id', HttpStatus.BAD_REQUEST);
    }
    await this.organisationModel.findByIdAndUpdate(
      organisationId,
      { $pull: { paymentMethods: { id: paymentMethodId } } },
      { new: true },
    );
    return {message:"successful"}
  }
  async fetchPaymentMethods(organisationId: string) {
    if (!organisationId) {
      throw new HttpException(
        'Organisation Id Missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const organisation = await this.organisationModel
      .findById(organisationId)
      .select('paymentMethods');
    return organisation?.paymentMethods || [];
  }

  async updatePaymentMethod(
    organisationId: string,
    paymentMethodId: string,
    updateData: Partial<CreatePaymentMethodDto>,
  ) {
    if (!organisationId || !paymentMethodId) {
      throw new HttpException('Missing Id', HttpStatus.BAD_REQUEST);
    }
    const updatedOrganisation = await this.organisationModel.findOneAndUpdate(
      { _id: organisationId, 'paymentMethods.id': paymentMethodId },
      {
        $set: {
          'paymentMethods.$': {id:paymentMethodId, ...updateData},
        },
      },
      { new: true },
    );

    return {message:"successful"}
  }

  async saveStripeCustomerId(organisationId:string, id:string){
    await this.organisationModel.findOneAndUpdate(
      { _id:organisationId}, 
      { $set: { stripeCustomerId:id} },
    )
  }

   async findOne(filter:RootFilterQuery<Organisation>) {
     return await this.organisationModel.findOne(filter)
   }

  cleanOrganisationData (organisation:mongoose.FlattenMaps<Organisation>){
    const {password, paymentMethods, schools, subscription, billingAddress, country, ...cleanData} = organisation
    console.log({cleanData})
    return cleanData
   }
}
