import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './school.dto';

@Controller('school')
export class SchoolController {
    constructor (
        private readonly schoolService: SchoolService,
    ){}

    @Get('list')
    getSchool(){
       return this.schoolService.getSchools()
    }

    @Post('create')
    createSchool(@Body() schoolDto:CreateSchoolDto,     @Req() req: Request){
        if(req['organisationId'] !== schoolDto.organisation){
            throw new HttpException("Organisation Id doesn't match", HttpStatus.FORBIDDEN)
        }
        return this.schoolService.createSchool(schoolDto)
    }
}
