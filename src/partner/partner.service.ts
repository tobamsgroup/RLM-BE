import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Partner } from './partner.schemas';
import mongoose, { Model } from 'mongoose';
import { PartnerDto } from './partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
  ) {}

  async savePartner(partnerDto: PartnerDto) {
    const isExist = await this.partnerModel.findOne({
      email: partnerDto.email,
    });
    if (isExist) {
      throw new HttpException('Partner Already Exists', 409);
    }
    const newPartner = new this.partnerModel(partnerDto);
    return await newPartner.save();
  }

  async listPartners() {
    return await this.partnerModel.find();
  }

  async getPartner(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('User not found', 404);
    }
    const targetPartner = await this.partnerModel.findById(id);
    if (!targetPartner) {
      throw new HttpException('User not found', 404);
    }
    return targetPartner;
  }
}
