import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { School } from './school.schemas';


@Injectable()
export class SchoolService {
    constructor (@Inject('SCHOOL_MODEL') private SchoolModel:Model<School>){}

    async getSchools() {
        return this.SchoolModel.find()
    }
}