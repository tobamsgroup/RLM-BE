import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Organisation } from './organisation.schemas';
import { OrganisationDto } from './organisation.dto';
import {hashSync, compare} from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectModel(Organisation.name) private organisationModel: Model<Organisation>,
    private readonly configService: ConfigService, 
  ) {}

  async createOrganisation(organisationDto: OrganisationDto) {
    const isExist = await this.organisationModel.findOne({
      email: organisationDto.email,
    });
    if (isExist) {
      throw new HttpException('Organisation Already Exists', 409);
    }
    const hashedPassword = hashSync(organisationDto.password, 10);
    const newOrganisation = await this.organisationModel.create({
        ...organisationDto,
        password: hashedPassword
    })
    //Send creation email
    const {password, ...targetOrganisationWithoutPassword } = newOrganisation.toObject();

    return targetOrganisationWithoutPassword
  }

  async listOrganisations() {
    return await this.organisationModel.find();
  }

  async getOrganisation(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Organisation not found', 404);
    }
    const targetOrganisation = await this.organisationModel.findById(id);
    if (!targetOrganisation) {
      throw new HttpException('Organisation not found', 404);
    }
    const {password, ...targetOrganisationWithoutPassword } = targetOrganisation.toObject();

    return targetOrganisationWithoutPassword
  }

  async login({email, password}:{email:string; password:string}) {
    if(!email || !password){
        throw new HttpException('invalid Email or Password!', 400);

    }
    const targetOrganisation = await this.organisationModel.findOne({email})
    if(!targetOrganisation){
        throw new HttpException('Organisation does not exist!', 404);
    }

    if(!(await compare(password, targetOrganisation.password))){
        throw new HttpException('Invalid Email Or Passowrd!', 400);
    }

    if(targetOrganisation.mfaEnabled){
        //send mfa  link
    }

    const {password:targetPassword, ...targetOrganisationWithoutPassword } = targetOrganisation.toObject();

    return targetOrganisationWithoutPassword

  }

  async forgotPassword(email:string){
    if(!email ){
        throw new HttpException('invalid Email!', 400);
    }

    const targetOrganisation = await this.organisationModel.findOne({email})
    if(!targetOrganisation){
        throw new HttpException('Email not found!', 404);
    }

    //send recovery link
    const secret = this.configService.get('JWT_TOKEN')
    const token = sign({ token: targetOrganisation._id }, secret!);
    const link = `${this.configService.get('SITE_URL')}/create-new-password?token=${token}`;

    //await sendEmail()

    return
  }

  async createNewPassword(password:string, token:string){
    try {
        const decoded = verify(token, this.configService.get('JWT_TOKEN')!);
        const hashPassword = hashSync(password, 10);
        //@ts-ignore
        return await this.organisationModel.findByIdAndUpdate(decoded.token, {password: hashPassword}, { new: true });
    } catch (error) {
        throw new HttpException('An Error Occured', 500);
    }

  }
}

