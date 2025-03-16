import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { SchoolService } from './school.service';

@Controller('school')
export class SchoolController {
    constructor (
        private readonly schoolService: SchoolService,
    ){}

    @Get()
    getSchool(){
       return this.schoolService.getSchools()
    }
}
